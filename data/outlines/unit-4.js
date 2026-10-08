/* Unit IV 16-mark answer outlines, keyed by question id. See assets/js/outlines.js for the shape.
   Each outline is a plan only. The pages it links to hold the content the student must write out. */
(function () {
  var D = (window.DBMS = window.DBMS || {});
  D.outlines = D.outlines || {};

  D.outlines["u4-b1"] = {
    aim: "Explain the three ideas behind RAID (striping, mirroring, parity), then give every level from 0 to 6 its own heading with a diagram of how blocks lie on the disks, how it survives a failure, and its merits and demerits. A comparison table of all levels finishes the answer.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["4.1#why"],
        points: [
          "Expand RAID (redundant array of independent disks) and its two goals: reliability through redundancy and speed through parallelism.",
          "Mean time to failure falls as the number of disks grows, which is why redundancy is needed."
        ]
      },
      {
        title: "Key ideas: striping, mirroring and parity",
        pages: 0.75,
        see: ["4.1#ideas"],
        points: [
          "Bit-level and block-level striping.",
          "Mirroring (shadowing).",
          "Parity with XOR, and how a lost block is rebuilt from the others."
        ],
        example: ["Three data bits and their parity bit, then rebuilding one lost bit with XOR."]
      },
      {
        title: "RAID 0 and RAID 1",
        pages: 0.75,
        see: ["4.1#levels", "4.1#try-it"],
        points: [
          "RAID 0: block striping, no redundancy; fastest, but one failure loses data.",
          "RAID 1: mirroring; survives one disk failure; doubles the cost. Mention RAID 1+0."
        ],
        draw: ["Blocks A1, A2, A3 ... laid out on the disks for RAID 0 and for RAID 1."]
      },
      {
        title: "RAID 2 and RAID 3",
        pages: 0.75,
        see: ["4.1#levels"],
        points: [
          "RAID 2: bit-level striping with Hamming (memory-style) error-correcting codes.",
          "RAID 3: bit-interleaved parity on one parity disk; one large request at a time."
        ],
        draw: ["Data disks and the parity (or ECC) disks for each."]
      },
      {
        title: "RAID 4 and RAID 5",
        pages: 1,
        see: ["4.1#levels"],
        points: [
          "RAID 4: block-level striping with a dedicated parity disk, which becomes a bottleneck for writes.",
          "RAID 5: block-interleaved distributed parity spread over all disks; the most common level.",
          "Explain the small-write cost (read old data and parity, write new data and parity)."
        ],
        draw: ["Five disks with parity blocks P0, P1, P2 ... rotating across the disks for RAID 5, and on one disk for RAID 4."]
      },
      {
        title: "RAID 6",
        pages: 0.5,
        see: ["4.1#levels"],
        points: [
          "P + Q redundancy: two parity blocks per stripe; survives two disk failures."
        ],
        draw: ["RAID 6 layout with P and Q blocks."]
      },
      {
        title: "Choosing a RAID level and comparison",
        pages: 1,
        see: ["4.1#choosing", "4.1#merits"],
        points: [
          "Factors: cost per GB, write speed, rebuild time, failures tolerated.",
          "RAID 1 for logs and write-heavy data, RAID 5 or 6 for large read-mostly data."
        ],
        table: ["Levels 0 to 6: technique, minimum disks, failures tolerated, storage efficiency, read and write speed, use."]
      },
      {
        title: "Conclusion",
        pages: 0.25,
        points: [
          "RAID trades extra disks for speed and safety; the right level depends on the workload."
        ]
      }
    ]
  };

  D.outlines["u4-b2"] = {
    aim: "Explain files, records and blocks first, then each file organization with a diagram, how insert, search and delete work, merits, demerits and a use case. End with a comparison table.",
    sections: [
      {
        title: "Introduction: files, records and blocks",
        pages: 0.75,
        see: ["4.2#basics"],
        points: [
          "A database is stored as files; a file is a sequence of records stored in blocks.",
          "File organization decides where each record is placed, which affects the speed of each operation."
        ]
      },
      {
        title: "Heap file organization",
        pages: 0.75,
        see: ["4.2#heap"],
        points: [
          "A record goes anywhere there is space; insertion is fast; search needs a full scan.",
          "Use: bulk loading, small tables, tables always read in full."
        ],
        draw: ["Blocks with records in no particular order and free space at the end."]
      },
      {
        title: "Sequential file organization",
        pages: 1,
        see: ["4.2#sequential"],
        points: [
          "Records are kept in order of a search key and linked with pointers.",
          "Insertion uses free space or an overflow block; the file is reorganized from time to time.",
          "Use: reports in key order, payroll."
        ],
        draw: ["Records in key order with pointer chains, and a new record placed in an overflow block."]
      },
      {
        title: "Hashing file organization",
        pages: 0.75,
        see: ["4.2#hashing", "4.8#idea"],
        points: [
          "A hash function on a search key gives the block (bucket) where the record goes.",
          "Fast for equality search, poor for range queries."
        ],
        draw: ["Keys going through a hash function into buckets."]
      },
      {
        title: "Multitable clustering file organization",
        pages: 0.75,
        see: ["4.2#clustering"],
        points: [
          "Records of related tables are stored together in the same block, such as a department and its instructors.",
          "Fast joins on the cluster key, slower for queries on one table."
        ],
        draw: ["A block holding a department record followed by its instructor records."]
      },
      {
        title: "Comparison, use cases and MySQL",
        pages: 1,
        see: ["4.2#compare", "4.2#mysql"],
        points: [
          "Compare the four, then say what MySQL InnoDB actually uses (a clustered B+ tree on the primary key)."
        ],
        table: ["Organization, insertion, equality search, range search, deletion, best use."]
      },
      {
        title: "Conclusion",
        pages: 0.25,
        points: [
          "No organization is best for every task; the choice follows the most common queries."
        ]
      }
    ]
  };

  D.outlines["u4-b3"] = {
    aim: "Explain how records are placed in blocks: fixed-length records with deletion handling, variable-length records with their representation, and the slotted-page structure, each with a diagram. Add the data dictionary and column-oriented storage for completeness.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["4.2#basics"],
        points: [
          "A file is a sequence of records stored in fixed-size blocks; records can be fixed or variable in length."
        ]
      },
      {
        title: "Fixed-length records",
        pages: 1.25,
        see: ["4.3#fixed"],
        points: [
          "Example: instructor(ID, name, dept_name, salary) with each record a fixed number of bytes, so record i starts at byte n × (i − 1).",
          "Problems: records crossing block boundaries, and deleting a record.",
          "Three ways to delete: move all records up, move the last record into the gap, or keep a free list in the file header."
        ],
        draw: ["A file of fixed-length records with some deleted, and the free list linking the empty slots from the header."]
      },
      {
        title: "Variable-length records",
        pages: 1,
        see: ["4.3#variable"],
        points: [
          "Why they occur: variable-length fields (VARCHAR), repeating fields, several record types in one file.",
          "Representation: fixed part with (offset, length) pairs for variable fields, a null bitmap, then the variable data."
        ],
        draw: ["One variable-length record with the offset and length pairs, null bitmap and data bytes labelled."]
      },
      {
        title: "Slotted-page structure",
        pages: 1,
        see: ["4.3#slotted", "4.3#try-it"],
        points: [
          "Block header with the number of entries, the end of free space, and the location and size of each record.",
          "Records grow from the end of the block; free space is in the middle; records can be moved without changing pointers from outside."
        ],
        draw: ["A slotted page: header with entries on the left, free space in the middle, records at the right end."]
      },
      {
        title: "Data dictionary storage",
        pages: 0.75,
        see: ["4.3#dictionary"],
        points: [
          "What the system catalog stores: relation names, attributes, types, indices, users, statistics.",
          "It is itself stored as tables."
        ],
        table: ["Example catalog tables, such as Relation_metadata and Attribute_metadata, with their columns."]
      },
      {
        title: "Column-oriented storage",
        pages: 0.5,
        see: ["4.3#columnar"],
        points: [
          "Each attribute stored separately; good for analytics, poor for whole-row updates."
        ]
      },
      {
        title: "Conclusion",
        pages: 0.25,
        points: [
          "Fixed-length records are simple; variable-length records need the slotted page to manage space well."
        ]
      }
    ]
  };

  D.outlines["u4-b4"] = {
    aim: "Define a B tree of order m with its rules, draw the node structure, then explain search, insertion (with splits) and deletion (with borrowing and merging), each with a worked example and before and after diagrams. The diagrams are the answer; draw every step.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["4.7#what", "4.4#why"],
        points: [
          "Why multilevel, balanced indices are needed for large files.",
          "A B tree is a balanced search tree where keys appear once, in internal nodes or leaves."
        ]
      },
      {
        title: "Structure and properties",
        pages: 1,
        see: ["4.7#structure"],
        points: [
          "Node layout: P1, K1, P2, K2 ... with record pointers stored with each key.",
          "Rules for order m: at most m children, at least ⌈m/2⌉ children for internal nodes, root at least 2 children, all leaves at the same level, keys in sorted order."
        ],
        draw: ["A B tree node with key, child pointer and record pointer labelled, and a small three-level B tree."]
      },
      {
        title: "Search",
        pages: 0.5,
        see: ["4.7#search"],
        points: [
          "Start at the root, compare keys, follow the right child; may stop at an internal node.",
          "Trace one search on your tree."
        ]
      },
      {
        title: "Insertion",
        pages: 1.5,
        see: ["4.7#insertion", "4.7#worked-example", "4.7#try-it"],
        points: [
          "Find the leaf, insert in order; if the node overflows, split it and move the middle key up; splits can reach the root and grow the tree.",
          "Worked example of order 3: insert a list of keys one by one, drawing the tree after each split."
        ],
        draw: ["The tree after each insertion that causes a split."]
      },
      {
        title: "Deletion",
        pages: 1,
        see: ["4.7#deletion"],
        points: [
          "Delete from a leaf; delete from an internal node by replacing with the in-order predecessor or successor.",
          "Underflow: borrow from a sibling, or merge with a sibling and pull a key down; the tree may shrink."
        ],
        draw: ["Before and after diagrams for one borrow and one merge."]
      },
      {
        title: "Merits, demerits and conclusion",
        pages: 0.5,
        see: ["4.7#merits", "4.7#compare"],
        points: [
          "Merits: balanced, no duplicate keys, search may end early. Demerits: complex deletion, slow sequential scan, lower fan-out than a B+ tree. Then conclude."
        ]
      }
    ]
  };

  D.outlines["u4-b5"] = {
    aim: "A comparison question: describe both structures briefly with a diagram of the same keys in each, compare them point by point in a detailed table, and give concrete cases (range queries, ORDER BY, database indices) where the B+ tree wins.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["4.4#why", "4.6#why"],
        points: [
          "Both are balanced multilevel indices used to avoid scanning a whole file."
        ]
      },
      {
        title: "B tree in brief",
        pages: 0.75,
        see: ["4.7#structure", "4.7#search"],
        points: [
          "Keys appear once; record pointers in every node; search may end at an internal node."
        ],
        draw: ["A B tree built from one set of keys, such as 5, 10, 15, 20, 25, 30, 35."]
      },
      {
        title: "B+ tree in brief",
        pages: 0.75,
        see: ["4.6#structure", "4.6#search"],
        points: [
          "All keys and record pointers in the leaves; internal nodes hold copies of keys for routing; leaves are linked in order."
        ],
        draw: ["A B+ tree built from the same keys, with the leaf chain shown."]
      },
      {
        title: "Detailed comparison",
        pages: 1.25,
        see: ["4.7#compare", "4.6#fan-out"],
        points: [
          "Explain each row of the table in a sentence or two."
        ],
        table: ["B tree and B+ tree compared: where data pointers are, duplicate keys, leaf links, search path length, range query, fan-out and height, insertion and deletion, space used. At least eight rows."]
      },
      {
        title: "Where a B+ tree is preferred",
        pages: 1.25,
        see: ["4.6#merits", "4.6#mysql", "4.5#multilevel"],
        points: [
          "Range queries: find the first key, then walk the leaf chain. Show it for keys between 10 and 30 on your diagram.",
          "ORDER BY and full ordered scans.",
          "Higher fan-out gives a shorter tree, so fewer disk reads: show a height calculation for a million keys.",
          "Real use: MySQL InnoDB stores tables and indices as B+ trees."
        ],
        example: ["SELECT * FROM student WHERE marks BETWEEN 60 AND 80 traced through the leaf chain."]
      },
      {
        title: "Where a B tree can be better, and conclusion",
        pages: 0.5,
        see: ["4.7#merits"],
        points: [
          "Single-key lookups can finish early, and no key is stored twice. Conclude that databases almost always use B+ trees."
        ]
      }
    ]
  };

  D.outlines["u4-b6"] = {
    aim: "Define an ordered index and its terms, then explain primary and secondary indices and dense and sparse indices, each with a diagram of index entries pointing into a sorted file. Multilevel indices and index updates complete a high-scoring answer.",
    sections: [
      {
        title: "Introduction and basic terms",
        pages: 0.75,
        see: ["4.4#why", "4.4#terms", "4.5#intro"],
        points: [
          "Why indices are needed (the book index analogy).",
          "Search key, index entry, ordered index, index-sequential file.",
          "How an index is judged: access types, access time, insertion and deletion time, space."
        ]
      },
      {
        title: "Primary and secondary indices",
        pages: 1,
        see: ["4.5#primary"],
        points: [
          "Primary (clustering) index: the file is sorted on its search key.",
          "Secondary (non-clustering) index: the file is not sorted on its key; must be dense."
        ],
        table: ["Primary and secondary indices compared."]
      },
      {
        title: "Dense indices",
        pages: 0.75,
        see: ["4.5#dense-sparse", "4.5#try-it"],
        points: [
          "An index entry for every search-key value.",
          "Fast lookup, more space."
        ],
        draw: ["A dense index on instructor ID pointing to each record of the sorted file."]
      },
      {
        title: "Sparse indices",
        pages: 0.75,
        see: ["4.5#dense-sparse"],
        points: [
          "Entries for only some values (one per block); search finds the largest entry ≤ key, then scans.",
          "Less space and maintenance, slightly slower lookup; possible only on a sorted file."
        ],
        draw: ["A sparse index pointing to the first record of each block."],
        table: ["Dense and sparse indices compared."]
      },
      {
        title: "Multilevel indices",
        pages: 0.75,
        see: ["4.5#multilevel"],
        points: [
          "When the index itself is too large, build a sparse outer index on the inner index."
        ],
        draw: ["Outer index, inner index blocks and data blocks."]
      },
      {
        title: "Secondary indices on non-key attributes and updates",
        pages: 0.75,
        see: ["4.5#secondary", "4.5#update"],
        points: [
          "Buckets of pointers for duplicate values, such as an index on dept_name.",
          "What happens to dense and sparse indices on insertion and deletion."
        ],
        draw: ["A secondary index on dept_name with a bucket of record pointers."]
      },
      {
        title: "Conclusion",
        pages: 0.25,
        points: [
          "Ordered indices speed up search at the cost of space and update time; choose dense or sparse by the workload."
        ]
      }
    ]
  };

  D.outlines["u4-b7"] = {
    aim: "Explain static hashing (hash function, buckets, overflow chains) and its main weakness, then extendible hashing with global and local depth, and show a full worked example where a bucket overflows and is split, with the directory drawn before and after.",
    sections: [
      {
        title: "Introduction to hashing",
        pages: 0.5,
        see: ["4.8#idea", "4.4#compare"],
        points: [
          "A hash function maps a search key to a bucket address; no index structure is searched.",
          "Indexing compared with hashing in two lines."
        ]
      },
      {
        title: "Static hashing",
        pages: 1,
        see: ["4.8#operations", "4.8#hash-function", "4.8#hash-index"],
        points: [
          "Fixed number of buckets; insert, search and delete.",
          "Qualities of a good hash function: uniform and random.",
          "Hash file organization and hash indices."
        ],
        example: ["h(key) = key mod 5 for a few keys, with the buckets drawn."]
      },
      {
        title: "Bucket overflow in static hashing",
        pages: 0.75,
        see: ["4.8#overflow", "4.8#try-it"],
        points: [
          "Causes: too few buckets, skew.",
          "Overflow chaining (closed hashing) and open addressing (open hashing).",
          "The real problem: the database grows, but the number of buckets is fixed."
        ],
        draw: ["A bucket with an overflow chain."]
      },
      {
        title: "Dynamic hashing: extendible hashing",
        pages: 1,
        see: ["4.9#why", "4.9#extendible", "4.9#operations"],
        points: [
          "Hash to a long bit string, use only the first (or last) i bits; the directory has 2<sup>i</sup> entries.",
          "Global depth (directory) and local depth (each bucket).",
          "On overflow: if local depth &lt; global depth, split the bucket; if equal, double the directory first."
        ],
        draw: ["Directory with global depth 2 pointing to buckets with their local depths."]
      },
      {
        title: "Worked example: resolving overflow",
        pages: 1.25,
        see: ["4.9#worked-example", "4.9#try-it"],
        points: [
          "Keys 1, 3, 5, 8, 9, 12, 17, 28 with h(x) = x mod 8 and three records per bucket.",
          "Show the structure, then insert 17 (bucket split and directory doubling), insert 2, insert 24, delete 5.",
          "Write the bit pattern of each key."
        ],
        draw: ["The directory and buckets before and after each change."]
      },
      {
        title: "Comparison and conclusion",
        pages: 0.5,
        see: ["4.9#compare", "4.9#merits"],
        points: [
          "Compare, then conclude that dynamic hashing grows with the data without full reorganization."
        ],
        table: ["Static and dynamic hashing compared: buckets, overflow, growth, space, performance."]
      }
    ]
  };

  D.outlines["u4-b8"] = {
    aim: "The three steps of query processing as a labelled diagram, then each step explained using one SQL query followed all the way to an annotated evaluation plan. Include the cost measures and the algorithms the plan chooses from.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["4.10#steps"],
        points: [
          "Define query processing: turning a high-level query into a low-level plan and running it."
        ]
      },
      {
        title: "The steps of query processing",
        pages: 1,
        see: ["4.10#steps"],
        points: [
          "Parsing and translation: syntax check, names checked against the catalog, translation into relational algebra.",
          "Optimization: choose the cheapest equivalent plan using statistics.",
          "Evaluation: the query execution engine runs the plan and returns the result."
        ],
        draw: ["Query, parser and translator, relational algebra expression, optimizer (with statistics), execution plan, evaluation engine (with data), output."]
      },
      {
        title: "Worked example: one query through every step",
        pages: 1.25,
        see: ["4.10#plans", "4.11#trees"],
        points: [
          "Take SELECT salary FROM instructor WHERE salary &lt; 75000.",
          "Write two equivalent relational algebra expressions for it.",
          "Annotate one with how each operation runs (use an index on salary, or a file scan): this is the evaluation plan."
        ],
        draw: ["The query tree, and the same tree annotated as an evaluation plan."]
      },
      {
        title: "Measures of query cost",
        pages: 0.75,
        see: ["4.10#cost"],
        points: [
          "Disk accesses dominate: number of block transfers (b) and seeks (S), cost = b × t<sub>T</sub> + S × t<sub>S</sub>.",
          "Why CPU and memory are usually ignored."
        ]
      },
      {
        title: "Algorithms the plan chooses from",
        pages: 1,
        see: ["4.10#selection", "4.10#sorting", "4.10#joins"],
        points: [
          "Selection: linear search, binary search, primary and secondary index scans.",
          "External sort-merge for sorting.",
          "Joins: nested loop, block nested loop, indexed nested loop, merge join, hash join."
        ],
        table: ["Algorithm and its cost in block transfers."]
      },
      {
        title: "Seeing the plan in MySQL and conclusion",
        pages: 0.75,
        see: ["4.10#mysql", "4.10#try-it"],
        points: [
          "EXPLAIN shows the chosen plan; explain two of its columns.",
          "Conclude: the same SQL can run many ways, and query processing picks a cheap one."
        ]
      }
    ]
  };

  D.outlines["u4-b9"] = {
    aim: "Define heuristic optimization, state each heuristic rule with the equivalence rule behind it, then optimize one query step by step, drawing the query tree after every change. The sequence of trees is what earns full marks.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["4.11#what"],
        points: [
          "Define query optimization and its two approaches; define a heuristic."
        ]
      },
      {
        title: "Query trees",
        pages: 0.5,
        see: ["4.11#trees"],
        points: [
          "Leaves are relations, internal nodes are operations; the canonical tree is the first translation."
        ]
      },
      {
        title: "Equivalence rules",
        pages: 1,
        see: ["4.11#equivalence"],
        points: [
          "Write the main rules with symbols: cascade of σ, commutativity of σ, cascade of π, σ with joins, commutativity and associativity of joins, pushing σ and π past a join."
        ],
        table: ["Rule number, rule, what it allows."]
      },
      {
        title: "The heuristic rules",
        pages: 0.75,
        see: ["4.11#heuristics"],
        points: [
          "Perform selections early; perform projections early; do the most restrictive selections and joins first; replace a Cartesian product plus selection with a join.",
          "Explain why each one reduces cost."
        ]
      },
      {
        title: "Worked example",
        pages: 1.75,
        see: ["4.11#heuristics", "4.11#try-it"],
        points: [
          "Take a three-table query, such as the names of employees in the Research department born after 1990.",
          "Step 1: canonical tree (Cartesian products, then σ, then π).",
          "Step 2: push selections down. Step 3: reorder for the most restrictive join first. Step 4: replace × and σ with joins. Step 5: push projections down."
        ],
        draw: ["The query tree after each of the five steps."]
      },
      {
        title: "Limits and conclusion",
        pages: 0.5,
        see: ["4.11#compare"],
        points: [
          "Heuristics are fast but do not always find the cheapest plan; real optimizers combine them with cost estimates."
        ]
      }
    ]
  };

  D.outlines["u4-b10"] = {
    aim: "Explain cost-based optimization: the statistics in the catalog, how result sizes and costs are estimated, and how plans are compared. Then work an example that estimates the cost of two plans with numbers and picks the cheaper one.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["4.11#what", "4.11#cost-based"],
        points: [
          "Define cost-based optimization: generate equivalent plans, estimate each one's cost, choose the cheapest."
        ],
        draw: ["Plan generator, cost estimator (reading catalog statistics) and plan chooser."]
      },
      {
        title: "Measures of cost",
        pages: 0.5,
        see: ["4.10#cost"],
        points: [
          "Block transfers and seeks; the formula b × t<sub>T</sub> + S × t<sub>S</sub>."
        ]
      },
      {
        title: "Catalog statistics",
        pages: 0.75,
        see: ["4.11#statistics"],
        points: [
          "n<sub>r</sub> (tuples), b<sub>r</sub> (blocks), l<sub>r</sub> (tuple size), f<sub>r</sub> (blocking factor), V(A, r) (distinct values), histograms.",
          "How they are kept up to date."
        ],
        table: ["Statistic, symbol, meaning."]
      },
      {
        title: "Size estimation",
        pages: 1,
        see: ["4.11#statistics"],
        points: [
          "Selection A = v: n<sub>r</sub> / V(A, r). Range: n<sub>r</sub> × (v − min) / (max − min).",
          "Conjunction with selectivities multiplied.",
          "Join on a key: at most the size of the other relation."
        ],
        example: ["Numbers for an instructor relation of 10,000 tuples with 50 departments."]
      },
      {
        title: "Choosing a plan by cost: worked example",
        pages: 1.5,
        see: ["4.11#choosing", "4.10#joins", "4.11#try-it"],
        points: [
          "Two plans for one join query, such as a nested loop join and a block nested loop or indexed join.",
          "Compute the block transfers for each with given sizes.",
          "Join order: why joining the smaller result first is cheaper.",
          "Mention dynamic programming for join ordering in one line."
        ],
        table: ["Plan, steps, estimated block transfers."]
      },
      {
        title: "Heuristic and cost-based compared, and conclusion",
        pages: 0.75,
        see: ["4.11#compare", "4.11#mysql"],
        points: [
          "Compare the two approaches; mention ANALYZE TABLE and EXPLAIN in MySQL; conclude."
        ],
        table: ["Heuristic and cost-based optimization compared."]
      }
    ]
  };

  D.outlines["u4-b11"] = {
    aim: "A construction problem. State what three pointers per node means (at most two keys, minimum occupancy), then insert the keys one at a time, drawing the tree after every split and saying which key is copied or moved up. The final tree must be correct and neatly drawn.",
    sections: [
      {
        title: "Introduction to the B+ tree",
        pages: 0.5,
        see: ["4.6#why", "4.6#structure"],
        points: [
          "Define a B+ tree: balanced; all keys in linked leaves; internal nodes route the search."
        ],
        draw: ["One node: P1, K1, P2, K2, P3."]
      },
      {
        title: "What the question gives",
        pages: 0.5,
        see: ["4.6#worked-example"],
        points: [
          "n = 3 pointers, so each node holds at most 2 keys.",
          "A leaf needs at least ⌈(n − 1)/2⌉ = 1 key; an internal node needs at least ⌈n/2⌉ = 2 pointers.",
          "The insertion rule: a leaf split copies the middle key up; an internal split moves it up."
        ]
      },
      {
        title: "Insert 2, 3, 5 and 7",
        pages: 1,
        see: ["4.6#insertion"],
        points: [
          "2 and 3 fit in the first leaf.",
          "5 splits the leaf into [2] and [3 | 5]; 3 is copied up into a new root.",
          "7 splits [3 | 5 | 7] into [3] and [5 | 7]; 5 is copied up: root [3 | 5]."
        ],
        draw: ["The tree after 5 and after 7."]
      },
      {
        title: "Insert 11, 17 and 19",
        pages: 1.25,
        see: ["4.6#worked-example"],
        points: [
          "11: leaf split copies 7 up; the root [3 | 5 | 7] overflows and splits, moving 5 up into a new root. Height becomes 3.",
          "17: leaf split copies 11 up into [7 | 11].",
          "19: leaf split copies 17 up; [7 | 11 | 17] splits and moves 11 into the root [5 | 11]."
        ],
        draw: ["The tree after 11, after 17 and after 19."]
      },
      {
        title: "Insert 23, 29 and 31",
        pages: 1.25,
        see: ["4.6#worked-example", "4.6#try-it"],
        points: [
          "23: leaf split copies 19 up into [17 | 19].",
          "29: leaf split copies 23 up; the internal node splits and moves 19 up; the root [5 | 11 | 19] splits and moves 11 up into a new root. Height becomes 4.",
          "31: leaf split copies 29 up into [23 | 29]."
        ],
        draw: ["The tree after 29, and the final tree after 31: root [11]; [5] and [19]; [3], [7], [17], [23 | 29]; leaves [2] → [3] → [5] → [7] → [11] → [17] → [19] → [23] → [29 | 31]."]
      },
      {
        title: "Checking the final tree and conclusion",
        pages: 0.5,
        see: ["4.6#search", "4.6#fan-out"],
        points: [
          "Check: all leaves at one level, every node within its limits, leaves linked in order.",
          "Trace a search for 19 and a range search from 7 to 23.",
          "Note that inserting in ascending order leaves most leaves half full."
        ]
      }
    ]
  };
})();
