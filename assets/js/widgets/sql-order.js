/* SQL clause order animator (widget V5).
   Steps through a query in the order the DBMS evaluates it: FROM, WHERE,
   GROUP BY, HAVING, SELECT, DISTINCT and ORDER BY. At each step the working
   table shows which rows are removed, how rows are grouped and how the result
   is sorted. Markup:
   <div class="widget" data-widget="sql-order" data-preset="basic"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  var COLS = ["roll", "name", "dept", "city", "marks"];
  var DATA = [
    [1, "Anitha", "CSE", "Salem", 88],
    [2, "Bharath", "IT", "Chennai", 72],
    [3, "Charan", "CSE", "Salem", 65],
    [4, "Divya", "ECE", "Erode", 91],
    [5, "Ezhil", "IT", "Salem", 55],
    [6, "Farhan", "CSE", "Erode", 79],
    [7, "Gowri", "ECE", "Salem", 84],
    [8, "Hari", "IT", "Erode", 47]
  ];
  var ORDER = ["FROM", "WHERE", "GROUP BY", "HAVING", "SELECT", "DISTINCT", "ORDER BY"];

  function get(r, c) {
    return r[COLS.indexOf(c)];
  }

  var PRESETS = {
    basic: {
      label: "WHERE and ORDER BY",
      sql: [["SELECT", "SELECT name, marks"], ["FROM", "FROM student"], ["WHERE", "WHERE city = 'Salem'"], ["ORDER BY", "ORDER BY marks DESC;"]],
      where: { text: "city = 'Salem'", test: function (r) { return get(r, "city") === "Salem"; } },
      select: ["name", "marks"],
      order: { by: "marks", desc: true, text: "marks DESC" }
    },
    logic: {
      label: "AND in WHERE",
      sql: [["SELECT", "SELECT name, dept, marks"], ["FROM", "FROM student"], ["WHERE", "WHERE dept = 'CSE' AND marks >= 70"], ["ORDER BY", "ORDER BY name;"]],
      where: { text: "dept = 'CSE' AND marks >= 70", test: function (r) { return get(r, "dept") === "CSE" && get(r, "marks") >= 70; } },
      select: ["name", "dept", "marks"],
      order: { by: "name", desc: false, text: "name" }
    },
    distinct: {
      label: "DISTINCT",
      sql: [["SELECT", "SELECT DISTINCT city"], ["FROM", "FROM student"], ["ORDER BY", "ORDER BY city;"]],
      select: ["city"],
      distinct: true,
      order: { by: "city", desc: false, text: "city" }
    },
    group: {
      label: "GROUP BY and HAVING",
      sql: [["SELECT", "SELECT dept, COUNT(*) AS students, ROUND(AVG(marks), 1) AS avg_marks"], ["FROM", "FROM student"], ["WHERE", "WHERE marks >= 50"], ["GROUP BY", "GROUP BY dept"], ["HAVING", "HAVING AVG(marks) > 70"], ["ORDER BY", "ORDER BY avg_marks DESC;"]],
      where: { text: "marks >= 50", test: function (r) { return get(r, "marks") >= 50; } },
      group: "dept",
      having: { text: "AVG(marks) > 70", test: function (g) { return g.avg > 70; } },
      order: { by: "avg_marks", desc: true, text: "avg_marks DESC" }
    }
  };

  function round1(x) {
    return Math.round(x * 10) / 10;
  }

  function build(p) {
    var frames = [];
    var rows = DATA.map(function (r) {
      return { v: r.slice(), drop: false, g: -1 };
    });
    var cols = COLS.slice();
    function snap(clause, msg, extra) {
      frames.push({
        clause: clause,
        msg: msg,
        cols: cols.slice(),
        rows: rows.map(function (r) {
          return { v: r.v.slice(), drop: r.drop, g: r.g, hl: r.hl };
        }),
        hlCols: (extra && extra.hlCols) || []
      });
    }
    function sweep() {
      rows = rows.filter(function (r) {
        return !r.drop;
      });
      rows.forEach(function (r) {
        r.hl = false;
      });
    }

    snap("FROM", "FROM runs first. It names the table, so the working table is all 8 rows of student.");

    if (p.where) {
      rows.forEach(function (r) {
        r.drop = !p.where.test(r.v);
      });
      var kept = rows.filter(function (r) { return !r.drop; }).length;
      snap("WHERE", "WHERE tests each row against " + p.where.text + ". " + kept + " rows pass; the struck-out rows are removed. WHERE works on single rows, before any grouping.");
      sweep();
    }

    var groups = null;
    if (p.group) {
      var keys = [];
      rows.forEach(function (r) {
        var k = get(r.v, p.group);
        if (keys.indexOf(k) < 0) keys.push(k);
      });
      keys.sort();
      rows.sort(function (a, b) {
        return keys.indexOf(get(a.v, p.group)) - keys.indexOf(get(b.v, p.group));
      });
      rows.forEach(function (r) {
        r.g = keys.indexOf(get(r.v, p.group));
      });
      snap("GROUP BY", "GROUP BY puts rows with the same " + p.group + " into one group: " + keys.length + " groups (" + keys.join(", ") + "). From now on, each group gives one result row.", { hlCols: [p.group] });
      groups = keys.map(function (k, i) {
        var mem = rows.filter(function (r) { return r.g === i; });
        var sum = mem.reduce(function (s, r) { return s + get(r.v, "marks"); }, 0);
        return { key: k, count: mem.length, avg: sum / mem.length, i: i };
      });
      if (p.having) {
        var failed = groups.filter(function (g) { return !p.having.test(g); });
        rows.forEach(function (r) {
          r.drop = failed.some(function (g) { return g.i === r.g; });
        });
        snap("HAVING", "HAVING tests each group, not each row. Average marks: " + groups.map(function (g) { return g.key + " " + round1(g.avg); }).join(", ") + ". " +
          (failed.length ? failed.map(function (g) { return g.key; }).join(", ") + " fails " + p.having.text + ", so the whole group is removed." : "Every group passes."));
        sweep();
        groups = groups.filter(function (g) { return failed.indexOf(g) < 0; });
      }
    }

    if (groups) {
      cols = ["dept", "students", "avg_marks"];
      rows = groups.map(function (g) {
        return { v: [g.key, g.count, round1(g.avg)], drop: false, g: g.i };
      });
      snap("SELECT", "SELECT now computes one row per group: the dept, COUNT(*) and the rounded AVG(marks). The new names students and avg_marks are column aliases.", { hlCols: cols });
    } else {
      var idx = p.select.map(function (c) { return COLS.indexOf(c); });
      cols = p.select.slice();
      rows.forEach(function (r) {
        r.v = idx.map(function (i) { return r.v[i]; });
      });
      snap("SELECT", "SELECT keeps only the listed columns: " + D.wq.list(p.select) + ". This is the projection (π) of relational algebra.", { hlCols: cols });
    }

    if (p.distinct) {
      var seen = {};
      rows.forEach(function (r) {
        var k = JSON.stringify(r.v);
        r.drop = !!seen[k];
        seen[k] = true;
      });
      var repeats = rows.filter(function (r) { return r.drop; }).length;
      snap("DISTINCT", "DISTINCT removes repeated rows. " + repeats + " duplicate rows are struck out. Without DISTINCT, SQL keeps duplicates.");
      sweep();
    }

    var oc = cols.indexOf(p.order.by);
    rows.sort(function (a, b) {
      var x = a.v[oc];
      var y = b.v[oc];
      var c = x < y ? -1 : x > y ? 1 : 0;
      return p.order.desc ? -c : c;
    });
    snap("ORDER BY", "ORDER BY runs last and sorts the result by " + p.order.text + (p.order.desc ? " (largest first)." : " (ascending, the default).") + " This is the final result: " + rows.length + " row" + (rows.length === 1 ? "." : "s."), { hlCols: [p.order.by] });
    return frames;
  }

  function render(w, f) {
    var esc = D.wq.esc;
    var p = PRESETS[w.preset];
    var steps = ORDER.filter(function (c) {
      return f.clause === c || p.sql.some(function (l) { return l[0] === c; }) || (c === "DISTINCT" && p.distinct);
    });
    var at = steps.indexOf(f.clause);
    var strip = '<ol class="so-order" aria-label="Order of evaluation">' + steps.map(function (c, i) {
      return '<li class="' + (i === at ? "is-on" : i < at ? "is-done" : "") + '">' + esc(c) + "</li>";
    }).join("") + "</ol>";
    var code = '<pre class="so-sql"><code>' + p.sql.map(function (l) {
      var on = l[0] === f.clause || (f.clause === "DISTINCT" && l[0] === "SELECT");
      return '<span class="' + (on ? "is-on" : "") + '">' + esc(l[1]) + "</span>";
    }).join("\n") + "</code></pre>";
    var table = '<div class="so-scroll"><table class="so-table"><caption class="visually-hidden">Working table after ' + esc(f.clause) + "</caption><thead><tr>" +
      f.cols.map(function (c) {
        return '<th scope="col" class="' + (f.hlCols.indexOf(c) >= 0 ? "is-col" : "") + '">' + esc(c) + "</th>";
      }).join("") + "</tr></thead><tbody>" +
      f.rows.map(function (r) {
        return '<tr class="' + (r.drop ? "is-drop" : "") + (r.g >= 0 ? " so-g" + (r.g % 3) : "") + '">' + r.v.map(function (v, i) {
          return '<td class="' + (f.hlCols.indexOf(f.cols[i]) >= 0 ? "is-col" : "") + '">' + esc(v) + "</td>";
        }).join("") + "</tr>";
      }).join("") + "</tbody></table></div>";
    w.stage.innerHTML = strip + '<div class="so-grid"><div class="so-left">' + code + '</div><div class="so-right"><div class="so-cap">Working table (' +
      f.rows.filter(function (r) { return !r.drop; }).length + " rows)</div>" + table + "</div></div>";
  }

  function Widget(root) {
    var self = this;
    var esc = D.wq.esc;
    this.preset = PRESETS[root.getAttribute("data-preset")] ? root.getAttribute("data-preset") : "basic";
    root.innerHTML =
      '<div class="widget-head"><strong>SQL clause order</strong></div>' +
      '<div class="widget-controls"><label class="wp-field wp-grow"><span>Query</span><select data-preset>' +
      Object.keys(PRESETS).map(function (k) {
        return '<option value="' + k + '">' + esc(PRESETS[k].label) + "</option>";
      }).join("") + "</select></label></div>" +
      '<div class="widget-stage so-stage"></div><div data-player></div>';
    this.stage = root.querySelector(".so-stage");
    this.select = root.querySelector("[data-preset]");
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (f) {
        render(self, f);
      },
      resetLabel: "Start again",
      onReset: function () {
        self.load();
      }
    });
    this.select.value = this.preset;
    this.select.addEventListener("change", function () {
      self.preset = self.select.value;
      self.load();
    });
    this.load();
  }

  Widget.prototype.load = function () {
    this.player.load(build(PRESETS[this.preset]), false);
  };

  D.sqlOrder = { PRESETS: PRESETS, build: build, DATA: DATA };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="sql-order"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
