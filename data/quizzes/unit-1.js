/* Unit I quiz items. Types: mcq (one answer), multi (all that apply),
   tf (true or false) and order (put the steps in order; options are listed in
   the correct order and shuffled on screen). */
(function () {
  var D = (window.DBMS = window.DBMS || {});
  D.quizzes = (D.quizzes || []).concat([
    /* 1.1 Purpose of Database System */
    {
      id: "q1.1-01",
      topic: "1.1",
      type: "mcq",
      question: "Which is the best definition of a DBMS?",
      options: [
        "A collection of interrelated data and a set of programs to access that data",
        "A program that stores each record in a separate text file",
        "A spreadsheet with many sheets",
        "A language for writing operating systems"
      ],
      answer: 0,
      explain: "A DBMS is both the related data and the programs that store, change and retrieve it.",
      link: "#what"
    },
    {
      id: "q1.1-02",
      topic: "1.1",
      type: "mcq",
      question: "A student's address is changed in the office file but not in the hostel file. Which problem is this?",
      options: ["Data isolation", "Data inconsistency", "Atomicity problem", "Security problem"],
      answer: 1,
      explain: "The two copies of the same data no longer match. That is data inconsistency, caused by redundancy.",
      link: "#problems"
    },
    {
      id: "q1.1-03",
      topic: "1.1",
      type: "mcq",
      question: "The power fails during a fee transfer. Money leaves the student's account but never reaches the college account. Which file-system problem does this show?",
      options: ["Data redundancy", "Concurrent-access anomaly", "Atomicity problem", "Difficulty in accessing data"],
      answer: 2,
      explain: "The transfer must happen completely or not at all. A half-done transfer is an atomicity problem.",
      link: "#problems"
    },
    {
      id: "q1.1-04",
      topic: "1.1",
      type: "multi",
      question: "Which of these are disadvantages of a file-processing system? Select all that apply.",
      options: ["Data redundancy", "Integrity problems", "A simple query language", "Security problems"],
      answer: [0, 1, 3],
      explain: "Redundancy, integrity problems and security problems are file-system drawbacks. A simple query language is an advantage of a DBMS.",
      link: "#problems"
    },
    {
      id: "q1.1-05",
      topic: "1.1",
      type: "tf",
      question: "A DBMS removes every duplicate copy of data, with no exceptions.",
      answer: false,
      explain: "False. A DBMS controls redundancy. Some copies, such as foreign key values and backups, are kept on purpose.",
      link: "#key-points"
    },
    {
      id: "q1.1-06",
      topic: "1.1",
      type: "mcq",
      question: "Which of these is a disadvantage of a DBMS?",
      options: ["Concurrent access", "High hardware and software cost", "Data integrity", "Controlled redundancy"],
      answer: 1,
      explain: "A DBMS needs powerful hardware and costly software. The other three are advantages.",
      link: "#merits"
    },
    {
      id: "q1.1-07",
      topic: "1.1",
      type: "mcq",
      question: "To answer the new question “list students from Salem with more than 80% marks”, a file system needs a new program. Which problem is this?",
      options: ["Difficulty in accessing data", "Data inconsistency", "Atomicity problem", "Data redundancy"],
      answer: 0,
      explain: "A file system has no easy way to ask new questions, so each one needs a new program.",
      link: "#problems"
    },
    /* 1.2 Views of Data */
    {
      id: "q1.2-01",
      topic: "1.2",
      type: "order",
      question: "Put the three levels of abstraction in order, from the lowest to the highest.",
      options: ["Physical level", "Logical level", "View level"],
      explain: "The physical level is the lowest, the logical level is in the middle and the view level is the highest.",
      link: "#levels"
    },
    {
      id: "q1.2-02",
      topic: "1.2",
      type: "mcq",
      question: "Which level describes what data is stored in the database and the relationships among the data?",
      options: ["Physical level", "Logical level", "View level", "Disk level"],
      answer: 1,
      explain: "The logical level describes what data is stored and how it is related. The physical level describes how it is stored.",
      link: "#levels"
    },
    {
      id: "q1.2-03",
      topic: "1.2",
      type: "mcq",
      question: "A college adds a new index and moves its data files to a faster disk. Programs work without any change. Which property is this?",
      options: ["Logical data independence", "Physical data independence", "Data redundancy", "Atomicity"],
      answer: 1,
      explain: "A change at the physical level that does not affect the logical schema shows physical data independence.",
      link: "#independence"
    },
    {
      id: "q1.2-04",
      topic: "1.2",
      type: "tf",
      question: "The instance of a database changes every time data is inserted, deleted or updated, but the schema changes rarely.",
      answer: true,
      explain: "True. The schema is the overall design. The instance is the data at one moment.",
      link: "#schema"
    },
    {
      id: "q1.2-05",
      topic: "1.2",
      type: "mcq",
      question: "What is a schema at the view level called?",
      options: ["Physical schema", "Logical schema", "Subschema", "Instance"],
      answer: 2,
      explain: "A database can have several views. Each view's schema is a subschema.",
      link: "#schema"
    },
    {
      id: "q1.2-06",
      topic: "1.2",
      type: "tf",
      question: "Logical data independence is easier to achieve than physical data independence.",
      answer: false,
      explain: "False. Programs depend on the tables they use, so logical data independence is harder to achieve.",
      link: "#independence"
    },
    {
      id: "q1.2-07",
      topic: "1.2",
      type: "multi",
      question: "Which changes need logical data independence to keep the views unchanged? Select all that apply.",
      options: ["Adding a column to a table", "Splitting one table into two", "Moving data files to a new disk", "Adding an index"],
      answer: [0, 1],
      explain: "Adding a column and splitting a table change the logical schema. Moving files and adding an index are physical changes.",
      link: "#independence"
    }
  ]);
})();
