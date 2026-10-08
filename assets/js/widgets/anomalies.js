/* Concurrency anomaly player (widget V16) and isolation level matrix (widget V22).
   V16 plays two interleaved transactions step by step to show the lost update,
   dirty read, unrepeatable read and phantom problems. Each step shows the value
   in the database and in each transaction's own buffer.
   V22 lets the student pick an SQL isolation level, highlights its row of the
   matrix, and replays each problem at that level: either the problem happens,
   or the "prevented" version shows what the database does instead.
   Markup: <div class="widget" data-widget="anomaly-player" data-scenario="lost-update"></div>
           <div class="widget" data-widget="isolation-levels" data-level="read-committed"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  /* Each step: t (1 or 2), op (text in the T column), set (changes to db, t1 and
     t2), and msg (narration). The first entry "start" is the state before step 1. */
  var SCENARIOS = {
    "lost-update": {
      label: "Lost update",
      start: { db: { A: 1000 }, t1: {}, t2: {} },
      steps: [
        { t: 1, op: "read(A)", set: { t1: { A: 1000 } }, msg: "T1 reads A = 1000 into its buffer. T1 wants to withdraw ₹50." },
        { t: 2, op: "read(A)", set: { t2: { A: 1000 } }, msg: "T2 also reads A = 1000. T2 wants to deposit ₹100." },
        { t: 1, op: "A := A − 50", set: { t1: { A: 950 } }, msg: "T1 computes 950 in its own buffer." },
        { t: 1, op: "write(A)", set: { db: { A: 950 } }, msg: "T1 writes A = 950 to the database." },
        { t: 2, op: "A := A + 100", set: { t2: { A: 1100 } }, msg: "T2 adds 100 to the old value it read, 1000, and gets 1100." },
        { t: 2, op: "write(A)", set: { db: { A: 1100 } }, bad: true, msg: "T2 writes A = 1100 over T1's value. The correct balance is 1000 − 50 + 100 = 1050. T1's update is lost." }
      ],
      problem: "Lost update: T2 overwrote T1's update, because both read A before either wrote it.",
      fix: "With locks, T2 must wait for T1's exclusive lock on A, so it reads 950 and writes 1050."
    },
    "dirty-read": {
      label: "Dirty read (temporary update)",
      start: { db: { A: 1000 }, t1: {}, t2: {} },
      steps: [
        { t: 1, op: "read(A)", set: { t1: { A: 1000 } }, msg: "T1 reads A = 1000." },
        { t: 1, op: "A := A − 50", set: { t1: { A: 950 } }, msg: "T1 computes 950." },
        { t: 1, op: "write(A)", set: { db: { A: 950 } }, msg: "T1 writes A = 950, but it has not committed yet." },
        { t: 2, op: "read(A)", set: { t2: { A: 950 } }, bad: true, msg: "T2 reads A = 950. This value is not committed: it is a dirty read.", prevented: { set: { t2: { A: 1000 } }, msg: "T2 reads A. It gets 1000, the last committed value, not T1's uncommitted 950." } },
        { t: 2, op: "print(A)", set: {}, msg: "T2 uses the value it read, for example to print a statement." },
        { t: 1, op: "abort", set: { db: { A: 1000 } }, msg: "T1 fails and aborts. A is rolled back to 1000." },
        { t: 2, op: "commit", set: {}, bad: true, msg: "T2 commits, but it used A = 950, a value that never really existed.", prevented: { set: {}, msg: "T2 commits. It used A = 1000, which is correct." } }
      ],
      problem: "Dirty read: T2 read a value written by T1 before T1 committed, and T1 then aborted.",
      fix: "READ COMMITTED and higher levels let a transaction read only committed data."
    },
    "unrepeatable-read": {
      label: "Unrepeatable read",
      start: { db: { A: 1000 }, t1: {}, t2: {} },
      steps: [
        { t: 1, op: "read(A)", set: { t1: { A: 1000 } }, msg: "T1 reads A = 1000, for example to check the balance." },
        { t: 2, op: "read(A)", set: { t2: { A: 1000 } }, msg: "T2 reads A = 1000." },
        { t: 2, op: "A := A − 50", set: { t2: { A: 950 } }, msg: "T2 computes 950." },
        { t: 2, op: "write(A)", set: { db: { A: 950 } }, msg: "T2 writes A = 950." },
        { t: 2, op: "commit", set: {}, msg: "T2 commits. Its change is now committed." },
        { t: 1, op: "read(A)", set: { t1: { A: 950 } }, bad: true, msg: "T1 reads A again and gets 950. The same read in one transaction gave two different values.", prevented: { set: { t1: { A: 1000 } }, msg: "T1 reads A again and still gets 1000, the same value as before. Its reads are repeatable." } }
      ],
      problem: "Unrepeatable read: another transaction changed and committed A between T1's two reads.",
      fix: "REPEATABLE READ and SERIALIZABLE make a second read return the same value."
    },
    phantom: {
      label: "Phantom",
      start: { db: { "CSE students": "Asha, Bala, Charu" }, t1: {}, t2: {} },
      steps: [
        { t: 1, op: "SELECT COUNT(*) … dept = 'CSE'", set: { t1: { count: 3 } }, msg: "T1 counts the CSE students and gets 3." },
        { t: 2, op: "INSERT student Divya, 'CSE'", set: { db: { "CSE students": "Asha, Bala, Charu, Divya" } }, msg: "T2 inserts a new CSE student, Divya.", prevented: { set: {}, wait: true, msg: "T2 tries to insert Divya. T1 has locked the range dept = 'CSE', so T2 must wait." } },
        { t: 2, op: "commit", set: {}, msg: "T2 commits.", prevented: { set: {}, wait: true, msg: "T2 is still waiting for T1." } },
        { t: 1, op: "SELECT COUNT(*) … dept = 'CSE'", set: { t1: { count: 4 } }, bad: true, msg: "T1 runs the same query and now gets 4. A new row, a phantom, has appeared.", prevented: { set: { t1: { count: 3 } }, msg: "T1 runs the same query and gets 3 again. No phantom." } },
        { t: 1, op: "commit", set: {}, msg: "T1 commits.", prevented: { set: { db: { "CSE students": "Asha, Bala, Charu, Divya" } }, msg: "T1 commits and releases its locks. Now T2's insert runs and T2 commits." } }
      ],
      problem: "Phantom: a row inserted and committed by T2 appeared when T1 repeated a query over a range of rows.",
      fix: "Only SERIALIZABLE prevents phantoms in the SQL standard, by locking the range (or the index) and not just the rows read."
    }
  };

  // Which phenomena each level allows (true = can happen), from the SQL standard.
  var LEVELS = {
    "read-uncommitted": { label: "READ UNCOMMITTED", allows: { "dirty-read": true, "unrepeatable-read": true, phantom: true } },
    "read-committed": { label: "READ COMMITTED", allows: { "dirty-read": false, "unrepeatable-read": true, phantom: true } },
    "repeatable-read": { label: "REPEATABLE READ", allows: { "dirty-read": false, "unrepeatable-read": false, phantom: true } },
    serializable: { label: "SERIALIZABLE", allows: { "dirty-read": false, "unrepeatable-read": false, phantom: false } }
  };
  var PHENOMENA = ["dirty-read", "unrepeatable-read", "phantom"];

  /* ---------- Frames ---------- */

  function copy(st) {
    return { db: Object.assign({}, st.db), t1: Object.assign({}, st.t1), t2: Object.assign({}, st.t2) };
  }

  function build(name, prevent) {
    var sc = SCENARIOS[name];
    var st = copy(sc.start);
    var frames = [{ at: -1, st: copy(st), msg: (prevent ? "This time the problem is prevented. " : "") + "Two transactions run at the same time. Press Next to run one step." }];
    sc.steps.forEach(function (s, i) {
      var step = prevent && s.prevented ? s.prevented : s;
      ["db", "t1", "t2"].forEach(function (k) {
        Object.assign(st[k], (step.set || {})[k] || {});
      });
      frames.push({ at: i, st: copy(st), bad: !prevent && s.bad, wait: step.wait, msg: step.msg });
    });
    frames.push({ at: sc.steps.length, st: copy(st), msg: prevent ? sc.fix : sc.problem, end: prevent ? "ok" : "bad" });
    return frames;
  }

  /* ---------- Drawing ---------- */

  function vals(obj) {
    var keys = Object.keys(obj);
    if (!keys.length) return '<span class="muted">empty</span>';
    return keys.map(function (k) {
      return '<div class="an-val"><span class="an-key">' + D.wq.esc(k) + "</span> " + D.wq.esc(obj[k]) + "</div>";
    }).join("");
  }

  function render(stage, name, f, prevent) {
    var esc = D.wq.esc;
    var sc = SCENARIOS[name];
    var rows = sc.steps.map(function (s, i) {
      var step = prevent && s.prevented ? s.prevented : s;
      var cls = i === f.at ? (f.bad ? "is-bad" : "is-current") : i < f.at ? "is-done" : "is-todo";
      if (step.wait && i <= f.at) cls += " is-wait";
      var cell = esc(s.op) + (step.wait && i <= f.at ? ' <span class="an-wait">waits</span>' : "");
      return '<tr class="' + cls + '"><td class="an-n">' + (i + 1) + "</td><td>" + (s.t === 1 ? cell : "") + "</td><td>" + (s.t === 2 ? cell : "") + "</td></tr>";
    }).join("");
    var table = '<table class="an-table"><caption class="visually-hidden">' + esc(sc.label) + ': the steps of T1 and T2</caption><thead><tr><th scope="col">#</th><th scope="col">T1</th><th scope="col">T2</th></tr></thead><tbody>' + rows + "</tbody></table>";
    var side = '<div class="an-side">' +
      '<div class="an-box an-db"><div class="an-cap">Database</div>' + vals(f.st.db) + "</div>" +
      '<div class="an-box"><div class="an-cap">T1 buffer</div>' + vals(f.st.t1) + "</div>" +
      '<div class="an-box"><div class="an-cap">T2 buffer</div>' + vals(f.st.t2) + "</div>" +
      "</div>";
    var end = f.end ? '<p class="an-end ' + (f.end === "bad" ? "is-bad" : "is-ok") + '">' + (f.end === "bad" ? "✕ " : "✓ ") + esc(f.msg) + "</p>" : "";
    stage.innerHTML = '<div class="an-layout"><div class="an-left">' + table + "</div>" + side + "</div>" + end;
  }

  /* ---------- V16 widget ---------- */

  function AnomalyWidget(root) {
    var self = this;
    this.name = root.getAttribute("data-scenario");
    if (!SCENARIOS[this.name]) this.name = "lost-update";
    root.innerHTML =
      '<div class="widget-head"><strong>Concurrency problems</strong></div>' +
      '<div class="widget-controls">' +
      '<label class="wp-field wp-grow"><span>Problem</span><select data-scenario>' +
      Object.keys(SCENARIOS).map(function (k) {
        return '<option value="' + k + '">' + SCENARIOS[k].label + "</option>";
      }).join("") +
      "</select></label></div>" +
      '<div class="widget-stage an-stage" tabindex="0" aria-label="Steps of the two transactions and their values"></div>' +
      "<div data-player></div>";
    this.stage = root.querySelector(".an-stage");
    this.select = root.querySelector("[data-scenario]");
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (f) {
        render(self.stage, self.name, f, false);
      },
      resetLabel: "Start again",
      onReset: function () {
        self.load(self.name);
      }
    });
    this.select.value = this.name;
    this.select.addEventListener("change", function () {
      self.load(self.select.value);
    });
    this.load(this.name);
  }

  AnomalyWidget.prototype.load = function (name) {
    this.name = name;
    this.player.load(build(name, false), false);
  };

  /* ---------- V22 widget ---------- */

  function IsolationWidget(root) {
    var self = this;
    this.level = root.getAttribute("data-level");
    if (!LEVELS[this.level]) this.level = "read-committed";
    this.name = "dirty-read";
    root.innerHTML =
      '<div class="widget-head"><strong>Isolation levels</strong></div>' +
      '<div class="widget-controls">' +
      '<label class="wp-field wp-grow"><span>Isolation level</span><select data-level>' +
      Object.keys(LEVELS).map(function (k) {
        return '<option value="' + k + '">' + LEVELS[k].label + "</option>";
      }).join("") +
      "</select></label>" +
      '<label class="wp-field wp-grow"><span>Problem to replay</span><select data-scenario>' +
      PHENOMENA.map(function (k) {
        return '<option value="' + k + '">' + SCENARIOS[k].label.replace(/ \(.*\)/, "") + "</option>";
      }).join("") +
      "</select></label></div>" +
      '<div class="il-matrix" data-matrix></div>' +
      '<p class="wp-meta il-verdict" data-verdict></p>' +
      '<div class="widget-stage an-stage" tabindex="0" aria-label="Steps of the two transactions and their values"></div>' +
      "<div data-player></div>";
    this.stage = root.querySelector(".an-stage");
    this.matrix = root.querySelector("[data-matrix]");
    this.verdict = root.querySelector("[data-verdict]");
    this.levelSel = root.querySelector("[data-level]");
    this.nameSel = root.querySelector("[data-scenario]");
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (f) {
        render(self.stage, self.name, f, self.prevent);
      },
      resetLabel: "Start again",
      onReset: function () {
        self.load();
      }
    });
    this.levelSel.value = this.level;
    this.levelSel.addEventListener("change", function () {
      self.level = self.levelSel.value;
      self.load();
    });
    this.nameSel.addEventListener("change", function () {
      self.name = self.nameSel.value;
      self.load();
    });
    this.load();
  }

  IsolationWidget.prototype.load = function () {
    var self = this;
    var esc = D.wq.esc;
    var allows = LEVELS[this.level].allows[this.name];
    this.prevent = !allows;
    var head = '<table class="il-table"><caption class="visually-hidden">Problems each isolation level allows</caption><thead><tr><th scope="col">Isolation level</th>' +
      PHENOMENA.map(function (p) {
        return '<th scope="col" class="' + (p === self.name ? "is-col" : "") + '">' + esc(SCENARIOS[p].label.replace(/ \(.*\)/, "")) + "</th>";
      }).join("") + "</tr></thead><tbody>";
    Object.keys(LEVELS).forEach(function (k) {
      head += '<tr class="' + (k === self.level ? "is-row" : "") + '"><th scope="row">' + LEVELS[k].label + "</th>" +
        PHENOMENA.map(function (p) {
          var a = LEVELS[k].allows[p];
          return '<td class="' + (a ? "is-allowed" : "is-prevented") + (k === self.level && p === self.name ? " is-pick" : "") + '">' + (a ? "Possible" : "Prevented") + "</td>";
        }).join("") + "</tr>";
    });
    this.matrix.innerHTML = head + "</tbody></table>";
    this.verdict.textContent = "At " + LEVELS[this.level].label + ", a " + SCENARIOS[this.name].label.replace(/ \(.*\)/, "").toLowerCase() + " is " + (allows ? "possible. Watch it happen." : "prevented. Watch what the database does instead.");
    this.player.load(build(this.name, this.prevent), false);
  };

  D.anomalies = { SCENARIOS: SCENARIOS, LEVELS: LEVELS, build: build };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="anomaly-player"]').forEach(function (box) {
      new AnomalyWidget(box);
    });
    document.querySelectorAll('[data-widget="isolation-levels"]').forEach(function (box) {
      new IsolationWidget(box);
    });
  });
})();
