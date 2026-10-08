/* Log-based recovery simulator (widget V20).
   Runs three transactions that write to the log, with or without a checkpoint,
   then crashes at a chosen point and steps through recovery: the redo pass
   forward through the log and, for immediate update, the undo pass backward.
   It shows the log, the buffer in main memory, the database on disk and the
   undo-list. Writes reach the disk only at a checkpoint, so redo is needed.
   Markup: <div class="widget" data-widget="log-recovery" data-method="immediate"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  var METHODS = {
    immediate: "Immediate update (undo and redo)",
    deferred: "Deferred update (redo only)"
  };
  var START = { A: 1000, B: 2000, C: 700, D: 500 };

  /* The run: start, write, commit and checkpoint events in time order. */
  var EVENTS = [
    { op: "start", t: 0 },
    { op: "write", t: 0, item: "A", value: 950 },
    { op: "write", t: 0, item: "B", value: 2050 },
    { op: "commit", t: 0 },
    { op: "start", t: 1 },
    { op: "write", t: 1, item: "C", value: 600 },
    { op: "checkpoint" },
    { op: "start", t: 2 },
    { op: "write", t: 2, item: "A", value: 900 },
    { op: "commit", t: 1 },
    { op: "write", t: 2, item: "D", value: 450 }
  ];

  function copy(o) {
    return JSON.parse(JSON.stringify(o));
  }

  function recText(r, method) {
    var T = "T" + r.t;
    if (r.op === "start") return "<" + T + " start>";
    if (r.op === "commit") return "<" + T + " commit>";
    if (r.op === "abort") return "<" + T + " abort>";
    if (r.op === "checkpoint") return "<checkpoint {" + r.active.map(function (t) { return "T" + t; }).join(", ") + "}>";
    if (r.op === "clr") return "<" + T + ", " + r.item + ", " + r.value + ">";
    return method === "deferred" ? "<" + T + ", " + r.item + ", " + r.value + ">" : "<" + T + ", " + r.item + ", " + r.old + ", " + r.value + ">";
  }

  /* ---------- Simulation ---------- */

  function simulate(method, useCheckpoint, crashAt) {
    var frames = [];
    var log = [];
    var buffer = copy(START);
    var disk = copy(START);
    var active = [];
    var pending = {}; // deferred: t -> writes waiting for commit
    var phase = "Normal running";
    var undo = null;
    var at = -1;
    var deferred = method === "deferred";
    var events = EVENTS.filter(function (e) {
      return useCheckpoint || e.op !== "checkpoint";
    });
    crashAt = Math.min(Math.max(crashAt || events.length, 1), events.length);

    function snap(msg, extra) {
      frames.push(Object.assign({
        msg: msg,
        method: method,
        log: copy(log),
        buffer: copy(buffer),
        disk: copy(disk),
        phase: phase,
        undo: undo ? undo.slice() : null,
        at: at,
        changed: null
      }, extra || {}));
    }

    snap("Every account starts with the values shown on disk. Press Play or Next to run the transactions. " +
      (deferred ? "With deferred update, a write goes to the database only after its transaction commits." :
        "With immediate update, a write goes to the buffer in main memory at once, after its log record is written."));

    events.slice(0, crashAt).forEach(function (e) {
      var r = copy(e);
      var T = "T" + e.t;
      var msg;
      if (e.op === "start") {
        active.push(e.t);
        pending[e.t] = [];
        log.push(r);
        msg = T + " starts. The record " + recText(r) + " is written to the log.";
      } else if (e.op === "write") {
        r.old = deferred ? null : buffer[e.item];
        log.push(r);
        if (deferred) {
          pending[e.t].push(r);
          msg = T + " writes " + e.item + " = " + e.value + ". Deferred update only logs the new value; the database is not changed until " + T + " commits.";
        } else {
          buffer[e.item] = e.value;
          msg = T + " writes " + e.item + ". The log record " + recText(r, method) + " is written first, with the old and new value, then the buffer is changed. The disk still has the old value.";
        }
      } else if (e.op === "commit") {
        log.push(r);
        active = active.filter(function (t) { return t !== e.t; });
        if (deferred) {
          pending[e.t].forEach(function (w) {
            buffer[w.item] = w.value;
          });
          msg = T + " commits. Now its deferred writes are applied to the buffer. They reach the disk later.";
        } else {
          msg = T + " commits. The commit record is forced to the log on stable storage. Its changes may still be only in the buffer.";
        }
      } else {
        r.active = active.slice();
        log.push(r);
        disk = copy(buffer);
        msg = "Checkpoint: all log records and all changed buffer blocks are written to disk, then " + recText(r) + " is logged. It lists the transactions active right now.";
      }
      at = log.length - 1;
      snap(msg, { changed: e.item || null });
    });

    /* ---------- Crash ---------- */
    buffer = null;
    phase = "Crash";
    at = -1;
    var lost = Object.keys(START).filter(function (k) {
      return frames[frames.length - 1].buffer[k] !== disk[k];
    });
    snap("CRASH. Main memory is lost, including the buffer. The log and the database on disk survive. " +
      (lost.length ? "The disk has old values for " + D.wq.list(lost) + "." : "The disk matches what was in the buffer."), { crash: true });

    /* ---------- Recovery ---------- */
    var mark = -1;
    log.forEach(function (r, i) {
      if (r.op === "checkpoint") mark = i;
    });
    var committed = {};
    var committedBefore = {};
    log.forEach(function (r, i) {
      if (r.op === "commit") {
        committed[r.t] = true;
        if (i < mark) committedBefore[r.t] = true;
      }
    });

    phase = "Redo pass";
    var from = 0;
    var why;
    if (mark >= 0) {
      var listed = log[mark].active;
      undo = deferred ? null : listed.slice();
      from = mark;
      why = "The last checkpoint is " + recText(log[mark]) + ". Everything before it is already on disk";
      if (deferred && listed.length) {
        log.forEach(function (r, i) {
          if (r.op === "start" && listed.indexOf(r.t) >= 0 && i < from) from = i;
        });
        why += ", except the writes of " + D.wq.list(listed.map(function (t) { return "T" + t; })) + ", which " + (listed.length > 1 ? "were" : "was") + " still active. Redo starts at " + recText(log[from]) + ".";
      } else {
        why += ", so redo starts there. The undo-list starts as the checkpoint's list.";
      }
    } else {
      undo = deferred ? null : [];
      why = "There is no checkpoint, so redo must start at the very first log record.";
    }
    at = from;
    snap("Recovery begins. " + why + (deferred ? " Deferred update needs no undo-list: unfinished transactions never changed the database." : ""));

    var redoCount = 0;
    for (var i = from; i < log.length; i++) {
      var r = log[i];
      if (r.op === "checkpoint") continue;
      var T = "T" + r.t;
      var msg = "";
      var changed = null;
      at = i;
      if (r.op === "write") {
        if (!deferred) {
          disk[r.item] = r.value;
          changed = r.item;
          redoCount++;
          msg = "Redo " + recText(r, method) + ": set " + r.item + " = " + r.value + ". Immediate update repeats every write, even of transactions that did not commit; undo fixes those later.";
        } else if (committed[r.t] && !committedBefore[r.t]) {
          disk[r.item] = r.value;
          changed = r.item;
          redoCount++;
          msg = "Redo " + recText(r, method) + ": " + T + " has a commit record in the log, so set " + r.item + " = " + r.value + ".";
        } else if (committedBefore[r.t]) {
          msg = "Skip " + recText(r, method) + ": " + T + " committed before the checkpoint, so its write is already on disk.";
        } else {
          msg = "Skip " + recText(r, method) + ": " + T + " has no commit record, so its write is ignored. Nothing needs to be undone.";
        }
      } else if (r.op === "start") {
        if (!deferred) {
          undo.push(r.t);
          msg = "Found " + recText(r) + ". Add " + T + " to the undo-list.";
        } else {
          msg = "Found " + recText(r) + ".";
        }
      } else if (r.op === "commit") {
        if (!deferred) {
          undo = undo.filter(function (t) { return t !== r.t; });
          msg = "Found " + recText(r) + ". " + T + " finished, so remove it from the undo-list.";
        } else {
          msg = "Found " + recText(r) + ".";
        }
      }
      snap(msg, { changed: changed });
    }

    if (!deferred) {
      phase = "Undo pass";
      var list = undo.length ? D.wq.list(undo.map(function (t) { return "T" + t; })) : "";
      at = -1;
      snap(undo.length ? "The redo pass is done. The undo-list is {" + undo.map(function (t) { return "T" + t; }).join(", ") + "}. " + list + " did not finish, so " + (undo.length > 1 ? "their" : "its") + " writes are undone, scanning the log backward." :
        "The redo pass is done and the undo-list is empty. Every transaction in the log finished, so there is nothing to undo.");
      var end = log.length - 1;
      for (var j = end; j >= 0 && undo.length; j--) {
        var u = log[j];
        if (undo.indexOf(u.t) < 0) continue;
        at = j;
        if (u.op === "write") {
          disk[u.item] = u.old;
          log.push({ op: "clr", t: u.t, item: u.item, value: u.old });
          snap("Undo " + recText(u, method) + ": set " + u.item + " back to its old value " + u.old + ", and log the redo-only record " + recText(log[log.length - 1]) + ".", { changed: u.item });
        } else if (u.op === "start") {
          undo = undo.filter(function (t) { return t !== u.t; });
          log.push({ op: "abort", t: u.t });
          snap("Reached " + recText(u) + ". All of T" + u.t + "'s writes are undone, so " + recText(log[log.length - 1]) + " is logged and T" + u.t + " leaves the undo-list.");
        }
      }
    }
    phase = "Recovered";
    at = -1;
    var scanned = log.length;
    snap("Recovery is complete. " + (mark >= 0 ? "Thanks to the checkpoint, the redo pass started at record " + (from + 1) + " instead of record 1." : "Without a checkpoint, the whole log had to be read.") +
      " Committed work is on disk and unfinished work is gone, so atomicity and durability hold.", { final: true, redoCount: redoCount, scanned: scanned });
    return frames;
  }

  /* ---------- Drawing ---------- */

  function render(w, f) {
    var esc = D.wq.esc;
    var items = Object.keys(START);
    var logRows = f.log.map(function (r, i) {
      var cls = (i === f.at ? "is-current" : "") + (r.op === "checkpoint" ? " is-mark" : "") + (r.op === "clr" || r.op === "abort" ? " is-undo" : "");
      return '<li class="' + cls + '"><span class="lr-no">' + (i + 1) + "</span>" + esc(recText(r, f.method)) + "</li>";
    }).join("");
    var vals = function (cap, obj, cls) {
      return '<div class="an-box ' + cls + '"><div class="an-cap">' + cap + "</div>" + (obj ? items.map(function (k) {
        return '<div class="an-val' + (f.changed === k ? " is-changed" : "") + '"><span class="an-key">' + k + "</span> " + obj[k] + "</div>";
      }).join("") : '<div class="lr-lost">Lost in the crash</div>') + "</div>";
    };
    var undoBox = f.undo ? '<div class="an-box lr-undo"><div class="an-cap">Undo-list</div><div class="an-val">{' + f.undo.map(function (t) { return "T" + t; }).join(", ") + "}</div></div>" : "";
    var side = '<div class="lr-side">' +
      '<div class="lr-phase' + (f.crash ? " is-crash" : "") + (f.final ? " is-done" : "") + '">' + esc(f.phase) + "</div>" +
      (f.phase === "Normal running" ? vals("Buffer (main memory)", f.buffer, "lr-buffer") : vals("Buffer (main memory)", null, "lr-buffer")) +
      vals("Database on disk", f.disk, "an-db") + undoBox + "</div>";
    w.stage.innerHTML = '<div class="lr-layout"><div class="lr-log-box"><div class="an-cap">Log on stable storage</div><ol class="lr-log">' +
      (logRows || '<li class="muted">The log is empty.</li>') + "</ol></div>" + side + "</div>";
  }

  /* ---------- Widget ---------- */

  function Widget(root) {
    var self = this;
    this.method = root.getAttribute("data-method");
    if (!METHODS[this.method]) this.method = "immediate";
    this.checkpoint = root.getAttribute("data-checkpoint") !== "off";
    root.innerHTML =
      '<div class="widget-head"><strong>Log-based recovery</strong></div>' +
      '<div class="widget-controls">' +
      '<label class="wp-field wp-grow"><span>Method</span><select data-method>' +
      Object.keys(METHODS).map(function (k) {
        return '<option value="' + k + '">' + METHODS[k] + "</option>";
      }).join("") + "</select></label>" +
      '<label class="wp-field wp-grow"><span>Crash after</span><select data-crash></select></label>' +
      '<label class="wp-check"><input type="checkbox" data-checkpoint> Take a checkpoint</label></div>' +
      '<div class="widget-stage lr-stage" tabindex="0" aria-label="Log, buffer and database. Scroll if needed."></div>' +
      "<div data-player></div>";
    this.stage = root.querySelector(".lr-stage");
    this.mSel = root.querySelector("[data-method]");
    this.cSel = root.querySelector("[data-crash]");
    this.ckBox = root.querySelector("[data-checkpoint]");
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (f) {
        render(self, f);
      },
      resetLabel: "Start again",
      onReset: function () {
        self.load();
      }
    });
    this.mSel.value = this.method;
    this.ckBox.checked = this.checkpoint;
    this.fillCrash(null);
    this.mSel.addEventListener("change", function () {
      self.method = self.mSel.value;
      self.fillCrash(self.cSel.value);
      self.load();
    });
    this.ckBox.addEventListener("change", function () {
      self.checkpoint = self.ckBox.checked;
      self.fillCrash(null);
      self.load();
    });
    this.cSel.addEventListener("change", function () {
      self.load();
    });
    this.load();
  }

  Widget.prototype.fillCrash = function (keep) {
    var self = this;
    var events = EVENTS.filter(function (e) {
      return self.checkpoint || e.op !== "checkpoint";
    });
    var old = copy(START);
    var active = [];
    this.cSel.innerHTML = events.map(function (e, i) {
      var r = copy(e);
      if (e.op === "write") {
        r.old = old[e.item];
        old[e.item] = e.value;
      }
      if (e.op === "start") active.push(e.t);
      if (e.op === "commit") active = active.filter(function (t) { return t !== e.t; });
      if (e.op === "checkpoint") r.active = active.slice();
      return '<option value="' + (i + 1) + '">' + (i + 1) + ". " + D.wq.esc(recText(r, self.method)) + "</option>";
    }).join("");
    this.cSel.value = keep && this.cSel.querySelector('option[value="' + keep + '"]') ? keep : String(events.length);
  };

  Widget.prototype.load = function () {
    this.player.load(simulate(this.method, this.checkpoint, Number(this.cSel.value)), false);
  };

  D.logRecovery = { METHODS: METHODS, EVENTS: EVENTS, simulate: simulate, recText: recText };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="log-recovery"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
