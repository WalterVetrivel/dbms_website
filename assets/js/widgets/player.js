/* Step player shared by the Unit IV widgets.
   A widget records its work as a list of frames. Each frame has a "msg" (the
   narration) and whatever the widget needs to draw it. The player adds the
   Back, Play, Next and Reset buttons, a speed slider, a step counter and an
   ARIA live narration line, and calls render(frame) whenever the step changes.

   var player = new DBMS.Player(box, { render: fn, resetLabel: "Clear", onReset: fn });
   player.load(frames, atEnd);  // replace all frames; show the first or the last
   player.add(frames);          // append frames after the current step and play them
   player.say(text);            // change the narration without changing the step */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  function Player(box, opts) {
    var self = this;
    this.opts = opts || {};
    this.frames = [];
    this.at = -1;
    this.timer = null;
    box.innerHTML =
      '<div class="widget-controls wp-player">' +
      '<button type="button" class="btn" data-play="back" aria-label="Step back">Back</button>' +
      '<button type="button" class="btn btn-primary" data-play="toggle">Play</button>' +
      '<button type="button" class="btn" data-play="next" aria-label="Step forward">Next</button>' +
      (this.opts.onReset ? '<button type="button" class="btn" data-play="reset">' + (this.opts.resetLabel || "Reset") + "</button>" : "") +
      '<label class="wp-field wp-speed"><span>Speed</span><input type="range" min="1" max="5" value="3" data-speed></label>' +
      '<span class="wp-step muted" data-step></span>' +
      "</div>" +
      '<p class="widget-narration" aria-live="polite" data-narration></p>';
    this.narration = box.querySelector("[data-narration]");
    this.stepLabel = box.querySelector("[data-step]");
    this.toggleBtn = box.querySelector('[data-play="toggle"]');
    this.speed = box.querySelector("[data-speed]");
    box.querySelector('[data-play="back"]').addEventListener("click", function () {
      self.pause();
      self.show(self.at - 1);
    });
    box.querySelector('[data-play="next"]').addEventListener("click", function () {
      self.pause();
      self.show(self.at + 1);
    });
    this.toggleBtn.addEventListener("click", function () {
      if (self.timer) self.pause();
      else self.play();
    });
    var reset = box.querySelector('[data-play="reset"]');
    if (reset) {
      reset.addEventListener("click", function () {
        self.pause();
        self.opts.onReset();
      });
    }
  }

  Player.prototype.load = function (frames, atEnd) {
    this.pause();
    this.frames = frames.slice();
    this.show(atEnd ? this.frames.length - 1 : 0);
  };

  // Drops any steps after the one on screen, then adds the new ones.
  Player.prototype.add = function (frames) {
    this.pause();
    this.frames = this.frames.slice(0, this.at + 1).concat(frames);
    if (frames.length > 1) {
      this.show(this.frames.length - frames.length);
      this.play();
    } else {
      this.show(this.frames.length - 1);
    }
  };

  Player.prototype.current = function () {
    return this.frames[this.at];
  };

  Player.prototype.say = function (text) {
    this.narration.textContent = text;
  };

  Player.prototype.delay = function () {
    var slow = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1.3 : 1;
    return [2600, 1900, 1300, 800, 450][Number(this.speed.value) - 1] * slow;
  };

  Player.prototype.play = function () {
    var self = this;
    if (this.frames.length < 2) return;
    if (this.at >= this.frames.length - 1) this.show(0);
    this.toggleBtn.textContent = "Pause";
    this.timer = setInterval(function () {
      if (self.at >= self.frames.length - 1) self.pause();
      else self.show(self.at + 1);
    }, this.delay());
  };

  Player.prototype.pause = function () {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.toggleBtn.textContent = "Play";
  };

  Player.prototype.show = function (i) {
    if (i < 0 || i >= this.frames.length) return;
    this.at = i;
    var f = this.frames[i];
    this.opts.render(f, i);
    this.narration.textContent = (f.op ? f.op + ": " : "") + f.msg;
    this.stepLabel.textContent = "Step " + (i + 1) + " of " + this.frames.length;
  };

  D.Player = Player;

  // Small helpers used by several widgets.
  D.wq = {
    esc: function (s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    },
    parseKeys: function (text, max) {
      return String(text)
        .split(/[\s,;]+/)
        .filter(Boolean)
        .map(Number)
        .filter(function (x) {
          return Number.isInteger(x) && x >= 0 && x <= (max || 999);
        });
    },
    list: function (items) {
      if (items.length < 2) return String(items[0] === undefined ? "" : items[0]);
      return items.slice(0, -1).join(", ") + " and " + items[items.length - 1];
    },
    // Runs fn once the page is ready.
    ready: function (fn) {
      if (typeof document === "undefined") return;
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
      else fn();
    }
  };
})();
