/* Correlated subquery stepper (widget V13).
   Shows a subquery in WHERE being evaluated. A plain subquery runs once; a
   correlated subquery runs again for every outer row, using that row's
   values. Each step highlights the outer row, the rows the inner query
   reads, the value it returns and the comparison. Needs player.js.
   Markup: <div class="widget" data-widget="subquery-step" data-preset="0"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  var COLS = ["ID", "NAME", "DEPT", "SALARY"];
  var ROWS = [
    [1, "John", "Sales", 2000],
    [2, "Stephan", "Sales", 1500],
    [3, "David", "IT", 2000],
    [4, "Alina", "IT", 6500],
    [5, "Kathrin", "HR", 8500],
    [6, "Harry", "HR", 4500],
    [7, "Jackson", "IT", 10000]
  ];

  function avg(list) {
    return list.reduce(function (s, v) { return s + v; }, 0) / list.length;
  }

  function max(list) {
    return Math.max.apply(null, list);
  }

  var PRESETS = [
    {
      label: "Correlated: earns more than the average of their own department",
      sql: "SELECT NAME, DEPT, SALARY\nFROM EMPLOYEE e\nWHERE SALARY > (SELECT AVG(SALARY)\n                FROM EMPLOYEE\n                WHERE DEPT = e.DEPT);",
      correlated: true,
      fn: "AVG", agg: avg, op: ">"
    },
    {
      label: "Not correlated: earns more than the company average",
      sql: "SELECT NAME, DEPT, SALARY\nFROM EMPLOYEE\nWHERE SALARY > (SELECT AVG(SALARY)\n                FROM EMPLOYEE);",
      correlated: false,
      fn: "AVG", agg: avg, op: ">"
    },
    {
      label: "Correlated: top earner of each department",
      sql: "SELECT NAME, DEPT, SALARY\nFROM EMPLOYEE e\nWHERE SALARY = (SELECT MAX(SALARY)\n                FROM EMPLOYEE\n                WHERE DEPT = e.DEPT);",
      correlated: true,
      fn: "MAX", agg: max, op: "="
    }
  ];

  function fmt(v) {
    return Math.round(v * 100) / 100 === Math.round(v) ? String(Math.round(v)) : (Math.round(v * 100) / 100).toFixed(2);
  }

  function build(p) {
    var esc = D.wq.esc;
    var frames = [];
    var result = [];
    var runs = 0;

    function tbl(cap, cols, rows, cls) {
      return '<div class="nz-card"><div class="nz-name">' + esc(cap) + '</div><div class="so-scroll"><table class="so-table nz-tab jv-tab"><caption class="visually-hidden">' + esc(cap) + "</caption><thead><tr>" +
        cols.map(function (c) { return '<th scope="col">' + esc(c) + "</th>"; }).join("") + "</tr></thead><tbody>" +
        (rows.length ? rows.map(function (r, i) {
          var c = cls ? cls(r, i) : "";
          return "<tr" + (c ? ' class="' + c + '"' : "") + ">" + r.map(function (v) { return "<td>" + esc(v) + "</td>"; }).join("") + "</tr>";
        }).join("") : '<tr><td colspan="' + cols.length + '" class="muted">(no rows yet)</td></tr>') + "</tbody></table></div></div>";
    }

    function view(outer, inner, note, fresh) {
      return '<pre class="sa-sql"><code>' + esc(p.sql) + "</code></pre>" +
        (note ? '<p class="sq-note">' + note + "</p>" : "") +
        '<div class="nz-cards">' +
        tbl("EMPLOYEE" + (p.correlated ? " e (outer)" : " (outer)"), COLS, ROWS, function (r, i) {
          var c = [];
          if (i === outer) c.push("jv-on");
          if (inner && inner.indexOf(i) >= 0) c.push("jv-match");
          return c.join(" ");
        }) +
        tbl("Result (" + result.length + ")", ["NAME", "DEPT", "SALARY"], result, function (r, i) { return fresh && i === result.length - 1 ? "jv-new" : ""; }) +
        "</div>";
    }

    frames.push({
      msg: p.correlated ? "The inner query mentions e.DEPT, a column of the outer row. So it is correlated: it must run again for each outer row." :
        "The inner query uses no column of the outer query. So it is not correlated: it runs once, and its result is reused.",
      html: view(-1, null, "", false)
    });

    var once = null;
    if (!p.correlated) {
      runs = 1;
      once = p.agg(ROWS.map(function (r) { return r[3]; }));
      frames.push({
        msg: "Run the inner query once: " + p.fn + "(SALARY) over all " + ROWS.length + " rows = " + fmt(once) + ". The outer query now reads WHERE SALARY " + p.op + " " + fmt(once) + ".",
        html: view(-1, ROWS.map(function (_, i) { return i; }), "Inner query result: <strong>" + fmt(once) + "</strong>", false)
      });
    }

    ROWS.forEach(function (r, i) {
      var inner;
      var value;
      if (p.correlated) {
        runs++;
        inner = [];
        ROWS.forEach(function (x, j) { if (x[2] === r[2]) inner.push(j); });
        value = p.agg(inner.map(function (j) { return ROWS[j][3]; }));
      } else {
        inner = null;
        value = once;
      }
      var pass = p.op === ">" ? r[3] > value : r[3] === value;
      if (pass) result.push([r[1], r[2], r[3]]);
      var head = p.correlated ? "Outer row " + r[1] + ": e.DEPT = '" + r[2] + "'. The inner query runs (run " + runs + ") on the " + inner.length + " " + r[2] + " rows: " + p.fn + " = " + fmt(value) + ". " : "Outer row " + r[1] + ": compare with the saved value " + fmt(value) + ". ";
      frames.push({
        msg: head + r[3] + " " + p.op + " " + fmt(value) + " is " + (pass ? "true, so " + r[1] + " is kept." : "false, so " + r[1] + " is skipped."),
        html: view(i, inner, (p.correlated ? "Inner query for DEPT = '" + esc(r[2]) + "' returns <strong>" + fmt(value) + "</strong>. " : "") + esc(r[3] + " " + p.op + " " + fmt(value)) + " → <strong>" + (pass ? "keep" : "skip") + "</strong>", pass)
      });
    });

    frames.push({
      msg: "Done. " + result.length + " rows qualify. The inner query ran " + runs + " time" + (runs > 1 ? "s" : "") + (p.correlated ? ", once per outer row. A correlated subquery can be slow on big tables; a JOIN with GROUP BY often does the same job faster." : ", however many outer rows there are."),
      html: view(-1, null, "Inner query ran <strong>" + runs + "</strong> time" + (runs > 1 ? "s" : ""), false)
    });
    return frames;
  }

  function Widget(root) {
    var self = this;
    var esc = D.wq.esc;
    root.innerHTML =
      '<div class="widget-head"><strong>Subquery stepper</strong></div>' +
      '<div class="widget-controls"><label class="wp-field wp-grow"><span>Query</span><select data-preset>' +
      PRESETS.map(function (p, i) { return '<option value="' + i + '">' + esc(p.label) + "</option>"; }).join("") +
      "</select></label></div>" +
      '<div class="widget-stage sa-stage"></div>' +
      "<div data-player></div>";
    this.el = { preset: root.querySelector("[data-preset]"), stage: root.querySelector(".sa-stage") };
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (f) { self.el.stage.innerHTML = f.html; },
      resetLabel: "Start again",
      onReset: function () { self.player.load(self.frames, false); }
    });
    this.el.preset.value = String(Number(root.getAttribute("data-preset")) || 0);
    this.el.preset.addEventListener("change", function () { self.run(); });
    this.run();
  }

  Widget.prototype.run = function () {
    this.frames = build(PRESETS[Number(this.el.preset.value)]);
    this.player.load(this.frames, false);
  };

  D.subqueryStep = { build: build, PRESETS: PRESETS, ROWS: ROWS };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="subquery-step"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
