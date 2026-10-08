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
    },
    /* 3.2 ACID Properties */
    {
      id: "q3.2-01",
      topic: "3.2",
      type: "mcq",
      question: "The system crashes after write(A) but before write(B) in the funds transfer. Which property requires that write(A) be undone?",
      options: ["Atomicity", "Consistency", "Isolation", "Durability"],
      answer: 0,
      explain: "Atomicity means all or nothing. A half-done transfer must be rolled back.",
      link: "#atomicity"
    },
    {
      id: "q3.2-02",
      topic: "3.2",
      type: "mcq",
      question: "Which part of the DBMS is responsible for isolation?",
      options: ["The recovery system", "The concurrency-control system", "The query optimizer", "The application programmer"],
      answer: 1,
      explain: "The concurrency-control system (for example, using locks) stops concurrent transactions from interfering.",
      link: "#who"
    },
    {
      id: "q3.2-03",
      topic: "3.2",
      type: "multi",
      question: "Which properties does the recovery system ensure? Choose all that apply.",
      options: ["Atomicity", "Consistency", "Isolation", "Durability"],
      answer: [0, 3],
      explain: "The recovery system undoes unfinished transactions (atomicity) and keeps or redoes committed ones (durability).",
      link: "#who"
    },
    {
      id: "q3.2-04",
      topic: "3.2",
      type: "mcq",
      question: "In the transfer of ₹50 from A to B, what is the consistency requirement?",
      options: ["A must never be read", "The sum A + B is unchanged", "B is written before A", "The transfer finishes within one second"],
      answer: 1,
      explain: "Money must not be created or destroyed, so A + B must be the same before and after.",
      link: "#consistency"
    },
    {
      id: "q3.2-05",
      topic: "3.2",
      type: "tf",
      question: "The database is allowed to be inconsistent for a short time while a transaction is running.",
      answer: true,
      explain: "True. After write(A) and before write(B), A + B is wrong. It must be correct again when the transaction ends, and no one else may see the in-between state.",
      link: "#consistency"
    },
    {
      id: "q3.2-06",
      topic: "3.2",
      type: "mcq",
      question: "A user is told “transfer successful”, and then the server loses power. The new balances are still there after restart. Which property is this?",
      options: ["Atomicity", "Consistency", "Isolation", "Durability"],
      answer: 3,
      explain: "Durability: once a transaction commits, its changes survive failures.",
      link: "#durability"
    },
    {
      id: "q3.2-07",
      topic: "3.2",
      type: "mcq",
      question: "T2 prints A + B while T1 is in the middle of the transfer, and shows ₹2950. Which property was broken?",
      options: ["Atomicity", "Isolation", "Durability", "None; this is allowed"],
      answer: 1,
      explain: "T2 saw T1's unfinished work. Isolation requires that each transaction be unaware of others running at the same time.",
      link: "#isolation"
    }
  ]);
})();
