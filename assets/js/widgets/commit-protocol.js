/* Commit protocol animation (widget V32).
   Plays the messages of two-phase commit (2PC) and three-phase commit (3PC)
   between a coordinator and two participating sites, one step at a time. Each
   site shows its log records, so the student can see what every site knows
   when a failure happens. Scenarios include a "no" vote, a participant
   failure, a coordinator failure that blocks 2PC, and the same failure in 3PC.
   Markup: <div class="widget" data-widget="commit-protocol" data-scenario="2pc-commit"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  var SITES = ["Coordinator (Site 1)", "Site 2", "Site 3"];

  var SCENARIOS = {
    "2pc-commit": "2PC: all sites vote ready, so T commits",
    "2pc-abort": "2PC: Site 3 votes no, so T aborts",
    "2pc-site-fails": "2PC: Site 3 fails before it votes",
    "2pc-blocking": "2PC: the coordinator fails after the votes (blocking)",
    "3pc-coord-fails": "3PC: the coordinator fails after pre-commit"
  };

  /* ---------- Building the frames ---------- */

  function Recorder() {
    this.st = {
      sites: SITES.map(function () {
        return { log: [], status: "Active", failed: false };
      }),
      rows: []
    };
    this.frames = [];
    this.fresh = 0;
  }

  Recorder.prototype.log = function (site, rec) {
    this.st.sites[site].log.push(rec);
  };
  Recorder.prototype.status = function (site, s) {
    this.st.sites[site].status = s;
  };
  Recorder.prototype.fail = function (site) {
    this.st.sites[site].failed = true;
    this.st.sites[site].status = "Failed";
  };
  Recorder.prototype.recover = function (site) {
    this.st.sites[site].failed = false;
  };
  Recorder.prototype.msg = function (from, to, label, kind) {
    this.st.rows.push({ from: from, to: to, label: label, kind: kind || "", lost: this.st.sites[to].failed });
  };
  Recorder.prototype.note = function (text) {
    this.st.rows.push({ note: text });
  };
  Recorder.prototype.snap = function (msg) {
    var st = this.st;
    this.frames.push({
      msg: msg,
      fresh: this.fresh,
      st: {
        sites: st.sites.map(function (s) {
          return { log: s.log.slice(), status: s.status, failed: s.failed };
        }),
        rows: st.rows.slice()
      }
    });
    this.fresh = st.rows.length;
  };

  function prepare(r) {
    r.snap("Transaction T ran at all three sites. Site 1 started T, so Site 1 is the coordinator. T now asks to commit.");
    r.note("Phase 1: voting");
    r.log(0, "<prepare T>");
    r.msg(0, 1, "prepare T");
    r.msg(0, 2, "prepare T");
    r.snap("The coordinator writes <prepare T> to its log and sends “prepare T” to every participating site.");
  }

  function voteReady(r, site) {
    r.log(site, "<ready T>");
    r.status(site, "Ready");
    r.msg(site, 0, "ready T", "yes");
  }

  function decide(r, what) {
    var rec = what === "commit" ? "<commit T>" : "<abort T>";
    r.note("Phase 2: decision");
    r.log(0, rec);
    r.status(0, what === "commit" ? "Committed" : "Aborted");
    r.msg(0, 1, what + " T", what === "commit" ? "yes" : "no");
    r.msg(0, 2, what + " T", what === "commit" ? "yes" : "no");
  }

  function apply(r, sites, what) {
    sites.forEach(function (s) {
      r.log(s, what === "commit" ? "<commit T>" : "<abort T>");
      r.status(s, what === "commit" ? "Committed" : "Aborted");
      r.msg(s, 0, "ack T");
    });
  }

  function build(name) {
    var r = new Recorder();
    prepare(r);
    if (name === "2pc-commit") {
      voteReady(r, 1);
      voteReady(r, 2);
      r.snap("Both sites can commit. Each writes <ready T> to its log (forcing it to disk) and replies “ready T”. A site that has voted ready can no longer abort T on its own.");
      decide(r, "commit");
      r.snap("All votes are ready, so the coordinator writes <commit T>. This log record is the decision point. Then it sends “commit T” to every site.");
      apply(r, [1, 2], "commit");
      r.snap("Each site writes <commit T>, commits its part of T and sends an acknowledgment.");
      r.log(0, "<complete T>");
      r.snap("After all acknowledgments arrive, the coordinator writes <complete T>. T committed at every site, so atomicity is kept.");
    } else if (name === "2pc-abort") {
      voteReady(r, 1);
      r.log(2, "<no T>");
      r.status(2, "Aborted");
      r.msg(2, 0, "abort T", "no");
      r.snap("Site 2 replies “ready T”. Site 3 cannot commit (for example, a constraint fails), so it writes <no T>, aborts its part and replies “abort T”.");
      decide(r, "abort");
      r.snap("One vote is no, so the coordinator writes <abort T> and sends “abort T” to every site.");
      apply(r, [1], "abort");
      r.snap("Site 2 writes <abort T> and undoes its part of T. T aborted at every site, so atomicity is kept.");
    } else if (name === "2pc-site-fails") {
      voteReady(r, 1);
      r.fail(2);
      r.snap("Site 2 replies “ready T”. Site 3 crashes before it can vote, so its reply never comes.");
      r.note("Timeout at the coordinator");
      decide(r, "abort");
      r.snap("The coordinator waits for a set time (a timeout). A missing vote counts as no, so it writes <abort T> and sends “abort T”. The message to Site 3 is lost.");
      apply(r, [1], "abort");
      r.snap("Site 2 writes <abort T> and undoes its part.");
      r.recover(2);
      r.status(2, "Aborted");
      r.log(2, "<abort T>");
      r.snap("Site 3 recovers. Its log has no <ready T> record, so it knows it never voted. It aborts T. This is the rule: no <ready T> means abort.");
    } else if (name === "2pc-blocking") {
      voteReady(r, 1);
      voteReady(r, 2);
      r.snap("Both sites write <ready T> and reply “ready T”.");
      r.fail(0);
      r.status(1, "Waiting");
      r.status(2, "Waiting");
      r.snap("The coordinator crashes before it sends a decision. Nobody knows whether it wrote <commit T> or <abort T> before the crash.");
      r.note("Sites 2 and 3 talk to each other");
      r.msg(1, 2, "what is T's state?");
      r.msg(2, 1, "only <ready T>");
      r.snap("Sites 2 and 3 compare their logs. Both have only <ready T>. They cannot commit (the coordinator may have chosen abort) and cannot abort (it may have chosen commit).");
      r.snap("So T is blocked. Sites 2 and 3 must wait for the coordinator to recover, and they keep holding T's locks. This is the blocking problem of 2PC.");
    } else if (name === "3pc-coord-fails") {
      voteReady(r, 1);
      voteReady(r, 2);
      r.snap("Phase 1 is the same as in 2PC. Both sites write <ready T> and reply “ready T”.");
      r.note("Phase 2: pre-commit");
      r.log(0, "<precommit T>");
      r.status(0, "Pre-committed");
      r.msg(0, 1, "precommit T", "yes");
      r.msg(0, 2, "precommit T", "yes");
      r.snap("All votes are ready, so the coordinator makes a pre-commit decision. It writes <precommit T> and sends “precommit T” to the sites.");
      [1, 2].forEach(function (s) {
        r.log(s, "<precommit T>");
        r.status(s, "Pre-committed");
        r.msg(s, 0, "ack T");
      });
      r.snap("Each site writes <precommit T> and replies with an acknowledgment. Now several sites know that the decision is commit.");
      r.fail(0);
      r.snap("The coordinator crashes before it sends “commit T”.");
      r.note("Sites 2 and 3 choose a new coordinator");
      r.status(1, "New coordinator");
      r.msg(1, 2, "what is T's state?");
      r.msg(2, 1, "<precommit T>");
      r.snap("Site 2 becomes the new coordinator and asks Site 3 for its state. A site with <precommit T> knows that every site voted ready.");
      r.note("Phase 3: commit");
      r.log(1, "<commit T>");
      r.log(2, "<commit T>");
      r.status(1, "Committed");
      r.status(2, "Committed");
      r.msg(1, 2, "commit T", "yes");
      r.snap("So the new coordinator commits T without waiting for Site 1. 3PC avoids blocking, at the cost of an extra round of messages.");
    }
    return r.frames;
  }

  /* ---------- Drawing ---------- */

  var LANE = [100, 300, 500];
  var HEAD = 128;
  var ROW = 30;

  function render(w, f) {
    var esc = D.wq.esc;
    var st = f.st;
    var head = '<svg class="cp-svg" viewBox="0 0 600 ' + HEAD + '" width="600" height="' + HEAD + '" role="img" aria-label="Each site, its state and its log records">';
    st.sites.forEach(function (s, i) {
      var x = LANE[i];
      head += '<rect class="cp-site' + (s.failed ? " is-failed" : "") + '" x="' + (x - 92) + '" y="4" width="184" height="' + (HEAD - 8) + '" rx="8"/>';
      head += '<text class="cp-name" x="' + x + '" y="24" text-anchor="middle">' + esc(SITES[i]) + "</text>";
      head += '<text class="cp-status" x="' + x + '" y="44" text-anchor="middle">' + esc(s.status) + "</text>";
      s.log.forEach(function (rec, k) {
        head += '<text class="cp-log" x="' + (x - 80) + '" y="' + (66 + k * 15) + '">' + esc(rec) + "</text>";
      });
      if (!s.log.length) head += '<text class="cp-log is-empty" x="' + (x - 80) + '" y="66">Log is empty</text>';
    });
    head += "</svg>";
    var h = st.rows.length * ROW + 24;
    var svg = '<svg class="cp-svg" viewBox="0 0 600 ' + h + '" width="600" height="' + h + '" role="img" aria-label="Messages between the sites, from top to bottom">';
    svg += '<defs><marker id="' + w.uid + '-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="cp-head"/></marker></defs>';
    st.sites.forEach(function (s, i) {
      svg += '<line class="cp-lane' + (s.failed ? " is-failed" : "") + '" x1="' + LANE[i] + '" y1="0" x2="' + LANE[i] + '" y2="' + h + '"/>';
    });
    st.rows.forEach(function (m, i) {
      var y = i * ROW + 24;
      var fresh = i >= f.fresh ? " is-new" : "";
      if (m.note) {
        svg += '<text class="cp-note' + fresh + '" x="300" y="' + (y + 4) + '" text-anchor="middle">' + esc(m.note) + "</text>";
        return;
      }
      var x1 = LANE[m.from];
      var x2 = LANE[m.to];
      var dir = x2 > x1 ? 1 : -1;
      svg += '<line class="cp-msg kind-' + (m.kind || "plain") + (m.lost ? " is-lost" : "") + fresh + '" x1="' + (x1 + dir * 4) + '" y1="' + y + '" x2="' + (m.lost ? (x1 + x2) / 2 : x2 - dir * 4) + '" y2="' + y + '"' +
        (m.lost ? "" : ' marker-end="url(#' + w.uid + '-arrow)"') + "/>";
      svg += '<text class="cp-label' + fresh + '" x="' + (x1 + x2) / 2 + '" y="' + (y - 6) + '" text-anchor="middle">' + esc(m.label) + (m.lost ? " (lost)" : "") + "</text>";
      if (m.lost) svg += '<text class="cp-x" x="' + ((x1 + x2) / 2 + dir * 8) + '" y="' + (y + 5) + '" text-anchor="middle">✕</text>';
    });
    svg += "</svg>";
    w.stage.innerHTML = '<div class="cp-top">' + head + "</div>" + svg;
    w.stage.scrollTop = w.stage.scrollHeight;
  }

  /* ---------- Widget ---------- */

  var count = 0;

  function Widget(root) {
    var self = this;
    count += 1;
    this.uid = "cp" + count;
    this.scenario = root.getAttribute("data-scenario");
    if (!SCENARIOS[this.scenario]) this.scenario = "2pc-commit";
    root.innerHTML =
      '<div class="widget-head"><strong>Commit protocols: 2PC and 3PC</strong></div>' +
      '<div class="widget-controls">' +
      '<label class="wp-field wp-grow"><span>Scenario</span><select data-scenario>' +
      Object.keys(SCENARIOS).map(function (k) {
        return '<option value="' + k + '">' + SCENARIOS[k] + "</option>";
      }).join("") +
      "</select></label></div>" +
      '<div class="widget-stage cp-stage" tabindex="0" aria-label="Message diagram. Scroll if needed."></div>' +
      "<div data-player></div>";
    this.stage = root.querySelector(".cp-stage");
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

  D.commitProtocol = { SCENARIOS: SCENARIOS, build: build };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="commit-protocol"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
