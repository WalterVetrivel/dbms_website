/* Lock manager and two phase locking chart (widget V18).
   Runs two or three transactions under a chosen locking rule and shows, step by
   step: the instructions each transaction runs (with lock and unlock requests
   added by the rule), the lock table, the compatibility matrix check for each
   request, the values in the database, and a chart of how many locks each
   transaction holds, so the growing and shrinking phases and the lock point can
   be seen. Rules: unlock early (not two phase), basic, strict and rigorous 2PL.
   Markup: <div class="widget" data-widget="locking" data-scenario="transfer" data-rule="early"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  var RULES = {
    early: "Unlock as soon as possible (not two phase)",
    basic: "Basic two phase locking",
    strict: "Strict two phase locking",
    rigorous: "Rigorous two phase locking"
  };

  /* Each transaction is a list of accesses. r and w read and write an item;
     calc and show change or print local values; the last entry ends it. The
     "turns" list says which transaction the scheduler prefers at each step. */
  var SCENARIOS = {
    transfer: {
      label: "T1 moves ₹50 from B to A, T2 displays A + B",
      start: { A: 100, B: 200 },
      programs: {
        1: [
          { op: "r", item: "B" },
          { op: "calc", text: "B := B − 50", fn: function (l) { l.B -= 50; } },
          { op: "w", item: "B" },
          { op: "r", item: "A" },
          { op: "calc", text: "A := A + 50", fn: function (l) { l.A += 50; } },
          { op: "w", item: "A" },
          { op: "commit" }
        ],
        2: [
          { op: "r", item: "A" },
          { op: "r", item: "B" },
          { op: "show", text: "display(A + B)", fn: function (l) { return l.A + l.B; } },
          { op: "commit" }
        ]
      },
      turns: [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2]
    },
    deadlock: {
      label: "The same transactions, T2 starts earlier",
      start: { A: 100, B: 200 },
      programs: null, // filled from "transfer"
      turns: [1, 1, 1, 1, 2, 2, 2, 1, 1, 1]
    },
    cascade: {
      label: "Cascading rollback: T5 fails after T6 and T7 read A",
      start: { A: 100, B: 200 },
      programs: {
        5: [
          { op: "r", item: "A" },
          { op: "r", item: "B" },
          { op: "calc", text: "A := A + B", fn: function (l) { l.A += l.B; } },
          { op: "w", item: "A" },
          { op: "abort" }
        ],
        6: [
          { op: "r", item: "A" },
          { op: "calc", text: "A := A * 2", fn: function (l) { l.A *= 2; } },
          { op: "w", item: "A" },
          { op: "commit" }
        ],
        7: [
          { op: "r", item: "A" },
          { op: "commit" }
        ]
      },
      turns: [5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 5]
    }
  };
  SCENARIOS.deadlock.programs = SCENARIOS.transfer.programs;

  /* ---------- Adding lock and unlock instructions ---------- */

  function program(accesses, rule) {
    var writes = {};
    var last = {};
    accesses.forEach(function (a, i) {
      if (a.op === "w") writes[a.item] = true;
      if (a.op === "r" || a.op === "w") last[a.item] = i;
    });
    // Lock each item once, in the mode it will need (X if it is ever written).
    var out = [];
    var locked = {};
    var lockAt = []; // positions in "out" of lock instructions
    accesses.forEach(function (a) {
      if ((a.op === "r" || a.op === "w") && !locked[a.item]) {
        locked[a.item] = writes[a.item] ? "X" : "S";
        lockAt.push(out.length);
        out.push({ op: "lock", mode: locked[a.item], item: a.item });
      }
      out.push(a);
    });
    var endIdx = out.length - 1; // commit or abort
    var lockPoint = lockAt[lockAt.length - 1];
    // Where each unlock goes: after this index in "out".
    var place = {};
    Object.keys(locked).forEach(function (item) {
      var lastUse = -1;
      out.forEach(function (o, i) {
        if ((o.op === "r" || o.op === "w") && o.item === item) lastUse = i;
      });
      var x = locked[item] === "X";
      if (rule === "early") place[item] = lastUse;
      else if (rule === "basic") place[item] = Math.max(lastUse, lockPoint);
      else if (rule === "strict") place[item] = x ? endIdx : Math.max(lastUse, lockPoint);
      else place[item] = endIdx;
    });
    var res = [];
    out.forEach(function (o, i) {
      res.push(o);
      Object.keys(place).forEach(function (item) {
        if (place[item] === i) res.push({ op: "unlock", item: item, mode: locked[item] });
      });
    });
    return res;
  }

  function text(o) {
    if (o.op === "lock") return "lock-" + o.mode + "(" + o.item + ")";
    if (o.op === "unlock") return "unlock(" + o.item + ")";
    if (o.op === "r") return "read(" + o.item + ")";
    if (o.op === "w") return "write(" + o.item + ")";
    if (o.op === "calc" || o.op === "show") return o.text;
    return o.op;
  }

  /* ---------- Running the transactions ---------- */

  function simulate(name, rule) {
    var sc = SCENARIOS[name];
    var ids = Object.keys(sc.programs).map(Number);
    var progs = {};
    ids.forEach(function (t) {
      progs[t] = program(sc.programs[t], rule);
    });
    var st = {
      db: Object.assign({}, sc.start),
      local: {},
      pc: {},
      locks: {}, // item -> [{t, mode}]
      waiting: {}, // t -> request
      held: {}, // t -> number of locks
      unlocked: {}, // t -> has released a lock
      history: {}, // t -> lock counts over time
      rows: [],
      lastWriter: {}, // item -> uncommitted writer
      readFrom: [], // {reader, writer}
      old: {}, // t -> {item: value before its first write}
      done: {}
    };
    ids.forEach(function (t) {
      st.local[t] = {};
      st.pc[t] = 0;
      st.held[t] = 0;
      st.history[t] = [0];
      st.old[t] = {};
    });
    var frames = [];
    function snap(msg, extra) {
      ids.forEach(function (t) {
        st.history[t].push(st.held[t]);
      });
      frames.push(Object.assign({
        msg: msg,
        rows: st.rows.slice(),
        db: Object.assign({}, st.db),
        locks: JSON.parse(JSON.stringify(st.locks)),
        waiting: Object.assign({}, st.waiting),
        history: JSON.parse(JSON.stringify(st.history)),
        ids: ids
      }, extra || {}));
    }
    function compatible(t, item, mode) {
      return (st.locks[item] || []).every(function (h) {
        return h.t === t || (h.mode === "S" && mode === "S");
      });
    }
    function holders(item, t) {
      return (st.locks[item] || []).filter(function (h) {
        return h.t !== t;
      });
    }
    function release(t) {
      Object.keys(st.locks).forEach(function (item) {
        st.locks[item] = st.locks[item].filter(function (h) {
          return h.t !== t;
        });
      });
      st.held[t] = 0;
    }
    // Runs one instruction of t. Returns false if t must wait.
    function step(t) {
      var o = progs[t][st.pc[t]];
      var who = "T" + t;
      if (o.op === "lock") {
        var ok = compatible(t, o.item, o.mode);
        var hs = holders(o.item, t);
        var check = hs.length ? { req: o.mode, held: hs[0].mode, ok: ok } : null;
        if (!ok) {
          if (!st.waiting[t]) {
            st.waiting[t] = o;
            st.rows.push({ t: t, text: text(o), wait: true });
            snap(who + " asks for lock-" + o.mode + "(" + o.item + "). T" + hs[0].t + " holds a " + hs[0].mode + " lock on " + o.item + ", and " + o.mode + " is not compatible with " + hs[0].mode + ", so " + who + " must wait.", { check: check, turn: t });
          }
          return false;
        }
        var wasWaiting = !!st.waiting[t];
        delete st.waiting[t];
        (st.locks[o.item] = st.locks[o.item] || []).push({ t: t, mode: o.mode });
        st.held[t] += 1;
        var broke = st.unlocked[t];
        if (wasWaiting) {
          st.rows = st.rows.filter(function (r) {
            return !(r.wait && r.t === t);
          });
        }
        st.rows.push({ t: t, text: text(o), granted: true });
        st.pc[t] += 1;
        snap((wasWaiting ? "The lock on " + o.item + " is free now. " : "") + who + " is granted lock-" + o.mode + "(" + o.item + ")" +
          (check ? ", because " + o.mode + " is compatible with the " + check.held + " lock that T" + hs[0].t + " holds." : ".") +
          (broke ? " " + who + " already released a lock, so it is not two phase." : ""), { check: check, turn: t });
        return true;
      }
      st.pc[t] += 1;
      var msg;
      if (o.op === "unlock") {
        st.locks[o.item] = (st.locks[o.item] || []).filter(function (h) {
          return h.t !== t;
        });
        st.held[t] -= 1;
        var first = !st.unlocked[t];
        st.unlocked[t] = true;
        msg = who + " releases its lock on " + o.item + "." + (first && rule !== "early" ? " This is its first unlock, so " + who + " is now in the shrinking phase." : "");
      } else if (o.op === "r") {
        st.local[t][o.item] = st.db[o.item];
        var w = st.lastWriter[o.item];
        if (w && w !== t) st.readFrom.push({ reader: t, writer: w });
        msg = who + " reads " + o.item + " = " + st.db[o.item] + (w && w !== t ? ", a value written by T" + w + ", which has not committed." : ".");
      } else if (o.op === "w") {
        if (!(o.item in st.old[t])) st.old[t][o.item] = st.db[o.item];
        st.db[o.item] = st.local[t][o.item];
        st.lastWriter[o.item] = t;
        msg = who + " writes " + o.item + " = " + st.db[o.item] + ".";
      } else if (o.op === "calc") {
        o.fn(st.local[t]);
        msg = who + " computes " + o.text.replace(/ :=.*/, "") + " = " + st.local[t][o.text.charAt(0)] + " in its buffer.";
      } else if (o.op === "show") {
        var total = o.fn(st.local[t]);
        var right = sc.start.A + sc.start.B;
        msg = who + " displays A + B = " + total + "." + (total !== right ? " This total is wrong: A + B should always be " + right + ". T1 unlocked B too early, so T2 saw a half-done transfer." : " This is correct.");
      } else if (o.op === "commit") {
        release(t);
        Object.keys(st.lastWriter).forEach(function (k) {
          if (st.lastWriter[k] === t) delete st.lastWriter[k];
        });
        st.done[t] = true;
        msg = who + " commits" + (rule === "strict" || rule === "rigorous" ? " and releases all the locks it still holds." : ".");
      } else if (o.op === "abort") {
        // Undo t, and every transaction that read data depending on it.
        var victims = [t];
        var grow = true;
        while (grow) {
          grow = false;
          st.readFrom.forEach(function (r) {
            if (victims.indexOf(r.writer) >= 0 && victims.indexOf(r.reader) < 0) {
              victims.push(r.reader);
              grow = true;
            }
          });
        }
        victims.slice().reverse().forEach(function (v) {
          Object.keys(st.old[v]).forEach(function (k) {
            st.db[k] = st.old[v][k];
          });
          release(v);
        });
        st.done[t] = true;
        var others = victims.slice(1);
        msg = who + " fails and is rolled back" + (rule === "strict" || rule === "rigorous" ? ", releasing its locks" : "") + ". " +
          (others.length ? D.wq.list(others.map(function (v) { return "T" + v; })) + " read data that depends on " + who + ", so " + (others.length > 1 ? "they" : "it") + " must be rolled back too. This is a cascading rollback." : "No other transaction read its uncommitted data, so nothing else is rolled back.");
        st.rows.push({ t: t, text: text(o), bad: true });
        others.forEach(function (v) {
          st.done[v] = true;
          st.rows.push({ t: v, text: "rolled back", bad: true });
        });
      }
      if (o.op !== "abort") st.rows.push({ t: t, text: text(o) });
      snap(msg, { turn: t });
      return true;
    }

    snap("Start: " + Object.keys(sc.start).map(function (k) { return k + " = " + sc.start[k]; }).join(", ") + ". Rule: " + RULES[rule] + ".");
    var turns = sc.turns.slice();
    var guard = 0;
    while (guard++ < 200) {
      var live = ids.filter(function (t) {
        return !st.done[t] && st.pc[t] < progs[t].length;
      });
      if (!live.length) break;
      var pref = turns.length ? turns.shift() : live[0];
      var order = [pref].concat(live.filter(function (t) { return t !== pref; }));
      var ran = false;
      for (var i = 0; i < order.length && !ran; i++) {
        var t = order[i];
        if (st.done[t] || st.pc[t] >= progs[t].length) continue;
        ran = step(t);
      }
      if (!ran) {
        snap("Deadlock: " + D.wq.list(live.map(function (x) { return "T" + x; })) + " are each waiting for a lock that another one holds. None can go on. One must be rolled back (see the Deadlock topic).", { deadlock: true });
        break;
      }
    }
    // Two phase check for the final frame.
    var twoPhase = {};
    ids.forEach(function (t) {
      var seenUnlock = false;
      twoPhase[t] = progs[t].every(function (o) {
        if (o.op === "unlock") seenUnlock = true;
        return !(o.op === "lock" && seenUnlock);
      });
    });
    frames.forEach(function (f) {
      f.twoPhase = twoPhase;
      f.progs = progs;
    });
    return frames;
  }

  /* ---------- Drawing ---------- */

  function chart(f) {
    var ids = f.ids;
    var n = f.history[ids[0]].length;
    var maxH = 2;
    var w = 300;
    var rowH = 46;
    var h = ids.length * rowH + 10;
    var dx = Math.max(4, Math.min(16, (w - 50) / Math.max(1, n - 1)));
    var svg = '<svg class="lk-chart" viewBox="0 0 ' + w + " " + h + '" width="' + w + '" height="' + h + '" role="img" aria-label="Number of locks held by each transaction over time">';
    ids.forEach(function (t, k) {
      var base = 10 + k * rowH + rowH - 12;
      var hist = f.history[t];
      var peak = Math.max.apply(null, hist);
      var peakAt = hist.indexOf(peak);
      svg += '<text class="lk-ctext" x="0" y="' + (base - 8) + '">T' + t + "</text>";
      svg += '<line class="lk-axis" x1="30" y1="' + base + '" x2="' + (w - 4) + '" y2="' + base + '"/>';
      var pts = hist.map(function (v, i) {
        return (30 + i * dx).toFixed(1) + "," + (base - (v / maxH) * 26).toFixed(1);
      });
      var stepPts = [];
      pts.forEach(function (p, i) {
        if (i) stepPts.push(p.split(",")[0] + "," + pts[i - 1].split(",")[1]);
        stepPts.push(p);
      });
      svg += '<polyline class="lk-line t' + k + '" points="' + stepPts.join(" ") + '"/>';
      if (peak > 0 && f.twoPhase[t]) {
        var px = 30 + peakAt * dx;
        svg += '<line class="lk-point" x1="' + px + '" y1="' + (base - 32) + '" x2="' + px + '" y2="' + base + '"/>';
        if (hist.slice(peakAt).some(function (v) { return v < peak; }) || f.final) svg += '<text class="lk-ptext" x="' + (px + 3) + '" y="' + (base - 24) + '">lock point</text>';
      }
    });
    return svg + "</svg>";
  }

  function matrix(check) {
    var cell = function (req, held) {
      var on = check && check.req === req && check.held === held;
      var ok = req === "S" && held === "S";
      return '<td class="' + (ok ? "is-yes" : "is-no") + (on ? " is-on" : "") + '">' + (ok ? "true" : "false") + "</td>";
    };
    return '<table class="lk-matrix"><caption>Compatibility</caption><thead><tr><th scope="col"><span class="visually-hidden">Requested</span></th><th scope="col">S held</th><th scope="col">X held</th></tr></thead><tbody>' +
      '<tr><th scope="row">S asked</th>' + cell("S", "S") + cell("S", "X") + "</tr>" +
      '<tr><th scope="row">X asked</th>' + cell("X", "S") + cell("X", "X") + "</tr></tbody></table>";
  }

  function render(w, f) {
    var esc = D.wq.esc;
    var ids = f.ids;
    var rows = f.rows.map(function (r, i) {
      var last = i === f.rows.length - 1;
      var cls = (r.wait ? "is-wait" : "") + (r.bad ? " is-bad" : "") + (last ? " is-current" : "") + (/^(lock|unlock)/.test(r.text) ? " is-lock" : "");
      return '<tr class="' + cls + '">' + ids.map(function (t) {
        return "<td>" + (r.t === t ? esc(r.text) + (r.wait ? ' <span class="an-wait">waits</span>' : "") : "") + "</td>";
      }).join("") + "</tr>";
    }).join("");
    var table = '<div class="lk-left"><table class="lk-table"><caption class="visually-hidden">Instructions run so far</caption><thead><tr>' +
      ids.map(function (t) {
        return '<th scope="col">T' + t + (f.twoPhase && f.final ? (f.twoPhase[t] ? ' <span class="lk-tag is-yes">two phase</span>' : ' <span class="lk-tag is-no">not two phase</span>') : "") + "</th>";
      }).join("") + "</tr></thead><tbody>" + (rows || '<tr><td colspan="' + ids.length + '" class="muted">Nothing has run yet.</td></tr>') + "</tbody></table></div>";
    var lockRows = Object.keys(f.locks).filter(function (k) {
      return f.locks[k].length;
    }).map(function (k) {
      return "<tr><th scope=\"row\">" + k + "</th><td>" + f.locks[k].map(function (h) { return "T" + h.t + " (" + h.mode + ")"; }).join(", ") + "</td></tr>";
    }).join("");
    var waits = Object.keys(f.waiting).map(function (t) {
      return "T" + t + " waits for lock-" + f.waiting[t].mode + "(" + f.waiting[t].item + ")";
    });
    var side = '<div class="lk-side">' +
      '<div class="an-box an-db"><div class="an-cap">Database</div>' + Object.keys(f.db).map(function (k) {
        return '<div class="an-val"><span class="an-key">' + k + "</span> " + f.db[k] + "</div>";
      }).join("") + "</div>" +
      '<div class="an-box"><div class="an-cap">Lock table</div><table class="lk-locks"><caption class="visually-hidden">Locks held</caption><tbody>' + (lockRows || '<tr><td class="muted">No locks held</td></tr>') + "</tbody></table>" +
      (waits.length ? '<p class="lk-waits">' + esc(waits.join("; ")) + "</p>" : "") + "</div>" +
      '<div class="an-box">' + matrix(f.check) + "</div>" +
      '<div class="an-box lk-chart-box"><div class="an-cap">Locks held over time</div>' + chart(f) + "</div>" +
      "</div>";
    var end = f.deadlock ? '<p class="an-end is-bad">✕ Deadlock</p>' : "";
    w.stage.innerHTML = '<div class="lk-layout">' + table + side + "</div>" + end;
  }

  /* ---------- Widget ---------- */

  function Widget(root) {
    var self = this;
    this.name = root.getAttribute("data-scenario");
    if (!SCENARIOS[this.name]) this.name = "transfer";
    this.rule = root.getAttribute("data-rule");
    if (!RULES[this.rule]) this.rule = "basic";
    root.innerHTML =
      '<div class="widget-head"><strong>Lock manager and two phase locking</strong></div>' +
      '<div class="widget-controls">' +
      '<label class="wp-field wp-grow"><span>Transactions</span><select data-scenario>' +
      Object.keys(SCENARIOS).map(function (k) {
        return '<option value="' + k + '">' + D.wq.esc(SCENARIOS[k].label) + "</option>";
      }).join("") + "</select></label>" +
      '<label class="wp-field wp-grow"><span>Locking rule</span><select data-rule>' +
      Object.keys(RULES).map(function (k) {
        return '<option value="' + k + '">' + RULES[k] + "</option>";
      }).join("") + "</select></label></div>" +
      '<div class="widget-stage lk-stage" tabindex="0" aria-label="Instructions, lock table and chart. Scroll if needed."></div>' +
      "<div data-player></div>";
    this.stage = root.querySelector(".lk-stage");
    this.sSel = root.querySelector("[data-scenario]");
    this.rSel = root.querySelector("[data-rule]");
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
    this.rSel.value = this.rule;
    this.sSel.addEventListener("change", function () {
      self.name = self.sSel.value;
      self.load();
    });
    this.rSel.addEventListener("change", function () {
      self.rule = self.rSel.value;
      self.load();
    });
    this.load();
  }

  Widget.prototype.load = function () {
    var frames = simulate(this.name, this.rule);
    frames[frames.length - 1].final = true;
    this.player.load(frames, false);
  };

  D.locking = { RULES: RULES, SCENARIOS: SCENARIOS, program: program, simulate: simulate, text: text };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="locking"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
