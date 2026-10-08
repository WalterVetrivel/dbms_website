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
    },
    /* 3.6 Locking Protocols */
    {
      id: "q3.6-01",
      topic: "3.6",
      type: "mcq",
      question: "T1 holds a shared lock on Q. Which request by T2 on Q can be granted at once?",
      options: ["lock-S(Q)", "lock-X(Q)", "Both", "Neither"],
      answer: 0,
      explain: "Only S is compatible with S. An X request must wait until T1 releases its lock.",
      link: "#compat"
    },
    {
      id: "q3.6-02",
      topic: "3.6",
      type: "tf",
      question: "A transaction holding a shared lock on Q may write Q.",
      answer: false,
      explain: "False. A shared lock allows reading only. To write Q, the transaction needs an exclusive lock.",
      link: "#modes"
    },
    {
      id: "q3.6-03",
      topic: "3.6",
      type: "mcq",
      question: "In the lock compatibility matrix for S and X, how many entries are true?",
      options: ["0", "1", "2", "3"],
      answer: 1,
      explain: "Only comp(S, S) is true. Every pair that includes X is false.",
      link: "#compat"
    },
    {
      id: "q3.6-04",
      topic: "3.6",
      type: "mcq",
      question: "T1 locks and unlocks B, then locks A. T2 reads A and B in between and displays 250 instead of 300. What caused this?",
      options: ["T2 used exclusive locks", "T1 unlocked B too early", "The lock table was full", "A deadlock"],
      answer: 1,
      explain: "T1 released B before it had finished the transfer, so T2 saw a half-done state. Locking alone is not enough; a protocol is needed.",
      link: "#example"
    },
    {
      id: "q3.6-05",
      topic: "3.6",
      type: "mcq",
      question: "What does the lock manager use to keep track of locks?",
      options: ["The log file", "A lock table, usually a hash table on the item name", "The data dictionary on disk", "A B+ tree on the transaction id"],
      answer: 1,
      explain: "The lock table in main memory maps each data item to a list of lock requests, in arrival order.",
      link: "#manager"
    },
    {
      id: "q3.6-06",
      topic: "3.6",
      type: "mcq",
      question: "A transaction waiting for an X lock never gets it because new S requests keep being granted. What is this called?",
      options: ["Deadlock", "Starvation", "Cascading rollback", "Lock conversion"],
      answer: 1,
      explain: "This is starvation. It is avoided by granting a request only if no earlier request on the same item is waiting.",
      link: "#starvation"
    },
    /* 3.7 Two Phase Locking */
    {
      id: "q3.7-01",
      topic: "3.7",
      type: "mcq",
      question: "In two phase locking, what may a transaction do during the shrinking phase?",
      options: ["Obtain new locks only", "Release locks, but not obtain new ones", "Obtain and release locks freely", "Nothing until it commits"],
      answer: 1,
      explain: "Once a transaction releases its first lock, it enters the shrinking phase. From then on it may release locks but may not ask for any new lock.",
      link: "#rule"
    },
    {
      id: "q3.7-02",
      topic: "3.7",
      type: "mcq",
      question: "What is the lock point of a transaction?",
      options: ["The point where it gets its final lock", "The point where it commits", "The point where it releases its first lock", "The point where it starts"],
      answer: 0,
      explain: "The lock point is the end of the growing phase, the moment the transaction gets its final lock.",
      link: "#rule"
    },
    {
      id: "q3.7-03",
      topic: "3.7",
      type: "tf",
      question: "Two phase locking guarantees that no deadlock can occur.",
      answer: false,
      explain: "False. Two transactions can each hold one lock and wait for the other's lock. Two phase locking ensures conflict serializability, not freedom from deadlock.",
      link: "#demerits"
    },
    {
      id: "q3.7-04",
      topic: "3.7",
      type: "mcq",
      question: "Under basic two phase locking, transactions are serializable in which order?",
      options: ["The order they started", "The order of their lock points", "The order they commit", "Any random order"],
      answer: 1,
      explain: "Ordering transactions by their lock points gives an equivalent serial order.",
      link: "#serial"
    },
    {
      id: "q3.7-05",
      topic: "3.7",
      type: "mcq",
      question: "Strict two phase locking holds which locks until commit or abort?",
      options: ["All shared locks", "All exclusive locks", "Only the first lock", "No locks"],
      answer: 1,
      explain: "Strict two phase locking keeps every exclusive lock until the transaction ends, so no one can read uncommitted data. This avoids cascading rollback.",
      link: "#types"
    },
    {
      id: "q3.7-06",
      topic: "3.7",
      type: "mcq",
      question: "Which variant holds ALL locks, shared and exclusive, until the transaction commits or aborts?",
      options: ["Basic two phase locking", "Strict two phase locking", "Rigorous two phase locking", "Early unlocking"],
      answer: 2,
      explain: "Rigorous two phase locking keeps every lock until the end. Transactions are then serializable in the order they commit.",
      link: "#types"
    },
    {
      id: "q3.7-07",
      topic: "3.7",
      type: "tf",
      question: "With lock conversion, an upgrade from shared to exclusive is allowed only in the growing phase.",
      answer: true,
      explain: "True. An upgrade acts like getting a new lock, so it belongs to the growing phase. A downgrade belongs to the shrinking phase.",
      link: "#conversion"
    },,
    /* 3.8 Deadlock */
    {
      id: "q3.8-01",
      topic: "3.8",
      type: "mcq",
      question: "Which condition is NOT one of the four conditions needed for deadlock?",
      options: ["Mutual exclusion", "Hold and wait", "Circular wait", "Cascading rollback"],
      answer: 3,
      explain: "The four conditions are mutual exclusion, hold and wait, no preemption and circular wait. Cascading rollback is a different problem.",
      link: "#what"
    },
    {
      id: "q3.8-02",
      topic: "3.8",
      type: "mcq",
      question: "In wait-die, an older transaction asks for a lock held by a younger one. What happens?",
      options: ["The older one waits", "The older one dies", "The younger one is rolled back", "Both are rolled back"],
      answer: 0,
      explain: "In wait-die an older requester is allowed to wait. Only a younger requester dies.",
      link: "#timestamps"
    },
    {
      id: "q3.8-03",
      topic: "3.8",
      type: "mcq",
      question: "In wound-wait, an older transaction asks for a lock held by a younger one. What happens?",
      options: ["The older one waits", "The older one is rolled back", "The younger one is rolled back", "The lock is shared"],
      answer: 2,
      explain: "The older transaction wounds the younger holder, which is rolled back. The older one then gets the lock.",
      link: "#timestamps"
    },
    {
      id: "q3.8-04",
      topic: "3.8",
      type: "tf",
      question: "In a wait-for graph, the system is in a deadlock if and only if the graph has a cycle.",
      answer: true,
      explain: "True. A cycle means each transaction on it waits for the next, so none can go on.",
      link: "#detection"
    },
    {
      id: "q3.8-05",
      topic: "3.8",
      type: "mcq",
      question: "In wait-die and wound-wait, why does a rolled back transaction keep its old timestamp?",
      options: ["To save disk space", "So it does not starve", "To make it younger", "So it can skip logging"],
      answer: 1,
      explain: "With its old timestamp, it becomes the oldest transaction in time and is no longer rolled back, so it cannot starve.",
      link: "#timestamps"
    },
    {
      id: "q3.8-06",
      topic: "3.8",
      type: "mcq",
      question: "The system keeps picking the same transaction as the deadlock victim, so it restarts and is rolled back again and again. What is this called?",
      options: ["Deadlock", "Livelock", "Lock point", "Lock conversion"],
      answer: 1,
      explain: "The transaction keeps changing state but never makes progress. This is livelock, a special case of starvation.",
      link: "#livelock"
    },
    {
      id: "q3.8-07",
      topic: "3.8",
      type: "mcq",
      question: "What is the main demerit of the timeout scheme?",
      options: ["It needs a wait-for graph", "It is hard to choose the waiting time", "It never rolls back anything", "It needs timestamps"],
      answer: 1,
      explain: "Too long a time leaves a deadlock in place; too short rolls back transactions that were only waiting.",
      link: "#timeout"
    },,
    /* 3.9 Transaction Recovery */
    {
      id: "q3.9-01",
      topic: "3.9",
      type: "mcq",
      question: "A power cut stops the system. Main memory is lost but the disk is fine. What kind of failure is this?",
      options: ["Logical error", "System crash", "Disk failure", "Deadlock"],
      answer: 1,
      explain: "A system crash loses the contents of volatile storage, but non-volatile storage is not harmed (the fail-stop assumption).",
      link: "#failures"
    },
    {
      id: "q3.9-02",
      topic: "3.9",
      type: "mcq",
      question: "Where must the log be kept?",
      options: ["Volatile storage", "Main memory buffer", "Stable storage", "Cache"],
      answer: 2,
      explain: "Recovery depends on the log, so it is kept on stable storage, which is built from several copies on independent media.",
      link: "#storage"
    },
    {
      id: "q3.9-03",
      topic: "3.9",
      type: "tf",
      question: "Under the write-ahead logging rule, a changed data block may be written to disk before its log record.",
      answer: false,
      explain: "False. The log record must reach stable storage first, so the old value is always available for undo.",
      link: "#log"
    },
    {
      id: "q3.9-04",
      topic: "3.9",
      type: "mcq",
      question: "With deferred database modification, what is done after a crash for a transaction that has a start record but no commit record?",
      options: ["Undo it", "Redo it", "Nothing", "Undo then redo it"],
      answer: 2,
      explain: "Under deferred modification the transaction never changed the database, so it is simply ignored.",
      link: "#deferred"
    },
    {
      id: "q3.9-05",
      topic: "3.9",
      type: "mcq",
      question: "The log under immediate modification ends with <T0 start>, <T0, A, 1000, 950>, <T0, B, 2000, 2050>. What are A and B after recovery?",
      options: ["A = 950, B = 2050", "A = 1000, B = 2000", "A = 950, B = 2000", "A = 1000, B = 2050"],
      answer: 1,
      explain: "T0 has no commit record, so undo(T0) restores the old values A = 1000 and B = 2000.",
      link: "#immediate"
    },
    {
      id: "q3.9-06",
      topic: "3.9",
      type: "mcq",
      question: "What is the main benefit of a checkpoint?",
      options: ["It makes transactions run faster", "Recovery need not read the whole log", "It removes the need for a log", "It prevents deadlock"],
      answer: 1,
      explain: "Everything before the checkpoint is on disk, so recovery starts at the last checkpoint instead of the beginning of the log.",
      link: "#checkpoints"
    },
    {
      id: "q3.9-07",
      topic: "3.9",
      type: "mcq",
      question: "In shadow paging, how does a transaction commit?",
      options: ["By writing a commit record to the log", "By switching the database pointer to the current page table", "By copying the shadow table over the current table", "By redoing all its writes"],
      answer: 1,
      explain: "After the changed pages and the current page table are on disk, one atomic write makes the root pointer point to the current page table.",
      link: "#shadow"
    },,
    /* 3.10 Save Points */
    {
      id: "q3.10-01",
      topic: "3.10",
      type: "mcq",
      question: "What does ROLLBACK TO SP2 do?",
      options: ["Undoes the whole transaction", "Undoes only the changes made after SP2", "Undoes only the changes made before SP2", "Commits the changes made before SP2"],
      answer: 1,
      explain: "It undoes every change made after SP2 was created. Changes before SP2 are kept, still uncommitted.",
      link: "#syntax"
    },
    {
      id: "q3.10-02",
      topic: "3.10",
      type: "mcq",
      question: "SAVEPOINT SP1; DELETE row 1; SAVEPOINT SP2; DELETE row 2; SAVEPOINT SP3; DELETE row 3; ROLLBACK TO SP2. Which rows are still deleted?",
      options: ["None", "Row 1 only", "Rows 1 and 2", "Rows 1, 2 and 3"],
      answer: 1,
      explain: "Only the deletion made before SP2 remains. The deletions of rows 2 and 3 came after SP2, so they are undone.",
      link: "#example"
    },
    {
      id: "q3.10-03",
      topic: "3.10",
      type: "tf",
      question: "After ROLLBACK TO SP2, savepoint SP3 (created after SP2) can still be used.",
      answer: false,
      explain: "False. Savepoints created after SP2 are removed by ROLLBACK TO SP2. SP1 and SP2 remain.",
      link: "#rules"
    },
    {
      id: "q3.10-04",
      topic: "3.10",
      type: "tf",
      question: "ROLLBACK TO a savepoint ends the transaction.",
      answer: false,
      explain: "False. The transaction stays open. Only COMMIT or ROLLBACK without TO ends it.",
      link: "#rules"
    },
    {
      id: "q3.10-05",
      topic: "3.10",
      type: "mcq",
      question: "What does RELEASE SAVEPOINT SP1 do?",
      options: ["Undoes changes after SP1", "Removes SP1 without changing data", "Commits the transaction", "Renames SP1"],
      answer: 1,
      explain: "It only removes the savepoint. The changes are kept, but you can no longer roll back to SP1.",
      link: "#syntax"
    },
    {
      id: "q3.10-06",
      topic: "3.10",
      type: "mcq",
      question: "A transaction creates SP1, deletes a row and then commits. What happens on ROLLBACK TO SP1?",
      options: ["The row comes back", "An error: the savepoint does not exist", "The transaction is undone", "Nothing, and no error"],
      answer: 1,
      explain: "COMMIT ends the transaction and removes all its savepoints, so SP1 no longer exists.",
      link: "#rules"
    },
  ]);
})();
