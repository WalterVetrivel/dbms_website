/* Fragmentation and replication (widget V31).
   The student picks a way to store the Student relation across three sites:
   horizontal, vertical or mixed fragmentation, or full or partial replication.
   The player colors the cells of the global relation by the fragment they go
   to, places each fragment at its site, and then rebuilds the relation with
   union (∪) or natural join (⋈). The replication methods also show what an
   update and a site failure mean.
   Markup: <div class="widget" data-widget="fragmentation" data-method="horizontal"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  var COLS = ["RollNo", "Name", "Dept", "City", "Marks"];
  var ROWS = [
    [101, "Anu", "CSE", "Salem", 88],
    [102, "Bala", "ECE", "Chennai", 72],
    [103, "Charu", "CSE", "Coimbatore", 65],
    [104, "Dinesh", "MECH", "Salem", 91],
    [105, "Elan", "ECE", "Coimbatore", 58],
    [106, "Fathima", "CSE", "Chennai", 79]
  ];
  var SITES = ["Site 1: Salem", "Site 2: Chennai", "Site 3: Coimbatore"];
  var ALL = [0, 1, 2, 3, 4];

  function city(c) {
    return function (r) {
      return r[3] === c;
    };
  }
  function any() {
    return true;
  }

  // Each fragment: n (number shown as F1, F2 ...), site, the rows it keeps,
  // the columns it keeps and its relational algebra expression.
  var METHODS = {
    horizontal: {
      name: "Horizontal fragmentation",
      frags: [
        { n: 1, site: 0, keep: city("Salem"), cols: ALL, expr: "F1 = σ City='Salem' (Student)" },
        { n: 2, site: 1, keep: city("Chennai"), cols: ALL, expr: "F2 = σ City='Chennai' (Student)" },
        { n: 3, site: 2, keep: city("Coimbatore"), cols: ALL, expr: "F3 = σ City='Coimbatore' (Student)" }
      ],
      intro: "Horizontal fragmentation splits the relation by rows. Each student row goes to the site of its city.",
      rebuild: "Student = F1 ∪ F2 ∪ F3",
      rebuildMsg: "To rebuild Student, take the union (∪) of the three fragments. Every row comes back exactly once."
    },
    vertical: {
      name: "Vertical fragmentation",
      frags: [
        { n: 1, site: 0, keep: any, cols: [0, 1, 2], expr: "F1 = π RollNo, Name, Dept (Student)" },
        { n: 2, site: 1, keep: any, cols: [0, 3, 4], expr: "F2 = π RollNo, City, Marks (Student)" }
      ],
      intro: "Vertical fragmentation splits the relation by columns. The college office keeps the name and department; the exam cell keeps the city and marks. Both fragments keep the key RollNo.",
      rebuild: "Student = F1 ⋈ F2",
      rebuildMsg: "To rebuild Student, take the natural join (⋈) of F1 and F2 on RollNo. This works only because both fragments kept the key."
    },
    mixed: {
      name: "Mixed (hybrid) fragmentation",
      frags: [
        { n: 1, site: 0, keep: any, cols: [0, 1, 2], expr: "F1 = π RollNo, Name, Dept (Student)" },
        { n: 2, site: 1, keep: city("Chennai"), cols: [0, 3, 4], expr: "F2 = σ City='Chennai' (π RollNo, City, Marks (Student))" },
        {
          n: 3,
          site: 2,
          keep: function (r) {
            return r[3] !== "Chennai";
          },
          cols: [0, 3, 4],
          expr: "F3 = σ City≠'Chennai' (π RollNo, City, Marks (Student))"
        }
      ],
      intro: "Mixed fragmentation uses both splits. First the relation is split by columns. Then the second part is split again by rows.",
      rebuild: "Student = F1 ⋈ (F2 ∪ F3)",
      rebuildMsg: "To rebuild Student, first take the union of F2 and F3, then join the result with F1 on RollNo."
    },
    full: {
      name: "Full replication",
      frags: [
        { n: 1, site: 0, keep: any, cols: ALL, expr: "Copy of Student" },
        { n: 1, site: 1, keep: any, cols: ALL, expr: "Copy of Student" },
        { n: 1, site: 2, keep: any, cols: ALL, expr: "Copy of Student" }
      ],
      intro: "Full replication stores a complete copy of the relation at every site.",
      replicated: true
    },
    partial: {
      name: "Partial replication",
      frags: [
        { n: 1, site: 0, keep: city("Salem"), cols: ALL, expr: "F1 = σ City='Salem' (Student)" },
        { n: 2, site: 1, keep: city("Chennai"), cols: ALL, expr: "F2 = σ City='Chennai' (Student)" },
        { n: 1, site: 1, keep: city("Salem"), cols: ALL, expr: "F1 (copy)" },
        { n: 3, site: 2, keep: city("Coimbatore"), cols: ALL, expr: "F3 = σ City='Coimbatore' (Student)" }
      ],
      intro: "Partial replication copies only some fragments. Here each city keeps its own rows, and the Salem fragment is also copied to Chennai.",
      replicated: true
    }
  };

  function fragRows(f) {
    return ROWS.filter(f.keep).map(function (r) {
      return f.cols.map(function (c) {
        return r[c];
      });
    });
  }

  // Which fragment numbers hold cell (row r, column c).
  function cellFrags(m, r, c) {
    var out = [];
    METHODS[m].frags.forEach(function (f) {
      if (f.keep(ROWS[r]) && f.cols.indexOf(c) >= 0 && out.indexOf(f.n) < 0) out.push(f.n);
    });
    return out;
  }

  /* ---------- Frames ---------- */

  function frames(m) {
    var M = METHODS[m];
    var list = [];
    var placed = [];
    list.push({ m: m, placed: [], color: true, msg: M.intro + " The colors show where each cell will go." });
    M.frags.forEach(function (f, i) {
      placed = placed.concat([i]);
      var count = fragRows(f).length;
      list.push({
        m: m,
        placed: placed,
        color: true,
        focus: i,
        msg: (M.replicated && f.expr.indexOf("copy") >= 0 ? "A copy of F" + f.n : f.expr.indexOf("Copy") === 0 ? "A full copy of Student" : f.expr) +
          " is stored at " + SITES[f.site] + ". It has " + count + " rows and " + f.cols.length + " columns."
      });
    });
    if (!M.replicated) {
      list.push({ m: m, placed: placed, rebuilt: true, msg: M.rebuildMsg });
    } else if (m === "full") {
      list.push({ m: m, placed: placed, update: 1, msg: "An update changes Bala's marks from 72 to 75. All three copies must change, so updates cost more." });
      list.push({ m: m, placed: placed, update: 1, failed: 0, msg: "The Salem site fails. Any query can still run at Chennai or Coimbatore, so the data stays available." });
    } else {
      list.push({ m: m, placed: placed, failed: 0, msg: "The Salem site fails. The Salem rows are still available from the copy at Chennai. Coimbatore rows were never copied, so they would be lost if Coimbatore failed." });
    }
    return list;
  }

  /* ---------- Drawing ---------- */

  function table(cols, rows, opts) {
    var esc = D.wq.esc;
    opts = opts || {};
    var head = "<tr>" + cols.map(function (c, i) {
      var cls = opts.colClass ? opts.colClass(i) : "";
      return '<th scope="col"' + (cls ? ' class="' + cls + '"' : "") + ">" + esc(c) + "</th>";
    }).join("") + "</tr>";
    var body = rows.map(function (r, ri) {
      return "<tr>" + r.map(function (v, ci) {
        var cls = opts.cellClass ? opts.cellClass(ri, ci) : "";
        return "<td" + (cls ? ' class="' + cls + '"' : "") + ">" + esc(v) + "</td>";
      }).join("") + "</tr>";
    }).join("");
    return '<table class="frag-table"><caption>' + esc(opts.caption || "") + "</caption><thead>" + head + "</thead><tbody>" + body + "</tbody></table>";
  }

  function render(w, f) {
    var M = METHODS[f.m];
    var esc = D.wq.esc;
    var rows = ROWS.map(function (r, ri) {
      return r.map(function (v, ci) {
        return f.update && ri === f.update && ci === 4 ? 75 : v;
      });
    });
    var global = table(COLS, rows, {
      caption: f.rebuilt ? "Student, rebuilt: " + M.rebuild : "Student (global relation)",
      cellClass: function (ri, ci) {
        var cls = [];
        if (f.color && !M.replicated) {
          var fr = cellFrags(f.m, ri, ci);
          if (fr.length > 1) cls.push("frag-key");
          else if (fr.length) cls.push("frag-" + fr[0]);
        }
        if (f.rebuilt) cls.push("frag-ok");
        if (f.update && ri === f.update && ci === 4) cls.push("frag-new");
        return cls.join(" ");
      }
    });
    var sites = SITES.map(function (s, si) {
      var inner = "";
      f.placed.forEach(function (i) {
        var fr = M.frags[i];
        if (fr.site !== si) return;
        var fRows = ROWS.map(function (r, ri) {
          return { r: r, ri: ri };
        }).filter(function (x) {
          return fr.keep(x.r);
        });
        var data = fRows.map(function (x) {
          return fr.cols.map(function (c) {
            return f.update && x.ri === f.update && c === 4 ? 75 : x.r[c];
          });
        });
        inner += '<div class="frag-piece' + (f.focus === i ? " is-focus" : "") + '">' + table(fr.cols.map(function (c) {
          return COLS[c];
        }), data, {
          caption: fr.expr,
          cellClass: function (ri, ci) {
            var cls = M.replicated ? "frag-1" : (fr.cols[ci] === 0 && fr.cols.length < 5 ? "frag-key" : "frag-" + fr.n);
            if (f.update && fRows[ri].ri === f.update && fr.cols[ci] === 4) cls += " frag-new";
            return cls;
          }
        }) + "</div>";
      });
      var down = f.failed === si;
      return '<div class="frag-site' + (down ? " is-failed" : "") + '"><div class="frag-site-name">' + esc(s) + (down ? " (failed)" : "") + "</div>" +
        (inner || '<p class="frag-empty">No data stored here.</p>') + "</div>";
    }).join("");
    w.stage.innerHTML = '<div class="frag-global">' + global + '</div><div class="frag-net" aria-hidden="true">Network</div><div class="frag-sites">' + sites + "</div>";
  }

  /* ---------- Widget ---------- */

  function Widget(root) {
    var self = this;
    this.method = root.getAttribute("data-method");
    if (!METHODS[this.method]) this.method = "horizontal";
    root.innerHTML =
      '<div class="widget-head"><strong>Fragmentation and replication</strong></div>' +
      '<div class="widget-controls">' +
      '<label class="wp-field wp-grow"><span>How to store Student</span><select data-method>' +
      Object.keys(METHODS).map(function (k) {
        return '<option value="' + k + '">' + METHODS[k].name + "</option>";
      }).join("") +
      "</select></label></div>" +
      '<div class="widget-stage frag-stage" tabindex="0" aria-label="The Student relation and the three sites. Scroll sideways if needed."></div>' +
      "<div data-player></div>";
    this.stage = root.querySelector(".frag-stage");
    this.select = root.querySelector("[data-method]");
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (f) {
        render(self, f);
      },
      resetLabel: "Start again",
      onReset: function () {
        self.load(self.method);
      }
    });
    this.select.value = this.method;
    this.select.addEventListener("change", function () {
      self.load(self.select.value);
    });
    this.load(this.method);
  }

  Widget.prototype.load = function (m) {
    this.method = m;
    this.player.load(frames(m), false);
  };

  D.fragmentation = { METHODS: METHODS, ROWS: ROWS, COLS: COLS, frames: frames, fragRows: fragRows };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="fragmentation"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
