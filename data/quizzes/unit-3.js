/* Unit III quiz items. Types: mcq (one answer), multi (all that apply),
   tf (true or false) and order (put the steps in order; options are listed in
   the correct order and shuffled on screen). */
(function () {
  var D = (window.DBMS = window.DBMS || {});
  D.quizzes = (D.quizzes || []).concat([
    /* 3.1 Transaction Concepts */
    {
      id: "q3.1-01",
      topic: "3.1",
      type: "mcq",
      question: "Which statement best describes a transaction?",
      options: [
        "A single SQL SELECT statement",
        "A collection of operations that forms a single logical unit of work",
        "A table that stores the history of changes",
        "A backup copy of the database"
      ],
      answer: 1,
      explain: "A transaction groups operations into one unit of work that runs completely or not at all.",
      link: "#what"
    },
    {
      id: "q3.1-02",
      topic: "3.1",
      type: "mcq",
      question: "In T: read(A); A := A − 50; write(A), when does the value of A in the database change?",
      options: ["At read(A)", "At A := A − 50", "At write(A)", "Only when the database is backed up"],
      answer: 2,
      explain: "The calculation changes only the copy in the transaction's buffer. write(A) copies it back to the database.",
      link: "#operations"
    },
    {
      id: "q3.1-03",
      topic: "3.1",
      type: "order",
      question: "Put the states in order for a transaction that commits successfully.",
      options: ["Active", "Partially committed", "Committed"],
      explain: "A transaction starts active, becomes partially committed after its last statement, and is committed once its commit record is on disk.",
      link: "#states"
    },
    {
      id: "q3.1-04",
      topic: "3.1",
      type: "tf",
      question: "A partially committed transaction can still fail.",
      answer: true,
      explain: "True. Its changes may still be only in main memory, so a power failure can stop it. It then moves to the failed state.",
      link: "#states"
    },
    {
      id: "q3.1-05",
      topic: "3.1",
      type: "mcq",
      question: "A transaction has been rolled back and the database is restored to its state before the transaction began. Which state is it in?",
      options: ["Failed", "Aborted", "Partially committed", "Active"],
      answer: 1,
      explain: "Failed means it cannot go on. Once the rollback is complete, it is aborted.",
      link: "#states"
    },
    {
      id: "q3.1-06",
      topic: "3.1",
      type: "multi",
      question: "After a transaction is aborted, what can the system do? Choose all that apply.",
      options: [
        "Restart it, if the failure was not caused by its own logic",
        "Kill it, if it has an error in its own logic",
        "Mark it as committed",
        "Undo it a second time with a compensating transaction"
      ],
      answer: [0, 1],
      explain: "An aborted transaction is either restarted (as a new transaction) or killed. Compensating transactions are for committed transactions.",
      link: "#states"
    },
    {
      id: "q3.1-07",
      topic: "3.1",
      type: "tf",
      question: "A committed transaction can be undone by sending ROLLBACK.",
      answer: false,
      explain: "False. After commit, the changes are permanent. Only a compensating transaction, such as a refund, can reverse its effect.",
      link: "#end"
    }
  ]);
})();
