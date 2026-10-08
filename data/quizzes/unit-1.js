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
    }
  ]);
})();
