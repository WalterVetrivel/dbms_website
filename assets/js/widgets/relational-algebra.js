/* Relational algebra playground (widget V4).
   The student picks an operator and its parameter. The widget shows the input
   relations, highlights the tuples (or attributes) that take part, and shows
   the result relation with its relational algebra expression and the SQL that
   gives the same result.
   Markup: <div class="widget" data-widget="relational-algebra" data-op="select"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  function rel(name, attrs, rows) {
    return { name: name, attrs: attrs, rows: rows };
  }

  var R = {
    Student: rel("Student", ["sid", "sname", "age", "city"], [
      [1, "Anitha", 19, "Salem"], [2, "Bharath", 21, "Chennai"], [3, "Charan", 18, "Salem"], [4, "Divya", 20, "Erode"]
    ]),
    Reserve: rel("Reserve", ["sid", "isbn"], [[1, "005"], [2, "007"], [1, "007"]]),
    Book: rel("Book", ["isbn", "bname"], [["005", "DBMS"], ["007", "Java"], ["009", "Python"]]),
    FullTime: rel("Full_Time", ["ename"], [["Ganesh"], ["Hari"], ["Indu"]]),
    PartTime: rel("Part_Time", ["ename"], [["Hari"], ["Janani"]]),
    Emp: rel("Emp", ["ename", "dno"], [["Ganesh", 10], ["Hari", 20], ["Indu", null]]),
    Dept: rel("Dept", ["dno", "dname"], [[10, "CSE"], [20, "IT"], [30, "ECE"]]),
    Account: rel("Account", ["cname", "branch"], [["Asha", "Salem"], ["Asha", "Erode"], ["Babu", "Salem"], ["Chitra", "Erode"]]),
    Branch: rel("Branch", ["branch"], [["Salem"], ["Erode"]])
  };

  function key(row) {
    return JSON.stringify(row);
  }

  function distinct(rows) {
    var seen = {};
    return rows.filter(function (r) {
      var k = key(r);
      if (seen[k]) return false;
      seen[k] = true;
      return true;
    });
  }

  function col(r, a) {
    return r.attrs.indexOf(a);
  }

  /* ---------- Operators ---------- */

  var SELECT_CONDS = {
    age: { text: "age > 18", sql: "age > 18", test: function (t) { return t[2] > 18; } },
    city: { text: "city = 'Salem'", sql: "city = 'Salem'", test: function (t) { return t[3] === "Salem"; } },
    and: { text: "age > 18 ∧ city = 'Salem'", sql: "age > 18 AND city = 'Salem'", test: function (t) { return t[2] > 18 && t[3] === "Salem"; } },
    or: { text: "age < 19 ∨ city = 'Erode'", sql: "age < 19 OR city = 'Erode'", test: function (t) { return t[2] < 19 || t[3] === "Erode"; } }
  };

  var PROJECT_LISTS = {
    sname: ["sname"],
    snameAge: ["sname", "age"],
    city: ["city"]
  };

  function select(p) {
    var c = SELECT_CONDS[p];
    var s = R.Student;
    var hit = [];
    var rows = s.rows.filter(function (t, i) {
      if (c.test(t)) hit.push(i);
      return c.test(t);
    });
    return {
      expr: "σ<sub>" + c.text + "</sub>(Student)",
      sql: "SELECT * FROM Student WHERE " + c.sql + ";",
      inputs: [{ r: s, rows: hit }],
      result: rel("Result", s.attrs, rows),
      msg: "Selection keeps the tuples that satisfy " + c.text + ": " + rows.length + " of " + s.rows.length + " tuples. Every attribute is kept."
    };
  }

  function project(p) {
    var list = PROJECT_LISTS[p];
    var s = R.Student;
    var all = s.rows.map(function (t) {
      return list.map(function (a) { return t[col(s, a)]; });
    });
    var rows = distinct(all);
    var dropped = all.length - rows.length;
    return {
      expr: "π<sub>" + list.join(", ") + "</sub>(Student)",
      sql: "SELECT DISTINCT " + list.join(", ") + " FROM Student;",
      inputs: [{ r: s, cols: list }],
      result: rel("Result", list, rows),
      msg: "Projection keeps only the attribute" + (list.length > 1 ? "s " : " ") + D.wq.list(list) + "." + (dropped ? " " + dropped + " duplicate tuple" + (dropped > 1 ? "s were" : " was") + " removed, because a relation is a set." : " No duplicates appeared.")
    };
  }

  function setOp(p) {
    var a = R.FullTime;
    var b = R.PartTime;
    var swap = p === "minusBA";
    var x = swap ? b : a;
    var y = swap ? a : b;
    var inY = function (t) { return y.rows.some(function (u) { return key(u) === key(t); }); };
    var rows;
    var sym;
    var sqlOp;
    var msg;
    if (p === "union") {
      rows = distinct(a.rows.concat(b.rows));
      sym = "∪";
      sqlOp = "UNION";
      msg = "Union gives every tuple that is in either relation. Hari is in both, but appears once.";
    } else if (p === "intersect") {
      rows = a.rows.filter(inY);
      sym = "∩";
      sqlOp = "INTERSECT";
      msg = "Intersection gives the tuples that are in both relations: only Hari works full time and part time.";
    } else {
      rows = x.rows.filter(function (t) { return !inY(t); });
      sym = "−";
      sqlOp = "EXCEPT";
      msg = "Set difference gives the tuples in " + x.name + " that are not in " + y.name + ". The order matters: " + (swap ? "Part_Time − Full_Time is only Janani." : "Full_Time − Part_Time is Ganesh and Indu.");
    }
    var hitX = [];
    x.rows.forEach(function (t, i) {
      var inRes = rows.some(function (u) { return key(u) === key(t); });
      if (inRes) hitX.push(i);
    });
    var hitY = [];
    y.rows.forEach(function (t, i) {
      var inRes = rows.some(function (u) { return key(u) === key(t); });
      if (inRes) hitY.push(i);
    });
    return {
      expr: x.name + " " + sym + " " + y.name,
      sql: "SELECT ename FROM " + x.name + " " + sqlOp + " SELECT ename FROM " + y.name + ";",
      inputs: [{ r: x, rows: hitX }, { r: y, rows: hitY }],
      result: rel("Result", ["ename"], rows),
      msg: msg + " Both relations have the same attributes, so they are union compatible."
    };
  }

  function product() {
    var a = R.Student;
    var b = R.Reserve;
    var rows = [];
    a.rows.forEach(function (t) {
      b.rows.forEach(function (u) {
        rows.push(t.concat(u));
      });
    });
    return {
      expr: "Student × Reserve",
      sql: "SELECT * FROM Student, Reserve;",
      inputs: [{ r: a, rows: [] }, { r: b, rows: [] }],
      result: rel("Result", ["Student.sid", "sname", "age", "city", "Reserve.sid", "isbn"], rows),
      msg: "The Cartesian product pairs every Student tuple with every Reserve tuple: 4 × 3 = " + rows.length + " tuples. Most pairs are meaningless (the two sid values differ), so a product is usually followed by a selection."
    };
  }

  function theta() {
    var a = R.Student;
    var b = R.Reserve;
    var rows = [];
    var hitA = [];
    var hitB = [];
    a.rows.forEach(function (t, i) {
      b.rows.forEach(function (u, j) {
        if (t[0] === u[0]) {
          rows.push(t.concat(u));
          if (hitA.indexOf(i) < 0) hitA.push(i);
          if (hitB.indexOf(j) < 0) hitB.push(j);
        }
      });
    });
    return {
      expr: "Student ⋈<sub>Student.sid = Reserve.sid</sub> Reserve",
      sql: "SELECT * FROM Student JOIN Reserve ON Student.sid = Reserve.sid;",
      inputs: [{ r: a, rows: hitA }, { r: b, rows: hitB }],
      result: rel("Result", ["Student.sid", "sname", "age", "city", "Reserve.sid", "isbn"], rows),
      msg: "The theta join is σ(condition)(Student × Reserve). The condition uses =, so this is also an equijoin. Both sid columns stay in the result."
    };
  }

  function natural(left, right) {
    var common = left.attrs.filter(function (x) { return right.attrs.indexOf(x) >= 0; });
    var rest = right.attrs.filter(function (x) { return common.indexOf(x) < 0; });
    var rows = [];
    var hitA = [];
    var hitB = [];
    left.rows.forEach(function (t, i) {
      right.rows.forEach(function (u, j) {
        var ok = common.every(function (c) {
          var v = t[col(left, c)];
          return v !== null && v === u[col(right, c)];
        });
        if (ok) {
          rows.push(t.concat(rest.map(function (c) { return u[col(right, c)]; })));
          if (hitA.indexOf(i) < 0) hitA.push(i);
          if (hitB.indexOf(j) < 0) hitB.push(j);
        }
      });
    });
    return { common: common, attrs: left.attrs.concat(rest), rows: rows, hitA: hitA, hitB: hitB, rest: rest };
  }

  function naturalJoin() {
    var n = natural(R.Reserve, R.Book);
    return {
      expr: "Reserve ⋈ Book",
      sql: "SELECT * FROM Reserve NATURAL JOIN Book;",
      inputs: [{ r: R.Reserve, rows: n.hitA }, { r: R.Book, rows: n.hitB }],
      result: rel("Result", n.attrs, n.rows),
      msg: "The natural join matches tuples with equal values in the common attribute isbn, and keeps isbn only once. Book 009 (Python) has no match, so it is left out."
    };
  }

  function outer(kind) {
    var L = R.Emp;
    var Rr = R.Dept;
    var n = natural(L, Rr);
    var rows = n.rows.slice();
    var extraL = [];
    var extraR = [];
    if (kind !== "right") {
      L.rows.forEach(function (t, i) {
        if (n.hitA.indexOf(i) < 0) {
          rows.push(t.concat(n.rest.map(function () { return null; })));
          extraL.push(i);
        }
      });
    }
    if (kind !== "left") {
      Rr.rows.forEach(function (u, j) {
        if (n.hitB.indexOf(j) < 0) {
          rows.push(n.attrs.map(function (a) {
            var c = col(Rr, a);
            return c >= 0 ? u[c] : null;
          }));
          extraR.push(j);
        }
      });
    }
    var sym = { left: "⟕", right: "⟖", full: "⟗" }[kind];
    var sqlKind = { left: "LEFT OUTER JOIN", right: "RIGHT OUTER JOIN", full: "FULL OUTER JOIN" }[kind];
    var msg = {
      left: "A left outer join keeps every Emp tuple. Indu has no department, so her dname is filled with NULL.",
      right: "A right outer join keeps every Dept tuple. No employee works in ECE, so ename is filled with NULL.",
      full: "A full outer join keeps unmatched tuples from both sides: Indu (no department) and ECE (no employee), padded with NULL."
    }[kind];
    return {
      expr: "Emp " + sym + " Dept",
      sql: kind === "full" ? "-- MySQL has no FULL OUTER JOIN; use a UNION of a LEFT and a RIGHT join\nSELECT ename, dno, dname FROM Emp LEFT JOIN Dept USING (dno)\nUNION\nSELECT ename, dno, dname FROM Emp RIGHT JOIN Dept USING (dno);" : "SELECT ename, dno, dname FROM Emp " + sqlKind + " Dept USING (dno);",
      inputs: [{ r: L, rows: n.hitA, extra: extraL }, { r: Rr, rows: n.hitB, extra: extraR }],
      result: rel("Result", n.attrs, rows),
      msg: msg
    };
  }

  function rename() {
    var s = R.Student;
    var rows = s.rows.map(function (t) { return [t[0], t[1]]; });
    return {
      expr: "ρ<sub>Student_names</sub>(π<sub>sid, sname</sub>(Student))",
      sql: "SELECT sid, sname FROM Student AS Student_names;",
      inputs: [{ r: s, cols: ["sid", "sname"] }],
      result: rel("Student_names", ["sid", "sname"], rows),
      msg: "Rename gives the result of π a new name, Student_names. The data does not change; only the name of the relation does."
    };
  }

  function divide() {
    var A = R.Account;
    var B = R.Branch;
    var names = distinct(A.rows.map(function (t) { return [t[0]]; }));
    var rows = names.filter(function (x) {
      return B.rows.every(function (b) {
        return A.rows.some(function (t) { return t[0] === x[0] && t[1] === b[0]; });
      });
    });
    var hit = [];
    A.rows.forEach(function (t, i) {
      if (rows.some(function (x) { return x[0] === t[0]; })) hit.push(i);
    });
    return {
      expr: "Account ÷ Branch",
      sql: "-- customers for whom no branch is missing\nSELECT DISTINCT a.cname FROM Account a\nWHERE NOT EXISTS (\n  SELECT * FROM Branch b WHERE NOT EXISTS (\n    SELECT * FROM Account x WHERE x.cname = a.cname AND x.branch = b.branch));",
      inputs: [{ r: A, rows: hit }, { r: B, rows: [0, 1] }],
      result: rel("Result", ["cname"], rows),
      msg: "Division answers “for all” questions: which customers have an account in every branch? Asha has accounts in both Salem and Erode. Babu lacks Erode and Chitra lacks Salem."
    };
  }

  var OPS = {
    select: { label: "σ Select", params: { age: "age > 18", city: "city = 'Salem'", and: "age > 18 and city = 'Salem'", or: "age < 19 or city = 'Erode'" }, run: select },
    project: { label: "π Project", params: { sname: "sname", snameAge: "sname, age", city: "city (watch duplicates go)" }, run: project },
    union: { label: "∪ Union", run: function () { return setOp("union"); } },
    intersect: { label: "∩ Intersection", run: function () { return setOp("intersect"); } },
    minus: { label: "− Set difference", params: { minusAB: "Full_Time − Part_Time", minusBA: "Part_Time − Full_Time" }, run: setOp },
    product: { label: "× Cartesian product", run: product },
    theta: { label: "⋈θ Theta join (equijoin)", run: theta },
    natural: { label: "⋈ Natural join", run: naturalJoin },
    outer: { label: "⟕ ⟖ ⟗ Outer joins", params: { left: "Left outer join", right: "Right outer join", full: "Full outer join" }, run: outer },
    rename: { label: "ρ Rename", run: rename },
    divide: { label: "÷ Division", run: divide }
  };

  /* ---------- Drawing ---------- */

  function table(esc, r, opts) {
    opts = opts || {};
    var rows = opts.rows || [];
    var extra = opts.extra || [];
    var cols = opts.cols || [];
    var html = '<div class="ra-rel"><div class="ra-name">' + esc(r.name) + ' <span class="muted">(' + r.rows.length + " tuple" + (r.rows.length === 1 ? "" : "s") + ")</span></div>" +
      '<div class="ra-scroll"><table class="ra-table"><thead><tr>' +
      r.attrs.map(function (a) {
        return '<th scope="col" class="' + (cols.indexOf(a) >= 0 ? "is-col" : "") + '">' + esc(a) + "</th>";
      }).join("") + "</tr></thead><tbody>";
    if (!r.rows.length) html += '<tr><td colspan="' + r.attrs.length + '" class="muted">(empty)</td></tr>';
    r.rows.forEach(function (t, i) {
      var cls = rows.indexOf(i) >= 0 ? "is-hit" : extra.indexOf(i) >= 0 ? "is-extra" : "";
      html += '<tr class="' + cls + '">' + t.map(function (v, c) {
        var isNull = v === null;
        return '<td class="' + (cols.indexOf(r.attrs[c]) >= 0 ? "is-col" : "") + (isNull ? " is-null" : "") + '">' + (isNull ? "NULL" : esc(v)) + "</td>";
      }).join("") + "</tr>";
    });
    return html + "</tbody></table></div></div>";
  }

  function Widget(root) {
    var self = this;
    var esc = D.wq.esc;
    this.esc = esc;
    var start = root.getAttribute("data-op");
    root.innerHTML =
      '<div class="widget-head"><strong>Relational algebra playground</strong></div>' +
      '<div class="widget-controls">' +
      '<label class="wp-field wp-grow"><span>Operator</span><select data-op>' +
      Object.keys(OPS).map(function (k) {
        return '<option value="' + k + '">' + esc(OPS[k].label) + "</option>";
      }).join("") + "</select></label>" +
      '<label class="wp-field wp-grow" data-param-box><span>Parameter</span><select data-param></select></label>' +
      "</div>" +
      '<p class="ra-expr" aria-live="polite"><span class="muted">Expression:</span> <span data-expr></span></p>' +
      '<div class="widget-stage ra-stage"></div>' +
      '<p class="widget-narration" aria-live="polite" data-narration></p>' +
      '<details class="ra-sql"><summary>Same query in SQL</summary><pre><code data-sql></code></pre></details>';
    this.opSel = root.querySelector("[data-op]");
    this.paramSel = root.querySelector("[data-param]");
    this.paramBox = root.querySelector("[data-param-box]");
    this.stage = root.querySelector(".ra-stage");
    this.exprBox = root.querySelector("[data-expr]");
    this.narration = root.querySelector("[data-narration]");
    this.sqlBox = root.querySelector("[data-sql]");
    this.opSel.addEventListener("change", function () {
      self.setOp(self.opSel.value);
    });
    this.paramSel.addEventListener("change", function () {
      self.render();
    });
    this.setOp(OPS[start] ? start : "select");
  }

  Widget.prototype.setOp = function (op) {
    var esc = this.esc;
    this.op = op;
    this.opSel.value = op;
    var params = OPS[op].params;
    this.paramBox.hidden = !params;
    this.paramSel.innerHTML = params ? Object.keys(params).map(function (k) {
      return '<option value="' + k + '">' + esc(params[k]) + "</option>";
    }).join("") : "";
    this.render();
  };

  Widget.prototype.render = function () {
    var esc = this.esc;
    var res = OPS[this.op].run(this.paramSel.value || undefined);
    this.exprBox.innerHTML = res.expr;
    var inputs = res.inputs.map(function (inp) {
      return table(esc, inp.r, inp);
    }).join("");
    this.stage.innerHTML = '<div class="ra-flow"><div class="ra-inputs">' + inputs + '</div><div class="ra-arrow" aria-hidden="true">→</div>' +
      '<div class="ra-out">' + table(esc, res.result, {}) + "</div></div>";
    this.narration.textContent = res.msg;
    this.sqlBox.textContent = res.sql;
  };

  D.relationalAlgebra = { R: R, OPS: OPS };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="relational-algebra"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
