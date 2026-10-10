/* Unit III comparisons, shown on comparisons/unit-3.html. See data/comparisons/unit-1.js
   for the shape of an item. After you change this file, run node tools/build-comparisons.mjs. */
window.DBMS = window.DBMS || {};

DBMS.comparisons = (DBMS.comparisons || []).concat([
  {
    id: "serial-vs-concurrent-schedule",
    topics: ["3.3"],
    title: "Serial and concurrent schedules",
    keywords: "serial concurrent non-serial interleaved schedule serializable vs difference",
    summary: "A serial schedule runs transactions one after another. A concurrent schedule interleaves them. It is faster, but correct only if it is serializable.",
    tables: [{
      caption: "Serial and concurrent schedules",
      head: ["Basis", "Serial schedule", "Concurrent (non-serial) schedule"],
      rows: [
        ["Meaning", "All instructions of one transaction run before the next transaction starts", "Instructions of several transactions are interleaved"],
        ["Number possible for n transactions", "n! (each order is one schedule)", "Many more than n!"],
        ["Consistency", "Always keeps the database consistent", "Consistent only if it is serializable"],
        ["Throughput", "Low; the CPU waits during each disk read", "High; one transaction uses the CPU while another waits for the disk"],
        ["Waiting time", "Short transactions wait behind long ones", "Short transactions can finish early"],
        ["Needs concurrency control", "No", "Yes"],
        ["Example (funds transfer)", "T1 then T2: A + B stays 3000", "Schedule 3 keeps A + B = 3000; Schedule 4 does not"]
      ]
    }],
    read: ["3.3#serial", "3.3#concurrent"],
    questions: ["u3-a3", "u3-b14", "u3-b16"]
  },
  {
    id: "recoverable-cascadeless-strict",
    topics: ["3.3"],
    title: "Recoverable, cascadeless and strict schedules",
    keywords: "recoverable cascadeless strict schedule cascading rollback vs difference",
    summary: "Each kind is stricter than the one before. Every strict schedule is cascadeless, and every cascadeless schedule is recoverable.",
    tables: [
      {
        caption: "Recoverable, cascadeless and strict schedules",
        head: ["Basis", "Recoverable", "Cascadeless", "Strict"],
        rows: [
          ["Rule", "If Tj reads an item written by Ti, Ti commits before Tj commits", "Tj reads an item only after the transaction that wrote it has committed", "Tj neither reads nor writes an item until the transaction that last wrote it has ended"],
          ["Dirty reads", "Allowed", "Not allowed", "Not allowed"],
          ["Cascading rollback", "Possible", "Not possible", "Not possible"],
          ["Overwriting uncommitted data", "Allowed", "Allowed", "Not allowed"],
          ["Recovery", "Possible, but may need many rollbacks", "Roll back only the failed transaction", "Simplest: restore the before-image of each item"],
          ["Produced by", "Any correct protocol", "Strict 2PL", "Strict 2PL"]
        ]
      },
      { from: "3.3", ref: "cmp-schedule-types" }
    ],
    tip: "Draw three nested circles: strict inside cascadeless inside recoverable.",
    read: ["3.3#recoverable", "3.3#cascadeless"],
    questions: ["u3-b14"]
  },
  {
    id: "conflict-vs-view-serializability",
    topics: ["3.4"],
    title: "Conflict and view serializability",
    keywords: "conflict view serializability precedence graph blind write vs difference",
    summary: "Conflict serializability looks at the order of conflicting instructions and is easy to test. View serializability looks at reads and final writes. It is wider but hard to test.",
    tables: [{ from: "3.4", ref: "cmp-conflict-view" }],
    tip: "Every conflict serializable schedule is view serializable, but not the other way round. The extra view serializable schedules always contain blind writes.",
    questions: ["u3-a4", "u3-b2", "u3-b16"]
  },
  {
    id: "concurrency-problems",
    topics: ["3.5"],
    title: "Lost update, dirty read, unrepeatable read and phantom",
    keywords: "concurrency problems anomalies lost update dirty read unrepeatable non-repeatable phantom incorrect summary vs difference",
    summary: "Each problem comes from a different conflict. Write-write gives a lost update, write-read a dirty read and read-write an unrepeatable read. Inserts give phantoms.",
    tables: [{ from: "3.5", ref: "cmp-concurrency-problems" }],
    tip: "For each problem, draw a two-column table of T1 and T2 steps with the values of the item. The steps earn more marks than the definition.",
    questions: ["u3-a5", "u3-b3"]
  },
  {
    id: "shared-vs-exclusive-lock",
    topics: ["3.6"],
    title: "Shared and exclusive locks",
    keywords: "shared exclusive lock s x lock-s lock-x read write compatibility vs difference",
    summary: "A shared (S) lock lets many transactions read an item. An exclusive (X) lock lets one transaction read and write it, and keeps everyone else out.",
    tables: [
      {
        caption: "Shared and exclusive locks",
        head: ["Basis", "Shared lock (S)", "Exclusive lock (X)"],
        rows: [
          ["Instruction", "lock-S(Q)", "lock-X(Q)"],
          ["Allows the holder to", "Read Q", "Read and write Q"],
          ["Other transactions can", "Also take S locks and read Q", "Take no lock on Q; they wait"],
          ["Holders at one time", "Many", "One"],
          ["Compatible with", "S", "Nothing"],
          ["Also called", "Read lock", "Write lock"],
          ["Conversion", "Upgrade to X in the growing phase", "Downgrade to S in the shrinking phase"],
          ["MySQL (InnoDB)", "<code>SELECT ... FOR SHARE</code>", "<code>SELECT ... FOR UPDATE</code>, and every UPDATE or DELETE"]
        ]
      },
      { from: "3.6", ref: "tbl-lock-compat" }
    ],
    syntax: [
      { label: "Protocol notation", code: "T1: lock-S(A);\n    read(A);\n    unlock(A);\n\nT2: lock-X(B);\n    read(B);\n    B := B - 50;\n    write(B);\n    unlock(B);" },
      { label: "MySQL row locks", code: "START TRANSACTION;\nSELECT balance FROM account\nWHERE acc_no = 101\nFOR SHARE;   -- S lock\n\nSELECT balance FROM account\nWHERE acc_no = 102\nFOR UPDATE;  -- X lock\nCOMMIT;      -- both released" }
    ],
    read: ["3.6#modes", "3.6#compat"],
    questions: ["u3-a6"]
  },
  {
    id: "two-phase-locking-types",
    topics: ["3.7"],
    title: "Basic, strict, rigorous and conservative two phase locking",
    keywords: "2pl two phase locking basic strict rigorous conservative static vs difference",
    summary: "All four keep a growing and a shrinking phase, so all are serializable. They differ in when locks are taken and released, which decides cascading rollbacks and deadlocks.",
    tables: [{ from: "3.7", ref: "cmp-2pl-types" }],
    tip: "Draw the number of locks held against time for each type. Basic 2PL is a peak; strict and rigorous drop at commit; conservative starts at the top.",
    questions: ["u3-a7", "u3-b4"]
  },
  {
    id: "deadlock-livelock-starvation",
    topics: ["3.8"],
    title: "Deadlock, livelock and starvation",
    keywords: "deadlock livelock starvation wait-for graph vs difference",
    summary: "In a deadlock, transactions are blocked waiting for each other. In a livelock, they keep running and restarting but never finish. In starvation, one transaction is passed over again and again.",
    tables: [{ from: "3.8", ref: "cmp-deadlock-livelock" }],
    tip: "Livelock is a special case of starvation. Say this, then give one example of each.",
    read: ["3.8#livelock"],
    questions: ["u3-a8", "u3-b5", "u3-b17"]
  },
  {
    id: "wait-die-vs-wound-wait",
    topics: ["3.8"],
    title: "Wait-die and wound-wait",
    keywords: "wait-die wound-wait timestamp deadlock prevention preemptive non-preemptive vs difference",
    summary: "In both schemes the younger transaction is rolled back. In wait-die an older requester waits; in wound-wait an older requester rolls back the younger holder.",
    tables: [
      {
        caption: "Wait-die and wound-wait (Ti asks for an item held by Tj)",
        head: ["Basis", "Wait-die", "Wound-wait"],
        rows: [
          ["Kind", "Non-preemptive", "Preemptive"],
          ["Older Ti asks", "Ti waits", "Ti wounds Tj: Tj is rolled back"],
          ["Younger Ti asks", "Ti dies: Ti is rolled back", "Ti waits"],
          ["Who may wait for whom", "Older waits for younger", "Younger waits for older"],
          ["Who is rolled back", "Always the younger one (the requester)", "Always the younger one (the holder)"],
          ["Rollbacks", "More; a young transaction may die many times", "Fewer"],
          ["After restart", "Keeps its old timestamp, so it cannot starve", "Keeps its old timestamp, so it cannot starve"],
          ["Memory aid", "The old one waits, the young one dies", "The old one wounds, the young one waits"]
        ]
      },
      { from: "3.8", ref: "cmp-wait-die-wound-wait" }
    ],
    syntax: [
      { label: "Wait-die rule", code: "if TS(Ti) < TS(Tj)   -- Ti older\n    Ti waits\nelse                 -- Ti younger\n    roll back Ti (dies)" },
      { label: "Wound-wait rule", code: "if TS(Ti) < TS(Tj)   -- Ti older\n    roll back Tj (wounded)\nelse                 -- Ti younger\n    Ti waits" }
    ],
    syntaxTitle: "The rules side by side",
    read: ["3.8#timestamps"],
    questions: ["u3-b5"]
  },
  {
    id: "deadlock-handling",
    topics: ["3.8"],
    title: "Deadlock prevention, detection and timeout",
    keywords: "deadlock prevention detection recovery timeout wait-for graph avoidance vs difference",
    summary: "Prevention makes a deadlock impossible, detection lets it happen and then breaks it and timeout simply rolls back any transaction that waits too long.",
    tables: [{
      caption: "Ways to handle deadlocks",
      head: ["Basis", "Prevention", "Detection and recovery", "Timeout"],
      rows: [
        ["Idea", "Never let a cycle of waits form", "Let deadlocks happen, find them, then break them", "Roll back a transaction that waits longer than a set time"],
        ["Methods", "Lock everything at the start, lock in a fixed order, wait-die, wound-wait", "Wait-for graph checked for a cycle; choose a victim and roll it back", "A lock wait limit"],
        ["Can a deadlock happen?", "No", "Yes, for a short time", "Yes, until the time runs out"],
        ["Unneeded rollbacks", "Some (a rollback may happen with no deadlock)", "None; only real deadlocks", "Some (slow transactions that were not deadlocked)"],
        ["Overhead", "Rollbacks and lower concurrency", "Keeping the graph and running the check", "Very low"],
        ["Best when", "Deadlocks are frequent", "Deadlocks are rare", "Transactions are short"],
        ["MySQL (InnoDB)", "Not used", "Yes; rolls back the smaller transaction", "<code>innodb_lock_wait_timeout</code> (50 seconds by default)"]
      ]
    }],
    read: ["3.8#prevention", "3.8#detection", "3.8#timeout"],
    questions: ["u3-b5"]
  },
  {
    id: "storage-types",
    topics: ["3.9"],
    title: "Volatile, non-volatile and stable storage",
    keywords: "volatile non-volatile stable storage memory disk crash vs difference",
    summary: "Volatile storage loses its data in a crash, non-volatile storage survives a crash but not every disk failure and stable storage is built to lose nothing.",
    tables: [{ from: "3.9", ref: "cmp-storage-types" }],
    tip: "The log must be written to stable storage. Say why: recovery depends on it surviving every failure.",
    questions: ["u3-b6"]
  },
  {
    id: "recovery-methods",
    topics: ["3.9"],
    title: "Deferred update, immediate update and shadow paging",
    keywords: "deferred immediate update modification shadow paging log based recovery undo redo vs difference",
    summary: "Deferred update writes to the database only after commit. Immediate update writes at any time. Shadow paging keeps an old copy of the page table and needs no log.",
    tables: [{ from: "3.9", ref: "cmp-recovery-methods" }],
    tip: "Remember the pairs: deferred update needs only redo, immediate update needs undo and redo and shadow paging needs neither.",
    questions: ["u3-b6", "u3-b15"]
  },
  {
    id: "commit-rollback-savepoint",
    topics: ["3.10", "3.14"],
    title: "COMMIT, ROLLBACK and ROLLBACK TO SAVEPOINT",
    keywords: "commit rollback savepoint rollback to release tcl vs difference",
    summary: "COMMIT makes all changes of a transaction permanent; ROLLBACK undoes all of them; ROLLBACK TO SAVEPOINT undoes only the changes made after that savepoint.",
    tables: [{
      caption: "COMMIT, ROLLBACK and ROLLBACK TO SAVEPOINT",
      head: ["Basis", "COMMIT", "ROLLBACK", "ROLLBACK TO SAVEPOINT"],
      rows: [
        ["Effect", "Makes all changes permanent", "Undoes all changes", "Undoes only the changes after the savepoint"],
        ["Transaction afterwards", "Ends", "Ends", "Stays open"],
        ["Locks", "All released", "All released", "Locks taken after the savepoint may be released (InnoDB keeps them)"],
        ["Savepoints afterwards", "All removed", "All removed", "That savepoint is kept; later ones are removed"],
        ["ACID property", "Durability", "Atomicity", "Atomicity, for part of a transaction"],
        ["Can be undone?", "No", "No", "Yes, by a later ROLLBACK of the whole transaction"]
      ]
    }],
    syntax: [
      { label: "SQL", code: "START TRANSACTION;\nSAVEPOINT SP1;\nDELETE FROM CUSTOMERS WHERE ID = 1;\nSAVEPOINT SP2;\nDELETE FROM CUSTOMERS WHERE ID = 2;\nDELETE FROM CUSTOMERS WHERE ID = 3;\n\nROLLBACK TO SP2;\n-- IDs 2 and 3 are back; ID 1 is\n-- still deleted\nCOMMIT;\n-- now ID 1 is gone for good" },
      { label: "Other forms", code: "ROLLBACK;\n-- undo everything since\n-- START TRANSACTION\n\nRELEASE SAVEPOINT SP1;\n-- forget the savepoint;\n-- no change is undone" }
    ],
    read: ["3.10#example", "3.14#tcl"],
    questions: ["u3-a9", "u3-a14", "u3-b7", "u3-b11", "u3-b13"]
  },
  {
    id: "isolation-levels",
    topics: ["3.11"],
    title: "READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ and SERIALIZABLE",
    keywords: "isolation levels read uncommitted committed repeatable read serializable dirty phantom vs difference",
    summary: "Each higher isolation level blocks one more problem: dirty reads, then non-repeatable reads, then phantoms. More isolation means less concurrency.",
    tables: [
      { from: "3.11", ref: "tbl-isolation-matrix" },
      { from: "3.11", ref: "cmp-isolation-levels" }
    ],
    syntax: [
      { label: "Set the level", code: "SET TRANSACTION ISOLATION LEVEL\n  READ COMMITTED;\nSTART TRANSACTION;\n-- ...\nCOMMIT;" },
      { label: "For the whole session", code: "SET SESSION TRANSACTION\n  ISOLATION LEVEL SERIALIZABLE;\n\nSELECT @@transaction_isolation;\n-- MySQL's default is\n-- REPEATABLE-READ" }
    ],
    tip: "MySQL's default level is REPEATABLE READ, while Oracle and SQL Server use READ COMMITTED. Name both if the question asks for examples.",
    read: ["3.11#set"],
    questions: ["u3-a10", "u3-b7", "u3-b12"]
  },
  {
    id: "locking-reads-and-lock-tables",
    topics: ["3.12"],
    title: "SELECT ... FOR SHARE, SELECT ... FOR UPDATE and LOCK TABLES",
    keywords: "for share for update lock in share mode lock tables unlock row lock table lock vs difference",
    summary: "FOR SHARE takes shared row locks, FOR UPDATE takes exclusive row locks and LOCK TABLES locks whole tables for a session.",
    tables: [
      {
        caption: "Locking statements in MySQL",
        head: ["Basis", "SELECT ... FOR SHARE", "SELECT ... FOR UPDATE", "LOCK TABLES"],
        rows: [
          ["Locks", "The rows read, in shared (S) mode", "The rows read, in exclusive (X) mode", "Whole tables, in READ or WRITE mode"],
          ["Others can", "Read and also lock FOR SHARE, but not change", "Read old snapshots only; must wait to lock or change", "READ: read only. WRITE: nothing"],
          ["Needs a transaction", "Yes; locks are held until COMMIT or ROLLBACK", "Yes; locks are held until COMMIT or ROLLBACK", "No; it commits any open transaction first"],
          ["Released by", "COMMIT or ROLLBACK", "COMMIT or ROLLBACK", "UNLOCK TABLES"],
          ["Concurrency", "High", "Medium", "Low"],
          ["Typical use", "Check that a parent row exists before inserting a child", "Read a seat or a balance, then change it", "Maintenance, or tables without transactions (MyISAM)"]
        ]
      },
      { from: "3.12", ref: "cmp-locking-reads" }
    ],
    syntax: [
      { label: "FOR SHARE", code: "START TRANSACTION;\nSELECT * FROM Games\nWHERE GameID = 5\nFOR SHARE;\n-- insert into Cart ...\nCOMMIT;" },
      { label: "FOR UPDATE", code: "START TRANSACTION;\nSELECT status FROM seats\nWHERE seat_no = '12A'\nFOR UPDATE;\nUPDATE seats SET status = 'booked'\nWHERE seat_no = '12A';\nCOMMIT;" },
      { label: "LOCK TABLES", code: "LOCK TABLES Games READ,\n            Cart WRITE;\n-- read Games;\n-- read and write Cart\nUNLOCK TABLES;" }
    ],
    read: ["3.12#locking-reads", "3.12#lock-tables"],
    questions: ["u3-a11", "u3-b8"]
  },
  {
    id: "backup-types",
    topics: ["3.13"],
    title: "Full, incremental and differential backups",
    keywords: "backup full incremental differential restore vs difference",
    summary: "A full backup copies everything; an incremental backup copies changes since the last backup of any kind; a differential backup copies changes since the last full backup.",
    tables: [{ from: "3.13", ref: "cmp-backup-types" }],
    tip: "Use a weekly example: full on Sunday, then incremental or differential each day. Ask which backups are needed to restore on Thursday.",
    read: ["3.13#example"],
    questions: ["u3-a15", "u3-b9"]
  },
  {
    id: "dcl-vs-tcl",
    topics: ["3.14"],
    title: "DCL and TCL",
    keywords: "dcl tcl data control transaction control language grant revoke commit rollback vs difference",
    summary: "DCL decides who may use which data (GRANT, REVOKE); TCL decides when changes become permanent or are undone (COMMIT, ROLLBACK, SAVEPOINT).",
    tables: [{ from: "3.14", ref: "cmp-dcl-tcl" }],
    syntax: [
      { label: "DCL", code: "GRANT SELECT, INSERT\n  ON shop.Games\n  TO 'clerk'@'localhost';\n\nREVOKE INSERT\n  ON shop.Games\n  FROM 'clerk'@'localhost';" },
      { label: "TCL", code: "START TRANSACTION;\nUPDATE Games SET BasePrice = 499\n  WHERE GameID = 5;\nSAVEPOINT price_set;\nDELETE FROM Cart;\nROLLBACK TO price_set;\nCOMMIT;" }
    ],
    questions: ["u3-a12", "u3-a13", "u3-a14", "u3-b18"]
  },
  {
    id: "grant-vs-revoke",
    topics: ["3.14"],
    title: "GRANT and REVOKE",
    keywords: "grant revoke privileges dcl with grant option vs difference",
    summary: "GRANT gives a user privileges on database objects; REVOKE takes them back.",
    tables: [{
      caption: "GRANT and REVOKE",
      head: ["Basis", "GRANT", "REVOKE"],
      rows: [
        ["Purpose", "Gives privileges", "Takes privileges away"],
        ["Keyword before the user", "TO", "FROM"],
        ["Passing rights on", "<code>WITH GRANT OPTION</code> lets the user grant the same privileges to others", "Removing <code>GRANT OPTION</code> stops the user from granting it"],
        ["Run by", "The DBA, the owner or a user who has the privilege WITH GRANT OPTION", "The DBA, or the user who granted it"],
        ["Effect of a mistake", "The user can see or change too much", "MySQL gives an error if that privilege was never granted"],
        ["Transaction", "Takes effect at once; cannot be rolled back", "Takes effect at once; cannot be rolled back"],
        ["See the result", "<code>SHOW GRANTS FOR user;</code>", "<code>SHOW GRANTS FOR user;</code>"]
      ]
    }],
    syntax: [
      { label: "GRANT", code: "CREATE USER 'clerk'@'localhost'\n  IDENTIFIED BY 'Str0ng#Pass';\n\nGRANT SELECT, UPDATE (BasePrice)\n  ON shop.Games\n  TO 'clerk'@'localhost'\n  WITH GRANT OPTION;" },
      { label: "REVOKE", code: "REVOKE UPDATE (BasePrice)\n  ON shop.Games\n  FROM 'clerk'@'localhost';\n\nREVOKE GRANT OPTION\n  ON shop.Games\n  FROM 'clerk'@'localhost';" }
    ],
    read: ["3.14#grant", "3.14#revoke"],
    questions: ["u3-a13", "u3-b10"]
  }
]);
