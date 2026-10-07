/* Extendible hashing (widget V29).
   The hash value of a key is the key itself, written in binary. The directory
   (bucket address table) uses the last d bits, where d is the global depth.
   Each bucket has a local depth. A full bucket splits; when its local depth
   equals the global depth, the directory doubles first. When a delete leaves a
   bucket empty, it merges with its split image, as in the class notes. Needs
   player.js.
   Markup: <div class="widget" data-widget="extendible-hash" data-preset="notes"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  var START_DEPTH = 2;
  var MAX_DEPTH = 5;

  var PRESETS = {
    notes: {
      label: "Class notes: 1, 3, 5, 8, 9, 12, 17, 28, then insert 2, 24 and delete 5, 12 (3 keys per bucket)",
      size: 3,
      ops: [["insert", [1, 3, 5, 8, 9, 12, 17, 28, 2, 24]], ["remove", [5, 12]]]
    },
    grow: {
      label: "Watch the directory grow: 4, 8, 12, 16, 20, 24 (2 keys per bucket)",
      size: 2,
      ops: [["insert", [4, 8, 12, 16, 20, 24]]]
    },
    mixed: {
      label: "Mixed keys: 6, 13, 21, 32, 15, 29, 10, 44, 5 (2 keys per bucket)",
      size: 2,
      ops: [["insert", [6, 13, 21, 32, 15, 29, 10, 44, 5]]]
    }
  };

  function bin(x, width) {
    var s = x.toString(2);
    while (s.length < width) s = "0" + s;
    return s;
  }

  function low(k, d) {
    return d === 0 ? 0 : k & ((1 << d) - 1);
  }

  function letter(i) {
    var s = "";
    i += 1;
    while (i > 0) {
      var r = (i - 1) % 26;
      s = String.fromCharCode(65 + r) + s;
      i = Math.floor((i - 1) / 26);
    }
    return s;
  }

  function start(size) {
    var st = { d: START_DEPTH, size: size, dir: [], buckets: {}, made: 0 };
    for (var i = 0; i < 1 << START_DEPTH; i++) {
      var id = letter(st.made++);
      st.buckets[id] = { depth: START_DEPTH, keys: [], overflow: [] };
      st.dir.push(id);
    }
    return st;
  }

  function clone(st) {
    var b = {};
    Object.keys(st.buckets).forEach(function (id) {
      var x = st.buckets[id];
      b[id] = { depth: x.depth, keys: x.keys.slice(), overflow: x.overflow.slice() };
    });
    return { d: st.d, size: st.size, dir: st.dir.slice(), buckets: b, made: st.made };
  }

  function fr(st, msg, hl) {
    return { st: clone(st), msg: msg, hl: hl || {} };
  }

  function bitsText(k, d) {
    return k + " = " + bin(k, Math.max(d, 1)) + " in binary. Its last " + d + " bit" + (d === 1 ? " is " : "s are ") + bin(low(k, d), d);
  }

  function find(st, k) {
    return st.dir[low(k, st.d)];
  }

  function insert(st0, k) {
    var st = clone(st0);
    var frames = [];
    var id = find(st, k);
    var b = st.buckets[id];
    if (b.keys.indexOf(k) !== -1 || b.overflow.indexOf(k) !== -1) {
      return [fr(st, k + " is already stored in bucket " + id + ".", { entry: low(k, st.d), bucket: id })];
    }
    frames.push(fr(st, bitsText(k, st.d) + ", so follow directory entry " + bin(low(k, st.d), st.d) + " to bucket " + id + ".", { entry: low(k, st.d), bucket: id }));
    for (var guard = 0; guard < 12; guard++) {
      id = find(st, k);
      b = st.buckets[id];
      if (b.keys.length < st.size) {
        b.keys.push(k);
        frames.push(fr(st, "Bucket " + id + " has room. Put " + k + " in it.", { entry: low(k, st.d), bucket: id, key: k }));
        return frames;
      }
      if (b.depth === st.d) {
        if (st.d === MAX_DEPTH) {
          b.overflow.push(k);
          frames.push(fr(st, "Bucket " + id + " is full, and the directory already uses " + MAX_DEPTH + " bits, which is the most this widget allows. " + k + " goes into an overflow bucket.", { bucket: id, key: k }));
          return frames;
        }
        st.dir = st.dir.concat(st.dir);
        st.d += 1;
        frames.push(fr(st, "Bucket " + id + " is full, and its local depth (" + b.depth + ") equals the global depth. So the directory doubles: the global depth becomes " + st.d + ", and there are now " + st.dir.length + " entries. Each new entry points to the same bucket as its partner.", { bucket: id, full: true, doubled: true }));
      }
      // Split bucket id on bit number b.depth.
      var bit = b.depth;
      var newId = letter(st.made++);
      var nb = { depth: bit + 1, keys: [], overflow: [] };
      b.depth = bit + 1;
      var all = b.keys.concat(b.overflow);
      b.keys = [];
      b.overflow = [];
      all.forEach(function (x) {
        var into = (x >> bit) & 1 ? nb : b;
        if (into.keys.length < st.size) into.keys.push(x);
        else into.overflow.push(x);
      });
      st.buckets[newId] = nb;
      for (var i = 0; i < st.dir.length; i++) {
        if (st.dir[i] === id && (i >> bit) & 1) st.dir[i] = newId;
      }
      var p0 = bin(low(all[0], bit), bit);
      frames.push(fr(st, "Split bucket " + id + ". Both buckets now have local depth " + (bit + 1) + ". Keys whose last " + (bit + 1) + " bits are 0" + p0 + " stay in " + id +
        (b.keys.length ? " (" + D.wq.list(b.keys) + ")" : "") + "; keys ending in 1" + p0 + " move to the new bucket " + newId +
        (nb.keys.length ? " (" + D.wq.list(nb.keys) + ")" : "") + ".", { bucket: id, bucket2: newId, split: true }));
      frames.push(fr(st, "Try " + k + " again: its last " + st.d + " bits " + bin(low(k, st.d), st.d) + " lead to bucket " + find(st, k) + ".", { entry: low(k, st.d), bucket: find(st, k) }));
    }
    return frames;
  }

  function remove(st0, k) {
    var st = clone(st0);
    var id = find(st, k);
    var b = st.buckets[id];
    var at = b.keys.indexOf(k);
    var frames = [];
    if (at === -1 && b.overflow.indexOf(k) === -1) {
      return [fr(st, bitsText(k, st.d) + ". Bucket " + id + " does not hold " + k + ", so nothing changes.", { entry: low(k, st.d), bucket: id, missing: true })];
    }
    if (at !== -1) b.keys.splice(at, 1);
    else b.overflow.splice(b.overflow.indexOf(k), 1);
    if (b.overflow.length && b.keys.length < st.size) b.keys.push(b.overflow.shift());
    frames.push(fr(st, bitsText(k, st.d) + ". Remove " + k + " from bucket " + id + ".", { entry: low(k, st.d), bucket: id }));
    // Merge an empty bucket with its split image.
    while (b.keys.length === 0 && b.depth > 1) {
      var bit = b.depth - 1;
      var idx = st.dir.indexOf(id);
      var buddyId = st.dir[idx ^ (1 << bit)];
      var buddy = st.buckets[buddyId];
      if (!buddy || buddy === b || buddy.depth !== b.depth) break;
      for (var i = 0; i < st.dir.length; i++) if (st.dir[i] === id) st.dir[i] = buddyId;
      delete st.buckets[id];
      buddy.depth -= 1;
      frames.push(fr(st, "Bucket " + id + " is now empty, so it merges with its split image, bucket " + buddyId + ". Their directory entries now all point to " + buddyId + ", and its local depth drops to " + buddy.depth + ".", { bucket: buddyId, changed: true }));
      id = buddyId;
      b = buddy;
    }
    // Halve the directory while no bucket needs all d bits.
    while (st.d > 1 && Object.keys(st.buckets).every(function (x) {
      return st.buckets[x].depth < st.d;
    })) {
      st.d -= 1;
      st.dir = st.dir.slice(0, 1 << st.d);
      frames.push(fr(st, "No bucket uses all " + (st.d + 1) + " bits any more, so the directory halves. The global depth is now " + st.d + ".", { doubled: true }));
    }
    if (frames.length === 1 && b.keys.length) frames[0].msg += " The bucket is not empty, so no buckets merge.";
    return frames;
  }

  function keyCount(st) {
    var n = 0;
    Object.keys(st.buckets).forEach(function (id) {
      n += st.buckets[id].keys.length + st.buckets[id].overflow.length;
    });
    return n;
  }

  /* ---------- Drawing ---------- */

  var SVG = "http://www.w3.org/2000/svg";
  function el(name, attrs, parent) {
    var e = document.createElementNS(SVG, name);
    for (var a in attrs) e.setAttribute(a, attrs[a]);
    if (parent) parent.appendChild(e);
    return e;
  }

  function render(w, f) {
    var st = f.st;
    var hl = f.hl;
    var svg = w.svg;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var ROW = 34;
    var GAP = 8;
    var DIR_X = 70;
    var DIR_W = 64;
    var B_X = 230;
    var CELL = 40;
    var BH = 34;
    // Order buckets by the first directory entry that points to them.
    var order = [];
    st.dir.forEach(function (id) {
      if (order.indexOf(id) === -1) order.push(id);
    });
    var dirH = st.dir.length * ROW;
    var bSpace = order.length * (BH + 22);
    var height = Math.max(dirH, bSpace) + 60;
    var bTop = 40 + Math.max(0, (dirH - bSpace) / 2);
    var bw = function (id) {
      return (st.size + (st.buckets[id].overflow.length ? 1 : 0)) * CELL;
    };
    var maxBW = 0;
    order.forEach(function (id) {
      maxBW = Math.max(maxBW, bw(id));
    });
    var width = B_X + maxBW + 100;
    svg.setAttribute("viewBox", "0 0 " + width + " " + height);
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    var t = el("text", { x: DIR_X + DIR_W / 2, y: 20, "text-anchor": "middle", class: "eh-title" }, svg);
    t.textContent = "Directory (global depth " + st.d + ")";
    var t2 = el("text", { x: B_X, y: 20, class: "eh-title" }, svg);
    t2.textContent = "Buckets";
    var lines = el("g", {}, svg);
    var bY = {};
    order.forEach(function (id, i) {
      bY[id] = bTop + i * (BH + 22);
    });
    st.dir.forEach(function (id, i) {
      var y = 40 + i * ROW;
      var on = hl.entry === i;
      el("line", { x1: DIR_X + DIR_W, y1: y + ROW / 2 - 2, x2: B_X - 2, y2: bY[id] + BH / 2, class: "eh-link" + (on ? " is-path" : "") }, lines);
      el("rect", { x: DIR_X, y: y, width: DIR_W, height: ROW - 4, rx: 4, class: "eh-dir" + (on ? " is-path" : "") }, svg);
      var tx = el("text", { x: DIR_X + DIR_W / 2, y: y + ROW / 2, "text-anchor": "middle", "dominant-baseline": "middle", class: "eh-bits" }, svg);
      tx.textContent = bin(i, st.d);
    });
    order.forEach(function (id) {
      var b = st.buckets[id];
      var y = bY[id];
      var cls = "eh-bucket";
      if (hl.bucket === id || hl.bucket2 === id) cls += hl.full ? " is-full" : hl.missing ? " is-missing" : hl.split ? " is-changed" : " is-path";
      var g = el("g", { class: cls, transform: "translate(" + B_X + "," + y + ")" }, svg);
      el("rect", { x: 0, y: 0, width: st.size * CELL, height: BH, rx: 5, class: "eh-box" }, g);
      for (var c = 0; c < st.size; c++) {
        if (c) el("line", { x1: c * CELL, y1: 0, x2: c * CELL, y2: BH, class: "eh-div" }, g);
        var k = b.keys[c];
        if (k === undefined) continue;
        var kt = el("text", { x: c * CELL + CELL / 2, y: BH / 2 + 1, "text-anchor": "middle", "dominant-baseline": "middle", class: "eh-key" + (k === hl.key ? " is-new" : "") }, g);
        kt.textContent = k;
      }
      if (b.overflow.length) {
        var ot = el("text", { x: st.size * CELL + 6, y: BH / 2 + 1, "dominant-baseline": "middle", class: "eh-over" }, g);
        ot.textContent = "+ " + b.overflow.join(", ");
      }
      var lt = el("text", { x: -8, y: -5, class: "eh-name" }, g);
      lt.textContent = id;
      var dt = el("text", { x: bw(id) + (b.overflow.length ? 30 : 8), y: BH / 2 + 1, "dominant-baseline": "middle", class: "eh-depth" }, g);
      dt.textContent = "local depth " + b.depth;
    });
    // Text alternative.
    w.text.innerHTML = "<p>Global depth " + st.d + ". Directory: " + st.dir.map(function (id, i) {
      return bin(i, st.d) + " → " + id;
    }).join(", ") + ".</p><p>" + order.map(function (id) {
      var b = st.buckets[id];
      return "Bucket " + id + " (local depth " + b.depth + "): " + (b.keys.length ? b.keys.join(", ") : "empty") + (b.overflow.length ? "; overflow " + b.overflow.join(", ") : "");
    }).join(". ") + ".</p>";
    w.meta.textContent = "Hash value = the key in binary · " + st.size + " keys per bucket · " + keyCount(st) + " keys stored";
  }

  /* ---------- Widget ---------- */

  var count = 0;

  function Widget(root) {
    var self = this;
    count += 1;
    var u = "eh-" + count;
    root.innerHTML =
      '<div class="widget-head"><strong>Extendible hashing</strong></div>' +
      '<div class="widget-controls">' +
      '<label class="wp-field"><span>Keys per bucket</span><select data-size><option>2</option><option>3</option><option>4</option></select></label>' +
      '<label class="wp-field wp-grow"><span>Example</span><select data-preset><option value="">Choose an example…</option>' +
      Object.keys(PRESETS).map(function (k) {
        return '<option value="' + k + '">' + PRESETS[k].label + "</option>";
      }).join("") + "</select></label>" +
      "</div>" +
      '<form class="widget-controls" data-form>' +
      '<label class="wp-field wp-grow"><span>Keys (numbers from 0 to 999)</span><input type="text" inputmode="numeric" autocomplete="off" data-keys placeholder="for example 11 or 4, 9, 13"></label>' +
      '<button type="submit" class="btn btn-primary">Insert</button>' +
      '<button type="button" class="btn" data-remove>Delete</button>' +
      "</form>" +
      '<p class="wp-meta" data-meta></p>' +
      '<div class="widget-stage eh-stage" tabindex="0" aria-label="Directory and buckets. Scroll sideways if needed."><svg class="eh-svg" role="img" aria-labelledby="' + u + '-text"></svg></div>' +
      "<div data-player></div>" +
      '<details class="bpt-text"><summary>Show the directory and buckets as text</summary><div id="' + u + '-text" data-text></div></details>';
    this.svg = root.querySelector("svg");
    this.text = root.querySelector("[data-text]");
    this.meta = root.querySelector("[data-meta]");
    this.input = root.querySelector("[data-keys]");
    this.sizeSel = root.querySelector("[data-size]");
    this.presetSel = root.querySelector("[data-preset]");
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (f) {
        render(self, f);
      },
      resetLabel: "Empty the file",
      onReset: function () {
        self.presetSel.value = "";
        self.reset();
      }
    });
    this.sizeSel.value = "3";
    this.sizeSel.addEventListener("change", function () {
      self.presetSel.value = "";
      self.reset("The bucket size changed, so the file starts empty again.");
    });
    this.presetSel.addEventListener("change", function () {
      if (self.presetSel.value) self.loadPreset(self.presetSel.value);
    });
    root.querySelector("[data-form]").addEventListener("submit", function (e) {
      e.preventDefault();
      self.run("insert");
    });
    root.querySelector("[data-remove]").addEventListener("click", function () {
      self.run("remove");
    });
    var p = root.getAttribute("data-preset");
    if (p && PRESETS[p]) this.loadPreset(p);
    else this.reset();
  }

  Widget.prototype.reset = function (msg) {
    this.player.load([{ st: start(Number(this.sizeSel.value)), msg: msg || "The directory starts with global depth 2: four entries (00, 01, 10 and 11), each pointing to its own empty bucket. Type a key and press Insert.", hl: {} }]);
  };

  Widget.prototype.loadPreset = function (key) {
    var p = PRESETS[key];
    this.sizeSel.value = String(p.size);
    this.presetSel.value = key;
    var st = start(p.size);
    var frames = [{ st: clone(st), msg: "Example: " + p.label + ". The directory starts with global depth 2.", hl: {} }];
    p.ops.forEach(function (op) {
      op[1].forEach(function (k) {
        var fs = op[0] === "insert" ? insert(st, k) : remove(st, k);
        fs.forEach(function (x) {
          x.op = (op[0] === "insert" ? "Insert " : "Delete ") + k;
        });
        frames = frames.concat(fs);
        st = fs[fs.length - 1].st;
      });
    });
    this.player.load(frames, true);
    this.player.say("Example loaded: " + p.label + ". This is the final state. Press Play to watch every step.");
  };

  Widget.prototype.run = function (action) {
    var keys = D.wq.parseKeys(this.input.value);
    if (!keys.length) {
      this.player.say("Type a whole number from 0 to 999 first. Separate several numbers with commas.");
      this.input.focus();
      return;
    }
    var st = this.player.current().st;
    var frames = [];
    keys.forEach(function (k) {
      var fs = action === "insert" ? insert(st, k) : remove(st, k);
      fs.forEach(function (x) {
        x.op = (action === "insert" ? "Insert " : "Delete ") + k;
      });
      frames = frames.concat(fs);
      st = fs[fs.length - 1].st;
    });
    this.input.value = "";
    this.player.add(frames);
  };

  D.extendibleHash = { start: start, insert: insert, remove: remove, find: find };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="extendible-hash"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
