/* Query tree optimizer (widget V30).
   Shows a SQL query as a relational algebra query tree, then applies heuristic
   rules one step at a time. After each step the widget estimates the size of
   every intermediate result from simple statistics (number of rows, bytes per
   attribute and the selectivity of each condition), so the student can see the
   cost go down. The trees for each step are written out in PRESETS; the sizes
   are computed. Needs player.js.
   Markup: <div class="widget" data-widget="query-tree" data-preset="college"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  // Tree builders.
  function R(name) {
    return { op: "rel", name: name };
  }
  function S(conds, child) {
    return { op: "sel", conds: conds, kids: [child] };
  }
  function P(attrs, child) {
    return { op: "proj", attrs: attrs, kids: [child] };
  }
  function J(conds, a, b) {
    return { op: "join", conds: conds, kids: [a, b] };
  }
  function X(a, b) {
    return { op: "prod", kids: [a, b] };
  }

  var PRESETS = {
    college: {
      label: "College: CSE students who take the DBMS course",
      sql: "SELECT name\nFROM student, enroll, course\nWHERE student.roll_no = enroll.roll_no\n  AND enroll.course_id = course.course_id\n  AND course.title = 'DBMS'\n  AND student.dept = 'CSE';",
      rels: {
        STUDENT: { rows: 5000, attrs: { roll_no: 4, name: 30, dept: 4, year: 2 } },
        ENROLL: { rows: 40000, attrs: { roll_no: 4, course_id: 6, grade: 2 } },
        COURSE: { rows: 200, attrs: { course_id: 6, title: 40, credits: 2 } }
      },
      conds: {
        dept: { text: "dept = 'CSE'", sel: 1 / 8, why: "8 departments" },
        title: { text: "title = 'DBMS'", sel: 1 / 200, why: "200 different titles" },
        se: { text: "S.roll_no = E.roll_no", sel: 1 / 5000, why: "roll_no is the key of STUDENT" },
        ec: { text: "E.course_id = C.course_id", sel: 1 / 200, why: "course_id is the key of COURSE" }
      },
      steps: [
        {
          rule: "Initial (canonical) query tree",
          text: "The parser turns the FROM clause into Cartesian products (×), the WHERE clause into one selection (σ) and the SELECT clause into a projection (π). This tree is correct, but it builds every combination of rows first.",
          tree: P(["name"], S(["se", "ec", "title", "dept"], X(X(R("STUDENT"), R("ENROLL")), R("COURSE"))))
        },
        {
          rule: "Rule 1: perform selections as early as possible",
          text: "Split the selection into one condition at a time, then move each condition down to the lowest point where its attributes are available. dept = 'CSE' goes onto STUDENT, and title = 'DBMS' goes onto COURSE.",
          tree: P(["name"], S(["ec"], X(S(["se"], X(S(["dept"], R("STUDENT")), R("ENROLL"))), S(["title"], R("COURSE")))))
        },
        {
          rule: "Rule 2: apply the most restrictive selection first",
          text: "title = 'DBMS' leaves only 1 row of COURSE, so reorder the leaves and join COURSE with ENROLL first. The intermediate results become much smaller.",
          tree: P(["name"], S(["se"], X(S(["ec"], X(S(["title"], R("COURSE")), R("ENROLL"))), S(["dept"], R("STUDENT")))))
        },
        {
          rule: "Rule 3: replace × followed by σ with a join (⋈)",
          text: "A Cartesian product followed by a selection on the join condition is a join. A join algorithm never builds the full product.",
          tree: P(["name"], J(["se"], J(["ec"], S(["title"], R("COURSE")), R("ENROLL")), S(["dept"], R("STUDENT"))))
        },
        {
          rule: "Rule 4: perform projections as early as possible",
          text: "Keep only the attributes that later steps need. The rows are the same, but each row is smaller, so less data moves between steps.",
          tree: P(["name"], J(["se"], P(["roll_no"], J(["ec"], P(["course_id"], S(["title"], R("COURSE"))), P(["roll_no", "course_id"], R("ENROLL")))), P(["roll_no", "name"], S(["dept"], R("STUDENT")))))
        }
      ]
    },
    bank: {
      label: "Class notes: customers with an account at a branch in Pune",
      sql: "SELECT cname\nFROM branch, account, customer\nWHERE branch.branch_name = account.branch_name\n  AND account.acc_no = customer.acc_no\n  AND branch.city = 'Pune';",
      rels: {
        BRANCH: { rows: 100, attrs: { branch_name: 20, city: 20, assets: 8 } },
        ACCOUNT: { rows: 50000, attrs: { acc_no: 8, branch_name: 20, balance: 8 } },
        CUSTOMER: { rows: 50000, attrs: { cname: 30, acc_no: 8, street: 30 } }
      },
      conds: {
        city: { text: "city = 'Pune'", sel: 1 / 20, why: "20 cities" },
        ba: { text: "B.branch_name = A.branch_name", sel: 1 / 100, why: "branch_name is the key of BRANCH" },
        ac: { text: "A.acc_no = C.acc_no", sel: 1 / 50000, why: "acc_no is the key of ACCOUNT" }
      },
      steps: [
        {
          rule: "Tree (a) in the class notes",
          text: "Join all three relations, then select the branches in Pune, then project cname. Every account and customer row takes part in the joins.",
          tree: P(["cname"], S(["city"], J(["ac"], J(["ba"], R("BRANCH"), R("ACCOUNT")), R("CUSTOMER"))))
        },
        {
          rule: "Tree (b): perform the selection early",
          text: "Move city = 'Pune' down onto BRANCH. Only 5 branches are left before the join. This is tree (b) in the class notes.",
          tree: P(["cname"], J(["ba"], S(["city"], R("BRANCH")), J(["ac"], R("ACCOUNT"), R("CUSTOMER"))))
        },
        {
          rule: "Most restrictive join first",
          text: "Tree (b) still joins all of ACCOUNT with all of CUSTOMER. Join the 5 Pune branches with ACCOUNT first; then only their accounts meet CUSTOMER.",
          tree: P(["cname"], J(["ac"], J(["ba"], S(["city"], R("BRANCH")), R("ACCOUNT")), R("CUSTOMER")))
        },
        {
          rule: "Perform projections early",
          text: "Keep only branch_name, acc_no and cname, the attributes that the joins and the result need.",
          tree: P(["cname"], J(["ac"], P(["acc_no"], J(["ba"], P(["branch_name"], S(["city"], R("BRANCH"))), P(["acc_no", "branch_name"], R("ACCOUNT")))), P(["cname", "acc_no"], R("CUSTOMER"))))
        }
      ]
    },
    simple: {
      label: "Class notes: SELECT balance FROM account WHERE balance < 1000",
      sql: "SELECT balance\nFROM account\nWHERE balance < 1000;",
      rels: {
        ACCOUNT: { rows: 50000, attrs: { acc_no: 8, branch_name: 20, balance: 8 } }
      },
      conds: {
        bal: { text: "balance < 1000", sel: 1 / 5, why: "about one account in five" }
      },
      steps: [
        {
          rule: "Expression 1: π first, then σ",
          text: "σ balance < 1000 (π balance (account)). Project the balance column, then select the small balances.",
          tree: S(["bal"], P(["balance"], R("ACCOUNT")))
        },
        {
          rule: "Expression 2: σ first, then π",
          text: "π balance (σ balance < 1000 (account)). Both expressions give the same answer. For this small query the two cost about the same. The choice of algorithm matters more here, for example using an index on balance instead of reading the whole file.",
          tree: P(["balance"], S(["bal"], R("ACCOUNT")))
        }
      ]
    }
  };

  /* ---------- Estimates ---------- */

  // Fills in rows, width (bytes per row) and attrs for every node. Returns the bytes in all
  // intermediate results. Reading a relation costs the same in every tree, so it is not
  // counted. A projection is done on the fly as rows come up from the step below it, so
  // a result that feeds straight into a projection is not counted, and neither is a
  // projection applied while a relation is read.
  function estimate(node, preset) {
    var total = 0;
    (function visit(n, parent) {
      (n.kids || []).forEach(function (k) {
        visit(k, n);
      });
      var k = n.kids || [];
      if (n.op === "rel") {
        var r = preset.rels[n.name];
        n.rows = r.rows;
        n.attrs = Object.keys(r.attrs).map(function (a) {
          return [a, r.attrs[a]];
        });
      } else if (n.op === "sel") {
        n.rows = k[0].rows * n.conds.reduce(function (p, c) {
          return p * preset.conds[c].sel;
        }, 1);
        n.attrs = k[0].attrs;
      } else if (n.op === "proj") {
        n.rows = k[0].rows;
        n.attrs = n.attrs.map(function (a) {
          var hit = k[0].attrs.filter(function (x) {
            return x[0] === a;
          })[0];
          return [a, hit ? hit[1] : 4];
        });
      } else {
        n.rows = k[0].rows * k[1].rows * (n.conds || []).reduce(function (p, c) {
          return p * preset.conds[c].sel;
        }, 1);
        n.attrs = k[0].attrs.concat(k[1].attrs);
      }
      n.rows = Math.max(1, Math.round(n.rows));
      n.width = n.attrs.reduce(function (s, a) {
        return s + a[1];
      }, 0);
      var counted = n.op !== "rel" && !(parent && parent.op === "proj") && !(n.op === "proj" && k[0].op === "rel");
      if (counted) total += n.rows * n.width;
    })(node, null);
    return total;
  }

  function bytes(b) {
    var units = ["bytes", "KB", "MB", "GB", "TB"];
    var i = 0;
    while (b >= 1000 && i < units.length - 1) {
      b /= 1000;
      i += 1;
    }
    return (i === 0 ? Math.round(b) : b < 10 ? b.toFixed(1) : Math.round(b)) + " " + units[i];
  }

  // 3 → "3", 256585 → "260,000"
  function factor(x) {
    if (x < 100) return String(Math.round(x));
    var p = Math.pow(10, Math.floor(Math.log10(x)) - 1);
    return (Math.round(x / p) * p).toLocaleString("en-US");
  }

  function rows(n) {
    return n >= 1e6 ? (n / 1e6 >= 1000 ? (n / 1e9).toFixed(n / 1e9 < 10 ? 1 : 0) + " billion" : (n / 1e6).toFixed(n / 1e6 < 10 ? 1 : 0) + " million") : n.toLocaleString("en-US");
  }

  function label(n, preset) {
    if (n.op === "rel") return n.name;
    if (n.op === "proj") return "π " + n.attrs.map(function (a) {
      return a[0];
    }).join(", ");
    var c = (n.conds || []).map(function (x) {
      return preset.conds[x].text;
    }).join(" ∧ ");
    if (n.op === "sel") return "σ " + c;
    if (n.op === "join") return "⋈ " + c;
    return "×";
  }

  function copy(t) {
    return JSON.parse(JSON.stringify(t));
  }

  function frames(key) {
    var p = PRESETS[key];
    var first = null;
    return p.steps.map(function (s, i) {
      var tree = copy(s.tree);
      var total = estimate(tree, p);
      if (first === null) first = total;
      var cmp = i === 0 ? "" : total < first / 1.5 ? " The first tree produced about " + factor(first / total) + " times as much." : " This is about the same as the first tree.";
      return {
        tree: tree,
        total: total,
        rule: s.rule,
        msg: "Step " + (i + 1) + ". " + s.rule + ". " + s.text + " Estimated size of the intermediate results: " + bytes(total) + "." + cmp,
        preset: key
      };
    });
  }

  /* ---------- Drawing ---------- */

  var SVG = "http://www.w3.org/2000/svg";
  function el(name, attrs, parent) {
    var e = document.createElementNS(SVG, name);
    for (var a in attrs) e.setAttribute(a, attrs[a]);
    if (parent) parent.appendChild(e);
    return e;
  }

  var CH = 8.2; // approximate width of one character
  var BOX_H = 44;
  var LEVEL = 80;
  var GAP = 16;

  function sizeText(n) {
    return "≈ " + rows(n.rows) + " row" + (n.rows === 1 ? "" : "s");
  }

  // Each subtree gets a horizontal span wide enough for its root and all its children.
  function layout(tree, preset) {
    var depthMax = 0;
    (function measure(n, depth) {
      depthMax = Math.max(depthMax, depth);
      n.depth = depth;
      n.text = label(n, preset);
      n.w = Math.max(70, Math.max(n.text.length, sizeText(n).length * 0.85) * CH + 20);
      var kids = n.kids || [];
      kids.forEach(function (k) {
        measure(k, depth + 1);
      });
      n.kidsSpan = kids.reduce(function (sum, k) {
        return sum + k.span;
      }, 0) + GAP * Math.max(0, kids.length - 1);
      n.span = Math.max(n.w, n.kidsSpan);
    })(tree, 0);
    (function place(n, left) {
      var kids = n.kids || [];
      if (!kids.length) {
        n.x = left + n.span / 2;
        return;
      }
      var at = left + (n.span - n.kidsSpan) / 2;
      kids.forEach(function (k) {
        place(k, at);
        at += k.span + GAP;
      });
      var mid = (kids[0].x + kids[kids.length - 1].x) / 2;
      n.x = Math.min(Math.max(mid, left + n.w / 2), left + n.span - n.w / 2);
    })(tree, 10);
    return { width: tree.span + 20, height: (depthMax + 1) * LEVEL - (LEVEL - BOX_H) + 16 };
  }

  function draw(svg, f) {
    var preset = PRESETS[f.preset];
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var L = layout(f.tree, preset);
    var stage = svg.parentNode;
    var room = stage && stage.clientWidth ? stage.clientWidth - 32 : L.width;
    var scale = Math.max(0.6, Math.min(1, room / L.width));
    svg.setAttribute("viewBox", "0 0 " + Math.ceil(L.width) + " " + Math.ceil(L.height));
    svg.setAttribute("width", Math.ceil(L.width * scale));
    svg.setAttribute("height", Math.ceil(L.height * scale));
    var edges = el("g", {}, svg);
    var nodes = el("g", {}, svg);
    (function visit(n) {
      var y = 8 + n.depth * LEVEL;
      (n.kids || []).forEach(function (k) {
        el("line", { x1: n.x, y1: y + BOX_H, x2: k.x, y2: 8 + k.depth * LEVEL, class: "qt-edge" }, edges);
        visit(k);
      });
      var g = el("g", { class: "qt-node qt-" + n.op }, nodes);
      el("rect", { x: n.x - n.w / 2, y: y, width: n.w, height: BOX_H, rx: 6, class: "qt-box" }, g);
      var t = el("text", { x: n.x, y: y + 17, "text-anchor": "middle", "dominant-baseline": "middle", class: "qt-label" }, g);
      t.textContent = n.text;
      var s = el("text", { x: n.x, y: y + 34, "text-anchor": "middle", "dominant-baseline": "middle", class: "qt-size" }, g);
      s.textContent = sizeText(n);
    })(f.tree);
  }

  function describe(tree) {
    var lines = [];
    (function visit(n, depth) {
      lines.push(new Array(depth + 1).join("    ") + n.text + "  (about " + rows(n.rows) + " rows of " + n.width + " bytes)");
      (n.kids || []).forEach(function (k) {
        visit(k, depth + 1);
      });
    })(tree, 0);
    return lines;
  }

  /* ---------- Widget ---------- */

  var count = 0;

  function Widget(root) {
    var self = this;
    count += 1;
    var u = "qt-" + count;
    this.key = PRESETS[root.getAttribute("data-preset")] ? root.getAttribute("data-preset") : "college";
    root.innerHTML =
      '<div class="widget-head"><strong>Query tree optimizer</strong></div>' +
      '<div class="widget-controls">' +
      '<label class="wp-field wp-grow"><span>Query</span><select data-preset>' +
      Object.keys(PRESETS).map(function (k) {
        return '<option value="' + k + '">' + PRESETS[k].label + "</option>";
      }).join("") + "</select></label>" +
      "</div>" +
      '<div class="qt-info"><pre class="qt-sql" data-sql></pre><div class="qt-stats" data-stats></div></div>' +
      '<p class="wp-meta qt-rule" data-rule></p>' +
      '<div class="widget-stage qt-stage" tabindex="0" aria-label="Query tree. Scroll sideways if it is wide."><svg class="qt-svg" role="img" aria-labelledby="' + u + '-text"></svg></div>' +
      '<p class="wp-meta" data-total></p>' +
      "<div data-player></div>" +
      '<details class="bpt-text"><summary>Show the tree as text</summary><pre class="qt-text" id="' + u + '-text" data-text></pre></details>';
    this.svg = root.querySelector("svg");
    this.text = root.querySelector("[data-text]");
    this.ruleEl = root.querySelector("[data-rule]");
    this.totalEl = root.querySelector("[data-total]");
    this.sqlEl = root.querySelector("[data-sql]");
    this.statsEl = root.querySelector("[data-stats]");
    this.select = root.querySelector("[data-preset]");
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (f) {
        draw(self.svg, f);
        self.text.textContent = describe(f.tree).join("\n");
        self.ruleEl.textContent = f.rule;
        var first = self.player.frames[0].total;
        self.totalEl.textContent = "Estimated size of all intermediate results: " + bytes(f.total) + (f === self.player.frames[0] ? "" : " (first tree: " + bytes(first) + ")");
      },
      resetLabel: "First tree",
      onReset: function () {
        self.player.show(0);
      }
    });
    this.select.value = this.key;
    this.select.addEventListener("change", function () {
      self.load(self.select.value);
    });
    this.load(this.key);
  }

  Widget.prototype.load = function (key) {
    var p = PRESETS[key];
    this.key = key;
    this.sqlEl.textContent = p.sql;
    var esc = D.wq.esc;
    this.statsEl.innerHTML = '<table><caption>Statistics used for the estimates</caption><thead><tr><th scope="col">Relation</th><th scope="col">Rows</th><th scope="col">Bytes per row</th></tr></thead><tbody>' +
      Object.keys(p.rels).map(function (r) {
        var x = p.rels[r];
        var w = Object.keys(x.attrs).reduce(function (s, a) {
          return s + x.attrs[a];
        }, 0);
        return "<tr><td>" + r + "</td><td>" + x.rows.toLocaleString("en-US") + "</td><td>" + w + "</td></tr>";
      }).join("") + "</tbody></table>" +
      '<ul class="qt-conds">' + Object.keys(p.conds).map(function (c) {
        var x = p.conds[c];
        return "<li><code>" + esc(x.text) + "</code> keeps 1/" + Math.round(1 / x.sel).toLocaleString("en-US") + " of the rows (" + esc(x.why) + ")</li>";
      }).join("") + "</ul>";
    this.player.load(frames(key));
  };

  D.queryTree = { frames: frames, PRESETS: PRESETS };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="query-tree"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
