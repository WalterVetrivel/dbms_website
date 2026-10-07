/* RAID simulator (widget V23).
   The student picks a RAID level, watches data blocks being written across the
   disks, fails one or two disks and then rebuilds them. Each data block holds a
   4-bit value, so the parity (P) can be checked by hand: P is the XOR of the data
   blocks in its stripe. RAID 6 adds a second check block (Q) computed with a
   different code; its value is not shown.
   Markup: <div class="widget" data-widget="raid" data-level="5"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  var VALUES = [6, 3, 9, 12, 5, 10, 7, 1, 14, 2, 11, 4];
  var STRIPES = 3;

  var LEVELS = {
    0: { name: "RAID 0: block striping", disks: 4, data: 4, tolerate: 0, unit: "block", note: "Blocks are spread over all disks. There is no redundancy." },
    1: { name: "RAID 1: mirroring", disks: 2, data: 1, tolerate: 1, unit: "block", note: "Every block is written to both disks." },
    3: { name: "RAID 3: bit-interleaved parity", disks: 4, data: 3, tolerate: 1, unit: "byte", note: "Data is striped in small units (bits or bytes). One disk holds all the parity." },
    4: { name: "RAID 4: block-interleaved parity", disks: 4, data: 3, tolerate: 1, unit: "block", note: "Data is striped in blocks. One disk holds all the parity." },
    5: { name: "RAID 5: distributed parity", disks: 4, data: 3, tolerate: 1, unit: "block", note: "Data is striped in blocks. The parity block moves to a different disk in each stripe." },
    6: { name: "RAID 6: P + Q redundancy", disks: 5, data: 3, tolerate: 2, unit: "block", note: "Two check blocks (P and Q) in each stripe, spread over all disks." }
  };

  function bits(v) {
    return ("000" + v.toString(2)).slice(-4);
  }

  function xor(list) {
    return list.reduce(function (a, b) {
      return a ^ b;
    }, 0);
  }

  // Where each kind of block goes in stripe s. Returns an array with one entry per disk.
  function stripeLayout(level, s) {
    var L = LEVELS[level];
    var slots = [];
    var i;
    if (level === 0) {
      for (i = 0; i < L.disks; i++) slots.push("data");
    } else if (level === 1) {
      slots = ["data", "mirror"];
    } else if (level === 3 || level === 4) {
      slots = ["data", "data", "data", "p"];
    } else if (level === 5) {
      var p = L.disks - 1 - (s % L.disks);
      for (i = 0; i < L.disks; i++) slots.push(i === p ? "p" : "data");
    } else if (level === 6) {
      var pp = L.disks - 1 - (s % L.disks);
      var q = (pp + 1) % L.disks;
      for (i = 0; i < L.disks; i++) slots.push(i === pp ? "p" : i === q ? "q" : "data");
    }
    return slots;
  }

  function blockName(level, n) {
    return (LEVELS[level].unit === "byte" ? "b" : "A") + n;
  }

  function emptyState(level) {
    var L = LEVELS[level];
    var rows = [];
    for (var s = 0; s < STRIPES; s++) {
      var row = [];
      for (var d = 0; d < L.disks; d++) row.push(null);
      rows.push(row);
    }
    var failed = [];
    for (var k = 0; k < L.disks; k++) failed.push(false);
    return { level: level, rows: rows, failed: failed, lost: false };
  }

  function clone(st) {
    return {
      level: st.level,
      rows: st.rows.map(function (r) {
        return r.map(function (c) {
          return c ? { kind: c.kind, label: c.label, val: c.val, mark: "" } : null;
        });
      }),
      failed: st.failed.slice(),
      lost: st.lost
    };
  }

  function writeFrames(level) {
    var L = LEVELS[level];
    var st = emptyState(level);
    var frames = [{ st: clone(st), msg: L.name + ". " + L.note + " Press Play to write the data." }];
    var n = 0;
    for (var s = 0; s < STRIPES; s++) {
      var slots = stripeLayout(level, s);
      var vals = [];
      var names = [];
      var dataDisks = [];
      slots.forEach(function (kind, d) {
        if (kind !== "data") return;
        n += 1;
        var v = VALUES[(n - 1) % VALUES.length];
        st.rows[s][d] = { kind: "data", label: blockName(level, n), val: v, mark: "new" };
        vals.push(v);
        names.push(blockName(level, n));
        dataDisks.push(d + 1);
      });
      var msg;
      if (level === 0) {
        msg = "Stripe " + (s + 1) + ": " + D.wq.list(names) + " go to disks " + D.wq.list(dataDisks) + ". All " + L.disks + " disks work in parallel.";
      } else if (level === 1) {
        st.rows[s][1] = { kind: "mirror", label: names[0], val: vals[0], mark: "new" };
        msg = "Write " + names[0] + " (" + bits(vals[0]) + "). The same block is written to disk 1 and to its mirror, disk 2.";
      } else {
        var p = xor(vals);
        var pDisk = slots.indexOf("p");
        st.rows[s][pDisk] = { kind: "p", label: "P" + (s + 1), val: p, mark: "new" };
        msg = "Stripe " + (s + 1) + ": write " + D.wq.list(names) + " on disks " + D.wq.list(dataDisks) + ". Parity P" + (s + 1) + " = " +
          vals.map(bits).join(" ⊕ ") + " = " + bits(p) + ", stored on disk " + (pDisk + 1) + ".";
        if (level === 6) {
          var qDisk = slots.indexOf("q");
          st.rows[s][qDisk] = { kind: "q", label: "Q" + (s + 1), val: null, mark: "new" };
          msg += " A second check block Q" + (s + 1) + " (a different code) goes on disk " + (qDisk + 1) + ".";
        }
      }
      frames.push({ st: clone(st), msg: msg, hl: s });
      st = clone(st);
    }
    var usable = Math.round((L.data / L.disks) * 100);
    frames.push({
      st: clone(st),
      msg: "All data is written. Usable space: " + L.data + " of " + L.disks + " disks (" + usable + "%). " +
        (L.tolerate === 0 ? "This level cannot survive a disk failure." : "This level survives the failure of any " + (L.tolerate === 1 ? "one disk" : "two disks") + ".") +
        " Now press Fail on a disk."
    });
    return frames;
  }

  // Can every block of the array still be read (directly or by computing it)?
  function survives(st) {
    var L = LEVELS[st.level];
    var down = st.failed.filter(Boolean).length;
    return down <= L.tolerate;
  }

  function failFrames(st0, d) {
    var L = LEVELS[st0.level];
    var st = clone(st0);
    st.failed[d] = true;
    var lostCells = 0;
    st.rows.forEach(function (row) {
      if (row[d]) {
        row[d].mark = "lost";
        lostCells += 1;
      }
    });
    var down = st.failed.filter(Boolean).length;
    var msg = "Disk " + (d + 1) + " fails. Its " + lostCells + " blocks can no longer be read. ";
    if (!survives(st)) {
      st.lost = true;
      msg += st0.level === 0
        ? "RAID 0 keeps no copy and no parity, so this data is lost. The whole array fails, because every file has blocks on every disk."
        : (down > 1 ? down + " disks are down, but RAID " + st0.level + " can survive only " + (L.tolerate === 1 ? "one" : "two") + ". Data is lost." : "Data is lost.");
      return [{ st: st, msg: msg }];
    }
    var frames = [{ st: clone(st), msg: msg + (st0.level === 1 ? "The array keeps working, using the copy of each block on the other disk." : "The array keeps working. Missing blocks are computed when they are read.") }];
    // Show how the first lost data block is computed.
    for (var s = 0; s < st.rows.length; s++) {
      var cell = st.rows[s][d];
      if (!cell || cell.kind === "q") continue;
      var others = [];
      st.rows[s].forEach(function (c, k) {
        if (k !== d && c && c.kind !== "q" && !st.failed[k]) others.push(c);
      });
      var how;
      if (st0.level === 1) {
        how = cell.kind === "mirror"
          ? "Disk 1 still holds " + cell.label + ", so every read uses disk 1."
          : "Read " + cell.label + " from its copy on disk 2 instead.";
      } else if (st.failed.filter(Boolean).length > 1) {
        how = "With two disks down, RAID 6 solves for the two missing blocks using both P and Q.";
      } else {
        how = cell.label + " = " + others.map(function (c) {
          return c.label;
        }).join(" ⊕ ") + " = " + others.map(function (c) {
          return bits(c.val);
        }).join(" ⊕ ") + " = " + bits(cell.val) + ".";
      }
      var shown = clone(st);
      shown.rows[s][d].mark = "computed";
      frames.push({ st: shown, msg: "Reading stripe " + (s + 1) + ": " + how, hl: s });
      break;
    }
    return frames;
  }

  function rebuildFrames(st0) {
    var down = [];
    st0.failed.forEach(function (f, k) {
      if (f) down.push(k);
    });
    if (!down.length) return [{ st: clone(st0), msg: "No disk has failed, so there is nothing to rebuild. Press Fail on a disk first." }];
    var st = clone(st0);
    if (st0.lost) {
      return [{ st: st, msg: "The failed disks can be replaced, but the lost blocks cannot be computed from the other disks. The data must be restored from a backup." }];
    }
    down.forEach(function (d) {
      st.failed[d] = false;
      st.rows.forEach(function (row) {
        if (row[d]) row[d].mark = "empty";
      });
    });
    var frames = [{ st: clone(st), msg: "New disk" + (down.length > 1 ? "s replace disks " : " replaces disk ") + D.wq.list(down.map(function (k) {
      return k + 1;
    })) + ". The rebuild fills them stripe by stripe. The array stays online, but it is slower while this runs." }];
    for (var s = 0; s < st.rows.length; s++) {
      var names = [];
      down.forEach(function (d) {
        var c = st.rows[s][d];
        if (c) {
          c.mark = "rebuilt";
          names.push(c.label);
        }
      });
      var how = st0.level === 1 ? "copied from the mirror" : down.length > 1 ? "computed from the other blocks using P and Q" : "computed by XOR of the other blocks in the stripe";
      frames.push({ st: clone(st), msg: "Stripe " + (s + 1) + ": " + D.wq.list(names) + " " + (names.length > 1 ? "are" : "is") + " " + how + ".", hl: s });
    }
    st.rows.forEach(function (row) {
      row.forEach(function (c) {
        if (c) c.mark = "";
      });
    });
    frames.push({ st: st, msg: "The rebuild is complete. All disks are working again." });
    return frames;
  }

  /* ---------- Drawing ---------- */

  function render(w, f) {
    var st = f.st;
    var L = LEVELS[st.level];
    var esc = D.wq.esc;
    var head = "<tr><th scope=\"col\" class=\"raid-corner\">Stripe</th>";
    for (var d = 0; d < L.disks; d++) {
      head += '<th scope="col"><span class="raid-disk' + (st.failed[d] ? " is-failed" : "") + '">Disk ' + (d + 1) + (st.failed[d] ? " (failed)" : "") + "</span>" +
        '<button type="button" class="btn raid-fail" data-fail="' + d + '"' + (st.failed[d] ? " disabled" : "") + ' aria-label="Fail disk ' + (d + 1) + '">Fail</button></th>';
    }
    head += "</tr>";
    var body = st.rows.map(function (row, s) {
      return "<tr" + (f.hl === s ? ' class="is-current"' : "") + '><th scope="row">' + (s + 1) + "</th>" + row.map(function (c, k) {
        if (!c) return '<td class="raid-cell is-free">' + (st.failed[k] ? "✕" : "") + "</td>";
        var mark = c.mark || "";
        var shown = mark === "empty" ? "" : c.kind === "q" ? "code" : bits(c.val);
        var name = c.kind === "mirror" ? c.label + " copy" : c.label;
        var title = mark === "lost" ? " (lost)" : mark === "computed" ? " (computed)" : mark === "rebuilt" ? " (rebuilt)" : "";
        return '<td class="raid-cell kind-' + c.kind + (mark ? " is-" + mark : "") + (st.failed[k] ? " on-failed" : "") + '"><span class="raid-name">' + esc(name) + '</span><span class="raid-val">' + esc(shown) + "</span>" +
          (title ? '<span class="visually-hidden">' + title + "</span>" : "") + "</td>";
      }).join("") + "</tr>";
    }).join("");
    w.stage.innerHTML = '<table class="raid-table"><caption class="visually-hidden">Blocks on each disk, one row per stripe</caption><thead>' + head + "</thead><tbody>" + body + "</tbody></table>";
    var down = st.failed.filter(Boolean).length;
    w.status.innerHTML = '<span class="badge ' + (st.lost ? "raid-bad" : down ? "raid-warn" : "raid-ok") + '">' + (st.lost ? "Data lost" : down ? "Working, degraded" : "Working") + "</span> " +
      "Usable space " + L.data + " of " + L.disks + " disks · survives " + (L.tolerate === 0 ? "no disk failure" : L.tolerate === 1 ? "one disk failure" : "two disk failures");
  }

  /* ---------- Widget ---------- */

  var count = 0;

  function Widget(root) {
    var self = this;
    count += 1;
    var u = "raid-" + count;
    this.level = Number(root.getAttribute("data-level"));
    if (!LEVELS[this.level]) this.level = 5;
    root.innerHTML =
      '<div class="widget-head"><strong>RAID simulator</strong></div>' +
      '<div class="widget-controls">' +
      '<label class="wp-field wp-grow"><span>RAID level</span><select data-level>' +
      Object.keys(LEVELS).map(function (k) {
        return '<option value="' + k + '">' + LEVELS[k].name + "</option>";
      }).join("") +
      "</select></label>" +
      '<button type="button" class="btn" data-rebuild>Replace and rebuild</button>' +
      "</div>" +
      '<p class="wp-meta" data-status></p>' +
      '<div class="widget-stage raid-stage" tabindex="0" id="' + u + '" aria-label="Disks and blocks. Scroll sideways if needed."></div>' +
      '<div data-player></div>';
    this.stage = root.querySelector(".raid-stage");
    this.status = root.querySelector("[data-status]");
    this.select = root.querySelector("[data-level]");
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (f) {
        render(self, f);
      },
      resetLabel: "Start again",
      onReset: function () {
        self.load(self.level);
      }
    });
    this.select.value = String(this.level);
    this.select.addEventListener("change", function () {
      self.load(Number(self.select.value));
    });
    root.querySelector("[data-rebuild]").addEventListener("click", function () {
      self.player.add(rebuildFrames(self.player.current().st));
    });
    this.stage.addEventListener("click", function (e) {
      var b = e.target.closest("[data-fail]");
      if (!b) return;
      var st = self.player.current().st;
      self.player.add(failFrames(st, Number(b.getAttribute("data-fail"))));
    });
    this.load(this.level);
  }

  Widget.prototype.load = function (level) {
    this.level = level;
    var frames = writeFrames(level);
    this.player.load(frames, true);
    this.player.say(LEVELS[level].name + ". " + LEVELS[level].note + " The data is written. Press Play to watch it being written, or press Fail on a disk.");
  };

  D.raid = { LEVELS: LEVELS, writeFrames: writeFrames, failFrames: failFrames, rebuildFrames: rebuildFrames, stripeLayout: stripeLayout };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="raid"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
