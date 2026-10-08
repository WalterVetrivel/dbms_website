/* Key finder (widget V3).
   The student ticks attributes of a sample Student relation. The widget says
   whether the chosen set is a super key, a candidate key, or neither, and why.
   When the set is not a super key, two rows that share the same values are
   highlighted. The keys follow the college's rules, not just this instance.
   Markup: <div class="widget" data-widget="key-finder"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  var ATTRS = ["RegNo", "RollNo", "Dept", "Name", "Email"];
  var ROWS = [
    ["7110231001", "1", "CSE", "Priya", "priya.k@kiot.in"],
    ["7110231002", "2", "CSE", "Arun", "arun.s@kiot.in"],
    ["7110231003", "1", "IT", "Priya", "priya.m@kiot.in"],
    ["7110231004", "2", "IT", "Meena", "meena.v@kiot.in"],
    ["7110231005", "3", "CSE", "Arun", "arun.r@kiot.in"]
  ];
  // The college's rules: register numbers and emails are never shared, and
  // roll numbers restart in each department.
  var CANDIDATES = [["RegNo"], ["Email"], ["RollNo", "Dept"]];
  var PRIMARY = "RegNo";

  function contains(set, sub) {
    return sub.every(function (a) {
      return set.indexOf(a) >= 0;
    });
  }

  function names(list) {
    return list.length > 1 ? "{" + list.join(", ") + "}" : list[0];
  }

  function judge(sel) {
    var list = D.wq.list;
    if (!sel.length) return { kind: "none", text: "Tick one or more attributes to test them." };
    var inside = CANDIDATES.filter(function (k) {
      return contains(sel, k);
    });
    if (!inside.length) {
      var idx = ATTRS.map(function (a, i) { return sel.indexOf(a) >= 0 ? i : -1; }).filter(function (i) { return i >= 0; });
      for (var i = 0; i < ROWS.length; i++) {
        for (var j = i + 1; j < ROWS.length; j++) {
          var same = idx.every(function (c) {
            return ROWS[i][c] === ROWS[j][c];
          });
          if (same) {
            return {
              kind: "no",
              rows: [i, j],
              text: names(sel) + " is not a super key. Rows " + (i + 1) + " and " + (j + 1) + " have the same values (" +
                idx.map(function (c) { return ATTRS[c] + " = " + ROWS[i][c]; }).join(", ") + "), so it cannot tell them apart."
            };
          }
        }
      }
      return { kind: "no", text: names(sel) + " is not a super key." };
    }
    var exact = inside.filter(function (k) {
      return k.length === sel.length;
    })[0];
    if (exact) {
      var pk = exact.length === 1 && exact[0] === PRIMARY;
      return {
        kind: "candidate",
        text: names(sel) + " is a candidate key: it identifies every student, and if you remove any attribute it no longer does." +
          (exact.length > 1 ? " It has two attributes, so it is a composite key." : "") +
          (pk ? " The designer chose it as the primary key." : " It was not chosen as the primary key, so it is an alternate key.")
      };
    }
    var k = inside[0];
    var extra = sel.filter(function (a) {
      return k.indexOf(a) < 0;
    });
    return {
      kind: "super",
      text: names(sel) + " is a super key, but not a candidate key. It contains the candidate key " + names(k) + ", so " + list(extra) + (extra.length > 1 ? " are" : " is") + " not needed. A candidate key must be minimal."
    };
  }

  function Widget(root) {
    var self = this;
    var esc = D.wq.esc;
    this.sel = [];
    root.innerHTML =
      '<div class="widget-head"><strong>Key finder</strong><span class="muted kf-rel">Student(RegNo, RollNo, Dept, Name, Email)</span></div>' +
      '<div class="widget-controls kf-picks" role="group" aria-label="Attributes to test">' +
      ATTRS.map(function (a) {
        return '<label class="wp-check kf-check"><input type="checkbox" value="' + a + '"> ' + a + "</label>";
      }).join("") +
      '<button type="button" class="btn" data-clear>Clear</button>' +
      '<button type="button" class="btn" data-all>Show all candidate keys</button>' +
      "</div>" +
      '<div class="widget-stage kf-stage"></div>' +
      '<p class="widget-narration" aria-live="polite" data-narration></p>' +
      '<p class="wp-meta">College rules: register numbers and emails are never shared. Roll numbers start again at 1 in each department, and two students can have the same name.</p>';
    this.stage = root.querySelector(".kf-stage");
    this.narration = root.querySelector("[data-narration]");
    this.boxes = root.querySelectorAll(".kf-check input");
    this.boxes.forEach(function (b) {
      b.addEventListener("change", function () {
        self.sel = ATTRS.filter(function (a) {
          return root.querySelector('.kf-check input[value="' + a + '"]').checked;
        });
        self.render();
      });
    });
    root.querySelector("[data-clear]").addEventListener("click", function () {
      self.boxes.forEach(function (b) {
        b.checked = false;
      });
      self.sel = [];
      self.render();
    });
    root.querySelector("[data-all]").addEventListener("click", function () {
      self.render(true);
    });
    this.esc = esc;
    this.render();
  }

  Widget.prototype.render = function (showAll) {
    var esc = this.esc;
    var sel = this.sel;
    var r = judge(sel);
    var head = ATTRS.map(function (a) {
      return '<th scope="col" class="' + (sel.indexOf(a) >= 0 ? "is-sel" : "") + '">' + a + (a === PRIMARY ? ' <span class="kf-pk">PK</span>' : "") + "</th>";
    }).join("");
    var body = ROWS.map(function (row, i) {
      var clash = r.rows && r.rows.indexOf(i) >= 0;
      return '<tr class="' + (clash ? "is-clash" : "") + '"><th scope="row">' + (i + 1) + "</th>" +
        row.map(function (v, c) {
          return '<td class="' + (sel.indexOf(ATTRS[c]) >= 0 ? "is-sel" : "") + '">' + esc(v) + "</td>";
        }).join("") + "</tr>";
    }).join("");
    var badge = { none: "", no: "Not a super key", super: "Super key only", candidate: "Candidate key" }[r.kind];
    this.stage.innerHTML =
      '<div class="kf-scroll"><table class="kf-table"><caption class="visually-hidden">Student relation</caption><thead><tr><th scope="col">Row</th>' + head + "</tr></thead><tbody>" + body + "</tbody></table></div>" +
      (badge ? '<p class="kf-verdict kf-' + r.kind + '">' + badge + "</p>" : "") +
      (showAll ? '<p class="kf-all">Candidate keys: <strong>RegNo</strong> (primary key), <strong>Email</strong> (alternate key) and <strong>{RollNo, Dept}</strong> (alternate key, composite). Every set that contains one of these is a super key.</p>' : "");
    this.narration.textContent = r.text;
  };

  D.keyFinder = { judge: judge, CANDIDATES: CANDIDATES };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="key-finder"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
