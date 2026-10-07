/* Topic quiz. Use <div data-quiz data-topic="4.6"></div>.
   Question types: mcq, multi, tf and order. The best score is saved in the
   browser through DBMS.progress. */
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

  function render(box) {
    var id = box.getAttribute("data-topic");
    var items = (D.quizzes || []).filter(function (q) {
      return q.topic === id;
    });
    if (!items.length) {
      box.innerHTML = '<p class="muted">The quiz for this topic is coming soon.</p>';
      return;
    }
    var best = D.progress && D.progress.bestScore(id);
    box.innerHTML =
      '<form class="quiz" novalidate>' +
      items.map(card).join("") +
      '<div class="quiz-actions"><button type="submit" class="btn btn-primary">Check my answers</button>' +
      '<button type="button" class="btn" data-retry hidden>Try again</button>' +
      '<p class="quiz-score" aria-live="polite">' + (best ? "Your best score so far: " + best.score + " out of " + best.total + "." : "") + "</p></div></form>";

    var form = box.querySelector("form");

    form.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-move]");
      if (!btn) return;
      var li = btn.closest("li");
      var dir = Number(btn.getAttribute("data-move"));
      var sib = dir < 0 ? li.previousElementSibling : li.nextElementSibling;
      if (!sib) return;
      if (dir < 0) li.parentNode.insertBefore(li, sib);
      else li.parentNode.insertBefore(sib, li);
      btn.focus();
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var score = 0;
      items.forEach(function (q, i) {
        var qBox = form.querySelector('[data-q="' + i + '"]');
        var picked = chosen(qBox, q);
        var ok = isRight(q, picked);
        if (ok) score += 1;
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
        fb.className = "quiz-feedback " + (ok ? "is-right" : "is-wrong");
        fb.innerHTML =
          "<strong>" + (ok ? "Correct." : picked.length ? "Not quite." : "Not answered.") + "</strong> " + esc(q.explain) +
          answerText + (q.link ? ' <a href="' + esc(q.link) + '">Read this part again</a>' : "");
      });
      if (D.progress) D.progress.setScore(id, score, items.length);
      var bestNow = D.progress && D.progress.bestScore(id);
      form.querySelector(".quiz-score").textContent =
        "You scored " + score + " out of " + items.length + "." + (bestNow ? " Your best score: " + bestNow.score + " out of " + bestNow.total + "." : "");
      form.querySelector("[data-retry]").hidden = false;
      form.querySelector(".quiz-score").scrollIntoView({ block: "nearest" });
    });

    form.querySelector("[data-retry]").addEventListener("click", function () {
      render(box);
      box.querySelector(".quiz-card").scrollIntoView({ block: "start" });
    });
  }

  document.querySelectorAll("[data-quiz]").forEach(render);
})();
