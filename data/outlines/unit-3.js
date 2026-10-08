/* Unit III 16-mark answer outlines, keyed by question id. See assets/js/outlines.js for the shape.
   Each outline is a plan only. The pages it links to hold the content the student must write out. */
(function () {
  var D = (window.DBMS = window.DBMS || {});
  D.outlines = D.outlines || {};

  D.outlines["u3-b1"] = {
    aim: "Define a transaction, then give each ACID property its own heading with a definition, the fund-transfer example showing what goes wrong without it, and the DBMS component that ensures it. The transaction state diagram adds value.",
    sections: [
      {
        title: "Introduction: what is a transaction?",
        pages: 0.75,
        see: ["3.1#what", "3.1#operations", "3.2#overview"],
        points: [
          "Define a transaction: a unit of program execution that reads and may change data, and must run completely or not at all.",
          "Explain read(X) and write(X).",
          "Introduce the running example: T<sub>i</sub> transfers ₹50 from A (₹1000) to B (₹2000)."
        ],
        example: ["T<sub>i</sub>: read(A); A := A − 50; write(A); read(B); B := B + 50; write(B)."]
      },
      {
        title: "Atomicity",
        pages: 0.75,
        see: ["3.2#atomicity"],
        points: [
          "All or nothing. If the system fails after write(A) but before write(B), ₹50 disappears.",
          "Ensured by the recovery system, using the log to undo incomplete transactions."
        ]
      },
      {
        title: "Consistency",
        pages: 0.75,
        see: ["3.2#consistency"],
        points: [
          "A transaction run alone takes the database from one consistent state to another: A + B stays ₹3000.",
          "Ensured by the programmer, with the DBMS checking integrity constraints."
        ]
      },
      {
        title: "Isolation",
        pages: 0.75,
        see: ["3.2#isolation"],
        points: [
          "Concurrent transactions must not see each other's partial results.",
          "Show another transaction reading A and B between the two writes and seeing ₹2950.",
          "Ensured by the concurrency control system."
        ],
        table: ["A two-column schedule showing the interference."]
      },
      {
        title: "Durability",
        pages: 0.75,
        see: ["3.2#durability"],
        points: [
          "Once committed, changes survive any failure.",
          "Ensured by the recovery system: write-ahead log on stable storage."
        ]
      },
      {
        title: "Transaction states",
        pages: 0.75,
        see: ["3.1#states", "3.1#end", "3.1#try-it"],
        points: [
          "Active, partially committed, committed, failed and aborted; restart or kill after abort."
        ],
        draw: ["The transaction state diagram with all five states and the arrows between them."]
      },
      {
        title: "Summary table and conclusion",
        pages: 0.75,
        see: ["3.2#who"],
        points: [
          "Close with the table and one sentence: ACID is what makes a database trustworthy."
        ],
        table: ["Property, meaning, what goes wrong without it, component that ensures it."]
      }
    ]
  };

  D.outlines["u3-b2"] = {
    aim: "Define serializability and why it matters, then explain conflict serializability (conflicting instructions, swapping, precedence graph test) and view serializability (the three conditions), each with a schedule worked through. A precedence graph drawn for a real schedule is essential.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["3.4#what", "3.3#serial", "3.3#concurrent"],
        points: [
          "Define a schedule, a serial schedule and a concurrent schedule in one line each.",
          "Define serializability: a concurrent schedule is serializable if it is equivalent to some serial schedule, so it keeps the database consistent."
        ]
      },
      {
        title: "Conflicting instructions",
        pages: 0.75,
        see: ["3.4#conflict"],
        points: [
          "Two instructions conflict if they belong to different transactions, access the same item, and at least one is a write.",
          "Give the four read/write cases."
        ],
        table: ["I<sub>i</sub>, I<sub>j</sub> and whether they conflict: four rows."]
      },
      {
        title: "Conflict serializability",
        pages: 1,
        see: ["3.4#conflict-ser"],
        points: [
          "Conflict equivalence: one schedule can be turned into the other by swapping non-conflicting instructions.",
          "A schedule is conflict serializable if it is conflict equivalent to a serial schedule.",
          "Show the swaps that turn a concurrent schedule of T1 and T2 into the serial schedule T1, T2."
        ],
        table: ["The schedule before and after the swaps."]
      },
      {
        title: "Testing with a precedence graph",
        pages: 1.25,
        see: ["3.4#test", "3.4#worked", "3.4#try-it"],
        points: [
          "Steps: a node for each transaction; an edge T<sub>i</sub> → T<sub>j</sub> for each conflicting pair where T<sub>i</sub> acts first; a cycle means not conflict serializable.",
          "Work the three-transaction example: list the conflicting pairs, draw the graph, give the serial order by topological sort.",
          "Show one schedule whose graph has a cycle."
        ],
        draw: ["The precedence graph of the worked example, and one graph with a cycle."]
      },
      {
        title: "View serializability",
        pages: 1,
        see: ["3.4#view-ser"],
        points: [
          "The three conditions of view equivalence: same initial reads, same reads-from, same final writes.",
          "Every conflict serializable schedule is view serializable, but not the other way.",
          "Example with a blind write that is view serializable but not conflict serializable."
        ]
      },
      {
        title: "Comparison and conclusion",
        pages: 0.5,
        see: ["3.4#compare"],
        points: [
          "Compare the two, then conclude that DBMSs use conflict serializability because it is easy to test and to enforce with locking."
        ],
        table: ["Conflict and view serializability compared: basis, test, cost of testing, relationship."],
        draw: ["Nested sets: serial inside conflict serializable inside view serializable inside all schedules."]
      }
    ]
  };

  D.outlines["u3-b3"] = {
    aim: "Explain why transactions run concurrently, then each concurrency problem with its own schedule table showing the values going wrong step by step. The answer ends with how concurrency control (locking, timestamps) prevents them.",
    sections: [
      {
        title: "Need for concurrency",
        pages: 0.75,
        see: ["3.5#need", "3.3#why"],
        points: [
          "Better throughput and resource use (CPU and disk work at the same time).",
          "Shorter waiting time for short transactions.",
          "Give a real example: many users booking train tickets at once."
        ]
      },
      {
        title: "What is concurrency control?",
        pages: 0.5,
        see: ["3.5#control"],
        points: [
          "Definition and goal: allow concurrent execution while keeping isolation and consistency (serializable schedules)."
        ]
      },
      {
        title: "Lost update problem",
        pages: 0.75,
        see: ["3.5#lost-update", "3.5#try-it"],
        points: [
          "Two transactions read the same value and both write; one update is lost."
        ],
        table: ["Schedule of T1 and T2 with the value of X after each step."]
      },
      {
        title: "Dirty read (temporary update) problem",
        pages: 0.75,
        see: ["3.5#dirty-read"],
        points: [
          "T2 reads a value written by T1, and then T1 aborts."
        ],
        table: ["The schedule with values."]
      },
      {
        title: "Unrepeatable read problem",
        pages: 0.5,
        see: ["3.5#unrepeatable"],
        points: [
          "T1 reads X twice and gets different values because T2 changed it in between."
        ],
        table: ["The schedule with values."]
      },
      {
        title: "Incorrect summary and phantom problems",
        pages: 0.75,
        see: ["3.5#summary", "3.5#phantom"],
        points: [
          "Incorrect summary: an aggregate reads some values before and some after another transaction's update.",
          "Phantom: a repeated query finds new rows inserted by another transaction."
        ],
        table: ["A schedule for each."]
      },
      {
        title: "How concurrency control solves them",
        pages: 0.75,
        see: ["3.5#protocols", "3.6#modes", "3.7#rule"],
        points: [
          "Lock-based protocols (shared and exclusive locks, two phase locking), timestamp-based protocols, validation (optimistic) protocols, multiversion schemes, in one or two lines each."
        ],
        table: ["Problem, cause, which protocol or isolation level prevents it."]
      },
      {
        title: "Conclusion",
        pages: 0.25,
        points: [
          "Concurrency improves performance; concurrency control makes it safe."
        ]
      }
    ]
  };

  D.outlines["u3-b4"] = {
    aim: "Lock basics first, then the two phase rule with growing and shrinking phases, a lock-point graph, an example transaction, why it guarantees serializability, its problems, and strict and rigorous 2PL compared. Draw the phases and give schedules.",
    sections: [
      {
        title: "Introduction: locks",
        pages: 0.75,
        see: ["3.6#locks", "3.6#modes", "3.6#compat"],
        points: [
          "Define a lock; shared (S) and exclusive (X) modes.",
          "The compatibility matrix.",
          "Mention the lock manager and lock table in one line."
        ],
        table: ["The S/X compatibility matrix."]
      },
      {
        title: "Why simple locking is not enough",
        pages: 0.5,
        see: ["3.6#example", "3.6#protocol"],
        points: [
          "Unlocking too early can show an inconsistent state; a locking protocol fixes the order of lock and unlock."
        ]
      },
      {
        title: "The two phase locking protocol",
        pages: 1,
        see: ["3.7#rule", "3.7#example"],
        points: [
          "Growing phase: may obtain locks, may not release any.",
          "Shrinking phase: may release locks, may not obtain any.",
          "Lock point: the moment the last lock is obtained.",
          "Show one transaction that follows 2PL and one that does not."
        ],
        draw: ["Number of locks held against time: rising (growing phase), the lock point, then falling (shrinking phase)."]
      },
      {
        title: "Why 2PL ensures serializability",
        pages: 0.5,
        see: ["3.7#serial"],
        points: [
          "Transactions can be ordered by their lock points; that order is an equivalent serial schedule."
        ]
      },
      {
        title: "Demerits of basic 2PL",
        pages: 0.75,
        see: ["3.7#demerits", "3.8#example"],
        points: [
          "Deadlock is still possible; show a two-transaction example.",
          "Cascading rollback is possible; show T2 reading a value written by T1, which then aborts."
        ],
        table: ["The deadlock schedule."]
      },
      {
        title: "Types of 2PL",
        pages: 1,
        see: ["3.7#types", "3.7#compare"],
        points: [
          "<strong>Strict 2PL</strong>: hold all exclusive locks until commit or abort; no cascading rollback.",
          "<strong>Rigorous 2PL</strong>: hold all locks until commit; transactions serialize in commit order.",
          "<strong>Conservative (static) 2PL</strong>: lock everything before starting; no deadlock."
        ],
        draw: ["Lock graphs for strict and rigorous 2PL, showing locks dropping only at commit."],
        table: ["Basic, conservative, strict and rigorous 2PL compared: serializable, deadlock-free, cascadeless."]
      },
      {
        title: "Lock conversion and conclusion",
        pages: 0.5,
        see: ["3.7#conversion", "3.7#try-it"],
        points: [
          "Upgrade (S to X) only in the growing phase; downgrade (X to S) only in the shrinking phase.",
          "Conclude: strict 2PL is what most commercial DBMSs use."
        ]
      }
    ]
  };

  D.outlines["u3-b5"] = {
    aim: "Define deadlock with an example and a wait-for graph, then give prevention, avoidance (wait-die and wound-wait) and detection with recovery each their own heading. The examiner looks for the timestamp rules stated exactly and a wait-for graph with a cycle.",
    sections: [
      {
        title: "Definition and example",
        pages: 0.75,
        see: ["3.8#what", "3.8#example"],
        points: [
          "Define deadlock: each transaction in a set waits for an item held by another in the set.",
          "Show T3 and T4 locking B and A in opposite order."
        ],
        table: ["The step-by-step schedule that ends in deadlock."]
      },
      {
        title: "Necessary conditions and ways to handle deadlock",
        pages: 0.5,
        see: ["3.8#handling"],
        points: [
          "Mutual exclusion, hold and wait, no preemption, circular wait.",
          "The three approaches: prevention, avoidance (timestamps or timeouts), detection and recovery."
        ]
      },
      {
        title: "Deadlock prevention",
        pages: 0.75,
        see: ["3.8#prevention"],
        points: [
          "Lock all items before starting (conservative 2PL).",
          "Lock items in a fixed order.",
          "Use preemption and rollback. Give the cost of each."
        ]
      },
      {
        title: "Avoidance with timestamps: wait-die and wound-wait",
        pages: 1.25,
        see: ["3.8#timestamps"],
        points: [
          "Each transaction gets a timestamp when it starts; older = smaller timestamp.",
          "<strong>Wait-die</strong> (non-preemptive): an older transaction waits; a younger one dies (rolls back).",
          "<strong>Wound-wait</strong> (preemptive): an older transaction wounds (rolls back) the younger; a younger one waits.",
          "A rolled-back transaction keeps its original timestamp, so it does not starve."
        ],
        table: ["Wait-die and wound-wait: what happens when an older and when a younger transaction requests a lock."]
      },
      {
        title: "Timeout",
        pages: 0.25,
        see: ["3.8#timeout"],
        points: [
          "Roll back a transaction that waits longer than a set time; simple but hard to tune."
        ]
      },
      {
        title: "Deadlock detection",
        pages: 0.75,
        see: ["3.8#detection", "3.8#try-it"],
        points: [
          "Build the wait-for graph: an edge T<sub>i</sub> → T<sub>j</sub> when T<sub>i</sub> waits for T<sub>j</sub>.",
          "A cycle means deadlock; the system runs the check periodically."
        ],
        draw: ["A wait-for graph with a cycle, and the same graph after one victim is removed."]
      },
      {
        title: "Recovery from deadlock",
        pages: 0.75,
        see: ["3.8#recovery", "3.8#livelock"],
        points: [
          "Choose a victim (least cost), roll back totally or partially, and avoid starvation by counting rollbacks.",
          "Explain starvation and livelock briefly."
        ]
      },
      {
        title: "Conclusion",
        pages: 0.25,
        points: [
          "Compare the methods in two sentences: prevention wastes concurrency, detection costs checking time."
        ]
      }
    ]
  };

  D.outlines["u3-b6"] = {
    aim: "Explain why recovery is needed and the kinds of failure, then the log and write-ahead logging, deferred and immediate update with undo and redo, checkpoints, the recovery algorithm and shadow paging. A log example with the recovery actions is the core.",
    sections: [
      {
        title: "Why recovery is needed and failure classification",
        pages: 0.75,
        see: ["3.9#why", "3.9#failures"],
        points: [
          "Recovery restores the database to a consistent state, keeping atomicity and durability.",
          "Transaction failure (logical and system errors), system crash, disk failure."
        ]
      },
      {
        title: "Storage types",
        pages: 0.25,
        see: ["3.9#storage"],
        points: [
          "Volatile, non-volatile and stable storage."
        ]
      },
      {
        title: "The log and write-ahead logging",
        pages: 0.75,
        see: ["3.9#log"],
        points: [
          "Log records: &lt;T<sub>i</sub> start&gt;, &lt;T<sub>i</sub>, X, old, new&gt;, &lt;T<sub>i</sub> commit&gt;, &lt;T<sub>i</sub> abort&gt;.",
          "Write-ahead logging rule: the log record reaches stable storage before the data."
        ]
      },
      {
        title: "Deferred database modification",
        pages: 0.75,
        see: ["3.9#deferred"],
        points: [
          "Writes go to the database only after commit; log holds new values; only redo is needed."
        ],
        example: ["A log for T0 and T1 and the actions after a crash at three different points."]
      },
      {
        title: "Immediate database modification",
        pages: 0.75,
        see: ["3.9#immediate"],
        points: [
          "Writes may reach the database before commit; log holds old and new values; undo and redo are needed.",
          "Rule: redo if the log has both start and commit; undo if it has start but no commit."
        ],
        example: ["The same log with the undo and redo list."]
      },
      {
        title: "Checkpoints and the recovery algorithm",
        pages: 1,
        see: ["3.9#checkpoints", "3.9#algorithm", "3.9#try-it"],
        points: [
          "Why checkpoints: avoid scanning the whole log.",
          "Steps of a checkpoint; recovery starts from the last checkpoint.",
          "The redo pass forward and the undo pass backward."
        ],
        draw: ["A timeline with a checkpoint and a crash, transactions T1 to T4 as bars, marking which are redone, undone or ignored."]
      },
      {
        title: "Shadow paging",
        pages: 0.75,
        see: ["3.9#shadow"],
        points: [
          "Current and shadow page tables; copy on write; commit by switching the pointer.",
          "Merits: no undo or redo. Demerits: copying, fragmentation, garbage collection."
        ],
        draw: ["Shadow page table and current page table pointing to old and new pages."]
      },
      {
        title: "Comparison and conclusion",
        pages: 0.5,
        see: ["3.9#compare"],
        points: [
          "Compare the techniques, then conclude."
        ],
        table: ["Deferred update, immediate update and shadow paging compared."]
      }
    ]
  };

  D.outlines["u3-b7"] = {
    aim: "Two short notes of equal weight. For savepoints: definition, the three commands, and a worked transaction with the table at each step. For isolation levels: the three phenomena, the four levels, the matrix and how to set them.",
    sections: [
      {
        title: "a) Savepoints: definition and commands",
        pages: 0.75,
        see: ["3.10#what", "3.10#syntax"],
        points: [
          "A savepoint marks a point inside a transaction so you can roll back part of it.",
          "SAVEPOINT name; ROLLBACK TO name; RELEASE SAVEPOINT name."
        ]
      },
      {
        title: "a) Savepoints: worked example",
        pages: 1,
        see: ["3.10#example", "3.10#try-it"],
        points: [
          "Delete three customers with a savepoint before each, roll back to the second savepoint and show which rows return."
        ],
        table: ["The CUSTOMERS table before, after the deletes, and after ROLLBACK TO."]
      },
      {
        title: "a) Rules and uses",
        pages: 0.5,
        see: ["3.10#rules", "3.10#uses"],
        points: [
          "Savepoints vanish at COMMIT; rolling back to one removes later savepoints; locks are kept.",
          "Uses: long transactions, error handling in batches."
        ]
      },
      {
        title: "b) Isolation levels: the three phenomena",
        pages: 0.75,
        see: ["3.11#what", "3.11#phenomena"],
        points: [
          "Define an isolation level and the trade-off between consistency and concurrency.",
          "Dirty read, non-repeatable read and phantom read, each with a two-transaction example."
        ]
      },
      {
        title: "b) The four levels",
        pages: 1.25,
        see: ["3.11#matrix", "3.11#levels", "3.11#try-it"],
        points: [
          "READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ and SERIALIZABLE, with what each allows."
        ],
        table: ["The matrix: each level against the three phenomena."]
      },
      {
        title: "b) Setting the level and conclusion",
        pages: 0.75,
        see: ["3.11#set", "3.11#mysql", "3.11#choose"],
        points: [
          "SET TRANSACTION ISOLATION LEVEL ...; MySQL's default is REPEATABLE READ.",
          "How to choose a level, and a short conclusion for both notes."
        ]
      }
    ]
  };

  D.outlines["u3-b8"] = {
    aim: "Show the SQL commands a programmer uses to control transactions, isolation and locking, and the facilities that support recovery. Each command needs its syntax, a short example and what it does. A summary table of all commands finishes the answer.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["3.12#overview"],
        points: [
          "SQL gives commands to group statements into transactions, set isolation, lock rows and recover from failures."
        ]
      },
      {
        title: "Starting and ending a transaction",
        pages: 0.75,
        see: ["3.12#boundaries", "3.14#tcl"],
        points: [
          "START TRANSACTION (BEGIN), COMMIT, ROLLBACK; autocommit on and off.",
          "Example: a fund transfer committed, and one rolled back."
        ]
      },
      {
        title: "SET TRANSACTION and isolation levels",
        pages: 0.75,
        see: ["3.12#set-transaction", "3.11#matrix"],
        points: [
          "SET TRANSACTION ISOLATION LEVEL and READ ONLY / READ WRITE.",
          "The four levels in one line each."
        ],
        table: ["The isolation level matrix."]
      },
      {
        title: "Locking reads and table locks",
        pages: 1,
        see: ["3.12#locking-reads", "3.12#lock-tables"],
        points: [
          "SELECT ... FOR UPDATE (exclusive) and FOR SHARE (shared), with a two-session example.",
          "LOCK TABLES ... READ / WRITE and UNLOCK TABLES."
        ],
        table: ["Session 1 and session 2 side by side, showing the second session waiting."]
      },
      {
        title: "Lock waits and deadlocks",
        pages: 0.5,
        see: ["3.12#waits"],
        points: [
          "innodb_lock_wait_timeout; automatic deadlock detection and the error the victim receives."
        ]
      },
      {
        title: "Facilities for recovery",
        pages: 1,
        see: ["3.12#recovery", "3.10#syntax", "3.13#point-in-time"],
        points: [
          "SAVEPOINT and ROLLBACK TO for partial rollback.",
          "The redo and undo logs and crash recovery in InnoDB.",
          "Backups with mysqldump and point-in-time recovery from the binary log."
        ]
      },
      {
        title: "Summary table and conclusion",
        pages: 0.75,
        see: ["3.12#summary", "3.12#try-it"],
        points: [
          "List every command with its purpose, then conclude."
        ],
        table: ["Command, group (transaction, isolation, locking, recovery), purpose."]
      }
    ]
  };

  D.outlines["u3-b9"] = {
    aim: "Define backup and recovery, then explain the backup types with a worked weekly plan, other classifications, the archival dump, point-in-time recovery with the binary log, the MySQL commands, and remote backup systems. A diagram of the remote backup setup and a comparison table help.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["3.13#what"],
        points: [
          "Define backup and recovery and why both are needed (disk failure, human error, disasters)."
        ]
      },
      {
        title: "Full, incremental and differential backups",
        pages: 1,
        see: ["3.13#types"],
        points: [
          "Define each with its merits and demerits: backup time, storage, restore time."
        ],
        table: ["Full, incremental and differential compared."]
      },
      {
        title: "Worked example: a weekly plan",
        pages: 0.75,
        see: ["3.13#example"],
        points: [
          "Full backup on Sunday, failure on Thursday: which backups are restored with incremental and with differential plans."
        ],
        draw: ["A timeline from Sunday to Thursday with the backups marked."]
      },
      {
        title: "Other classifications",
        pages: 0.5,
        see: ["3.13#kinds"],
        points: [
          "Physical and logical; hot (online) and cold (offline); local and off-site."
        ]
      },
      {
        title: "Archival dump and point-in-time recovery",
        pages: 0.75,
        see: ["3.13#dump", "3.13#point-in-time"],
        points: [
          "Dumping the database to stable storage and replaying the log after it.",
          "Point-in-time recovery: restore the backup, then replay the binary log up to just before the error."
        ]
      },
      {
        title: "Backup and restore in MySQL",
        pages: 0.5,
        see: ["3.13#mysql"],
        points: [
          "mysqldump to back up, mysql to restore, mysqlbinlog for point-in-time recovery, with one command each."
        ]
      },
      {
        title: "Remote backup systems",
        pages: 0.75,
        see: ["3.13#remote"],
        points: [
          "Primary and backup site; log shipping; failure detection and transfer of control.",
          "One-safe, two-very-safe and two-safe commit."
        ],
        draw: ["Primary site sending log records over the network to a remote backup site."]
      },
      {
        title: "A good backup plan and conclusion",
        pages: 0.5,
        see: ["3.13#plan"],
        points: [
          "The 3-2-1 rule, testing restores, encryption; then a short conclusion."
        ]
      }
    ]
  };

  D.outlines["u3-b10"] = {
    aim: "Define DCL and its purpose, then GRANT and REVOKE with full syntax, the privilege list, WITH GRANT OPTION, cascading revoke and roles, each with a working example. Show who can do what after each command.",
    sections: [
      {
        title: "Introduction: SQL command groups",
        pages: 0.5,
        see: ["3.14#groups"],
        points: [
          "DDL, DML, DCL and TCL in one line each; DCL controls who may access what."
        ],
        table: ["Command groups with their commands."]
      },
      {
        title: "Privileges",
        pages: 0.5,
        see: ["5.11#levels"],
        points: [
          "Object privileges (SELECT, INSERT, UPDATE, DELETE, REFERENCES) and system privileges (CREATE, DROP); privileges at database, table and column level."
        ]
      },
      {
        title: "GRANT",
        pages: 1.25,
        see: ["3.14#grant"],
        points: [
          "Syntax: GRANT privileges ON object TO user [WITH GRANT OPTION].",
          "Examples: SELECT on one table; INSERT and UPDATE on selected columns; ALL PRIVILEGES.",
          "WITH GRANT OPTION and how privileges pass from user to user."
        ],
        draw: ["An authorization graph: DBA grants to U1, U1 grants to U2 and U3."]
      },
      {
        title: "REVOKE",
        pages: 1,
        see: ["3.14#revoke"],
        points: [
          "Syntax: REVOKE privileges ON object FROM user.",
          "Cascading revoke: privileges that U1 passed on are also removed.",
          "Example: revoke UPDATE from a user and show what they can still do."
        ]
      },
      {
        title: "Roles",
        pages: 1,
        see: ["3.14#roles", "5.12#what"],
        points: [
          "CREATE ROLE, GRANT privileges TO role, GRANT role TO user, SET DEFAULT ROLE.",
          "The game store lab example: staff and customer roles."
        ]
      },
      {
        title: "Summary and conclusion",
        pages: 0.75,
        see: ["3.14#compare", "3.14#try-it"],
        points: [
          "Compare GRANT and REVOKE, then conclude on least privilege."
        ],
        table: ["GRANT and REVOKE compared: purpose, syntax, options, effect."]
      }
    ]
  };

  D.outlines["u3-b11"] = {
    aim: "Define TCL and the transaction it controls, then COMMIT, ROLLBACK, SAVEPOINT (with ROLLBACK TO and RELEASE) and SET TRANSACTION, each with syntax and an example showing the table before and after. Autocommit and DDL's implicit commit earn the extra marks.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["3.14#groups", "3.1#what"],
        points: [
          "TCL commands manage transactions; they work only on DML changes.",
          "Recall atomicity and durability."
        ]
      },
      {
        title: "Autocommit and starting a transaction",
        pages: 0.5,
        see: ["3.12#boundaries"],
        points: [
          "MySQL commits each statement by default; START TRANSACTION or SET autocommit = 0 turns this off."
        ]
      },
      {
        title: "COMMIT",
        pages: 0.75,
        see: ["3.14#tcl"],
        points: [
          "Makes all changes of the transaction permanent and visible to others.",
          "Example: two INSERTs then COMMIT."
        ]
      },
      {
        title: "ROLLBACK",
        pages: 0.75,
        see: ["3.14#tcl"],
        points: [
          "Undoes all uncommitted changes.",
          "Example: a DELETE without WHERE, undone by ROLLBACK, with the table before and after."
        ],
        table: ["The table before the DELETE, after it, and after ROLLBACK."]
      },
      {
        title: "SAVEPOINT, ROLLBACK TO and RELEASE",
        pages: 1.25,
        see: ["3.10#syntax", "3.10#example"],
        points: [
          "Mark points in a transaction and roll back part of it.",
          "Worked example with two savepoints, showing the rows at each step."
        ],
        table: ["The table at each step."]
      },
      {
        title: "SET TRANSACTION and implicit commit",
        pages: 0.5,
        see: ["3.12#set-transaction"],
        points: [
          "SET TRANSACTION for isolation level and read-only mode.",
          "DDL statements (CREATE, ALTER, DROP) commit automatically and cannot be rolled back."
        ]
      },
      {
        title: "Summary and conclusion",
        pages: 0.75,
        see: ["3.14#steps", "3.14#try-it"],
        points: [
          "The steps of a transaction from start to commit or rollback, then conclude."
        ],
        draw: ["A flow: START TRANSACTION, DML statements, SAVEPOINT, then COMMIT or ROLLBACK."],
        table: ["TCL command, purpose, example."]
      }
    ]
  };

  D.outlines["u3-b12"] = {
    aim: "Explain why isolation levels exist, the three phenomena with schedules, the four SQL levels one by one with an example of what each allows, the matrix, and how to set and choose a level. Two-session examples carry the marks.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["3.11#what", "3.2#isolation"],
        points: [
          "Define an isolation level: how much one transaction may see of others' changes.",
          "The trade-off: higher isolation, fewer anomalies, less concurrency."
        ]
      },
      {
        title: "The three phenomena",
        pages: 1.25,
        see: ["3.11#phenomena", "3.5#dirty-read", "3.5#unrepeatable", "3.5#phantom"],
        points: [
          "Dirty read, non-repeatable read and phantom read, each with a definition and a two-transaction schedule."
        ],
        table: ["A schedule for each phenomenon."]
      },
      {
        title: "The four isolation levels",
        pages: 1.5,
        see: ["3.11#levels", "3.11#try-it"],
        points: [
          "READ UNCOMMITTED: reads uncommitted data.",
          "READ COMMITTED: reads only committed data; each read sees the latest commit.",
          "REPEATABLE READ: rows read once do not change; phantoms possible in the standard.",
          "SERIALIZABLE: same result as some serial order.",
          "Give a two-session example for each, showing what the second session sees."
        ]
      },
      {
        title: "The matrix",
        pages: 0.5,
        see: ["3.11#matrix"],
        points: [
          "All levels forbid dirty writes."
        ],
        table: ["Levels against the three phenomena."]
      },
      {
        title: "Setting and choosing the level",
        pages: 1,
        see: ["3.11#set", "3.11#mysql", "3.11#choose"],
        points: [
          "SET [SESSION | GLOBAL] TRANSACTION ISOLATION LEVEL ...; checking the current level.",
          "MySQL InnoDB uses REPEATABLE READ by default and prevents most phantoms with next-key locks.",
          "Which level suits banking, reports and analytics."
        ]
      },
      {
        title: "Conclusion",
        pages: 0.25,
        points: [
          "Choose the lowest level that keeps the application correct."
        ]
      }
    ]
  };

  D.outlines["u3-b13"] = {
    aim: "A practical answer: the steps of a transaction in SQL from start to finish, with complete SQL scripts for a commit and for a rollback, and the table shown after each step. Include savepoints and what happens on a crash.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["3.1#what", "3.1#end"],
        points: [
          "Define a transaction, commit and rollback; link them to atomicity and durability."
        ]
      },
      {
        title: "The sample table",
        pages: 0.5,
        see: ["3.10#example"],
        points: [
          "Create a table, such as account(acc_no, name, balance), and insert three rows."
        ],
        table: ["The starting table."]
      },
      {
        title: "Steps for a commit",
        pages: 1,
        see: ["3.14#steps", "3.12#boundaries"],
        points: [
          "Step 1: SET autocommit = 0 or START TRANSACTION.",
          "Step 2: run the DML statements (a fund transfer of two UPDATEs).",
          "Step 3: check the result with SELECT.",
          "Step 4: COMMIT; the change is now permanent and visible to other sessions."
        ],
        table: ["The table after each step."]
      },
      {
        title: "Steps for a rollback",
        pages: 1,
        see: ["3.14#tcl"],
        points: [
          "A mistaken UPDATE without WHERE, checked with SELECT, then undone by ROLLBACK.",
          "Show that the table returns to its state at the start of the transaction."
        ],
        table: ["The table before, after the mistake and after ROLLBACK."]
      },
      {
        title: "Partial rollback with savepoints",
        pages: 0.75,
        see: ["3.10#syntax", "3.10#rules"],
        points: [
          "SAVEPOINT, ROLLBACK TO and then COMMIT of the remaining work."
        ]
      },
      {
        title: "What the DBMS does behind the scenes",
        pages: 0.75,
        see: ["3.9#log", "3.1#states"],
        points: [
          "The log, write-ahead logging, and what happens to uncommitted work after a crash.",
          "The transaction state diagram."
        ],
        draw: ["The flow from START TRANSACTION through DML to COMMIT or ROLLBACK, or the transaction state diagram."]
      },
      {
        title: "Conclusion",
        pages: 0.5,
        see: ["3.14#try-it"],
        points: [
          "Remember that DDL commits implicitly; then sum up the steps."
        ]
      }
    ]
  };

  D.outlines["u3-b14"] = {
    aim: "Define a schedule, then each type (serial, concurrent, serializable, recoverable, non-recoverable, cascadeless, strict) with a schedule table as its example, and explain what role each plays in keeping transactions correct and recoverable.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["3.3#what"],
        points: [
          "Define a schedule: the order in which the operations of concurrent transactions run, keeping each transaction's own order.",
          "Use T1 (transfer ₹50 from A to B) and T2 (transfer 10% of A to B) as the running example."
        ]
      },
      {
        title: "Serial schedules",
        pages: 0.75,
        see: ["3.3#serial"],
        points: [
          "One transaction after another; always consistent; n transactions give n! serial schedules."
        ],
        table: ["Serial schedule T1 then T2, with the values of A and B."]
      },
      {
        title: "Concurrent schedules",
        pages: 0.75,
        see: ["3.3#concurrent", "3.3#why"],
        points: [
          "Operations interleave; why we allow it.",
          "One concurrent schedule that is correct and one that is not, with values."
        ],
        table: ["The two concurrent schedules."]
      },
      {
        title: "Serializable schedules",
        pages: 0.75,
        see: ["3.4#what", "3.4#conflict-ser", "3.4#test"],
        points: [
          "Equivalent to a serial schedule; conflict and view serializability in brief, with the precedence graph test."
        ],
        draw: ["A precedence graph for one of the schedules."]
      },
      {
        title: "Recoverable and non-recoverable schedules",
        pages: 0.75,
        see: ["3.3#recoverable"],
        points: [
          "Recoverable: if T<sub>j</sub> reads a value written by T<sub>i</sub>, T<sub>i</sub> commits before T<sub>j</sub>.",
          "A non-recoverable example where T<sub>j</sub> commits first and T<sub>i</sub> then aborts."
        ],
        table: ["The non-recoverable schedule."]
      },
      {
        title: "Cascadeless and strict schedules",
        pages: 0.75,
        see: ["3.3#cascadeless"],
        points: [
          "Cascading rollback and why it is costly.",
          "Cascadeless: read only committed values. Strict: neither read nor overwrite uncommitted values."
        ],
        table: ["A schedule showing cascading rollback."]
      },
      {
        title: "Types at a glance and conclusion",
        pages: 0.75,
        see: ["3.3#types", "3.3#try-it"],
        points: [
          "Summarise the role of each type, then conclude."
        ],
        draw: ["Nested sets: strict inside cascadeless inside recoverable inside all schedules."],
        table: ["Schedule type, rule, what it guarantees."]
      }
    ]
  };

  D.outlines["u3-b15"] = {
    aim: "Two techniques, each with a clear mechanism, a diagram or log example and its merits and demerits. Log-based recovery needs the log records, write-ahead logging, deferred and immediate modification with undo and redo, and checkpoints. Shadow paging needs the two page tables drawn.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["3.9#why", "3.9#failures"],
        points: [
          "Why recovery is needed, and the failures it handles."
        ]
      },
      {
        title: "Log-based recovery: the log",
        pages: 0.75,
        see: ["3.9#log"],
        points: [
          "The log record types and write-ahead logging."
        ],
        example: ["A short log for T0 and T1."]
      },
      {
        title: "Deferred and immediate modification",
        pages: 1.25,
        see: ["3.9#deferred", "3.9#immediate"],
        points: [
          "Deferred: redo only. Immediate: undo and redo, with the rules.",
          "Apply both to the same log after a crash at a given point."
        ],
        table: ["Crash point, transactions redone, transactions undone."]
      },
      {
        title: "Checkpoints",
        pages: 0.75,
        see: ["3.9#checkpoints", "3.9#algorithm"],
        points: [
          "What a checkpoint writes and how it shortens recovery."
        ],
        draw: ["The checkpoint timeline with transactions T1 to T4."]
      },
      {
        title: "Shadow paging",
        pages: 1.25,
        see: ["3.9#shadow", "3.9#try-it"],
        points: [
          "Page table, shadow page table and current page table.",
          "On write: copy the page, update the current table only.",
          "Commit: write the pages, then switch the root pointer to the current table. Abort: discard the current table.",
          "Merits: no log, no undo or redo, fast recovery. Demerits: copying, data fragmentation, garbage collection, hard with concurrency."
        ],
        draw: ["Shadow and current page tables pointing to old and new pages on disk."]
      },
      {
        title: "Comparison and conclusion",
        pages: 0.75,
        see: ["3.9#compare"],
        points: [
          "Compare, then conclude that most DBMSs use log-based recovery."
        ],
        table: ["Log-based recovery and shadow paging compared: mechanism, undo or redo, overhead, concurrency support."]
      }
    ]
  };

  D.outlines["u3-b16"] = {
    aim: "Two linked parts: schedules (serial, concurrent, recoverable, cascadeless) and serializability (conflict and view, with the precedence graph test). Use the same two transactions throughout and show every schedule as a table.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["3.3#what", "3.1#operations"],
        points: [
          "Define a schedule and introduce T1 and T2 as the running example."
        ]
      },
      {
        title: "Serial and concurrent schedules",
        pages: 1,
        see: ["3.3#serial", "3.3#concurrent"],
        points: [
          "Serial schedule with values; a correct concurrent schedule; an incorrect concurrent schedule."
        ],
        table: ["The three schedules with the values of A and B."]
      },
      {
        title: "Recoverable and cascadeless schedules",
        pages: 0.75,
        see: ["3.3#recoverable", "3.3#cascadeless"],
        points: [
          "Definitions with one schedule each."
        ]
      },
      {
        title: "Serializability and conflicting instructions",
        pages: 0.75,
        see: ["3.4#what", "3.4#conflict"],
        points: [
          "Why serializability is the test of correctness; the four conflict cases."
        ],
        table: ["Conflict table."]
      },
      {
        title: "Conflict serializability and the precedence graph",
        pages: 1.25,
        see: ["3.4#conflict-ser", "3.4#test", "3.4#worked"],
        points: [
          "Swapping non-conflicting operations; the precedence graph steps; a worked example with three transactions."
        ],
        draw: ["The precedence graph for the worked example."]
      },
      {
        title: "View serializability",
        pages: 0.75,
        see: ["3.4#view-ser"],
        points: [
          "The three conditions and a blind-write example."
        ]
      },
      {
        title: "Comparison and conclusion",
        pages: 0.5,
        see: ["3.4#compare", "3.3#types"],
        points: [
          "Compare conflict and view serializability; conclude."
        ],
        table: ["Conflict and view serializability compared."]
      }
    ]
  };

  D.outlines["u3-b17"] = {
    aim: "An example question: show two transactions step by step, with their locks, until each waits for the other. Draw the wait-for graph with its cycle, state the four conditions, and then say briefly how the DBMS breaks or avoids the deadlock.",
    sections: [
      {
        title: "Definition",
        pages: 0.5,
        see: ["3.8#what"],
        points: [
          "Define deadlock in one or two sentences, with an everyday analogy (two cars on a narrow bridge)."
        ]
      },
      {
        title: "Lock modes used in the example",
        pages: 0.5,
        see: ["3.6#modes", "3.6#compat"],
        points: [
          "Shared and exclusive locks and the compatibility matrix."
        ],
        table: ["Compatibility matrix."]
      },
      {
        title: "The example step by step",
        pages: 1.5,
        see: ["3.8#example", "3.8#try-it"],
        points: [
          "T3 transfers ₹50 from B to A; T4 displays A + B. Both follow 2PL but lock in opposite order.",
          "Go through each step: which lock is asked for, granted or refused, and who waits for whom.",
          "Point out the exact step where the deadlock forms."
        ],
        table: ["Step, T3, T4, what happens: six rows."]
      },
      {
        title: "Wait-for graph",
        pages: 0.75,
        see: ["3.8#detection"],
        points: [
          "Draw the graph and point to the cycle T3 → T4 → T3."
        ],
        draw: ["Wait-for graph with the cycle."]
      },
      {
        title: "The four conditions in this example",
        pages: 0.5,
        see: ["3.8#handling"],
        points: [
          "Show how mutual exclusion, hold and wait, no preemption and circular wait all hold here."
        ]
      },
      {
        title: "How the deadlock is handled",
        pages: 1,
        see: ["3.8#prevention", "3.8#timestamps", "3.8#recovery"],
        points: [
          "Detection and recovery: choose a victim and roll it back.",
          "Prevention: lock in a fixed order. Wait-die and wound-wait applied to T3 and T4."
        ]
      },
      {
        title: "Conclusion",
        pages: 0.5,
        points: [
          "2PL ensures serializability but not freedom from deadlock; the DBMS must detect or prevent it."
        ]
      }
    ]
  };

  D.outlines["u3-b18"] = {
    aim: "Cover both groups: DCL (GRANT, REVOKE, roles) and TCL (COMMIT, ROLLBACK, SAVEPOINT, SET TRANSACTION), each command with syntax and a working example. Finish with a comparison table of DCL and TCL.",
    sections: [
      {
        title: "Introduction: SQL command groups",
        pages: 0.5,
        see: ["3.14#groups"],
        points: [
          "DDL, DML, DCL and TCL in one line each; this answer covers DCL and TCL."
        ],
        table: ["Command groups with their commands."]
      },
      {
        title: "DCL: GRANT",
        pages: 0.75,
        see: ["3.14#grant"],
        points: [
          "Syntax and privileges; WITH GRANT OPTION; two examples."
        ]
      },
      {
        title: "DCL: REVOKE",
        pages: 0.75,
        see: ["3.14#revoke"],
        points: [
          "Syntax; cascading revoke; an example."
        ],
        draw: ["An authorization graph before and after a REVOKE."]
      },
      {
        title: "DCL: roles",
        pages: 0.5,
        see: ["3.14#roles"],
        points: [
          "CREATE ROLE, grant privileges to the role, grant the role to users."
        ]
      },
      {
        title: "TCL: COMMIT and ROLLBACK",
        pages: 1,
        see: ["3.14#tcl", "3.14#steps"],
        points: [
          "Autocommit and START TRANSACTION.",
          "COMMIT and ROLLBACK with a fund-transfer example and the table before and after."
        ],
        table: ["The table before, after the update and after ROLLBACK."]
      },
      {
        title: "TCL: SAVEPOINT and SET TRANSACTION",
        pages: 0.75,
        see: ["3.10#syntax", "3.12#set-transaction"],
        points: [
          "SAVEPOINT, ROLLBACK TO and RELEASE with an example; SET TRANSACTION for isolation level."
        ]
      },
      {
        title: "Comparison and conclusion",
        pages: 0.75,
        see: ["3.14#compare", "3.14#try-it"],
        points: [
          "Compare the two groups, then conclude."
        ],
        table: ["DCL and TCL compared: purpose, commands, works on, can be rolled back."]
      }
    ]
  };
})();
