/* Dense and sparse index lookup (widget V25).
   A data file of 15 student records, sorted on RollNo, three records to a block.
   The student searches for a roll number using a dense index, a sparse index or
   a two-level (multilevel) index and follows the pointers to the record.
   Markup: <div class="widget" data-widget="index-lookup" data-mode="sparse"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  var RECORDS = [
    [101, "Anitha", "CSE"], [104, "Bharath", "ECE"], [108, "Charan", "MECH"],
    [112, "Divya", "CSE"], [115, "Elango", "EEE"], [119, "Fathima", "CSE"],
    [123, "Ganesh", "ECE"], [126, "Harini", "IT"], [130, "Imran", "CSE"],
    [134, "Janani", "MECH"], [137, "Karthik", "IT"], [141, "Lakshmi", "ECE"],
    [145, "Manoj", "CSE"], [148, "Nandhini", "EEE"], [152, "Prakash", "IT"]
  ];
  var PER_BLOCK = 3;
  var INNER_PER_BLOCK = 3;

  function blocks() {
    var out = [];
    for (var i = 0; i < RECORDS.length; i += PER_BLOCK) out.push(RECORDS.slice(i, i + PER_BLOCK));
    return out;
  }
  var BLOCKS = blocks();

  // Index entries: { key, block, rec } (rec is null for a sparse entry, which points to the block).
  function denseIndex() {
    var out = [];
    BLOCKS.forEach(function (b, bi) {
      b.forEach(function (r, ri) {
        out.push({ key: r[0], block: bi, rec: ri });
      });
    });
    return out;
  }
  function sparseIndex() {
    return BLOCKS.map(function (b, bi) {
      return { key: b[0][0], block: bi, rec: null };
    });
  }
  // The outer index has one entry for each block of the inner (sparse) index.
  function outerIndex() {
    var inner = sparseIndex();
    var out = [];
    for (var i = 0; i < inner.length; i += INNER_PER_BLOCK) out.push({ key: inner[i].key, iblock: i / INNER_PER_BLOCK });
    return out;
  }

  // The last entry whose key is less than or equal to k, or -1.
  function floorEntry(entries, k) {
    var at = -1;
    entries.forEach(function (e, i) {
      if (e.key <= k) at = i;
    });
    return at;
  }

  function frame(mode, msg, hl, counts) {
    return { mode: mode, msg: msg, hl: hl || {}, counts: counts || { blocks: 0, recs: 0 } };
  }

  // Reads block bi from position start and checks records one by one.
  function scanBlock(mode, k, bi, start, hl, counts, frames) {
    var b = BLOCKS[bi];
    counts.blocks += 1;
    for (var ri = start; ri < b.length; ri++) {
      counts.recs += 1;
      var key = b[ri][0];
      var h = Object.assign({}, hl, { block: bi, rec: ri });
      if (key === k) {
        h.found = true;
        frames.push(frame(mode, "Read data block B" + (bi + 1) + ". Record " + key + " (" + b[ri][1] + ", " + b[ri][2] + ") is found. Data blocks read: " + counts.blocks + ".", h, { blocks: counts.blocks, recs: counts.recs }));
        return true;
      }
      if (key > k) {
        h.missing = true;
        frames.push(frame(mode, "Record " + key + " is greater than " + k + ", and the file is sorted, so " + k + " is not in the file. Search unsuccessful.", h, { blocks: counts.blocks, recs: counts.recs }));
        return false;
      }
      frames.push(frame(mode, "In block B" + (bi + 1) + ", record " + key + " is less than " + k + ". Move to the next record.", h, { blocks: counts.blocks, recs: counts.recs }));
    }
    // End of the block. The next block starts with a larger key (or there is none).
    var nb = BLOCKS[bi + 1];
    frames.push(frame(mode, nb
      ? "The block ends, and the next block starts at " + nb[0][0] + ", which is greater than " + k + ". So " + k + " is not in the file."
      : "The file ends. " + k + " is not in the file.", Object.assign({}, hl, { block: bi, missing: true }), { blocks: counts.blocks, recs: counts.recs }));
    return false;
  }

  function search(mode, k) {
    var frames = [frame(mode, "Search for RollNo " + k + " using the " + (mode === "multi" ? "two-level" : mode) + " index.")];
    var counts = { blocks: 0, recs: 0 };
    if (mode === "dense") {
      var di = denseIndex();
      var at = -1;
      di.forEach(function (e, i) {
        if (e.key === k) at = i;
      });
      if (at === -1) {
        frames.push(frame(mode, "The dense index has an entry for every RollNo, and there is no entry for " + k + ". So the record does not exist. No data block is read.", { entry: floorEntry(di, k), entryMissing: true }, counts));
        return frames;
      }
      var e = di[at];
      frames.push(frame(mode, "Find " + k + " in the index. Its entry points straight to record " + (e.rec + 1) + " of block B" + (e.block + 1) + ".", { entry: at }, counts));
      counts.blocks = 1;
      counts.recs = 1;
      frames.push(frame(mode, "Read block B" + (e.block + 1) + " and go to the record. Record " + k + " (" + BLOCKS[e.block][e.rec][1] + ") is found. Data blocks read: 1.", { entry: at, block: e.block, rec: e.rec, found: true }, { blocks: 1, recs: 1 }));
      return frames;
    }
    var si = sparseIndex();
    if (mode === "sparse") {
      var s = floorEntry(si, k);
      if (s === -1) {
        frames.push(frame(mode, k + " is smaller than the first index entry (" + si[0].key + "), so the record does not exist.", { entryMissing: true }, counts));
        return frames;
      }
      frames.push(frame(mode, "Find the largest index entry that is less than or equal to " + k + ". It is " + si[s].key + ", which points to block B" + (si[s].block + 1) + ".", { entry: s }, counts));
      scanBlock(mode, k, si[s].block, 0, { entry: s }, counts, frames);
      return frames;
    }
    // Two-level index: outer index, then one block of the inner index, then the data.
    var oi = outerIndex();
    var o = floorEntry(oi, k);
    if (o === -1) {
      frames.push(frame(mode, k + " is smaller than the first outer index entry (" + oi[0].key + "), so the record does not exist.", { outerMissing: true }, counts));
      return frames;
    }
    frames.push(frame(mode, "Outer index: the largest entry less than or equal to " + k + " is " + oi[o].key + ". It points to inner index block I" + (o + 1) + ".", { outer: o }, counts));
    var first = o * INNER_PER_BLOCK;
    var part = si.slice(first, first + INNER_PER_BLOCK);
    var p = floorEntry(part, k);
    frames.push(frame(mode, "Read inner index block I" + (o + 1) + ". The largest entry less than or equal to " + k + " is " + part[p].key + ". It points to data block B" + (part[p].block + 1) + ".", { outer: o, entry: first + p }, counts));
    scanBlock(mode, k, part[p].block, 0, { outer: o, entry: first + p }, counts, frames);
    return frames;
  }

  /* ---------- Drawing ---------- */

  function render(w, f) {
    var mode = f.mode;
    var hl = f.hl;
    var html = '<div class="idx-cols">';
    if (mode === "multi") {
      html += '<div class="idx-col"><h4>Outer index</h4><ul class="idx-list">' + outerIndex().map(function (e, i) {
        return '<li class="' + (hl.outer === i ? "is-path" : "") + '"><span class="idx-key">' + e.key + '</span><span class="idx-ptr">→ I' + (e.iblock + 1) + "</span></li>";
      }).join("") + "</ul></div>";
    }
    var entries = mode === "dense" ? denseIndex() : sparseIndex();
    html += '<div class="idx-col"><h4>' + (mode === "dense" ? "Dense index" : mode === "sparse" ? "Sparse index" : "Inner index") + "</h4>";
    if (mode === "multi") {
      for (var ib = 0; ib * INNER_PER_BLOCK < entries.length; ib++) {
        html += '<div class="idx-iblock' + (hl.outer === ib ? " is-path" : "") + '"><span class="idx-bname">I' + (ib + 1) + '</span><ul class="idx-list">' +
          entries.slice(ib * INNER_PER_BLOCK, (ib + 1) * INNER_PER_BLOCK).map(function (e, j) {
            var i = ib * INNER_PER_BLOCK + j;
            return '<li class="' + (hl.entry === i ? "is-path" : "") + '"><span class="idx-key">' + e.key + '</span><span class="idx-ptr">→ B' + (e.block + 1) + "</span></li>";
          }).join("") + "</ul></div>";
      }
    } else {
      html += '<ul class="idx-list' + (mode === "dense" ? " is-dense" : "") + '">' + entries.map(function (e, i) {
        var cls = hl.entry === i ? (hl.entryMissing ? "is-near" : "is-path") : "";
        return '<li class="' + cls + '"><span class="idx-key">' + e.key + '</span><span class="idx-ptr">→ B' + (e.block + 1) + (e.rec === null ? "" : "." + (e.rec + 1)) + "</span></li>";
      }).join("") + "</ul>";
    }
    html += "</div>";
    html += '<div class="idx-col idx-data"><h4>Data file (sorted on RollNo)</h4>' + BLOCKS.map(function (b, bi) {
      var on = hl.block === bi;
      return '<div class="idx-block' + (on ? " is-read" : "") + '"><span class="idx-bname">B' + (bi + 1) + '</span><table><tbody>' + b.map(function (r, ri) {
        var cls = on && hl.rec === ri ? (hl.found ? "is-found" : hl.missing ? "is-missing" : "is-check") : "";
        return '<tr class="' + cls + '"><td>' + r[0] + "</td><td>" + r[1] + "</td><td>" + r[2] + "</td></tr>";
      }).join("") + "</tbody></table></div>";
    }).join("") + "</div></div>";
    w.stage.innerHTML = html;
    var n = mode === "dense" ? denseIndex().length : mode === "sparse" ? sparseIndex().length : outerIndex().length + " outer + " + sparseIndex().length + " inner";
    w.meta.textContent = "Index entries: " + n + " · data blocks read: " + f.counts.blocks + " · records checked: " + f.counts.recs;
  }

  /* ---------- Widget ---------- */

  function Widget(root) {
    var self = this;
    this.mode = root.getAttribute("data-mode") || "dense";
    root.innerHTML =
      '<div class="widget-head"><strong>Dense and sparse index lookup</strong></div>' +
      '<form class="widget-controls" data-form>' +
      '<label class="wp-field"><span>Index</span><select data-mode>' +
      '<option value="dense">Dense index</option><option value="sparse">Sparse index</option><option value="multi">Multilevel (two-level) index</option>' +
      "</select></label>" +
      '<label class="wp-field"><span>RollNo to find</span><input type="text" inputmode="numeric" autocomplete="off" data-key value="126" size="6"></label>' +
      '<button type="submit" class="btn btn-primary">Search</button>' +
      '<button type="button" class="btn" data-try="137">Try 137</button>' +
      '<button type="button" class="btn" data-try="120">Try 120 (missing)</button>' +
      "</form>" +
      '<p class="wp-meta" data-meta></p>' +
      '<div class="widget-stage idx-stage" tabindex="0" aria-label="Index and data blocks"></div>' +
      "<div data-player></div>";
    this.stage = root.querySelector(".idx-stage");
    this.meta = root.querySelector("[data-meta]");
    this.input = root.querySelector("[data-key]");
    this.select = root.querySelector("[data-mode]");
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (f) {
        render(self, f);
      }
    });
    this.select.value = this.mode;
    root.querySelector("[data-form]").addEventListener("submit", function (e) {
      e.preventDefault();
      self.run();
    });
    this.select.addEventListener("change", function () {
      self.mode = self.select.value;
      self.run();
    });
    root.querySelectorAll("[data-try]").forEach(function (b) {
      b.addEventListener("click", function () {
        self.input.value = b.getAttribute("data-try");
        self.run();
      });
    });
    this.player.load([frame(this.mode, "Type a RollNo and press Search. Each data block holds three records.")]);
  }

  Widget.prototype.run = function () {
    var k = D.wq.parseKeys(this.input.value)[0];
    if (k === undefined) {
      this.player.say("Type a whole number, for example 126.");
      this.input.focus();
      return;
    }
    this.player.load(search(this.mode, k));
    this.player.play();
  };

  D.indexLookup = { search: search, denseIndex: denseIndex, sparseIndex: sparseIndex, outerIndex: outerIndex };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="index-lookup"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
