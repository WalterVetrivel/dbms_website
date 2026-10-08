/* E-R diagrams in Chen notation, and the E-R notation explorer (widget V6).
   D.er.draw(model, opts) returns the SVG for one diagram. The same models are
   used by the ER-to-relational mapping stepper (widget V7).

   In the explorer, the student taps a symbol type to highlight every shape of
   that type, or taps a shape in the diagram to read what it means. A select
   changes the cardinality of one relationship and explains the result.
   Markup: <div class="widget" data-widget="er-notation" data-model="university"></div>
   data-model is university, bank or insurance. */
(function () {
  "use strict";
  var D = (window.DBMS = window.DBMS || {});

  // Node types: entity, weak, attr, rel, identifying. An attribute names its owner
  // with "of"; key is "pk" or "partial"; multi and derived are flags.
  // Edges join a relationship to an entity with a cardinality label and an
  // optional total (double line) participation.
  var MODELS = {
    university: {
      title: "University",
      width: 1000,
      height: 690,
      nodes: [
        { id: "Student", type: "entity", x: 140, y: 290, desc: "Student is a strong entity set: the set of all students. Its key is ID." },
        { id: "s_id", label: "ID", type: "attr", of: "Student", key: "pk", x: 55, y: 195, desc: "ID is the key attribute of Student. Its name is underlined: no two students have the same ID." },
        { id: "s_name", label: "Name", type: "attr", of: "Student", x: 170, y: 180, desc: "Name is a composite attribute. It is made of the sub-attributes First and Last." },
        { id: "s_first", label: "First", type: "attr", of: "s_name", x: 105, y: 92, desc: "First is a sub-attribute (component) of the composite attribute Name." },
        { id: "s_last", label: "Last", type: "attr", of: "s_name", x: 235, y: 92, desc: "Last is a sub-attribute (component) of the composite attribute Name." },
        { id: "s_phone", label: "Phone", type: "attr", of: "Student", multi: true, x: 290, y: 200, desc: "Phone is a multivalued attribute (double ellipse). One student can have several phone numbers." },
        { id: "s_dob", label: "DOB", type: "attr", of: "Student", x: 55, y: 390, desc: "DOB (date of birth) is a simple, single-valued, stored attribute. Age is derived from it." },
        { id: "s_age", label: "Age", type: "attr", of: "Student", derived: true, x: 150, y: 425, desc: "Age is a derived attribute (dashed ellipse). The DBMS calculates it from DOB, so it is not stored." },
        { id: "Takes", type: "rel", x: 430, y: 290, desc: "Takes is a relationship set between Student and Course. It has its own attribute, Grade." },
        { id: "t_grade", label: "Grade", type: "attr", of: "Takes", x: 430, y: 195, desc: "Grade is a descriptive attribute of the relationship Takes. A grade belongs to one student in one course, not to either one alone." },
        { id: "Course", type: "entity", x: 720, y: 290, desc: "Course is a strong entity set. Its key is CourseID." },
        { id: "c_id", label: "CourseID", type: "attr", of: "Course", key: "pk", x: 625, y: 190, desc: "CourseID is the key attribute of Course." },
        { id: "c_title", label: "Title", type: "attr", of: "Course", x: 745, y: 175, desc: "Title is a simple attribute of Course." },
        { id: "c_credits", label: "Credits", type: "attr", of: "Course", x: 860, y: 205, desc: "Credits is a simple attribute of Course." },
        { id: "Advisor", type: "rel", x: 270, y: 470, desc: "Advisor is a relationship set between Instructor and Student." },
        { id: "Instructor", type: "entity", x: 440, y: 570, desc: "Instructor is a strong entity set. Its key is InstID." },
        { id: "i_id", label: "InstID", type: "attr", of: "Instructor", key: "pk", x: 295, y: 630, desc: "InstID is the key attribute of Instructor." },
        { id: "i_name", label: "IName", type: "attr", of: "Instructor", x: 440, y: 655, desc: "IName is a simple attribute of Instructor." },
        { id: "i_salary", label: "Salary", type: "attr", of: "Instructor", x: 580, y: 640, desc: "Salary is a simple attribute of Instructor." },
        { id: "Teaches", type: "rel", x: 600, y: 445, desc: "Teaches is a relationship set between Instructor and Course." },
        { id: "Sec_of", type: "identifying", x: 880, y: 380, desc: "Sec_of is an identifying relationship (double diamond). It links the weak entity set Section to its owner, Course." },
        { id: "Section", type: "weak", x: 880, y: 525, desc: "Section is a weak entity set (double rectangle). Section 1 exists in many courses, so a section is identified only together with its course: (CourseID, SecNo)." },
        { id: "sec_no", label: "SecNo", type: "attr", of: "Section", key: "partial", x: 810, y: 625, desc: "SecNo is the partial key (discriminator) of Section, shown with a dashed underline. It is unique only within one course." },
        { id: "sec_sem", label: "Semester", type: "attr", of: "Section", x: 935, y: 640, desc: "Semester is a simple attribute of Section." }
      ],
      edges: [
        { rel: "Takes", ent: "Student", card: "M" },
        { rel: "Takes", ent: "Course", card: "N" },
        { rel: "Advisor", ent: "Instructor", card: "1" },
        { rel: "Advisor", ent: "Student", card: "N", total: true, why: "Every student must have an advisor, so Student has total participation in Advisor." },
        { rel: "Teaches", ent: "Instructor", card: "M" },
        { rel: "Teaches", ent: "Course", card: "N" },
        { rel: "Sec_of", ent: "Course", card: "1" },
        { rel: "Sec_of", ent: "Section", card: "N", total: true, why: "Every section must belong to a course, so Section has total participation in Sec_of. A weak entity set always has total participation in its identifying relationship." }
      ],
      cardRel: {
        rel: "Advisor",
        ends: ["Instructor", "Student"],
        options: [
          { label: "1 : N (one instructor, many students)", cards: ["1", "N"], text: "1 : N. One instructor can advise many students, but each student has at most one advisor." },
          { label: "1 : 1", cards: ["1", "1"], text: "1 : 1. An instructor advises at most one student, and a student has at most one advisor." },
          { label: "N : 1", cards: ["N", "1"], text: "N : 1. A student can have many advisors, but an instructor advises at most one student." },
          { label: "M : N", cards: ["M", "N"], text: "M : N. An instructor can advise many students, and a student can have many advisors." }
        ]
      }
    },

    bank: {
      title: "Bank",
      width: 1000,
      height: 700,
      nodes: [
        { id: "Customer", type: "entity", x: 150, y: 300, desc: "Customer is a strong entity set with the key CustID." },
        { id: "cu_id", label: "CustID", type: "attr", of: "Customer", key: "pk", x: 60, y: 200, desc: "CustID is the key attribute of Customer." },
        { id: "cu_name", label: "CName", type: "attr", of: "Customer", x: 175, y: 190, desc: "CName is a simple attribute of Customer." },
        { id: "cu_phone", label: "Phone", type: "attr", of: "Customer", multi: true, x: 300, y: 300, desc: "Phone is a multivalued attribute. A customer can give more than one phone number." },
        { id: "cu_addr", label: "Address", type: "attr", of: "Customer", x: 85, y: 415, desc: "Address is a composite attribute made of Street and City." },
        { id: "cu_street", label: "Street", type: "attr", of: "cu_addr", x: 50, y: 515, desc: "Street is a sub-attribute of Address." },
        { id: "cu_city", label: "City", type: "attr", of: "cu_addr", x: 160, y: 530, desc: "City is a sub-attribute of Address." },
        { id: "Depositor", type: "rel", x: 370, y: 170, desc: "Depositor links customers to the accounts they hold." },
        { id: "Account", type: "entity", x: 590, y: 170, desc: "Account is a strong entity set with the key AccNo." },
        { id: "ac_no", label: "AccNo", type: "attr", of: "Account", key: "pk", x: 525, y: 70, desc: "AccNo is the key attribute of Account." },
        { id: "ac_bal", label: "Balance", type: "attr", of: "Account", x: 660, y: 70, desc: "Balance is a simple attribute of Account." },
        { id: "Borrower", type: "rel", x: 370, y: 430, desc: "Borrower links customers to the loans they have taken." },
        { id: "Loan", type: "entity", x: 590, y: 430, desc: "Loan is a strong entity set with the key LoanNo." },
        { id: "lo_no", label: "LoanNo", type: "attr", of: "Loan", key: "pk", x: 495, y: 530, desc: "LoanNo is the key attribute of Loan." },
        { id: "lo_amt", label: "Amount", type: "attr", of: "Loan", x: 610, y: 550, desc: "Amount is a simple attribute of Loan." },
        { id: "Acc_branch", type: "rel", x: 730, y: 235, desc: "Acc_branch records which branch holds each account." },
        { id: "Loan_branch", type: "rel", x: 730, y: 365, desc: "Loan_branch records which branch gave each loan." },
        { id: "Branch", type: "entity", x: 870, y: 300, desc: "Branch is a strong entity set with the key BranchName." },
        { id: "br_name", label: "BranchName", type: "attr", of: "Branch", key: "pk", x: 920, y: 200, desc: "BranchName is the key attribute of Branch." },
        { id: "br_city", label: "City", type: "attr", of: "Branch", x: 945, y: 395, desc: "City is a simple attribute of Branch." },
        { id: "Loan_pay", type: "identifying", x: 760, y: 500, desc: "Loan_pay is the identifying relationship between Loan and its weak entity set Payment." },
        { id: "Payment", type: "weak", x: 880, y: 585, desc: "Payment is a weak entity set. Payment number 1 exists for many loans, so a payment is identified by (LoanNo, PayNo)." },
        { id: "pa_no", label: "PayNo", type: "attr", of: "Payment", key: "partial", x: 780, y: 660, desc: "PayNo is the partial key (discriminator) of Payment." },
        { id: "pa_amt", label: "PayAmount", type: "attr", of: "Payment", x: 920, y: 668, desc: "PayAmount is a simple attribute of Payment." }
      ],
      edges: [
        { rel: "Depositor", ent: "Customer", card: "M" },
        { rel: "Depositor", ent: "Account", card: "N", total: true, why: "Every account belongs to at least one customer, so Account has total participation in Depositor." },
        { rel: "Borrower", ent: "Customer", card: "M" },
        { rel: "Borrower", ent: "Loan", card: "N", total: true, why: "Every loan has at least one borrower, so Loan has total participation in Borrower." },
        { rel: "Acc_branch", ent: "Account", card: "N", total: true, why: "Every account is held at a branch." },
        { rel: "Acc_branch", ent: "Branch", card: "1" },
        { rel: "Loan_branch", ent: "Loan", card: "N", total: true, why: "Every loan is given by a branch." },
        { rel: "Loan_branch", ent: "Branch", card: "1" },
        { rel: "Loan_pay", ent: "Loan", card: "1" },
        { rel: "Loan_pay", ent: "Payment", card: "N", total: true, why: "A payment cannot exist without its loan, so Payment has total participation in Loan_pay." }
      ],
      cardRel: {
        rel: "Borrower",
        ends: ["Customer", "Loan"],
        options: [
          { label: "M : N (joint loans allowed)", cards: ["M", "N"], text: "M : N. A customer can take many loans, and one loan can have many borrowers (a joint home loan)." },
          { label: "1 : N", cards: ["1", "N"], text: "1 : N. A customer can take many loans, but each loan has only one borrower." },
          { label: "1 : 1", cards: ["1", "1"], text: "1 : 1. A customer can take at most one loan, and each loan has one borrower." },
          { label: "N : 1", cards: ["N", "1"], text: "N : 1. A loan can have many borrowers, but a customer can take at most one loan." }
        ]
      }
    },

    insurance: {
      title: "Car insurance",
      width: 1020,
      height: 700,
      nodes: [
        { id: "Customer", type: "entity", x: 140, y: 175, desc: "Customer is a strong entity set with the key CustID." },
        { id: "cu_id", label: "CustID", type: "attr", of: "Customer", key: "pk", x: 60, y: 75, desc: "CustID is the key attribute of Customer." },
        { id: "cu_name", label: "CName", type: "attr", of: "Customer", x: 185, y: 65, desc: "CName is a simple attribute of Customer." },
        { id: "cu_addr", label: "Address", type: "attr", of: "Customer", x: 85, y: 285, desc: "Address is a simple attribute of Customer here." },
        { id: "Owns", type: "rel", x: 340, y: 175, desc: "Owns links each customer to the cars they own." },
        { id: "Car", type: "entity", x: 545, y: 175, desc: "Car is a strong entity set with the key LicenseNo." },
        { id: "ca_lic", label: "LicenseNo", type: "attr", of: "Car", key: "pk", x: 465, y: 70, desc: "LicenseNo (the registration number) is the key attribute of Car." },
        { id: "ca_model", label: "Model", type: "attr", of: "Car", x: 590, y: 60, desc: "Model is a simple attribute of Car." },
        { id: "ca_year", label: "Year", type: "attr", of: "Car", x: 690, y: 85, desc: "Year is a simple attribute of Car." },
        { id: "Participated", type: "rel", x: 545, y: 345, desc: "Participated links cars to the accidents they were in." },
        { id: "pa_dmg", label: "DamageAmt", type: "attr", of: "Participated", x: 380, y: 345, desc: "DamageAmt is an attribute of the relationship: it is the damage to one car in one accident." },
        { id: "Accident", type: "entity", x: 545, y: 500, desc: "Accident is a strong entity set with the key ReportNo." },
        { id: "ac_no", label: "ReportNo", type: "attr", of: "Accident", key: "pk", x: 425, y: 590, desc: "ReportNo is the key attribute of Accident." },
        { id: "ac_date", label: "AccDate", type: "attr", of: "Accident", x: 555, y: 615, desc: "AccDate is a simple attribute of Accident." },
        { id: "ac_place", label: "Place", type: "attr", of: "Accident", x: 670, y: 590, desc: "Place is a simple attribute of Accident." },
        { id: "Covers", type: "rel", x: 730, y: 255, desc: "Covers links each policy to the cars it covers." },
        { id: "Policy", type: "entity", x: 860, y: 340, desc: "Policy is a strong entity set with the key PolicyID." },
        { id: "po_id", label: "PolicyID", type: "attr", of: "Policy", key: "pk", x: 945, y: 255, desc: "PolicyID is the key attribute of Policy." },
        { id: "Pays", type: "identifying", x: 860, y: 470, desc: "Pays is the identifying relationship between Policy and its weak entity set Premium_payment." },
        { id: "Premium", label: "Premium_payment", type: "weak", x: 860, y: 580, desc: "Premium_payment is a weak entity set. Payment number 3 exists for many policies, so a payment is identified by (PolicyID, PayNo)." },
        { id: "pr_no", label: "PayNo", type: "attr", of: "Premium", key: "partial", x: 735, y: 655, desc: "PayNo is the partial key (discriminator) of Premium_payment." },
        { id: "pr_due", label: "DueDate", type: "attr", of: "Premium", x: 860, y: 670, desc: "DueDate is when the payment must be made." },
        { id: "pr_paid", label: "PaidOn", type: "attr", of: "Premium", x: 975, y: 650, desc: "PaidOn is the date the payment was received." }
      ],
      edges: [
        { rel: "Owns", ent: "Customer", card: "1", total: true, why: "Every customer owns one or more cars, so Customer has total participation in Owns." },
        { rel: "Owns", ent: "Car", card: "N", total: true, why: "We assume every car in the database has an owner." },
        { rel: "Participated", ent: "Car", card: "M" },
        { rel: "Participated", ent: "Accident", card: "N", total: true, why: "Every recorded accident involves at least one car. A car can have zero accidents, so Car has partial participation." },
        { rel: "Covers", ent: "Policy", card: "1", total: true, why: "Each policy covers one or more cars, so Policy has total participation in Covers." },
        { rel: "Covers", ent: "Car", card: "N" },
        { rel: "Pays", ent: "Policy", card: "1" },
        { rel: "Pays", ent: "Premium", card: "N", total: true, why: "A premium payment cannot exist without its policy." }
      ],
      cardRel: {
        rel: "Owns",
        ends: ["Customer", "Car"],
        options: [
          { label: "1 : N (one owner per car)", cards: ["1", "N"], text: "1 : N. A customer can own many cars, and each car has one owner." },
          { label: "M : N", cards: ["M", "N"], text: "M : N. A customer can own many cars, and a car can be owned jointly by many customers." },
          { label: "1 : 1", cards: ["1", "1"], text: "1 : 1. A customer owns at most one car, and a car has one owner. This breaks the rule \"one or more cars each\"." }
        ]
      }
    }
  };

  var SYMBOLS = [
    { kind: "entity", name: "Entity set", shape: "Rectangle", text: "A set of entities of the same type, such as all students. Each entity is a real-world thing that can be told apart from others." },
    { kind: "weak", name: "Weak entity set", shape: "Double rectangle", text: "An entity set that has no key of its own. It is identified through an owner (identifying) entity set." },
    { kind: "attr", name: "Attribute", shape: "Ellipse", text: "A property of an entity or of a relationship, joined to it by a line." },
    { kind: "pk", name: "Key attribute", shape: "Ellipse, name underlined", text: "An attribute whose value is different for every entity in the set." },
    { kind: "partial", name: "Partial key", shape: "Ellipse, dashed underline", text: "The discriminator of a weak entity set. It is unique only within one owner entity." },
    { kind: "composite", name: "Composite attribute", shape: "Ellipse with sub-attributes", text: "An attribute made of smaller parts, such as Name = First + Last." },
    { kind: "multi", name: "Multivalued attribute", shape: "Double ellipse", text: "An attribute that can have a set of values for one entity, such as many phone numbers." },
    { kind: "derived", name: "Derived attribute", shape: "Dashed ellipse", text: "An attribute calculated from another attribute, such as Age from date of birth." },
    { kind: "rel", name: "Relationship set", shape: "Diamond", text: "An association among two or more entity sets." },
    { kind: "identifying", name: "Identifying relationship", shape: "Double diamond", text: "The relationship that links a weak entity set to its owner." },
    { kind: "total", name: "Total participation", shape: "Double line", text: "Every entity in the set must take part in the relationship. A single line means partial participation: some entities may not take part." },
    { kind: "card", name: "Mapping cardinality", shape: "1, N and M on the lines", text: "How many entities on one side can be linked with one entity on the other side: 1 : 1, 1 : N, N : 1 or M : N." }
  ];

  function nodeOf(m, id) {
    for (var i = 0; i < m.nodes.length; i++) if (m.nodes[i].id === id) return m.nodes[i];
    return null;
  }

  function label(n) {
    return n.label || n.id;
  }

  // The kinds of one node, used for highlighting.
  function kindsOf(m, n) {
    var k = [n.type];
    if (n.type === "attr") {
      if (n.key === "pk") k.push("pk");
      if (n.key === "partial") k.push("partial");
      if (n.multi) k.push("multi");
      if (n.derived) k.push("derived");
      if (m.nodes.some(function (c) { return c.of === n.id && c.type === "attr"; })) k.push("composite");
    }
    return k;
  }

  function textW(s) {
    return String(s).length * 9.4;
  }

  function size(n) {
    var t = label(n);
    if (n.type === "entity" || n.type === "weak") return { w: Math.max(116, textW(t) + 28), h: 50 };
    if (n.type === "rel" || n.type === "identifying") return { w: Math.max(124, textW(t) + 44), h: 66 };
    return { rx: Math.max(40, textW(t) / 2 + 14), ry: 23 };
  }

  function line(a, b, cls, off) {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    var ox = (-dy / len) * (off || 0);
    var oy = (dx / len) * (off || 0);
    return '<line class="' + cls + '" x1="' + (a.x + ox).toFixed(1) + '" y1="' + (a.y + oy).toFixed(1) + '" x2="' + (b.x + ox).toFixed(1) + '" y2="' + (b.y + oy).toFixed(1) + '"/>';
  }

  // opts: { cards: {edgeIndex: label}, hidden: {nodeId: true}, mark: {nodeId: "on"|"done"} }
  function draw(m, opts) {
    opts = opts || {};
    var esc = D.wq.esc;
    var hidden = opts.hidden || {};
    var mark = opts.mark || {};
    var out = [];
    out.push('<svg class="er-svg" viewBox="0 0 ' + m.width + " " + m.height + '" width="' + m.width + '" height="' + m.height + '" role="img" aria-labelledby="' + (opts.titleId || "") + '">');
    if (opts.titleId) out.push('<title id="' + opts.titleId + '">' + esc(m.title + " E-R diagram in Chen notation") + "</title>");
    // Lines first, so the shapes cover their ends.
    m.nodes.forEach(function (n) {
      if (n.type !== "attr" || hidden[n.id]) return;
      var o = nodeOf(m, n.of);
      out.push('<g data-node="' + n.id + '">' + line(n, o, "er-line") + "</g>");
    });
    m.edges.forEach(function (e, i) {
      var r = nodeOf(m, e.rel);
      var en = nodeOf(m, e.ent);
      if (hidden[r.id] || hidden[en.id]) return;
      var parts = e.total ? line(r, en, "er-line", 2.6) + line(r, en, "er-line", -2.6) : line(r, en, "er-line");
      var card = (opts.cards && opts.cards[i]) || e.card;
      // The label sits beside the middle of the line.
      var lx = r.x + (en.x - r.x) * 0.5;
      var ly = r.y + (en.y - r.y) * 0.5;
      var dx = en.x - r.x;
      var dy = en.y - r.y;
      var len = Math.sqrt(dx * dx + dy * dy) || 1;
      lx += (-dy / len) * 13;
      ly += (dx / len) * 13;
      out.push('<g class="er-edge' + (e.total ? " is-total" : "") + '" data-edge="' + i + '">' + line(r, en, "er-hit") + parts +
        '<text class="er-card" x="' + lx.toFixed(1) + '" y="' + (ly + 5).toFixed(1) + '" text-anchor="middle">' + esc(card) + "</text></g>");
    });
    m.nodes.forEach(function (n) {
      if (hidden[n.id]) return;
      var s = size(n);
      var t = esc(label(n));
      var cls = "er-node er-" + n.type + (mark[n.id] ? " is-" + mark[n.id] : "");
      var shape = "";
      if (n.type === "entity" || n.type === "weak") {
        shape = '<rect class="er-shape" x="' + (n.x - s.w / 2) + '" y="' + (n.y - s.h / 2) + '" width="' + s.w + '" height="' + s.h + '" rx="2"/>';
        if (n.type === "weak") shape += '<rect class="er-inner" x="' + (n.x - s.w / 2 + 5) + '" y="' + (n.y - s.h / 2 + 5) + '" width="' + (s.w - 10) + '" height="' + (s.h - 10) + '" rx="1"/>';
      } else if (n.type === "rel" || n.type === "identifying") {
        var pts = function (k) {
          var w = s.w / 2 - k * 1.7;
          var h = s.h / 2 - k;
          return n.x + "," + (n.y - h) + " " + (n.x + w) + "," + n.y + " " + n.x + "," + (n.y + h) + " " + (n.x - w) + "," + n.y;
        };
        shape = '<polygon class="er-shape" points="' + pts(0) + '"/>';
        if (n.type === "identifying") shape += '<polygon class="er-inner" points="' + pts(6) + '"/>';
      } else {
        shape = '<ellipse class="er-shape' + (n.derived ? " is-dashed" : "") + '" cx="' + n.x + '" cy="' + n.y + '" rx="' + s.rx + '" ry="' + s.ry + '"/>';
        if (n.multi) shape += '<ellipse class="er-inner" cx="' + n.x + '" cy="' + n.y + '" rx="' + (s.rx - 5) + '" ry="' + (s.ry - 5) + '"/>';
      }
      var under = "";
      if (n.key) {
        var w = textW(label(n));
        under = '<line class="er-under' + (n.key === "partial" ? " is-dashed" : "") + '" x1="' + (n.x - w / 2) + '" y1="' + (n.y + 9) + '" x2="' + (n.x + w / 2) + '" y2="' + (n.y + 9) + '"/>';
      }
      out.push('<g class="' + cls + '" data-node="' + n.id + '" data-kinds="' + kindsOf(m, n).join(" ") + '"' +
        (opts.interactive ? ' tabindex="0" role="button" aria-label="' + t + '"' : "") + ">" + shape +
        '<text class="er-text' + (n.type === "entity" || n.type === "weak" || n.type === "rel" || n.type === "identifying" ? " is-bold" : "") + '" x="' + n.x + '" y="' + (n.y + 5.5) + '" text-anchor="middle">' + t + "</text>" + under + "</g>");
    });
    out.push("</svg>");
    return out.join("");
  }

  // A plain-text list of the diagram, used as the text alternative.
  function describe(m) {
    var lines = [];
    m.nodes.forEach(function (n) {
      if (n.type !== "entity" && n.type !== "weak") return;
      var attrs = m.nodes.filter(function (a) { return a.of === n.id; }).map(function (a) {
        var subs = m.nodes.filter(function (c) { return c.of === a.id; }).map(label);
        return label(a) + (a.key === "pk" ? " (key)" : a.key === "partial" ? " (partial key)" : "") + (a.multi ? " (multivalued)" : "") + (a.derived ? " (derived)" : "") + (subs.length ? " (composite: " + subs.join(", ") + ")" : "");
      });
      lines.push((n.type === "weak" ? "Weak entity set " : "Entity set ") + label(n) + ": " + attrs.join(", ") + ".");
    });
    m.nodes.forEach(function (n) {
      if (n.type !== "rel" && n.type !== "identifying") return;
      var ends = m.edges.filter(function (e) { return e.rel === n.id; }).map(function (e) {
        return label(nodeOf(m, e.ent)) + " (" + e.card + (e.total ? ", total" : "") + ")";
      });
      var attrs = m.nodes.filter(function (a) { return a.of === n.id; }).map(label);
      lines.push((n.type === "identifying" ? "Identifying relationship " : "Relationship ") + n.id + " between " + ends.join(" and ") + (attrs.length ? ", with attribute " + attrs.join(", ") : "") + ".");
    });
    return lines;
  }

  D.er = { MODELS: MODELS, draw: draw, describe: describe, nodeOf: nodeOf, label: label };

  // ---------- The notation explorer (V6) ----------
  function Explorer(root) {
    var self = this;
    var esc = D.wq.esc;
    var key = MODELS[root.getAttribute("data-model")] ? root.getAttribute("data-model") : "university";
    this.m = MODELS[key];
    this.cards = {};
    this.uid = "er-" + key + "-" + Math.floor(Math.random() * 1e6);
    var cr = this.m.cardRel;
    var used = SYMBOLS.filter(function (s) {
      return s.kind === "total" || s.kind === "card" || self.m.nodes.some(function (n) { return kindsOf(self.m, n).indexOf(s.kind) >= 0; });
    });
    root.innerHTML =
      '<div class="widget-head"><strong>E-R notation explorer: ' + esc(this.m.title) + "</strong></div>" +
      '<div class="widget-controls er-symbols" role="group" aria-label="Symbol types">' +
      used.map(function (s) {
        return '<button type="button" class="btn er-sym" data-kind="' + s.kind + '" aria-pressed="false">' + esc(s.name) + "</button>";
      }).join("") + "</div>" +
      '<div class="widget-stage er-stage"></div>' +
      '<div class="widget-controls"><label class="wp-field wp-grow"><span>Cardinality of ' + esc(cr.rel) + " (" + esc(cr.ends.join(" : ")) + ")</span><select data-card>" +
      cr.options.map(function (o, i) {
        return '<option value="' + i + '">' + esc(o.label) + "</option>";
      }).join("") + '</select></label><button type="button" class="btn" data-clear>Clear</button></div>' +
      '<p class="widget-narration" aria-live="polite"></p>' +
      '<details class="bpt-text"><summary>Text version of the diagram</summary>' +
      describe(this.m).map(function (l) { return "<p>" + esc(l) + "</p>"; }).join("") + "</details>";
    this.stage = root.querySelector(".er-stage");
    this.say = root.querySelector(".widget-narration");
    this.buttons = root.querySelectorAll(".er-sym");
    this.buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        self.pick(b.getAttribute("data-kind"));
      });
    });
    root.querySelector("[data-card]").addEventListener("change", function (ev) {
      var o = cr.options[Number(ev.target.value)];
      self.setCards(o);
    });
    root.querySelector("[data-clear]").addEventListener("click", function () {
      self.pick(null);
    });
    this.stage.addEventListener("click", function (ev) {
      var g = ev.target.closest("[data-node],[data-edge]");
      if (g) self.tap(g);
    });
    this.stage.addEventListener("keydown", function (ev) {
      if (ev.key !== "Enter" && ev.key !== " ") return;
      var g = ev.target.closest("[data-node]");
      if (g) {
        ev.preventDefault();
        self.tap(g);
      }
    });
    this.render();
    this.say.textContent = "Tap a symbol type above, or tap any shape in the diagram, to see what it means.";
  }

  Explorer.prototype.render = function () {
    this.stage.innerHTML = draw(this.m, { cards: this.cards, interactive: true, titleId: this.uid });
  };

  Explorer.prototype.clearMarks = function () {
    this.stage.querySelectorAll(".is-hl").forEach(function (x) { x.classList.remove("is-hl"); });
    this.stage.querySelector("svg").classList.remove("is-dim");
    this.buttons.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
  };

  Explorer.prototype.pick = function (kind) {
    this.clearMarks();
    if (!kind) {
      this.say.textContent = "Tap a symbol type above, or tap any shape in the diagram, to see what it means.";
      return;
    }
    var s = SYMBOLS.filter(function (x) { return x.kind === kind; })[0];
    var svg = this.stage.querySelector("svg");
    var hits = [];
    var m = this.m;
    if (kind === "total") {
      svg.querySelectorAll(".er-edge.is-total").forEach(function (g) {
        g.classList.add("is-hl");
        var e = m.edges[Number(g.getAttribute("data-edge"))];
        hits.push(label(nodeOf(m, e.ent)) + " in " + e.rel);
      });
    } else if (kind === "card") {
      svg.querySelectorAll(".er-edge").forEach(function (g) { g.classList.add("is-hl"); });
    } else {
      svg.querySelectorAll(".er-node").forEach(function (g) {
        if ((" " + g.getAttribute("data-kinds") + " ").indexOf(" " + kind + " ") >= 0) {
          g.classList.add("is-hl");
          hits.push(g.textContent);
        }
      });
    }
    svg.classList.add("is-dim");
    this.buttons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-kind") === kind));
    });
    this.say.textContent = s.name + " (" + s.shape.toLowerCase() + "): " + s.text + (hits.length ? " In this diagram: " + D.wq.list(hits) + "." : "");
  };

  Explorer.prototype.tap = function (g) {
    this.clearMarks();
    var m = this.m;
    g.classList.add("is-hl");
    this.stage.querySelector("svg").classList.add("is-dim");
    if (g.hasAttribute("data-edge")) {
      var e = m.edges[Number(g.getAttribute("data-edge"))];
      var c = this.cards[Number(g.getAttribute("data-edge"))] || e.card;
      this.say.textContent = "This line joins " + label(nodeOf(m, e.ent)) + " to " + e.rel + ". The label " + c + " is its side of the mapping cardinality. " +
        (e.total ? (e.why || "") + " The double line shows total participation." : "A single line means partial participation: some " + label(nodeOf(m, e.ent)) + " entities may not take part.");
      return;
    }
    var n = nodeOf(m, g.getAttribute("data-node"));
    this.say.textContent = n.desc;
  };

  Explorer.prototype.setCards = function (o) {
    var cr = this.m.cardRel;
    var self = this;
    this.cards = {};
    this.m.edges.forEach(function (e, i) {
      if (e.rel === cr.rel) self.cards[i] = o.cards[cr.ends.indexOf(e.ent)];
    });
    this.render();
    this.pick(null);
    var hit = this.stage.querySelectorAll('.er-node[data-node="' + cr.rel + '"]');
    this.stage.querySelector("svg").classList.add("is-dim");
    hit.forEach(function (g) { g.classList.add("is-hl"); });
    this.stage.querySelectorAll(".er-edge").forEach(function (g) {
      if (self.m.edges[Number(g.getAttribute("data-edge"))].rel === cr.rel) g.classList.add("is-hl");
    });
    this.say.textContent = o.text;
  };

  D.wq.ready(function () {
    document.querySelectorAll('[data-widget="er-notation"]').forEach(function (box) {
      new Explorer(box);
    });
  });
})();
