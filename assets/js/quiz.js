/* Quizzes.
   On a topic page:  <div data-quiz data-topic="4.6"></div>
   On a unit quiz:   <div data-unit-quiz data-unit="4"></div>  (20 questions at random, optional timer)
   On the hub page:  <div data-quiz-hub></div>
   Question types: mcq, multi, tf and order. Best scores are saved in the
   browser through DBMS.progress, under the topic id or "unit-4". */
(function () {
  "use strict";
  var D = window.DBMS || {};
  var esc = D.esc;

  // A fixed shuffle (so the page looks the same each time) that never returns
  // the correct order.
  function shuffled(n, seed) {
    var order = [];
    for (var i = 0; i < n; i++) order.push(i);
    var s = seed;
    for (var j = n - 1; j > 0; j--) {
      s = (s * 9301 + 49297) % 233280;
      var k = Math.floor((s / 233280) * (j + 1));
      var t = order[j];
      order[j] = order[k];
      order[k] = t;
    }
    var same = order.every(function (v, idx) {
      return v === idx;
    });
    if (same && n > 1) order.push(order.shift());
    return order;
  }

  function optionsHtml(q, qi) {
    var name = "quiz-" + q.id;
    if (q.type === "tf") {
      return ["True", "False"]
        .map(function (label, i) {
          return '<label class="quiz-option"><input type="radio" name="' + name + '" value="' + i + '"> ' + label + "</label>";
        })
        .join("");
    }
    if (q.type === "order") {
      var order = shuffled(q.options.length, qi + 7);
      return (
        '<ol class="quiz-order">' +
        order
          .map(function (i) {
            return (
              '<li class="quiz-option" data-i="' + i + '"><span class="quiz-order-text">' + esc(q.options[i]) + "</span>" +
              '<span class="quiz-order-btns"><button type="button" class="icon-btn" data-move="-1" aria-label="Move up">' + D.icon("chevron-up") + "</button>" +
              '<button type="button" class="icon-btn" data-move="1" aria-label="Move down">' + D.icon("chevron-down") + "</button></span></li>"
            );
          })
          .join("") +
        "</ol>"
      );
    }
    var type = q.type === "multi" ? "checkbox" : "radio";
    return q.options
      .map(function (opt, i) {
        return '<label class="quiz-option"><input type="' + type + '" name="' + name + '" value="' + i + '"> ' + esc(opt) + "</label>";
      })
      .join("");
  }

  function card(q, i) {
    var hint = q.type === "multi" ? '<span class="quiz-hint">Choose all that apply.</span>' : q.type === "order" ? '<span class="quiz-hint">Use the arrow buttons to move each step.</span>' : "";
    return (
      '<div class="quiz-card" data-q="' + i + '">' +
      '<fieldset><legend><span class="quiz-num">' + (i + 1) + ".</span> " + esc(q.question) + "</legend>" +
      (q.code ? '<pre class="quiz-code"><code>' + esc(q.code) + "</code></pre>" : "") +
      hint + optionsHtml(q, i) + "</fieldset>" +
      '<div class="quiz-feedback" aria-live="polite" hidden></div></div>'
    );
  }

  function chosen(box, q) {
    if (q.type === "order") {
      return Array.prototype.map.call(box.querySelectorAll(".quiz-order li"), function (li) {
        return Number(li.getAttribute("data-i"));
      });
    }
    return Array.prototype.filter
      .call(box.querySelectorAll("input"), function (inp) {
        return inp.checked;
      })
      .map(function (inp) {
        return Number(inp.value);
      });
  }

  function isRight(q, picked) {
    if (q.type === "mcq") return picked.length === 1 && picked[0] === q.answer;
    if (q.type === "tf") return picked.length === 1 && picked[0] === (q.answer ? 0 : 1);
    if (q.type === "multi") return picked.slice().sort().join() === q.answer.slice().sort().join();
    if (q.type === "order") return picked.every(function (v, i) {
      return v === i;
    });
    return false;
  }

  function correctIndexes(q) {
    if (q.type === "mcq") return [q.answer];
    if (q.type === "tf") return [q.answer ? 0 : 1];
    if (q.type === "multi") return q.answer;
    return [];
  }

  // Draws a quiz form for the given items and marks it on submit.
  // opts.key: progress key for the best score. opts.link(q): where "Read this part again" goes.
  // opts.onSubmit(result): called after marking with { score, total, wrong: [items] }.
  // opts.retryLabel and opts.onRetry: the button shown after marking.
  function mount(box, items, opts) {
    var best = D.progress && D.progress.bestScore(opts.key);
    box.innerHTML =
      '<form class="quiz" novalidate>' +
      items.map(card).join("") +
      '<div class="quiz-actions"><button type="submit" class="btn btn-primary">Check my answers</button>' +
      '<button type="button" class="btn" data-retry hidden>' + esc(opts.retryLabel || "Try again") + "</button>" +
      '<p class="quiz-score" aria-live="polite">' + (best ? "Your best score so far: " + best.score + " out of " + best.total + "." : "") + "</p></div></form>";

    var form = box.querySelector("form");
    var marked = false;

    form.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-move]");
      if (!btn || marked) return;
      var li = btn.closest("li");
      var dir = Number(btn.getAttribute("data-move"));
      var sib = dir < 0 ? li.previousElementSibling : li.nextElementSibling;
      if (!sib) return;
      if (dir < 0) li.parentNode.insertBefore(li, sib);
      else li.parentNode.insertBefore(sib, li);
      btn.focus();
    });

    function mark() {
      if (marked) return;
      marked = true;
      var score = 0;
      var wrong = [];
      items.forEach(function (q, i) {
        var qBox = form.querySelector('[data-q="' + i + '"]');
        var picked = chosen(qBox, q);
        var ok = isRight(q, picked);
        if (ok) score += 1;
        else wrong.push(q);
        var right = correctIndexes(q);
        qBox.querySelectorAll(".quiz-option").forEach(function (opt, j) {
          opt.classList.remove("is-correct", "is-wrong");
          if (q.type === "order") {
            opt.classList.add(Number(opt.getAttribute("data-i")) === j ? "is-correct" : "is-wrong");
            return;
          }
          var input = opt.querySelector("input");
          if (right.indexOf(j) !== -1) opt.classList.add("is-correct");
          else if (input.checked) opt.classList.add("is-wrong");
        });
        var fb = qBox.querySelector(".quiz-feedback");
        fb.hidden = false;
        var answerText = "";
        if (q.type === "order" && !ok) {
          answerText = '<ol class="quiz-answer-order">' + q.options.map(function (o) {
            return "<li>" + esc(o) + "</li>";
          }).join("") + "</ol>";
        }
        var href = q.link ? opts.link(q) : "";
        fb.className = "quiz-feedback " + (ok ? "is-right" : "is-wrong");
        fb.innerHTML =
          "<strong>" + (ok ? "Correct." : picked.length ? "Not quite." : "Not answered.") + "</strong> " + esc(q.explain) +
          answerText + (href ? ' <a href="' + esc(href) + '">' + esc(opts.linkText ? opts.linkText(q) : "Read this part again") + "</a>" : "");
      });
      form.querySelectorAll("input, [data-move]").forEach(function (el) {
        el.disabled = true;
      });
      form.querySelector('[type="submit"]').hidden = true;
      if (D.progress) D.progress.setScore(opts.key, score, items.length);
      var bestNow = D.progress && D.progress.bestScore(opts.key);
      form.querySelector(".quiz-score").textContent =
        "You scored " + score + " out of " + items.length + "." + (bestNow ? " Your best score: " + bestNow.score + " out of " + bestNow.total + "." : "");
      form.querySelector("[data-retry]").hidden = false;
      if (opts.onSubmit) opts.onSubmit({ score: score, total: items.length, wrong: wrong });
      form.querySelector(".quiz-score").scrollIntoView({ block: "nearest" });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      mark();
    });

    form.querySelector("[data-retry]").addEventListener("click", function () {
      if (opts.onRetry) opts.onRetry();
    });

    return { mark: mark };
  }

  function itemsOf(filter) {
    // filter skips the gaps a stray comma leaves in a data array.
    return (D.quizzes || []).filter(function (q) {
      return q && filter(q);
    });
  }

  /* ---------- Topic quiz ---------- */

  function renderTopic(box) {
    var id = box.getAttribute("data-topic");
    var items = itemsOf(function (q) {
      return q.topic === id;
    });
    if (!items.length) {
      box.innerHTML = '<p class="muted">The quiz for this topic is coming soon.</p>';
      return;
    }
    mount(box, items, {
      key: id,
      link: function (q) {
        return q.link;
      },
      onRetry: function () {
        renderTopic(box);
        box.querySelector(".quiz-card").scrollIntoView({ block: "start" });
      }
    });
  }

  /* ---------- Unit quiz ---------- */

  var UNIT_QUIZ_SIZE = 20;
  var UNIT_QUIZ_MINUTES = 20;

  function unitByNumber(n) {
    return (D.units || []).filter(function (u) {
      return u.n === n;
    })[0];
  }

  // Questions from the published topics of a unit.
  function unitPool(n) {
    return itemsOf(function (q) {
      var t = D.topicById(q.topic);
      return t && t.unit === n && D.isPublished(t);
    });
  }

  function pickRandom(list, n) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a.slice(0, n);
  }

  function clock(seconds) {
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function renderUnitQuiz(box) {
    var n = Number(box.getAttribute("data-unit"));
    var u = unitByNumber(n);
    var pool = unitPool(n);
    var key = "unit-" + n;
    if (!u || !pool.length) {
      box.innerHTML = '<p class="muted">The quiz for this unit is coming soon.</p>';
      return;
    }
    var size = Math.min(UNIT_QUIZ_SIZE, pool.length);
    var timer = null;
    var timedChoice = false;

    function stopTimer() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    function intro() {
      stopTimer();
      var best = D.progress && D.progress.bestScore(key);
      box.innerHTML =
        '<div class="card unit-quiz-start">' +
        "<p>Each quiz has <strong>" + size + " questions</strong>, picked at random from the " + pool.length + " questions for Unit " + u.roman + ". Every new quiz gives you a different set.</p>" +
        '<label class="check-row"><input type="checkbox" data-timed' + (timedChoice ? " checked" : "") + "> Use a " + UNIT_QUIZ_MINUTES + "-minute timer, like an exam</label>" +
        '<div class="quiz-actions"><button type="button" class="btn btn-primary" data-start>Start the quiz</button>' +
        '<p class="quiz-score">' + (best ? "Your best score so far: " + best.score + " out of " + best.total + "." : "") + "</p></div></div>";
      box.querySelector("[data-start]").addEventListener("click", function () {
        timedChoice = box.querySelector("[data-timed]").checked;
        start();
      });
    }

    function start() {
      var items = pickRandom(pool, size);
      box.innerHTML =
        (timedChoice ? '<div class="quiz-timer" role="timer" aria-live="off"><span>Time left</span> <strong data-clock>' + clock(UNIT_QUIZ_MINUTES * 60) + "</strong></div>" : "") +
        '<div data-quiz-body></div><div class="quiz-review" data-review hidden></div>';
      var review = box.querySelector("[data-review]");
      var quiz = mount(box.querySelector("[data-quiz-body]"), items, {
        key: key,
        retryLabel: "Start a new quiz",
        link: function (q) {
          return D.url(D.topicHref(D.topicById(q.topic))) + q.link;
        },
        linkText: function (q) {
          return "Read this part of " + q.topic + " " + D.topicById(q.topic).title;
        },
        onSubmit: function (res) {
          stopTimer();
          var tm = box.querySelector(".quiz-timer");
          if (tm) tm.classList.add("is-stopped");
          // The topics behind the wrong answers, in syllabus order.
          var ids = [];
          res.wrong.forEach(function (q) {
            if (ids.indexOf(q.topic) === -1) ids.push(q.topic);
          });
          ids.sort(function (a, b) {
            return Number(a.split(".")[1]) - Number(b.split(".")[1]);
          });
          review.hidden = false;
          review.innerHTML = ids.length
            ? "<h2>Topics to revise</h2><p>You missed questions from these topics. Read their key points, then try a new quiz.</p><ul>" +
              ids.map(function (id) {
                var t = D.topicById(id);
                return '<li><a href="' + esc(D.url(D.topicHref(t)) + "#key-points") + '">' + esc(t.id + " " + t.title) + "</a></li>";
              }).join("") + "</ul>"
            : "<h2>Full marks</h2><p>Well done. Start a new quiz to try a different set of questions.</p>";
        },
        onRetry: function () {
          intro();
          box.scrollIntoView({ block: "start" });
        }
      });

      if (timedChoice) {
        var left = UNIT_QUIZ_MINUTES * 60;
        var out = box.querySelector("[data-clock]");
        var bar = box.querySelector(".quiz-timer");
        timer = window.setInterval(function () {
          left -= 1;
          out.textContent = clock(Math.max(left, 0));
          if (left === 60) bar.classList.add("is-low");
          if (left <= 0) {
            stopTimer();
            if (D.toast) D.toast("Time is up. Your answers have been checked.");
            quiz.mark();
          }
        }, 1000);
      }
      box.scrollIntoView({ block: "start" });
    }

    intro();
  }

  /* ---------- Hub page ---------- */

  function renderHub(box) {
    var progress = D.progress ? D.progress.data() : { quiz: {} };
    var badge = function (key) {
      var b = progress.quiz[key];
      return b ? '<span class="badge badge-done" title="Your best score">Best ' + b.score + "/" + b.total + "</span>" : "";
    };
    box.innerHTML = (D.units || [])
      .map(function (u) {
        var topics = (D.topics || []).filter(function (t) {
          return t.unit === u.n && D.isPublished(t);
        });
        if (!topics.length) return "";
        var pool = unitPool(u.n).length;
        var list = topics
          .map(function (t) {
            return '<li><a href="' + esc(D.url(D.topicHref(t)) + "#quiz") + '"><span class="qh-num">' + t.id + "</span> " + esc(t.title) + "</a> " + badge(t.id) + "</li>";
          })
          .join("");
        return (
          '<section class="section quiz-hub-unit u-' + u.n + '" aria-labelledby="qh-' + u.n + '">' +
          '<h2 id="qh-' + u.n + '">Unit ' + u.roman + ": " + esc(u.title) + "</h2>" +
          '<a class="card unit-card u-' + u.n + '" href="' + esc(D.url("quizzes/" + u.slug + ".html")) + '">' +
          '<span class="unit-label">Unit quiz</span><h3>Unit ' + u.roman + " quiz</h3>" +
          "<p>" + Math.min(UNIT_QUIZ_SIZE, pool) + " questions at random from " + pool + ", with an optional " + UNIT_QUIZ_MINUTES + "-minute timer.</p>" +
          (badge("unit-" + u.n) ? '<div class="card-foot">' + badge("unit-" + u.n) + "</div>" : "") + "</a>" +
          '<details class="accordion"><summary>Topic quizzes (' + topics.length + ")</summary><div class=\"accordion-body\"><ul class=\"quiz-hub-topics\">" + list + "</ul></div></details>" +
          "</section>"
        );
      })
      .join("");
  }

  document.querySelectorAll("[data-quiz]").forEach(renderTopic);
  document.querySelectorAll("[data-unit-quiz]").forEach(renderUnitQuiz);
  document.querySelectorAll("[data-quiz-hub]").forEach(renderHub);
  document.addEventListener("dbms:progress-reset", function () {
    document.querySelectorAll("[data-quiz-hub]").forEach(renderHub);
  });
})();
