/* Join visualizer (widget V11).
   Picks a join type and steps through the left table one row at a time,
   showing which right rows match and which result rows are added. Outer
   joins add NULL-padded rows for rows with no match. FULL OUTER JOIN is
   shown the MySQL way: a LEFT JOIN UNION a RIGHT JOIN. Needs player.js.
   Markup: <div class="widget" data-widget="join-viz" data-join="INNER"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  var PRESETS = [
    {
      label: "student and department",
      left: { name: "student", alias: "s", cols: ["roll", "name", "dept_id"], rows: [[1, "Anitha", 10], [2, "Bharath", 20], [3, "Charan", 10], [4, "Divya", null]] },
      right: { name: "department", alias: "d", cols: ["dept_id", "dept_name"], rows: [[10, "CSE"], [20, "IT"], [30, "ECE"]] },
      on: ["dept_id", "dept_id"]
    },
    {
      label: "employee and its manager (self join)",
      left: { name: "employee", alias: "e", cols: ["emp_id", "name", "manager_id"], rows: [[1, "Ravi", null], [2, "Meena", 1], [3, "Kumar", 1], [4, "Asha", 2]] },
      right: { name: "employee", alias: "m", cols: ["emp_id", "name", "manager_id"], rows: [[1, "Ravi", null], [2, "Meena", 1], [3, "Kumar", 1], [4, "Asha", 2]] },
      on: ["manager_id", "emp_id"]
    }
  ];

  var TYPES = ["INNER", "LEFT", "RIGHT", "FULL", "CROSS"];
  var NAMES = { INNER: "INNER JOIN", LEFT: "LEFT OUTER JOIN", RIGHT: "RIGHT OUTER JOIN", FULL: "FULL OUTER JOIN", CROSS: "CROSS JOIN" };

  function sqlFor(p, type) {
    var L = p.left;
    var R = p.right;
    var from = "SELECT *\nFROM " + L.name + " " + L.alias + "\n";
    var on = "ON " + L.alias + "." + p.on[0] + " = " + R.alias + "." + p.on[1];
    if (type === "CROSS") return from + "CROSS JOIN " + R.name + " " + R.alias + ";";
    if (type === "FULL") {
      return from + "LEFT JOIN " + R.name + " " + R.alias + " " + on + "\nUNION\n" + from + "RIGHT JOIN " + R.name + " " + R.alias + " " + on + ";";
    }
    return from + (type === "INNER" ? "INNER JOIN " : type + " JOIN ") + R.name + " " + R.alias + "\n" + on + ";";
  }

  function matches(p, l, r, type) {
    if (type === "CROSS") return true;
    var a = l[p.left.cols.indexOf(p.on[0])];
    var b = r[p.right.cols.indexOf(p.on[1])];
    return a !== null && b !== null && a === b;
  }

  function nulls(n) {
    var out = [];
    for (var i = 0; i < n; i++) out.push(null);
    return out;
  }

  function build(p, type) {
    var esc = D.wq.esc;
    var L = p.left;
    var R = p.right;
    var cols = L.cols.map(function (c) { return L.alias + "." + c; }).concat(R.cols.map(function (c) { return R.alias + "." + c; }));
    var sql = sqlFor(p, type);
    var frames = [];
    var result = [];
    var rightUsed = R.rows.map(function () { return false; });
    var keepLeft = type === "LEFT" || type === "FULL";
    var keepRight = type === "RIGHT" || type === "FULL";

    function tbl(cap, headers, rows, cls, cellCls) {
      return '<div class="nz-card"><div class="nz-name">' + esc(cap) + '</div><div class="so-scroll"><table class="so-table nz-tab jv-tab"><caption class="visually-hidden">' + esc(cap) + "</caption><thead><tr>" +
        headers.map(function (c) { return '<th scope="col">' + esc(c) + "</th>"; }).join("") + "</tr></thead><tbody>" +
        (rows.length ? rows.map(function (r, i) {
          var c = cls ? cls(r, i) : "";
          return "<tr" + (c ? ' class="' + c + '"' : "") + ">" + r.map(function (v, j) {
            var k = v === null ? "jv-null" : cellCls ? cellCls(j) : "";
            return "<td" + (k ? ' class="' + k + '"' : "") + ">" + (v === null ? "NULL" : esc(v)) + "</td>";
          }).join("") + "</tr>";
        }).join("") : '<tr><td colspan="' + headers.length + '" class="muted">(no rows yet)</td></tr>') + "</tbody></table></div></div>";
    }

    var onCol = function (side) {
      return function (j) { return (side === "L" ? L.cols[j] === p.on[0] : R.cols[j] === p.on[1]) && type !== "CROSS" ? "jv-key" : ""; };
    };

    function view(li, hits, fresh) {
      return '<pre class="sa-sql"><code>' + esc(sql) + "</code></pre>" +
        '<div class="nz-cards">' +
        tbl(L.name + " " + L.alias, L.cols, L.rows, function (r, i) { return i === li ? "jv-on" : ""; }, onCol("L")) +
        tbl(R.name + " " + R.alias, R.cols, R.rows, function (r, i) { return hits && hits.indexOf(i) >= 0 ? "jv-match" : hits === "unmatched" && !rightUsed[i] ? "jv-on" : ""; }, onCol("R")) +
        "</div>" +
        '<div class="nz-cards">' + tbl("Result (" + result.length + " row" + (result.length === 1 ? "" : "s") + ")", cols, result, function (r, i) { return fresh && i >= result.length - fresh ? "jv-new" : ""; }) + "</div>";
    }

    var kw = type === "CROSS" ? "" : " on " + L.alias + "." + p.on[0] + " = " + R.alias + "." + p.on[1];
    frames.push({
      msg: NAMES[type] + kw + ". " + (type === "FULL" ? "MySQL has no FULL OUTER JOIN, so we write it as a LEFT JOIN UNION a RIGHT JOIN. " : "") + "We take the rows of " + L.name + " " + L.alias + " one at a time.",
      html: view(-1, null, 0)
    });

    L.rows.forEach(function (l, li) {
      var hits = [];
      R.rows.forEach(function (r, ri) { if (matches(p, l, r, type)) hits.push(ri); });
      hits.forEach(function (ri) {
        rightUsed[ri] = true;
        result.push(l.concat(R.rows[ri]));
      });
      var key = l[L.cols.indexOf(p.on[0])];
      var who = l[1];
      var msg;
      if (type === "CROSS") {
        msg = who + " is paired with every one of the " + R.rows.length + " rows of " + R.name + ". No condition is checked.";
      } else if (hits.length) {
        msg = who + " has " + p.on[0] + " = " + key + ". It matches " + hits.length + " row" + (hits.length > 1 ? "s" : "") + " of " + R.alias + ", so " + hits.length + " result row" + (hits.length > 1 ? "s are" : " is") + " added.";
      } else {
        var why = key === null ? who + " has " + p.on[0] + " = NULL. NULL = anything is unknown, never true, so nothing matches." : who + " has " + p.on[0] + " = " + key + ", and no row of " + R.alias + " matches.";
        if (keepLeft) {
          result.push(l.concat(nulls(R.cols.length)));
          msg = why + " " + (type === "FULL" ? "The LEFT JOIN half" : "A LEFT JOIN") + " keeps " + who + " anyway, with NULL in every " + R.alias + " column.";
        } else {
          msg = why + " " + NAMES[type] + " drops " + who + ".";
        }
      }
      var added = hits.length ? hits.length : keepLeft ? 1 : 0;
      frames.push({ msg: msg, html: view(li, hits, added) });
    });

    if (keepRight) {
      var lonely = [];
      R.rows.forEach(function (r, ri) { if (!rightUsed[ri]) lonely.push(ri); });
      lonely.forEach(function (ri) { result.push(nulls(L.cols.length).concat(R.rows[ri])); });
      frames.push({
        msg: lonely.length ? "Now the rows of " + R.alias + " that matched nothing: " + lonely.map(function (ri) { return R.rows[ri][1]; }).join(", ") + ". " + (type === "FULL" ? "The RIGHT JOIN half adds them" : "A RIGHT JOIN keeps them") + " with NULL in every " + L.alias + " column." + (type === "FULL" ? " UNION removes the matched rows that both halves return." : "") :
          "Every row of " + R.alias + " matched something, so the right side adds no NULL rows.",
        html: view(-1, "unmatched", lonely.length)
      });
    }

    frames.push({
      msg: NAMES[type] + " gives " + result.length + " rows." + (type === "CROSS" ? " That is " + L.rows.length + " × " + R.rows.length + "." : "") +
        (type === "INNER" ? " Only matching pairs are kept." : "") + (type === "LEFT" || type === "RIGHT" || type === "FULL" ? " NULL cells mark the rows that had no partner." : ""),
      html: view(-1, null, 0)
    });
    return frames;
  }

  function Widget(root) {
    var self = this;
    var esc = D.wq.esc;
    root.innerHTML =
      '<div class="widget-head"><strong>Join visualizer</strong></div>' +
      '<div class="widget-controls">' +
      '<label class="wp-field wp-grow"><span>Tables</span><select data-preset>' + PRESETS.map(function (p, i) { return '<option value="' + i + '">' + esc(p.label) + "</option>"; }).join("") + "</select></label>" +
      '<label class="wp-field"><span>Join type</span><select data-type>' + TYPES.map(function (t) { return '<option value="' + t + '">' + NAMES[t] + "</option>"; }).join("") + "</select></label>" +
      "</div>" +
      '<div class="widget-stage sa-stage"></div>' +
      "<div data-player></div>";
    this.el = { preset: root.querySelector("[data-preset]"), type: root.querySelector("[data-type]"), stage: root.querySelector(".sa-stage") };
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (f) { self.el.stage.innerHTML = f.html; },
      resetLabel: "Start again",
      onReset: function () { self.player.load(self.frames, false); }
    });
    this.el.preset.value = String(Number(root.getAttribute("data-preset")) || 0);
    this.el.type.value = TYPES.indexOf(root.getAttribute("data-join")) >= 0 ? root.getAttribute("data-join") : "INNER";
    [this.el.preset, this.el.type].forEach(function (s) { s.addEventListener("change", function () { self.run(); }); });
    this.run();
  }

  Widget.prototype.run = function () {
    this.frames = build(PRESETS[Number(this.el.preset.value)], this.el.type.value);
    this.player.load(this.frames, false);
  };

  D.joinViz = { build: build, sqlFor: sqlFor, PRESETS: PRESETS };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="join-viz"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
