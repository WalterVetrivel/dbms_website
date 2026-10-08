/* Unit II quiz items. Types: mcq (one answer), multi (all that apply),
   tf (true or false) and order (put the steps in order; options are listed in
   the correct order and shuffled on screen). */
(function () {
  var D = (window.DBMS = window.DBMS || {});
  D.quizzes = (D.quizzes || []).concat([
    /* 2.1 Entity-Relationship Model */
    {
      id: "q2.1-01",
      topic: "2.1",
      type: "mcq",
      question: "In which step of database design is the E-R diagram drawn?",
      options: ["Requirement analysis", "Conceptual design", "Physical design", "Schema refinement"],
      answer: 1,
      explain: "The E-R diagram is the conceptual design. Logical design then turns it into tables.",
      link: "#design"
    },
    {
      id: "q2.1-02",
      topic: "2.1",
      type: "mcq",
      question: "A student can have several phone numbers. In Chen notation, Phone is drawn as:",
      options: ["A dashed ellipse", "A double ellipse", "A double rectangle", "An ellipse with its name underlined"],
      answer: 1,
      explain: "A multivalued attribute is a double ellipse. A dashed ellipse is a derived attribute.",
      link: "#attributes"
    },
    {
      id: "q2.1-03",
      topic: "2.1",
      type: "mcq",
      question: "Which attribute is best stored as a derived attribute?",
      options: ["Date of birth", "Register number", "Age", "Name"],
      answer: 2,
      explain: "Age can be calculated from the date of birth, so it is derived and need not be stored.",
      link: "#attributes"
    },
    {
      id: "q2.1-04",
      topic: "2.1",
      type: "mcq",
      question: "Many students belong to one department, and each student belongs to only one department. What is the mapping cardinality from Student to Department?",
      options: ["One to one", "One to many", "Many to one", "Many to many"],
      answer: 2,
      explain: "Many students map to one department, so Student to Department is many to one (N : 1).",
      link: "#cardinality"
    },
    {
      id: "q2.1-05",
      topic: "2.1",
      type: "tf",
      question: "A double line between an entity set and a relationship set means every entity in that set must take part in the relationship.",
      answer: true,
      explain: "True. The double line shows total participation.",
      link: "#participation"
    },
    {
      id: "q2.1-06",
      topic: "2.1",
      type: "mcq",
      question: "What is the primary key of the weak entity set Section, whose owner is Course(CourseID) and whose discriminator is SecNo?",
      options: ["SecNo", "CourseID", "(CourseID, SecNo)", "Section has no key at all"],
      answer: 2,
      explain: "The key of a weak entity set is the owner's primary key plus the discriminator.",
      link: "#weak"
    },
    {
      id: "q2.1-07",
      topic: "2.1",
      type: "multi",
      question: "Which of these are drawn with a double shape in Chen notation? Select all that apply.",
      options: ["Weak entity set", "Multivalued attribute", "Identifying relationship", "Key attribute"],
      answer: [0, 1, 2],
      explain: "Weak entity sets (double rectangle), multivalued attributes (double ellipse) and identifying relationships (double diamond) are doubled. A key attribute is underlined.",
      link: "#weak"
    },
    {
      id: "q2.1-08",
      topic: "2.1",
      type: "mcq",
      question: "Grade depends on both the student and the course. Where does Grade belong in the E-R diagram?",
      options: ["On Student", "On Course", "On the relationship set Takes", "On a new weak entity set"],
      answer: 2,
      explain: "Grade describes one student in one course, so it is a descriptive attribute of Takes.",
      link: "#relationship"
    }
  ]);
})();
