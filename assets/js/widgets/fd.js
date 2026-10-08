/* Functional dependency library used by the Unit II widgets (V8, V9, V10).
   No user interface here. Attribute sets are arrays of attribute names, kept
   in schema order. An FD is { l: [...], r: [...] }.

   D.fd.parseSchema("ABCDE") -> ["A","B","C","D","E"]
   D.fd.parseSchema("RollNo, Name, Dept") -> ["RollNo","Name","Dept"]
   D.fd.parseFDs("A->BC, CD->E", attrs) -> [{l:["A"], r:["B","C"]}, ...]
   With single-letter attributes, commas separate FDs; with longer names,
   FDs are separated by new lines or semicolons. */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  function single(attrs) {
    return attrs.every(function (a) { return a.length === 1; });
  }

  function parseSchema(text) {
    text = String(text).replace(/^\s*\w*\s*\(|\)\s*$/g, "").trim();
    if (/[,\s]/.test(text)) return uniq(text.split(/[,\s]+/).filter(Boolean));
    return uniq(text.split(""));
  }

  function uniq(list) {
    var out = [];
    list.forEach(function (x) { if (out.indexOf(x) < 0) out.push(x); });
    return out;
  }

  // Returns { fds, errors }.
  function parseFDs(text, attrs) {
    var one = single(attrs);
    var parts = String(text).replace(/[{}]/g, "").split(one ? /[,;\n]+/ : /[;\n]+/);
    var fds = [];
    var errors = [];
    parts.forEach(function (p) {
      p = p.trim();
      if (!p) return;
      var m = p.split(/\s*(?:->|→|=>)\s*/);
      if (m.length !== 2 || !m[0] || !m[1]) {
        errors.push("“" + p + "” is not of the form X -> Y.");
        return;
      }
      var side = function (s) {
        return one ? s.replace(/[\s,]/g, "").split("") : s.split(/[,\s]+/).filter(Boolean);
      };
      var l = uniq(side(m[0]));
      var r = uniq(side(m[1]));
      var bad = l.concat(r).filter(function (a) { return attrs.indexOf(a) < 0; });
      if (bad.length) errors.push("“" + p + "” uses " + uniq(bad).join(", ") + ", which is not in the relation.");
      else fds.push({ l: order(l, attrs), r: order(r, attrs) });
    });
    return { fds: fds, errors: errors };
  }

  function order(set, attrs) {
    return attrs.filter(function (a) { return set.indexOf(a) >= 0; });
  }

  function has(set, sub) {
    return sub.every(function (a) { return set.indexOf(a) >= 0; });
  }

  function same(a, b) {
    return a.length === b.length && has(a, b);
  }

  function minus(a, b) {
    return a.filter(function (x) { return b.indexOf(x) < 0; });
  }

  // Attribute closure X+ under F. trace gets one entry per FD that adds something.
  function closure(x, fds, attrs, trace) {
    var c = order(uniq(x), attrs);
    var changed = true;
    while (changed) {
      changed = false;
      for (var i = 0; i < fds.length; i++) {
        var f = fds[i];
        if (has(c, f.l)) {
          var add = minus(f.r, c);
          if (add.length) {
            c = order(c.concat(add), attrs);
            changed = true;
            if (trace) trace.push({ fd: i, add: add, now: c.slice() });
          }
        }
      }
    }
    return c;
  }

  function implies(fds, l, r, attrs) {
    return has(closure(l, fds, attrs), r);
  }

  // All candidate keys, smallest first. trace lists every set tested.
  function keys(attrs, fds, trace) {
    var rhs = [];
    var lhs = [];
    fds.forEach(function (f) {
      rhs = rhs.concat(f.r);
      lhs = lhs.concat(f.l);
    });
    // Attributes that never appear on a right side must be in every key.
    var core = attrs.filter(function (a) { return rhs.indexOf(a) < 0; });
    // Attributes only on right sides (and not on left sides) are never in a key.
    var never = attrs.filter(function (a) { return rhs.indexOf(a) >= 0 && lhs.indexOf(a) < 0; });
    var middle = minus(minus(attrs, core), never);
    var found = [];
    var info = { core: core, never: never, middle: middle };
    for (var size = 0; size <= middle.length; size++) {
      combos(middle, size).forEach(function (extra) {
        var candidate = order(core.concat(extra), attrs);
        if (!candidate.length) return;
        var sup = found.filter(function (k) { return has(candidate, k); })[0];
        var c = sup ? null : closure(candidate, fds, attrs);
        var isKey = !sup && same(c, attrs);
        if (trace) trace.push({ set: candidate, closure: c, key: isKey, superOf: sup || null });
        if (isKey) found.push(candidate);
      });
    }
    info.keys = found;
    return info;
  }

  function combos(list, k) {
    var out = [];
    (function rec(start, acc) {
      if (acc.length === k) {
        out.push(acc.slice());
        return;
      }
      for (var i = start; i < list.length; i++) {
        acc.push(list[i]);
        rec(i + 1, acc);
        acc.pop();
      }
    })(0, []);
    return out;
  }

  // Canonical (minimal) cover. trace gets the steps.
  function cover(fds, attrs, trace) {
    var t = trace || [];
    // 1. One attribute on each right side.
    var g = [];
    fds.forEach(function (f) {
      f.r.forEach(function (a) {
        if (f.l.indexOf(a) >= 0) return; // trivial part
        if (!g.some(function (h) { return same(h.l, f.l) && h.r[0] === a; })) g.push({ l: f.l.slice(), r: [a] });
      });
    });
    t.push({ kind: "split", fds: clone(g) });
    // 2. Remove extraneous attributes from left sides.
    g.forEach(function (f, i) {
      var changed = true;
      while (changed && f.l.length > 1) {
        changed = false;
        for (var j = 0; j < f.l.length; j++) {
          var smaller = f.l.filter(function (_, k) { return k !== j; });
          if (has(closure(smaller, g, attrs), f.r)) {
            t.push({ kind: "lhs", at: i, removed: f.l[j], from: clone([f])[0], closure: closure(smaller, g, attrs), smaller: smaller });
            f.l = smaller;
            changed = true;
            break;
          }
        }
      }
    });
    // Drop duplicates made by step 2.
    g = g.filter(function (f, i) {
      return !g.some(function (h, j) { return j < i && same(h.l, f.l) && same(h.r, f.r); });
    });
    // 3. Remove redundant FDs.
    for (var i = 0; i < g.length; i++) {
      var rest = g.filter(function (_, k) { return k !== i; });
      var c = closure(g[i].l, rest, attrs);
      var red = has(c, g[i].r);
      t.push({ kind: "redundant", fd: clone([g[i]])[0], closure: c, redundant: red });
      if (red) {
        g = rest;
        i--;
      }
    }
    // 4. Combine FDs with the same left side.
    var out = [];
    g.forEach(function (f) {
      var h = out.filter(function (x) { return same(x.l, f.l); })[0];
      if (h) h.r = order(h.r.concat(f.r), attrs);
      else out.push({ l: f.l.slice(), r: f.r.slice() });
    });
    t.push({ kind: "union", fds: clone(out) });
    return out;
  }

  function clone(fds) {
    return fds.map(function (f) { return { l: f.l.slice(), r: f.r.slice() }; });
  }

  // FDs of F+ that hold on the attributes ri (the restriction of F to ri),
  // as a minimal cover.
  function project(fds, attrs, ri) {
    var out = [];
    for (var size = 1; size < ri.length; size++) {
      combos(ri, size).forEach(function (x) {
        var c = closure(x, fds, attrs).filter(function (a) { return ri.indexOf(a) >= 0 && x.indexOf(a) < 0; });
        if (c.length) out.push({ l: x, r: c });
      });
    }
    return out.length ? cover(out, ri) : [];
  }

  function fdText(f, sep) {
    var s = sep === undefined ? (f.l.concat(f.r).every(function (a) { return a.length === 1; }) ? "" : ", ") : sep;
    return f.l.join(s) + " → " + f.r.join(s);
  }

  function setText(set) {
    var s = set.every(function (a) { return a.length === 1; }) ? "" : ", ";
    return "{" + set.join(s) + "}";
  }

  // Normal form of relation attrs under fds (FDs that hold on attrs).
  // Returns { keys, prime, level: "1NF"|"2NF"|"3NF"|"BCNF", problems: [...] }.
  function normalForm(attrs, fds) {
    var k = keys(attrs, fds).keys;
    var prime = attrs.filter(function (a) { return k.some(function (key) { return key.indexOf(a) >= 0; }); });
    var split = [];
    fds.forEach(function (f) {
      f.r.forEach(function (a) { if (f.l.indexOf(a) < 0) split.push({ l: f.l, r: [a] }); });
    });
    var problems = [];
    split.forEach(function (f) {
      var superkey = same(closure(f.l, fds, attrs), attrs);
      if (superkey) return;
      var a = f.r[0];
      var isPrime = prime.indexOf(a) >= 0;
      var partOf = k.filter(function (key) { return has(key, f.l) && key.length > f.l.length; })[0];
      var kind;
      if (!isPrime && partOf) kind = "partial";
      else if (!isPrime) kind = "transitive";
      else kind = "bcnf";
      problems.push({ fd: f, kind: kind, key: partOf || null });
    });
    var level = "BCNF";
    if (problems.some(function (p) { return p.kind === "partial"; })) level = "1NF";
    else if (problems.some(function (p) { return p.kind === "transitive"; })) level = "2NF";
    else if (problems.length) level = "3NF";
    return { keys: k, prime: prime, level: level, problems: problems };
  }

  // Lossless-join test by the tableau (chase) method.
  // Returns { lossless, rows } where rows[i][j] is "a" or "b<i>".
  function chase(attrs, parts, fds) {
    var rows = parts.map(function (p, i) {
      return attrs.map(function (a) { return p.indexOf(a) >= 0 ? "a" : "b" + (i + 1); });
    });
    var changed = true;
    while (changed) {
      changed = false;
      fds.forEach(function (f) {
        var li = f.l.map(function (a) { return attrs.indexOf(a); });
        var ri = f.r.map(function (a) { return attrs.indexOf(a); });
        for (var x = 0; x < rows.length; x++) {
          for (var y = x + 1; y < rows.length; y++) {
            var agree = li.every(function (c) { return rows[x][c] === rows[y][c]; });
            if (!agree) continue;
            ri.forEach(function (c) {
              if (rows[x][c] === rows[y][c]) return;
              var keep = rows[x][c] === "a" || rows[y][c] === "a" ? "a" : rows[x][c] < rows[y][c] ? rows[x][c] : rows[y][c];
              var drop = rows[x][c] === keep ? rows[y][c] : rows[x][c];
              rows.forEach(function (r) { if (r[c] === drop) r[c] = keep; });
              changed = true;
            });
          }
        }
      });
    }
    var lossless = rows.some(function (r) { return r.every(function (v) { return v === "a"; }); });
    return { lossless: lossless, rows: rows };
  }

  D.fd = {
    parseSchema: parseSchema,
    parseFDs: parseFDs,
    closure: closure,
    implies: implies,
    keys: keys,
    cover: cover,
    project: project,
    normalForm: normalForm,
    chase: chase,
    has: has,
    same: same,
    minus: minus,
    order: order,
    fdText: fdText,
    setText: setText
  };
})();
