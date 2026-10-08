/* Normalization animator (widget V9).
   Starts from a table (unnormalized when a preset has repeating values) and
   splits it step by step into 1NF, 2NF, 3NF and BCNF. Each split highlights
   the dependency that forces it. Presets carry sample rows, so the student
   sees the data move into the new tables. Needs fd.js and player.js.
   Markup: <div class="widget" data-widget="normalization" data-preset="0"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  // rows: one array per row, in schema order. A cell that is an array is a
  // repeating value: the cells that are arrays in one row are read together.
  var PRESETS = [
    {
      label: "Student courses: each course has one instructor",
      schema: "StudentID, StudentName, CourseID, CourseName, Instructor",
      fds: "StudentID -> StudentName\nCourseID -> CourseName, Instructor",
      rows: [
        ["101", "Asha", ["CS101", "CS102"], ["Databases", "Networks"], ["Dr. Rao", "Dr. Iyer"]],
        ["102", "Ravi", "CS101", "Databases", "Dr. Rao"],
        ["103", "Meena", ["CS102", "CS103"], ["Networks", "Compilers"], ["Dr. Iyer", "Dr. Khan"]]
      ],
      names: { "StudentID,StudentName": "Student", "CourseID,CourseName,Instructor": "Course", "StudentID,CourseID": "Enrollment" }
    },
    {
      label: "Student courses: each instructor teaches one course",
      schema: "StudentID, StudentName, CourseID, CourseName, Instructor",
      fds: "StudentID -> StudentName\nCourseID -> CourseName\nStudentID, CourseID -> Instructor\nInstructor -> CourseID",
      rows: [
        ["101", "Asha", ["CS101", "CS102"], ["Databases", "Networks"], ["Dr. Rao", "Dr. Iyer"]],
        ["102", "Ravi", "CS101", "Databases", "Dr. Bose"],
        ["103", "Meena", ["CS101", "CS102"], ["Databases", "Networks"], ["Dr. Rao", "Dr. Iyer"]]
      ],
      names: { "StudentID,StudentName": "Student", "CourseID,CourseName": "Course", "StudentID,CourseID,Instructor": "Enrollment", "CourseID,Instructor": "Teaches", "StudentID,Instructor": "Enrollment" }
    },
    {
      label: "Student phones (repeating values)",
      schema: "sid, sname, phone",
      fds: "sid -> sname",
      rows: [
        ["1", "Ajay", ["98400 11111", "97100 22222"]],
        ["2", "Bindu", "99620 33333"],
        ["3", "Chitra", ["94440 44444", "90030 55555"]]
      ],
      names: { "sid,sname": "Student", "sid,phone": "Student_Phone" }
    },
    {
      label: "Student_Course(sid, sname, cid, cname)",
      schema: "sid, sname, cid, cname",
      fds: "sid -> sname\ncid -> cname",
      rows: [
        ["1", "Ajay", "C1", "Java"],
        ["1", "Ajay", "C2", "Python"],
        ["2", "Bindu", "C3", "C++"],
        ["3", "Chitra", "C1", "Java"]
      ],
      names: { "sid,sname": "Student", "cid,cname": "Course", "sid,cid": "Student_Course" }
    },
    {
      label: "Student_details with zip code, city and state",
      schema: "sid, sname, zipcode, cityname, state",
      fds: "sid -> sname, zipcode\nzipcode -> cityname\n" + "cityname -> state",
      rows: [
        ["1", "Ajay", "600001", "Chennai", "Tamil Nadu"],
        ["2", "Bindu", "560001", "Bengaluru", "Karnataka"],
        ["3", "Chitra", "600001", "Chennai", "Tamil Nadu"],
        ["4", "Dev", "600020", "Chennai", "Tamil Nadu"]
      ],
      names: { "sid,sname,zipcode": "Student", "zipcode,cityname,state": "Zip", "zipcode,cityname": "Zip", "cityname,state": "City" }
    },
    {
      label: "R(A to J) from the notes",
      schema: "ABCDEFGHIJ",
      fds: "AB->C, A->DE, B->F, F->GH, D->IJ"
    },
    {
      label: "R(ABCD), AB→C, AB→D, C→A, B→D",
      schema: "ABCD",
      fds: "AB->C, AB->D, C->A, B->D"
    },
    {
      label: "Enrollment(sid, course, teacher)",
      schema: "sid, course, teacher",
      fds: "sid, course -> teacher\nteacher -> course",
      rows: [
        ["1", "C", "Ankita"],
        ["1", "Java", "Pooja"],
        ["2", "C", "Archana"],
        ["3", "C", "Ankita"],
        ["4", "Java", "Pooja"]
      ],
      names: { "sid,teacher": "Student", "course,teacher": "Teacher" }
    }
  ];

  var LEVELS = ["UNF", "1NF", "2NF", "3NF", "BCNF"];

  function Widget(root) {
    var self = this;
    var esc = D.wq.esc;
    var start = Number(root.getAttribute("data-preset")) || 0;
    root.innerHTML =
      '<div class="widget-head"><strong>Normalization animator</strong></div>' +
      '<div class="widget-controls fdc-setup">' +
      '<label class="wp-field wp-grow"><span>Example</span><select data-preset>' +
      PRESETS.map(function (p, i) { return '<option value="' + i + '">' + esc(p.label) + "</option>"; }).join("") +
      '<option value="own">Enter your own values</option></select></label>' +
      '<label class="wp-field wp-grow"><span>Relation R</span><input type="text" data-schema spellcheck="false" autocomplete="off"></label>' +
      '<label class="wp-field fdc-fds"><span>Functional dependencies</span><textarea data-fds rows="3" spellcheck="false"></textarea></label>' +
      '<button type="button" class="btn btn-primary" data-go>Normalize</button>' +
      "</div>" +
      '<p class="fdc-error" role="alert" hidden></p>' +
      '<div class="widget-stage nz-stage"></div>' +
      "<div data-player></div>";
    this.el = {
      preset: root.querySelector("[data-preset]"),
      schema: root.querySelector("[data-schema]"),
      fds: root.querySelector("[data-fds]"),
      error: root.querySelector(".fdc-error"),
      stage: root.querySelector(".nz-stage")
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
    [this.el.schema, this.el.fds].forEach(function (inp) {
      inp.addEventListener("input", function () {
        self.el.preset.value = "own";
        self.rows = null;
      });
    });
    this.usePreset(PRESETS[start] ? start : 0);
  }

  Widget.prototype.usePreset = function (i) {
    var p = PRESETS[i];
    this.el.preset.value = String(i);
    this.el.schema.value = p.schema;
    this.el.fds.value = p.fds;
    this.rows = p.rows || null;
    this.names = p.names || {};
    this.run();
  };

  Widget.prototype.run = function () {
    var F = D.fd;
    var attrs = F.parseSchema(this.el.schema.value);
    var parsed = F.parseFDs(this.el.fds.value, attrs);
    var errors = parsed.errors.slice();
    if (attrs.length < 2 || attrs.length > 10) errors.push("Enter between 2 and 10 attributes.");
    if (!parsed.fds.length && !errors.length) errors.push("Enter at least one functional dependency.");
    this.el.error.hidden = !errors.length;
    this.el.error.textContent = errors.join(" ");
    if (errors.length) return;
    var own = this.el.preset.value === "own";
    this.frames = build(attrs, parsed.fds, own ? null : this.rows, own ? {} : this.names);
    this.player.load(this.frames, false);
  };

  // Repeating values become one row each (first normal form).
  function flatten(rows) {
    var out = [];
    rows.forEach(function (r) {
      var n = 1;
      r.forEach(function (v) { if (Array.isArray(v)) n = Math.max(n, v.length); });
      for (var i = 0; i < n; i++) out.push(r.map(function (v) { return Array.isArray(v) ? v[i] : v; }));
    });
    return out;
  }

  function projectRows(rows, attrs, rel) {
    var idx = rel.map(function (a) { return attrs.indexOf(a); });
    var seen = {};
    var out = [];
    rows.forEach(function (r) {
      var p = idx.map(function (i) { return r[i]; });
      var k = JSON.stringify(p);
      if (!seen[k]) {
        seen[k] = true;
        out.push(p);
      }
    });
    return out;
  }

  // Splits relations one dependency at a time.
  // kinds: the problem kinds to fix in this phase.
  // Returns the list of steps: { before, after, rel, fd, kind, moved, made }.
  function phase(rels, F, attrs, kinds, keepPrime, nameFor) {
    var steps = [];
    var guard = 0;
    for (;;) {
      if (++guard > 40) break;
      var hit = null;
      for (var i = 0; i < rels.length && !hit; i++) {
        var nf = info(rels[i].attrs, F, attrs);
        var p = nf.problems.filter(function (x) { return kinds.indexOf(x.kind) >= 0; })[0];
        if (p) hit = { at: i, nf: nf, p: p };
      }
      if (!hit) break;
      var rel = rels[hit.at].attrs;
      var X = hit.p.fd.l;
      var reach = D.fd.closure(X, F, attrs).filter(function (a) { return rel.indexOf(a) >= 0 && X.indexOf(a) < 0; });
      var moved = keepPrime ? reach.filter(function (a) { return hit.nf.prime.indexOf(a) < 0; }) : reach;
      if (!moved.length) moved = hit.p.fd.r.slice();
      var made = D.fd.order(X.concat(moved), attrs);
      var rest = D.fd.minus(rel, moved);
      var before = rels.slice();
      var old = rels[hit.at];
      var a = { attrs: rest, name: nameFor(rest, old.name) };
      var b = { attrs: made, name: nameFor(made, null) };
      rels.splice(hit.at, 1, a, b);
      steps.push({ before: before, after: rels.slice(), at: hit.at, fd: hit.p.fd, kind: hit.p.kind, key: hit.p.key, keys: hit.nf.keys, moved: moved, old: old, made: b, rest: a });
    }
    return steps;
  }

  function info(rel, F, attrs) {
    var proj = D.fd.project(F, attrs, rel);
    var nf = D.fd.normalForm(rel, proj);
    nf.fds = proj;
    return nf;
  }

  function build(attrs, fds, rows, names) {
    var F = D.fd;
    var esc = D.wq.esc;
    var frames = [];
    var unf = !!rows && rows.some(function (r) { return r.some(Array.isArray); });
    var flat = rows ? flatten(rows) : null;
    var counter = 0;

    // A table keeps its name when it loses attributes; a new table gets the
    // next free name (R1, R2, ...) unless the example names it.
    function nameFor(rel, keep) {
      var k = rel.join(",");
      if (names[k]) return names[k];
      return keep || "R" + ++counter;
    }

    // The FD as the student wrote it, if one contains this problem FD.
    function given(f) {
      return fds.filter(function (g) { return F.same(g.l, f.l) && F.has(g.r, f.r); })[0] || f;
    }

    function track(level) {
      var at = LEVELS.indexOf(level);
      return '<ol class="nz-track" aria-label="Normal form reached">' + LEVELS.map(function (l, i) {
        return '<li class="' + (i < at ? "is-done" : i === at ? "is-now" : "") + '"' + (i === at ? ' aria-current="step"' : "") + ">" + l + "</li>";
      }).join("") + "</ol>";
    }

    function fdChips(list, hl) {
      return '<ul class="fdc-chips nz-fds" aria-label="Functional dependencies">' + list.map(function (f) {
        var on = hl && F.same(f.l, hl.l) && F.has(f.r, hl.r);
        return '<li class="' + (on ? "is-new" : "") + '">' + esc(F.fdText(f)) + "</li>";
      }).join("") + "</ul>";
    }

    // One relation as a card with its data.
    function card(r, opts) {
      var rel = r.attrs;
      opts = opts || {};
      var nf = info(rel, fds, attrs);
      var key = nf.keys[0] || rel;
      var data = flat ? projectRows(flat, attrs, rel) : null;
      var cls = function (a) {
        var c = [];
        if (opts.x && opts.x.indexOf(a) >= 0) c.push("nz-x");
        if (opts.y && opts.y.indexOf(a) >= 0) c.push("nz-y");
        if (key.indexOf(a) >= 0) c.push("nz-key");
        return c.length ? ' class="' + c.join(" ") + '"' : "";
      };
      return '<div class="nz-card' + (opts.isNew ? " is-new" : "") + '"><div class="nz-name">' + esc(r.name) + "(" + rel.map(function (a) {
        return key.indexOf(a) >= 0 ? "<u>" + esc(a) + "</u>" : esc(a);
      }).join(", ") + ")</div>" +
        (data ? '<div class="so-scroll"><table class="so-table nz-tab"><caption class="visually-hidden">Rows of ' + esc(r.name) + '</caption><thead><tr>' +
          rel.map(function (a) { return "<th scope=\"col\"" + cls(a) + ">" + esc(a) + "</th>"; }).join("") + "</tr></thead><tbody>" +
          data.map(function (r) { return "<tr>" + r.map(function (v, i) { return "<td" + cls(rel[i]) + ">" + esc(v) + "</td>"; }).join("") + "</tr>"; }).join("") +
          "</tbody></table></div>" : "") +
        '<p class="nz-meta">' + (nf.keys.length > 1 ? "Candidate keys: " : "Key: ") + esc(nf.keys.map(F.setText).join(", ")) +
        (nf.fds.length ? " · FDs: " + esc(nf.fds.map(function (f) { return F.fdText(f); }).join(", ")) : " · Only trivial FDs") +
        ' · <span class="nz-level">' + nf.level + "</span></p></div>";
    }

    function cards(list, opts) {
      return '<div class="nz-cards">' + list.map(function (rel, i) { return card(rel, opts ? opts(rel, i) : null); }).join("") + "</div>";
    }

    // Unnormalized start.
    var R = attrs;
    var start = info(R, fds, attrs);
    var rels = [{ attrs: R, name: names[R.join(",")] || "R" }];
    if (unf) {
      frames.push({
        msg: "This table is unnormalized: some cells hold more than one value (shown with a dashed border). A relation needs one atomic value in each cell.",
        html: track("UNF") + '<div class="nz-cards"><div class="nz-card"><div class="nz-name">' + esc(rels[0].name) + "(" + R.map(esc).join(", ") + ')</div><div class="so-scroll"><table class="so-table nz-tab"><caption class="visually-hidden">Unnormalized rows</caption><thead><tr>' +
          R.map(function (a) { return '<th scope="col">' + esc(a) + "</th>"; }).join("") + "</tr></thead><tbody>" +
          rows.map(function (r) {
            return "<tr>" + r.map(function (v) {
              return Array.isArray(v) ? '<td class="nz-multi">' + v.map(esc).join("<br>") + "</td>" : "<td>" + esc(v) + "</td>";
            }).join("") + "</tr>";
          }).join("") + "</tbody></table></div></div></div>" + fdChips(fds)
      });
    }
    frames.push({
      msg: (unf ? "First normal form: give each value its own row, so every cell is atomic. " : "Every cell holds one atomic value, so the table is already in first normal form. ") +
        "The key" + (start.keys.length > 1 ? "s are " : " is ") + start.keys.map(F.setText).join(" and ") + ", so the prime attributes are " + (start.prime.length ? F.setText(start.prime) : "none") + ".",
      html: track("1NF") + cards(rels) + fdChips(fds)
    });

    var lists = { "2NF": ["partial"], "3NF": ["partial", "transitive"], "BCNF": ["partial", "transitive", "bcnf"] };
    var prev = "1NF";
    ["2NF", "3NF", "BCNF"].forEach(function (level) {
      var steps = phase(rels, fds, attrs, lists[level], level !== "BCNF", nameFor);
      if (!steps.length) {
        frames.push({
          msg: level === "2NF" ? "No non-prime attribute depends on part of a key. There is no partial dependency, so the table" + (rels.length > 1 ? "s are" : " is") + " already in 2NF." :
            level === "3NF" ? "No non-prime attribute depends on a non-key attribute. There is no transitive dependency, so every table is already in 3NF." :
              "In every FD the left side is a superkey of its table, so every table is already in BCNF.",
          html: track(level) + cards(rels) + fdChips(fds)
        });
        prev = level;
        return;
      }
      steps.forEach(function (s, si) {
        var name = s.old.name;
        var X = F.setText(s.fd.l);
        var g = given(s.fd);
        var gr = g.r.filter(function (a) { return s.moved.indexOf(a) >= 0; });
        var them = gr.length > 1 ? gr.join(", ") + " are" : gr[0] + " is";
        var why = s.kind === "partial" ? F.fdText(g) + " is a partial dependency: " + them + " non-prime and depend" + (gr.length > 1 ? "" : "s") + " on " + X + ", which is only part of the key " + F.setText(s.key) + "." :
          s.kind === "transitive" ? F.fdText(g) + " is a transitive dependency: " + X + " is not a key, and " + them + " non-prime. The key reaches " + gr.join(", ") + " only through " + X + "." :
            F.fdText(g) + " breaks BCNF: " + X + " is not a superkey of " + name + ". (" + them + " prime, so 3NF allowed it.)";
        frames.push({
          msg: why + " To reach " + level + ", move " + X + " and what it determines (" + s.moved.join(", ") + ") into a new table.",
          html: track(prev) + cards(s.before, function (r, i) { return i === s.at ? { x: s.fd.l, y: s.moved } : null; }) + fdChips(fds, s.fd)
        });
        var last = si === steps.length - 1;
        frames.push({
          msg: name + " splits into " + s.rest.name + "(" + s.rest.attrs.join(", ") + ") and " + s.made.name + "(" + s.made.attrs.join(", ") + "). " + X + " stays in both tables, so a natural join on " + X + " gives back the old table with no spurious rows." +
            (last ? " Now every table is in " + level + "." : ""),
          html: track(last ? level : prev) + cards(s.after, function (r, i) { return i === s.at || i === s.at + 1 ? { isNew: true, x: s.fd.l } : null; }) + fdChips(fds)
        });
      });
      prev = level;
    });

    // Summary: is every FD still checkable inside one table?
    var finals = rels;
    var all = [].concat.apply([], finals.map(function (r) { return F.project(fds, attrs, r.attrs); }));
    var lost = fds.filter(function (f) { return !F.implies(all, f.l, f.r, attrs); });
    frames.push({
      msg: "Result: " + finals.length + " table" + (finals.length > 1 ? "s" : "") + " in BCNF. Every split kept the shared attributes as a key of one part, so the decomposition is lossless. " +
        (lost.length ? "But " + lost.map(function (f) { return F.fdText(f); }).join(", ") + " is not preserved: no single table holds it, so checking it needs a join. Stopping at 3NF would keep it." :
          "Every FD can still be checked inside one table, so it is also dependency preserving."),
      html: track("BCNF") + cards(finals) + '<p class="dc-sum"><span class="kf-verdict kf-candidate">Lossless</span> <span class="kf-verdict ' + (lost.length ? "kf-no" : "kf-candidate") + '">' +
        (lost.length ? "Not dependency preserving" : "Dependency preserving") + "</span></p>"
    });
    return frames;
  }

  D.normalization = { build: build, flatten: flatten, PRESETS: PRESETS };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="normalization"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
