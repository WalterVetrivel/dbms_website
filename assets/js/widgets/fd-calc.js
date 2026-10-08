/* Attribute closure and key calculator (widget V8).
   The student enters a relation and its functional dependencies, or picks a
   preset from the notes, then steps through one of three algorithms:
   the attribute closure X+, finding all candidate keys, and the canonical
   (minimal) cover. Needs fd.js and player.js.
   Markup: <div class="widget" data-widget="fd-calc" data-mode="closure"></div>
   data-mode is closure, keys or cover (the mode selected at the start). */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  var PRESETS = [
    { label: "Notes example: R(ABCDE), A→BC, CD→E, B→D, E→A", schema: "ABCDE", fds: "A->BC, CD->E, B->D, E->A", x: "A" },
    { label: "Minimal cover example: A→C, AC→D, B→ADE", schema: "ABCDE", fds: "A->C, AC->D, B->ADE", x: "B", mode: "cover" },
    { label: "R(A to J): AB→C, A→DE, B→F, F→GH, D→IJ", schema: "ABCDEFGHIJ", fds: "AB->C, A->DE, B->F, F->GH, D->IJ", x: "AB" },
    { label: "R(ABCD): AB→C, AB→D, C→A, B→D", schema: "ABCD", fds: "AB->C, AB->D, C->A, B->D", x: "BC" },
    { label: "Student course: StudentID, CourseID ...", schema: "StudentID, StudentName, CourseID, CourseName, Instructor", fds: "StudentID -> StudentName\nCourseID -> CourseName, Instructor", x: "StudentID, CourseID" }
  ];

  var MODES = { closure: "Attribute closure X+", keys: "Candidate keys", cover: "Canonical cover" };

  function Widget(root) {
    var self = this;
    var esc = D.wq.esc;
    var mode = MODES[root.getAttribute("data-mode")] ? root.getAttribute("data-mode") : "closure";
    root.innerHTML =
      '<div class="widget-head"><strong>Closure and key calculator</strong></div>' +
      '<div class="widget-controls fdc-setup">' +
      '<label class="wp-field wp-grow"><span>Example</span><select data-preset>' +
      PRESETS.map(function (p, i) { return '<option value="' + i + '">' + esc(p.label) + "</option>"; }).join("") +
      '<option value="own">Enter your own values</option></select></label>' +
      '<label class="wp-field wp-grow"><span>Relation attributes</span><input type="text" data-schema spellcheck="false" autocomplete="off"></label>' +
      '<label class="wp-field fdc-fds"><span>Functional dependencies (one per line, or separated by commas for single letters)</span><textarea data-fds rows="3" spellcheck="false"></textarea></label>' +
      '<label class="wp-field"><span>Compute</span><select data-mode>' +
      Object.keys(MODES).map(function (k) { return '<option value="' + k + '">' + MODES[k] + "</option>"; }).join("") + "</select></label>" +
      '<label class="wp-field" data-close-wrap><span>Attributes X to close</span><input type="text" data-x spellcheck="false" autocomplete="off"></label>' +
      '<button type="button" class="btn btn-primary" data-go>Compute</button>' +
      "</div>" +
      '<p class="fdc-error" role="alert" hidden></p>' +
      '<div class="widget-stage fdc-stage"><div class="fdc-grid"><div><div class="so-cap">Functional dependencies F</div><ol class="fdc-list"></ol></div><div class="fdc-panel"></div></div></div>' +
      "<div data-player></div>";
    this.el = {
      preset: root.querySelector("[data-preset]"),
      schema: root.querySelector("[data-schema]"),
      fds: root.querySelector("[data-fds]"),
      mode: root.querySelector("[data-mode]"),
      x: root.querySelector("[data-x]"),
      closeWrap: root.querySelector("[data-close-wrap]"),
      error: root.querySelector(".fdc-error"),
      list: root.querySelector(".fdc-list"),
      panel: root.querySelector(".fdc-panel")
    };
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (f) { self.render(f); },
      resetLabel: "Start again",
      onReset: function () { self.player.load(self.frames, false); }
    });
    this.el.mode.value = mode;
    this.el.preset.addEventListener("change", function () {
      if (self.el.preset.value !== "own") self.usePreset(Number(self.el.preset.value));
      else self.el.schema.focus();
    });
    this.el.mode.addEventListener("change", function () { self.run(); });
    root.querySelector("[data-go]").addEventListener("click", function () { self.run(); });
    [this.el.schema, this.el.fds, this.el.x].forEach(function (inp) {
      inp.addEventListener("input", function () { self.el.preset.value = "own"; });
    });
    this.el.x.addEventListener("keydown", function (ev) { if (ev.key === "Enter") self.run(); });
    this.el.schema.addEventListener("keydown", function (ev) { if (ev.key === "Enter") self.run(); });
    var start = PRESETS.map(function (p) { return p.mode; }).indexOf(mode);
    this.usePreset(start >= 0 ? start : 0);
  }

  Widget.prototype.usePreset = function (i) {
    var p = PRESETS[i];
    this.el.preset.value = String(i);
    this.el.schema.value = p.schema;
    this.el.fds.value = p.fds;
    this.el.x.value = p.x;
    this.run();
  };

  Widget.prototype.run = function () {
    var F = D.fd;
    var mode = this.el.mode.value;
    this.el.closeWrap.hidden = mode !== "closure";
    var attrs = F.parseSchema(this.el.schema.value);
    var parsed = F.parseFDs(this.el.fds.value, attrs);
    var errors = parsed.errors.slice();
    if (attrs.length < 2) errors.push("Enter at least two attributes.");
    if (attrs.length > 12) errors.push("Use at most 12 attributes.");
    if (!parsed.fds.length) errors.push("Enter at least one functional dependency, such as A -> B.");
    var x = [];
    if (mode === "closure") {
      x = F.parseSchema(this.el.x.value || "");
      var badX = x.filter(function (a) { return attrs.indexOf(a) < 0; });
      if (!x.length) errors.push("Enter the attributes X to close.");
      if (badX.length) errors.push(badX.join(", ") + " is not in the relation.");
    }
    this.el.error.hidden = !errors.length;
    this.el.error.textContent = errors.join(" ");
    if (errors.length) return;
    this.attrs = attrs;
    this.fds = parsed.fds;
    this.frames = mode === "closure" ? this.closureFrames(F.order(x, attrs)) : mode === "keys" ? this.keyFrames() : this.coverFrames();
    this.player.load(this.frames, false);
  };

  Widget.prototype.fdItems = function (on, gone) {
    var F = D.fd;
    return this.fds.map(function (f, i) {
      return { text: F.fdText(f), cls: i === on ? "is-on" : gone && gone.indexOf(i) >= 0 ? "is-gone" : "" };
    });
  };

  Widget.prototype.chips = function (set, added) {
    var esc = D.wq.esc;
    return '<ul class="fdc-chips">' + this.attrs.map(function (a) {
      var cls = added && added.indexOf(a) >= 0 ? "is-new" : set.indexOf(a) >= 0 ? "is-in" : "";
      return '<li class="' + cls + '">' + esc(a) + "</li>";
    }).join("") + "</ul>";
  };

  Widget.prototype.closureFrames = function (x) {
    var F = D.fd;
    var self = this;
    var esc = D.wq.esc;
    var trace = [];
    var c = F.closure(x, this.fds, this.attrs, trace);
    var name = F.setText(x) + "+";
    var frames = [{
      msg: "Start with " + name + " = " + F.setText(x) + ". The closure always contains X itself (reflexivity).",
      fds: this.fdItems(-1),
      panel: '<div class="so-cap">' + esc(name) + "</div>" + this.chips(x, x)
    }];
    trace.forEach(function (t) {
      var f = self.fds[t.fd];
      frames.push({
        msg: F.fdText(f) + " applies, because " + F.setText(f.l) + " is inside the closure. Add " + t.add.join(", ") + ". " + name + " is now " + F.setText(t.now) + ".",
        fds: self.fdItems(t.fd),
        panel: '<div class="so-cap">' + esc(name) + "</div>" + self.chips(t.now, t.add)
      });
    });
    var all = F.same(c, this.attrs);
    var minimal = all && x.every(function (a) {
      return !F.same(F.closure(F.minus(x, [a]), self.fds, self.attrs), self.attrs);
    });
    var missing = F.minus(this.attrs, c);
    frames.push({
      msg: "No FD adds anything new, so " + name + " = " + F.setText(c) + ". " +
        (all ? F.setText(x) + " determines every attribute, so it is a superkey" + (minimal ? ", and no attribute can be removed, so it is a candidate key." : ", but it is not minimal, so it is not a candidate key.") :
          F.setText(x) + " is not a superkey: it does not determine " + missing.join(", ") + "."),
      fds: this.fdItems(-1),
      panel: '<div class="so-cap">' + esc(name) + "</div>" + this.chips(c) +
        '<p class="kf-verdict ' + (minimal ? "kf-candidate" : all ? "kf-super" : "kf-no") + '">' + (minimal ? "Candidate key" : all ? "Superkey, not minimal" : "Not a superkey") + "</p>"
    });
    return frames;
  };

  Widget.prototype.keyFrames = function () {
    var F = D.fd;
    var esc = D.wq.esc;
    var self = this;
    var trace = [];
    var info = F.keys(this.attrs, this.fds, trace);
    var rows = [];
    function table(hl) {
      return '<div class="so-cap">Sets tested</div><div class="so-scroll"><table class="so-table fdc-table"><thead><tr><th scope="col">Set</th><th scope="col">Closure</th><th scope="col">Result</th></tr></thead><tbody>' +
        rows.map(function (r, i) {
          return '<tr class="' + (i === hl ? "is-hl " : "") + (r.key ? "is-key" : "") + '"><td>' + esc(F.setText(r.set)) + "</td><td>" + (r.closure ? esc(F.setText(r.closure)) : "") + "</td><td>" +
            (r.key ? "Candidate key" : r.superOf ? "Contains the key " + esc(F.setText(r.superOf)) : "Not a key") + "</td></tr>";
        }).join("") + "</tbody></table></div>";
    }
    var frames = [{
      msg: "Shortcut: " + (info.core.length ? F.setText(info.core) + " never appears on a right side, so nothing determines it. It must be in every key. " : "Every attribute appears on some right side. ") +
        (info.never.length ? F.setText(info.never) + " appears only on right sides, so it is never needed in a key. " : "") +
        "We now test sets in order of size, adding attributes from " + F.setText(info.middle) + ".",
      fds: this.fdItems(-1),
      panel: table(-1)
    }];
    var shown = trace.filter(function (t) { return !t.superOf; });
    var limit = 24;
    shown.slice(0, limit).forEach(function (t) {
      rows.push(t);
      frames.push({
        msg: "Test " + F.setText(t.set) + ": its closure is " + F.setText(t.closure) + ". " + (t.key ? "That is every attribute, and no smaller set inside it is a key, so " + F.setText(t.set) + " is a candidate key." : "Some attributes are missing, so it is not a key."),
        fds: self.fdItems(-1),
        panel: table(rows.length - 1)
      });
    });
    var skipped = trace.length - shown.length;
    var prime = this.attrs.filter(function (a) { return info.keys.some(function (k) { return k.indexOf(a) >= 0; }); });
    var nonPrime = F.minus(this.attrs, prime);
    frames.push({
      msg: "Candidate keys: " + info.keys.map(F.setText).join(", ") + ". " + (skipped ? skipped + " larger sets contain a key already, so they are superkeys but not candidate keys. " : "") +
        "Prime attributes: " + F.setText(prime) + ". Non-prime attributes: " + (nonPrime.length ? F.setText(nonPrime) : "none") + "." + (shown.length > limit ? " (Only the first " + limit + " tests are shown.)" : ""),
      fds: this.fdItems(-1),
      panel: table(-1) + '<p class="fdc-keys">Candidate keys: <strong>' + info.keys.map(function (k) { return esc(F.setText(k)); }).join(", ") + "</strong></p>"
    });
    return frames;
  };

  Widget.prototype.coverFrames = function () {
    var F = D.fd;
    var esc = D.wq.esc;
    var trace = [];
    F.cover(this.fds, this.attrs, trace);
    var cur = [];
    var frames = [];
    var self = this;
    function panel(list, hl, gone) {
      return '<div class="so-cap">Working set G</div><ol class="fdc-list fdc-work">' + list.map(function (f, i) {
        return '<li class="' + (i === hl ? "is-on" : "") + (gone === i ? " is-gone" : "") + '">' + esc(F.fdText(f)) + "</li>";
      }).join("") + "</ol>";
    }
    trace.forEach(function (t) {
      if (t.kind === "split") {
        cur = t.fds;
        frames.push({ msg: "Step 1: split every right side into single attributes (decomposition rule). G now has " + cur.length + " FDs.", fds: self.fdItems(-1), panel: panel(cur, -1) });
      } else if (t.kind === "lhs") {
        var idx = -1;
        cur.forEach(function (f, i) { if (idx < 0 && F.same(f.l, t.from.l) && F.same(f.r, t.from.r)) idx = i; });
        frames.push({ msg: "Step 2: in " + F.fdText(t.from) + ", " + t.removed + " is extraneous. " + F.setText(t.smaller) + "+ = " + F.setText(t.closure) + " already contains " + t.from.r.join(", ") + ". So the FD becomes " + F.fdText({ l: t.smaller, r: t.from.r }) + ".", fds: self.fdItems(-1), panel: panel(cur, idx) });
        cur = cur.map(function (f, i) { return i === idx ? { l: t.smaller, r: f.r } : f; });
      } else if (t.kind === "redundant") {
        cur = cur.filter(function (f, i) {
          return !cur.some(function (h, k) { return k < i && F.same(h.l, f.l) && F.same(h.r, f.r); });
        });
        var j = -1;
        cur.forEach(function (f, i) { if (j < 0 && F.same(f.l, t.fd.l) && F.same(f.r, t.fd.r)) j = i; });
        frames.push({
          msg: "Step 3: is " + F.fdText(t.fd) + " redundant? Without it, " + F.setText(t.fd.l) + "+ = " + F.setText(t.closure) + ". " + (t.redundant ? "This still contains " + t.fd.r[0] + ", so the FD is redundant. Remove it." : "This does not contain " + t.fd.r[0] + ", so we keep it."),
          fds: self.fdItems(-1),
          panel: panel(cur, t.redundant ? -1 : j, t.redundant ? j : -1)
        });
        if (t.redundant) cur = cur.filter(function (_, i) { return i !== j; });
      } else if (t.kind === "union") {
        frames.push({ msg: "Step 4: combine FDs with the same left side (union rule). The canonical cover is " + t.fds.map(F.fdText).join(", ") + ".", fds: self.fdItems(-1), panel: panel(t.fds, -1) + '<p class="fdc-keys">Canonical cover F<sub>c</sub>: <strong>' + esc(t.fds.map(F.fdText).join(", ")) + "</strong></p>" });
      }
    });
    return frames;
  };

  Widget.prototype.render = function (f) {
    var esc = D.wq.esc;
    this.el.list.innerHTML = f.fds.map(function (x) { return '<li class="' + x.cls + '">' + esc(x.text) + "</li>"; }).join("");
    this.el.panel.innerHTML = f.panel;
  };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="fd-calc"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
