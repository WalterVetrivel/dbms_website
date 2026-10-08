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
    },
    /* 3.3 Schedules */
    {
      id: "q3.3-01",
      topic: "3.3",
      type: "mcq",
      question: "What does a schedule show?",
      options: [
        "The time at which each transaction was written by the programmer",
        "The chronological order in which the instructions of concurrent transactions are executed",
        "The list of tables used by a transaction",
        "The backup timetable of the database"
      ],
      answer: 1,
      explain: "A schedule is the time order of the instructions of concurrent transactions.",
      link: "#what"
    },
    {
      id: "q3.3-02",
      topic: "3.3",
      type: "mcq",
      question: "How many different serial schedules are there for 3 transactions?",
      options: ["3", "6", "9", "27"],
      answer: 1,
      explain: "There are n! serial schedules. 3! = 3 × 2 × 1 = 6.",
      link: "#serial"
    },
    {
      id: "q3.3-03",
      topic: "3.3",
      type: "tf",
      question: "Every concurrent schedule gives the same result as some serial schedule.",
      answer: false,
      explain: "False. Schedule 4 ends with A + B = 3050, which no serial schedule gives. Only serializable schedules are safe.",
      link: "#concurrent"
    },
    {
      id: "q3.3-04",
      topic: "3.3",
      type: "multi",
      question: "Why do databases run transactions concurrently? Choose all that apply.",
      options: [
        "Better throughput: more transactions finish per second",
        "Shorter average waiting time",
        "Concurrent schedules are always correct",
        "The CPU can work while another transaction waits for the disk"
      ],
      answer: [0, 1, 3],
      explain: "Concurrency improves throughput, resource use and waiting time. It is not always correct, which is why concurrency control is needed.",
      link: "#why"
    },
    {
      id: "q3.3-05",
      topic: "3.3",
      type: "mcq",
      question: "In r1(A) w1(A) r2(A) c2 a1, T2 reads A from T1 and commits before T1 aborts. What kind of schedule is this?",
      options: ["Strict", "Cascadeless", "Recoverable", "Not recoverable"],
      answer: 3,
      explain: "T2 read from T1 but committed first. When T1 aborts, T2 cannot be rolled back, so the schedule is not recoverable.",
      link: "#recoverable"
    },
    {
      id: "q3.3-06",
      topic: "3.3",
      type: "mcq",
      question: "One transaction aborts and two others must roll back because they read its uncommitted data. What is this called?",
      options: ["Deadlock", "Cascading rollback", "Lost update", "Starvation"],
      answer: 1,
      explain: "A chain of rollbacks caused by one failure is a cascading rollback. Cascadeless schedules avoid it.",
      link: "#cascadeless"
    },
    {
      id: "q3.3-07",
      topic: "3.3",
      type: "mcq",
      question: "In w1(A) w2(A) c1 c2, no one reads uncommitted data. Which statement is true?",
      options: [
        "It is cascadeless but not strict",
        "It is strict",
        "It is not recoverable",
        "It is not cascadeless"
      ],
      answer: 0,
      explain: "There are no dirty reads, so it is cascadeless. But T2 writes A before T1 commits, so it is not strict.",
      link: "#cascadeless"
    },
    /* 3.4 Serializability */
    {
      id: "q3.4-01",
      topic: "3.4",
      type: "mcq",
      question: "Which pair of instructions does NOT conflict? (T1 and T2 are different transactions.)",
      options: ["read(Q) of T1 and write(Q) of T2", "write(Q) of T1 and read(Q) of T2", "read(Q) of T1 and read(Q) of T2", "write(Q) of T1 and write(Q) of T2"],
      answer: 2,
      explain: "Two reads of the same item never conflict, because both see the same value in either order.",
      link: "#conflict"
    },
    {
      id: "q3.4-02",
      topic: "3.4",
      type: "tf",
      question: "write(A) of T1 and read(B) of T2 conflict.",
      answer: false,
      explain: "False. They use different data items, so they can be swapped freely.",
      link: "#conflict"
    },
    {
      id: "q3.4-03",
      topic: "3.4",
      type: "mcq",
      question: "The precedence graph of a schedule has the edges T1 → T2, T2 → T3 and T3 → T1. What can you say?",
      options: [
        "It is conflict serializable, equivalent to T1, T2, T3",
        "It is not conflict serializable, because the graph has a cycle",
        "It is serial",
        "It is conflict serializable, equivalent to T3, T2, T1"
      ],
      answer: 1,
      explain: "T1 → T2 → T3 → T1 is a cycle, so no serial order can satisfy all the edges.",
      link: "#test"
    },
    {
      id: "q3.4-04",
      topic: "3.4",
      type: "mcq",
      question: "In schedule r1(A) w2(A) r3(B) w1(B), which edges are in the precedence graph?",
      options: ["T1 → T2 only", "T1 → T2 and T3 → T1", "T2 → T1 and T1 → T3", "No edges"],
      answer: 1,
      explain: "r1(A) before w2(A) gives T1 → T2. r3(B) before w1(B) gives T3 → T1. There is no cycle, so the serial order is T3, T1, T2.",
      link: "#test"
    },
    {
      id: "q3.4-05",
      topic: "3.4",
      type: "multi",
      question: "Which are conditions of view equivalence? Choose all that apply.",
      options: [
        "A transaction that reads the initial value of Q in one schedule also does so in the other",
        "A transaction that reads Q written by Tj in one schedule also does so in the other",
        "The same transaction does the final write of Q in both",
        "Both schedules have the same number of swaps"
      ],
      answer: [0, 1, 2],
      explain: "View equivalence has three conditions: initial reads, reads-from and final writes.",
      link: "#view-ser"
    },
    {
      id: "q3.4-06",
      topic: "3.4",
      type: "tf",
      question: "Every view serializable schedule is also conflict serializable.",
      answer: false,
      explain: "False. It is the other way round. Schedule 8, with blind writes, is view serializable but not conflict serializable.",
      link: "#view-ser"
    },
    {
      id: "q3.4-07",
      topic: "3.4",
      type: "mcq",
      question: "What is a blind write?",
      options: [
        "A write that is never committed",
        "A write of an item that the transaction has not read",
        "A write done without a lock",
        "A write to the log file"
      ],
      answer: 1,
      explain: "A blind write writes Q without reading it first. Schedules that are view but not conflict serializable always have blind writes.",
      link: "#view-ser"
    },
    /* 3.5 Concurrency Control and Need for Concurrency */
    {
      id: "q3.5-01",
      topic: "3.5",
      type: "multi",
      question: "Why do databases allow transactions to run concurrently? Choose all that apply.",
      options: ["Better throughput", "Better use of the CPU and disks", "Shorter average waiting time", "It removes the need for locks"],
      answer: [0, 1, 2],
      explain: "Concurrency improves throughput, resource use and response time. It creates the need for concurrency control, not the other way round.",
      link: "#need"
    },
    {
      id: "q3.5-02",
      topic: "3.5",
      type: "mcq",
      question: "T1 and T2 both read A = 1000. T1 writes 950, then T2 writes 1100. Which problem is this?",
      options: ["Dirty read", "Lost update", "Phantom", "Unrepeatable read"],
      answer: 1,
      explain: "T2's write overwrote T1's update, so T1's change was lost.",
      link: "#lost-update"
    },
    {
      id: "q3.5-03",
      topic: "3.5",
      type: "mcq",
      question: "T2 reads a value written by T1 before T1 commits, and T1 then aborts. Which problem is this?",
      options: ["Dirty read (temporary update)", "Lost update", "Incorrect summary", "Phantom"],
      answer: 0,
      explain: "Reading uncommitted data is a dirty read. The value never existed in any committed state.",
      link: "#dirty-read"
    },
    {
      id: "q3.5-04",
      topic: "3.5",
      type: "mcq",
      question: "T1 runs the same SELECT ... WHERE dept = 'CSE' twice and the second time sees an extra row that T2 inserted and committed. Which problem is this?",
      options: ["Unrepeatable read", "Lost update", "Phantom", "Dirty read"],
      answer: 2,
      explain: "A new row matching the condition appeared: a phantom. No existing row changed.",
      link: "#phantom"
    },
    {
      id: "q3.5-05",
      topic: "3.5",
      type: "tf",
      question: "In an unrepeatable read, the transaction that changed the item had committed before the second read.",
      answer: true,
      explain: "True. T2 changed and committed A between T1's two reads, so T1 saw two different committed values.",
      link: "#unrepeatable"
    },
    {
      id: "q3.5-06",
      topic: "3.5",
      type: "mcq",
      question: "Which kind of protocol lets transactions run freely and checks for conflicts only just before commit?",
      options: ["Lock-based", "Timestamp-based", "Validation-based (optimistic)", "Two phase locking"],
      answer: 2,
      explain: "Optimistic, or validation-based, control assumes conflicts are rare and checks for them at the end.",
      link: "#protocols"
    },
    {
      id: "q3.5-07",
      topic: "3.5",
      type: "mcq",
      question: "T2 adds up A and B while T1 moves ₹50 from A to B, and T2 reports ₹3050 instead of ₹3000. What is this called?",
      options: ["Lost update", "Incorrect summary", "Cascading rollback", "Deadlock"],
      answer: 1,
      explain: "The total mixed an old value of A with a new value of B: the incorrect summary problem.",
      link: "#summary"
    }
  ]);
})();
