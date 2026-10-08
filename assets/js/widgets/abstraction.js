/* Three levels of abstraction (widget V1).
   Shows the same college student data at the view, logical and physical
   levels. The student picks a level to see its data, then applies a change
   to see which level changes, which mapping is updated, and which kind of
   data independence keeps the levels above it unchanged.
   Markup: <div class="widget" data-widget="abstraction"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  var LEVELS = [
    { id: "view", name: "View level", who: "Users: office clerk, hostel warden", what: "Only the part of the data each user needs" },
    { id: "logical", name: "Logical level", who: "Users: database administrator, programmers", what: "What data is stored and how it is related" },
    { id: "physical", name: "Physical level", who: "Handled by the DBMS", what: "How the data is actually stored on disk" }
  ];

  // What each level shows, before and after each change.
  var DETAIL = {
    view: {
      base: '<div class="ab-views"><div><div class="ab-cap">Office clerk view</div>' +
        '<table><thead><tr><th scope="col">roll_no</th><th scope="col">name</th><th scope="col">dept</th></tr></thead><tbody>' +
        "<tr><td>23CS041</td><td>Priya</td><td>CSE</td></tr><tr><td>23IT007</td><td>Arun</td><td>IT</td></tr></tbody></table></div>" +
        '<div><div class="ab-cap">Hostel warden view</div>' +
        '<table><thead><tr><th scope="col">roll_no</th><th scope="col">name</th><th scope="col">room</th></tr></thead><tbody>' +
        "<tr><td>23CS041</td><td>Priya</td><td>B-112</td></tr><tr><td>23IT007</td><td>Arun</td><td>A-204</td></tr></tbody></table></div></div>" +
        '<p class="ab-note">The warden cannot see fees or phone numbers. Each view is a subschema.</p>',
      library: '<p class="ab-note is-new">New: a library view (roll_no, name, books_taken). The clerk and warden views are unchanged.</p>'
    },
    logical: {
      base: '<pre class="ab-code"><code>student(roll_no CHAR(7), name VARCHAR(30), dept CHAR(4),\n        phone CHAR(10), fees_paid DECIMAL(8,2), room CHAR(5))\ndepartment(dept CHAR(4), dept_name VARCHAR(40), building VARCHAR(20))</code></pre>' +
        '<p class="ab-note">This is the logical schema: the tables, their columns and the link between student.dept and department.dept.</p>',
      email: '<pre class="ab-code"><code>student(roll_no, name, dept, phone, fees_paid, room, <mark>email</mark>)\ndepartment(dept, dept_name, building)</code></pre>' +
        '<p class="ab-note is-new">New column: email. The clerk and warden views do not use it, so they stay the same.</p>',
      split: '<pre class="ab-code"><code><mark>student(roll_no, name, dept, phone, fees_paid)</mark>\n<mark>hostel_allotment(roll_no, room)</mark>\ndepartment(dept, dept_name, building)</code></pre>' +
        '<p class="ab-note is-new">The student table is split in two. The warden view is now defined as a join of student and hostel_allotment, so it still shows roll_no, name and room.</p>',
      library: '<pre class="ab-code"><code>student(...), department(...), <mark>book_issue(roll_no, book_id, issue_date)</mark></code></pre>' +
        '<p class="ab-note is-new">To give the library its view, the administrator first adds a book_issue table at the logical level.</p>'
    },
    physical: {
      base: '<ul class="ab-list"><li>File: <code>student.ibd</code> on a hard disk</li><li>Records are kept in 16 KB blocks (pages), in roll_no order</li><li>A B+ tree index on roll_no finds a record quickly</li><li>Each record is a run of bytes: 7 for roll_no, up to 30 for name, and so on</li></ul>',
      ssd: '<ul class="ab-list"><li>File: <code>student.ibd</code> <mark>moved to a fast SSD</mark></li><li>Records are kept in 16 KB blocks (pages), in roll_no order</li><li>A B+ tree index on roll_no, <mark>and a new index on name</mark></li><li>Each record is a run of bytes, as before</li></ul>' +
        '<p class="ab-note is-new">Only the storage changed. The tables and the views are exactly the same.</p>',
      email: '<ul class="ab-list"><li>Each record now has <mark>extra bytes for email</mark></li><li>Blocks and indexes are rebuilt by the DBMS</li></ul>',
      split: '<ul class="ab-list"><li><mark>Two files</mark>: <code>student.ibd</code> and <code>hostel_allotment.ibd</code></li><li>Each has its own B+ tree index on roll_no</li></ul>',
      library: '<ul class="ab-list"><li><mark>A new file</mark>: <code>book_issue.ibd</code></li></ul>'
    }
  };

  var CHANGES = {
    none: { label: "No change", level: null },
    ssd: {
      label: "Move the data to an SSD and add an index on name",
      level: "physical",
      kind: "Physical data independence",
      mapping: "logical-physical",
      msg: "The change is at the physical level. The DBMS updates the logical–physical mapping, so the logical schema and the views do not change. Programs keep working. This is physical data independence."
    },
    email: {
      label: "Add an email column to the student table",
      level: "logical",
      kind: "Logical data independence",
      mapping: "view-logical",
      msg: "The change is at the logical level. The views do not use email, so the view–logical mapping still works and the clerk and warden see the same data. This is logical data independence."
    },
    split: {
      label: "Split student into student and hostel_allotment",
      level: "logical",
      kind: "Logical data independence",
      mapping: "view-logical",
      msg: "The logical schema changes a lot. The administrator rewrites the view–logical mapping (the warden view becomes a join), so users still see the same view. This is logical data independence. It is harder to achieve than physical data independence."
    },
    library: {
      label: "Add a new view for the library",
      level: "view",
      kind: "Only the view level grows",
      mapping: null,
      msg: "A new view is added at the top. To support it, the administrator adds a book_issue table at the logical level. The clerk and warden views do not change."
    }
  };

  function Widget(root) {
    var self = this;
    var esc = D.wq.esc;
    this.level = "view";
    this.change = "none";
    root.innerHTML =
      '<div class="widget-head"><strong>Three levels of abstraction</strong></div>' +
      '<div class="widget-controls">' +
      '<label class="wp-field wp-grow"><span>Apply a change</span><select data-change>' +
      Object.keys(CHANGES).map(function (k) {
        return '<option value="' + k + '">' + esc(CHANGES[k].label) + "</option>";
      }).join("") +
      "</select></label></div>" +
      '<div class="widget-stage ab-stage"><div class="ab-wrap"><div class="ab-levels" role="group" aria-label="Choose a level"></div><div class="ab-detail" aria-live="polite"></div></div></div>' +
      '<p class="widget-narration" aria-live="polite" data-narration></p>';
    this.levelsBox = root.querySelector(".ab-levels");
    this.detail = root.querySelector(".ab-detail");
    this.narration = root.querySelector("[data-narration]");
    this.select = root.querySelector("[data-change]");
    this.select.addEventListener("change", function () {
      self.change = self.select.value;
      var c = CHANGES[self.change];
      if (c.level) self.level = c.level;
      self.render();
    });
    this.levelsBox.addEventListener("click", function (e) {
      var b = e.target.closest("[data-level]");
      if (!b) return;
      self.level = b.getAttribute("data-level");
      self.render();
    });
    this.render();
  }

  Widget.prototype.render = function () {
    var esc = D.wq.esc;
    var c = CHANGES[this.change];
    var order = ["view", "logical", "physical"];
    var at = c.level ? order.indexOf(c.level) : -1;
    var html = "";
    var self = this;
    LEVELS.forEach(function (L, i) {
      var state = "";
      if (c.level) state = i === at ? "is-changed" : i < at ? "is-same" : c.level === "view" && i === 1 ? "is-grown" : "";
      if (c.level === "logical" && i === 2) state = "is-grown";
      var tag = state === "is-changed" ? "Changed" : state === "is-same" ? "Unchanged" : state === "is-grown" ? "Updated to match" : "";
      html += '<button type="button" class="ab-level ' + state + (self.level === L.id ? " is-current" : "") + '" data-level="' + L.id + '" aria-pressed="' + (self.level === L.id) + '">' +
        '<span class="ab-name">' + esc(L.name) + (tag ? ' <span class="ab-tag">' + tag + "</span>" : "") + "</span>" +
        '<span class="ab-what">' + esc(L.what) + "</span>" +
        '<span class="ab-who">' + esc(L.who) + "</span></button>";
      if (i < 2) {
        var m = i === 0 ? "view-logical" : "logical-physical";
        var on = c.mapping === m;
        html += '<div class="ab-map' + (on ? " is-on" : "") + '"><span aria-hidden="true">↕</span> ' + (i === 0 ? "View–logical mapping" : "Logical–physical mapping") + (on ? " (updated)" : "") + "</div>";
      }
    });
    this.levelsBox.innerHTML = html;
    var d = DETAIL[this.level];
    var body = (this.change !== "none" && d[this.change]) || d.base;
    if (this.level === "view" && this.change === "library") body = d.base + d.library;
    var name = LEVELS[order.indexOf(this.level)].name;
    this.detail.innerHTML = '<div class="ab-cap">' + esc(name) + (c.kind && this.change !== "none" ? ' · <span class="ab-kind">' + esc(c.kind) + "</span>" : "") + "</div>" + body;
    this.narration.textContent = c.level ? c.msg : "Pick a level to see the same student data at that level. Then apply a change to see which level absorbs it.";
  };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="abstraction"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
