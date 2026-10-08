/* Set operations and aggregates (widget V12).
   data-mode="set": runs UNION, UNION ALL, INTERSECT or EXCEPT on two small
   tables and shows how duplicates are handled.
   data-mode="agg": applies COUNT, SUM, AVG, MIN or MAX to PRODUCT_MAST,
   with an optional WHERE and GROUP BY, and shows each group's values.
   Needs player.js.
   Markup: <div class="widget" data-widget="set-agg" data-mode="set"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  var SETS = [
    {
      label: "First and Second (ID, NAME)",
      a: "First", b: "Second", cols: ["ID", "NAME"],
      rowsA: [[1, "Jack"], [2, "Harry"], [3, "Jackson"]],
      rowsB: [[3, "Jackson"], [4, "Stephan"], [5, "David"]]
    },
    {
      label: "Depositor and Borrower (name), with repeats",
      a: "Depositor", b: "Borrower", cols: ["name"],
      rowsA: [["Asha"], ["Ravi"], ["Meena"], ["Ravi"]],
      rowsB: [["Ravi"], ["Kumar"], ["Asha"]]
    }
  ];

  var OPS = ["UNION", "UNION ALL", "INTERSECT", "EXCEPT"];

  var PROD_COLS = ["PRODUCT", "COMPANY", "QTY", "RATE", "COST"];
  var PRODUCTS = [
    ["Item1", "Com1", 2, 10, 20],
    ["Item2", "Com2", 3, 25, 75],
    ["Item3", "Com1", 2, 30, 60],
    ["Item4", "Com3", 5, 10, 50],
    ["Item5", "Com2", 2, 20, 40],
    ["Item6", "Com1", 3, 25, 75],
    ["Item7", "Com1", 5, 30, 150],
    ["Item8", "Com1", 3, 10, 30],
    ["Item9", "Com2", 2, 25, 50],
    ["Item10", "Com3", 4, 30, 120]
  ];
  var FUNCS = ["COUNT(*)", "COUNT", "COUNT DISTINCT", "SUM", "AVG", "MIN", "MAX"];
  var WHERES = [
    { label: "No WHERE", text: "", test: null },
    { label: "WHERE RATE >= 20", text: "RATE >= 20", test: function (r) { return r[3] >= 20; } },
    { label: "WHERE QTY > 3", text: "QTY > 3", test: function (r) { return r[2] > 3; } }
  ];

  function key(r) {
    return JSON.stringify(r);
  }

  function setOp(op, A, B) {
    var inB = {};
    B.forEach(function (r) { inB[key(r)] = true; });
    var inA = {};
    A.forEach(function (r) { inA[key(r)] = true; });
    var seen = {};
    var distinct = function (rows) {
      return rows.filter(function (r) {
        if (seen[key(r)]) return false;
        seen[key(r)] = true;
        return true;
      });
    };
    if (op === "UNION ALL") return A.concat(B);
    if (op === "UNION") return distinct(A.concat(B));
    if (op === "INTERSECT") return distinct(A.filter(function (r) { return inB[key(r)]; }));
    return distinct(A.filter(function (r) { return !inB[key(r)]; }));
  }

  function aggregate(fn, col, rows) {
    var i = PROD_COLS.indexOf(col);
    var vals = rows.map(function (r) { return r[i]; });
    if (fn === "COUNT(*)") return rows.length;
    if (fn === "COUNT") return vals.filter(function (v) { return v !== null; }).length;
    if (fn === "COUNT DISTINCT") return Object.keys(vals.reduce(function (o, v) { if (v !== null) o[key(v)] = 1; return o; }, {})).length;
    if (!vals.length) return null;
    if (fn === "SUM") return vals.reduce(function (s, v) { return s + v; }, 0);
    if (fn === "AVG") return Math.round(vals.reduce(function (s, v) { return s + v; }, 0) / vals.length * 10000) / 10000;
    var sorted = vals.slice().sort(function (x, y) { return x < y ? -1 : x > y ? 1 : 0; });
    return fn === "MIN" ? sorted[0] : sorted[sorted.length - 1];
  }

  function fnText(fn, col) {
    if (fn === "COUNT(*)") return "COUNT(*)";
    if (fn === "COUNT DISTINCT") return "COUNT(DISTINCT " + col + ")";
    return fn + "(" + col + ")";
  }

  function table(cap, cols, rows, cls) {
    var esc = D.wq.esc;
    return '<div class="nz-card"><div class="nz-name">' + esc(cap) + '</div><div class="so-scroll"><table class="so-table nz-tab"><caption class="visually-hidden">' + esc(cap) + "</caption><thead><tr>" +
      cols.map(function (c) { return '<th scope="col">' + esc(c) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      (rows.length ? rows.map(function (r, i) {
        var c = cls ? cls(r, i) : "";
        return "<tr" + (c ? ' class="' + c + '"' : "") + ">" + r.map(function (v) { return "<td>" + (v === null ? "NULL" : esc(v)) + "</td>"; }).join("") + "</tr>";
      }).join("") : '<tr><td colspan="' + cols.length + '" class="muted">(no rows)</td></tr>') + "</tbody></table></div></div>";
  }

  function sqlBox(text) {
    return '<pre class="sa-sql"><code>' + D.wq.esc(text) + "</code></pre>";
  }

  function buildSet(p, op) {
    var frames = [];
    var A = p.rowsA;
    var B = p.rowsB;
    var all = A.concat(B);
    var res = setOp(op, A, B);
    var inB = {};
    B.forEach(function (r) { inB[key(r)] = true; });
    var sql = "SELECT * FROM " + p.a + "\n" + op + "\nSELECT * FROM " + p.b + ";";
    var both = '<div class="nz-cards">' + table(p.a, p.cols, A, function (r) { return inB[key(r)] ? "sa-both" : ""; }) + table(p.b, p.cols, B, function (r) { return A.some(function (x) { return key(x) === key(r); }) ? "sa-both" : ""; }) + "</div>";
    frames.push({
      msg: "Both queries return " + p.cols.length + " column" + (p.cols.length > 1 ? "s" : "") + " of the same types, so they can be combined. Rows found in both tables are highlighted.",
      html: sqlBox(sql) + both
    });
    if (op === "UNION ALL" || op === "UNION") {
      frames.push({
        msg: "Put the rows of " + p.a + " and then the rows of " + p.b + " together: " + all.length + " rows." + (op === "UNION ALL" ? " UNION ALL stops here and keeps every duplicate." : ""),
        html: sqlBox(sql) + '<div class="nz-cards">' + table("All rows", p.cols, all) + "</div>"
      });
      if (op === "UNION") {
        var seen = {};
        frames.push({
          msg: "UNION removes duplicates. The rows marked are copies of a row above them, so they are dropped. " + res.length + " rows remain.",
          html: sqlBox(sql) + '<div class="nz-cards">' + table("All rows", p.cols, all, function (r) {
            if (seen[key(r)]) return "is-drop";
            seen[key(r)] = true;
            return "";
          }) + "</div>"
        });
      }
    } else {
      var keep = op === "INTERSECT";
      var seen2 = {};
      frames.push({
        msg: keep ? "INTERSECT keeps each row of " + p.a + " that also appears in " + p.b + ", once." : "EXCEPT keeps each row of " + p.a + " that does not appear in " + p.b + ", once. Rows found in " + p.b + " are dropped.",
        html: sqlBox(sql) + '<div class="nz-cards">' + table(p.a, p.cols, A, function (r) {
          var hit = !!inB[key(r)];
          if (hit !== keep || seen2[key(r)]) return "is-drop";
          seen2[key(r)] = true;
          return "sa-keep";
        }) + table(p.b, p.cols, B) + "</div>"
      });
    }
    frames.push({
      msg: "Result of " + op + ": " + res.length + " row" + (res.length === 1 ? "" : "s") + "." + (op === "UNION ALL" ? "" : " The SQL standard does not promise any order; add ORDER BY if you need one."),
      html: sqlBox(sql) + '<div class="nz-cards">' + table("Result", p.cols, res) + "</div>"
    });
    return frames;
  }

  function buildAgg(fn, col, where, group) {
    var frames = [];
    var esc = D.wq.esc;
    var f = fnText(fn, col);
    var sql = "SELECT " + (group ? "COMPANY, " : "") + f + "\nFROM PRODUCT_MAST" + (where.text ? "\nWHERE " + where.text : "") + (group ? "\nGROUP BY COMPANY" : "") + ";";
    frames.push({
      msg: "Start with all " + PRODUCTS.length + " rows of PRODUCT_MAST.",
      html: sqlBox(sql) + '<div class="nz-cards">' + table("PRODUCT_MAST", PROD_COLS, PRODUCTS) + "</div>"
    });
    var rows = PRODUCTS;
    if (where.test) {
      rows = PRODUCTS.filter(where.test);
      frames.push({
        msg: "WHERE " + where.text + " runs first and removes " + (PRODUCTS.length - rows.length) + " rows. " + rows.length + " rows are left. Aggregates only see these rows.",
        html: sqlBox(sql) + '<div class="nz-cards">' + table("PRODUCT_MAST", PROD_COLS, PRODUCTS, function (r) { return where.test(r) ? "" : "is-drop"; }) + "</div>"
      });
    }
    var ci = PROD_COLS.indexOf(col);
    var groups;
    if (group) {
      var names = [];
      rows.forEach(function (r) { if (names.indexOf(r[1]) < 0) names.push(r[1]); });
      names.sort();
      groups = names.map(function (n) { return { name: n, rows: rows.filter(function (r) { return r[1] === n; }) }; });
      frames.push({
        msg: "GROUP BY COMPANY puts rows with the same company into one group: " + groups.map(function (g) { return g.name + " (" + g.rows.length + " rows)"; }).join(", ") + ".",
        html: sqlBox(sql) + '<div class="nz-cards">' + table("Groups", PROD_COLS, rows.slice().sort(function (x, y) { return x[1] < y[1] ? -1 : x[1] > y[1] ? 1 : 0; }), function (r) { return "so-g" + (names.indexOf(r[1]) % 3); }) + "</div>"
      });
    } else {
      groups = [{ name: null, rows: rows }];
    }
    var out = groups.map(function (g) { return { name: g.name, value: aggregate(fn, col, g.rows), vals: g.rows.map(function (r) { return r[ci]; }) }; });
    var how = function (o) {
      if (fn === "COUNT(*)") return "count the rows: " + o.vals.length;
      if (fn === "COUNT") return "count the non-NULL values of " + col + ": " + o.value;
      if (fn === "COUNT DISTINCT") return "count the different values of " + col + " (" + o.vals.filter(function (v, i, a) { return a.indexOf(v) === i; }).join(", ") + "): " + o.value;
      if (fn === "SUM") return o.vals.join(" + ") + " = " + o.value;
      if (fn === "AVG") return "(" + o.vals.join(" + ") + ") ÷ " + o.vals.length + " = " + o.value;
      return fn + " of " + o.vals.join(", ") + " = " + o.value;
    };
    frames.push({
      msg: (group ? "Apply " + f + " to each group. " : "Apply " + f + " to all the rows at once. ") + out.map(function (o) { return (o.name ? o.name + ": " : "") + how(o); }).join("; ") + ".",
      html: sqlBox(sql) + '<ul class="sa-work">' + out.map(function (o) { return "<li>" + (o.name ? "<strong>" + esc(o.name) + ":</strong> " : "") + esc(how(o)) + "</li>"; }).join("") + "</ul>"
    });
    var cols = group ? ["COMPANY", f] : [f];
    frames.push({
      msg: group ? "The result has one row per group." : "An aggregate without GROUP BY returns a single row.",
      html: sqlBox(sql) + '<div class="nz-cards">' + table("Result", cols, out.map(function (o) { return group ? [o.name, o.value] : [o.value]; })) + "</div>"
    });
    return frames;
  }

  function Widget(root) {
    var self = this;
    var esc = D.wq.esc;
    this.mode = root.getAttribute("data-mode") === "agg" ? "agg" : "set";
    var opts = function (list, lab) { return list.map(function (x, i) { return '<option value="' + i + '">' + esc(lab ? lab(x) : x) + "</option>"; }).join(""); };
    var controls = this.mode === "set" ?
      '<label class="wp-field wp-grow"><span>Tables</span><select data-a>' + opts(SETS, function (s) { return s.label; }) + "</select></label>" +
      '<label class="wp-field"><span>Operation</span><select data-b>' + opts(OPS) + "</select></label>" :
      '<label class="wp-field"><span>Function</span><select data-a>' + opts(FUNCS, function (x) { return x === "COUNT DISTINCT" ? "COUNT(DISTINCT …)" : x === "COUNT(*)" ? x : x + "(…)"; }) + "</select></label>" +
      '<label class="wp-field"><span>Column</span><select data-b>' + ["COMPANY", "QTY", "RATE", "COST"].map(function (c) { return '<option value="' + c + '">' + c + "</option>"; }).join("") + "</select></label>" +
      '<label class="wp-field"><span>Filter</span><select data-c>' + opts(WHERES, function (w) { return w.label; }) + "</select></label>" +
      '<label class="wp-field"><span>Grouping</span><select data-d><option value="">No GROUP BY</option><option value="1">GROUP BY COMPANY</option></select></label>';
    root.innerHTML =
      '<div class="widget-head"><strong>' + (this.mode === "set" ? "Set operations" : "Aggregate functions") + "</strong></div>" +
      '<div class="widget-controls">' + controls + "</div>" +
      '<div class="widget-stage sa-stage"></div>' +
      "<div data-player></div>";
    this.el = {
      a: root.querySelector("[data-a]"),
      b: root.querySelector("[data-b]"),
      c: root.querySelector("[data-c]"),
      d: root.querySelector("[data-d]"),
      stage: root.querySelector(".sa-stage")
    };
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (fr) { self.el.stage.innerHTML = fr.html; },
      resetLabel: "Start again",
      onReset: function () { self.player.load(self.frames, false); }
    });
    if (this.mode === "agg") {
      this.el.a.value = String(FUNCS.indexOf(root.getAttribute("data-fn") || "SUM"));
      this.el.b.value = root.getAttribute("data-col") || "COST";
      this.el.d.value = root.getAttribute("data-group") ? "1" : "";
    } else {
      this.el.b.value = String(Math.max(0, OPS.indexOf(root.getAttribute("data-op") || "UNION")));
    }
    root.querySelectorAll("select").forEach(function (s) { s.addEventListener("change", function () { self.run(); }); });
    this.run();
  }

  Widget.prototype.run = function () {
    if (this.mode === "set") {
      this.frames = buildSet(SETS[Number(this.el.a.value)], OPS[Number(this.el.b.value)]);
    } else {
      var fn = FUNCS[Number(this.el.a.value)];
      var col = this.el.b.value;
      var numeric = ["SUM", "AVG"].indexOf(fn) >= 0;
      this.el.b.disabled = fn === "COUNT(*)";
      if (numeric && col === "COMPANY") {
        col = "COST";
        this.el.b.value = col;
      }
      this.frames = buildAgg(fn, col, WHERES[Number(this.el.c.value)], !!this.el.d.value);
    }
    this.player.load(this.frames, false);
  };

  D.setAgg = { setOp: setOp, aggregate: aggregate, buildSet: buildSet, buildAgg: buildAgg, PRODUCTS: PRODUCTS, SETS: SETS, WHERES: WHERES };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="set-agg"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
