/* Deadlock simulator (widget V19).
   Runs two or three transactions that ask for locks, and shows, step by step,
   the instructions each one runs, the lock table and the wait-for graph. An
   edge Ti → Tj means Ti waits for a lock that Tj holds. The scheme decides what
   happens when a lock cannot be granted: wait and detect a cycle in the graph,
   wait-die, wound-wait, or a timeout.
   Markup: <div class="widget" data-widget="deadlock" data-scenario="two" data-scheme="detect"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  var SCHEMES = {
    detect: "Detection: wait-for graph",
    "wait-die": "Prevention: wait-die",
    "wound-wait": "Prevention: wound-wait",
    timeout: "Prevention: timeout"
  };
  var TIMEOUT = 3; // steps a transaction may wait before it is rolled back
  var DELAY = 2; // steps before a rolled back transaction starts again

  /* Each transaction is a list of operations: lock asks for a lock, work is an
     ordinary read or write, and commit ends the transaction and frees its locks.
     The timestamp is the order in which the transaction entered the system.
     "turns" says which transaction the scheduler prefers at each step. */
  var SCENARIOS = {
    two: {
      label: "T3 and T4 lock A and B in opposite order",
      programs: {
        3: [
          { op: "lock", mode: "X", item: "B" },
          { op: "work", text: "write(B)" },
          { op: "lock", mode: "X", item: "A" },
          { op: "work", text: "write(A)" },
          { op: "commit" }
        ],
        4: [
          { op: "lock", mode: "S", item: "A" },
          { op: "work", text: "read(A)" },
          { op: "lock", mode: "S", item: "B" },
          { op: "work", text: "read(B)" },
          { op: "commit" }
        ]
      },
      turns: [3, 3, 4, 4, 4, 3]
    },
    three: {
      label: "Three transactions wait in a circle",
      programs: {
        1: [
          { op: "lock", mode: "X", item: "A" },
          { op: "work", text: "write(A)" },
          { op: "lock", mode: "X", item: "B" },
          { op: "commit" }
        ],
        2: [
          { op: "lock", mode: "X", item: "B" },
          { op: "work", text: "write(B)" },
          { op: "lock", mode: "X", item: "C" },
          { op: "commit" }
        ],
        3: [
          { op: "lock", mode: "X", item: "C" },
          { op: "work", text: "write(C)" },
          { op: "lock", mode: "X", item: "A" },
          { op: "commit" }
        ]
      },
      turns: [1, 1, 2, 2, 3, 3, 1, 2, 3]
    },
    chain: {
      label: "Waiting in a chain, with no deadlock",
      programs: {
        1: [
          { op: "lock", mode: "X", item: "A" },
          { op: "work", text: "write(A)" },
          { op: "work", text: "read(C)" },
          { op: "commit" }
        ],
        2: [
          { op: "lock", mode: "S", item: "B" },
          { op: "lock", mode: "X", item: "A" },
          { op: "work", text: "write(A)" },
          { op: "commit" }
        ],
        3: [
          { op: "lock", mode: "X", item: "B" },
          { op: "work", text: "write(B)" },
          { op: "commit" }
        ]
      },
      turns: [1, 1, 2, 2, 3, 1, 1]
    }
  };

  function opText(o) {
    if (o.op === "lock") return "lock-" + o.mode + "(" + o.item + ")";
    if (o.op === "commit") return "commit";
    return o.text;
  }

  /* ---------- Simulation ---------- */

  function simulate(name, scheme) {
    var sc = SCENARIOS[name];
    var ids = Object.keys(sc.programs).map(Number);
    var frames = [];
    var clock = 0;
    var rows = [];
    var locks = {}; // item -> [{t, mode}]
    var tx = {};
    ids.forEach(function (t, k) {
      tx[t] = { ts: k + 1, pc: 0, status: "ready", wait: null, since: 0, restartAt: 0, rollbacks: 0 };
    });
    var turns = sc.turns.slice();
    var last = ids[0];

    function T(t) {
      return "T" + t;
    }

    function blockers(t, o) {
      return (locks[o.item] || []).filter(function (h) {
        return h.t !== t && !(h.mode === "S" && o.mode === "S");
      }).map(function (h) {
        return h.t;
      });
    }

    function edges() {
      var list = [];
      ids.forEach(function (t) {
        var w = tx[t].wait;
        if (tx[t].status !== "waiting" || !w) return;
        blockers(t, w).forEach(function (h) {
          list.push({ from: t, to: h, item: w.item });
        });
      });
      return list;
    }

    function findCycle(list) {
      var next = {};
      list.forEach(function (e) {
        (next[e.from] = next[e.from] || []).push(e.to);
      });
      var found = null;
      function walk(t, path) {
        if (found) return;
        var at = path.indexOf(t);
        if (at >= 0) {
          found = path.slice(at);
          return;
        }
        (next[t] || []).forEach(function (u) {
          walk(u, path.concat([t]));
        });
      }
      ids.forEach(function (t) {
        walk(t, []);
      });
      return found;
    }

    function holdsMode(t, item) {
      var h = (locks[item] || []).filter(function (x) {
        return x.t === t;
      })[0];
      return h ? h.mode : null;
    }

    function grant(t, o) {
      var have = holdsMode(t, o.item);
      locks[o.item] = (locks[o.item] || []).filter(function (x) {
        return x.t !== t;
      });
      locks[o.item].push({ t: t, mode: have === "X" ? "X" : o.mode });
    }

    function release(t) {
      Object.keys(locks).forEach(function (k) {
        locks[k] = locks[k].filter(function (x) {
          return x.t !== t;
        });
      });
    }

    function row(t, text, cls) {
      rows.push({ t: t, text: text, cls: cls || "" });
    }

    function snap(msg, extra) {
      var e = edges();
      frames.push(Object.assign({
        msg: msg,
        ids: ids,
        rows: rows.slice(),
        locks: JSON.parse(JSON.stringify(locks)),
        tx: JSON.parse(JSON.stringify(tx)),
        edges: e,
        cycle: null
      }, extra || {}));
    }

    /* After locks are freed, waiting transactions whose request can now be
       granted get their lock, oldest wait first. */
    function wake() {
      var told = [];
      ids.slice().sort(function (a, b) {
        return tx[a].since - tx[b].since;
      }).forEach(function (t) {
        var x = tx[t];
        if (x.status !== "waiting" || blockers(t, x.wait).length) return;
        grant(t, x.wait);
        row(t, "gets " + opText(x.wait), "is-lock");
        told.push(T(t) + " stops waiting and gets " + opText(x.wait) + ".");
        x.status = "ready";
        x.wait = null;
        x.pc++;
      });
      return told.length ? " " + told.join(" ") : "";
    }

    function rollback(t, why) {
      var x = tx[t];
      release(t);
      x.status = "aborted";
      x.wait = null;
      x.pc = 0;
      x.rollbacks++;
      x.restartAt = clock + DELAY;
      row(t, "rolled back", "is-bad");
      return T(t) + " " + why + " It releases all its locks and will start again later with the same timestamp, TS = " + x.ts + "." + wake();
    }

    function runnable(t) {
      var x = tx[t];
      return x.status === "ready" || (x.status === "aborted" && clock >= x.restartAt);
    }

    function pick() {
      while (turns.length) {
        var want = turns.shift();
        if (runnable(want)) return want;
      }
      var start = ids.indexOf(last);
      for (var k = 0; k < ids.length; k++) {
        var t = ids[(start + k) % ids.length];
        if (runnable(t)) return t;
      }
      return null;
    }

    snap("Each transaction gets a timestamp when it enters: " + D.wq.list(ids.map(function (t) {
      return "TS(" + T(t) + ") = " + tx[t].ts;
    })) + ". A smaller timestamp means an older transaction. Press Play or Next.");

    var guard = 0;
    while (guard++ < 80) {
      if (ids.every(function (t) { return tx[t].status === "done"; })) break;
      clock++;

      if (scheme === "timeout") {
        var late = ids.filter(function (t) {
          return tx[t].status === "waiting" && clock - tx[t].since > TIMEOUT;
        })[0];
        if (late) {
          snap(rollback(late, "has waited more than " + TIMEOUT + " steps for " + opText(tx[late].wait) + ", so its wait times out. The system does not check whether this was really a deadlock."));
          continue;
        }
      }

      var t = pick();
      if (t === null) {
        var anyAborted = ids.some(function (u) { return tx[u].status === "aborted"; });
        snap(anyAborted ? "A rolled back transaction is waiting for its restart delay to pass." :
          "Every unfinished transaction is waiting. " + (scheme === "timeout" ? "Time passes until a wait times out." : "Nothing can run."));
        if (!anyAborted && scheme !== "timeout") break;
        continue;
      }
      last = t;
      var x = tx[t];
      if (x.status === "aborted") {
        x.status = "ready";
        row(t, "restarts", "is-lock");
        snap(T(t) + " starts again from its first instruction." + (scheme === "wait-die" || scheme === "wound-wait" ?
          " It keeps its old timestamp, TS = " + x.ts + ". In time it becomes the oldest transaction in the system, so it cannot be rolled back forever." : ""));
        continue;
      }
      var o = sc.programs[t][x.pc];

      if (o.op === "work") {
        row(t, o.text);
        x.pc++;
        snap(T(t) + " runs " + o.text + ".");
        continue;
      }
      if (o.op === "commit") {
        row(t, "commit", "is-ok");
        release(t);
        x.status = "done";
        x.pc++;
        snap(T(t) + " commits and releases all its locks." + wake());
        continue;
      }

      var held = blockers(t, o);
      if (!held.length) {
        grant(t, o);
        row(t, opText(o), "is-lock");
        x.pc++;
        snap(T(t) + " asks for " + opText(o) + ". No other transaction holds a conflicting lock on " + o.item + ", so the lock is granted.");
        continue;
      }

      var holders = D.wq.list(held.map(T));
      var older = held.filter(function (h) { return tx[h].ts < x.ts; });
      var younger = held.filter(function (h) { return tx[h].ts > x.ts; });

      if (scheme === "wait-die" && older.length) {
        row(t, opText(o) + " dies", "is-bad");
        snap(rollback(t, "asks for " + opText(o) + ", but " + holders + " holds a conflicting lock on " + o.item + ". TS(" + T(t) + ") = " + x.ts + " is larger, so " + T(t) + " is younger. In wait-die a younger transaction never waits for an older one: it dies."));
        continue;
      }

      if (scheme === "wound-wait" && younger.length) {
        row(t, opText(o) + " wounds " + D.wq.list(younger.map(T)), "is-lock");
        var msg = T(t) + " asks for " + opText(o) + ", held by " + holders + ". " + T(t) + " is older, TS = " + x.ts + ", so in wound-wait it wounds the younger holder. ";
        younger.forEach(function (y) {
          msg += rollback(y, "is wounded and rolled back.") + " ";
        });
        if (!blockers(t, o).length) {
          grant(t, o);
          row(t, "gets " + opText(o), "is-lock");
          x.pc++;
          msg += T(t) + " now gets " + opText(o) + ".";
        } else {
          x.status = "waiting";
          x.wait = o;
          x.since = clock;
          msg += T(t) + " still waits for an older holder.";
        }
        snap(msg);
        continue;
      }

      x.status = "waiting";
      x.wait = o;
      x.since = clock;
      row(t, opText(o), "is-wait");
      var why;
      if (scheme === "wait-die") why = T(t) + " is older, TS = " + x.ts + ", so in wait-die it is allowed to wait.";
      else if (scheme === "wound-wait") why = T(t) + " is younger, TS = " + x.ts + ", so in wound-wait it waits.";
      else if (scheme === "timeout") why = T(t) + " waits, but only for " + TIMEOUT + " steps.";
      else why = "The wait-for graph gets the edge " + held.map(function (h) { return T(t) + " → " + T(h); }).join(" and ") + ".";
      snap(T(t) + " asks for " + opText(o) + ", but " + holders + " holds a conflicting lock on " + o.item + ". " + why);

      if (scheme === "detect") {
        var cycle = findCycle(edges());
        if (cycle) {
          var names = cycle.map(T);
          snap("The wait-for graph now has a cycle: " + names.concat([names[0]]).join(" → ") + ". This is a deadlock. Each transaction in the cycle waits for the next, so none can go on.", { cycle: cycle });
          var victim = cycle.slice().sort(function (a, b) { return tx[b].ts - tx[a].ts; })[0];
          row(victim, "chosen as victim", "is-bad");
          snap(rollback(victim, "is chosen as the victim because it is the youngest in the cycle and has done the least work."));
        }
      }
    }
    var total = ids.reduce(function (n, u) { return n + tx[u].rollbacks; }, 0);
    var end = frames[frames.length - 1];
    end.final = true;
    end.rollbacks = total;
    end.msg += " All transactions have finished. " + (total ? total + " rollback" + (total > 1 ? "s were" : " was") + " needed." : "No transaction was rolled back.");
    return frames;
  }

  /* ---------- Drawing ---------- */

  var POS = {
    2: [[70, 70], [250, 70]],
    3: [[160, 40], [260, 160], [60, 160]]
  };

  function graph(f, uid) {
    var ids = f.ids;
    var pos = POS[ids.length];
    var h = ids.length === 2 ? 130 : 210;
    var at = {};
    ids.forEach(function (t, k) {
      at[t] = pos[k];
    });
    var inCycle = function (a, b) {
      if (!f.cycle) return false;
      var i = f.cycle.indexOf(a);
      return i >= 0 && f.cycle[(i + 1) % f.cycle.length] === b;
    };
    var svg = '<svg class="dl-graph" viewBox="0 0 320 ' + h + '" width="320" height="' + h + '" role="img" aria-label="Wait-for graph">' +
      '<defs><marker id="dl-arrow-' + uid + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="dl-head"/></marker>' +
      '<marker id="dl-arrow-bad-' + uid + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="dl-head is-bad"/></marker></defs>';
    var seen = {};
    f.edges.forEach(function (e) {
      var key = e.from + ">" + e.to;
      if (seen[key]) return;
      seen[key] = true;
      var a = at[e.from];
      var b = at[e.to];
      var dx = b[0] - a[0];
      var dy = b[1] - a[1];
      var len = Math.sqrt(dx * dx + dy * dy);
      var ux = dx / len;
      var uy = dy / len;
      var r = 26;
      var x1 = a[0] + ux * r;
      var y1 = a[1] + uy * r;
      var x2 = b[0] - ux * r;
      var y2 = b[1] - uy * r;
      var bend = f.edges.some(function (g) { return g.from === e.to && g.to === e.from; }) ? 26 : 0;
      var mx = (x1 + x2) / 2 + uy * bend;
      var my = (y1 + y2) / 2 - ux * bend;
      var bad = inCycle(e.from, e.to);
      svg += '<path class="dl-edge' + (bad ? " is-bad" : "") + '" d="M' + x1.toFixed(1) + "," + y1.toFixed(1) + " Q" + mx.toFixed(1) + "," + my.toFixed(1) + " " + x2.toFixed(1) + "," + y2.toFixed(1) +
        '" marker-end="url(#dl-arrow-' + (bad ? "bad-" : "") + uid + ')"/>';
      svg += '<text class="dl-label" x="' + (mx + uy * 10).toFixed(1) + '" y="' + (my - ux * 10 + 4).toFixed(1) + '" text-anchor="middle">' + e.item + "</text>";
    });
    ids.forEach(function (t) {
      var p = at[t];
      var st = f.tx[t].status;
      svg += '<g class="dl-node is-' + st + '"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="24"/>' +
        '<text x="' + p[0] + '" y="' + (p[1] - 2) + '" text-anchor="middle" class="dl-name">T' + t + "</text>" +
        '<text x="' + p[0] + '" y="' + (p[1] + 12) + '" text-anchor="middle" class="dl-ts">TS ' + f.tx[t].ts + "</text></g>";
    });
    return svg + "</svg>";
  }

  var STATUS = { ready: "running", waiting: "waiting", aborted: "rolled back", done: "committed" };

  function render(w, f) {
    var esc = D.wq.esc;
    var ids = f.ids;
    var rows = f.rows.map(function (r, i) {
      var cls = r.cls + (i === f.rows.length - 1 ? " is-current" : "");
      return '<tr class="' + cls + '">' + ids.map(function (t) {
        return "<td>" + (r.t === t ? esc(r.text) + (r.cls === "is-wait" ? ' <span class="an-wait">waits</span>' : "") : "") + "</td>";
      }).join("") + "</tr>";
    }).join("");
    var table = '<div class="lk-left"><table class="lk-table dl-table"><caption class="visually-hidden">Instructions run so far</caption><thead><tr>' +
      ids.map(function (t) {
        return '<th scope="col">T' + t + ' <span class="dl-state is-' + f.tx[t].status + '">' + STATUS[f.tx[t].status] + "</span></th>";
      }).join("") + "</tr></thead><tbody>" + (rows || '<tr><td colspan="' + ids.length + '" class="muted">Nothing has run yet.</td></tr>') + "</tbody></table></div>";
    var lockRows = Object.keys(f.locks).sort().filter(function (k) {
      return f.locks[k].length;
    }).map(function (k) {
      return '<tr><th scope="row">' + k + "</th><td>" + f.locks[k].map(function (h) { return "T" + h.t + " (" + h.mode + ")"; }).join(", ") + "</td></tr>";
    }).join("");
    var edgeText = f.edges.length ? f.edges.map(function (e) { return "T" + e.from + " → T" + e.to + " (" + e.item + ")"; }).join(", ") : "No edges";
    var side = '<div class="lk-side">' +
      '<div class="an-box dl-graph-box"><div class="an-cap">Wait-for graph</div>' + graph(f, w.uid) +
      '<p class="dl-edges">' + esc(edgeText) + "</p></div>" +
      '<div class="an-box"><div class="an-cap">Lock table</div><table class="lk-locks"><caption class="visually-hidden">Locks held</caption><tbody>' +
      (lockRows || '<tr><td class="muted">No locks held</td></tr>') + "</tbody></table></div>" +
      "</div>";
    var end = "";
    if (f.cycle) end = '<p class="an-end is-bad">✕ Deadlock: cycle ' + f.cycle.map(function (t) { return "T" + t; }).concat(["T" + f.cycle[0]]).join(" → ") + "</p>";
    else if (f.final) end = '<p class="an-end ' + (f.rollbacks ? "is-bad" : "is-ok") + '">✓ All committed. Rollbacks: ' + f.rollbacks + "</p>";
    w.stage.innerHTML = '<div class="lk-layout">' + table + side + "</div>" + end;
  }

  /* ---------- Widget ---------- */

  var count = 0;

  function Widget(root) {
    var self = this;
    this.uid = ++count;
    this.name = root.getAttribute("data-scenario");
    if (!SCENARIOS[this.name]) this.name = "two";
    this.scheme = root.getAttribute("data-scheme");
    if (!SCHEMES[this.scheme]) this.scheme = "detect";
    root.innerHTML =
      '<div class="widget-head"><strong>Deadlock simulator</strong></div>' +
      '<div class="widget-controls">' +
      '<label class="wp-field wp-grow"><span>Transactions</span><select data-scenario>' +
      Object.keys(SCENARIOS).map(function (k) {
        return '<option value="' + k + '">' + D.wq.esc(SCENARIOS[k].label) + "</option>";
      }).join("") + "</select></label>" +
      '<label class="wp-field wp-grow"><span>Scheme</span><select data-scheme>' +
      Object.keys(SCHEMES).map(function (k) {
        return '<option value="' + k + '">' + SCHEMES[k] + "</option>";
      }).join("") + "</select></label></div>" +
      '<div class="widget-stage lk-stage" tabindex="0" aria-label="Instructions, wait-for graph and lock table. Scroll if needed."></div>' +
      "<div data-player></div>";
    this.stage = root.querySelector(".lk-stage");
    this.sSel = root.querySelector("[data-scenario]");
    this.mSel = root.querySelector("[data-scheme]");
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (f) {
        render(self, f);
      },
      resetLabel: "Start again",
      onReset: function () {
        self.load();
      }
    });
    this.sSel.value = this.name;
    this.mSel.value = this.scheme;
    this.sSel.addEventListener("change", function () {
      self.name = self.sSel.value;
      self.load();
    });
    this.mSel.addEventListener("change", function () {
      self.scheme = self.mSel.value;
      self.load();
    });
    this.load();
  }

  Widget.prototype.load = function () {
    this.player.load(simulate(this.name, this.scheme), false);
  };

  D.deadlock = { SCHEMES: SCHEMES, SCENARIOS: SCENARIOS, simulate: simulate };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="deadlock"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
