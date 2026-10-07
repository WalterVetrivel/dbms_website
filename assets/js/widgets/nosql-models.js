/* CAP and NoSQL data models (widget V33).
   Part "cap": the student picks two of the three CAP guarantees. The widget
   shows what that choice means, example systems, and a step-by-step story of
   two servers that keep copies of the seats left on a train when the network
   between them breaks.
   Part "models": the same small data set (two students, their courses and
   marks) shown as relational rows, a document, key-value pairs, a column
   family and a graph, with the query that reads one student's marks.
   Markup: <div class="widget" data-widget="nosql-models" data-part="cap"></div>
           <div class="widget" data-widget="nosql-models" data-part="models" data-model="document"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});
  var esc = D.wq.esc;

  /* ---------- CAP ---------- */

  var LETTERS = {
    C: { name: "Consistency", short: "Every read sees the latest write, or gets an error." },
    A: { name: "Availability", short: "Every request gets an answer, though it may be old." },
    P: { name: "Partition tolerance", short: "The system keeps working when the network between servers breaks." }
  };

  var PAIRS = {
    CP: {
      title: "CP: consistency and partition tolerance",
      text: "When the network breaks, a server that may hold old data refuses or waits. Users may see “try again later”, but never wrong data.",
      examples: "HBase, MongoDB (default settings)",
      use: "Bookings, banking, stock levels"
    },
    AP: {
      title: "AP: availability and partition tolerance",
      text: "When the network breaks, every server keeps answering from its own copy. Some answers may be old. The copies agree again later (eventual consistency).",
      examples: "Apache Cassandra, CouchDB, Amazon DynamoDB",
      use: "Likes, comments, shopping carts, product views"
    },
    CA: {
      title: "CA: consistency and availability",
      text: "This works only while the network never breaks, which really means one site. Across many servers a partition can always happen, so a distributed system must keep P and choose between C and A.",
      examples: "A relational database on one server, such as MySQL",
      use: "Small systems on a single server"
    }
  };

  function pairKey(picked) {
    var k = picked.slice().sort().join("");
    return { AC: "CA", CP: "CP", AP: "AP" }[k] || null;
  }

  // Frames of the train seat story. Each frame: n1, n2 (seats left at each
  // server), link (true when the network works), u1, u2 (what a user at that
  // server sees; tone ok, bad or wait), msg.
  function capFrames(pair) {
    var f = [
      { n1: 1, n2: 1, link: true, msg: "Two servers keep copies of the seats left on a train. The network between them works, so every change is copied at once. Both show 1 seat left." },
      { n1: 1, n2: 1, link: false, msg: "The network between the servers breaks. This is a partition. Each server can still talk to its own users." },
      { n1: 0, n2: 1, link: false, u1: { text: "Asha books the last seat", tone: "ok" }, msg: "Asha books the last seat at Server 1. Server 1 now shows 0 seats, but it cannot send the change to Server 2." }
    ];
    if (pair === "CP") {
      f.push({ n1: 0, n2: 1, link: false, u1: f[2].u1, u2: { text: "Ravi: “Try again later”", tone: "wait" }, msg: "Ravi asks Server 2 for a seat. Server 2 knows it may be out of date, so it refuses. The data stays consistent, but Server 2 is not available." });
      f.push({ n1: 0, n2: 0, link: true, u2: { text: "Ravi: “No seats left”", tone: "ok" }, msg: "The network is repaired. Server 2 copies the change and shows 0 seats. Ravi now gets a correct answer. CP chose consistency over availability." });
    } else if (pair === "AP") {
      f.push({ n1: 0, n2: 0, link: false, u1: f[2].u1, u2: { text: "Ravi also books “the last seat”", tone: "bad" }, msg: "Ravi asks Server 2. It answers from its old copy, 1 seat, and books it for him. The system stayed available, but the data is not consistent: the seat is sold twice." });
      f.push({ n1: 0, n2: 0, link: true, u2: { text: "Ravi moved to the waiting list", tone: "wait" }, msg: "The network is repaired and the copies sync. The two copies agree again (eventual consistency). The app finds the double booking and must fix it. AP chose availability over consistency." });
    } else {
      f.push({ n1: 0, n2: 1, link: false, u1: f[2].u1, u2: { text: "Ravi: ?", tone: "wait" }, msg: "Ravi asks Server 2. A CA system has no plan for a partition. It must either refuse (and lose A) or answer from old data (and lose C). It cannot keep both." });
      f.push({ n1: 0, n2: 1, link: false, u1: f[2].u1, u2: f[3].u2, msg: "So CA is possible only when there is no partition, that is, on one site. In a distributed system, P is a must, and the real choice is between C and A." });
    }
    return f;
  }

  function triangle(picked) {
    var pts = { C: [200, 34], A: [70, 220], P: [330, 220] };
    var on = function (l) {
      return picked.indexOf(l) >= 0;
    };
    var edge = function (a, b, label, lx, ly) {
      var sel = on(a) && on(b);
      return '<line x1="' + pts[a][0] + '" y1="' + pts[a][1] + '" x2="' + pts[b][0] + '" y2="' + pts[b][1] + '" class="nm-edge' + (sel ? " is-on" : "") + '"/>' +
        '<text x="' + lx + '" y="' + ly + '" text-anchor="middle" class="nm-edge-label' + (sel ? " is-on" : "") + '">' + label + "</text>";
    };
    var node = function (l) {
      return '<circle cx="' + pts[l][0] + '" cy="' + pts[l][1] + '" r="26" class="nm-node' + (on(l) ? " is-on" : "") + '"/>' +
        '<text x="' + pts[l][0] + '" y="' + (pts[l][1] + 7) + '" text-anchor="middle" class="nm-node-label' + (on(l) ? " is-on" : "") + '">' + l + "</text>";
    };
    return '<svg viewBox="0 0 400 252" width="400" role="img" aria-label="CAP triangle. Picked: ' + (picked.length ? picked.join(" and ") : "none") + '" style="max-width:100%;height:auto">' +
      edge("C", "A", "CA", 112, 120) + edge("C", "P", "CP", 288, 120) + edge("A", "P", "AP", 200, 244) +
      node("C") + node("A") + node("P") + "</svg>";
  }

  function capSim(f) {
    var srv = function (n, seats, u) {
      return '<div class="nm-server">' +
        '<div class="nm-server-name">Server ' + n + "</div>" +
        '<div class="nm-seats"><span>Seats left</span><strong>' + seats + "</strong></div>" +
        (u ? '<div class="nm-user nm-' + u.tone + '">' + esc(u.text) + "</div>" : '<div class="nm-user nm-none">No request</div>') +
        "</div>";
    };
    return '<div class="nm-sim">' + srv(1, f.n1, f.u1) +
      '<div class="nm-link' + (f.link ? "" : " is-broken") + '" aria-label="' + (f.link ? "Network working" : "Network broken") + '">' +
      "<span>" + (f.link ? "Network OK" : "Network broken") + "</span></div>" +
      srv(2, f.n2, f.u2) + "</div>";
  }

  function CapWidget(root) {
    var self = this;
    this.picked = ["C", "P"];
    root.innerHTML =
      '<div class="widget-head"><strong>CAP theorem: pick two</strong></div>' +
      '<div class="widget-controls"><div class="seg" role="group" aria-label="Pick two guarantees">' +
      ["C", "A", "P"].map(function (l) {
        return '<button type="button" class="seg-btn" data-letter="' + l + '">' + l + ": " + LETTERS[l].name + "</button>";
      }).join("") + "</div></div>" +
      '<div class="widget-stage nm-cap" tabindex="0">' +
      '<div class="nm-tri"></div><div class="nm-result" aria-live="polite"></div></div>' +
      '<h3 class="nm-sub">See it happen: the last seat on a train</h3>' +
      '<div class="widget-stage nm-sim-stage" tabindex="0"></div>' +
      "<div data-player></div>";
    this.tri = root.querySelector(".nm-tri");
    this.result = root.querySelector(".nm-result");
    this.sim = root.querySelector(".nm-sim-stage");
    this.btns = root.querySelectorAll("[data-letter]");
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (f) {
        self.sim.innerHTML = capSim(f);
      },
      resetLabel: "Start again",
      onReset: function () {
        self.update();
      }
    });
    this.btns.forEach(function (b) {
      b.addEventListener("click", function () {
        var l = b.getAttribute("data-letter");
        var i = self.picked.indexOf(l);
        if (i >= 0) self.picked.splice(i, 1);
        else {
          self.picked.push(l);
          if (self.picked.length > 2) self.picked.shift();
        }
        self.update();
      });
    });
    this.update();
  }

  CapWidget.prototype.update = function () {
    var picked = this.picked;
    this.btns.forEach(function (b) {
      b.setAttribute("aria-pressed", picked.indexOf(b.getAttribute("data-letter")) >= 0 ? "true" : "false");
    });
    this.tri.innerHTML = triangle(picked);
    var k = pairKey(picked);
    if (!k) {
      this.result.innerHTML = "<p><strong>Pick two guarantees.</strong> " +
        (picked.length ? esc(LETTERS[picked[0]].name) + " is picked. Pick one more." : "Nothing is picked yet.") + "</p>" +
        '<ul class="nm-letters">' + ["C", "A", "P"].map(function (l) {
          return "<li><strong>" + l + " (" + LETTERS[l].name + "):</strong> " + LETTERS[l].short + "</li>";
        }).join("") + "</ul>";
      this.player.load([{ n1: 1, n2: 1, link: true, msg: "Pick two guarantees above to see what happens when the network breaks." }], false);
      return;
    }
    var p = PAIRS[k];
    this.result.innerHTML = "<h3>" + esc(p.title) + "</h3><p>" + esc(p.text) + "</p>" +
      '<dl class="nm-dl"><dt>Example systems</dt><dd>' + esc(p.examples) + "</dd><dt>Good for</dt><dd>" + esc(p.use) + "</dd></dl>";
    this.player.load(capFrames(k), false);
  };

  /* ---------- Data models ---------- */

  var STUDENTS = [
    { roll: 101, name: "Anitha", dept: "CSE", marks: [["DBMS", 86], ["OS", 78]] },
    { roll: 102, name: "Bala", dept: "ECE", marks: [["DBMS", 72]] }
  ];

  function table(caption, head, rows) {
    return '<div class="nm-scroll"><table class="nm-table"><caption>' + caption + "</caption><thead><tr>" +
      head.map(function (h) {
        return '<th scope="col">' + h + "</th>";
      }).join("") + "</tr></thead><tbody>" +
      rows.map(function (r) {
        return "<tr>" + r.map(function (c) {
          return "<td>" + c + "</td>";
        }).join("") + "</tr>";
      }).join("") + "</tbody></table></div>";
  }

  function code(label, text) {
    return '<div class="code-block"><span class="code-label">' + label + "</span><pre><code>" + esc(text) + "</code></pre></div>";
  }

  function docJson(s) {
    return '{\n  "_id": ' + s.roll + ',\n  "name": "' + s.name + '",\n  "dept": "' + s.dept + '",\n  "marks": [\n' +
      s.marks.map(function (m) {
        return '    { "course": "' + m[0] + '", "marks": ' + m[1] + " }";
      }).join(",\n") + "\n  ]\n}";
  }

  function kvValue(s) {
    return '{"name":"' + s.name + '","dept":"' + s.dept + '","marks":{' +
      s.marks.map(function (m) {
        return '"' + m[0] + '":' + m[1];
      }).join(",") + "}}";
  }

  function graphSvg() {
    var y = { Anitha: 60, Bala: 170, DBMS: 60, OS: 170 };
    var box = function (x, name, kind, cls) {
      var yy = y[name];
      return '<rect x="' + x + '" y="' + (yy - 22) + '" width="110" height="44" rx="22" class="' + cls + '"/>' +
        '<text x="' + (x + 55) + '" y="' + (yy - 28) + '" text-anchor="middle" class="nm-g-kind">' + kind + "</text>" +
        '<text x="' + (x + 55) + '" y="' + (yy + 5) + '" text-anchor="middle" class="nm-g-name">' + name + "</text>";
    };
    var edge = function (from, to, marks, t) {
      var x1 = 120, y1 = y[from], x2 = 290, y2 = y[to];
      var lx = x1 + (x2 - x1) * t, ly = y1 + (y2 - y1) * t - 6;
      return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + (x2 - 4) + '" y2="' + y2 + '" class="nm-g-edge" marker-end="url(#nm-arrow)"/>' +
        '<text x="' + lx + '" y="' + ly + '" text-anchor="middle" class="nm-g-edge-label">marks: ' + marks + "</text>";
    };
    return '<svg viewBox="0 0 410 210" width="410" role="img" aria-label="Graph: Anitha is enrolled in DBMS with marks 86 and in OS with marks 78. Bala is enrolled in DBMS with marks 72." style="max-width:100%;height:auto">' +
      '<defs><marker id="nm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="nm-g-head"/></marker></defs>' +
      edge("Anitha", "DBMS", 86, 0.5) + edge("Anitha", "OS", 78, 0.2) + edge("Bala", "DBMS", 72, 0.8) +
      box(10, "Anitha", "Student", "nm-g-student") + box(10, "Bala", "Student", "nm-g-student") +
      box(290, "DBMS", "Course", "nm-g-course") + box(290, "OS", "Course", "nm-g-course") +
      "</svg>";
  }

  var MODELS = {
    relational: {
      name: "Relational rows",
      intro: "Fixed tables. A student can take many courses, so the marks go in a second table, linked by roll_no (a foreign key).",
      view: function () {
        return table("student", ["roll_no", "name", "dept"], STUDENTS.map(function (s) {
          return [s.roll, s.name, s.dept];
        })) + table("enrollment", ["roll_no", "course", "marks"], [].concat.apply([], STUDENTS.map(function (s) {
          return s.marks.map(function (m) {
            return [s.roll, m[0], m[1]];
          });
        })));
      },
      queryLabel: "SQL (MySQL 8.4)",
      query: "SELECT e.course, e.marks\nFROM student s\nJOIN enrollment e ON e.roll_no = s.roll_no\nWHERE s.name = 'Anitha';",
      good: "Any question can be asked with joins; strict ACID transactions.",
      weak: "Joins get slow on huge data; changing the schema is hard."
    },
    document: {
      name: "Document",
      intro: "Each student is one JSON document in the students collection. The marks are kept inside the document, so no join is needed.",
      view: function () {
        return '<p class="nm-label">Collection: students</p>' + '<div class="nm-docs">' + STUDENTS.map(function (s) {
          return code("Document", docJson(s));
        }).join("") + "</div>";
      },
      queryLabel: "MongoDB",
      query: "db.students.findOne(\n  { name: \"Anitha\" },\n  { marks: 1 }\n)",
      good: "One read gets the whole student; documents can have different fields.",
      weak: "Data shared by many documents (such as a course title) is copied in each."
    },
    keyvalue: {
      name: "Key-value",
      intro: "Every item is a unique key and a value. The database does not look inside the value. The app chooses keys such as student:101.",
      view: function () {
        var rows = STUDENTS.map(function (s) {
          return ["<code>student:" + s.roll + "</code>", "<code>" + esc(kvValue(s)) + "</code>"];
        });
        rows.push(["<code>dept:CSE</code>", "<code>[101]</code>"]);
        return table("Key-value pairs", ["Key", "Value"], rows) +
          '<p class="nm-note">The key dept:CSE is an extra pair the app keeps so it can find CSE students. The database cannot search inside values.</p>';
      },
      queryLabel: "Redis",
      query: "GET student:101",
      good: "Very fast reads and writes by key; very simple to scale.",
      weak: "You must know the key; no search by other fields and no joins."
    },
    column: {
      name: "Column family",
      intro: "Each row has a row key and groups of columns called column families. Rows can have different columns, and a missing column takes no space.",
      view: function () {
        var all = ["DBMS", "OS"];
        return '<div class="nm-scroll"><table class="nm-table"><caption>Table student</caption><thead>' +
          '<tr><th scope="col" rowspan="2">Row key</th><th scope="colgroup" colspan="2" class="nm-fam1">Family: info</th><th scope="colgroup" colspan="2" class="nm-fam2">Family: marks</th></tr>' +
          '<tr><th scope="col" class="nm-fam1">name</th><th scope="col" class="nm-fam1">dept</th>' +
          all.map(function (c) {
            return '<th scope="col" class="nm-fam2">' + c + "</th>";
          }).join("") + "</tr></thead><tbody>" +
          STUDENTS.map(function (s) {
            return "<tr><th scope=\"row\">" + s.roll + '</th><td class="nm-fam1">' + s.name + '</td><td class="nm-fam1">' + s.dept + "</td>" +
              all.map(function (c) {
                var m = s.marks.filter(function (x) {
                  return x[0] === c;
                })[0];
                return m ? '<td class="nm-fam2">' + m[1] + "</td>" : '<td class="nm-missing">no column</td>';
              }).join("") + "</tr>";
          }).join("") + "</tbody></table></div>" +
          '<p class="nm-note">Row 102 has no OS column at all. Nothing is stored for it, not even NULL.</p>';
      },
      queryLabel: "HBase shell",
      query: "get 'student', '101', 'marks'",
      good: "Huge tables spread over many servers; fast writes; reads of a few column families.",
      weak: "Queries must follow the row key design; joins are not supported."
    },
    graph: {
      name: "Graph",
      intro: "Students and courses are nodes. Each enrollment is an edge from a student to a course, and the marks are a property of the edge.",
      view: function () {
        return '<div class="nm-graph">' + graphSvg() + "</div>";
      },
      queryLabel: "Cypher (Neo4j)",
      query: "MATCH (s:Student {name: 'Anitha'})-[e:ENROLLED_IN]->(c:Course)\nRETURN c.name, e.marks;",
      good: "Following links fast, such as friends of friends or routes.",
      weak: "Not built for adding up huge numbers of rows; harder to spread over many servers."
    }
  };

  function ModelsWidget(root) {
    var self = this;
    var start = root.getAttribute("data-model");
    if (!MODELS[start]) start = "relational";
    root.innerHTML =
      '<div class="widget-head"><strong>One data set, five data models</strong></div>' +
      '<div class="widget-controls"><div class="seg" role="group" aria-label="Data model">' +
      Object.keys(MODELS).map(function (k) {
        return '<button type="button" class="seg-btn" data-model-btn="' + k + '">' + MODELS[k].name + "</button>";
      }).join("") + "</div></div>" +
      '<div class="widget-stage nm-models" tabindex="0" aria-live="polite"></div>';
    this.stage = root.querySelector(".nm-models");
    this.btns = root.querySelectorAll("[data-model-btn]");
    this.btns.forEach(function (b) {
      b.addEventListener("click", function () {
        self.show(b.getAttribute("data-model-btn"));
      });
    });
    this.show(start);
  }

  ModelsWidget.prototype.show = function (k) {
    var m = MODELS[k];
    this.btns.forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-model-btn") === k ? "true" : "false");
    });
    this.stage.innerHTML =
      '<p class="nm-intro"><strong>' + esc(m.name) + ":</strong> " + esc(m.intro) + "</p>" +
      m.view() +
      '<p class="nm-label">Get Anitha\'s marks</p>' + code(m.queryLabel, m.query) +
      '<dl class="nm-dl"><dt>Good at</dt><dd>' + esc(m.good) + "</dd><dt>Not so good at</dt><dd>" + esc(m.weak) + "</dd></dl>";
  };

  D.nosqlModels = { PAIRS: PAIRS, MODELS: MODELS, pairKey: pairKey, capFrames: capFrames };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="nosql-models"]').forEach(function (box) {
      if (box.getAttribute("data-part") === "models") new ModelsWidget(box);
      else new CapWidget(box);
    });
  });
})();
