/* Draws question bank items from DBMS.questions.
   Use <div data-questions data-topic="4.6"></div> on a topic page.
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

  function item(q) {
    var head =
      '<span class="q-text">' + esc(q.question) + "</span>" +
      '<span class="q-tags"><span class="badge badge-marks">' + q.marks + " marks</span>" + sourceBadges(q) + "</span>";
    if (q.answer) {
      return (
        '<details class="accordion q-item" id="q-' + q.id + '"><summary>' + head + "</summary>" +
        '<div class="accordion-body"><p class="q-label">Sample answer</p>' + q.answer + "</div></details>"
      );
    }
    var more = q.outline
      ? '<a href="' + url(q.outline.href) + '">' + esc(q.outline.text) + "</a>"
      : '<span class="muted">An answer outline is coming soon.</span>';
    return '<div class="q-item q-plain" id="q-' + q.id + '"><div class="q-head">' + head + '</div><p class="q-more">' + more + "</p></div>";
  }

  function render(box) {
    var topic = box.getAttribute("data-topic");
    var unit = Number(box.getAttribute("data-unit")) || null;
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
    var html = "";
    if (two.length) {
      html +=
        '<div class="q-group"><div class="q-group-head"><h3>2-mark questions</h3>' +
        '<button type="button" class="btn q-toggle" data-show-all aria-pressed="false">Show all answers</button></div>' +
        two.map(item).join("") + "</div>";
    }
    if (big.length) {
      html += '<div class="q-group"><div class="q-group-head"><h3>16-mark questions</h3></div>' + big.map(item).join("") + "</div>";
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
    // Open an answer when the page is opened at its link, for example #q-u4-a7.
    if (location.hash && /^#q-/.test(location.hash)) {
      var target = document.getElementById(location.hash.slice(1));
      if (target && target.tagName === "DETAILS") target.open = true;
    }
  }

  document.querySelectorAll("[data-questions]").forEach(render);
})();
