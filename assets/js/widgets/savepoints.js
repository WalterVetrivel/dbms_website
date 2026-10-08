/* Savepoint and rollback timeline (widget V21).
   Runs SQL statements on the CUSTOMERS table inside a transaction, with
   SAVEPOINT, ROLLBACK TO, RELEASE SAVEPOINT, COMMIT and ROLLBACK. Shows the
   table (with rows deleted but not yet committed struck through), the timeline
   of statements (undone ones crossed out) and the savepoints that still exist.
   "Build your own" adds buttons to run statements one at a time.
   Markup: <div class="widget" data-widget="savepoints" data-scenario="notes"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  var CUSTOMERS = [
    { ID: 1, NAME: "Suresh", AGE: 23, ADDRESS: "Chennai", SALARY: 5400 },
    { ID: 2, NAME: "Mano", AGE: 22, ADDRESS: "Cochin", SALARY: 6500 },
    { ID: 3, NAME: "Subhiksha", AGE: 23, ADDRESS: "New York", SALARY: 4500 },
    { ID: 4, NAME: "Malar", AGE: 24, ADDRESS: "Bangalore", SALARY: 4300 },
    { ID: 5, NAME: "Sarath", AGE: 22, ADDRESS: "Trichy", SALARY: 7500 },
    { ID: 6, NAME: "Krishna", AGE: 32, ADDRESS: "Coimbatore", SALARY: 6600 },
    { ID: 7, NAME: "Ranchana", AGE: 21, ADDRESS: "Hyderabad", SALARY: 5500 }
  ];

  var SCENARIOS = {
    notes: {
      label: "Delete three rows, then ROLLBACK TO SP2",
      script: [
        { kind: "savepoint", name: "SP1" },
        { kind: "delete", id: 1 },
        { kind: "savepoint", name: "SP2" },
        { kind: "delete", id: 2 },
        { kind: "savepoint", name: "SP3" },
        { kind: "delete", id: 3 },
        { kind: "rollbackTo", name: "SP2" }
      ]
    },
    release: {
      label: "RELEASE SAVEPOINT, then try to roll back to it",
      script: [
        { kind: "savepoint", name: "SP1" },
        { kind: "update", id: 4 },
        { kind: "savepoint", name: "SP2" },
        { kind: "delete", id: 5 },
        { kind: "release", name: "SP2" },
        { kind: "rollbackTo", name: "SP2" },
        { kind: "rollbackTo", name: "SP1" }
      ]
    },
    whole: {
      label: "ROLLBACK without a savepoint name",
      script: [
        { kind: "savepoint", name: "SP1" },
        { kind: "update", id: 4 },
        { kind: "delete", id: 5 },
        { kind: "savepoint", name: "SP2" },
        { kind: "delete", id: 6 },
        { kind: "rollback" }
      ]
    },
    commit: {
      label: "COMMIT removes all savepoints",
      script: [
        { kind: "delete", id: 1 },
        { kind: "savepoint", name: "SP1" },
        { kind: "delete", id: 2 },
        { kind: "commit" },
        { kind: "rollbackTo", name: "SP1" },
        { kind: "rollback" }
      ]
    },
    own: { label: "Build your own", script: [] }
  };

  function sql(s) {
    if (s.kind === "delete") return "DELETE FROM CUSTOMERS WHERE ID = " + s.id + ";";
    if (s.kind === "update") return "UPDATE CUSTOMERS SET SALARY = SALARY + 500 WHERE ID = " + s.id + ";";
    if (s.kind === "savepoint") return "SAVEPOINT " + s.name + ";";
    if (s.kind === "rollbackTo") return "ROLLBACK TO " + s.name + ";";
    if (s.kind === "release") return "RELEASE SAVEPOINT " + s.name + ";";
    if (s.kind === "commit") return "COMMIT;";
    return "ROLLBACK;";
  }

  function copy(o) {
    return JSON.parse(JSON.stringify(o));
  }

  /* ---------- Running a script ---------- */

  function run(script) {
    var committed = copy(CUSTOMERS);
    var hist = []; // {sql, kind, id, status, note}
    var points = []; // {name, at}: at = index in hist of the SAVEPOINT entry
    var frames = [];

    function current() {
      var rows = copy(committed);
      hist.forEach(function (h) {
        if (h.status !== "active") return;
        if (h.kind === "delete") rows = rows.filter(function (r) { return r.ID !== h.id; });
        if (h.kind === "update") rows.forEach(function (r) { if (r.ID === h.id) r.SALARY += 500; });
      });
      return rows;
    }

    function snap(msg, extra) {
      frames.push(Object.assign({
        msg: msg,
        committed: copy(committed),
        rows: current(),
        hist: copy(hist),
        points: points.map(function (p) { return p.name; }),
        touched: null,
        restored: []
      }, extra || {}));
    }

    function dropPoints(fromIdx, why) {
      points.slice(fromIdx).forEach(function (p) {
        hist[p.at].status = "gone";
        hist[p.at].note = why;
      });
      var names = points.slice(fromIdx).map(function (p) { return p.name; });
      points = points.slice(0, fromIdx);
      return names;
    }

    function undoFrom(at, why) {
      var ids = [];
      hist.forEach(function (h, i) {
        if (i > at && h.status === "active" && (h.kind === "delete" || h.kind === "update")) {
          h.status = "undone";
          h.note = why;
          ids.push(h.id);
        }
      });
      return ids;
    }

    snap("The CUSTOMERS table has 7 rows, all committed. Autocommit is off, so the first statement starts a transaction. Press Play or Next.");

    script.forEach(function (s) {
      var entry = { sql: sql(s), kind: s.kind, id: s.id, status: "active", note: "" };
      var idx;
      var rows = current();
      if (s.kind === "delete") {
        var hit = rows.some(function (r) { return r.ID === s.id; });
        hist.push(entry);
        snap(hit ? "Row " + s.id + " is deleted. The change is not committed yet, so it can still be undone." : "No row has ID " + s.id + ", so 0 rows are deleted.", { touched: s.id });
      } else if (s.kind === "update") {
        hist.push(entry);
        var row = rows.filter(function (r) { return r.ID === s.id; })[0];
        snap(row ? "Row " + s.id + "'s salary goes from " + row.SALARY + " to " + (row.SALARY + 500) + ". Not committed yet." : "No row has ID " + s.id + ", so 0 rows are updated.", { touched: s.id });
      } else if (s.kind === "savepoint") {
        idx = points.map(function (p) { return p.name; }).indexOf(s.name);
        var moved = "";
        if (idx >= 0) {
          hist[points[idx].at].status = "gone";
          hist[points[idx].at].note = "replaced";
          points.splice(idx, 1);
          moved = " An older savepoint with the same name is replaced.";
        }
        entry.status = "mark";
        hist.push(entry);
        points.push({ name: s.name, at: hist.length - 1 });
        snap("Savepoint " + s.name + " is created. It marks this point in the transaction; it changes no data." + moved);
      } else if (s.kind === "rollbackTo") {
        idx = points.map(function (p) { return p.name; }).indexOf(s.name);
        if (idx < 0) {
          entry.status = "error";
          entry.note = "savepoint " + s.name + " does not exist";
          hist.push(entry);
          snap("Error: savepoint " + s.name + " does not exist. Nothing changes.", { error: true });
          return;
        }
        var ids = undoFrom(points[idx].at, "undone by ROLLBACK TO " + s.name);
        var later = dropPoints(idx + 1, "removed by ROLLBACK TO " + s.name);
        entry.status = "info";
        hist.push(entry);
        snap("Rollback complete. " + (ids.length ? "The " + ids.length + " change" + (ids.length > 1 ? "s" : "") + " made after " + s.name + " " + (ids.length > 1 ? "are" : "is") + " undone (row" + (ids.length > 1 ? "s " : " ") + D.wq.list(ids.map(String)) + ")." : "No change was made after " + s.name + ".") +
          " Changes made before " + s.name + " stay. " + (later.length ? "Savepoint" + (later.length > 1 ? "s " : " ") + D.wq.list(later) + ", made later, " + (later.length > 1 ? "are" : "is") + " removed. " : "") +
          s.name + " itself stays, and the transaction is still open.", { restored: ids });
      } else if (s.kind === "release") {
        idx = points.map(function (p) { return p.name; }).indexOf(s.name);
        if (idx < 0) {
          entry.status = "error";
          entry.note = "savepoint " + s.name + " does not exist";
          hist.push(entry);
          snap("Error: savepoint " + s.name + " does not exist.", { error: true });
          return;
        }
        var gone = dropPoints(idx, "released");
        entry.status = "info";
        hist.push(entry);
        snap("Savepoint " + D.wq.list(gone) + (gone.length > 1 ? " are" : " is") + " removed. No data changes: the changes made after it are kept, but you can no longer roll back to " + s.name + ".");
      } else if (s.kind === "commit") {
        committed = current();
        hist.forEach(function (h) {
          if (h.status === "active") h.status = "committed";
        });
        var all = dropPoints(0, "removed by COMMIT");
        entry.status = "info";
        hist.push(entry);
        snap("Commit complete. Every change in the transaction is now permanent and cannot be rolled back. " + (all.length ? "All savepoints (" + all.join(", ") + ") are removed." : "") + " The next statement starts a new transaction.");
      } else {
        var undone = undoFrom(-1, "undone by ROLLBACK");
        var dropped = dropPoints(0, "removed by ROLLBACK");
        entry.status = "info";
        hist.push(entry);
        snap("Rollback complete. " + (undone.length ? "Every uncommitted change is undone (row" + (undone.length > 1 ? "s " : " ") + D.wq.list(undone.map(String)) + ")." : "There were no uncommitted changes to undo.") +
          (dropped.length ? " All savepoints are removed." : "") + " The table is back to its last committed state.", { restored: undone });
      }
    });
    return frames;
  }

  /* ---------- Drawing ---------- */

  var STATUS = { committed: "committed", undone: "undone", gone: "removed", error: "error" };

  function render(w, f) {
    var esc = D.wq.esc;
    var live = {};
    f.rows.forEach(function (r) { live[r.ID] = r; });
    var body = f.committed.map(function (r) {
      var now = live[r.ID];
      var cls = !now ? "is-gone" : (f.restored.indexOf(r.ID) >= 0 ? "is-back" : (f.touched === r.ID ? "is-touched" : ""));
      var show = now || r;
      var changed = now && now.SALARY !== r.SALARY;
      return '<tr class="' + cls + '"><td>' + show.ID + "</td><td>" + esc(show.NAME) + "</td><td>" + show.AGE + "</td><td>" + esc(show.ADDRESS) + '</td><td class="' + (changed ? "is-new" : "") + '">' + show.SALARY + "</td></tr>";
    }).join("");
    var table = '<div class="sp-table-box"><table class="sp-table"><caption>CUSTOMERS (' + f.rows.length + " row" + (f.rows.length === 1 ? "" : "s") + ' selected)</caption><thead><tr><th scope="col">ID</th><th scope="col">NAME</th><th scope="col">AGE</th><th scope="col">ADDRESS</th><th scope="col">SALARY</th></tr></thead><tbody>' + body + "</tbody></table>" +
      '<p class="sp-legend muted"><span class="sp-key is-gone">struck through</span> deleted, not committed · <span class="sp-key is-new">bold</span> changed, not committed</p></div>';
    var steps = f.hist.map(function (h, i) {
      var cls = "is-" + h.status + (i === f.hist.length - 1 ? " is-current" : "");
      return '<li class="' + cls + '"><code>' + esc(h.sql) + "</code>" + (STATUS[h.status] ? ' <span class="sp-tag">' + esc(h.note || STATUS[h.status]) + "</span>" : "") + "</li>";
    }).join("");
    var side = '<div class="sp-side"><div class="an-box"><div class="an-cap">Statements</div><ol class="sp-steps">' + (steps || '<li class="muted">None yet</li>') + "</ol></div>" +
      '<div class="an-box"><div class="an-cap">Savepoints that exist now</div><div class="sp-points">' +
      (f.points.length ? f.points.map(function (p) { return '<span class="sp-flag">' + esc(p) + "</span>"; }).join(" ") : '<span class="muted">None</span>') + "</div></div></div>";
    w.stage.innerHTML = '<div class="sp-layout">' + table + side + "</div>" + (f.error ? '<p class="an-end is-bad">' + esc(f.msg) + "</p>" : "");
    if (w.own) w.refreshTools(f);
  }

  /* ---------- Widget ---------- */

  function Widget(root) {
    var self = this;
    this.name = root.getAttribute("data-scenario");
    if (!SCENARIOS[this.name]) this.name = "notes";
    this.mine = [];
    root.innerHTML =
      '<div class="widget-head"><strong>Savepoints and rollback</strong></div>' +
      '<div class="widget-controls"><label class="wp-field wp-grow"><span>Statements</span><select data-scenario>' +
      Object.keys(SCENARIOS).map(function (k) {
        return '<option value="' + k + '">' + D.wq.esc(SCENARIOS[k].label) + "</option>";
      }).join("") + "</select></label></div>" +
      '<div class="widget-controls sp-tools" data-tools hidden>' +
      '<label class="wp-field"><span>Row ID</span><select data-row>' + CUSTOMERS.map(function (r) { return "<option>" + r.ID + "</option>"; }).join("") + "</select></label>" +
      '<button type="button" class="btn" data-do="delete">DELETE</button>' +
      '<button type="button" class="btn" data-do="update">UPDATE +500</button>' +
      '<button type="button" class="btn" data-do="savepoint">SAVEPOINT</button>' +
      '<label class="wp-field"><span>Savepoint</span><select data-point></select></label>' +
      '<button type="button" class="btn" data-do="rollbackTo">ROLLBACK TO</button>' +
      '<button type="button" class="btn" data-do="release">RELEASE</button>' +
      '<button type="button" class="btn" data-do="commit">COMMIT</button>' +
      '<button type="button" class="btn" data-do="rollback">ROLLBACK</button>' +
      '<button type="button" class="btn" data-do="clear">Clear</button></div>' +
      '<div class="widget-stage sp-stage" tabindex="0" aria-label="Table, statements and savepoints. Scroll if needed."></div>' +
      "<div data-player></div>";
    this.stage = root.querySelector(".sp-stage");
    this.sel = root.querySelector("[data-scenario]");
    this.tools = root.querySelector("[data-tools]");
    this.rowSel = root.querySelector("[data-row]");
    this.pointSel = root.querySelector("[data-point]");
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (f) {
        render(self, f);
      },
      resetLabel: "Start again",
      onReset: function () {
        if (self.own) self.mine = [];
        self.load();
      }
    });
    this.sel.value = this.name;
    this.sel.addEventListener("change", function () {
      self.name = self.sel.value;
      self.load();
    });
    this.tools.addEventListener("click", function (e) {
      var b = e.target.closest("[data-do]");
      if (!b) return;
      var k = b.getAttribute("data-do");
      if (k === "clear") {
        self.mine = [];
      } else if (k === "delete" || k === "update") {
        self.mine.push({ kind: k, id: Number(self.rowSel.value) });
      } else if (k === "savepoint") {
        self.mine.push({ kind: k, name: "SP" + (self.mine.filter(function (s) { return s.kind === "savepoint"; }).length + 1) });
      } else if (k === "rollbackTo" || k === "release") {
        if (!self.pointSel.value) {
          self.player.say("There is no savepoint to use. Press SAVEPOINT first.");
          return;
        }
        self.mine.push({ kind: k, name: self.pointSel.value });
      } else {
        self.mine.push({ kind: k });
      }
      self.load(true);
    });
    this.load();
  }

  Widget.prototype.refreshTools = function (f) {
    var keep = this.pointSel.value;
    this.pointSel.innerHTML = f.points.map(function (p) { return "<option>" + p + "</option>"; }).join("");
    if (f.points.indexOf(keep) >= 0) this.pointSel.value = keep;
    var none = !f.points.length;
    this.tools.querySelector('[data-do="rollbackTo"]').disabled = none;
    this.tools.querySelector('[data-do="release"]').disabled = none;
  };

  Widget.prototype.load = function (atEnd) {
    this.own = this.name === "own";
    this.tools.hidden = !this.own;
    var frames = run(this.own ? this.mine : SCENARIOS[this.name].script);
    if (this.own && !this.mine.length) frames[0].msg = "Pick a row and press DELETE or UPDATE, add savepoints, then roll back to one of them. Each button runs one statement.";
    this.player.load(frames, !!atEnd);
  };

  D.savepoints = { SCENARIOS: SCENARIOS, run: run, sql: sql };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="savepoints"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
