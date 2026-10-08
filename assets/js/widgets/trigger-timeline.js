/* Trigger timeline (widget V14).
   Runs an INSERT, UPDATE or DELETE on an account table that has BEFORE and
   AFTER row triggers. For each row it shows the BEFORE trigger (with the OLD
   and NEW values), the row change and the AFTER trigger that writes to
   balance_log. A BEFORE trigger that raises an error stops the statement and
   undoes every change it made. Needs player.js.
   Markup: <div class="widget" data-widget="trigger-timeline" data-preset="0"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  var COLS = ["acc_no", "owner", "balance"];
  var LOG_COLS = ["log_id", "acc_no", "action", "old_balance", "new_balance"];
  var START = [[101, "Anitha", 1000], [102, "Bharath", 300], [103, "Charan", 2500]];

  /* Each preset lists the rows it touches: for each, the OLD row (null for
     INSERT) and the NEW row (null for DELETE). */
  var PRESETS = [
    {
      label: "INSERT a new account",
      sql: "INSERT INTO account VALUES (104, 'Divya', 500);",
      event: "INSERT",
      rows: function () { return [{ old: null, now: [104, "Divya", 500] }]; }
    },
    {
      label: "INSERT a negative balance (rejected)",
      sql: "INSERT INTO account VALUES (105, 'Esha', -50);",
      event: "INSERT",
      rows: function () { return [{ old: null, now: [105, "Esha", -50] }]; }
    },
    {
      label: "UPDATE one account",
      sql: "UPDATE account SET balance = balance - 200\nWHERE acc_no = 101;",
      event: "UPDATE",
      rows: function (t) { return pick(t, function (r) { return r[0] === 101; }, function (r) { return r[2] - 200; }); }
    },
    {
      label: "UPDATE two accounts (one trigger run per row)",
      sql: "UPDATE account SET balance = balance + 100\nWHERE balance < 2000;",
      event: "UPDATE",
      rows: function (t) { return pick(t, function (r) { return r[2] < 2000; }, function (r) { return r[2] + 100; }); }
    },
    {
      label: "UPDATE that fails on the second row",
      sql: "UPDATE account SET balance = balance - 500\nWHERE acc_no IN (101, 102);",
      event: "UPDATE",
      rows: function (t) { return pick(t, function (r) { return r[0] === 101 || r[0] === 102; }, function (r) { return r[2] - 500; }); }
    },
    {
      label: "DELETE an account",
      sql: "DELETE FROM account WHERE acc_no = 102;",
      event: "DELETE",
      rows: function (t) { return pick(t, function (r) { return r[0] === 102; }, null); }
    }
  ];

  function pick(table, test, newBalance) {
    var out = [];
    table.forEach(function (r) {
      if (test(r)) out.push({ old: r.slice(), now: newBalance ? [r[0], r[1], newBalance(r)] : null });
    });
    return out;
  }

  function money(v) {
    return v === null || v === undefined ? null : Number(v).toFixed(2);
  }

  function build(p) {
    var esc = D.wq.esc;
    var ev = p.event;
    var table = START.map(function (r) { return r.slice(); });
    var log = [];
    var frames = [];
    var touched = p.rows(table);
    var hasBefore = ev !== "DELETE";

    function cell(v) {
      return v === null ? '<td class="jv-null">NULL</td>' : "<td>" + esc(v) + "</td>";
    }

    function tbl(cap, headers, rows, cls) {
      return '<div class="nz-card"><div class="nz-name">' + esc(cap) + '</div><div class="so-scroll"><table class="so-table nz-tab jv-tab"><caption class="visually-hidden">' + esc(cap) + "</caption><thead><tr>" +
        headers.map(function (c) { return '<th scope="col">' + esc(c) + "</th>"; }).join("") + "</tr></thead><tbody>" +
        (rows.length ? rows.map(function (r, i) {
          var c = cls ? cls(r, i) : "";
          return "<tr" + (c ? ' class="' + c + '"' : "") + ">" + r.map(cell).join("") + "</tr>";
        }).join("") : '<tr><td colspan="' + headers.length + '" class="muted">(no rows)</td></tr>') + "</tbody></table></div></div>";
    }

    function shown(r) {
      return [r[0], r[1], money(r[2])];
    }

    function oldNew(t) {
      if (!t) return "";
      var na = "not available";
      return '<div class="tt-vals">' +
        '<div class="tt-val"><span class="tt-tag">OLD</span> ' + (t.old ? esc(shown(t.old).join(", ")) : '<span class="muted">' + (ev === "INSERT" ? na + " in an INSERT trigger" : na) + "</span>") + "</div>" +
        '<div class="tt-val"><span class="tt-tag">NEW</span> ' + (t.now ? esc(shown(t.now).join(", ")) : '<span class="muted">' + (ev === "DELETE" ? na + " in a DELETE trigger" : na) + "</span>") + "</div>" +
        "</div>";
    }

    /* phase: index into the steps for the current row; state: "now", "fail" */
    function line(rowNo, phase, fail) {
      var steps = [(hasBefore ? "BEFORE " + ev + " trigger" : "No BEFORE " + ev + " trigger"), ev === "INSERT" ? "Insert row" : ev === "UPDATE" ? "Update row" : "Delete row", "AFTER " + ev + " trigger"];
      return '<ol class="tt-line" aria-label="Order of work for row ' + rowNo + '">' + steps.map(function (s, i) {
        var c = i < phase ? "tt-done" : i === phase ? (fail ? "tt-fail" : "tt-now") : "";
        return "<li" + (c ? ' class="' + c + '"' : "") + ">" + esc(s) + "</li>";
      }).join("") + "</ol>";
    }

    function view(opts) {
      opts = opts || {};
      return '<pre class="sa-sql"><code>' + esc(p.sql) + "</code></pre>" +
        (opts.line || "") + oldNew(opts.t) +
        (opts.note ? '<p class="sq-note">' + opts.note + "</p>" : "") +
        '<div class="nz-cards">' +
        tbl("account", COLS, table.map(shown), function (r) {
          return opts.mark && r[0] === opts.mark ? (opts.markCls || "jv-on") : "";
        }) +
        tbl("balance_log", LOG_COLS, log.map(function (l) { return [l[0], l[1], l[2], money(l[3]), money(l[4])]; }), function (r, i) {
          return opts.newLog && i === log.length - 1 ? "jv-new" : "";
        }) +
        "</div>";
    }

    var saveTable = table.map(function (r) { return r.slice(); });
    frames.push({
      msg: "The statement is " + ev + ". MySQL triggers are row-level (FOR EACH ROW), so the triggers run once for each row the statement changes. This statement matches " + touched.length + " row" + (touched.length === 1 ? "" : "s") + ".",
      html: view({ note: "Triggers on account: BEFORE INSERT and BEFORE UPDATE reject a negative balance. AFTER INSERT, AFTER UPDATE and AFTER DELETE write a row to balance_log." })
    });

    var failed = false;
    touched.forEach(function (t, k) {
      if (failed) return;
      var key = (t.old || t.now)[0];
      var rowNo = k + 1;
      if (hasBefore) {
        var bad = t.now[2] < 0;
        frames.push({
          msg: "Row " + rowNo + ": the BEFORE " + ev + " trigger runs first. It reads NEW.balance = " + money(t.now[2]) + ". " +
            (bad ? "That is negative, so the trigger runs SIGNAL SQLSTATE '45000'." : "That is not negative, so the trigger lets the change go ahead.") +
            (k === 0 ? " A BEFORE trigger may also change NEW values before they are saved." : ""),
          html: view({ line: line(rowNo, 0, bad), t: t, mark: t.old ? key : null, note: "IF NEW.balance &lt; 0 THEN SIGNAL ... → <strong>" + (bad ? "error raised" : "no error") + "</strong>" })
        });
        if (bad) {
          failed = true;
          table = saveTable.map(function (r) { return r.slice(); });
          log = [];
          frames.push({
            msg: "The error stops the statement: “ERROR 1644 (45000): Balance cannot be negative”. The row is not " + (ev === "INSERT" ? "inserted" : "changed") + " and the AFTER trigger never runs." +
              (k > 0 ? " InnoDB also undoes the change to account " + touched[0].old[0] + " and its log row, because a statement either succeeds as a whole or not at all." : ""),
            html: view({ line: line(rowNo, 0, true), t: t, note: "Statement failed. Every change it made is rolled back." })
          });
          return;
        }
      }
      if (ev === "INSERT") {
        table.push(t.now.slice());
      } else if (ev === "UPDATE") {
        table.forEach(function (r) { if (r[0] === key) r[2] = t.now[2]; });
      } else {
        table = table.filter(function (r) { return r[0] !== key; });
      }
      frames.push({
        msg: "Row " + rowNo + ": " + (ev === "INSERT" ? "the new row is written to account." : ev === "UPDATE" ? "account " + key + " is updated from " + money(t.old[2]) + " to " + money(t.now[2]) + "." : "account " + key + " is deleted. " + (hasBefore ? "" : "There is no BEFORE DELETE trigger on this table, so nothing ran before it.")),
        html: view({ line: line(rowNo, 1, false), t: t, mark: ev === "DELETE" ? null : key, markCls: "jv-new" })
      });
      log.push([log.length + 1, key, ev, t.old ? t.old[2] : null, t.now ? t.now[2] : null]);
      frames.push({
        msg: "Row " + rowNo + ": the AFTER " + ev + " trigger runs. The change is already made, so it only records it: it inserts (" +
          key + ", '" + ev + "', " + (t.old ? "OLD.balance = " + money(t.old[2]) : "NULL") + ", " + (t.now ? "NEW.balance = " + money(t.now[2]) : "NULL") + ") into balance_log.",
        html: view({ line: line(rowNo, 3, false), t: t, mark: ev === "DELETE" ? null : key, newLog: true })
      });
    });

    if (!failed) {
      frames.push({
        msg: "Done. The statement changed " + touched.length + " row" + (touched.length === 1 ? "" : "s") + ", and the AFTER trigger wrote " + log.length + " log row" + (log.length === 1 ? "" : "s") + ". Nobody had to remember to write the log: the triggers did it.",
        html: view({})
      });
    }
    return frames;
  }

  function Widget(root) {
    var self = this;
    var esc = D.wq.esc;
    root.innerHTML =
      '<div class="widget-head"><strong>Trigger timeline</strong></div>' +
      '<div class="widget-controls"><label class="wp-field wp-grow"><span>Statement</span><select data-preset>' +
      PRESETS.map(function (p, i) { return '<option value="' + i + '">' + esc(p.label) + "</option>"; }).join("") +
      "</select></label></div>" +
      '<div class="widget-stage sa-stage"></div>' +
      "<div data-player></div>";
    this.el = { preset: root.querySelector("[data-preset]"), stage: root.querySelector(".sa-stage") };
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (f) { self.el.stage.innerHTML = f.html; },
      resetLabel: "Start again",
      onReset: function () { self.player.load(self.frames, false); }
    });
    this.el.preset.value = String(Number(root.getAttribute("data-preset")) || 0);
    this.el.preset.addEventListener("change", function () { self.run(); });
    this.run();
  }

  Widget.prototype.run = function () {
    this.frames = build(PRESETS[Number(this.el.preset.value)]);
    this.player.load(this.frames, false);
  };

  D.triggerTimeline = { build: build, PRESETS: PRESETS, START: START };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="trigger-timeline"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
