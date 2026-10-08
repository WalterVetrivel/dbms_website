/* DBMS architecture explorer (widget V2).
   Draws the overall structure of a database system: users and their tools,
   the query processor, the storage manager and disk storage. Tapping a part
   shows its role. "Follow a statement" steps one SQL statement through the
   parts it uses.
   Markup: <div class="widget" data-widget="architecture"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  // id: [label, x, y, w, h, group, role]
  var PARTS = {
    naive: ["Naive users", 10, 10, 175, 40, "user", "Tellers, clerks and web users. They use the system through ready-made application screens, such as an ATM or a booking form."],
    coders: ["Application programmers", 195, 10, 175, 40, "user", "Computer professionals who write application programs (in Java, Python or C with embedded SQL)."],
    soph: ["Sophisticated users", 380, 10, 175, 40, "user", "Analysts and engineers who write their own queries in SQL using query tools."],
    dba: ["Database administrator", 565, 10, 185, 40, "user", "The DBA has central control: defines the schema, grants access, plans storage, takes backups and tunes performance."],
    forms: ["Application interfaces", 10, 70, 175, 40, "tool", "Forms and screens used by naive users. They call application programs behind the scenes."],
    programs: ["Application programs", 195, 70, 175, 40, "tool", "Programs that contain SQL statements. A compiler and linker turn them into object code that sends DML to the DBMS."],
    tools: ["Query tools", 380, 70, 175, 40, "tool", "Tools such as MySQL Workbench, where users type SQL and see the result."],
    admin: ["Administration tools", 565, 70, 185, 40, "tool", "Tools the DBA uses to run DDL, manage users, and take backups."],
    ddl: ["DDL interpreter", 565, 165, 170, 40, "qp", "Reads DDL statements (such as CREATE TABLE) and records the definitions in the data dictionary."],
    dml: ["DML compiler and organizer", 195, 165, 340, 40, "qp", "Translates a DML query into an evaluation plan of low-level instructions. It also does query optimization: it picks the cheapest plan among the many that give the same result."],
    qee: ["Query evaluation engine", 195, 225, 540, 40, "qp", "Runs the low-level instructions of the evaluation plan made by the DML compiler, and returns the result."],
    auth: ["Authorization and integrity manager", 25, 330, 350, 40, "sm", "Checks that the user has the right to do the operation, and that the new data satisfies the integrity constraints."],
    trans: ["Transaction manager", 385, 330, 350, 40, "sm", "Keeps the database consistent despite system failures, and makes concurrent transactions run without conflicts."],
    file: ["File manager", 25, 385, 350, 40, "sm", "Allocates space on disk and manages the data structures used to store the information on disk."],
    buffer: ["Buffer manager", 385, 385, 350, 40, "sm", "Fetches data from disk into main memory and decides what to keep (cache) in memory. It lets the database handle data much larger than memory."],
    data: ["Data files", 25, 490, 165, 44, "disk", "Store the database itself: the rows of every table."],
    dict: ["Data dictionary", 210, 490, 165, 44, "disk", "Stores metadata: data about data, such as the schema, constraints and user rights."],
    idx: ["Indices", 395, 490, 165, 44, "disk", "Give fast access to the data items that hold a given value, like the index of a book."],
    stats: ["Statistical data", 580, 490, 155, 44, "disk", "Facts about the data, such as the number of rows in each table, used by the optimizer to choose a plan."]
  };
  var BOXES = [
    ["Query processor", 10, 140, 740, 140],
    ["Storage manager", 10, 305, 740, 135],
    ["Disk storage", 10, 465, 740, 85]
  ];
  var LINKS = [
    ["naive", "forms"], ["coders", "programs"], ["soph", "tools"], ["dba", "admin"],
    ["forms", "dml"], ["programs", "dml"], ["tools", "dml"], ["admin", "ddl"],
    ["dml", "qee"], ["qee", "auth"], ["qee", "trans"], ["auth", "buffer"], ["trans", "buffer"], ["buffer", "file"],
    ["file", "data"], ["ddl", "dict"], ["buffer", "idx"]
  ];

  var SCENARIOS = {
    select: {
      label: "SELECT by a sophisticated user",
      sql: "SELECT name FROM student WHERE roll_no = '23CS041';",
      steps: [
        [["soph", "tools"], "An analyst types the SELECT query in a query tool and runs it."],
        [["dml", "dict"], "The DML compiler parses the query. It checks the data dictionary: does the table student exist, and does it have the columns name and roll_no?"],
        [["dml", "stats", "idx"], "The DML compiler and organizer optimizes the query. Statistics show student has 4000 rows, and there is an index on roll_no, so the cheapest plan uses the index."],
        [["qee"], "The query evaluation engine starts running the plan."],
        [["auth", "dict"], "The authorization manager checks the data dictionary: may this user read the student table? Yes."],
        [["buffer"], "The engine asks the buffer manager for the index block and the data block. They are not in main memory yet."],
        [["file", "idx", "data"], "The file manager reads the index block and then the data block that holds roll_no 23CS041 from disk."],
        [["buffer", "qee"], "The buffer manager keeps the blocks in memory for later use and hands them to the engine."],
        [["qee", "tools", "soph"], "The engine picks out the name, Priya, and the query tool shows the result to the analyst."]
      ]
    },
    update: {
      label: "UPDATE from an application program",
      sql: "UPDATE account SET balance = balance - 500 WHERE acc_no = 'A-101';",
      steps: [
        [["naive", "forms"], "A bank clerk enters a withdrawal of ₹500 on the bank's screen."],
        [["programs", "dml"], "The application program sends the UPDATE statement to the DML compiler, which makes an evaluation plan."],
        [["qee", "trans"], "The query evaluation engine runs the plan inside a transaction. The transaction manager writes a log record first, so the change can be undone if something fails."],
        [["auth"], "The integrity manager checks the constraint balance >= 0. The new balance is ₹1500, so the update is allowed."],
        [["buffer", "file", "data"], "The buffer manager brings the block of account A-101 into memory and changes it there. The file manager writes it to the data file later."],
        [["trans"], "The transaction manager commits the transaction. Even if the power fails now, the change will not be lost."],
        [["forms", "naive"], "The clerk's screen shows “Withdrawal successful”."]
      ]
    },
    ddl: {
      label: "CREATE TABLE by the DBA",
      sql: "CREATE TABLE course (course_id CHAR(6) PRIMARY KEY, title VARCHAR(40));",
      steps: [
        [["dba", "admin"], "The DBA runs a CREATE TABLE statement from an administration tool."],
        [["ddl"], "The DDL interpreter reads the statement. DDL defines structure, so it does not go to the DML compiler."],
        [["ddl", "dict"], "The DDL interpreter records the new table, its columns, their types and the primary key in the data dictionary."],
        [["file", "data", "idx"], "The file manager allocates disk space for the new table and for the index that supports the primary key."],
        [["dict"], "From now on, every query on course is checked against these definitions in the data dictionary."]
      ]
    }
  };

  function center(id) {
    var p = PARTS[id];
    return [p[1] + p[3] / 2, p[2] + p[4] / 2];
  }

  function Widget(root) {
    var self = this;
    var esc = D.wq.esc;
    this.mode = "explore";
    this.picked = "dml";
    this.scenario = "select";
    root.innerHTML =
      '<div class="widget-head"><strong>DBMS architecture explorer</strong></div>' +
      '<div class="widget-controls">' +
      '<div class="seg" role="group" aria-label="Mode"><button type="button" class="seg-btn" data-mode="explore" aria-pressed="true">Explore the parts</button><button type="button" class="seg-btn" data-mode="follow" aria-pressed="false">Follow a statement</button></div>' +
      '<label class="wp-field wp-grow" data-only="follow" hidden><span>Statement</span><select data-scenario>' +
      Object.keys(SCENARIOS).map(function (k) {
        return '<option value="' + k + '">' + esc(SCENARIOS[k].label) + "</option>";
      }).join("") +
      "</select></label></div>" +
      '<p class="wp-meta ar-sql" data-only="follow" hidden><code data-sql></code></p>' +
      '<div class="widget-stage ar-stage" tabindex="0" aria-label="Architecture diagram. Scroll sideways if needed."></div>' +
      '<p class="widget-narration" aria-live="polite" data-info></p>' +
      '<div data-player data-only="follow" hidden></div>';
    this.root = root;
    this.stage = root.querySelector(".ar-stage");
    this.info = root.querySelector("[data-info]");
    this.select = root.querySelector("[data-scenario]");
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (f) {
        self.draw(f.on, f.done);
      },
      resetLabel: "Start again",
      onReset: function () {
        self.loadScenario();
      }
    });
    this.playerNarration = root.querySelector("[data-player] [data-narration]");
    root.querySelectorAll("[data-mode]").forEach(function (b) {
      b.addEventListener("click", function () {
        self.setMode(b.getAttribute("data-mode"));
      });
    });
    this.select.addEventListener("change", function () {
      self.scenario = self.select.value;
      self.loadScenario();
    });
    this.stage.addEventListener("click", function (e) {
      var g = e.target.closest("[data-part]");
      if (g) self.pick(g.getAttribute("data-part"));
    });
    this.stage.addEventListener("keydown", function (e) {
      var g = e.target.closest("[data-part]");
      if (g && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        self.pick(g.getAttribute("data-part"));
      }
    });
    this.setMode("explore");
  }

  Widget.prototype.setMode = function (mode) {
    this.mode = mode;
    this.root.querySelectorAll("[data-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-mode") === mode));
    });
    this.root.querySelectorAll("[data-only]").forEach(function (el) {
      el.hidden = el.getAttribute("data-only") !== mode;
    });
    this.info.hidden = mode !== "explore";
    if (mode === "explore") this.pick(this.picked);
    else this.loadScenario();
  };

  Widget.prototype.pick = function (id) {
    if (this.mode !== "explore") this.setMode("explore");
    this.picked = id;
    this.draw([id], []);
    this.info.textContent = PARTS[id][0] + ": " + PARTS[id][6];
  };

  Widget.prototype.loadScenario = function () {
    var sc = SCENARIOS[this.scenario];
    this.root.querySelector("[data-sql]").textContent = sc.sql;
    var seen = [];
    var frames = sc.steps.map(function (s) {
      var f = { msg: s[1], on: s[0], done: seen.slice() };
      s[0].forEach(function (id) {
        if (seen.indexOf(id) < 0) seen.push(id);
      });
      return f;
    });
    this.player.load(frames, false);
  };

  Widget.prototype.draw = function (on, done) {
    var esc = D.wq.esc;
    var svg = '<svg class="ar-svg" viewBox="0 0 760 560" width="760" height="560" role="img" aria-label="Database system architecture. Highlighted: ' + esc(on.map(function (id) { return PARTS[id][0]; }).join(", ")) + '.">';
    BOXES.forEach(function (b) {
      svg += '<rect class="ar-box" x="' + b[1] + '" y="' + b[2] + '" width="' + b[3] + '" height="' + b[4] + '" rx="10"/>' +
        '<text class="ar-boxlabel" x="' + (b[1] + 12) + '" y="' + (b[2] + 18) + '">' + esc(b[0]) + "</text>";
    });
    LINKS.forEach(function (l) {
      var a = center(l[0]);
      var c = center(l[1]);
      var lit = on.indexOf(l[0]) >= 0 && on.indexOf(l[1]) >= 0;
      svg += '<line class="ar-link' + (lit ? " is-on" : "") + '" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + c[0] + '" y2="' + c[1] + '"/>';
    });
    Object.keys(PARTS).forEach(function (id) {
      var p = PARTS[id];
      var cls = "ar-part ar-" + p[5] + (on.indexOf(id) >= 0 ? " is-on" : done.indexOf(id) >= 0 ? " is-done" : "");
      svg += '<g class="' + cls + '" data-part="' + id + '" tabindex="0" role="button" aria-label="' + esc(p[0]) + '">' +
        '<rect x="' + p[1] + '" y="' + p[2] + '" width="' + p[3] + '" height="' + p[4] + '" rx="' + (p[5] === "disk" ? 14 : 6) + '"/>' +
        '<text x="' + (p[1] + p[3] / 2) + '" y="' + (p[2] + p[4] / 2 + 5) + '" text-anchor="middle">' + esc(p[0]) + "</text></g>";
    });
    svg += "</svg>";
    var focused = document.activeElement && document.activeElement.getAttribute && document.activeElement.getAttribute("data-part");
    this.stage.innerHTML = svg;
    if (focused) {
      var again = this.stage.querySelector('[data-part="' + focused + '"]');
      if (again) again.focus({ preventScroll: true });
    }
    // On narrow screens the diagram scrolls sideways: bring the lit part into view.
    var first = this.stage.querySelector(".ar-part.is-on");
    if (first && this.stage.scrollWidth > this.stage.clientWidth) {
      var box = first.getBoundingClientRect();
      var frame = this.stage.getBoundingClientRect();
      if (box.left < frame.left || box.right > frame.right) {
        this.stage.scrollLeft += box.left - frame.left - (frame.width - box.width) / 2;
      }
    }
  };

  D.architecture = { PARTS: PARTS, SCENARIOS: SCENARIOS };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="architecture"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
