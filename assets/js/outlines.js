/* 16-mark answer outlines.
   On a unit outline page: <div data-outlines data-unit="1"></div>
   On the hub page:        <div data-outline-units></div>
   The questions come from data/questions/unit-N.js and the outlines from
   data/outlines/unit-N.js, so the wording is never copied by hand.

   An outline is { aim, sections: [{ title, pages, see, points, draw, table, example }] }.
   pages is the suggested length of that part in A4 pages. see lists topic sections
   as "1.2#levels". draw, table and example are optional lists. */
(function () {
  "use strict";
  var D = window.DBMS || {};
  var esc = D.esc;
  var url = D.url;

  // 0.25 -> "a quarter of a page", 0.5 -> "half a page", 1.25 -> "1¼ pages"
  var FRACTIONS = { 0.25: "¼", 0.5: "½", 0.75: "¾" };
  function space(p) {
    if (p === 0.25) return "a quarter of a page";
    if (p === 0.5) return "half a page";
    var whole = Math.floor(p);
    var part = FRACTIONS[p - whole] || "";
    return (whole || "") + part + (p > 1 ? " pages" : " page");
  }

  function total(o) {
    return o.sections.reduce(function (n, s) {
      return n + (s.pages || 0);
    }, 0);
  }

  function number(q) {
    return q.id.split("-")[1].toUpperCase();
  }

  // "1.2#levels" -> a link to that section of the topic page.
  function seeLink(ref) {
    var parts = ref.split("#");
    var t = D.topicById(parts[0]);
    if (!t) return "";
    var label = t.id + " " + esc(t.title);
    if (!D.isPublished(t)) return "<span>" + label + "</span>";
    return '<a href="' + url(D.topicHref(t)) + (parts[1] ? "#" + parts[1] : "") + '">' + label + "</a>";
  }

  function unique(list) {
    return list.filter(function (x, i) {
      return list.indexOf(x) === i;
    });
  }

  function list(items) {
    return "<ul>" + items.map(function (x) {
      return "<li>" + x + "</li>";
    }).join("") + "</ul>";
  }

  // Draw, Table and Example notes under a section.
  var EXTRAS = [
    ["draw", "Draw", "diagram"],
    ["table", "Table", "table"],
    ["example", "Example", "example"]
  ];

  function extras(s) {
    var html = "";
    EXTRAS.forEach(function (x) {
      var items = s[x[0]];
      if (!items || !items.length) return;
      html += '<div class="ol-extra ol-' + x[0] + '"><p class="ol-extra-label">' + x[1] + "</p>" + list(items) + "</div>";
    });
    return html;
  }

  function plan(o) {
    var rows = o.sections.map(function (s, i) {
      var needs = EXTRAS.filter(function (x) {
        return s[x[0]] && s[x[0]].length;
      }).map(function (x) {
        return '<span class="badge ol-tag ol-tag-' + x[0] + '">' + x[2] + "</span>";
      }).join(" ");
      return "<tr><td>" + (i + 1) + ". " + esc(s.title) + "</td><td>" + space(s.pages) + "</td><td>" + (needs || '<span class="muted">text</span>') + "</td></tr>";
    }).join("");
    return (
      '<div class="table-wrap"><table class="ol-plan"><caption>Space plan for about ' + space(total(o)) + " of writing</caption>" +
      '<thead><tr><th scope="col">Part of the answer</th><th scope="col">Length</th><th scope="col">Must include</th></tr></thead>' +
      "<tbody>" + rows + "</tbody></table></div>"
    );
  }

  function section(s, i) {
    var see = (s.see || []).map(seeLink).filter(Boolean);
    return (
      '<li class="ol-section"><h3><span class="ol-sec-num">' + (i + 1) + ".</span> " + esc(s.title) +
      ' <span class="ol-space">about ' + space(s.pages) + "</span></h3>" +
      list(s.points) + extras(s) +
      (see.length ? '<p class="ol-see">Read: ' + unique(see).join(", ") + "</p>" : "") +
      "</li>"
    );
  }

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

  function outline(q, o) {
    var topics = q.topics.map(seeLink).filter(Boolean);
    return (
      '<article class="ol-item" id="' + q.id + '">' +
      '<header class="ol-head"><span class="q-num">' + number(q) + '</span><h2 class="ol-question">' + esc(q.question) + "</h2>" +
      '<span class="q-tags"><span class="badge badge-marks">16 marks</span><span class="badge">Write about 5 pages</span></span></header>' +
      details(q) +
      '<p class="ol-warn"><strong>Outline only.</strong> Do not copy these points as your answer. Write each one as full sentences in your own words, using the topic pages, your notes and the textbook. Aim for at least 5 A4 pages with the diagrams, tables and examples marked below.</p>' +
      '<p class="ol-aim"><span class="ol-aim-label">What the examiner looks for:</span> ' + o.aim + "</p>" +
      '<p class="ol-see ol-read-first"><span class="ol-aim-label">Study these topics first:</span> ' + topics.join(", ") + "</p>" +
      plan(o) +
      '<ol class="ol-sections">' + o.sections.map(section).join("") + "</ol>" +
      '<p class="ol-back no-print"><a href="#outline-list">Back to the list of questions</a></p>' +
      "</article>"
    );
  }

  function soon(q) {
    return (
      '<article class="ol-item ol-soon" id="' + q.id + '">' +
      '<header class="ol-head"><span class="q-num">' + number(q) + '</span><h2 class="ol-question">' + esc(q.question) + "</h2>" +
      '<span class="q-tags"><span class="badge badge-soon">Outline coming soon</span></span></header>' + details(q) + "</article>"
    );
  }

  function byNumber(a, b) {
    return Number(a.id.split("-")[1].slice(1)) - Number(b.id.split("-")[1].slice(1));
  }

  function partB(n) {
    return (D.questions || []).filter(function (q) {
      return q.unit === n && q.part === "B";
    }).sort(byNumber);
  }

  function render(box) {
    var n = Number(box.getAttribute("data-unit"));
    var qs = partB(n);
    var outlines = D.outlines || {};
    var contents =
      '<nav class="ol-contents" id="outline-list" aria-labelledby="outline-list-title"><h2 id="outline-list-title">Questions in this unit</h2><ol>' +
      qs.map(function (q) {
        var ready = outlines[q.id];
        return "<li><a href=\"#" + q.id + '"><span class="q-num">' + number(q) + "</span>" + esc(q.question) + "</a>" +
          (ready ? "" : ' <span class="badge badge-soon">Coming soon</span>') + "</li>";
      }).join("") +
      "</ol></nav>";
    box.innerHTML = contents + qs.map(function (q) {
      return outlines[q.id] ? outline(q, outlines[q.id]) : soon(q);
    }).join("");

    if (location.hash) {
      var target = document.getElementById(location.hash.slice(1));
      if (target) target.scrollIntoView();
    }
  }

  // Cards for the hub page: one per unit, with how many outlines are ready.
  function renderUnits(box) {
    var outlines = D.outlines || {};
    box.innerHTML = (D.units || []).map(function (u) {
      var qs = partB(u.n);
      var ready = qs.filter(function (q) {
        return outlines[q.id];
      }).length;
      var badge = ready
        ? '<span class="badge badge-unit">' + ready + (ready < qs.length ? " of " + qs.length : "") + " outlines</span>"
        : '<span class="badge badge-soon">Coming soon</span>';
      return (
        '<a class="card unit-card u-' + u.n + '" href="' + url("outlines/" + u.slug + ".html") + '">' +
        '<span class="unit-label">Unit ' + u.roman + "</span>" +
        "<h3>" + esc(u.title) + "</h3>" +
        '<div class="card-foot">' + badge + "</div></a>"
      );
    }).join("");
  }

  document.querySelectorAll("[data-outlines]").forEach(render);
  document.querySelectorAll("[data-outline-units]").forEach(renderUnits);
  document.querySelectorAll("[data-print]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      window.print();
    });
  });
})();
