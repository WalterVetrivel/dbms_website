/* Lossless join and dependency preservation checker (widget V10).
   The student enters a relation, its FDs and a decomposition (one part per
   line or separated by semicolons). The widget steps through the tableau
   (chase) test for a lossless join, then checks which FDs are preserved.
   For two parts it also shows the quick test: R1 ∩ R2 must be a superkey of
   R1 or R2. Needs fd.js and player.js.
   Markup: <div class="widget" data-widget="decomp-check" data-preset="0"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  var PRESETS = [
    { label: "R(ABCD), A→BC into (ABC) and (AD)", schema: "ABCD", fds: "A->BC", parts: "ABC; AD" },
    { label: "R(ABCDEF) into (ACD), (BCD), (EFD)", schema: "ABCDEF", fds: "A->BC, C->A, D->E, F->A, E->D", parts: "ACD; BCD; EFD" },
    { label: "R(ABC), A→B, B→C into (AC) and (BC)", schema: "ABC", fds: "A->B, B->C", parts: "AC; BC" },
    { label: "R(ABC), A→B, B→C into (AB) and (BC)", schema: "ABC", fds: "A->B, B->C", parts: "AB; BC" },
    { label: "R(ABCD), A→B, B→C, C→D, D→B into (AB), (BC), (BD)", schema: "ABCD", fds: "A->B, B->C, C->D, D->B", parts: "AB; BC; BD" },
    { label: "Student(RollNo, Name, DeptID, DeptName)", schema: "RollNo, Name, DeptID, DeptName", fds: "RollNo -> Name, DeptID\nDeptID -> DeptName", parts: "RollNo, Name, DeptID\nDeptID, DeptName" },
    { label: "R(Student, Course, Teacher), BCNF split", schema: "Student, Course, Teacher", fds: "Student, Course -> Teacher\nTeacher -> Course", parts: "Student, Teacher\nTeacher, Course" }
  ];

  function Widget(root) {
    var self = this;
    var esc = D.wq.esc;
    var start = Number(root.getAttribute("data-preset")) || 0;
    root.innerHTML =
      '<div class="widget-head"><strong>Lossless join and dependency preservation checker</strong></div>' +
      '<div class="widget-controls fdc-setup">' +
      '<label class="wp-field wp-grow"><span>Example</span><select data-preset>' +
      PRESETS.map(function (p, i) { return '<option value="' + i + '">' + esc(p.label) + "</option>"; }).join("") +
      '<option value="own">Enter your own values</option></select></label>' +
      '<label class="wp-field wp-grow"><span>Relation R</span><input type="text" data-schema spellcheck="false" autocomplete="off"></label>' +
      '<label class="wp-field fdc-fds"><span>Functional dependencies</span><textarea data-fds rows="2" spellcheck="false"></textarea></label>' +
      '<label class="wp-field fdc-fds"><span>Decomposition (one relation per line, or separated by semicolons)</span><textarea data-parts rows="2" spellcheck="false"></textarea></label>' +
      '<button type="button" class="btn btn-primary" data-go>Check</button>' +
      "</div>" +
      '<p class="fdc-error" role="alert" hidden></p>' +
      '<div class="widget-stage dc-stage"></div>' +
      "<div data-player></div>";
    this.el = {
      preset: root.querySelector("[data-preset]"),
      schema: root.querySelector("[data-schema]"),
      fds: root.querySelector("[data-fds]"),
      parts: root.querySelector("[data-parts]"),
      error: root.querySelector(".fdc-error"),
      stage: root.querySelector(".dc-stage")
    };
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (f) { self.el.stage.innerHTML = f.html; },
      resetLabel: "Start again",
      onReset: function () { self.player.load(self.frames, false); }
    });
    this.el.preset.addEventListener("change", function () {
      if (self.el.preset.value !== "own") self.usePreset(Number(self.el.preset.value));
      else self.el.schema.focus();
    });
    root.querySelector("[data-go]").addEventListener("click", function () { self.run(); });
    [this.el.schema, this.el.fds, this.el.parts].forEach(function (inp) {
      inp.addEventListener("input", function () { self.el.preset.value = "own"; });
    });
    this.usePreset(PRESETS[start] ? start : 0);
  }

  Widget.prototype.usePreset = function (i) {
    var p = PRESETS[i];
    this.el.preset.value = String(i);
    this.el.schema.value = p.schema;
    this.el.fds.value = p.fds;
    this.el.parts.value = p.parts;
    this.run();
  };

  Widget.prototype.run = function () {
    var F = D.fd;
    var attrs = F.parseSchema(this.el.schema.value);
    var parsed = F.parseFDs(this.el.fds.value, attrs);
    var errors = parsed.errors.slice();
    var parts = String(this.el.parts.value).split(/[;\n]+/).filter(function (p) { return p.trim(); }).map(function (p) {
      return F.parseSchema(p.replace(/[()]/g, " ").trim());
    });
    if (attrs.length < 2 || attrs.length > 10) errors.push("Enter between 2 and 10 attributes.");
    if (parts.length < 2) errors.push("Enter at least two relations in the decomposition.");
    parts.forEach(function (p) {
      var bad = p.filter(function (a) { return attrs.indexOf(a) < 0; });
      if (bad.length) errors.push(bad.join(", ") + " is not in R.");
    });
    this.el.error.hidden = !errors.length;
    this.el.error.textContent = errors.join(" ");
    if (errors.length) return;
    this.frames = build(attrs, parsed.fds, parts.map(function (p) { return F.order(p, attrs); }));
    this.player.load(this.frames, false);
  };

  function sym(v, col) {
    return v === "a" ? "a<sub>" + (col + 1) + "</sub>" : "b<sub>" + v.slice(1) + (col + 1) + "</sub>";
  }

  function tableau(attrs, parts, rows, hl) {
    var esc = D.wq.esc;
    return '<div class="so-scroll"><table class="so-table dc-tab"><caption class="visually-hidden">Tableau for the lossless-join test</caption><thead><tr><th scope="col">Relation</th>' +
      attrs.map(function (a) { return '<th scope="col">' + esc(a) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      rows.map(function (r, i) {
        var full = r.every(function (v) { return v === "a"; });
        return '<tr class="' + (full ? "is-full" : "") + '"><th scope="row">R' + (i + 1) + " " + esc(D.fd.setText(parts[i])) + "</th>" + r.map(function (v, c) {
          var on = hl && hl.col === c && hl.rows.indexOf(i) >= 0;
          return '<td class="' + (v === "a" ? "is-a" : "") + (on ? " is-on" : "") + '">' + sym(v, c) + "</td>";
        }).join("") + "</tr>";
      }).join("") + "</tbody></table></div>";
  }

  function build(attrs, fds, parts) {
    var F = D.fd;
    var esc = D.wq.esc;
    var frames = [];
    var R = F.setText(attrs);
    var union = F.order([].concat.apply([], parts), attrs);
    var missing = F.minus(attrs, union);
    var head = function (title) { return '<div class="so-cap">' + esc(title) + "</div>"; };

    if (missing.length) {
      frames.push({ msg: "The relations together do not contain " + missing.join(", ") + ". A decomposition must keep every attribute of R, so this is not a valid decomposition.", html: head("Not a decomposition") });
      return frames;
    }

    // Quick test for two relations.
    var quick = "";
    if (parts.length === 2) {
      var common = parts[0].filter(function (a) { return parts[1].indexOf(a) >= 0; });
      var c = common.length ? F.closure(common, fds, attrs) : [];
      var k1 = common.length && F.has(c, parts[0]);
      var k2 = common.length && F.has(c, parts[1]);
      quick = "Quick test: R1 ∩ R2 = " + (common.length ? F.setText(common) + ", and " + F.setText(common) + "+ = " + F.setText(c) + ". " +
        (k1 || k2 ? "It contains all of " + (k1 ? "R1" : "R2") + ", so the common attributes form a superkey of " + (k1 ? "R1" : "R2") + " and the join is lossless." :
          "It contains neither R1 nor R2, so the common attributes are not a superkey of either part, and the join is lossy.") : "{} (nothing in common), so the join is a Cartesian product and is lossy.");
    }

    // Tableau (chase) test.
    var start = parts.map(function (p, i) { return attrs.map(function (a) { return p.indexOf(a) >= 0 ? "a" : "b" + (i + 1); }); });
    var trace = [];
    var res = F.chase(attrs, parts, fds, trace);
    frames.push({
      msg: "Tableau test: make one row for each relation Ri. Put a (the same value) in the columns of Ri's attributes and a different b everywhere else." + (quick ? " " + quick : ""),
      html: head("Tableau for R = " + R) + tableau(attrs, parts, start)
    });
    trace.forEach(function (t) {
      var f = fds[t.fd];
      frames.push({
        msg: "Rows " + (t.rows[0] + 1) + " and " + (t.rows[1] + 1) + " agree on " + F.setText(f.l) + ", so by " + F.fdText(f) + " they must agree on " + attrs[t.col] + ". Make them equal" + (t.to === "a" ? ": both become a." : "."),
        html: head("Tableau for R = " + R) + tableau(attrs, parts, t.table, { col: t.col, rows: t.rows })
      });
    });
    frames.push({
      msg: res.lossless ? "Row " + (res.row + 1) + " is all a's, so the natural join of the parts always gives back exactly R. The decomposition is lossless (non-loss)." :
        "No FD can change the tableau any more, and no row is all a's. So the join can create spurious tuples: the decomposition is lossy.",
      html: head("Tableau for R = " + R) + tableau(attrs, parts, res.rows) + '<p class="kf-verdict ' + (res.lossless ? "kf-candidate" : "kf-no") + '">' + (res.lossless ? "Lossless join" : "Lossy join") + "</p>"
    });

    // Dependency preservation.
    var proj = parts.map(function (p) { return F.project(fds, attrs, p); });
    var all = [].concat.apply([], proj);
    var checks = fds.map(function (f) {
      var inOne = parts.map(function (p, i) { return F.has(p, f.l.concat(f.r)) ? i : -1; }).filter(function (i) { return i >= 0; });
      var c = F.closure(f.l, all, attrs);
      return { fd: f, ok: F.has(c, f.r), inOne: inOne, closure: c };
    });
    var lost = checks.filter(function (x) { return !x.ok; });
    var U = parts.length === 2 ? "F1 ∪ F2" : "F1 ∪ … ∪ F" + parts.length;
    var projHtml = '<ul class="dc-proj">' + parts.map(function (p, i) {
      return "<li><strong>F" + (i + 1) + "</strong> on R" + (i + 1) + " " + esc(F.setText(p)) + ": " + (proj[i].length ? esc(proj[i].map(F.fdText).join(", ")) : "only trivial FDs") + "</li>";
    }).join("") + "</ul>";
    var checkHtml = '<div class="so-scroll"><table class="so-table dc-pres"><thead><tr><th scope="col">FD in F</th><th scope="col">Preserved?</th><th scope="col">Why</th></tr></thead><tbody>' +
      checks.map(function (x) {
        return '<tr class="' + (x.ok ? "is-ok" : "is-lost") + '"><td>' + esc(F.fdText(x.fd)) + "</td><td>" + (x.ok ? "Yes" : "No") + "</td><td>" +
          (x.inOne.length ? "All its attributes are in R" + (x.inOne[0] + 1) : x.ok ? "Implied by " + U + ": " + esc(F.setText(x.fd.l)) + "+ = " + esc(F.setText(x.closure)) : "Not implied by " + U + ": " + esc(F.setText(x.fd.l)) + "+ = " + esc(F.setText(x.closure))) + "</td></tr>";
      }).join("") + "</tbody></table></div>";
    frames.push({
      msg: "Dependency preservation: find the FDs that hold on each part (the restriction Fi of F+). " + parts.map(function (p, i) { return "F" + (i + 1) + " = {" + proj[i].map(F.fdText).join(", ") + "}"; }).join("; ") + ".",
      html: head("FDs that hold on each part") + projHtml
    });
    frames.push({
      msg: lost.length ? "Not dependency preserving: " + lost.map(function (x) { return F.fdText(x.fd); }).join(", ") + " cannot be checked inside the parts. Testing it would need a join." :
        "Dependency preserving: every FD of F follows from " + U + ", so each FD can be checked inside one table.",
      html: head("FDs that hold on each part") + projHtml + head("Is each FD of F preserved?") + checkHtml +
        '<p class="dc-sum"><span class="kf-verdict ' + (res.lossless ? "kf-candidate" : "kf-no") + '">' + (res.lossless ? "Lossless" : "Lossy") + '</span> <span class="kf-verdict ' + (lost.length ? "kf-no" : "kf-candidate") + '">' + (lost.length ? "Not dependency preserving" : "Dependency preserving") + "</span></p>"
    });
    return frames;
  }

  D.decompCheck = { build: build };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="decomp-check"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
