/* Schedule builder and serializability tester (widget V17).
   The student types a schedule such as "r1(A) w1(A) r2(A) c1 c2" or picks a
   preset from the notes. The widget shows the schedule in the textbook's
   column layout, steps through it to find the conflicting pairs, draws the
   precedence graph, and then says whether the schedule is serial, conflict
   serializable, view serializable, recoverable, cascadeless and strict.
   Markup: <div class="widget" data-widget="schedule-tester" data-preset="s3"></div>
   data-focus="recover" puts the recoverability presets first. */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  var PRESETS = {
    s1: { label: "Schedule 1: serial, T1 then T2", text: "r1(A) w1(A) r1(B) w1(B) r2(A) w2(A) r2(B) w2(B)" },
    s3: { label: "Schedule 3: concurrent, conflict serializable", text: "r1(A) w1(A) r2(A) w2(A) r1(B) w1(B) r2(B) w2(B)" },
    s4: { label: "Schedule 4: not serializable (cycle)", text: "r1(A) r2(A) w2(A) r2(B) w1(A) r1(B) w1(B) w2(B)" },
    s7: { label: "Schedule 7: r1(Q) w2(Q) w1(Q)", text: "r1(Q) w2(Q) w1(Q)" },
    blind: { label: "Blind writes: view but not conflict serializable", text: "r1(Q) w2(Q) w1(Q) w3(Q)" },
    three: { label: "Three transactions, no cycle", text: "r1(A) r2(B) w1(A) r3(A) w2(B) w3(A) r3(B) w3(B)" },
    unrecoverable: { label: "Non-recoverable: T2 commits after a dirty read", text: "r1(A) w1(A) r2(A) c2 r1(B) a1" },
    cascade: { label: "Cascading rollback: T1 aborts", text: "r1(A) r1(B) w1(A) r2(A) w2(A) r3(A) a1" },
    cascadeless: { label: "Cascadeless: reads only committed data", text: "r1(A) w1(A) c1 r2(A) w2(A) c2" },
    notStrict: { label: "Cascadeless but not strict", text: "w1(A) w2(A) c1 c2" }
  };

  /* ---------- Parsing ---------- */

  function parse(text) {
    var ops = [];
    var bad = [];
    String(text)
      .split(/[\s,;]+/)
      .filter(Boolean)
      .forEach(function (tok) {
        var m = /^(r|w|c|a)\s*(\d)(?:\(\s*([A-Za-z])\s*\))?$/i.exec(tok);
        if (!m) return bad.push(tok);
        var kind = m[1].toLowerCase();
        var item = m[3] ? m[3].toUpperCase() : null;
        if ((kind === "r" || kind === "w") && !item) return bad.push(tok);
        if ((kind === "c" || kind === "a") && item) return bad.push(tok);
        ops.push({ kind: kind, t: Number(m[2]), item: item });
      });
    return { ops: ops, bad: bad };
  }

  function opText(o) {
    if (o.kind === "r") return "read(" + o.item + ")";
    if (o.kind === "w") return "write(" + o.item + ")";
    return o.kind === "c" ? "commit" : "abort";
  }

  function short(o) {
    return o.kind + o.t + (o.item ? "(" + o.item + ")" : "");
  }

  function transactionsOf(ops) {
    var seen = [];
    ops.forEach(function (o) {
      if (seen.indexOf(o.t) < 0) seen.push(o.t);
    });
    return seen.sort(function (a, b) {
      return a - b;
    });
  }

  /* ---------- Analysis ---------- */

  function conflictsOf(ops, i) {
    var o = ops[i];
    var found = [];
    if (o.kind !== "r" && o.kind !== "w") return found;
    for (var k = 0; k < i; k++) {
      var p = ops[k];
      if (p.t === o.t || p.item !== o.item) continue;
      if (p.kind !== "r" && p.kind !== "w") continue;
      if (p.kind === "w" || o.kind === "w") found.push({ a: k, b: i, from: p.t, to: o.t, item: o.item });
    }
    return found;
  }

  function edgesOf(conflicts) {
    var map = {};
    conflicts.forEach(function (c) {
      var k = c.from + ">" + c.to;
      if (!map[k]) map[k] = { from: c.from, to: c.to, items: [] };
      if (map[k].items.indexOf(c.item) < 0) map[k].items.push(c.item);
    });
    return Object.keys(map).map(function (k) {
      return map[k];
    });
  }

  // Returns a cycle as a list of transactions, or null.
  function findCycle(nodes, edges) {
    var adj = {};
    nodes.forEach(function (n) {
      adj[n] = [];
    });
    edges.forEach(function (e) {
      adj[e.from].push(e.to);
    });
    var color = {};
    var stack = [];
    var cycle = null;
    function dfs(n) {
      color[n] = 1;
      stack.push(n);
      for (var i = 0; i < adj[n].length && !cycle; i++) {
        var m = adj[n][i];
        if (color[m] === 1) {
          cycle = stack.slice(stack.indexOf(m)).concat([m]);
        } else if (!color[m]) dfs(m);
      }
      stack.pop();
      color[n] = 2;
    }
    nodes.forEach(function (n) {
      if (!color[n] && !cycle) dfs(n);
    });
    return cycle;
  }

  function serialOrder(nodes, edges) {
    var inCount = {};
    nodes.forEach(function (n) {
      inCount[n] = 0;
    });
    edges.forEach(function (e) {
      inCount[e.to] += 1;
    });
    var order = [];
    var left = nodes.slice();
    while (left.length) {
      var pick = left.filter(function (n) {
        return inCount[n] === 0;
      })[0];
      if (pick === undefined) return null;
      order.push(pick);
      left.splice(left.indexOf(pick), 1);
      edges.forEach(function (e) {
        if (e.from === pick) inCount[e.to] -= 1;
      });
    }
    return order;
  }

  function isSerial(ops) {
    var done = [];
    var cur = null;
    for (var i = 0; i < ops.length; i++) {
      if (ops[i].t !== cur) {
        if (done.indexOf(ops[i].t) >= 0) return false;
        if (cur !== null) done.push(cur);
        cur = ops[i].t;
      }
    }
    return true;
  }

  // What each read sees and who writes each item last: the "view" of a schedule.
  function viewOf(ops) {
    var last = {};
    var count = {};
    var reads = {};
    ops.forEach(function (o) {
      if (o.kind === "r") {
        var key = o.t + ":" + o.item;
        count[key] = (count[key] || 0) + 1;
        reads[key + ":" + count[key]] = last[o.item] === undefined || last[o.item] === o.t ? (last[o.item] === o.t ? "self" : "initial") : "T" + last[o.item];
      } else if (o.kind === "w") {
        last[o.item] = o.t;
      }
    });
    return { reads: reads, final: last };
  }

  function sameView(a, b) {
    var ka = Object.keys(a.reads);
    if (ka.length !== Object.keys(b.reads).length) return false;
    for (var i = 0; i < ka.length; i++) if (a.reads[ka[i]] !== b.reads[ka[i]]) return false;
    var fa = Object.keys(a.final);
    if (fa.length !== Object.keys(b.final).length) return false;
    for (i = 0; i < fa.length; i++) if (a.final[fa[i]] !== b.final[fa[i]]) return false;
    return true;
  }

  function permutations(list) {
    if (list.length <= 1) return [list.slice()];
    var out = [];
    list.forEach(function (x, i) {
      var rest = list.slice(0, i).concat(list.slice(i + 1));
      permutations(rest).forEach(function (p) {
        out.push([x].concat(p));
      });
    });
    return out;
  }

  function viewSerialOrder(ops, ts) {
    var rw = ops.filter(function (o) {
      return o.kind === "r" || o.kind === "w";
    });
    var target = viewOf(rw);
    var perms = permutations(ts);
    for (var i = 0; i < perms.length; i++) {
      var serial = [];
      perms[i].forEach(function (t) {
        rw.forEach(function (o) {
          if (o.t === t) serial.push(o);
        });
      });
      if (sameView(target, viewOf(serial))) return perms[i];
    }
    return null;
  }

  function recoverability(ops) {
    var hasEnd = ops.some(function (o) {
      return o.kind === "c" || o.kind === "a";
    });
    if (!hasEnd) return null;
    var endAt = {};
    ops.forEach(function (o, i) {
      if ((o.kind === "c" || o.kind === "a") && endAt[o.t] === undefined) endAt[o.t] = { at: i, kind: o.kind };
    });
    var ended = function (t, i) {
      return endAt[t] !== undefined && endAt[t].at < i;
    };
    var res = { recoverable: true, cascadeless: true, strict: true, notes: [], cascades: [] };
    var dirty = [];
    ops.forEach(function (o, i) {
      if (o.kind !== "r" && o.kind !== "w") return;
      // The last other transaction that wrote this item and was not rolled back before now.
      var writer = null;
      for (var k = i - 1; k >= 0; k--) {
        var p = ops[k];
        if (p.kind === "w" && p.item === o.item && !(endAt[p.t] && endAt[p.t].kind === "a" && endAt[p.t].at < i)) {
          writer = p.t;
          break;
        }
      }
      if (writer === null || writer === o.t) return;
      if (!ended(writer, i)) {
        res.strict = false;
        if (o.kind === "w") res.notes.push("T" + o.t + " writes " + o.item + " while T" + writer + ", which wrote it, has not committed, so the schedule is not strict.");
      }
      if (o.kind !== "r") return;
      if (!ended(writer, i)) {
        res.cascadeless = false;
        res.notes.push("T" + o.t + " reads " + o.item + " written by T" + writer + " before T" + writer + " commits (a dirty read), so the schedule is not cascadeless.");
        dirty.push({ reader: o.t, writer: writer });
      }
      var readerEnd = endAt[o.t];
      if (readerEnd && readerEnd.kind === "c") {
        var w = endAt[writer];
        if (!w || w.kind !== "c" || w.at > readerEnd.at) {
          res.recoverable = false;
          res.notes.push("T" + o.t + " read " + o.item + " from T" + writer + " but commits before T" + writer + " commits, so the schedule is not recoverable.");
        }
      }
    });
    // Every transaction that read uncommitted data from an aborted one (directly or not) must roll back too.
    Object.keys(endAt).forEach(function (t) {
      if (endAt[t].kind !== "a") return;
      var victims = [];
      var grow = true;
      while (grow) {
        grow = false;
        dirty.forEach(function (d) {
          if ((String(d.writer) === t || victims.indexOf(d.writer) >= 0) && victims.indexOf(d.reader) < 0) {
            victims.push(d.reader);
            grow = true;
          }
        });
      }
      var names = function (list) {
        return D.wq.list(list.map(function (v) { return "T" + v; }));
      };
      var done = victims.filter(function (v) { return endAt[v] && endAt[v].kind === "c"; });
      var undo = victims.filter(function (v) { return done.indexOf(v) < 0; });
      if (undo.length) {
        res.cascades.push("T" + t + " aborts. " + names(undo) + (undo.length > 1 ? " read" : " reads") +
          " uncommitted data that depends on T" + t + ", so " + (undo.length > 1 ? "they" : "it") + " must roll back too (cascading rollback).");
      }
      if (done.length) {
        res.cascades.push("T" + t + " aborts, but " + names(done) + (done.length > 1 ? ", which read its data, have" : ", which read its data, has") +
          " already committed and cannot be rolled back. The database is left wrong.");
      }
    });
    return res;
  }

  function analyse(ops) {
    var ts = transactionsOf(ops);
    var conflicts = [];
    ops.forEach(function (o, i) {
      conflicts = conflicts.concat(conflictsOf(ops, i));
    });
    var edges = edgesOf(conflicts);
    var cycle = findCycle(ts, edges);
    return {
      ts: ts,
      conflicts: conflicts,
      edges: edges,
      serial: isSerial(ops),
      cycle: cycle,
      order: cycle ? null : serialOrder(ts, edges),
      view: viewSerialOrder(ops, ts),
      rec: recoverability(ops)
    };
  }

  /* ---------- Frames ---------- */

  function build(ops) {
    var frames = [];
    var conflicts = [];
    var ts = transactionsOf(ops);
    frames.push({ at: -1, conflicts: [], fresh: [], msg: "The schedule has " + ts.length + " transactions and " + ops.length + " operations. Press Next to look for conflicting pairs, one operation at a time." });
    ops.forEach(function (o, i) {
      var found = conflictsOf(ops, i);
      conflicts = conflicts.concat(found);
      var msg;
      if (o.kind === "c" || o.kind === "a") msg = "T" + o.t + " " + (o.kind === "c" ? "commits" : "aborts") + ". Commit and abort do not create conflicts.";
      else if (!found.length) msg = short(o) + ": no earlier operation of another transaction conflicts with it.";
      else
        msg = short(o) + " conflicts with " + D.wq.list(found.map(function (c) {
          return short(ops[c.a]);
        })) + " (same item, different transactions, at least one write). Edge" + (found.length > 1 ? "s " : " ") + D.wq.list(dedupe(found.map(function (c) {
          return "T" + c.from + " → T" + c.to;
        }))) + ".";
      frames.push({ at: i, conflicts: conflicts.slice(), fresh: found, msg: msg });
    });
    var a = analyse(ops);
    frames.push({ at: ops.length, conflicts: conflicts.slice(), fresh: [], final: a, msg: verdictLine(a) + recLine(a) });
    return frames;
  }

  function dedupe(list) {
    return list.filter(function (x, i) {
      return list.indexOf(x) === i;
    });
  }

  function verdictLine(a) {
    if (a.cycle) return "The precedence graph has a cycle (" + a.cycle.map(function (t) { return "T" + t; }).join(" → ") + "), so the schedule is not conflict serializable.";
    return "The precedence graph has no cycle, so the schedule is conflict serializable. An equivalent serial order is " + a.order.map(function (t) { return "T" + t; }).join(", ") + ".";
  }

  function recLine(a) {
    if (!a.rec) return "";
    if (!a.rec.recoverable) return " It is not recoverable.";
    if (!a.rec.cascadeless) return " It is recoverable but not cascadeless.";
    if (!a.rec.strict) return " It is cascadeless but not strict.";
    return " It is strict, so it is also cascadeless and recoverable.";
  }

  /* ---------- Drawing ---------- */

  function scheduleTable(ops, f) {
    var esc = D.wq.esc;
    var ts = transactionsOf(ops);
    var html = '<table class="st-table"><caption class="visually-hidden">The schedule, one column per transaction</caption><thead><tr><th scope="col">#</th>' +
      ts.map(function (t) {
        return '<th scope="col">T' + t + "</th>";
      }).join("") + "</tr></thead><tbody>";
    var freshRows = {};
    (f.fresh || []).forEach(function (c) {
      freshRows[c.a] = true;
    });
    ops.forEach(function (o, i) {
      var cls = i === f.at ? "is-current" : freshRows[i] ? "is-conflict" : i < f.at ? "is-done" : "";
      html += '<tr class="' + cls + '"><td class="st-n">' + (i + 1) + "</td>" + ts.map(function (t) {
        return "<td>" + (o.t === t ? '<span class="st-op kind-' + o.kind + '">' + esc(opText(o)) + "</span>" : "") + "</td>";
      }).join("") + "</tr>";
    });
    return html + "</tbody></table>";
  }

  function graph(w, ts, edges, cycle, freshEdges) {
    var n = ts.length;
    var size = 240;
    var hgt = n <= 2 ? 90 : size;
    var r = n <= 2 ? 70 : 82;
    var pos = {};
    ts.forEach(function (t, i) {
      var ang = n === 2 ? Math.PI * (i === 0 ? 1 : 0) : -Math.PI / 2 + (2 * Math.PI * i) / n;
      pos[t] = { x: size / 2 + r * Math.cos(ang), y: hgt / 2 + r * Math.sin(ang) };
    });
    var inCycle = function (e) {
      if (!cycle) return false;
      for (var i = 0; i + 1 < cycle.length; i++) if (cycle[i] === e.from && cycle[i + 1] === e.to) return true;
      return false;
    };
    var svg = '<svg class="st-graph" viewBox="0 0 ' + size + " " + hgt + '" width="' + size + '" height="' + hgt + '" role="img" aria-label="Precedence graph: ' +
      (edges.length ? edges.map(function (e) { return "T" + e.from + " to T" + e.to; }).join(", ") : "no edges") + '">';
    svg += '<defs><marker id="' + w.uid + '-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="st-head"/></marker>' +
      '<marker id="' + w.uid + '-c" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="st-head is-cycle"/></marker></defs>';
    edges.forEach(function (e) {
      var a = pos[e.from];
      var b = pos[e.to];
      var dx = b.x - a.x;
      var dy = b.y - a.y;
      var len = Math.sqrt(dx * dx + dy * dy) || 1;
      var ux = dx / len;
      var uy = dy / len;
      var two = edges.some(function (x) {
        return x.from === e.to && x.to === e.from;
      });
      // Curve both edges of a two-way pair so they do not overlap.
      var bend = two ? 22 : 0;
      var x1 = a.x + ux * 22;
      var y1 = a.y + uy * 22;
      var x2 = b.x - ux * 24;
      var y2 = b.y - uy * 24;
      var mx = (x1 + x2) / 2 - uy * bend;
      var my = (y1 + y2) / 2 + ux * bend;
      var cyc = inCycle(e);
      var isFresh = (freshEdges || []).some(function (c) {
        return c.from === e.from && c.to === e.to;
      });
      svg += '<path class="st-edge' + (cyc ? " is-cycle" : "") + (isFresh ? " is-new" : "") + '" d="M' + x1.toFixed(1) + "," + y1.toFixed(1) + " Q" + mx.toFixed(1) + "," + my.toFixed(1) + " " + x2.toFixed(1) + "," + y2.toFixed(1) + '" marker-end="url(#' + w.uid + (cyc ? "-c" : "-a") + ')"/>';
      var lx = (x1 + 2 * mx + x2) / 4 - uy * 10;
      var ly = (y1 + 2 * my + y2) / 4 + ux * 10 + 4;
      svg += '<text class="st-elabel" x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="middle">' + e.items.join(",") + "</text>";
    });
    ts.forEach(function (t) {
      var inC = cycle && cycle.indexOf(t) >= 0;
      svg += '<g class="st-node' + (inC ? " is-cycle" : "") + '"><circle cx="' + pos[t].x.toFixed(1) + '" cy="' + pos[t].y.toFixed(1) + '" r="20"/><text x="' + pos[t].x.toFixed(1) + '" y="' + (pos[t].y + 5).toFixed(1) + '" text-anchor="middle">T' + t + "</text></g>";
    });
    return svg + "</svg>";
  }

  function yesNo(ok, yes, no) {
    return '<li class="' + (ok ? "is-yes" : "is-no") + '"><span class="st-mark" aria-hidden="true">' + (ok ? "✓" : "✕") + "</span> " + (ok ? yes : no) + "</li>";
  }

  function verdicts(a) {
    var t = function (list) {
      return list.map(function (x) {
        return "T" + x;
      }).join(", ");
    };
    var html = '<ul class="st-verdicts">';
    html += yesNo(a.serial, "Serial: each transaction runs without a break.", "Not serial: the transactions are interleaved.");
    html += yesNo(!a.cycle, "Conflict serializable: no cycle. Equivalent serial order: " + (a.order ? t(a.order) : "") + ".", "Not conflict serializable: the precedence graph has a cycle.");
    html += yesNo(!!a.view, "View serializable: view equivalent to the serial order " + (a.view ? t(a.view) : "") + ".", "Not view serializable: no serial order gives the same reads and final writes.");
    if (a.rec) {
      html += yesNo(a.rec.recoverable, "Recoverable.", "Not recoverable.");
      html += yesNo(a.rec.cascadeless, "Cascadeless: no transaction reads uncommitted data.", "Not cascadeless.");
      html += yesNo(a.rec.strict, "Strict: no read or write of an item until its last writer has ended.", "Not strict.");
    } else {
      html += '<li class="is-info"><span class="st-mark" aria-hidden="true">i</span> Add commits (for example c1 c2) to check recoverability.</li>';
    }
    html += "</ul>";
    var notes = (a.rec ? dedupe(a.rec.notes.concat(a.rec.cascades)) : []);
    if (a.view && a.cycle) notes.unshift("This schedule has blind writes (writes with no read before them). That is why it is view serializable but not conflict serializable.");
    if (notes.length) html += '<ul class="st-notes">' + notes.map(function (n) {
      return "<li>" + D.wq.esc(n) + "</li>";
    }).join("") + "</ul>";
    return html;
  }

  function render(w, f) {
    var ops = w.ops;
    var shown = f.final ? f.final.edges : edgesOf(f.conflicts);
    var html = '<div class="st-layout"><div class="st-left">' + scheduleTable(ops, f) + "</div>" +
      '<div class="st-right"><div class="st-cap">Precedence graph</div>' + graph(w, transactionsOf(ops), shown, f.final ? f.final.cycle : null, f.fresh) +
      (f.final ? verdicts(f.final) : '<p class="st-hint muted">An edge Ti → Tj means an operation of Ti conflicts with a later operation of Tj, so Ti must come before Tj.</p>') +
      "</div></div>";
    w.stage.innerHTML = html;
  }

  /* ---------- Widget ---------- */

  var count = 0;

  function Widget(root) {
    var self = this;
    count += 1;
    this.uid = "st" + count;
    var keys = Object.keys(PRESETS);
    if (root.getAttribute("data-focus") === "recover") {
      keys = ["unrecoverable", "cascade", "cascadeless", "notStrict"].concat(keys.filter(function (k) {
        return ["unrecoverable", "cascade", "cascadeless", "notStrict"].indexOf(k) < 0;
      }));
    }
    var start = root.getAttribute("data-preset");
    if (!PRESETS[start]) start = keys[0];
    root.innerHTML =
      '<div class="widget-head"><strong>Schedule tester: serializability and recoverability</strong></div>' +
      '<div class="widget-controls">' +
      '<label class="wp-field wp-grow"><span>Preset schedule</span><select data-preset>' +
      keys.map(function (k) {
        return '<option value="' + k + '">' + D.wq.esc(PRESETS[k].label) + "</option>";
      }).join("") +
      '<option value="own">My own schedule</option></select></label>' +
      '<label class="wp-field wp-grow st-input"><span>Schedule (r1(A) = T1 reads A, w2(B) = T2 writes B, c1 = T1 commits, a1 = T1 aborts)</span><input type="text" data-text spellcheck="false" autocomplete="off"></label>' +
      '<button type="button" class="btn" data-run>Test it</button>' +
      "</div>" +
      '<p class="wp-meta" data-error role="alert"></p>' +
      '<div class="widget-stage st-stage" tabindex="0" aria-label="Schedule and precedence graph. Scroll sideways if needed."></div>' +
      "<div data-player></div>";
    this.stage = root.querySelector(".st-stage");
    this.select = root.querySelector("[data-preset]");
    this.input = root.querySelector("[data-text]");
    this.error = root.querySelector("[data-error]");
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (f) {
        render(self, f);
      }
    });
    this.select.value = start;
    this.input.value = PRESETS[start].text;
    this.select.addEventListener("change", function () {
      if (self.select.value === "own") {
        self.input.focus();
        return;
      }
      self.input.value = PRESETS[self.select.value].text;
      self.run();
    });
    root.querySelector("[data-run]").addEventListener("click", function () {
      self.run();
    });
    this.input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") self.run();
    });
    this.input.addEventListener("input", function () {
      self.select.value = "own";
    });
    this.run();
  }

  Widget.prototype.run = function () {
    var p = parse(this.input.value);
    var ts = transactionsOf(p.ops);
    var msg = "";
    if (p.bad.length) msg = "Could not read: " + p.bad.join(" ") + ". Use r1(A), w2(B), c1 or a1.";
    else if (!p.ops.length) msg = "Type a schedule first.";
    else if (ts.length > 5) msg = "Use at most 5 transactions.";
    else if (p.ops.length > 24) msg = "Use at most 24 operations.";
    this.error.textContent = msg;
    if (msg) return;
    this.ops = p.ops;
    this.player.load(build(p.ops), true);
    var a = analyse(p.ops);
    this.player.say(verdictLine(a) + recLine(a) + " Press Play or Back to watch the graph being built.");
  };

  D.scheduleTester = { PRESETS: PRESETS, parse: parse, analyse: analyse };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="schedule-tester"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
