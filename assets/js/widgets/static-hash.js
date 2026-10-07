/* Static hashing (widget V28).
   h(k) = k mod B, with a fixed number of buckets B. A full bucket is handled
   either by overflow chaining (closed hashing: overflow buckets are linked to
   the full bucket) or by linear probing (open hashing: the record goes into the
   next bucket that has room). Needs player.js.
   Markup: <div class="widget" data-widget="static-hash" data-preset="chaining"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  var PRESETS = {
    chaining: { label: "Overflow chaining: h(k) = k mod 5, 2 records per bucket", b: 5, size: 2, method: "chain", keys: [10, 22, 15, 37, 20, 41, 25, 13] },
    probing: { label: "Open hashing (linear probing): h(k) = k mod 10, 1 record per bucket", b: 10, size: 1, method: "probe", keys: [25, 55, 36, 105, 49, 99] },
    rollno: { label: "Roll numbers: h(k) = k mod 10, 2 records per bucket, chaining", b: 10, size: 2, method: "chain", keys: [34789, 34712, 34755, 34799, 34720, 34719] }
  };

  function empty(b) {
    var buckets = [];
    for (var i = 0; i < b; i++) buckets.push({ keys: [], overflow: [] });
    return buckets;
  }

  function clone(st) {
    return {
      b: st.b,
      size: st.size,
      method: st.method,
      buckets: st.buckets.map(function (x) {
        return { keys: x.keys.slice(), overflow: x.overflow.map(function (o) {
          return o.slice();
        }) };
      })
    };
  }

  function count(st) {
    var n = 0;
    st.buckets.forEach(function (x) {
      n += x.keys.length;
      x.overflow.forEach(function (o) {
        n += o.length;
      });
    });
    return n;
  }

  function has(st, k) {
    return st.buckets.some(function (x) {
      return x.keys.indexOf(k) !== -1 || x.overflow.some(function (o) {
        return o.indexOf(k) !== -1;
      });
    });
  }

  function f(st, msg, hl) {
    return { st: clone(st), msg: msg, hl: hl || {} };
  }

  function insert(st0, k) {
    var st = clone(st0);
    var h = k % st.b;
    var calc = "h(" + k + ") = " + k + " mod " + st.b + " = " + h + ".";
    if (has(st, k)) return [f(st, calc + " " + k + " is already stored. This widget keeps keys unique.", { bucket: h })];
    var frames = [];
    var home = st.buckets[h];
    if (home.keys.length < st.size) {
      home.keys.push(k);
      frames.push(f(st, calc + " Bucket " + h + " has room, so " + k + " goes there.", { bucket: h, key: k }));
      return frames;
    }
    if (st.method === "chain") {
      frames.push(f(st, calc + " Bucket " + h + " is full. This is a bucket overflow.", { bucket: h, full: true }));
      var last = home.overflow[home.overflow.length - 1];
      if (last && last.length < st.size) {
        last.push(k);
        frames.push(f(st, k + " goes into the overflow bucket already linked to bucket " + h + ".", { bucket: h, key: k }));
      } else {
        home.overflow.push([k]);
        frames.push(f(st, "Add a new overflow bucket to the chain of bucket " + h + " and put " + k + " in it. A search for these keys now reads " + (home.overflow.length + 1) + " blocks.", { bucket: h, key: k }));
      }
      return frames;
    }
    // Linear probing.
    frames.push(f(st, calc + " Bucket " + h + " is full (a collision), so look at the next bucket.", { bucket: h, full: true }));
    for (var step = 1; step < st.b; step++) {
      var j = (h + step) % st.b;
      if (st.buckets[j].keys.length < st.size) {
        st.buckets[j].keys.push(k);
        frames.push(f(st, "Bucket " + j + " has room, so " + k + " is stored there, " + step + " place" + (step === 1 ? "" : "s") + " away from its home bucket " + h + ".", { bucket: j, key: k, probe: probeList(h, step) }));
        return frames;
      }
      frames.push(f(st, "Bucket " + j + " is full too. Try the next bucket.", { bucket: j, full: true, probe: probeList(h, step) }));
    }
    frames.push(f(st, "Every bucket is full. With open hashing the table cannot hold more records, so " + k + " cannot be inserted.", { full: true }));
    return frames;
  }

  function probeList(h, steps) {
    var out = [];
    for (var i = 0; i <= steps; i++) out.push(i);
    return out.map(function (i) {
      return h + i;
    });
  }

  function search(st0, k) {
    var st = clone(st0);
    var h = k % st.b;
    var calc = "h(" + k + ") = " + k + " mod " + st.b + " = " + h + ".";
    var home = st.buckets[h];
    var frames = [f(st, calc + " Read bucket " + h + ".", { bucket: h })];
    if (home.keys.indexOf(k) !== -1) {
      frames.push(f(st, k + " is found in bucket " + h + ". Blocks read: 1.", { bucket: h, found: k }));
      return frames;
    }
    if (st.method === "chain") {
      for (var i = 0; i < home.overflow.length; i++) {
        if (home.overflow[i].indexOf(k) !== -1) {
          frames.push(f(st, k + " is not in the bucket itself. Follow the chain: it is found in overflow bucket " + (i + 1) + ". Blocks read: " + (i + 2) + ".", { bucket: h, found: k }));
          return frames;
        }
      }
      frames.push(f(st, k + " is not in bucket " + h + (home.overflow.length ? " or its overflow chain" : "") + ". It is not stored. Blocks read: " + (home.overflow.length + 1) + ".", { bucket: h, missing: true }));
      return frames;
    }
    for (var step = 1; step < st.b; step++) {
      var prev = st.buckets[(h + step - 1) % st.b];
      if (prev.keys.length < st.size) break;
      var j = (h + step) % st.b;
      if (st.buckets[j].keys.indexOf(k) !== -1) {
        frames.push(f(st, "Not there, and bucket " + ((h + step - 1) % st.b) + " is full, so keep probing. " + k + " is found in bucket " + j + ". Blocks read: " + (step + 1) + ".", { bucket: j, found: k, probe: probeList(h, step) }));
        return frames;
      }
      frames.push(f(st, "Not in bucket " + ((h + step - 1) % st.b) + ", which is full, so look at bucket " + j + ".", { bucket: j, probe: probeList(h, step) }));
    }
    frames.push(f(st, "The search reached a bucket with free space, so " + k + " cannot be further on. It is not stored.", { missing: true }));
    return frames;
  }

  /* ---------- Drawing ---------- */

  function render(w, fr) {
    var st = fr.st;
    var hl = fr.hl;
    var probe = (hl.probe || []).map(function (x) {
      return x % st.b;
    });
    var slots = function (keys, size) {
      var out = "";
      for (var i = 0; i < size; i++) {
        var k = keys[i];
        var cls = k === undefined ? "sh-slot is-free" : "sh-slot" + (k === hl.key ? " is-new" : "") + (k === hl.found ? " is-found" : "");
        out += '<span class="' + cls + '">' + (k === undefined ? "" : k) + "</span>";
      }
      return out;
    };
    var rows = st.buckets.map(function (x, i) {
      var cls = "sh-row" + (hl.bucket === i ? (hl.full ? " is-full" : hl.missing ? " is-missing" : " is-current") : probe.indexOf(i) !== -1 ? " is-probed" : "");
      var chain = x.overflow.map(function (o) {
        return '<span class="sh-arrow" aria-hidden="true">→</span><span class="sh-bucket is-overflow" title="Overflow bucket">' + slots(o, st.size) + "</span>";
      }).join("");
      return '<li class="' + cls + '"><span class="sh-label">Bucket ' + i + '</span><span class="sh-bucket">' + slots(x.keys, st.size) + "</span>" + chain +
        '<span class="visually-hidden">: ' + (x.keys.length ? x.keys.join(", ") : "empty") + (x.overflow.length ? "; overflow " + x.overflow.map(function (o) {
          return o.join(", ");
        }).join("; ") : "") + "</span></li>";
    }).join("");
    w.stage.innerHTML = '<ol class="sh-table" start="0">' + rows + "</ol>";
    w.meta.textContent = "h(k) = k mod " + st.b + " · " + st.size + " record" + (st.size === 1 ? "" : "s") + " per bucket · " + (st.method === "chain" ? "overflow chaining (closed hashing)" : "linear probing (open hashing)") + " · " + count(st) + " records stored";
  }

  /* ---------- Widget ---------- */

  function Widget(root) {
    var self = this;
    root.innerHTML =
      '<div class="widget-head"><strong>Static hashing</strong></div>' +
      '<div class="widget-controls">' +
      '<label class="wp-field"><span>Buckets (B)</span><select data-b><option>5</option><option>7</option><option>10</option></select></label>' +
      '<label class="wp-field"><span>Records per bucket</span><select data-size><option>1</option><option>2</option><option>3</option></select></label>' +
      '<label class="wp-field"><span>When a bucket is full</span><select data-method><option value="chain">Overflow chaining (closed hashing)</option><option value="probe">Linear probing (open hashing)</option></select></label>' +
      '<label class="wp-field wp-grow"><span>Example</span><select data-preset><option value="">Choose an example…</option>' +
      Object.keys(PRESETS).map(function (k) {
        return '<option value="' + k + '">' + PRESETS[k].label + "</option>";
      }).join("") + "</select></label>" +
      "</div>" +
      '<form class="widget-controls" data-form>' +
      '<label class="wp-field wp-grow"><span>Keys (one or more numbers)</span><input type="text" inputmode="numeric" autocomplete="off" data-keys placeholder="for example 17 or 4, 9, 13"></label>' +
      '<button type="submit" class="btn btn-primary">Insert</button>' +
      '<button type="button" class="btn" data-search>Search</button>' +
      "</form>" +
      '<p class="wp-meta" data-meta></p>' +
      '<div class="widget-stage sh-stage" tabindex="0" aria-label="Buckets of the hash file"></div>' +
      "<div data-player></div>";
    this.stage = root.querySelector(".sh-stage");
    this.meta = root.querySelector("[data-meta]");
    this.input = root.querySelector("[data-keys]");
    this.bSel = root.querySelector("[data-b]");
    this.sizeSel = root.querySelector("[data-size]");
    this.methodSel = root.querySelector("[data-method]");
    this.presetSel = root.querySelector("[data-preset]");
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (fr) {
        render(self, fr);
      },
      resetLabel: "Empty the file",
      onReset: function () {
        self.presetSel.value = "";
        self.reset();
      }
    });
    [this.bSel, this.sizeSel, this.methodSel].forEach(function (s) {
      s.addEventListener("change", function () {
        self.presetSel.value = "";
        self.reset("The settings changed, so the file starts empty again.");
      });
    });
    this.presetSel.addEventListener("change", function () {
      if (self.presetSel.value) self.loadPreset(self.presetSel.value);
    });
    root.querySelector("[data-form]").addEventListener("submit", function (e) {
      e.preventDefault();
      self.run("insert");
    });
    root.querySelector("[data-search]").addEventListener("click", function () {
      self.run("search");
    });
    var p = root.getAttribute("data-preset");
    if (p && PRESETS[p]) this.loadPreset(p);
    else this.reset();
  }

  Widget.prototype.settings = function () {
    return { b: Number(this.bSel.value), size: Number(this.sizeSel.value), method: this.methodSel.value };
  };

  Widget.prototype.reset = function (msg) {
    var s = this.settings();
    this.player.load([{ st: { b: s.b, size: s.size, method: s.method, buckets: empty(s.b) }, msg: msg || "The file is empty. Type a key and press Insert, or choose an example.", hl: {} }]);
  };

  Widget.prototype.loadPreset = function (key) {
    var p = PRESETS[key];
    this.bSel.value = String(p.b);
    this.sizeSel.value = String(p.size);
    this.methodSel.value = p.method;
    this.presetSel.value = key;
    var st = { b: p.b, size: p.size, method: p.method, buckets: empty(p.b) };
    var frames = [{ st: clone(st), msg: "Example: " + p.label + ". The file starts empty.", hl: {} }];
    p.keys.forEach(function (k) {
      var fs = insert(st, k);
      frames = frames.concat(fs);
      st = fs[fs.length - 1].st;
    });
    this.player.load(frames, true);
    this.player.say("Example loaded: " + p.label + ". Keys " + D.wq.list(p.keys) + " are inserted. Press Play to watch each step.");
  };

  Widget.prototype.run = function (action) {
    var keys = D.wq.parseKeys(this.input.value, 99999);
    if (!keys.length) {
      this.player.say("Type a whole number from 0 to 99999 first. Separate several numbers with commas.");
      this.input.focus();
      return;
    }
    var st = this.player.current().st;
    var frames = [];
    keys.forEach(function (k) {
      var fs = action === "insert" ? insert(st, k) : search(st, k);
      frames = frames.concat(fs);
      st = fs[fs.length - 1].st;
    });
    this.input.value = "";
    this.player.add(frames);
  };

  D.staticHash = { insert: insert, search: search, empty: empty };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="static-hash"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
