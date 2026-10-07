/* B tree visualizer (widget V27). Needs bplus-tree.js (for drawing) and player.js.
   The engine follows the class notes: n is the order (the largest number of
   pointers in a node), so a node holds at most n - 1 keys and every node except
   the root holds at least ceil(n / 2) - 1 keys. Each key appears only once.
   When a node overflows, the key at position floor(len / 2) moves up to the
   parent. Deleting a key from an internal node replaces it with its in-order
   successor. An underflow borrows from the left sibling, then the right sibling,
   and merges only when neither can spare a key.
   Markup: <div class="widget" data-widget="btree" data-n="3" data-preset="notes-order3"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  /* ---------- Engine ---------- */

  function BTree(n) {
    this.n = n;
    this.root = null;
    this.seq = 0;
    this.frames = [];
    this.op = "";
  }

  BTree.prototype.minKeys = function () {
    return Math.ceil(this.n / 2) - 1;
  };

  BTree.prototype.makeNode = function (leaf, keys, children) {
    this.seq += 1;
    return { id: this.seq, leaf: leaf, keys: keys || [], children: children || [], next: null };
  };

  function cloneNode(node) {
    if (!node) return null;
    return { id: node.id, leaf: node.leaf, keys: node.keys.slice(), next: null, children: node.children.map(cloneNode) };
  }

  function show(keys) {
    return keys.length ? "[" + keys.join(" | ") + "]" : "empty";
  }

  BTree.prototype.rec = function (msg, hl) {
    hl = hl || {};
    hl.plain = true;
    this.frames.push({ tree: cloneNode(this.root), msg: msg, hl: hl, op: this.op });
  };

  // Index of the first key that is greater than or equal to k.
  function position(node, k) {
    var i = 0;
    while (i < node.keys.length && k > node.keys[i]) i += 1;
    return i;
  }

  function explain(node, k, i) {
    if (i === 0) return k + " < " + node.keys[0] + ", so follow the first pointer.";
    if (i === node.keys.length) return k + " > " + node.keys[i - 1] + ", so follow the last pointer.";
    return node.keys[i - 1] + " < " + k + " < " + node.keys[i] + ", so follow pointer " + (i + 1) + ".";
  }

  // Walks down from the root. Returns { path, node, index } where node holds k, or node is the leaf where k belongs.
  BTree.prototype.descend = function (k, narrate) {
    var path = [];
    var node = this.root;
    while (node) {
      path.push(node);
      var i = position(node, k);
      if (i < node.keys.length && node.keys[i] === k) return { path: path, node: node, index: i, found: true };
      if (node.leaf) return { path: path, node: node, index: i, found: false };
      if (narrate) this.rec("At node [" + node.keys.join(" | ") + "]: " + explain(node, k, i), { path: ids(path), focus: node.id });
      node = node.children[i];
    }
    return { path: path, node: null, index: 0, found: false };
  };

  function ids(path) {
    return path.map(function (x) {
      return x.id;
    });
  }

  BTree.prototype.search = function (k) {
    this.op = "Search " + k;
    if (!this.root) {
      this.rec("The tree is empty, so " + k + " is not found.");
      return;
    }
    var r = this.descend(k, true);
    if (r.found) {
      this.rec(k + " is found in node [" + r.node.keys.join(" | ") + "]" + (r.node.leaf ? "." : ". It is an internal node, so the search stops early. A B+ tree search would go on down to a leaf."), { path: ids(r.path), found: { id: r.node.id, key: k } });
    } else {
      this.rec(k + " is not in the leaf [" + r.node.keys.join(" | ") + "]. The search is unsuccessful.", { path: ids(r.path), missing: r.node.id });
    }
  };

  BTree.prototype.insert = function (k) {
    this.op = "Insert " + k;
    if (!this.root) {
      this.root = this.makeNode(true, [k]);
      this.rec("The tree is empty. Make a root node and put " + k + " in it.", { changed: [this.root.id], key: k });
      return;
    }
    var r = this.descend(k, true);
    if (r.found) {
      this.rec(k + " is already in the tree. In a B tree each key appears only once, so nothing changes.", { path: ids(r.path), found: { id: r.node.id, key: k } });
      return;
    }
    var leaf = r.node;
    leaf.keys.splice(r.index, 0, k);
    if (leaf.keys.length <= this.n - 1) {
      this.rec("Put " + k + " into the leaf in sorted order: [" + leaf.keys.join(" | ") + "].", { path: ids(r.path), changed: [leaf.id], key: k });
      return;
    }
    this.rec("Put " + k + " into the leaf: [" + leaf.keys.join(" | ") + "]. It now has " + leaf.keys.length + " keys, but the most is " + (this.n - 1) + ", so it must split.", { path: ids(r.path), overflow: [leaf.id], key: k });
    this.split(r.path, r.path.length - 1, k);
  };

  // Splits the overfull node at path[depth]; the middle key moves up.
  BTree.prototype.split = function (path, depth, k) {
    var node = path[depth];
    var mid = Math.floor(node.keys.length / 2);
    var up = node.keys[mid];
    var right = this.makeNode(node.leaf, node.keys.slice(mid + 1), node.leaf ? [] : node.children.slice(mid + 1));
    node.keys = node.keys.slice(0, mid);
    if (!node.leaf) node.children = node.children.slice(0, mid + 1);
    var parent = depth > 0 ? path[depth - 1] : null;
    var msg = "Split the node into [" + node.keys.join(" | ") + "] and [" + right.keys.join(" | ") + "]. The middle key " + up + " moves up";
    if (!parent) {
      this.root = this.makeNode(false, [up], [node, right]);
      this.rec(msg + " into a new root. The tree grows one level taller.", { changed: [node.id, right.id, this.root.id], key: up });
      return;
    }
    var i = parent.children.indexOf(node);
    parent.keys.splice(i, 0, up);
    parent.children.splice(i + 1, 0, right);
    if (parent.keys.length <= this.n - 1) {
      this.rec(msg + " into the parent: [" + parent.keys.join(" | ") + "].", { changed: [node.id, right.id, parent.id], key: up });
      return;
    }
    this.rec(msg + ". Now the parent [" + parent.keys.join(" | ") + "] is too full, so it splits too.", { changed: [node.id, right.id], overflow: [parent.id], key: up });
    this.split(path, depth - 1, k);
  };

  BTree.prototype.remove = function (k) {
    this.op = "Delete " + k;
    if (!this.root) {
      this.rec("The tree is empty, so there is nothing to delete.");
      return;
    }
    var r = this.descend(k, true);
    if (!r.found) {
      this.rec(k + " is not in the tree, so nothing changes.", { path: ids(r.path), missing: r.node.id });
      return;
    }
    var node = r.node;
    var path = r.path;
    if (!node.leaf) {
      // Replace with the in-order successor: the smallest key in the right subtree.
      var child = node.children[r.index + 1];
      var sPath = path.slice();
      while (child) {
        sPath.push(child);
        if (child.leaf) break;
        child = child.children[0];
      }
      var succLeaf = sPath[sPath.length - 1];
      var succ = succLeaf.keys[0];
      this.rec(k + " is in an internal node. Replace it with its in-order successor " + succ + " (the smallest key in the subtree to its right), then delete " + succ + " from its leaf.", { path: ids(sPath), focus: node.id, found: { id: node.id, key: k } });
      node.keys[r.index] = succ;
      succLeaf.keys.shift();
      this.rec(succ + " takes the place of " + k + ". The leaf is now " + show(succLeaf.keys) + ".", { changed: [node.id, succLeaf.id], key: succ });
      this.fix(sPath, sPath.length - 1);
      return;
    }
    node.keys.splice(r.index, 1);
    if (node === this.root) {
      if (!node.keys.length) {
        this.root = null;
        this.rec("Remove " + k + ". The root is now empty, so the tree is empty.");
      } else {
        this.rec("Remove " + k + " from the root: [" + node.keys.join(" | ") + "].", { changed: [node.id] });
      }
      return;
    }
    this.rec("Remove " + k + " from the leaf. It is now " + show(node.keys) + ".", { path: ids(path), changed: [node.id] });
    this.fix(path, path.length - 1);
  };

  BTree.prototype.canLend = function (node) {
    return node && node.keys.length > this.minKeys();
  };

  // Repairs path[depth] if it has too few keys.
  BTree.prototype.fix = function (path, depth) {
    var node = path[depth];
    var min = this.minKeys();
    if (node === this.root) {
      if (!node.keys.length && node.children.length === 1) {
        this.root = node.children[0];
        this.rec("The root has no keys left, so its only child becomes the new root. The tree is one level shorter.", { changed: [this.root.id] });
      }
      return;
    }
    if (node.keys.length >= min) {
      if (min > 0 || node.keys.length) this.rec("The node still has at least " + min + " key" + (min === 1 ? "" : "s") + ", so the tree is valid.", { changed: [node.id] });
      return;
    }
    var parent = path[depth - 1];
    var i = parent.children.indexOf(node);
    var left = i > 0 ? parent.children[i - 1] : null;
    var right = i < parent.children.length - 1 ? parent.children[i + 1] : null;
    this.rec("The node now has " + node.keys.length + " key" + (node.keys.length === 1 ? "" : "s") + ", but it needs at least " + min + ". It must borrow a key or merge.", { overflow: [node.id] });
    if (this.canLend(left)) {
      var sepL = parent.keys[i - 1];
      var lendL = left.keys.pop();
      node.keys.unshift(sepL);
      parent.keys[i - 1] = lendL;
      if (!node.leaf) node.children.unshift(left.children.pop());
      this.rec("Borrow from the left sibling: " + sepL + " comes down from the parent, and " + lendL + " goes up from the sibling to take its place.", { changed: [node.id, left.id, parent.id], key: lendL });
      return;
    }
    if (this.canLend(right)) {
      var sepR = parent.keys[i];
      var lendR = right.keys.shift();
      node.keys.push(sepR);
      parent.keys[i] = lendR;
      if (!node.leaf) node.children.push(right.children.shift());
      this.rec("Borrow from the right sibling: " + sepR + " comes down from the parent, and " + lendR + " goes up from the sibling to take its place.", { changed: [node.id, right.id, parent.id], key: lendR });
      return;
    }
    // Merge with a sibling; the separating key comes down from the parent.
    var a = left || node;
    var b = left ? node : right;
    var j = parent.children.indexOf(a);
    var sep = parent.keys[j];
    a.keys = a.keys.concat([sep], b.keys);
    a.children = a.children.concat(b.children);
    parent.keys.splice(j, 1);
    parent.children.splice(j + 1, 1);
    this.rec("No sibling can spare a key, so merge with the " + (left ? "left" : "right") + " sibling. The separating key " + sep + " comes down from the parent: [" + a.keys.join(" | ") + "].", { changed: [a.id, parent.id], key: sep });
    this.fix(path, depth - 1);
  };

  BTree.prototype.walk = function (fn) {
    (function visit(node, depth) {
      if (!node) return;
      fn(node, depth);
      node.children.forEach(function (c) {
        visit(c, depth + 1);
      });
    })(this.root, 0);
  };

  BTree.prototype.keys = function () {
    var out = [];
    (function visit(node) {
      if (!node) return;
      node.keys.forEach(function (key, i) {
        if (!node.leaf) visit(node.children[i]);
        out.push(key);
      });
      if (!node.leaf) visit(node.children[node.keys.length]);
    })(this.root);
    return out;
  };

  // Checks the B tree rules. Returns a list of problems (empty when valid).
  BTree.prototype.validate = function () {
    var self = this;
    var problems = [];
    var leafDepth = -1;
    this.walk(function (node, depth) {
      if (node.keys.length > self.n - 1) problems.push("node " + node.id + " has too many keys");
      if (node !== self.root && node.keys.length < self.minKeys()) problems.push("node " + node.id + " is under-full");
      if (node.leaf) {
        if (leafDepth === -1) leafDepth = depth;
        else if (leafDepth !== depth) problems.push("leaves at different depths");
      } else if (node.children.length !== node.keys.length + 1) {
        problems.push("node " + node.id + " pointer count is wrong");
      }
    });
    var all = this.keys();
    for (var i = 1; i < all.length; i++) if (all[i] <= all[i - 1]) problems.push("keys out of order");
    return problems;
  };

  function describe(root) {
    if (!root) return ["The tree is empty."];
    var lines = [];
    var level = [root];
    var depth = 1;
    while (level.length) {
      lines.push((level[0].leaf ? "Leaves" : "Level " + depth) + ": " + level.map(function (x) {
        return "[" + x.keys.join(" | ") + "]";
      }).join("  "));
      var next = [];
      level.forEach(function (x) {
        next = next.concat(x.children);
      });
      level = next;
      depth += 1;
    }
    return lines;
  }

  D.BTree = BTree;
  D.BTree.describe = describe;

  /* ---------- Widget ---------- */

  var PRESETS = {
    "notes-order3": {
      label: "Class notes: 20, 10, 30, 15, 12, 40, 50 with order 3",
      n: 3,
      ops: [["insert", [20, 10, 30, 15, 12, 40, 50]]]
    },
    "qb-compare": {
      label: "Same keys as the B+ tree question: 2, 3, 5 … 31 with n = 3",
      n: 3,
      ops: [["insert", [2, 3, 5, 7, 11, 17, 19, 23, 29, 31]]]
    },
    "delete-demo": {
      label: "Deletion practice: the class notes tree, then delete 20, 50 and 10",
      n: 3,
      ops: [["insert", [20, 10, 30, 15, 12, 40, 50]], ["remove", [20, 50, 10]]]
    },
    "order5": {
      label: "Order 5: insert 1 to 20",
      n: 5,
      ops: [["insert", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]]]
    }
  };

  var count = 0;

  function Widget(root) {
    var self = this;
    count += 1;
    var u = "bt-" + count;
    this.n = Number(root.getAttribute("data-n")) || 3;
    this.ops = [];
    var presetOptions = Object.keys(PRESETS).map(function (key) {
      return '<option value="' + key + '">' + PRESETS[key].label + "</option>";
    }).join("");
    root.innerHTML =
      '<div class="widget-head"><strong>B tree visualizer</strong></div>' +
      '<p class="wp-meta" data-meta></p>' +
      '<div class="widget-controls">' +
      '<label class="wp-field"><span>Order (n)</span><select data-n-select>' + [3, 4, 5, 6].map(function (v) {
        return '<option value="' + v + '">' + v + "</option>";
      }).join("") + "</select></label>" +
      '<label class="wp-field wp-grow"><span>Example</span><select data-preset-select><option value="">Choose an example…</option>' + presetOptions + "</select></label>" +
      "</div>" +
      '<form class="widget-controls" data-ops>' +
      '<label class="wp-field wp-grow"><span>Keys (one or more numbers)</span><input data-keys type="text" inputmode="numeric" autocomplete="off" placeholder="for example 8 or 4, 9, 13"></label>' +
      '<button type="submit" class="btn btn-primary" data-act="insert">Insert</button>' +
      '<button type="button" class="btn" data-act="remove">Delete</button>' +
      '<button type="button" class="btn" data-act="search">Search</button>' +
      '<label class="wp-check"><input type="checkbox" data-compare> Show the B+ tree for the same keys</label>' +
      "</form>" +
      '<div class="widget-stage bpt-stage" tabindex="0" aria-label="B tree drawing. Scroll sideways if the tree is wide."><svg id="' + u + '-svg" class="bpt-svg" role="img" aria-labelledby="' + u + '-text"></svg></div>' +
      '<div class="bt-compare" data-compare-box hidden><p class="wp-meta">B+ tree with the same n after the same operations. Every key is in a leaf, and the leaves are linked.</p>' +
      '<div class="widget-stage bpt-stage" tabindex="0" aria-label="B+ tree drawing for comparison"><svg id="' + u + '-cmp" class="bpt-svg" role="img" aria-labelledby="' + u + '-cmptext"></svg></div><p class="visually-hidden" id="' + u + '-cmptext" data-cmp-text></p></div>' +
      "<div data-player></div>" +
      '<details class="bpt-text"><summary>Show the tree as text</summary><div id="' + u + '-text" data-text></div></details>';
    this.svg = root.querySelector("#" + u + "-svg");
    this.cmpSvg = root.querySelector("#" + u + "-cmp");
    this.cmpBox = root.querySelector("[data-compare-box]");
    this.cmpText = root.querySelector("[data-cmp-text]");
    this.compare = root.querySelector("[data-compare]");
    this.text = root.querySelector("[data-text]");
    this.meta = root.querySelector("[data-meta]");
    this.nSelect = root.querySelector("[data-n-select]");
    this.presetSelect = root.querySelector("[data-preset-select]");
    this.keysInput = root.querySelector("[data-keys]");
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (f) {
        self.render(f);
      },
      resetLabel: "Clear tree",
      onReset: function () {
        self.presetSelect.value = "";
        self.reset();
      }
    });
    this.nSelect.value = String(this.n);
    root.querySelector("[data-ops]").addEventListener("submit", function (e) {
      e.preventDefault();
      self.run("insert");
    });
    root.querySelectorAll("[data-act]").forEach(function (b) {
      if (b.type === "submit") return;
      b.addEventListener("click", function () {
        self.run(b.getAttribute("data-act"));
      });
    });
    this.nSelect.addEventListener("change", function () {
      self.n = Number(self.nSelect.value);
      self.presetSelect.value = "";
      self.reset("The tree is cleared. Each node can now have up to " + self.n + " pointers and " + (self.n - 1) + " keys.");
    });
    this.presetSelect.addEventListener("change", function () {
      if (self.presetSelect.value) self.loadPreset(self.presetSelect.value);
    });
    this.compare.addEventListener("change", function () {
      self.cmpBox.hidden = !self.compare.checked;
      self.player.show(self.player.at);
    });
    var preset = root.getAttribute("data-preset");
    if (preset && PRESETS[preset]) this.loadPreset(preset);
    else this.reset();
  }

  Widget.prototype.updateMeta = function () {
    var min = Math.ceil(this.n / 2) - 1;
    this.meta.textContent = "Order n = " + this.n + ": up to " + (this.n - 1) + " keys in a node; every node except the root keeps at least " + min + " key" + (min === 1 ? "" : "s");
  };

  Widget.prototype.reset = function (msg) {
    this.tree = new BTree(this.n);
    this.updateMeta();
    this.player.load([{ tree: null, msg: msg || "The tree is empty. Type a key and press Insert, or choose an example.", hl: { plain: true }, ops: [] }]);
  };

  // Runs one operation and returns its frames, each tagged with the operations done so far.
  Widget.prototype.apply = function (action, k, done) {
    this.tree.frames = [];
    this.tree[action](k);
    if (action !== "search") done.push([action, k]);
    var snapshot = done.slice();
    return this.tree.frames.map(function (f) {
      f.ops = snapshot;
      return f;
    });
  };

  Widget.prototype.loadPreset = function (key) {
    var p = PRESETS[key];
    this.n = p.n;
    this.nSelect.value = String(p.n);
    this.presetSelect.value = key;
    this.tree = new BTree(this.n);
    this.updateMeta();
    var frames = [{ tree: null, msg: "Example: " + p.label + ". The tree starts empty.", hl: { plain: true }, ops: [] }];
    var done = [];
    var self = this;
    p.ops.forEach(function (op) {
      op[1].forEach(function (k) {
        frames = frames.concat(self.apply(op[0], k, done));
      });
    });
    this.player.load(frames, true);
    this.player.say("Example loaded: " + p.label + ". This is the final tree. Press Play to watch it being built, or Back to go one step at a time.");
  };

  Widget.prototype.run = function (action) {
    var keys = D.wq.parseKeys(this.keysInput.value);
    if (!keys.length) {
      this.player.say("Type a whole number from 0 to 999 first. Separate several numbers with commas.");
      this.keysInput.focus();
      return;
    }
    var f = this.player.current();
    this.tree.root = cloneNode(f.tree);
    var maxId = 0;
    this.tree.walk(function (x) {
      maxId = Math.max(maxId, x.id);
    });
    this.tree.seq = Math.max(this.tree.seq, maxId);
    var done = (f.ops || []).slice();
    var frames = [];
    var self = this;
    keys.forEach(function (k) {
      frames = frames.concat(self.apply(action, k, done));
    });
    this.keysInput.value = "";
    this.player.add(frames);
  };

  Widget.prototype.render = function (f) {
    D.BPlusTree.draw(this.svg, f.tree, this.n, f.hl);
    this.text.innerHTML = describe(f.tree).map(function (line) {
      return "<p>" + line + "</p>";
    }).join("");
    if (this.compare.checked) {
      var t = new D.BPlusTree(this.n);
      (f.ops || []).forEach(function (op) {
        t[op[0]](op[1]);
      });
      D.BPlusTree.draw(this.cmpSvg, t.root, this.n, {});
      this.cmpText.textContent = D.BPlusTree.describe(t.root).join(". ");
    }
  };

  // A small, fixed drawing of the B tree built from data-keys (no controls).
  // Markup: <div data-bt-static data-n="3" data-keys="20, 10, 30" data-delete="10"></div>
  function renderStatic(box) {
    var n = Number(box.getAttribute("data-n")) || 3;
    var t = new BTree(n);
    D.wq.parseKeys(box.getAttribute("data-keys")).forEach(function (k) {
      t.insert(k);
    });
    D.wq.parseKeys(box.getAttribute("data-delete") || "").forEach(function (k) {
      t.remove(k);
    });
    count += 1;
    var id = "bt-" + count;
    box.innerHTML = '<div class="widget-stage bpt-stage" tabindex="0"><svg id="' + id + '-svg" class="bpt-svg" role="img" aria-label="' +
      describe(t.root).join(". ") + '"></svg></div>';
    D.BPlusTree.draw(box.querySelector("svg"), t.root, n, { plain: true });
  }

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="btree"]').forEach(function (box) {
      new Widget(box);
    });
    document.querySelectorAll("[data-bt-static]").forEach(renderStatic);
  });
})();
