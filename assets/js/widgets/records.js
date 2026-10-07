/* Record and page layout (widget V24).
   Two views:
   - "fixed": a file of fixed-length records. Deleted records form a free list
     that starts at the file header; an insert reuses the first free record.
   - "slotted": one block in the slotted-page structure. The header holds the
     number of entries, the end of free space and an entry (location, size) for
     each record. Records are packed at the end of the block.
   Markup: <div class="widget" data-widget="records" data-mode="slotted"></div> */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});
  var esc = function (s) {
    return D.wq.esc(s);
  };

  /* ---------- Fixed-length records ---------- */

  var EMP = [
    ["E101", "Arun", 42000],
    ["E102", "Bala", 38000],
    ["E103", "Chitra", 51000],
    ["E104", "Deepa", 45000],
    ["E105", "Ezhil", 39000],
    ["E106", "Farhan", 47000],
    ["E107", "Gowri", 44000],
    ["E108", "Hari", 40000],
    ["E109", "Indu", 53000],
    ["E110", "Jamal", 41000]
  ];
  var REC_SIZE = 29; // bytes, as in the class notes: EmpNo 4 + Ename 10 + Salary 5 + Phone 10

  function fixedStart() {
    var slots = [];
    for (var i = 0; i < 6; i++) slots.push({ rec: EMP[i], next: null });
    return { slots: slots, head: null, nextNew: 6 };
  }

  function cloneFixed(st) {
    return {
      slots: st.slots.map(function (s) {
        return { rec: s.rec, next: s.next };
      }),
      head: st.head,
      nextNew: st.nextNew
    };
  }

  function freeChain(st) {
    var chain = [];
    var at = st.head;
    while (at !== null && chain.length <= st.slots.length) {
      chain.push(at);
      at = st.slots[at].next;
    }
    return chain;
  }

  function chainText(st) {
    var c = freeChain(st);
    if (!c.length) return "The free list is empty.";
    return "Free list: header → " + c.map(function (i) {
      return "record " + (i + 1);
    }).join(" → ") + " → end.";
  }

  function fixedDelete(st0, i) {
    var st = cloneFixed(st0);
    var slot = st.slots[i];
    if (!slot || !slot.rec) return [{ st: st, msg: "Record " + (i + 1) + " is already free.", focus: i }];
    var name = slot.rec[1];
    slot.rec = null;
    slot.next = st.head;
    st.head = i;
    return [{
      st: st,
      focus: i,
      msg: "Delete record " + (i + 1) + " (" + name + "). The other records do not move. Record " + (i + 1) + " joins the front of the free list: the header now points to it, and it points to the old first free record. " + chainText(st)
    }];
  }

  function fixedInsert(st0) {
    var st = cloneFixed(st0);
    var rec = EMP[st.nextNew % EMP.length];
    st.nextNew += 1;
    if (st.head === null) {
      st.slots.push({ rec: rec, next: null });
      var at = st.slots.length - 1;
      return [{ st: st, focus: at, msg: "Insert " + rec[1] + ". The free list is empty, so the new record goes at the end of the file, as record " + (at + 1) + ". It starts at byte " + at * REC_SIZE + " (" + REC_SIZE + " × " + at + ")." }];
    }
    var i = st.head;
    st.head = st.slots[i].next;
    st.slots[i] = { rec: rec, next: null };
    return [{ st: st, focus: i, msg: "Insert " + rec[1] + ". The header points to record " + (i + 1) + ", so the new record goes there. The header now points to the next free record. " + chainText(st) }];
  }

  function renderFixed(w, f) {
    var st = f.st;
    var rows = st.slots.map(function (s, i) {
      var cls = (f.focus === i ? "is-focus " : "") + (s.rec ? "" : "is-free");
      var cells = s.rec
        ? "<td>" + s.rec[0] + "</td><td>" + esc(s.rec[1]) + "</td><td>" + s.rec[2] + "</td>"
        : '<td colspan="3" class="rec-freecell">free → ' + (s.next === null ? "end" : "record " + (s.next + 1)) + "</td>";
      var btn = s.rec ? '<button type="button" class="btn rec-del" data-del="' + i + '" aria-label="Delete record ' + (i + 1) + '">Delete</button>' : "";
      return '<tr class="' + cls + '"><th scope="row">Record ' + (i + 1) + '</th><td class="muted">' + i * REC_SIZE + "</td>" + cells + "<td>" + btn + "</td></tr>";
    }).join("");
    w.stage.innerHTML =
      '<p class="rec-header"><strong>File header:</strong> first free record = ' + (st.head === null ? "none" : "record " + (st.head + 1)) + "</p>" +
      '<table class="rec-table"><caption class="visually-hidden">Fixed-length records in the file</caption><thead><tr><th scope="col">Slot</th><th scope="col">Byte</th><th scope="col">EmpNo</th><th scope="col">Ename</th><th scope="col">Salary</th><th scope="col"><span class="visually-hidden">Action</span></th></tr></thead><tbody>' +
      rows + "</tbody></table>";
  }

  /* ---------- Slotted page ---------- */

  var BLOCK = 240; // bytes in the block (kept small so it is easy to see)
  var HEADER_FIXED = 8;
  var ENTRY = 4;
  var NAMES = [
    ["Arun", 28],
    ["Balasubramanian", 44],
    ["Chitra", 30],
    ["Deepa", 24],
    ["Mohammed Farhan", 40],
    ["Gowri", 26],
    ["Venkataraman", 36],
    ["Indu", 22]
  ];

  function slottedStart() {
    var st = { entries: [], end: BLOCK, nextNew: 0 };
    for (var i = 0; i < 3; i++) slottedPlace(st);
    return st;
  }

  function cloneSlotted(st) {
    return {
      entries: st.entries.map(function (e) {
        return e ? { name: e.name, loc: e.loc, size: e.size } : null;
      }),
      end: st.end,
      nextNew: st.nextNew
    };
  }

  function headerSize(st) {
    return HEADER_FIXED + ENTRY * st.entries.length;
  }

  // Puts the next record at the end of free space. Returns the slot or -1 when there is no room.
  function slottedPlace(st) {
    var r = NAMES[st.nextNew % NAMES.length];
    var reuse = st.entries.indexOf(null);
    var newHeader = headerSize(st) + (reuse === -1 ? ENTRY : 0);
    if (st.end - r[1] < newHeader) return -1;
    st.nextNew += 1;
    st.end -= r[1];
    var e = { name: r[0], loc: st.end, size: r[1] };
    if (reuse === -1) {
      st.entries.push(e);
      return st.entries.length - 1;
    }
    st.entries[reuse] = e;
    return reuse;
  }

  function slottedInsert(st0) {
    var st = cloneSlotted(st0);
    var r = NAMES[st.nextNew % NAMES.length];
    var slot = slottedPlace(st);
    if (slot === -1) {
      return [{ st: st, msg: "The record for " + r[0] + " needs " + r[1] + " bytes, but the free space is too small. It must go in another block." }];
    }
    var e = st.entries[slot];
    return [{
      st: st,
      focus: slot,
      msg: "Insert " + e.name + " (" + e.size + " bytes). It is placed just before the other records, at byte " + e.loc + ". Entry " + slot + " in the header stores its location " + e.loc + " and size " + e.size + ". The end of free space is now " + st.end + "."
    }];
  }

  function slottedDelete(st0, i) {
    var st = cloneSlotted(st0);
    var gone = st.entries[i];
    if (!gone) return [];
    var gap = cloneSlotted(st);
    gap.entries[i] = null;
    var frames = [{ st: gap, gap: { loc: gone.loc, size: gone.size }, msg: "Delete " + gone.name + ". Its space (" + gone.size + " bytes at byte " + gone.loc + ") becomes empty, and entry " + i + " is marked as deleted." }];
    // Records placed before it (lower addresses) move up to close the gap.
    var moved = [];
    st.entries[i] = null;
    st.entries.forEach(function (e, k) {
      if (e && e.loc < gone.loc) {
        e.loc += gone.size;
        moved.push(k);
      }
    });
    st.end += gone.size;
    frames.push({
      st: st,
      moved: moved,
      msg: (moved.length ? (moved.length === 1 ? "Record " : "Records ") + D.wq.list(moved.map(function (k) {
        return st.entries[k].name;
      })) + (moved.length === 1 ? " moves" : " move") + " right by " + gone.size + " bytes so that the free space stays in one piece. The header entries get the new locations. " : "No record needs to move. ") +
        "The end of free space is now " + st.end + ". Other parts of the database still find each record through its entry, so nothing outside the block changes."
    });
    return frames;
  }

  function renderSlotted(w, f) {
    var st = f.st;
    var h = headerSize(st);
    var pct = function (b) {
      return (b / BLOCK) * 100 + "%";
    };
    var bar = '<div class="slot-bar" role="img" aria-label="Block of ' + BLOCK + " bytes: header " + h + " bytes, free space " + (st.end - h) + " bytes, records " + (BLOCK - st.end) + ' bytes">';
    bar += '<span class="slot-part slot-head" style="left:0;width:' + pct(h) + '" title="Header">' + (h / BLOCK < 0.15 ? "H" : "Header") + "</span>";
    bar += '<span class="slot-part slot-free" style="left:' + pct(h) + ";width:" + pct(st.end - h) + '">Free space</span>';
    if (f.gap) bar += '<span class="slot-part slot-gap" style="left:' + pct(f.gap.loc) + ";width:" + pct(f.gap.size) + '"></span>';
    st.entries.forEach(function (e, k) {
      if (!e) return;
      var cls = "slot-part slot-rec" + (f.focus === k ? " is-focus" : "") + (f.moved && f.moved.indexOf(k) !== -1 ? " is-moved" : "");
      bar += '<span class="' + cls + '" style="left:' + pct(e.loc) + ";width:" + pct(e.size) + '" title="' + esc(e.name) + '">' + k + "</span>";
    });
    bar += "</div>";
    var scale = '<div class="slot-scale" aria-hidden="true"><span>0</span><span>' + BLOCK / 2 + "</span><span>" + BLOCK + "</span></div>";
    var rows = st.entries.map(function (e, k) {
      if (!e) return '<tr><th scope="row">' + k + '</th><td colspan="3" class="muted">deleted (can be reused)</td><td></td></tr>';
      return '<tr class="' + (f.focus === k ? "is-focus" : f.moved && f.moved.indexOf(k) !== -1 ? "is-moved" : "") + '"><th scope="row">' + k + "</th><td>" + esc(e.name) + "</td><td>" + e.loc + "</td><td>" + e.size + "</td>" +
        '<td><button type="button" class="btn rec-del" data-del="' + k + '" aria-label="Delete record ' + k + '">Delete</button></td></tr>';
    }).join("");
    w.stage.innerHTML =
      '<p class="rec-header"><strong>Block header:</strong> ' + st.entries.length + " entries · end of free space = byte " + st.end + "</p>" +
      bar + scale +
      '<table class="rec-table"><caption>Entries in the block header</caption><thead><tr><th scope="col">Entry</th><th scope="col">Record</th><th scope="col">Location</th><th scope="col">Size</th><th scope="col"><span class="visually-hidden">Action</span></th></tr></thead><tbody>' +
      rows + "</tbody></table>";
  }

  /* ---------- Widget ---------- */

  function Widget(root) {
    var self = this;
    this.mode = root.getAttribute("data-mode") === "fixed" ? "fixed" : "slotted";
    root.innerHTML =
      '<div class="widget-head"><strong>Record and page layout</strong></div>' +
      '<div class="widget-controls">' +
      '<label class="wp-field wp-grow"><span>Layout</span><select data-mode>' +
      '<option value="fixed">Fixed-length records with a free list</option>' +
      '<option value="slotted">Slotted page for variable-length records</option>' +
      "</select></label>" +
      '<button type="button" class="btn btn-primary" data-insert>Insert a record</button>' +
      "</div>" +
      '<div class="widget-stage rec-stage" tabindex="0" aria-label="Records in the file or block"></div>' +
      "<div data-player></div>";
    this.stage = root.querySelector(".rec-stage");
    this.modeSelect = root.querySelector("[data-mode]");
    this.player = new D.Player(root.querySelector("[data-player]"), {
      render: function (f) {
        if (self.mode === "fixed") renderFixed(self, f);
        else renderSlotted(self, f);
      },
      resetLabel: "Start again",
      onReset: function () {
        self.load();
      }
    });
    this.modeSelect.value = this.mode;
    this.modeSelect.addEventListener("change", function () {
      self.mode = self.modeSelect.value;
      self.load();
    });
    root.querySelector("[data-insert]").addEventListener("click", function () {
      var st = self.player.current().st;
      self.player.add(self.mode === "fixed" ? fixedInsert(st) : slottedInsert(st));
    });
    this.stage.addEventListener("click", function (e) {
      var b = e.target.closest("[data-del]");
      if (!b) return;
      var st = self.player.current().st;
      var i = Number(b.getAttribute("data-del"));
      self.player.add(self.mode === "fixed" ? fixedDelete(st, i) : slottedDelete(st, i));
    });
    this.load();
  }

  Widget.prototype.load = function () {
    if (this.mode === "fixed") {
      this.player.load([{ st: fixedStart(), msg: "Six employee records of " + REC_SIZE + " bytes each. Record i starts at byte " + REC_SIZE + " × (i − 1). Press Delete on a record, or try deleting records 1, 3 and 5 as in the class notes." }]);
    } else {
      this.player.load([{ st: slottedStart(), msg: "A block of " + BLOCK + " bytes with three variable-length records. The header is at the start of the block, and the records are packed at the end. Insert or delete a record." }]);
    }
  };

  D.records = { fixedStart: fixedStart, fixedDelete: fixedDelete, fixedInsert: fixedInsert, slottedStart: slottedStart, slottedInsert: slottedInsert, slottedDelete: slottedDelete, freeChain: freeChain };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="records"]').forEach(function (box) {
      new Widget(box);
    });
  });
})();
