/* Transaction state diagram (widget V15).
   Steps the funds-transfer transaction T (₹50 from account A to account B)
   through the five transaction states: active, partially committed, committed,
   failed and aborted. Each step shows which statement ran, the values in the
   transaction's buffer and on disk, and the state arrow that was followed.
   Markup: <div class="widget" data-widget="transaction-states" data-scenario="commit"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  var STATES = {
    active: { label: "Active", x: 10, y: 106 },
    partial: { label: "Partially committed", x: 250, y: 20 },
    failed: { label: "Failed", x: 250, y: 192 },
    committed: { label: "Committed", x: 570, y: 20 },
    aborted: { label: "Aborted", x: 570, y: 192 }
  };
  var W = 160;
  var H = 48;

  // Each arrow: start and end points, and where its label goes.
  var EDGES = {
    "active-partial": { from: "active", to: "partial", label: "last statement runs", line: [170, 120, 250, 50], at: [204, 70, "end"] },
    "active-failed": { from: "active", to: "failed", label: "error", line: [170, 140, 250, 210], at: [200, 196, "end"] },
    "partial-committed": { from: "partial", to: "committed", label: "commit record on disk", line: [410, 44, 570, 44], at: [490, 36, "middle"] },
    "partial-failed": { from: "partial", to: "failed", label: "failure", line: [330, 68, 330, 192], at: [338, 134, "start"] },
    "failed-aborted": { from: "failed", to: "aborted", label: "rolled back", line: [410, 216, 570, 216], at: [490, 208, "middle"] }
  };

  var STATEMENTS = ["read(A)", "A := A − 50", "write(A)", "read(B)", "B := B + 50", "write(B)"];

  var SCENARIOS = {
    commit: "T runs to the end and commits",
    error: "T fails in the middle (an error)",
    crash: "Power fails before the commit record is on disk"
  };

  /* ---------- Building the frames ---------- */

  function build(name) {
    var frames = [];
    var st = { state: "active", edge: null, done: 0, buf: { A: "", B: "" }, disk: { A: 1000, B: 2000 }, path: ["active"] };
    function snap(msg) {
      frames.push({
        msg: msg,
        st: { state: st.state, edge: st.edge, done: st.done, buf: { A: st.buf.A, B: st.buf.B }, disk: { A: st.disk.A, B: st.disk.B }, path: st.path.slice() }
      });
      st.edge = null;
    }
    function go(to) {
      st.edge = st.state + "-" + to;
      st.state = to;
      st.path.push(to);
    }
    function run(n, msg) {
      for (var i = 0; i < n; i++) {
        var s = STATEMENTS[st.done];
        if (s === "read(A)") st.buf.A = st.disk.A;
        if (s === "A := A − 50") st.buf.A = st.buf.A - 50;
        if (s === "write(A)") st.disk.A = st.buf.A;
        if (s === "read(B)") st.buf.B = st.disk.B;
        if (s === "B := B + 50") st.buf.B = st.buf.B + 50;
        if (s === "write(B)") st.disk.B = st.buf.B;
        st.done += 1;
      }
      snap(msg);
    }

    snap("T starts. It is in the active state. A = ₹1000 and B = ₹2000, so A + B = ₹3000.");
    if (name === "commit") {
      run(3, "T reads A, takes away ₹50 and writes A. T is still active.");
      run(2, "T reads B and adds ₹50 in its buffer. T is still active.");
      go("partial");
      run(1, "T runs its last statement, write(B). T is now partially committed. Its changes may still be only in main memory.");
      go("committed");
      snap("The commit record of T reaches the log on disk, so T is committed. A + B is still ₹3000. Even if the system fails now, the changes will survive (durability).");
    } else if (name === "error") {
      run(3, "T reads A, takes away ₹50 and writes A = ₹950.");
      go("failed");
      snap("An error stops T before it changes B (for example, account B is closed). T cannot go on, so it is failed. Right now A + B is only ₹2950.");
      st.disk.A = 1000;
      st.buf = { A: "", B: "" };
      go("aborted");
      snap("The recovery system uses the log to undo write(A). A is back to ₹1000. T is rolled back, so it is aborted. Atomicity is kept: none of T happened.");
      snap("After an abort, the system can restart T (if the error was not in T's own logic) or kill T (if T itself is wrong).");
    } else if (name === "crash") {
      run(5, "T runs its first five statements. A = ₹950 is written; B + 50 is in the buffer.");
      go("partial");
      run(1, "T runs write(B), its last statement. T is partially committed, but its commit record is not yet on disk.");
      go("failed");
      snap("The power fails before the commit record is written to disk. A partially committed transaction can still fail, so T moves to failed.");
      st.disk.A = 1000;
      st.disk.B = 2000;
      st.buf = { A: "", B: "" };
      go("aborted");
      snap("On restart, the log has no commit record for T, so recovery undoes T. A = ₹1000 and B = ₹2000 again. T is aborted.");
    }
    return frames;
  }

  /* ---------- Drawing ---------- */

  function render(w, f) {
    var esc = D.wq.esc;
    var st = f.st;
    var svg = '<svg class="ts-svg" viewBox="0 0 740 250" width="740" height="250" role="img" aria-label="Transaction state diagram. The current state is ' + esc(STATES[st.state].label) + '.">';
    svg += '<defs><marker id="' + w.uid + '-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="ts-head"/></marker>' +
      '<marker id="' + w.uid + '-arrow-on" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="ts-head is-on"/></marker></defs>';
    Object.keys(EDGES).forEach(function (k) {
      var e = EDGES[k];
      var l = { x1: e.line[0], y1: e.line[1], x2: e.line[2], y2: e.line[3] };
      var on = st.edge === k;
      var used = st.path.join(" ").indexOf(e.from + " " + e.to) >= 0;
      svg += '<line class="ts-edge' + (on ? " is-on" : used ? " is-used" : "") + '" x1="' + l.x1 + '" y1="' + l.y1 + '" x2="' + l.x2 + '" y2="' + l.y2 + '" marker-end="url(#' + w.uid + (on ? "-arrow-on" : "-arrow") + ')"/>';
      svg += '<text class="ts-elabel' + (on ? " is-on" : "") + '" x="' + e.at[0] + '" y="' + e.at[1] + '" text-anchor="' + e.at[2] + '">' + esc(e.label) + "</text>";
    });
    Object.keys(STATES).forEach(function (k) {
      var s = STATES[k];
      var cls = "ts-state" + (st.state === k ? " is-current" : st.path.indexOf(k) >= 0 ? " is-visited" : "") + (k === "committed" || k === "aborted" ? " is-final" : "");
      svg += '<g class="' + cls + '"><rect x="' + s.x + '" y="' + s.y + '" width="' + W + '" height="' + H + '" rx="24"/>' +
        (k === "committed" || k === "aborted" ? '<rect class="ts-inner" x="' + (s.x + 4) + '" y="' + (s.y + 4) + '" width="' + (W - 8) + '" height="' + (H - 8) + '" rx="20"/>' : "") +
        '<text x="' + (s.x + W / 2) + '" y="' + (s.y + H / 2 + 5) + '" text-anchor="middle">' + esc(s.label) + "</text></g>";
    });
    svg += "</svg>";

    var rows = STATEMENTS.map(function (s, i) {
      return '<li class="' + (i < st.done ? "is-done" : i === st.done && (st.state === "active") ? "is-next" : "") + '">' + esc(s) + "</li>";
    }).join("");
    var side =
      '<div class="ts-side">' +
      '<div><div class="ts-cap">Statements of T</div><ol class="ts-steps">' + rows + "</ol></div>" +
      '<div><div class="ts-cap">Values</div><table class="ts-vals"><thead><tr><th scope="col"></th><th scope="col">A</th><th scope="col">B</th><th scope="col">A + B</th></tr></thead><tbody>' +
      '<tr><th scope="row">On disk</th><td>' + st.disk.A + "</td><td>" + st.disk.B + '</td><td class="' + (st.disk.A + st.disk.B === 3000 ? "" : "is-bad") + '">' + (st.disk.A + st.disk.B) + "</td></tr>" +
      '<tr><th scope="row">T\'s buffer</th><td>' + (st.buf.A === "" ? "–" : st.buf.A) + "</td><td>" + (st.buf.B === "" ? "–" : st.buf.B) + "</td><td></td></tr>" +
      "</tbody></table></div></div>";
    w.stage.innerHTML = '<div class="ts-wrap"><div class="ts-scroll">' + svg + "</div>" + side + "</div>";
  }

  /* ---------- Widget ---------- */

  var count = 0;

  function Widget(root) {
    var self = this;
    count += 1;
    this.uid = "ts" + count;
    this.scenario = root.getAttribute("data-scenario");
    if (!SCENARIOS[this.scenario]) this.scenario = "commit";
    root.innerHTML =
      '<div class="widget-head"><strong>Transaction states</strong></div>' +
      '<div class="widget-controls">' +
      '<label class="wp-field wp-grow"><span>Scenario</span><select data-scenario>' +
      Object.keys(SCENARIOS).map(function (k) {
        return '<option value="' + k + '">' + SCENARIOS[k] + "</option>";
      }).join("") +
      "</select></label></div>" +
      '<div class="widget-stage ts-stage" tabindex="0" aria-label="State diagram and values. Scroll sideways if needed."></div>' +
      "<div data-player></div>";
    this.stage = root.querySelector(".ts-stage");
    this.select = root.querySelector("[data-scenario]");
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (f) {
        render(self, f);
      },
      resetLabel: "Start again",
      onReset: function () {
        self.load(self.scenario);
      }
    });
    this.select.value = this.scenario;
    this.select.addEventListener("change", function () {
      self.load(self.select.value);
    });
    this.load(this.scenario);
  }

  Widget.prototype.load = function (name) {
    this.scenario = name;
    this.player.load(build(name), false);
  };

  D.transactionStates = { SCENARIOS: SCENARIOS, build: build };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="transaction-states"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
