/* Unit III question bank items.
   Every question is mapped to its unit, never to a test or exam paper, because
   test papers change each semester.
   id: "u3-a1" is Unit III, Part A, question 1 of the unit question bank. A question
   that is not in the unit bank takes the next free number in its part, and its
   source is { bank: "Unit III", extra: true }.
   "original" keeps the source wording; "question" is the corrected wording shown
   on the site. "parts" lists the a), b) sub-questions and "include" is the hint
   printed under some 16-mark questions; both are optional. "answer" is the 2-mark
   answer (HTML), or null. "outline" is true when a 16-mark question
   has an answer outline in data/outlines, or null. */
(function () {
  var D = (window.DBMS = window.DBMS || {});
  D.questions = (D.questions || []).concat([
    {
      id: "u3-a1",
      unit: 3,
      part: "A",
      marks: 2,
      topics: ["3.1"],
      sources: [{ bank: "Unit III", no: 1 }],
      original: "Define a transaction in DBMS.",
      question: "Define a transaction in a DBMS with an example.",
      answer:
        "<p>A <strong>transaction</strong> is a <strong>unit of program execution</strong> that reads and possibly updates data items. It must run <strong>completely or not at all</strong>.</p>" +
        "<p>Example: transfer ₹500 from account A to account B.</p>" +
        "<pre><code>read(A);  A := A - 500;  write(A);\nread(B);  B := B + 500;  write(B);</code></pre>" +
        "<p>If the system fails after write(A) but before write(B), the whole transaction must be undone.</p>"
    },
    {
      id: "u3-a2",
      unit: 3,
      part: "A",
      marks: 2,
      topics: ["3.2"],
      sources: [{ bank: "Unit III", no: 2 }],
      original: "What are the ACID properties of a transaction?",
      question: "What are the ACID properties of a transaction?",
      answer:
        "<ul>" +
        "<li><strong>Atomicity:</strong> all operations of the transaction happen, or none of them do.</li>" +
        "<li><strong>Consistency:</strong> a transaction takes the database from one consistent state to another.</li>" +
        "<li><strong>Isolation:</strong> a transaction does not see the unfinished work of other transactions running at the same time.</li>" +
        "<li><strong>Durability:</strong> after a transaction commits, its changes stay, even if the system fails.</li>" +
        "</ul>"
    },
    {
      id: "u3-a3",
      unit: 3,
      part: "A",
      marks: 2,
      topics: ["3.3"],
      sources: [{ bank: "Unit III", no: 3 }],
      original: "What is a schedule in transaction management?",
      question: "What is a schedule in transaction management?",
      answer:
        "<p>A <strong>schedule</strong> is a sequence that shows the <strong>order</strong> in which the operations (read, write, commit, abort) of concurrent transactions are executed. It keeps the order of operations inside each transaction.</p>" +
        "<ul>" +
        "<li><strong>Serial schedule:</strong> one transaction finishes completely before the next one starts.</li>" +
        "<li><strong>Concurrent (non-serial) schedule:</strong> the operations of the transactions are interleaved.</li>" +
        "</ul>"
    },
    {
      id: "u3-a4",
      unit: 3,
      part: "A",
      marks: 2,
      topics: ["3.4"],
      sources: [{ bank: "Unit III", no: 4 }],
      original: "Define serializability.",
      question: "Define serializability.",
      answer:
        "<p>A concurrent schedule is <strong>serializable</strong> if it gives the <strong>same result as some serial schedule</strong> of the same transactions. Serializability keeps the database consistent while transactions run at the same time.</p>" +
        "<p>Two types:</p>" +
        "<ul>" +
        "<li><strong>Conflict serializability:</strong> tested with a <strong>precedence graph</strong>. No cycle means the schedule is conflict serializable.</li>" +
        "<li><strong>View serializability:</strong> a weaker condition based on what each read sees.</li>" +
        "</ul>"
    },
    {
      id: "u3-a5",
      unit: 3,
      part: "A",
      marks: 2,
      topics: ["3.5"],
      sources: [{ bank: "Unit III", no: 5 }],
      original: "Why is concurrency control needed in DBMS?",
      question: "Why is concurrency control needed in a DBMS?",
      answer:
        "<p>Running transactions at the same time gives better <strong>throughput</strong> and shorter <strong>waiting time</strong>. But without control, they can interfere and cause these problems:</p>" +
        "<ul>" +
        "<li><strong>Lost update:</strong> one transaction overwrites another's update.</li>" +
        "<li><strong>Dirty read:</strong> a transaction reads data that is not yet committed.</li>" +
        "<li><strong>Unrepeatable read:</strong> the same read gives two different values.</li>" +
        "<li><strong>Phantom:</strong> new rows appear when a query is repeated.</li>" +
        "</ul>" +
        "<p><strong>Concurrency control</strong> prevents these problems and keeps <strong>isolation</strong> and <strong>consistency</strong>.</p>"
    },
    {
      id: "u3-a6",
      unit: 3,
      part: "A",
      marks: 2,
      topics: ["3.6"],
      sources: [{ bank: "Unit III", no: 6 }],
      original: "What is a locking protocol?",
      question: "What is a locking protocol?",
      answer:
        "<p>A <strong>locking protocol</strong> is a set of rules that says <strong>when a transaction may lock and unlock</strong> each data item. Its aim is to allow only serializable schedules.</p>" +
        "<ul>" +
        "<li><strong>Shared lock (S):</strong> the transaction can only read the item. Many transactions can hold S locks on the same item.</li>" +
        "<li><strong>Exclusive lock (X):</strong> the transaction can read and write the item. No other transaction can hold any lock on it.</li>" +
        "</ul>" +
        "<p>Example: the two phase locking protocol.</p>"
    },
    {
      id: "u3-a7",
      unit: 3,
      part: "A",
      marks: 2,
      topics: ["3.7"],
      sources: [{ bank: "Unit III", no: 7 }],
      original: "Explain two-phase locking protocol.",
      question: "Explain the two phase locking protocol.",
      answer:
        "<p>In <strong>two phase locking (2PL)</strong>, each transaction locks and unlocks data in two phases:</p>" +
        "<ol>" +
        "<li><strong>Growing phase:</strong> the transaction may get new locks but may not release any lock.</li>" +
        "<li><strong>Shrinking phase:</strong> the transaction may release locks but may not get any new lock.</li>" +
        "</ol>" +
        "<p>The point where it gets its last lock is the <strong>lock point</strong>. 2PL guarantees <strong>conflict serializability</strong>, but it does not prevent deadlock. Variants: strict 2PL and rigorous 2PL.</p>"
    },
    {
      id: "u3-a8",
      unit: 3,
      part: "A",
      marks: 2,
      topics: ["3.8"],
      sources: [{ bank: "Unit III", no: 8 }],
      original: "What is a deadlock?",
      question: "What is a deadlock?",
      answer:
        "<p>A <strong>deadlock</strong> is a state where each transaction in a set is <strong>waiting for a data item locked by another transaction</strong> in the same set. So no transaction can continue.</p>" +
        "<p>Example: T1 holds a lock on A and waits for B. T2 holds a lock on B and waits for A. Both wait forever.</p>" +
        "<p>It is handled by <strong>prevention</strong> (wait-die, wound-wait), <strong>detection</strong> with a wait-for graph, and <strong>recovery</strong> by rolling back a victim.</p>"
    },
    {
      id: "u3-a9",
      unit: 3,
      part: "A",
      marks: 2,
      topics: ["3.10"],
      sources: [{ bank: "Unit III", no: 9 }],
      original: "Define a savepoint in transaction management.",
      question: "Define a savepoint in transaction management.",
      answer:
        "<p>A <strong>savepoint</strong> is a <strong>named point inside a transaction</strong>. We can roll back to it. This undoes only the work done <strong>after</strong> the savepoint; the earlier work stays, and the transaction continues.</p>" +
        "<pre><code class=\"language-sql\">START TRANSACTION;\nUPDATE account SET balance = balance - 500 WHERE acc_no = 1;\nSAVEPOINT s1;\nUPDATE account SET balance = balance + 500 WHERE acc_no = 9;\nROLLBACK TO SAVEPOINT s1;   -- undoes only the second update\nCOMMIT;</code></pre>"
    },
    {
      id: "u3-a10",
      unit: 3,
      part: "A",
      marks: 2,
      topics: ["3.11"],
      sources: [{ bank: "Unit III", no: 10 }],
      original: "What are isolation levels? Give examples.",
      question: "What are isolation levels? Give examples.",
      answer:
        "<p>An <strong>isolation level</strong> says <strong>how much a transaction is protected</strong> from the changes of other transactions running at the same time. A lower level allows more problems but runs faster.</p>" +
        "<p>The four SQL isolation levels:</p>" +
        "<ol>" +
        "<li><strong>Read uncommitted</strong> (allows dirty reads)</li>" +
        "<li><strong>Read committed</strong></li>" +
        "<li><strong>Repeatable read</strong> (the default in MySQL InnoDB)</li>" +
        "<li><strong>Serializable</strong> (the strictest)</li>" +
        "</ol>" +
        "<pre><code class=\"language-sql\">SET TRANSACTION ISOLATION LEVEL READ COMMITTED;</code></pre>"
    },
    {
      id: "u3-a11",
      unit: 3,
      part: "A",
      marks: 2,
      topics: ["3.12"],
      sources: [{ bank: "Unit III", no: 11 }],
      original: "List SQL commands for concurrency control.",
      question: "List the SQL commands for concurrency control.",
      answer:
        "<ul>" +
        "<li><strong>START TRANSACTION</strong>, <strong>COMMIT</strong> and <strong>ROLLBACK</strong>: begin and end a transaction.</li>" +
        "<li><strong>SET TRANSACTION ISOLATION LEVEL</strong>: choose how isolated a transaction is.</li>" +
        "<li><strong>SELECT ... FOR UPDATE</strong>: lock the selected rows for writing.</li>" +
        "<li><strong>SELECT ... FOR SHARE</strong>: lock the selected rows for reading.</li>" +
        "<li><strong>LOCK TABLES ... READ | WRITE</strong> and <strong>UNLOCK TABLES</strong>: lock whole tables (MySQL).</li>" +
        "</ul>"
    },
    {
      id: "u3-a12",
      unit: 3,
      part: "A",
      marks: 2,
      topics: ["3.14"],
      sources: [{ bank: "Unit III", no: 12 }],
      original: "What is the difference between DCL and TCL commands?",
      question: "What is the difference between DCL and TCL commands?",
      answer:
        "<table><thead><tr><th>DCL (Data Control Language)</th><th>TCL (Transaction Control Language)</th></tr></thead><tbody>" +
        "<tr><td>Controls <strong>who can access</strong> the data (privileges).</td><td>Controls <strong>transactions</strong>: saves or undoes changes.</td></tr>" +
        "<tr><td>GRANT, REVOKE</td><td>COMMIT, ROLLBACK, SAVEPOINT</td></tr>" +
        "<tr><td>Used mainly by the DBA.</td><td>Used by any user who changes data.</td></tr>" +
        "</tbody></table>"
    },
    {
      id: "u3-a13",
      unit: 3,
      part: "A",
      marks: 2,
      topics: ["3.14"],
      sources: [{ bank: "Unit III", no: 13 }],
      original: "Give examples of DCL commands in SQL.",
      question: "Give examples of DCL commands in SQL.",
      answer:
        "<p><strong>GRANT</strong> gives privileges to a user:</p>" +
        "<pre><code class=\"language-sql\">GRANT SELECT, INSERT ON college.student TO 'staff'@'localhost';</code></pre>" +
        "<p><strong>REVOKE</strong> takes privileges back:</p>" +
        "<pre><code class=\"language-sql\">REVOKE INSERT ON college.student FROM 'staff'@'localhost';</code></pre>" +
        "<p>After these two commands, the user staff can only read the student table.</p>"
    },
    {
      id: "u3-a14",
      unit: 3,
      part: "A",
      marks: 2,
      topics: ["3.14"],
      sources: [{ bank: "Unit III", no: 14 }],
      original: "Give examples of TCL commands in SQL.",
      question: "Give examples of TCL commands in SQL.",
      answer:
        "<ul>" +
        "<li><strong>COMMIT</strong> saves all changes of the transaction permanently.</li>" +
        "<li><strong>ROLLBACK</strong> undoes all changes since the transaction began.</li>" +
        "<li><strong>SAVEPOINT</strong> marks a point to roll back to.</li>" +
        "</ul>" +
        "<pre><code class=\"language-sql\">START TRANSACTION;\nINSERT INTO student VALUES (101, 'Anu');\nSAVEPOINT s1;\nDELETE FROM student WHERE roll_no = 101;\nROLLBACK TO s1;   -- the row comes back\nCOMMIT;           -- the insert is saved</code></pre>"
    },
    {
      id: "u3-a15",
      unit: 3,
      part: "A",
      marks: 2,
      topics: ["3.13"],
      sources: [{ bank: "Unit III", no: 15 }],
      original: "What is backup and recovery in databases?",
      question: "What is backup and recovery in databases?",
      answer:
        "<p><strong>Backup</strong> is making a <strong>copy of the database</strong> at a point in time and keeping it in a safe, separate place. Types: <strong>full</strong>, <strong>incremental</strong> and <strong>differential</strong> backups.</p>" +
        "<p><strong>Recovery</strong> is <strong>restoring the database to a correct state</strong> after a failure, such as a disk crash. We restore the latest backup, then apply the log (the binary log in MySQL) to redo the committed changes made after it.</p>"
    },
    {
      id: "u3-b1",
      unit: 3,
      part: "B",
      marks: 16,
      topics: ["3.2"],
      sources: [{ bank: "Unit III", no: 1 }],
      original: "Explain ACID properties of a transaction with examples.",
      question: "Explain the ACID properties of a transaction with examples.",
      answer: null,
      outline: true
    },
    {
      id: "u3-b2",
      unit: 3,
      part: "B",
      marks: 16,
      topics: ["3.4"],
      sources: [{ bank: "Unit III", no: 2 }],
      original: "What is serializability? Explain conflict and view serializability with examples.",
      question: "What is serializability? Explain conflict and view serializability with examples.",
      answer: null,
      outline: true
    },
    {
      id: "u3-b3",
      unit: 3,
      part: "B",
      marks: 16,
      topics: ["3.5"],
      sources: [{ bank: "Unit III", no: 3 }],
      original: "Discuss the need for concurrency control and types of problems it addresses.",
      question: "Discuss the need for concurrency control and the types of problems it addresses.",
      answer: null,
      outline: true
    },
    {
      id: "u3-b4",
      unit: 3,
      part: "B",
      marks: 16,
      topics: ["3.7"],
      sources: [{ bank: "Unit III", no: 4 }],
      original: "Explain in detail the two-phase locking protocol and its types.",
      question: "Explain in detail the two phase locking protocol and its types.",
      answer: null,
      outline: true
    },
    {
      id: "u3-b5",
      unit: 3,
      part: "B",
      marks: 16,
      topics: ["3.8"],
      sources: [{ bank: "Unit III", no: 5 }],
      original: "What is a deadlock? Explain deadlock prevention, avoidance, and detection methods.",
      question: "What is a deadlock? Explain the deadlock prevention, avoidance and detection methods.",
      answer: null,
      outline: true
    },
    {
      id: "u3-b6",
      unit: 3,
      part: "B",
      marks: 16,
      topics: ["3.9"],
      sources: [{ bank: "Unit III", no: 6 }],
      original: "Explain transaction recovery techniques in detail.",
      question: "Explain transaction recovery techniques in detail.",
      answer: null,
      outline: true
    },
    {
      id: "u3-b7",
      unit: 3,
      part: "B",
      marks: 16,
      topics: ["3.10", "3.11"],
      sources: [{ bank: "Unit III", no: 7 }],
      original: "Write short notes on: a) Save points b) Isolation levels",
      question: "Write short notes on:",
      parts: ["Savepoints", "Isolation levels"],
      answer: null,
      outline: true
    },
    {
      id: "u3-b8",
      unit: 3,
      part: "B",
      marks: 16,
      topics: ["3.12"],
      sources: [{ bank: "Unit III", no: 8 }],
      original: "Discuss SQL facilities for concurrency control and recovery with examples.",
      question: "Discuss the SQL facilities for concurrency control and recovery with examples.",
      answer: null,
      outline: true
    },
    {
      id: "u3-b9",
      unit: 3,
      part: "B",
      marks: 16,
      topics: ["3.13"],
      sources: [{ bank: "Unit III", no: 9 }],
      original: "Explain backup and recovery systems in DBMS with techniques.",
      question: "Explain backup and recovery systems in a DBMS and their techniques.",
      answer: null,
      outline: true
    },
    {
      id: "u3-b10",
      unit: 3,
      part: "B",
      marks: 16,
      topics: ["3.14"],
      sources: [{ bank: "Unit III", no: 10 }],
      original: "Explain and give examples for DCL commands in SQL.",
      question: "Explain the DCL commands in SQL with examples.",
      answer: null,
      outline: true
    },
    {
      id: "u3-b11",
      unit: 3,
      part: "B",
      marks: 16,
      topics: ["3.14"],
      sources: [{ bank: "Unit III", no: 11 }],
      original: "Explain and give examples for TCL commands in SQL.",
      question: "Explain the TCL commands in SQL with examples.",
      answer: null,
      outline: true
    },
    {
      id: "u3-b12",
      unit: 3,
      part: "B",
      marks: 16,
      topics: ["3.11"],
      sources: [{ bank: "Unit III", no: 12 }],
      original: "Describe different isolation levels supported in SQL with examples.",
      question: "Describe the different isolation levels supported in SQL with examples.",
      answer: null,
      outline: true
    },
    {
      id: "u3-b13",
      unit: 3,
      part: "B",
      marks: 16,
      topics: ["3.14"],
      sources: [{ bank: "Unit III", no: 13 }],
      original: "Write and explain the steps for transaction rollback and commit using SQL.",
      question: "Write and explain the steps for transaction rollback and commit using SQL.",
      answer: null,
      outline: true
    },
    {
      id: "u3-b14",
      unit: 3,
      part: "B",
      marks: 16,
      topics: ["3.3"],
      sources: [{ bank: "Unit III", no: 14 }],
      original: "Discuss types of schedules and their role in transaction processing.",
      question: "Discuss the types of schedules and their role in transaction processing, with examples.",
      answer: null,
      outline: true
    },
    {
      id: "u3-b15",
      unit: 3,
      part: "B",
      marks: 16,
      topics: ["3.9"],
      sources: [{ bank: "Unit III", no: 15 }],
      original: "Explain shadow paging and log-based recovery.",
      question: "Explain shadow paging and log-based recovery.",
      answer: null,
      outline: true
    },
    {
      id: "u3-b16",
      unit: 3,
      part: "B",
      marks: 16,
      topics: ["3.3", "3.4"],
      sources: [{ bank: "Unit III", extra: true }],
      original: "Explain scheduling and serializability with examples.",
      question: "Explain schedules and serializability with examples.",
      answer: null,
      outline: true
    },
    {
      id: "u3-b17",
      unit: 3,
      part: "B",
      marks: 16,
      topics: ["3.8"],
      sources: [{ bank: "Unit III", extra: true }],
      original: "Explain how a deadlock can occur during the transaction management process with the help of an example.",
      question: "Explain with an example how a deadlock can occur during transaction processing.",
      answer: null,
      outline: true
    },
    {
      id: "u3-b18",
      unit: 3,
      part: "B",
      marks: 16,
      topics: ["3.14"],
      sources: [{ bank: "Unit III", extra: true }],
      original: "Describe the types of DCL and TCL commands in SQL and illustrate their usage with examples.",
      question: "Describe the types of DCL and TCL commands in SQL and illustrate their use with examples.",
      answer: null,
      outline: true
    }
  ]);
})();
