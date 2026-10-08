/* SQL injection demo (widget V34).
   The student types into a pretend login form. The widget shows the query a
   careless server would build by joining strings, runs it against a tiny
   users table held in this script, and says whether the login worked. Then
   the student switches to a prepared statement and sees the same input fail.
   No real database is involved: a small parser here understands =, AND, OR,
   NOT, brackets, ; and comments, which is enough for the classic attacks.
   Markup: <div class="widget" data-widget="sql-injection"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});
  var esc = D.wq.esc;

  var USERS = [
    { username: "anitha", password: "Anitha@123" },
    { username: "admin", password: "Adm1n#Key" },
    { username: "bala", password: "Bala#2026" }
  ];
  var COLS = ["username", "password"];

  var PRESETS = [
    { name: "Normal login", u: "anitha", p: "Anitha@123" },
    { name: "Wrong password", u: "anitha", p: "guess" },
    { name: "' OR '1'='1", u: "anitha", p: "' OR '1'='1" },
    { name: "admin' -- ", u: "admin' -- ", p: "anything" },
    { name: "Stray quote", u: "o'brien", p: "x" },
    { name: "; DROP TABLE", u: "x'; DROP TABLE users; -- ", p: "x" }
  ];

  function SqlError(msg) {
    this.message = msg;
  }

  // Splits the WHERE part of a query into tokens. MySQL rules: '' inside a
  // string is one quote, a backslash escapes the next character, "-- "
  // (with a space after) and "#" start a comment.
  function tokenize(s) {
    var t = [];
    var i = 0;
    while (i < s.length) {
      var c = s[i];
      if (/\s/.test(c)) {
        i++;
      } else if (c === "-" && s[i + 1] === "-" && (i + 2 >= s.length || /\s/.test(s[i + 2]))) {
        t.push({ k: "comment", v: s.slice(i) });
        break;
      } else if (c === "#") {
        t.push({ k: "comment", v: s.slice(i) });
        break;
      } else if (c === "'") {
        var j = i + 1;
        var v = "";
        for (;;) {
          if (j >= s.length) throw new SqlError("a string is not closed: the quotes do not match");
          if (s[j] === "'") {
            if (s[j + 1] === "'") {
              v += "'";
              j += 2;
              continue;
            }
            break;
          }
          if (s[j] === "\\" && j + 1 < s.length) {
            v += s[j + 1];
            j += 2;
            continue;
          }
          v += s[j];
          j++;
        }
        t.push({ k: "str", v: v });
        i = j + 1;
      } else if (/[0-9]/.test(c)) {
        var n = i;
        while (n < s.length && /[0-9]/.test(s[n])) n++;
        t.push({ k: "num", v: Number(s.slice(i, n)) });
        i = n;
      } else if (/[A-Za-z_]/.test(c)) {
        var w = i;
        while (w < s.length && /[A-Za-z0-9_]/.test(s[w])) w++;
        var word = s.slice(i, w);
        var up = word.toUpperCase();
        t.push({ k: up === "AND" || up === "OR" || up === "NOT" ? up : "id", v: word });
        i = w;
      } else if ("=();".indexOf(c) >= 0) {
        t.push({ k: c, v: c });
        i++;
      } else {
        throw new SqlError("unexpected character " + c);
      }
    }
    return t;
  }

  // Recursive descent: expr = term {OR term}; term = factor {AND factor};
  // factor = NOT factor | ( expr ) | operand [= operand].
  function parse(tokens) {
    var at = 0;
    function peek() {
      return tokens[at] || { k: "end" };
    }
    function take(k) {
      var tk = peek();
      if (tk.k !== k) throw new SqlError("syntax error near " + (tk.v === undefined ? "the end" : "“" + tk.v + "”"));
      at++;
      return tk;
    }
    function operand() {
      var tk = peek();
      if (tk.k === "str" || tk.k === "num") {
        at++;
        return { lit: tk.v };
      }
      if (tk.k === "id") {
        at++;
        if (COLS.indexOf(tk.v.toLowerCase()) < 0) {
          var up = tk.v.toUpperCase();
          if (up === "UNION" || up === "SELECT" || up === "DROP" || up === "DELETE" || up === "UPDATE" || up === "INSERT")
            throw new SqlError("this demo does not run " + up + ", but a real server might");
          throw new SqlError("unknown column " + tk.v);
        }
        return { col: tk.v.toLowerCase() };
      }
      throw new SqlError("syntax error near " + (tk.v === undefined ? "the end" : "“" + tk.v + "”"));
    }
    function factor() {
      var tk = peek();
      if (tk.k === "NOT") {
        at++;
        return { not: factor() };
      }
      if (tk.k === "(") {
        at++;
        var e = expr();
        take(")");
        return e;
      }
      var a = operand();
      if (peek().k === "=") {
        at++;
        return { eq: [a, operand()] };
      }
      return { val: a };
    }
    function term() {
      var e = factor();
      while (peek().k === "AND") {
        at++;
        e = { and: [e, factor()] };
      }
      return e;
    }
    function expr() {
      var e = term();
      while (peek().k === "OR") {
        at++;
        e = { or: [e, term()] };
      }
      return e;
    }
    var tree = expr();
    if (peek().k !== "end" && peek().k !== "comment") take("end");
    return tree;
  }

  function value(o, row) {
    return "col" in o ? row[o.col] : o.lit;
  }

  // MySQL compares strings without case (default collation) and turns a
  // string into a number when it meets a number.
  function equal(a, b) {
    if (typeof a === "number" || typeof b === "number") return Number(parseFloat(a) || 0) === Number(parseFloat(b) || 0);
    return String(a).toLowerCase() === String(b).toLowerCase();
  }

  function truthy(v) {
    return typeof v === "number" ? v !== 0 : (parseFloat(v) || 0) !== 0;
  }

  function evaluate(e, row) {
    if (e.or) return evaluate(e.or[0], row) || evaluate(e.or[1], row);
    if (e.and) return evaluate(e.and[0], row) && evaluate(e.and[1], row);
    if (e.not) return !evaluate(e.not, row);
    if (e.eq) return equal(value(e.eq[0], row), value(e.eq[1], row));
    return truthy(value(e.val, row));
  }

  // Runs the unsafe query. Returns {rows, error, extra, comment}.
  function runUnsafe(u, p) {
    var where = "username = '" + u + "' AND password = '" + p + "'";
    var out = { rows: [], error: null, extra: null, comment: null };
    var tokens;
    try {
      tokens = tokenize(where);
    } catch (err) {
      out.error = err.message;
      return out;
    }
    var semi = -1;
    for (var i = 0; i < tokens.length; i++) {
      if (tokens[i].k === ";") {
        semi = i;
        break;
      }
    }
    if (semi >= 0) {
      var rest = tokens.slice(semi + 1).filter(function (tk) {
        return tk.k !== "comment";
      });
      out.extra = rest.map(function (tk) {
        return tk.k === "str" ? "'" + tk.v + "'" : tk.v;
      }).join(" ").replace(/ ;$/, ";");
      tokens = tokens.slice(0, semi);
    }
    tokens.forEach(function (tk) {
      if (tk.k === "comment") out.comment = tk.v;
    });
    try {
      var tree = parse(tokens);
      out.rows = USERS.filter(function (r) {
        return evaluate(tree, r);
      });
    } catch (err) {
      out.error = err.message;
    }
    return out;
  }

  function runPrepared(u, p) {
    return {
      rows: USERS.filter(function (r) {
        return equal(r.username, u) && equal(r.password, p);
      }),
      error: null,
      extra: null,
      comment: null
    };
  }

  function Widget(root) {
    var self = this;
    this.mode = "unsafe";
    root.innerHTML =
      '<div class="widget-head"><strong>SQL injection: a pretend login</strong></div>' +
      '<div class="widget-controls"><div class="seg" role="group" aria-label="How the server builds the query">' +
      '<button type="button" class="seg-btn" data-mode="unsafe">Joined strings (unsafe)</button>' +
      '<button type="button" class="seg-btn" data-mode="safe">Prepared statement (safe)</button>' +
      "</div></div>" +
      '<div class="widget-controls sqli-presets"><span class="sqli-try">Try:</span>' +
      PRESETS.map(function (pr, i) {
        return '<button type="button" class="btn sqli-preset" data-preset="' + i + '">' + esc(pr.name) + "</button>";
      }).join("") + "</div>" +
      '<div class="widget-stage sqli-stage">' +
      '<form class="sqli-form" autocomplete="off" onsubmit="return false">' +
      '<label class="wp-field"><span>Username</span><input type="text" data-u spellcheck="false" autocapitalize="off"></label>' +
      '<label class="wp-field"><span>Password (shown as text for the demo)</span><input type="text" data-p spellcheck="false" autocapitalize="off"></label>' +
      "</form>" +
      '<div class="sqli-label">Query sent to MySQL</div><pre class="sqli-query" data-query></pre>' +
      '<div data-params></div>' +
      '<div class="sqli-result" aria-live="polite" data-result></div>' +
      '<div class="sqli-label">Table users (inside the server)</div><div class="nm-scroll" data-table></div>' +
      "</div>";
    this.u = root.querySelector("[data-u]");
    this.p = root.querySelector("[data-p]");
    this.query = root.querySelector("[data-query]");
    this.params = root.querySelector("[data-params]");
    this.result = root.querySelector("[data-result]");
    this.table = root.querySelector("[data-table]");
    this.modeBtns = root.querySelectorAll("[data-mode]");
    this.modeBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        self.mode = b.getAttribute("data-mode");
        self.update();
      });
    });
    root.querySelectorAll("[data-preset]").forEach(function (b) {
      b.addEventListener("click", function () {
        var pr = PRESETS[Number(b.getAttribute("data-preset"))];
        self.u.value = pr.u;
        self.p.value = pr.p;
        self.update();
      });
    });
    this.u.addEventListener("input", function () {
      self.update();
    });
    this.p.addEventListener("input", function () {
      self.update();
    });
    this.u.value = PRESETS[0].u;
    this.p.value = PRESETS[0].p;
    this.update();
  }

  Widget.prototype.update = function () {
    var u = this.u.value;
    var p = this.p.value;
    var safe = this.mode === "safe";
    var mode = this.mode;
    this.modeBtns.forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === mode ? "true" : "false");
    });
    var mark = function (s) {
      return '<mark class="sqli-in">' + esc(s) + "</mark>";
    };
    if (safe) {
      this.query.innerHTML = "SELECT * FROM users\nWHERE username = <mark class=\"sqli-q\">?</mark> AND password = <mark class=\"sqli-q\">?</mark>;";
      this.params.innerHTML = '<div class="sqli-label">Values sent separately</div>' +
        '<ul class="sqli-params"><li>1st <code>?</code> = ' + mark(u) + "</li><li>2nd <code>?</code> = " + mark(p) + "</li></ul>";
    } else {
      this.query.innerHTML = "SELECT * FROM users\nWHERE username = '" + mark(u) + "' AND password = '" + mark(p) + "';";
      this.params.innerHTML = "";
    }
    var r = safe ? runPrepared(u, p) : runUnsafe(u, p);
    var quote = /['\\]/.test(u + p) || /(^|\s)(--|#)/.test(u + p);
    var html;
    var tone;
    if (r.error) {
      tone = "wait";
      html = "<strong>Error from MySQL:</strong> " + esc(r.error) + ".";
      if (quote) html += " The quote in the input broke the query. An error like this tells an attacker that the input reaches the SQL, so they keep trying.";
    } else if (r.rows.length) {
      var ok = !quote || safe;
      tone = ok ? "ok" : "bad";
      html = "<strong>Logged in as " + esc(r.rows[0].username) + ".</strong> ";
      if (!ok) html += r.rows.length > 1 ? "The query matched " + r.rows.length + " rows, so the server took the first one. " : "";
      if (!ok) html += "Danger: a quote in the input ended the string early, so the rest of the input ran as SQL. The login check passed without the right password.";
      else html += "The username and password matched one row.";
    } else {
      tone = "wait";
      html = "<strong>Login failed.</strong> No row matched.";
      if (safe && quote) html += " The quotes and dashes are just characters in the value. They cannot change the query, so the attack fails.";
    }
    if (r.comment && !safe) html += " The part after <code>--</code> or <code>#</code> is a comment, so MySQL ignores the password check.";
    if (r.extra && !safe) html += " After the <code>;</code> comes a second statement: <code>" + esc(r.extra) + "</code>. MySQL drivers refuse two statements in one call by default, but if that is turned on, it would run too.";
    this.result.className = "sqli-result nm-" + tone;
    this.result.innerHTML = html;
    var hit = r.rows;
    this.table.innerHTML = '<table class="nm-table"><thead><tr><th scope="col">username</th><th scope="col">password</th></tr></thead><tbody>' +
      USERS.map(function (row) {
        return "<tr" + (hit.indexOf(row) >= 0 ? ' class="sqli-hit"' : "") + "><td>" + row.username + "</td><td>" + esc(row.password) + "</td></tr>";
      }).join("") + "</tbody></table>";
  };

  D.sqlInjection = { tokenize: tokenize, parse: parse, runUnsafe: runUnsafe, runPrepared: runPrepared, USERS: USERS };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="sql-injection"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
