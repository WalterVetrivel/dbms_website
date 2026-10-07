/* Draws question bank items from DBMS.questions.
   On a topic page:      <div data-questions data-topic="4.6"></div>
   On a question bank:   <div data-questions data-unit="4" data-bank></div>
   On the hub page:      <div data-question-units></div>
   Each 2-mark answer comes from one data file, so it is never copied by hand. */
(function () {
  "use strict";
  var D = window.DBMS || {};
  var esc = D.esc;
  var url = D.url;

  function sourceBadges(q) {
    return q.sources
      .map(function (s) {
        var title = s.extra ? s.bank + " question bank, extra question" : s.bank + " question bank, Part " + q.part + ", question " + s.no;
        return '<span class="badge badge-source" title="' + esc(title) + '">' + esc(s.bank) + " QB</span>";
      })
      .join("");
  }

  // The question number in its unit bank, for example "A7" for u4-a7.
  function number(q) {
    return q.id.split("-")[1].toUpperCase();
  }

  // Sub-questions and the "Include ..." hint, when the question has them.
  function details(q) {
    var html = "";
    if (q.parts && q.parts.length) {
      html += '<ol class="q-parts" type="a">' + q.parts.map(function (p) {
        return "<li>" + esc(p) + "</li>";
      }).join("") + "</ol>";
    }
    if (q.include) html += '<p class="q-include">' + esc(q.include) + "</p>";
    return html;
  }

  // Links to the topics a question belongs to. Topics that are not written yet are shown as plain text.
  function topicLinks(q) {
    var links = q.topics
      .map(function (id) {
        var t = D.topicById(id);
        if (!t) return "";
        var label = t.id + " " + esc(t.title);
        return D.isPublished(t) ? '<a href="' + url(D.topicHref(t)) + '">' + label + "</a>" : "<span>" + label + "</span>";
      })
      .filter(Boolean);
    return '<p class="q-topics"><span class="q-topics-label">' + (links.length > 1 ? "Topics" : "Topic") + ":</span> " + links.join(", ") + "</p>";
  }

  function item(q, bank) {
    var num = bank ? '<span class="q-num">' + number(q) + "</span>" : "";
    var tags = '<span class="badge badge-marks">' + q.marks + " marks</span>" + (bank ? "" : sourceBadges(q));
    var head = num + '<span class="q-text">' + esc(q.question) + "</span>" + '<span class="q-tags">' + tags + "</span>";
    var extra = details(q);
    if (q.answer) {
      return (
        '<details class="accordion q-item" id="q-' + q.id + '" data-part="' + q.part + '"><summary>' + head + "</summary>" +
        '<div class="accordion-body">' + extra + '<p class="q-label">Sample answer</p>' + q.answer + (bank ? topicLinks(q) : "") + "</div></details>"
      );
    }
    var more = q.outline
      ? '<a href="' + url(q.outline.href) + '">' + esc(q.outline.text) + "</a>"
      : '<span class="muted">An answer outline is coming soon.</span>';
    return (
      '<div class="q-item q-plain" id="q-' + q.id + '" data-part="' + q.part + '"><div class="q-head">' + head + "</div>" +
      extra + (bank ? topicLinks(q) : "") + '<p class="q-more">' + more + "</p></div>"
    );
  }

  function byNumber(a, b) {
    var na = Number(a.id.split("-")[1].slice(1));
    var nb = Number(b.id.split("-")[1].slice(1));
    return na - nb;
  }

  // Part filter for a unit question bank: all questions, 2-mark only or 16-mark only.
  function toolbar() {
    var options = [
      ["all", "All questions"],
      ["A", "2-mark (Part A)"],
      ["B", "16-mark (Part B)"]
    ];
    return (
      '<div class="q-toolbar no-print">' +
      '<div class="seg" role="group" aria-label="Show questions">' +
      options.map(function (o, i) {
        return '<button type="button" class="seg-btn" data-filter="' + o[0] + '" aria-pressed="' + (i === 0 ? "true" : "false") + '">' + o[1] + "</button>";
      }).join("") +
      "</div>" +
      '<button type="button" class="btn" data-print>' + D.icon("printer") + "Print with answers</button>" +
      "</div>"
    );
  }

  function render(box) {
    var topic = box.getAttribute("data-topic");
    var unit = Number(box.getAttribute("data-unit")) || null;
    var bank = box.hasAttribute("data-bank");
    var items = (D.questions || []).filter(function (q) {
      if (topic) return q.topics.indexOf(topic) !== -1;
      if (unit) return q.unit === unit;
      return true;
    });
    if (!items.length) {
      box.innerHTML = '<p class="muted">No questions from the question banks are mapped to this topic yet.</p>';
      return;
    }
    var two = items.filter(function (q) {
      return q.marks === 2;
    });
    var big = items.filter(function (q) {
      return q.marks !== 2;
    });
    if (bank) {
      two.sort(byNumber);
      big.sort(byNumber);
    }
    var draw = function (q) {
      return item(q, bank);
    };
    var html = bank ? toolbar() : "";
    if (two.length) {
      html +=
        '<div class="q-group" data-group="A"><div class="q-group-head"><h' + (bank ? 2 : 3) + ">2-mark questions" + (bank ? " (Part A)" : "") + "</h" + (bank ? 2 : 3) + ">" +
        '<button type="button" class="btn q-toggle no-print" data-show-all aria-pressed="false">Show all answers</button></div>' +
        two.map(draw).join("") + "</div>";
    }
    if (big.length) {
      html +=
        '<div class="q-group" data-group="B"><div class="q-group-head"><h' + (bank ? 2 : 3) + ">16-mark questions" + (bank ? " (Part B)" : "") + "</h" + (bank ? 2 : 3) + "></div>" +
        big.map(draw).join("") + "</div>";
    }
    box.innerHTML = html;

    var toggle = box.querySelector("[data-show-all]");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var open = toggle.getAttribute("aria-pressed") !== "true";
        box.querySelectorAll("details.q-item").forEach(function (d) {
          d.open = open;
        });
        toggle.setAttribute("aria-pressed", open ? "true" : "false");
        toggle.textContent = open ? "Hide all answers" : "Show all answers";
      });
    }

    box.querySelectorAll("[data-filter]").forEach(function (btn, i, all) {
      btn.addEventListener("click", function () {
        var part = btn.getAttribute("data-filter");
        all.forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        box.querySelectorAll("[data-group]").forEach(function (g) {
          g.hidden = part !== "all" && g.getAttribute("data-group") !== part;
        });
      });
    });

    var print = box.querySelector("[data-print]");
    if (print) {
      print.addEventListener("click", function () {
        window.print();
      });
    }

    // Open an answer when the page is opened at its link, for example #q-u4-a7.
    if (location.hash && /^#q-/.test(location.hash)) {
      var target = document.getElementById(location.hash.slice(1));
      if (target && target.tagName === "DETAILS") target.open = true;
    }
  }

  // Cards for the hub page: one per unit, with its question counts.
  function renderUnits(box) {
    box.innerHTML = (D.units || [])
      .map(function (u) {
        var qs = (D.questions || []).filter(function (q) {
          return q.unit === u.n;
        });
        var a = qs.filter(function (q) {
          return q.part === "A";
        }).length;
        var b = qs.length - a;
        return (
          '<a class="card unit-card u-' + u.n + '" href="' + url("question-bank/" + u.slug + ".html") + '">' +
          '<span class="unit-label">Unit ' + u.roman + "</span>" +
          "<h3>" + esc(u.title) + "</h3>" +
          '<div class="card-foot"><span class="badge badge-marks">' + a + " two-mark</span>" +
          '<span class="badge">' + b + " sixteen-mark</span></div></a>"
        );
      })
      .join("");
  }

  // Print every answer, then close the ones the student had closed.
  var closed = [];
  window.addEventListener("beforeprint", function () {
    closed = Array.prototype.filter.call(document.querySelectorAll("details.q-item"), function (d) {
      return !d.open;
    });
    closed.forEach(function (d) {
      d.open = true;
    });
  });
  window.addEventListener("afterprint", function () {
    closed.forEach(function (d) {
      d.open = false;
    });
    closed = [];
  });

  document.querySelectorAll("[data-questions]").forEach(render);
  document.querySelectorAll("[data-question-units]").forEach(renderUnits);
})();
