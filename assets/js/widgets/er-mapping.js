/* ER-to-relational mapping stepper (widget V7).
   Steps through the mapping algorithm on an E-R diagram from er-diagram.js:
   strong entity sets, weak entity sets, 1:1 and 1:N relationships (foreign
   keys), M:N relationships (new tables) and multivalued attributes. At each
   step the construct being mapped is highlighted in the diagram and the new
   or changed table is highlighted in the schema. The last step shows the
   CREATE TABLE statements for MySQL.
   Markup: <div class="widget" data-widget="er-mapping" data-model="university"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  function build(m) {
    var er = D.er;
    var L = er.label;
    var frames = [];
    var tables = []; // { name, cols: [{ name, sql, pk, fk, notNull, isNew }], from }
    var done = {};
    var byEntity = {};

    function attrsOf(id) {
      return m.nodes.filter(function (a) { return a.of === id && a.type === "attr"; });
    }
    function keyCols(t) {
      return t.cols.filter(function (c) { return c.pk; });
    }
    function snap(step, on, msg, changed) {
      var mark = {};
      Object.keys(done).forEach(function (k) { mark[k] = "done"; });
      on.forEach(function (k) { mark[k] = "on"; });
      frames.push({
        step: step,
        msg: msg,
        mark: mark,
        changed: changed || [],
        tables: tables.map(function (t) {
          return { name: t.name, cols: t.cols.map(function (c) { return { name: c.name, pk: c.pk, fk: c.fk, isNew: c.isNew }; }) };
        })
      });
      tables.forEach(function (t) { t.cols.forEach(function (c) { c.isNew = false; }); });
      on.forEach(function (k) { done[k] = true; });
    }
    // Simple attributes, with composite attributes replaced by their parts.
    // Derived and multivalued attributes are left out.
    function simpleCols(id) {
      var out = [];
      var skipped = [];
      attrsOf(id).forEach(function (a) {
        var parts = attrsOf(a.id);
        if (a.derived) skipped.push(L(a) + " is derived, so it is not stored");
        else if (a.multi) skipped.push(L(a) + " is multivalued, so it gets its own table later");
        else if (parts.length) {
          parts.forEach(function (p) { out.push({ name: L(p), sql: p.sql, isNew: true }); });
          skipped.push("the composite " + L(a) + " is stored as its parts, " + D.wq.list(parts.map(L)));
        } else out.push({ name: L(a), sql: a.sql, pk: a.key === "pk", isNew: true });
      });
      return { cols: out, skipped: skipped };
    }

    frames.push({ step: 0, msg: "We start from the E-R diagram. Press Next to map it to tables one step at a time.", mark: {}, changed: [], tables: [] });

    // Step 1: strong entity sets.
    m.nodes.filter(function (n) { return n.type === "entity"; }).forEach(function (n) {
      var r = simpleCols(n.id);
      var t = { name: L(n), cols: r.cols, entity: n.id };
      tables.push(t);
      byEntity[n.id] = t;
      var keys = keyCols(t).map(function (c) { return c.name; });
      snap(1, [n.id].concat(attrsOf(n.id).map(function (a) { return a.id; })),
        "Step 1, strong entity set " + L(n) + ": make a table " + L(n) + " with its simple attributes. The key " + keys.join(", ") + " becomes the primary key" +
        (r.skipped.length ? ". Note: " + r.skipped.join("; ") + "." : "."), [t.name]);
    });

    // Step 2: weak entity sets.
    m.nodes.filter(function (n) { return n.type === "weak"; }).forEach(function (n) {
      var idRel = m.edges.filter(function (e) { return e.ent === n.id && er.nodeOf(m, e.rel).type === "identifying"; })[0];
      var ownerEdge = m.edges.filter(function (e) { return e.rel === idRel.rel && e.ent !== n.id; })[0];
      var owner = byEntity[ownerEdge.ent];
      var r = simpleCols(n.id);
      var partial = attrsOf(n.id).filter(function (a) { return a.key === "partial"; }).map(L);
      var cols = keyCols(owner).map(function (c) { return { name: c.name, sql: c.sql, pk: true, fk: owner.name, notNull: true, cascade: true, isNew: true }; });
      r.cols.forEach(function (c) { if (partial.indexOf(c.name) >= 0) c.pk = true; });
      var t = { name: L(n), cols: cols.concat(r.cols), entity: n.id };
      tables.push(t);
      byEntity[n.id] = t;
      snap(2, [n.id, idRel.rel].concat(attrsOf(n.id).map(function (a) { return a.id; })),
        "Step 2, weak entity set " + L(n) + ": make a table with its own attributes plus the primary key of its owner " + owner.name + ". The primary key is (" +
        keyCols(t).map(function (c) { return c.name; }).join(", ") + "): the owner's key + the partial key. " + keyCols(owner)[0].name +
        " is also a foreign key to " + owner.name + " with ON DELETE CASCADE. The identifying relationship " + idRel.rel + " needs no table of its own.", [t.name]);
    });

    // Steps 3 to 5: the other relationship sets.
    var rels = m.nodes.filter(function (n) { return n.type === "rel"; });
    function ends(rel) {
      return m.edges.filter(function (e) { return e.rel === rel.id; });
    }
    var oneOne = rels.filter(function (r) { var e = ends(r); return e[0].card === "1" && e[1].card === "1"; });
    var oneMany = rels.filter(function (r) { var e = ends(r); return (e[0].card === "1") !== (e[1].card === "1"); });
    var manyMany = rels.filter(function (r) { var e = ends(r); return e[0].card !== "1" && e[1].card !== "1"; });

    function addFk(rel, step) {
      var e = ends(rel);
      var many;
      var one;
      if (step === 3) {
        many = e[1].total && !e[0].total ? e[1] : e[0].total ? e[0] : e[1];
        one = many === e[0] ? e[1] : e[0];
      } else {
        many = e[0].card === "1" ? e[1] : e[0];
        one = many === e[0] ? e[1] : e[0];
      }
      var t = byEntity[many.ent];
      var ref = byEntity[one.ent];
      keyCols(ref).forEach(function (c) {
        var name = t.cols.some(function (x) { return x.name === c.name; }) ? rel.id + "_" + c.name : c.name;
        t.cols.push({ name: name, sql: c.sql, fk: ref.name, refCol: c.name, notNull: !!many.total, isNew: true });
      });
      var ra = attrsOf(rel.id);
      ra.forEach(function (a) { t.cols.push({ name: L(a), sql: a.sql, isNew: true }); });
      snap(step, [rel.id].concat(ra.map(function (a) { return a.id; })),
        (step === 3 ? "Step 3, 1 : 1 relationship " : "Step 4, 1 : N relationship ") + rel.id + ": no new table. Add the primary key of " + ref.name + " to " + t.name +
        " as a foreign key" + (step === 3 ? " (we pick " + t.name + (many.total ? ", the side with total participation" : "") + ")" : ", because " + t.name + " is on the many side") +
        "." + (many.total ? " Total participation makes it NOT NULL." : " Partial participation means it can be NULL.") +
        (ra.length ? " The relationship attribute " + D.wq.list(ra.map(L)) + " goes into " + t.name + " too." : ""), [t.name]);
    }
    oneOne.forEach(function (r) { addFk(r, 3); });
    oneMany.forEach(function (r) { addFk(r, 4); });
    manyMany.forEach(function (rel) {
      var cols = [];
      ends(rel).forEach(function (e) {
        var ref = byEntity[e.ent];
        keyCols(ref).forEach(function (c) {
          cols.push({ name: c.name, sql: c.sql, pk: true, fk: ref.name, refCol: c.name, notNull: true, isNew: true });
        });
      });
      var ra = attrsOf(rel.id);
      ra.forEach(function (a) { cols.push({ name: L(a), sql: a.sql, isNew: true }); });
      var t = { name: rel.id, cols: cols };
      tables.push(t);
      snap(5, [rel.id].concat(ra.map(function (a) { return a.id; })),
        "Step 5, M : N relationship " + rel.id + ": make a new table " + rel.id + " with the primary keys of both entity sets. Together they form its primary key, and each one is a foreign key." +
        (ra.length ? " The relationship attribute " + D.wq.list(ra.map(L)) + " is a column of this table." : ""), [t.name]);
    });

    // Step 6: multivalued attributes.
    m.nodes.filter(function (a) { return a.type === "attr" && a.multi; }).forEach(function (a) {
      var owner = byEntity[a.of];
      var cols = keyCols(owner).map(function (c) { return { name: c.name, sql: c.sql, pk: true, fk: owner.name, refCol: c.name, notNull: true, isNew: true }; });
      cols.push({ name: L(a), sql: a.sql, pk: true, isNew: true });
      var t = { name: owner.name + "_" + L(a), cols: cols };
      tables.push(t);
      snap(6, [a.id], "Step 6, multivalued attribute " + L(a) + ": make a new table " + t.name + " with the key of " + owner.name + " and the attribute. One row is stored for each value, and both columns form the primary key.", [t.name]);
    });

    frames.push({ step: 7, msg: "Done. The diagram became " + tables.length + " tables. Open “SQL for these tables” below to see the CREATE TABLE statements.", mark: done, changed: [], tables: frames[frames.length - 1].tables, final: true });
    return { frames: frames, tables: tables };
  }

  // CREATE TABLE statements, with each table after the tables it refers to.
  function sql(tables) {
    var left = tables.slice();
    var order = [];
    while (left.length) {
      var next = left.filter(function (t) {
        return t.cols.every(function (c) {
          return !c.fk || c.fk === t.name || order.some(function (o) { return o.name === c.fk; });
        });
      })[0] || left[0];
      order.push(next);
      left.splice(left.indexOf(next), 1);
    }
    return order.map(function (t) {
      var lines = t.cols.map(function (c) {
        return "  " + c.name + " " + (c.sql || "VARCHAR(40)") + (c.notNull && !c.pk ? " NOT NULL" : "");
      });
      var pk = t.cols.filter(function (c) { return c.pk; }).map(function (c) { return c.name; });
      lines.push("  PRIMARY KEY (" + pk.join(", ") + ")");
      t.cols.filter(function (c) { return c.fk; }).forEach(function (c) {
        lines.push("  FOREIGN KEY (" + c.name + ") REFERENCES " + c.fk + " (" + (c.refCol || c.name) + ")" + (c.cascade ? " ON DELETE CASCADE" : ""));
      });
      return "CREATE TABLE " + t.name + " (\n" + lines.join(",\n") + "\n);";
    }).join("\n\n");
  }

  var STEPS = ["Start", "Strong entity sets", "Weak entity sets", "1 : 1 relationships", "1 : N relationships", "M : N relationships", "Multivalued attributes", "Done"];

  function Widget(root) {
    var self = this;
    var esc = D.wq.esc;
    var key = D.er.MODELS[root.getAttribute("data-model")] ? root.getAttribute("data-model") : "university";
    this.uid = "map-" + Math.floor(Math.random() * 1e6);
    root.innerHTML =
      '<div class="widget-head"><strong>ER-to-relational mapping</strong></div>' +
      '<div class="widget-controls"><label class="wp-field wp-grow"><span>E-R diagram</span><select data-model>' +
      Object.keys(D.er.MODELS).map(function (k) {
        return '<option value="' + k + '"' + (k === key ? " selected" : "") + ">" + esc(D.er.MODELS[k].title) + "</option>";
      }).join("") + "</select></label></div>" +
      '<div class="widget-stage map-stage"><ol class="so-order map-steps" aria-label="Mapping steps"></ol>' +
      '<div class="map-er"></div><div class="map-cap">Relational schema (primary keys underlined, foreign keys in italics with →)</div><div class="map-tables"></div></div>' +
      '<div data-player></div>' +
      '<details class="ra-sql"><summary>SQL for these tables (MySQL)</summary><pre><code data-sql></code></pre></details>';
    this.stepsEl = root.querySelector(".map-steps");
    this.erEl = root.querySelector(".map-er");
    this.tablesEl = root.querySelector(".map-tables");
    this.sqlEl = root.querySelector("[data-sql]");
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (f) {
        self.render(f);
      },
      resetLabel: "Start again",
      onReset: function () {
        self.player.load(self.res.frames, false);
      }
    });
    root.querySelector("[data-model]").addEventListener("change", function (ev) {
      self.load(ev.target.value);
    });
    this.load(key);
  }

  Widget.prototype.load = function (key) {
    this.m = D.er.MODELS[key];
    this.res = build(this.m);
    var used = {};
    this.res.frames.forEach(function (f) { used[f.step] = true; });
    this.steps = STEPS.map(function (s, i) { return { n: i, s: s }; }).filter(function (x) { return used[x.n]; });
    this.sqlEl.textContent = sql(this.res.tables);
    this.player.load(this.res.frames, false);
  };

  Widget.prototype.render = function (f) {
    var esc = D.wq.esc;
    var at = -1;
    this.steps.forEach(function (s, i) { if (s.n === f.step) at = i; });
    this.stepsEl.innerHTML = this.steps.map(function (s, i) {
      return '<li class="' + (i === at ? "is-on" : i < at ? "is-done" : "") + '">' + esc(s.s) + "</li>";
    }).join("");
    this.erEl.innerHTML = D.er.draw(this.m, { mark: f.mark, titleId: this.uid });
    this.tablesEl.innerHTML = f.tables.length ? f.tables.map(function (t) {
      var ch = f.changed.indexOf(t.name) >= 0;
      return '<div class="map-table' + (ch ? " is-changed" : "") + '"><span class="map-name">' + esc(t.name) + "</span> (" + t.cols.map(function (c) {
        var txt = esc(c.name);
        if (c.pk) txt = "<u>" + txt + "</u>";
        if (c.fk) txt = "<em>" + txt + " → " + esc(c.fk) + "</em>";
        return '<span class="map-col' + (c.isNew ? " is-new" : "") + '">' + txt + "</span>";
      }).join(", ") + ")</div>";
    }).join("") : '<p class="muted">No tables yet.</p>';
  };

  D.erMapping = { build: build, sql: sql };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="er-mapping"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
