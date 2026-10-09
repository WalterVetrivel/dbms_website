/* Shared layout for every page: header, sidebar, breadcrumbs, footer, search,
   theme toggle, progress tracking and small page enhancements.
   Each page sets data-root (path back to the site root) and data-page on <body>. */
(function () {
  "use strict";

  var D = (window.DBMS = window.DBMS || {});
  var body = document.body;
  var ROOT = body.getAttribute("data-root") || "";
  var PAGE = body.getAttribute("data-page") || "";
  var UNIT = Number(body.getAttribute("data-unit")) || 0;
  var TOPIC = body.getAttribute("data-topic") || "";
  var units = D.units || [];
  var topics = D.topics || [];
  var pages = D.pages || [];
  var labs = D.labs || [];
  var LAB = Number(body.getAttribute("data-lab")) || 0;

  /* ---------- Helpers ---------- */

  function url(path) {
    return ROOT + path;
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function isPublished(item) {
    return item && item.status === "published";
  }

  function unitHref(u) {
    return "units/" + u.slug + "/index.html";
  }

  function topicHref(t) {
    var u = unitByNumber(t.unit);
    return "units/" + u.slug + "/" + t.slug + ".html";
  }

  function labHref(l) {
    return "labs/" + l.slug + ".html";
  }

  function labByNumber(n) {
    for (var i = 0; i < labs.length; i++) {
      if (labs[i].n === n) return labs[i];
    }
    return null;
  }

  function unitByNumber(n) {
    for (var i = 0; i < units.length; i++) {
      if (units[i].n === n) return units[i];
    }
    return null;
  }

  function topicById(id) {
    for (var i = 0; i < topics.length; i++) {
      if (topics[i].id === id) return topics[i];
    }
    return null;
  }

  function topicsOf(n) {
    return topics.filter(function (t) {
      return t.unit === n;
    });
  }

  function pageById(id) {
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].id === id) return pages[i];
    }
    return null;
  }

  // A unit's question bank, 16-mark outlines, quiz and revision sheet. live is false until that page is published.
  function unitExtras(u) {
    return [
      { id: "question-bank", title: "Question bank", icon: "file-question" },
      { id: "outlines", title: "16-mark outlines", icon: "file-text" },
      { id: "diagrams", title: "Diagrams and examples", icon: "shapes" },
      { id: "quizzes", title: "Quiz", icon: "list-checks" },
      { id: "revision", title: "Revision sheet", icon: "layers" }
    ].map(function (x) {
      var p = pageById(x.id);
      // Each hub has one page per unit next to it, for example quizzes/unit-2.html.
      x.href = p && p.href.replace(/index\.html$/, u.slug + ".html");
      x.live = isPublished(p);
      return x;
    });
  }

  // Icons are inline SVG paths from the Lucide icon set (ISC license).
  var ICONS = {
    menu: '<path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>',
    search: '<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    moon: '<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    "chevron-up": '<path d="m18 15-6-6-6 6"/>',
    "chevron-right": '<path d="m9 18 6-6-6-6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    "list": '<path d="M3 5h.01"/><path d="M3 12h.01"/><path d="M3 19h.01"/><path d="M8 5h13"/><path d="M8 12h13"/><path d="M8 19h13"/>',
    "external-link": '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    "book-open": '<path d="M12 5v16"/><path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"/>',
    flask: '<path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"/><path d="M6.453 15h11.094"/><path d="M8.5 2h7"/>',
    shapes: '<path d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z"/><rect x="3" y="14" width="7" height="7" rx="1"/><circle cx="17.5" cy="17.5" r="3.5"/>',
    "list-checks": '<path d="M13 5h8"/><path d="M13 12h8"/><path d="M13 19h8"/><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/>',
    "graduation-cap": '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
    "file-question": '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M12 17h.01"/><path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3"/>',
    "file-text": '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    printer: '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
    layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>'
  };

  function icon(name, cls) {
    return '<svg class="icon' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (ICONS[name] || "") + "</svg>";
  }
  D.icon = icon;
  D.url = url;
  D.esc = esc;
  D.topicById = function (id) {
    return topicById(id);
  };
  D.topicHref = topicHref;
  D.isPublished = isPublished;

  var BRAND_MARK =
    '<svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">' +
    '<rect width="32" height="32" rx="8" fill="var(--primary)"/>' +
    '<g fill="none" stroke="var(--on-primary)" stroke-width="2">' +
    '<ellipse cx="16" cy="9.5" rx="7.5" ry="3"/>' +
    '<path d="M8.5 9.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6"/>' +
    '<path d="M8.5 15.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6"/></g></svg>';

  /* ---------- Storage (never required: the site works without it) ---------- */

  var store = {
    get: function (key, fallback) {
      try {
        var v = window.localStorage.getItem(key);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) {
        return fallback;
      }
    },
    set: function (key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        /* storage blocked: ignore */
      }
    },
    remove: function (key) {
      try {
        window.localStorage.removeItem(key);
      } catch (e) {
        /* ignore */
      }
    }
  };
  D.store = store;

  var PROGRESS_KEY = "dbms-progress";

  D.progress = {
    data: function () {
      var p = store.get(PROGRESS_KEY, null);
      if (!p || typeof p !== "object") p = {};
      p.done = p.done || {};
      p.quiz = p.quiz || {};
      return p;
    },
    isDone: function (id) {
      return !!this.data().done[id];
    },
    setDone: function (id, value) {
      var p = this.data();
      if (value) p.done[id] = true;
      else delete p.done[id];
      store.set(PROGRESS_KEY, p);
    },
    doneCount: function (unitNumber) {
      var p = this.data();
      return topicsOf(unitNumber).filter(function (t) {
        return isPublished(t) && p.done[t.id];
      }).length;
    },
    setLast: function (href, title) {
      var p = this.data();
      p.last = { href: href, title: title };
      store.set(PROGRESS_KEY, p);
    },
    last: function () {
      return this.data().last || null;
    },
    setScore: function (id, score, total) {
      var p = this.data();
      var best = p.quiz[id];
      if (!best || score / total > best.score / best.total) {
        p.quiz[id] = { score: score, total: total };
        store.set(PROGRESS_KEY, p);
      }
    },
    bestScore: function (id) {
      return this.data().quiz[id] || null;
    },
    reset: function () {
      store.remove(PROGRESS_KEY);
    }
  };

  /* ---------- Theme ---------- */

  function currentTheme() {
    var set = document.documentElement.getAttribute("data-theme");
    if (set) return set;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function updateThemeButton(btn) {
    var dark = currentTheme() === "dark";
    btn.innerHTML = icon(dark ? "sun" : "moon");
    btn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    btn.setAttribute("title", dark ? "Light theme" : "Dark theme");
  }

  /* ---------- Header ---------- */

  function renderHeader() {
    var header = document.getElementById("site-header");
    if (!header) return;
    var links = pages
      .filter(function (p) {
        return p.nav && isPublished(p);
      })
      .map(function (p) {
        var current = p.id === PAGE ? ' aria-current="page"' : p.id === "labs" && PAGE === "lab" ? ' aria-current="true"' : "";
        return '<a href="' + url(p.href) + '"' + current + ">" + esc(p.navTitle || p.title) + "</a>";
      })
      .join("");

    header.innerHTML =
      '<div class="header-inner">' +
      '<button type="button" class="icon-btn menu-btn" aria-label="Open menu" aria-controls="sidebar" aria-expanded="false">' + icon("menu") + "</button>" +
      '<a class="brand" href="' + url("index.html") + '">' + BRAND_MARK + "<span>DBMS <span class=\"brand-sub\">Study Guide</span></span></a>" +
      '<nav class="top-nav" aria-label="Main">' + links + "</nav>" +
      '<div class="header-actions">' +
      '<button type="button" class="icon-btn search-btn" aria-haspopup="dialog">' + icon("search") + '<span class="search-label">Search</span> <kbd>Ctrl K</kbd><span class="visually-hidden">Search the site</span></button>' +
      '<button type="button" class="icon-btn theme-btn"></button>' +
      "</div></div>";

    var themeBtn = header.querySelector(".theme-btn");
    updateThemeButton(themeBtn);
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      store.set("dbms-theme", next);
      updateThemeButton(themeBtn);
    });

    header.querySelector(".search-btn").addEventListener("click", openSearch);
    header.querySelector(".menu-btn").addEventListener("click", function () {
      toggleSidebar(true);
    });
  }

  /* ---------- Sidebar ---------- */

  var sidebar, backdrop;

  function renderSidebar() {
    var frame = document.querySelector(".page");
    if (!frame) return;
    sidebar = document.createElement("aside");
    sidebar.className = "sidebar";
    sidebar.id = "sidebar";
    sidebar.setAttribute("aria-label", "Site menu");

    var siteLinks = pages
      .filter(function (p) {
        return p.nav && isPublished(p);
      })
      .map(function (p) {
        var current = p.id === PAGE ? ' aria-current="page"' : "";
        return '<li><a href="' + url(p.href) + '"' + current + ">" + esc(p.title) + "</a></li>";
      })
      .join("");

    var progress = D.progress.data();
    var unitGroups = units
      .map(function (u) {
        var open = u.n === UNIT ? " open" : "";
        var current = PAGE === "unit" && u.n === UNIT && !TOPIC ? ' aria-current="page"' : "";
        var items = '<li><a href="' + url(unitHref(u)) + '"' + current + ">Unit overview</a></li>";
        var published = topicsOf(u.n).filter(isPublished);
        published.forEach(function (t) {
          var cur = t.id === TOPIC ? ' aria-current="page"' : "";
          var tick = progress.done[t.id] ? '<span class="side-tick" title="Marked as done">' + icon("check") + '<span class="visually-hidden">(done)</span></span>' : "";
          items += '<li><a href="' + url(topicHref(t)) + '"' + cur + '><span class="side-num">' + t.id + "</span><span>" + esc(t.title) + "</span>" + tick + "</a></li>";
        });
        if (!published.length) {
          items += '<li class="side-note">Topics for this unit are coming soon.</li>';
        }
        unitExtras(u)
          .filter(function (x) {
            return x.live;
          })
          .forEach(function (x, i) {
            var cur = PAGE === x.id && u.n === UNIT ? ' aria-current="page"' : "";
            items += '<li class="side-extra' + (i === 0 ? " is-first" : "") + '"><a href="' + url(x.href) + '"' + cur + ">" + icon(x.icon, "side-icon") + "<span>" + esc(x.title) + "</span></a></li>";
          });
        return (
          '<details class="side-unit u-' + u.n + '"' + open + ">" +
          '<summary><span class="unit-dot"></span><span>Unit ' + u.roman + ": " + esc(u.title) + "</span>" + icon("chevron-down", "chev") + "</summary>" +
          "<ul>" + items + "</ul></details>"
        );
      })
      .join("");

    var labGroup = "";
    var labsPage = pageById("labs");
    if (labs.length && labsPage && isPublished(labsPage)) {
      var labItems = '<li><a href="' + url(labsPage.href) + '"' + (PAGE === "labs" ? ' aria-current="page"' : "") + ">Labs overview</a></li>";
      labs.forEach(function (l) {
        var cur = PAGE === "lab" && l.n === LAB ? ' aria-current="page"' : "";
        labItems += '<li><a href="' + url(labHref(l)) + '"' + cur + '><span class="side-num">' + l.n + "</span><span>" + esc(l.short) + "</span></a></li>";
      });
      labGroup =
        '<nav aria-label="Lab exercises"><div class="sidebar-title">Labs</div>' +
        '<details class="side-unit side-labs"' + (PAGE === "labs" || PAGE === "lab" ? " open" : "") + ">" +
        '<summary><span class="unit-dot"></span><span>Lab exercises</span>' + icon("chevron-down", "chev") + "</summary>" +
        "<ul>" + labItems + "</ul></details></nav>";
    }

    sidebar.innerHTML =
      '<div class="sidebar-head"><span class="sidebar-title">Menu</span>' +
      '<button type="button" class="icon-btn close-btn" aria-label="Close menu">' + icon("x") + "</button></div>" +
      '<nav aria-label="Site pages" class="side-links"><ul>' + siteLinks + "</ul></nav>" +
      '<nav aria-label="Units and topics"><div class="sidebar-title">Units</div>' + unitGroups + "</nav>" + labGroup;

    frame.insertBefore(sidebar, frame.firstChild);
    sidebar.querySelector(".close-btn").addEventListener("click", function () {
      toggleSidebar(false);
    });
  }

  function isDrawer() {
    return !(body.getAttribute("data-sidebar") === "static" && window.matchMedia("(min-width: 1024px)").matches);
  }

  function toggleSidebar(open) {
    if (!sidebar) return;
    var btn = document.querySelector(".menu-btn");
    if (open) {
      sidebar.classList.add("is-open");
      backdrop = document.createElement("div");
      backdrop.className = "sidebar-backdrop";
      backdrop.addEventListener("click", function () {
        toggleSidebar(false);
      });
      document.body.appendChild(backdrop);
      if (btn) btn.setAttribute("aria-expanded", "true");
      var first = sidebar.querySelector("a, button");
      if (first) first.focus();
    } else {
      sidebar.classList.remove("is-open");
      if (backdrop) backdrop.remove();
      backdrop = null;
      if (btn) {
        btn.setAttribute("aria-expanded", "false");
        btn.focus();
      }
    }
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sidebar && sidebar.classList.contains("is-open") && isDrawer()) {
      toggleSidebar(false);
    }
  });

  /* ---------- Breadcrumbs ---------- */

  function renderBreadcrumbs() {
    var el = document.getElementById("breadcrumbs");
    if (!el) return;
    var crumbs = ['<li><a href="' + url("index.html") + '">Home</a></li>'];
    var u = unitByNumber(UNIT);
    var t = topicById(TOPIC);
    var hub = pageById(PAGE);
    var lab = PAGE === "lab" ? labByNumber(LAB) : null;
    if (lab) {
      // A lab exercise: Home / Labs / Exercise 4
      var labsHub = pageById("labs");
      crumbs.push('<li><a href="' + url(labsHub.href) + '">' + esc(labsHub.title) + "</a></li>");
      crumbs.push('<li aria-current="page">Exercise ' + lab.n + "</li>");
    } else if (u && hub && ["question-bank", "outlines", "diagrams", "quizzes", "revision"].indexOf(PAGE) !== -1) {
      // A unit page of a hub, for example Home / Question Banks / Unit IV
      crumbs.push('<li><a href="' + url(hub.href) + '">' + esc(hub.title) + "</a></li>");
      crumbs.push('<li aria-current="page">Unit ' + u.roman + "</li>");
    } else if (u && t) {
      crumbs.push('<li><a href="' + url(unitHref(u)) + '">Unit ' + u.roman + "</a></li>");
      crumbs.push('<li aria-current="page">' + esc(t.title) + "</li>");
    } else if (u) {
      crumbs.push('<li aria-current="page">Unit ' + u.roman + "</li>");
    } else {
      var p = pageById(PAGE);
      if (p && p.id !== "home") crumbs.push('<li aria-current="page">' + esc(p.title) + "</li>");
    }
    el.innerHTML = '<ol>' + crumbs.join("") + "</ol>";
    el.setAttribute("aria-label", "Breadcrumb");
  }

  /* ---------- Footer ---------- */

  function renderFooter() {
    var footer = document.getElementById("site-footer");
    if (!footer) return;
    var site = D.site || {};
    var c = site.credit || {};
    var lic = site.license || {};
    var links = pages
      .filter(function (p) {
        return isPublished(p);
      })
      .map(function (p) {
        return '<a href="' + url(p.href) + '">' + esc(p.title) + "</a>";
      })
      .join("");
    footer.innerHTML =
      '<div class="footer-inner">' +
      '<a class="kiot-banner" href="' + esc(c.institutionUrl) + '" target="_blank" rel="noopener">' +
      '<img src="' + url("assets/img/kiot-title.png") + '" alt="' + esc(c.institution) + '" width="2201" height="398" loading="lazy"></a>' +
      '<p class="credit">Created by <strong>' + esc(c.name) + "</strong>, " + esc(c.role) + ', <a href="' + esc(c.institutionUrl) + '" target="_blank" rel="noopener">' + esc(c.institution) + '</a>, using <a href="https://www.anthropic.com/claude" target="_blank" rel="noopener">Claude</a>.</p>' +
      '<p class="ai-note"><strong>AI notice:</strong> The content on this site was generated by AI, based on human-written notes and textbooks. Check important facts with your textbook. <a href="' + url("about.html#ai-notice") + '">Learn more</a></p>' +
      '<nav class="footer-links" aria-label="Footer">' + links + "</nav>" +
      '<p class="license">Content is shared under the <a href="' + esc(lic.url) + '" target="_blank" rel="noopener license">' + esc(lic.name) + "</a> license.</p>" +
      "</div>";
  }

  /* ---------- Search ---------- */

  var dialog, input, results, activeIndex = -1, searchIndex = null;

  function buildIndex() {
    var items = [];
    units.forEach(function (u) {
      items.push({ kind: "Unit", title: "Unit " + u.roman + ": " + u.title, sub: u.objective, href: unitHref(u), text: u.objective });
    });
    topics.forEach(function (t) {
      var u = unitByNumber(t.unit);
      var live = isPublished(t);
      items.push({
        kind: "Topic",
        title: t.id + " " + t.title,
        sub: (live ? "" : "Coming soon. ") + "Unit " + u.roman + ": " + t.covers,
        href: live ? topicHref(t) : unitHref(u),
        text: t.covers
      });
    });
    pages.forEach(function (p) {
      if (isPublished(p) && p.id !== "home") items.push({ kind: "Page", title: p.title, sub: p.summary || "", href: p.href, text: p.summary || "" });
    });
    units.forEach(function (u) {
      unitExtras(u).forEach(function (x) {
        if (x.live) items.push({ kind: "Page", title: "Unit " + u.roman + " " + x.title.toLowerCase(), sub: "Unit " + u.roman + ": " + u.title, href: x.href, text: u.title });
      });
    });
    var labsPage = pageById("labs");
    if (labsPage && isPublished(labsPage)) {
      labs.forEach(function (l) {
        items.push({ kind: "Lab", title: "Exercise " + l.n + ": " + l.short, sub: l.title, href: labHref(l), text: l.title + " " + l.summary });
      });
    }
    (D.searchExtras || []).forEach(function (x) {
      items.push(x);
    });
    items.forEach(function (it) {
      it.titleLower = it.title.toLowerCase();
      it.hay = (it.title + " " + (it.text || "") + " " + (it.sub || "")).toLowerCase();
    });
    return items;
  }

  function search(query) {
    if (!searchIndex) searchIndex = buildIndex();
    var tokens = query.toLowerCase().split(/[^a-z0-9+]+/).filter(Boolean);
    if (!tokens.length) return [];
    var scored = [];
    searchIndex.forEach(function (it) {
      var score = 0;
      for (var i = 0; i < tokens.length; i++) {
        var tok = tokens[i];
        var titleWords = it.titleLower.split(/[^a-z0-9+]+/);
        if (titleWords.indexOf(tok) !== -1) score += 4;
        else if (titleWords.some(function (w) { return w.indexOf(tok) === 0; })) score += 3;
        else if (it.hay.indexOf(tok) !== -1) score += 1;
        else return;
      }
      if (it.kind === "Topic" && it.href.indexOf(".html") !== -1 && it.href.indexOf("index.html") === -1) score += 0.5;
      scored.push({ it: it, score: score });
    });
    scored.sort(function (a, b) {
      return b.score - a.score;
    });
    return scored.slice(0, 12).map(function (s) {
      return s.it;
    });
  }

  function renderResults() {
    var q = input.value.trim();
    var found = search(q);
    activeIndex = found.length ? 0 : -1;
    if (!q) {
      results.innerHTML = '<li><span class="search-empty muted">Type a topic, for example <strong>normal form</strong> or <strong>B+ tree</strong>.</span></li>';
      return;
    }
    if (!found.length) {
      results.innerHTML = '<li><span class="search-empty muted">No results for <strong>' + esc(q) + "</strong>. Try a shorter word.</span></li>";
      return;
    }
    results.innerHTML = found
      .map(function (it, i) {
        return (
          '<li><a id="sr-' + i + '" role="option" href="' + url(it.href) + '"' + (i === 0 ? ' aria-selected="true"' : "") + ">" +
          '<span class="badge result-kind">' + esc(it.kind) + "</span>" + esc(it.title) +
          (it.sub ? "<small>" + esc(it.sub) + "</small>" : "") + "</a></li>"
        );
      })
      .join("");
  }

  function moveActive(step) {
    var links = results.querySelectorAll("a");
    if (!links.length) return;
    if (activeIndex >= 0) links[activeIndex].removeAttribute("aria-selected");
    activeIndex = (activeIndex + step + links.length) % links.length;
    links[activeIndex].setAttribute("aria-selected", "true");
    links[activeIndex].scrollIntoView({ block: "nearest" });
    input.setAttribute("aria-activedescendant", links[activeIndex].id);
  }

  function createSearch() {
    dialog = document.createElement("dialog");
    dialog.className = "search-dialog";
    dialog.setAttribute("aria-label", "Search");
    dialog.innerHTML =
      '<form method="dialog" class="search-box" role="search">' + icon("search") +
      '<input type="search" placeholder="Search topics and pages" aria-label="Search topics and pages" autocomplete="off" role="combobox" aria-expanded="true" aria-controls="search-results">' +
      '<button class="icon-btn" value="close" aria-label="Close search">' + icon("x") + "</button></form>" +
      '<ul id="search-results" class="search-results" role="listbox" aria-label="Search results"></ul>' +
      '<p class="search-hint">Use the arrow keys to move, Enter to open and Esc to close.</p>';
    document.body.appendChild(dialog);
    input = dialog.querySelector("input");
    results = dialog.querySelector(".search-results");
    input.addEventListener("input", renderResults);
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveActive(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        moveActive(-1);
      } else if (e.key === "Enter") {
        var links = results.querySelectorAll("a");
        if (activeIndex >= 0 && links[activeIndex]) {
          e.preventDefault();
          window.location.href = links[activeIndex].href;
        }
      }
    });
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) dialog.close();
    });
  }

  function openSearch() {
    if (!dialog) createSearch();
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    input.value = "";
    renderResults();
    input.focus();
  }
  D.openSearch = openSearch;

  document.addEventListener("keydown", function (e) {
    var tag = (e.target && e.target.tagName) || "";
    var typing = tag === "INPUT" || tag === "TEXTAREA" || (e.target && e.target.isContentEditable);
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openSearch();
    } else if (e.key === "/" && !typing) {
      e.preventDefault();
      openSearch();
    }
  });

  /* ---------- Home page ---------- */

  function renderHome() {
    var cards = document.getElementById("unit-cards");
    if (cards) {
      cards.innerHTML = units
        .map(function (u) {
          var list = topicsOf(u.n);
          var live = list.filter(isPublished).length;
          var done = D.progress.doneCount(u.n);
          var pct = live ? Math.round((done / live) * 100) : 0;
          var status = live ? live + " of " + list.length + " topics ready" : list.length + " topics, coming soon";
          return (
            '<a class="card unit-card u-' + u.n + '" href="' + url(unitHref(u)) + '">' +
            '<span class="unit-label">Unit ' + u.roman + "</span>" +
            "<h3>" + esc(u.title) + "</h3>" +
            "<p>" + esc(u.objective) + "</p>" +
            '<div class="card-foot"><span class="badge badge-unit">' + esc(status) + "</span>" +
            (live ? '<span class="badge">' + done + " done</span>" : "") +
            (live ? '<div class="progress-bar" aria-hidden="true"><span style="width:' + pct + '%"></span></div>' : "") +
            "</div></a>"
          );
        })
        .join("");
    }

    var quick = document.getElementById("quick-links");
    if (quick) {
      quick.innerHTML = pages
        .filter(function (p) {
          return p.icon;
        })
        .map(function (p) {
          var live = isPublished(p);
          var inner =
            '<span class="card-icon">' + icon(p.icon) + "</span>" +
            "<h3>" + esc(p.title) + "</h3><p class=\"muted\">" + esc(p.summary) + "</p>" +
            (live ? "" : '<span class="badge badge-soon">Coming soon</span>');
          return live
            ? '<a class="card" href="' + url(p.href) + '">' + inner + "</a>"
            : '<div class="card is-disabled">' + inner + "</div>";
        })
        .join("");
    }

    var cont = document.getElementById("continue");
    var last = D.progress.last();
    if (cont && last && last.href) {
      cont.hidden = false;
      cont.querySelector("a").setAttribute("href", url(last.href));
      cont.querySelector(".continue-title").textContent = last.title;
    }
  }

  /* ---------- Unit page ---------- */

  function renderUnit() {
    var u = unitByNumber(UNIT);
    var list = document.getElementById("topic-list");
    if (!u || !list) return;
    var progress = D.progress.data();
    list.innerHTML = topicsOf(u.n)
      .map(function (t) {
        var live = isPublished(t);
        var title = live ? '<a class="topic-title" href="' + url(topicHref(t)) + '">' + esc(t.title) + "</a>" : '<span class="topic-title">' + esc(t.title) + "</span>";
        var status = live
          ? progress.done[t.id]
            ? '<span class="badge badge-done">' + icon("check") + "Done</span>"
            : ""
          : '<span class="badge badge-soon">Coming soon</span>';
        var best = live && progress.quiz[t.id];
        if (best) status += '<span class="badge badge-level" title="Your best quiz score">Quiz ' + best.score + "/" + best.total + "</span>";
        return (
          '<li><span class="topic-num">' + t.id + "</span><div>" + title + "</div>" +
          '<div class="topic-meta"><span>' + esc(t.covers) + '</span><span class="badge badge-level" title="Bloom level from the syllabus">' + t.level + "</span>" + status + "</div></li>"
        );
      })
      .join("");

    var count = document.getElementById("topic-count");
    if (count) {
      var all = topicsOf(u.n);
      var live = all.filter(isPublished).length;
      count.textContent = all.length + " topics" + (live ? ", " + live + " ready" : "");
    }

    var more = document.getElementById("unit-more");
    if (more) {
      more.innerHTML = unitExtras(u)
        .map(function (x) {
          var title = "Unit " + u.roman + " " + x.title.toLowerCase();
          var best = x.id === "quizzes" && progress.quiz["unit-" + u.n];
          var inner =
            '<span class="card-icon">' + icon(x.icon) + "</span><h3>" + esc(title) + "</h3>" +
            (x.live ? "" : '<span class="badge badge-soon">Coming soon</span>') +
            (x.live && best ? '<span class="badge badge-done" title="Your best score">Best ' + best.score + "/" + best.total + "</span>" : "");
          return x.live ? '<a class="card" href="' + url(x.href) + '">' + inner + "</a>" : '<div class="card is-disabled">' + inner + "</div>";
        })
        .join("");
    }
  }

  /* ---------- Topic page ---------- */

  function renderTopic() {
    var t = topicById(TOPIC);
    if (!t) return;
    D.progress.setLast(topicHref(t), t.title);

    var pager = document.getElementById("pager");
    if (pager) {
      var live = topics.filter(isPublished);
      var i = live.indexOf(t);
      var prev = live[i - 1];
      var next = live[i + 1];
      pager.innerHTML =
        (prev ? '<a class="prev" href="' + url(topicHref(prev)) + '"><small>Previous</small>' + esc(prev.title) + "</a>" : "<span></span>") +
        (next ? '<a class="next" href="' + url(topicHref(next)) + '"><small>Next</small>' + esc(next.title) + "</a>" : "");
    }

    var doneBtn = document.getElementById("mark-done");
    if (doneBtn) {
      var sync = function () {
        var done = D.progress.isDone(t.id);
        doneBtn.setAttribute("aria-pressed", done ? "true" : "false");
        doneBtn.innerHTML = done ? icon("check") + "Done" : "Mark as done";
      };
      sync();
      doneBtn.addEventListener("click", function () {
        D.progress.setDone(t.id, !D.progress.isDone(t.id));
        sync();
      });
    }

    var links = document.getElementById("topic-links");
    if (links) {
      var chip = function (id) {
        var x = topicById(id);
        if (!x) return "";
        return isPublished(x) ? '<li><a class="chip" href="' + url(topicHref(x)) + '">' + esc(x.title) + "</a></li>" : '<li><span class="chip">' + esc(x.title) + "</span></li>";
      };
      var html = "";
      if (t.prereqs.length) html += "<h3>Read first</h3><ul class=\"chips\">" + t.prereqs.map(chip).join("") + "</ul>";
      if (t.related.length) html += "<h3>Related topics</h3><ul class=\"chips\">" + t.related.map(chip).join("") + "</ul>";
      var labsPage = pageById("labs");
      var practice = labs.filter(function (l) {
        return l.topics.indexOf(t.id) !== -1;
      });
      if (practice.length && labsPage && isPublished(labsPage)) {
        html += "<h3>Practice in the lab</h3><ul class=\"chips\">" + practice.map(function (l) {
          return '<li><a class="chip" href="' + url(labHref(l)) + '">Exercise ' + l.n + ": " + esc(l.short) + "</a></li>";
        }).join("") + "</ul>";
      }
      links.innerHTML = html;
    }
  }

  /* ---------- Labs hub and exercise pages ---------- */

  function renderLabs() {
    var list = document.getElementById("lab-list");
    if (!list) return;
    list.innerHTML = labs
      .map(function (l) {
        return (
          '<li><span class="topic-num">' + l.n + "</span><div>" +
          '<a class="topic-title" href="' + url(labHref(l)) + '">' + esc(l.title) + "</a></div>" +
          '<div class="topic-meta"><span>' + esc(l.summary) + "</span></div></li>"
        );
      })
      .join("");
  }

  function renderLab() {
    var l = labByNumber(LAB);
    if (!l) return;
    D.progress.setLast(labHref(l), "Lab exercise " + l.n + ": " + l.short);

    var pager = document.getElementById("pager");
    if (pager) {
      var prev = labByNumber(l.n - 1);
      var next = labByNumber(l.n + 1);
      pager.innerHTML =
        (prev ? '<a class="prev" href="' + url(labHref(prev)) + '"><small>Previous exercise</small>' + esc(prev.short) + "</a>" : "<span></span>") +
        (next ? '<a class="next" href="' + url(labHref(next)) + '"><small>Next exercise</small>' + esc(next.short) + "</a>" : "");
    }

    var box = document.getElementById("lab-topics");
    if (box) {
      box.innerHTML = '<ul class="chips">' + l.topics.map(function (id) {
        var x = topicById(id);
        if (!x) return "";
        var label = x.id + " " + esc(x.title);
        return isPublished(x) ? '<li><a class="chip" href="' + url(topicHref(x)) + '">' + label + "</a></li>" : '<li><span class="chip">' + label + "</span></li>";
      }).join("") + "</ul>";
    }
  }

  /* ---------- Small enhancements ---------- */

  function toast(message) {
    var el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(function () {
      el.remove();
    }, 1800);
  }
  D.toast = toast;

  function enhanceCodeBlocks() {
    document.querySelectorAll(".code-block").forEach(function (block) {
      var pre = block.querySelector("pre");
      if (!pre || block.querySelector(".copy-btn")) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn no-print";
      btn.textContent = "Copy";
      btn.addEventListener("click", function () {
        var text = pre.innerText;
        var done = function () {
          btn.textContent = "Copied";
          toast("Code copied");
          setTimeout(function () {
            btn.textContent = "Copy";
          }, 1500);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () {
            toast("Select the code and copy it by hand");
          });
        } else {
          toast("Select the code and copy it by hand");
        }
      });
      block.appendChild(btn);
    });
  }

  function enhanceTabs() {
    document.querySelectorAll("[data-tabs]").forEach(function (box, n) {
      var buttons = box.querySelectorAll(".tab-list button");
      var panels = box.querySelectorAll(".tab-panel");
      function select(i, focus) {
        buttons.forEach(function (b, j) {
          b.setAttribute("aria-selected", i === j ? "true" : "false");
          b.tabIndex = i === j ? 0 : -1;
          panels[j].hidden = i !== j;
        });
        if (focus) buttons[i].focus();
      }
      buttons.forEach(function (b, i) {
        var pid = "tabs-" + n + "-panel-" + i;
        var bid = "tabs-" + n + "-tab-" + i;
        b.id = bid;
        b.setAttribute("role", "tab");
        b.setAttribute("aria-controls", pid);
        panels[i].id = pid;
        panels[i].setAttribute("role", "tabpanel");
        panels[i].setAttribute("aria-labelledby", bid);
        b.addEventListener("click", function () {
          select(i, false);
        });
        b.addEventListener("keydown", function (e) {
          if (e.key === "ArrowRight") select((i + 1) % buttons.length, true);
          if (e.key === "ArrowLeft") select((i - 1 + buttons.length) % buttons.length, true);
        });
      });
      box.querySelector(".tab-list").setAttribute("role", "tablist");
      select(0, false);
    });
  }

  function enhanceSearchButtons() {
    document.querySelectorAll("[data-open-search]").forEach(function (btn) {
      btn.addEventListener("click", openSearch);
    });
  }

  function enhanceResetButtons() {
    document.querySelectorAll("[data-reset-progress]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (window.confirm("Clear your progress on this device? This cannot be undone.")) {
          D.progress.reset();
          toast("Progress cleared");
          document.dispatchEvent(new CustomEvent("dbms:progress-reset"));
        }
      });
    });
  }

  /* ---------- Section menu (topic, lab and diagram pages) ----------
     Copies the "On this page" links into a sticky rail on the right on wide
     screens, and into a "Sections" button and panel on smaller screens. The
     link for the section being read is highlighted. A link may have a nested
     list of links under it, as on the Diagrams and Examples pages; then the
     rail shows them indented and highlights the parent too. */

  function renderSectionMenu() {
    var toc = document.querySelector(".on-this-page");
    var page = document.querySelector(".page");
    if (!toc || !page) return;
    var listItems = function (ol, parent) {
      var out = [];
      Array.prototype.forEach.call(ol ? ol.children : [], function (li) {
        var a = li.querySelector(":scope > a[href^='#']");
        if (!a || !document.getElementById(a.getAttribute("href").slice(1))) return;
        var x = { id: a.getAttribute("href").slice(1), text: a.textContent, parent: parent };
        x.children = listItems(li.querySelector(":scope > ol"), x);
        out.push(x);
      });
      return out;
    };
    var tree = listItems(toc.querySelector("ol"), null);
    var items = [];
    tree.forEach(function (x) {
      items.push(x);
      items = items.concat(x.children);
    });
    if (!items.length) return;
    var listHtml = function (list) {
      return list.map(function (x) {
        return '<li><a href="#' + esc(x.id) + '">' + esc(x.text) + "</a>" +
          (x.children.length ? '<ol class="toc-sub">' + listHtml(x.children) + "</ol>" : "") + "</li>";
      }).join("");
    };

    var rail = document.createElement("aside");
    rail.className = "toc-rail";
    rail.id = "toc-rail";
    rail.setAttribute("aria-label", "Sections of this page");
    rail.innerHTML =
      '<div class="toc-rail-head"><strong>On this page</strong>' +
      '<button type="button" class="icon-btn toc-close" aria-label="Close sections menu">' + icon("x") + "</button></div>" +
      "<ol>" + listHtml(tree) + "</ol>" +
      '<a class="toc-top" href="#main">' + icon("chevron-up") + "Back to top</a>";
    page.appendChild(rail);

    var fab = document.createElement("button");
    fab.type = "button";
    fab.className = "toc-fab";
    fab.setAttribute("aria-controls", "toc-rail");
    fab.setAttribute("aria-expanded", "false");
    fab.innerHTML = icon("list") + "<span>Sections</span>";
    document.body.appendChild(fab);

    var setOpen = function (open) {
      rail.classList.toggle("is-open", open);
      fab.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        var cur = rail.querySelector("[aria-current]") || rail.querySelector("a");
        if (cur) cur.focus();
      }
    };
    fab.addEventListener("click", function () {
      setOpen(!rail.classList.contains("is-open"));
    });
    rail.querySelector(".toc-close").addEventListener("click", function () {
      setOpen(false);
      fab.focus();
    });
    rail.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && rail.classList.contains("is-open")) {
        setOpen(false);
        fab.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (rail.classList.contains("is-open") && !rail.contains(e.target) && !fab.contains(e.target)) setOpen(false);
    });

    var links = rail.querySelectorAll("ol a");
    var sections = items.map(function (x) {
      return document.getElementById(x.id);
    });
    var shown = -1;
    var ticking = false;
    var update = function () {
      ticking = false;
      var line = Math.min(220, window.innerHeight / 3);
      var active = -1;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top <= line) active = i;
      }
      // At the very bottom of the page, the last section counts as read.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) active = sections.length - 1;
      var parent = active >= 0 ? items.indexOf(items[active].parent) : -1;
      for (var j = 0; j < links.length; j++) {
        if (j === active) links[j].setAttribute("aria-current", "true");
        else links[j].removeAttribute("aria-current");
        links[j].classList.toggle("is-parent", j === parent);
      }
      // In a long rail, keep the highlighted link in view without moving the page.
      if (active !== shown && active >= 0 && rail.scrollHeight > rail.clientHeight) {
        var link = links[active];
        var top = link.offsetTop - rail.clientHeight / 3;
        if (link.offsetTop < rail.scrollTop || link.offsetTop + link.offsetHeight > rail.scrollTop + rail.clientHeight) rail.scrollTop = Math.max(0, top);
      }
      shown = active;
      // The button appears once the reader has scrolled past the top list.
      fab.classList.toggle("is-shown", toc.getBoundingClientRect().bottom < 0);
    };
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  /* ---------- Start ---------- */

  renderHeader();
  renderSidebar();
  renderBreadcrumbs();
  renderFooter();
  if (PAGE === "home") renderHome();
  if (PAGE === "unit") renderUnit();
  if (PAGE === "topic") {
    renderTopic();
    renderSectionMenu();
  }
  if (PAGE === "diagrams" && UNIT) renderSectionMenu();
  if (PAGE === "labs") renderLabs();
  if (PAGE === "lab") {
    renderLab();
    renderSectionMenu();
  }
  enhanceCodeBlocks();
  enhanceTabs();
  enhanceSearchButtons();
  enhanceResetButtons();
})();
