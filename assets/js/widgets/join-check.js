/* Projection and join checker (part of widget V9, used for 4NF and 5NF).
   Shows a table with real rows, splits it into the chosen parts, joins the
   parts back and marks any spurious rows. The student can switch rows off to
   see a multivalued or join dependency stop holding. Needs player.js.
   Markup: <div class="widget" data-widget="join-check" data-preset="0"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  // rows marked off: true start switched off.
  var PRESETS = [
    {
      label: "Student(sid, course, skill)",
      name: "Student",
      attrs: ["sid", "course", "skill"],
      rows: [
        ["1", "C", "English"],
        ["1", "C", "German"],
        ["1", "Java", "English"],
        ["1", "Java", "German"],
        ["2", "C", "Tamil"]
      ],
      mvd: { l: ["sid"], r: ["course"] },
      splits: [
        { label: "(sid, course) and (sid, skill)", parts: [["sid", "course"], ["sid", "skill"]] },
        { label: "(sid, course) and (course, skill)", parts: [["sid", "course"], ["course", "skill"]] }
      ]
    },
    {
      label: "Course(course, teacher, book)",
      name: "Course",
      attrs: ["course", "teacher", "book"],
      rows: [
        ["DBMS", "Ravi", "Korth"],
        ["DBMS", "Ravi", "Navathe"],
        ["DBMS", "Meena", "Korth"],
        ["DBMS", "Meena", "Navathe"],
        ["OS", "Ravi", "Galvin"]
      ],
      mvd: { l: ["course"], r: ["teacher"] },
      splits: [
        { label: "(course, teacher) and (course, book)", parts: [["course", "teacher"], ["course", "book"]] },
        { label: "(course, teacher) and (teacher, book)", parts: [["course", "teacher"], ["teacher", "book"]] }
      ]
    },
    {
      label: "Supply(seller, company, product)",
      name: "Supply",
      attrs: ["seller", "company", "product"],
      rows: [
        ["Ravi", "Godrej", "AC"],
        ["Ravi", "LG", "Fridge"],
        ["Kumar", "Godrej", "Fridge"],
        ["Ravi", "Godrej", "Fridge"]
      ],
      mvd: { l: ["seller"], r: ["company"] },
      note: "With these rows no non-trivial MVD holds, so the table is in 4NF. Its rule is a join dependency on three parts.",
      splits: [
        { label: "Three parts: (seller, company), (company, product), (seller, product)", parts: [["seller", "company"], ["company", "product"], ["seller", "product"]] },
        { label: "Two parts: (seller, company) and (company, product)", parts: [["seller", "company"], ["company", "product"]] },
        { label: "Two parts: (seller, company) and (seller, product)", parts: [["seller", "company"], ["seller", "product"]] }
      ]
    }
  ];

  function Widget(root) {
    var self = this;
    var esc = D.wq.esc;
    var start = Number(root.getAttribute("data-preset")) || 0;
    root.innerHTML =
      '<div class="widget-head"><strong>Split and join checker</strong></div>' +
      '<div class="widget-controls fdc-setup">' +
      '<label class="wp-field wp-grow"><span>Table</span><select data-preset>' +
      PRESETS.map(function (p, i) { return '<option value="' + i + '">' + esc(p.label) + "</option>"; }).join("") +
      "</select></label>" +
      '<label class="wp-field wp-grow"><span>Split into</span><select data-split></select></label>' +
      '<fieldset class="jc-rows"><legend>Rows in the table (switch one off to break the dependency)</legend><div data-rows></div></fieldset>' +
      "</div>" +
      '<div class="widget-stage jc-stage"></div>' +
      "<div data-player></div>";
    this.el = {
      preset: root.querySelector("[data-preset]"),
      split: root.querySelector("[data-split]"),
      rows: root.querySelector("[data-rows]"),
      stage: root.querySelector(".jc-stage")
    };
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (f) { self.el.stage.innerHTML = f.html; },
      resetLabel: "Start again",
      onReset: function () { self.player.load(self.frames, false); }
    });
    this.el.preset.addEventListener("change", function () { self.usePreset(Number(self.el.preset.value)); });
    this.el.split.addEventListener("change", function () { self.run(); });
    this.el.rows.addEventListener("change", function () { self.run(); });
    this.usePreset(PRESETS[start] ? start : 0);
  }

  Widget.prototype.usePreset = function (i) {
    var esc = D.wq.esc;
    var p = PRESETS[i];
    this.p = p;
    this.el.preset.value = String(i);
    this.el.split.innerHTML = p.splits.map(function (s, k) { return '<option value="' + k + '">' + esc(s.label) + "</option>"; }).join("");
    this.el.rows.innerHTML = p.rows.map(function (r, k) {
      return '<label class="jc-row"><input type="checkbox" checked value="' + k + '"> <span>' + esc(r.join(", ")) + "</span></label>";
    }).join("");
    this.run();
  };

  Widget.prototype.run = function () {
    var p = this.p;
    var on = [].slice.call(this.el.rows.querySelectorAll("input")).filter(function (c) { return c.checked; }).map(function (c) { return p.rows[Number(c.value)]; });
    this.frames = build(p, on, p.splits[Number(this.el.split.value) || 0].parts);
    this.player.load(this.frames, false);
  };

  function key(r) {
    return JSON.stringify(r);
  }

  function project(attrs, rows, part) {
    var idx = part.map(function (a) { return attrs.indexOf(a); });
    var seen = {};
    var out = [];
    rows.forEach(function (r) {
      var t = idx.map(function (i) { return r[i]; });
      if (!seen[key(t)]) {
        seen[key(t)] = true;
        out.push(t);
      }
    });
    return out;
  }

  // Natural join of the parts, as rows over attrs.
  function joinAll(attrs, parts, data) {
    var cur = data[0].map(function (t) {
      var o = {};
      parts[0].forEach(function (a, i) { o[a] = t[i]; });
      return o;
    });
    var have = parts[0].slice();
    for (var k = 1; k < parts.length; k++) {
      var next = [];
      var part = parts[k];
      cur.forEach(function (o) {
        data[k].forEach(function (t) {
          var ok = part.every(function (a, i) { return have.indexOf(a) < 0 || o[a] === t[i]; });
          if (!ok) return;
          var n = {};
          Object.keys(o).forEach(function (a) { n[a] = o[a]; });
          part.forEach(function (a, i) { n[a] = t[i]; });
          next.push(n);
        });
      });
      part.forEach(function (a) { if (have.indexOf(a) < 0) have.push(a); });
      cur = next;
    }
    var seen = {};
    var out = [];
    cur.forEach(function (o) {
      var r = attrs.map(function (a) { return o[a]; });
      if (!seen[key(r)]) {
        seen[key(r)] = true;
        out.push(r);
      }
    });
    return out;
  }

  // X →→ Y holds if, for any two rows that agree on X, the row that takes
  // X and Y from the first and the rest from the second is also present.
  function mvdHolds(attrs, rows, mvd) {
    var set = {};
    rows.forEach(function (r) { set[key(r)] = true; });
    var xi = mvd.l.map(function (a) { return attrs.indexOf(a); });
    var yi = mvd.r.map(function (a) { return attrs.indexOf(a); });
    for (var i = 0; i < rows.length; i++) {
      for (var j = 0; j < rows.length; j++) {
        var a = rows[i];
        var b = rows[j];
        if (!xi.every(function (c) { return a[c] === b[c]; })) continue;
        var t = b.map(function (v, c) { return xi.indexOf(c) >= 0 || yi.indexOf(c) >= 0 ? a[c] : v; });
        if (!set[key(t)]) return { ok: false, a: a, b: b, missing: t };
      }
    }
    return { ok: true };
  }

  function table(cap, cols, rows, extra) {
    var esc = D.wq.esc;
    return '<div class="nz-card"><div class="nz-name">' + esc(cap) + '</div><div class="so-scroll"><table class="so-table nz-tab"><caption class="visually-hidden">' + esc(cap) + "</caption><thead><tr>" +
      cols.map(function (a) { return '<th scope="col">' + esc(a) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      rows.map(function (r) {
        var bad = extra && extra[key(r)];
        return "<tr" + (bad ? ' class="jc-extra"' : "") + ">" + r.map(function (v) { return "<td>" + esc(v) + "</td>"; }).join("") + "</tr>";
      }).join("") + "</tbody></table></div></div>";
  }

  function build(p, rows, parts) {
    var esc = D.wq.esc;
    var frames = [];
    var attrs = p.attrs;
    var orig = table(p.name + " (" + rows.length + " rows)", attrs, rows);
    var mvd = mvdHolds(attrs, rows, p.mvd);
    var mText = p.mvd.l.join(", ") + " →→ " + p.mvd.r.join(", ");
    frames.push({
      msg: "The table has " + rows.length + " rows. " + (mvd.ok ? "The multivalued dependency " + mText + " holds: for each " + p.mvd.l.join(", ") + ", every " + p.mvd.r.join(", ") + " value appears with every value of the other attribute." :
        mText + " does not hold: the row (" + mvd.missing.join(", ") + ") would be needed for that.") + (p.note && rows.length === p.rows.length ? " " + p.note : ""),
      html: '<div class="nz-cards">' + orig + "</div>"
    });
    if (!rows.length) return frames;
    var data = parts.map(function (part) { return project(attrs, rows, part); });
    parts.forEach(function (part, k) {
      frames.push({
        msg: "Project onto (" + part.join(", ") + "). Duplicate rows collapse, so this part has " + data[k].length + " rows.",
        html: '<div class="nz-cards">' + orig + data.slice(0, k + 1).map(function (d, i) { return table("R" + (i + 1) + "(" + parts[i].join(", ") + ")", parts[i], d); }).join("") + "</div>"
      });
    });
    var joined = joinAll(attrs, parts, data);
    var inTable = {};
    rows.forEach(function (r) { inTable[key(r)] = true; });
    var extra = {};
    var n = 0;
    joined.forEach(function (r) {
      if (!inTable[key(r)]) {
        extra[key(r)] = true;
        n++;
      }
    });
    var name = "R1 ⋈ " + parts.slice(1).map(function (_, i) { return "R" + (i + 2); }).join(" ⋈ ");
    frames.push({
      msg: "Natural join of the parts gives " + joined.length + " rows. " + (n ? n + " of them " + (n > 1 ? "were" : "was") + " never in the table (highlighted). These are spurious rows, so this split is lossy for this data." :
        "They are exactly the original rows, so this split is lossless for this data."),
      html: '<div class="nz-cards">' + table(p.name + " (original)", attrs, rows) + table(name, attrs, joined, extra) + "</div>" +
        '<p class="dc-sum"><span class="kf-verdict ' + (n ? "kf-no" : "kf-candidate") + '">' + (n ? n + " spurious row" + (n > 1 ? "s" : "") : "Lossless") + "</span></p>"
    });
    return frames;
  }

  D.joinCheck = { build: build, joinAll: joinAll, project: project, mvdHolds: mvdHolds, PRESETS: PRESETS };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="join-check"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
