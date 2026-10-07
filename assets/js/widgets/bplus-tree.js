/* B+ tree visualizer (widget V26).
   The engine follows the class notes: n is the largest number of pointers in a
   node, so a node holds at most n - 1 keys. When a node overflows, the key at
   position floor(len / 2) is the middle key. A leaf copies it up; an internal
   node moves it up. On deletion a node first tries to borrow from a sibling and
   merges only when no sibling can spare a key. */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  /* ---------- Engine ---------- */

  function BPlusTree(n) {
    this.n = n;
    this.root = null;
    this.seq = 0;
    this.frames = [];
  }

  BPlusTree.prototype.minLeafKeys = function () {
    return Math.ceil((this.n - 1) / 2);
  };
  BPlusTree.prototype.minChildren = function () {
    return Math.ceil(this.n / 2);
  };

  BPlusTree.prototype.makeNode = function (leaf, keys, children) {
    this.seq += 1;
    return { id: this.seq, leaf: leaf, keys: keys || [], children: children || [], next: null };
  };

  function cloneNode(node) {
    if (!node) return null;
    return {
      id: node.id,
      leaf: node.leaf,
      keys: node.keys.slice(),
      next: node.next,
      children: node.children.map(cloneNode)
    };
  }

  function list(keys) {
    if (keys.length === 1) return String(keys[0]);
    return keys.slice(0, -1).join(", ") + " and " + keys[keys.length - 1];
  }

  BPlusTree.prototype.rec = function (msg, hl) {
    this.frames.push({ tree: cloneNode(this.root), msg: msg, hl: hl || {}, op: this.op });
  };

  // Which child to follow: the number of keys that are less than or equal to k.
  function childIndex(node, k) {
    var i = 0;
    while (i < node.keys.length && k >= node.keys[i]) i += 1;
    return i;
  }

  function explainStep(node, k, i) {
    var keys = node.keys;
    if (i === 0) return k + " < " + keys[0] + ", so follow the first pointer.";
    if (i === keys.length) return k + " ≥ " + keys[keys.length - 1] + ", so follow the last pointer.";
    return keys[i - 1] + " ≤ " + k + " < " + keys[i] + ", so follow the pointer between " + keys[i - 1] + " and " + keys[i] + ".";
  }

  // Walks from the root to the leaf where k belongs. Returns the path of nodes.
  BPlusTree.prototype.descend = function (k, narrate) {
    var path = [];
    var node = this.root;
    var ids = [];
    while (node) {
      path.push(node);
      ids.push(node.id);
      if (node.leaf) break;
      var i = childIndex(node, k);
      if (narrate) this.rec(explainStep(node, k, i), { path: ids.slice(), focus: node.id });
      node = node.children[i];
    }
    return path;
  };

  BPlusTree.prototype.find = function (k) {
    if (!this.root) return false;
    var path = this.descend(k, false);
    return path[path.length - 1].keys.indexOf(k) !== -1;
  };

  BPlusTree.prototype.keys = function () {
    var out = [];
    var node = this.root;
    if (!node) return out;
    while (!node.leaf) node = node.children[0];
    var byId = {};
    this.walk(function (x) {
      byId[x.id] = x;
    });
    while (node) {
      out = out.concat(node.keys);
      node = node.next ? byId[node.next] : null;
    }
    return out;
  };

  BPlusTree.prototype.walk = function (fn) {
    (function visit(node, depth) {
      if (!node) return;
      fn(node, depth);
      node.children.forEach(function (c) {
        visit(c, depth + 1);
      });
    })(this.root, 0);
  };

  /* Insert */

  BPlusTree.prototype.insert = function (k) {
    this.op = "Insert " + k;
    if (!this.root) {
      this.root = this.makeNode(true, [k]);
      this.rec("The tree is empty. Create a leaf node with " + k + ". This leaf is also the root.", { changed: [this.root.id], key: k });
      return true;
    }
    this.rec("Insert " + k + ". Start at the root and find the leaf where " + k + " belongs.", { path: [this.root.id] });
    var path = this.descend(k, true);
    var leaf = path[path.length - 1];
    if (leaf.keys.indexOf(k) !== -1) {
      this.rec(k + " is already in the tree. Each search key is stored only once, so nothing changes.", { path: [leaf.id], found: { id: leaf.id, key: k } });
      return false;
    }
    leaf.keys.splice(childIndex(leaf, k), 0, k);
    if (leaf.keys.length <= this.n - 1) {
      this.rec("The leaf has room, so put " + k + " in it in sorted order.", { changed: [leaf.id], key: k });
      return true;
    }
    this.rec(
      "Put " + k + " in the leaf in sorted order: " + list(leaf.keys) + ". Now the leaf has " + leaf.keys.length + " keys, but it can hold only " + (this.n - 1) + " (n − 1). The leaf must split.",
      { overflow: [leaf.id], key: k }
    );
    var mid = Math.floor(leaf.keys.length / 2);
    var right = this.makeNode(true, leaf.keys.slice(mid));
    leaf.keys = leaf.keys.slice(0, mid);
    right.next = leaf.next;
    leaf.next = right.id;
    var up = right.keys[0];
    this.insertInParent(path, path.length - 1, leaf, up, right,
      "Split the leaf. Keep " + list(leaf.keys) + " in the old leaf and move " + list(right.keys) + " to a new leaf. Copy the middle key " + up + " up to the parent. (A leaf split copies the key, so " + up + " stays in the leaf too.)");
    return true;
  };

  BPlusTree.prototype.insertInParent = function (path, depth, left, key, right, splitMsg) {
    if (depth === 0) {
      this.root = this.makeNode(false, [key], [left, right]);
      this.rec(splitMsg + " There is no parent, so create a new root with " + key + ". The tree grows one level taller.", {
        changed: [left.id, right.id, this.root.id],
        key: key
      });
      return;
    }
    var parent = path[depth - 1];
    var i = parent.children.indexOf(left);
    parent.keys.splice(i, 0, key);
    parent.children.splice(i + 1, 0, right);
    if (parent.children.length <= this.n) {
      this.rec(splitMsg + " The parent has room for " + key + ".", { changed: [left.id, right.id, parent.id], key: key });
      return;
    }
    this.rec(
      splitMsg + " Now the parent has " + parent.keys.length + " keys and " + parent.children.length + " pointers, but it can hold only " + this.n + " pointers. The parent must split too.",
      { changed: [left.id, right.id], overflow: [parent.id], key: key }
    );
    var mid = Math.floor(parent.keys.length / 2);
    var upKey = parent.keys[mid];
    var sibling = this.makeNode(false, parent.keys.slice(mid + 1), parent.children.slice(mid + 1));
    parent.keys = parent.keys.slice(0, mid);
    parent.children = parent.children.slice(0, mid + 1);
    this.insertInParent(path, depth - 1, parent, upKey, sibling,
      "Split the internal node. Keep " + list(parent.keys) + " in the old node and move " + list(sibling.keys) + " to a new node. Move the middle key " + upKey + " up to the parent. (An internal split moves the key, so " + upKey + " does not stay at this level.)");
  };

  /* Delete */

  BPlusTree.prototype.remove = function (k) {
    this.op = "Delete " + k;
    if (!this.root) {
      this.rec("The tree is empty, so there is nothing to delete.", {});
      return false;
    }
    this.rec("Delete " + k + ". Start at the root and find the leaf that should hold " + k + ".", { path: [this.root.id] });
    var path = this.descend(k, true);
    var leaf = path[path.length - 1];
    var at = leaf.keys.indexOf(k);
    if (at === -1) {
      this.rec(k + " is not in this leaf, so it is not in the tree. Nothing changes.", { path: [leaf.id] });
      return false;
    }
    leaf.keys.splice(at, 1);
    if (leaf === this.root) {
      if (!leaf.keys.length) {
        this.root = null;
        this.rec("Remove " + k + ". The tree is now empty.", {});
      } else {
        this.rec("Remove " + k + " from the root leaf. A root may hold fewer keys than other nodes, so nothing else changes.", { changed: [leaf.id] });
      }
      return true;
    }
    var min = this.minLeafKeys();
    if (leaf.keys.length >= min) {
      this.rec("Remove " + k + " from the leaf. The leaf still has at least " + min + " key" + (min > 1 ? "s" : "") + " (⌈(n − 1) / 2⌉), so it is still at least half full.", { changed: [leaf.id] });
    } else {
      this.rec(
        "Remove " + k + " from the leaf. Now the leaf has " + leaf.keys.length + " key" + (leaf.keys.length === 1 ? "" : "s") + ", but it needs at least " + min + " (⌈(n − 1) / 2⌉). It must borrow a key from a sibling or merge with one.",
        { overflow: [leaf.id] }
      );
      this.fixUnderflow(path, path.length - 1);
    }
    this.fixGuideKeys(k);
    return true;
  };

  BPlusTree.prototype.canLend = function (node) {
    return node.leaf ? node.keys.length > this.minLeafKeys() : node.children.length > this.minChildren();
  };

  BPlusTree.prototype.fixUnderflow = function (path, depth) {
    var node = path[depth];
    var parent = path[depth - 1];
    var i = parent.children.indexOf(node);
    var left = i > 0 ? parent.children[i - 1] : null;
    var right = i < parent.children.length - 1 ? parent.children[i + 1] : null;
    var what = node.leaf ? "leaf" : "node";

    if (left && this.canLend(left)) {
      if (node.leaf) {
        var b = left.keys.pop();
        node.keys.unshift(b);
        parent.keys[i - 1] = node.keys[0];
        this.rec("The left sibling has a key to spare. Move " + b + " from the left sibling into this leaf, and change the key in the parent to " + b + ".", { changed: [left.id, node.id, parent.id] });
      } else {
        var down = parent.keys[i - 1];
        node.keys.unshift(down);
        node.children.unshift(left.children.pop());
        var upL = left.keys.pop();
        parent.keys[i - 1] = upL;
        this.rec("The left sibling has a pointer to spare. Move " + down + " down from the parent into this node, move the last pointer of the left sibling across, and move " + upL + " up into the parent.", { changed: [left.id, node.id, parent.id] });
      }
      return;
    }
    if (right && this.canLend(right)) {
      if (node.leaf) {
        var c = right.keys.shift();
        node.keys.push(c);
        parent.keys[i] = right.keys[0];
        this.rec("The right sibling has a key to spare. Move " + c + " from the right sibling into this leaf, and change the key in the parent to " + right.keys[0] + ".", { changed: [right.id, node.id, parent.id] });
      } else {
        var down2 = parent.keys[i];
        node.keys.push(down2);
        node.children.push(right.children.shift());
        var upR = right.keys.shift();
        parent.keys[i] = upR;
        this.rec("The right sibling has a pointer to spare. Move " + down2 + " down from the parent into this node, move the first pointer of the right sibling across, and move " + upR + " up into the parent.", { changed: [right.id, node.id, parent.id] });
      }
      return;
    }

    // No sibling can lend, so merge with one.
    var L = left || node;
    var R = left ? node : right;
    var j = parent.children.indexOf(L);
    var sep = parent.keys[j];
    if (L.leaf) {
      L.keys = L.keys.concat(R.keys);
      L.next = R.next;
    } else {
      L.keys = L.keys.concat([sep], R.keys);
      L.children = L.children.concat(R.children);
    }
    parent.keys.splice(j, 1);
    parent.children.splice(j + 1, 1);
    var side = left ? "left" : "right";
    var msg = "No sibling can spare a " + (node.leaf ? "key" : "pointer") + ", so merge this " + what + " with its " + side + " sibling: " + list(L.keys) + "." +
      (L.leaf ? "" : " The key " + sep + " comes down from the parent into the merged node.") +
      " Remove the key " + sep + " and one pointer from the parent.";

    if (parent === this.root) {
      if (!parent.keys.length) {
        this.root = L;
        this.rec(msg + " The root now has only one child, so remove the old root. The merged node becomes the new root, and the tree is one level shorter.", { changed: [L.id] });
      } else {
        this.rec(msg, { changed: [L.id, parent.id] });
      }
      return;
    }
    if (parent.children.length >= this.minChildren()) {
      this.rec(msg + " The parent still has at least " + this.minChildren() + " pointers (⌈n / 2⌉), so it is fine.", { changed: [L.id, parent.id] });
      return;
    }
    this.rec(msg + " Now the parent has only " + parent.children.length + " pointer" + (parent.children.length === 1 ? "" : "s") + ", but it needs at least " + this.minChildren() + " (⌈n / 2⌉). The parent must borrow or merge too.", { changed: [L.id], overflow: [parent.id] });
    this.fixUnderflow(path, depth - 1);
  };

  // A deleted key may still be used as a guide key in an internal node. The
  // class notes replace it with its in-order successor: the smallest key in
  // the subtree to its right.
  BPlusTree.prototype.fixGuideKeys = function (k) {
    var self = this;
    this.walk(function (node) {
      if (node.leaf) return;
      var at = node.keys.indexOf(k);
      if (at === -1) return;
      var sub = node.children[at + 1];
      while (!sub.leaf) sub = sub.children[0];
      var succ = sub.keys[0];
      node.keys[at] = succ;
      self.rec(k + " is still used as a guide key in an internal node. Replace it with " + succ + ", the smallest key in the subtree to its right (its in-order successor).", { changed: [node.id] });
    });
  };

  /* Search */

  BPlusTree.prototype.search = function (k) {
    this.op = "Search " + k;
    if (!this.root) {
      this.rec("The tree is empty, so " + k + " is not found.", {});
      return false;
    }
    this.rec("Search for " + k + ". Start at the root.", { path: [this.root.id] });
    var path = this.descend(k, true);
    var leaf = path[path.length - 1];
    var ids = path.map(function (x) {
      return x.id;
    });
    var found = leaf.keys.indexOf(k) !== -1;
    if (found) {
      this.rec("Found " + k + " in the leaf. The search read " + path.length + " node" + (path.length > 1 ? "s" : "") + ", one on each level of the tree.", { path: ids, found: { id: leaf.id, key: k } });
    } else {
      this.rec(k + " is not in the leaf, so it is not in the tree. The search read " + path.length + " node" + (path.length > 1 ? "s" : "") + ".", { path: ids, missing: leaf.id });
    }
    return found;
  };

  // Checks the B+ tree rules. Returns a list of problems (empty when valid).
  BPlusTree.prototype.validate = function () {
    var self = this;
    var problems = [];
    var leafDepth = -1;
    (function visit(node, depth, lo, hi) {
      if (!node) return;
      var isRoot = node === self.root;
      for (var i = 0; i < node.keys.length; i++) {
        if (i && node.keys[i] <= node.keys[i - 1]) problems.push("keys not sorted in node " + node.id);
        if (lo !== null && node.keys[i] < lo) problems.push("key " + node.keys[i] + " below range in node " + node.id);
        if (hi !== null && node.keys[i] >= hi) problems.push("key " + node.keys[i] + " above range in node " + node.id);
      }
      if (node.keys.length > self.n - 1) problems.push("node " + node.id + " has too many keys");
      if (node.leaf) {
        if (leafDepth === -1) leafDepth = depth;
        else if (leafDepth !== depth) problems.push("leaves at different depths");
        if (!isRoot && node.keys.length < self.minLeafKeys()) problems.push("leaf " + node.id + " is under-full");
        return;
      }
      if (node.children.length !== node.keys.length + 1) problems.push("node " + node.id + " pointer count is wrong");
      if (!isRoot && node.children.length < self.minChildren()) problems.push("node " + node.id + " is under-full");
      if (isRoot && node.children.length < 2) problems.push("root has one child");
      node.children.forEach(function (c, j) {
        visit(c, depth + 1, j === 0 ? lo : node.keys[j - 1], j === node.keys.length ? hi : node.keys[j]);
      });
    })(this.root, 0, null, null);
    var chain = this.keys();
    for (var i = 1; i < chain.length; i++) if (chain[i] <= chain[i - 1]) problems.push("leaf chain out of order");
    return problems;
  };

  // Text form of the tree, level by level: "[19] / [5 | 11] [29] / ..."
  function describe(root) {
    if (!root) return ["The tree is empty."];
    var lines = [];
    var level = [root];
    var depth = 1;
    while (level.length) {
      var leaf = level[0].leaf;
      lines.push(
        (leaf ? "Leaves" : "Level " + depth) + ": " +
          level.map(function (x) {
            return "[" + x.keys.join(" | ") + "]";
          }).join(leaf ? " → " : "  ")
      );
      var nextLevel = [];
      level.forEach(function (x) {
        nextLevel = nextLevel.concat(x.children);
      });
      level = nextLevel;
      depth += 1;
    }
    return lines;
  }

  D.BPlusTree = BPlusTree;
  D.BPlusTree.describe = describe;

  /* ---------- Drawing ---------- */

  var SVG = "http://www.w3.org/2000/svg";
  var CELL_W = 34;
  var CELL_H = 32;
  var LEAF_GAP = 24;
  var LEVEL_GAP = 56;
  var PAD = 12;

  function el(name, attrs, parent) {
    var e = document.createElementNS(SVG, name);
    for (var a in attrs) e.setAttribute(a, attrs[a]);
    if (parent) parent.appendChild(e);
    return e;
  }

  function layout(root, n) {
    var levels = [];
    (function visit(node, depth) {
      (levels[depth] = levels[depth] || []).push(node);
      node.children.forEach(function (c) {
        visit(c, depth + 1);
      });
    })(root, 0);
    var pos = {};
    var cellsOf = function (node) {
      return Math.max(n - 1, node.keys.length, 1);
    };
    var x = PAD;
    var leaves = levels[levels.length - 1];
    leaves.forEach(function (leaf) {
      var w = cellsOf(leaf) * CELL_W;
      pos[leaf.id] = { x: x, w: w };
      x += w + LEAF_GAP;
    });
    var width = x - LEAF_GAP + PAD;
    for (var d = levels.length - 2; d >= 0; d--) {
      levels[d].forEach(function (node) {
        var first = pos[node.children[0].id];
        var last = pos[node.children[node.children.length - 1].id];
        var center = (first.x + last.x + last.w) / 2;
        var w = cellsOf(node) * CELL_W;
        pos[node.id] = { x: center - w / 2, w: w };
      });
    }
    // Keep wide internal nodes inside the drawing.
    var minX = Infinity;
    var maxX = -Infinity;
    Object.keys(pos).forEach(function (id) {
      minX = Math.min(minX, pos[id].x);
      maxX = Math.max(maxX, pos[id].x + pos[id].w);
    });
    var shift = minX < PAD ? PAD - minX : 0;
    levels.forEach(function (lv, depth) {
      lv.forEach(function (node) {
        pos[node.id].x += shift;
        pos[node.id].y = PAD + depth * (CELL_H + LEVEL_GAP);
      });
    });
    width = Math.max(width + shift, maxX + shift + PAD);
    var height = PAD * 2 + levels.length * CELL_H + (levels.length - 1) * LEVEL_GAP;
    return { levels: levels, pos: pos, width: width, height: height };
  }

  function draw(svg, root, n, hl) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    hl = hl || {};
    if (!root) {
      svg.setAttribute("width", 240);
      svg.setAttribute("height", 60);
      svg.setAttribute("viewBox", "0 0 240 60");
      var t = el("text", { x: 120, y: 34, "text-anchor": "middle", class: "bpt-empty" }, svg);
      t.textContent = "The tree is empty.";
      return;
    }
    var L = layout(root, n);
    // Shrink a wide tree to fit the frame, but not below 70%, so the keys stay
    // readable. A tree that is still too wide scrolls inside its frame.
    var stage = svg.parentNode;
    var room = stage && stage.clientWidth ? stage.clientWidth - 32 : L.width;
    var scale = Math.max(0.7, Math.min(1, room / L.width));
    svg.setAttribute("width", Math.ceil(L.width * scale));
    svg.setAttribute("height", Math.ceil(L.height * scale));
    svg.setAttribute("viewBox", "0 0 " + Math.ceil(L.width) + " " + Math.ceil(L.height));
    var has = function (listName, id) {
      return (hl[listName] || []).indexOf(id) !== -1;
    };
    var defs = el("defs", {}, svg);
    var marker = el("marker", { id: svg.id + "-arrow", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, defs);
    el("path", { d: "M 0 0 L 10 5 L 0 10 z", class: "bpt-arrowhead" }, marker);

    var edges = el("g", { class: "bpt-edges" }, svg);
    var nodes = el("g", { class: "bpt-nodes" }, svg);
    var byId = {};
    L.levels.forEach(function (lv) {
      lv.forEach(function (node) {
        byId[node.id] = node;
      });
    });

    L.levels.forEach(function (lv) {
      lv.forEach(function (node) {
        var p = L.pos[node.id];
        // Pointers down to children.
        node.children.forEach(function (child, i) {
          var c = L.pos[child.id];
          var onPath = has("path", node.id) && has("path", child.id);
          el("line", {
            x1: p.x + i * CELL_W,
            y1: p.y + CELL_H,
            x2: c.x + c.w / 2,
            y2: c.y,
            class: "bpt-edge" + (onPath ? " is-path" : "")
          }, edges);
        });
        // Leaf chain.
        if (node.leaf && node.next && byId[node.next]) {
          var q = L.pos[node.next];
          el("line", {
            x1: p.x + p.w + 2,
            y1: p.y + CELL_H / 2,
            x2: q.x - 2,
            y2: q.y + CELL_H / 2,
            class: "bpt-link",
            "marker-end": "url(#" + svg.id + "-arrow)"
          }, edges);
        }

        var cls = "bpt-node" + (node.leaf && !hl.plain ? " is-leaf" : "");
        if (has("path", node.id)) cls += " is-path";
        if (hl.focus === node.id) cls += " is-focus";
        if (has("changed", node.id)) cls += " is-changed";
        if (has("overflow", node.id)) cls += " is-overflow";
        if (hl.missing === node.id) cls += " is-missing";
        var g = el("g", { class: cls, transform: "translate(" + p.x + "," + p.y + ")" }, nodes);
        el("rect", { x: 0, y: 0, width: p.w, height: CELL_H, rx: 6, class: "bpt-box" }, g);
        var cells = Math.max(n - 1, node.keys.length, 1);
        for (var i = 0; i < cells; i++) {
          if (i) el("line", { x1: i * CELL_W, y1: 0, x2: i * CELL_W, y2: CELL_H, class: "bpt-divider" }, g);
          var key = node.keys[i];
          if (key === undefined) continue;
          var isFound = hl.found && hl.found.id === node.id && hl.found.key === key;
          var isNew = hl.key === key && (has("changed", node.id) || has("overflow", node.id));
          if (isFound || isNew) {
            el("rect", { x: i * CELL_W + 3, y: 3, width: CELL_W - 6, height: CELL_H - 6, rx: 4, class: isFound ? "bpt-found" : "bpt-new" }, g);
          }
          var t = el("text", { x: i * CELL_W + CELL_W / 2, y: CELL_H / 2 + 1, "text-anchor": "middle", "dominant-baseline": "middle", class: "bpt-key" }, g);
          t.textContent = key;
        }
        // Small dots mark the pointer positions of internal nodes.
        if (!node.leaf) {
          for (var j = 0; j <= node.keys.length; j++) el("circle", { cx: j * CELL_W, cy: CELL_H, r: 3, class: "bpt-ptr" }, g);
        }
      });
    });

    // When the drawing scrolls, bring the node that matters into view.
    if (stage && stage.scrollWidth > stage.clientWidth) {
      var target = hl.focus || (hl.found && hl.found.id) || hl.missing || (hl.overflow || [])[0] || (hl.changed || [])[0] || root.id;
      var tp = L.pos[target] || L.pos[root.id];
      stage.scrollLeft = (tp.x + tp.w / 2) * scale - stage.clientWidth / 2 + 16;
    }
  }

  function buildTree(n, keys) {
    var t = new BPlusTree(n);
    keys.forEach(function (k) {
      t.insert(k);
    });
    return t;
  }

  /* ---------- Widget ---------- */

  var PRESETS = {
    "qb-unit4": {
      label: "Question bank: 2, 3, 5 … 31 with n = 3",
      n: 3,
      ops: [["insert", [2, 3, 5, 7, 11, 17, 19, 23, 29, 31]]]
    },
    "notes-n4": {
      label: "Class notes: 2, 3, 5 … 31 with n = 4, then insert 9, 10, 8 and delete 23, 19",
      n: 4,
      ops: [["insert", [2, 3, 5, 7, 11, 17, 19, 23, 29, 31, 9, 10, 8]], ["remove", [23, 19]]]
    },
    "notes-order3": {
      label: "Class notes: 26, 27, 28 … 6 with n = 3",
      n: 3,
      ops: [["insert", [26, 27, 28, 3, 4, 7, 9, 46, 48, 51, 2, 6]]]
    },
    "notes-n5": {
      label: "Class notes: 30, 31, 23 … 29 with n = 5",
      n: 5,
      ops: [["insert", [30, 31, 23, 32, 22, 28, 24, 29]]]
    },
    "delete-demo": {
      label: "Deletion practice: build with n = 4, then delete 5, 7, 31, 2",
      n: 4,
      ops: [["insert", [2, 3, 5, 7, 11, 17, 19, 23, 29, 31]], ["remove", [5, 7, 31, 2]]]
    }
  };

  function parseKeys(text) {
    return String(text)
      .split(/[\s,;]+/)
      .filter(Boolean)
      .map(Number)
      .filter(function (x) {
        return Number.isInteger(x) && x >= 0 && x <= 999;
      });
  }

  var count = 0;

  function Widget(root) {
    count += 1;
    this.uid = "bpt-" + count;
    this.root = root;
    this.n = Number(root.getAttribute("data-n")) || 4;
    this.frames = [];
    this.at = -1;
    this.timer = null;
    this.build();
    var preset = root.getAttribute("data-preset");
    if (preset && PRESETS[preset]) this.loadPreset(preset);
    else this.reset();
  }

  Widget.prototype.build = function () {
    var self = this;
    var u = this.uid;
    var presetOptions = Object.keys(PRESETS).map(function (key) {
      return '<option value="' + key + '">' + PRESETS[key].label + "</option>";
    }).join("");
    this.root.innerHTML =
      '<div class="widget-head"><strong>B+ tree visualizer</strong></div>' +
      '<p class="bpt-meta" data-meta></p>' +
      '<div class="widget-controls bpt-setup">' +
      '<label class="bpt-field"><span>Pointers per node (n)</span><select data-n-select>' +
      [3, 4, 5, 6].map(function (v) {
        return '<option value="' + v + '">' + v + "</option>";
      }).join("") +
      "</select></label>" +
      '<label class="bpt-field bpt-grow"><span>Example</span><select data-preset-select><option value="">Choose an example…</option>' + presetOptions + "</select></label>" +
      "</div>" +
      '<form class="widget-controls bpt-ops" data-ops>' +
      '<label class="bpt-field bpt-grow"><span>Keys (one or more numbers)</span><input data-keys type="text" inputmode="numeric" autocomplete="off" placeholder="for example 8 or 4, 9, 13"></label>' +
      '<button type="submit" class="btn btn-primary" data-act="insert">Insert</button>' +
      '<button type="button" class="btn" data-act="remove">Delete</button>' +
      '<button type="button" class="btn" data-act="search">Search</button>' +
      "</form>" +
      '<div class="widget-stage bpt-stage" tabindex="0" aria-label="B+ tree drawing. Scroll sideways if the tree is wide."><svg id="' + u + '-svg" class="bpt-svg" role="img" aria-labelledby="' + u + '-text"></svg></div>' +
      '<div class="widget-controls bpt-player">' +
      '<button type="button" class="btn" data-play="back" aria-label="Step back">Back</button>' +
      '<button type="button" class="btn btn-primary" data-play="toggle">Play</button>' +
      '<button type="button" class="btn" data-play="next" aria-label="Step forward">Next</button>' +
      '<button type="button" class="btn" data-play="reset">Clear tree</button>' +
      '<label class="bpt-field bpt-speed"><span>Speed</span><input type="range" min="1" max="5" value="3" data-speed></label>' +
      '<span class="bpt-step muted" data-step></span>' +
      "</div>" +
      '<p class="widget-narration" aria-live="polite" data-narration></p>' +
      '<details class="bpt-text"><summary>Show the tree as text</summary><div id="' + u + '-text" data-text></div></details>';

    this.svg = this.root.querySelector("svg");
    this.narration = this.root.querySelector("[data-narration]");
    this.text = this.root.querySelector("[data-text]");
    this.stepLabel = this.root.querySelector("[data-step]");
    this.meta = this.root.querySelector("[data-meta]");
    this.nSelect = this.root.querySelector("[data-n-select]");
    this.presetSelect = this.root.querySelector("[data-preset-select]");
    this.keysInput = this.root.querySelector("[data-keys]");
    this.toggleBtn = this.root.querySelector('[data-play="toggle"]');
    this.speed = this.root.querySelector("[data-speed]");
    this.nSelect.value = String(this.n);

    this.root.querySelector("[data-ops]").addEventListener("submit", function (e) {
      e.preventDefault();
      self.run("insert");
    });
    this.root.querySelectorAll("[data-act]").forEach(function (b) {
      if (b.type === "submit") return;
      b.addEventListener("click", function () {
        self.run(b.getAttribute("data-act"));
      });
    });
    this.root.querySelector('[data-play="back"]').addEventListener("click", function () {
      self.pause();
      self.show(self.at - 1);
    });
    this.root.querySelector('[data-play="next"]').addEventListener("click", function () {
      self.pause();
      self.show(self.at + 1);
    });
    this.toggleBtn.addEventListener("click", function () {
      if (self.timer) self.pause();
      else self.play();
    });
    this.root.querySelector('[data-play="reset"]').addEventListener("click", function () {
      self.presetSelect.value = "";
      self.reset();
    });
    this.nSelect.addEventListener("change", function () {
      self.n = Number(self.nSelect.value);
      self.presetSelect.value = "";
      self.reset("The tree is cleared. Each node can now have up to " + self.n + " pointers and " + (self.n - 1) + " keys.");
    });
    this.presetSelect.addEventListener("change", function () {
      if (self.presetSelect.value) self.loadPreset(self.presetSelect.value);
    });
  };

  Widget.prototype.updateMeta = function () {
    var t = new BPlusTree(this.n);
    this.meta.textContent = "n = " + this.n + ": up to " + (this.n - 1) + " keys in a node; a leaf keeps at least " + t.minLeafKeys() + "; an internal node keeps at least " + t.minChildren() + " pointers";
  };

  Widget.prototype.reset = function (msg) {
    this.pause();
    this.tree = new BPlusTree(this.n);
    this.frames = [{ tree: null, msg: msg || "The tree is empty. Type a key and press Insert, or choose an example.", hl: {} }];
    this.updateMeta();
    this.show(0);
  };

  Widget.prototype.loadPreset = function (key) {
    var p = PRESETS[key];
    this.n = p.n;
    this.nSelect.value = String(p.n);
    this.presetSelect.value = key;
    this.reset();
    this.frames[0].msg = "Example: " + p.label + ". The tree starts empty.";
    var self = this;
    p.ops.forEach(function (op) {
      op[1].forEach(function (k) {
        self.apply(op[0], k);
      });
    });
    // Show the finished tree first. Play starts again from the first step.
    this.show(this.frames.length - 1);
    this.narration.textContent = "Example loaded: " + p.label + ". This is the final tree. Press Play to watch it being built, or Back to go one step at a time.";
  };

  // Runs one operation on the tree and appends its frames.
  Widget.prototype.apply = function (action, k) {
    this.tree.frames = [];
    this.tree[action](k);
    this.frames = this.frames.concat(this.tree.frames);
  };

  Widget.prototype.run = function (action) {
    var keys = parseKeys(this.keysInput.value);
    if (!keys.length) {
      this.narration.textContent = "Type a whole number from 0 to 999 first. Separate several numbers with commas.";
      this.keysInput.focus();
      return;
    }
    this.pause();
    // Drop any steps after the one on screen, then rebuild the tree from it.
    this.frames = this.frames.slice(0, this.at + 1);
    this.tree.root = cloneNode(this.frames[this.at].tree);
    var maxId = 0;
    this.tree.walk(function (x) {
      maxId = Math.max(maxId, x.id);
    });
    this.tree.seq = Math.max(this.tree.seq, maxId);
    var start = this.frames.length;
    var self = this;
    keys.forEach(function (k) {
      self.apply(action, k);
    });
    this.keysInput.value = "";
    if (this.frames.length - start > 1) {
      this.show(start);
      this.play();
    } else {
      this.show(this.frames.length - 1);
    }
  };

  Widget.prototype.delay = function () {
    return [2600, 1900, 1300, 800, 450][Number(this.speed.value) - 1];
  };

  Widget.prototype.play = function () {
    var self = this;
    if (this.at >= this.frames.length - 1) this.show(0);
    this.toggleBtn.textContent = "Pause";
    this.timer = setInterval(function () {
      if (self.at >= self.frames.length - 1) self.pause();
      else self.show(self.at + 1);
    }, this.delay());
  };

  Widget.prototype.pause = function () {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    if (this.toggleBtn) this.toggleBtn.textContent = "Play";
  };

  Widget.prototype.show = function (i) {
    if (i < 0 || i >= this.frames.length) return;
    this.at = i;
    var f = this.frames[i];
    draw(this.svg, f.tree, this.n, f.hl);
    this.narration.textContent = (f.op ? f.op + ": " : "") + f.msg;
    this.text.innerHTML = describe(f.tree).map(function (line) {
      return "<p>" + line + "</p>";
    }).join("");
    this.stepLabel.textContent = "Step " + (i + 1) + " of " + this.frames.length;
  };

  // A small, fixed drawing of the tree built from data-keys (no controls).
  function renderStatic(box) {
    var n = Number(box.getAttribute("data-n")) || 4;
    var t = buildTree(n, parseKeys(box.getAttribute("data-keys")));
    (box.getAttribute("data-delete") ? parseKeys(box.getAttribute("data-delete")) : []).forEach(function (k) {
      t.remove(k);
    });
    count += 1;
    var id = "bpt-" + count;
    box.innerHTML = '<div class="widget-stage bpt-stage" tabindex="0"><svg id="' + id + '-svg" class="bpt-svg" role="img" aria-label="' +
      describe(t.root).join(". ").replace(/"/g, "") + '"></svg></div>';
    draw(box.querySelector("svg"), t.root, n, {});
  }

  // The B tree widget (V27) draws its trees with the same code.
  D.BPlusTree.draw = draw;

  if (typeof document !== "undefined" && document.querySelectorAll) {
    var start = function () {
      document.querySelectorAll('[data-widget="bplus-tree"]').forEach(function (box) {
        new Widget(box);
      });
      document.querySelectorAll("[data-bpt-static]").forEach(renderStatic);
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  }
})();
