/* Unit IV comparisons, shown on comparisons/unit-4.html. See data/comparisons/unit-1.js
   for the shape of an item. After you change this file, run node tools/build-comparisons.mjs. */
window.DBMS = window.DBMS || {};

DBMS.comparisons = (DBMS.comparisons || []).concat([
  {
    id: "raid-levels",
    topics: ["4.1"],
    title: "RAID levels 0 to 6",
    keywords: "raid 0 1 2 3 4 5 6 levels striping mirroring parity vs difference",
    summary: "The RAID levels differ in how they use striping, mirroring and parity, which decides their speed, cost and how many disk failures they survive.",
    tables: [
      { from: "4.1", ref: "cmp-raid-levels" },
      { from: "4.1", ref: "cmp-raid-choices" }
    ],
    tip: "For each level, draw four small disks with the blocks (A1, A2, P ...) written on them. The pictures show the difference faster than words.",
    read: ["4.1#levels", "4.1#choosing"],
    questions: ["u4-a2", "u4-b1"]
  },
  {
    id: "striping-mirroring-parity",
    topics: ["4.1"],
    title: "Striping, mirroring and parity",
    keywords: "striping mirroring shadowing parity xor raid ideas vs difference",
    summary: "Striping spreads data over disks for speed. Mirroring copies it for safety. Parity stores an XOR of the data, so a lost block can be rebuilt at a lower cost.",
    tables: [{
      caption: "The three ideas behind RAID",
      head: ["Basis", "Striping", "Mirroring", "Parity"],
      rows: [
        ["Goal", "Speed", "Safety", "Safety at a lower cost"],
        ["How it works", "Block i goes to disk i mod n, so one file is spread over all disks", "Every block is written to two disks", "A parity block P = A1 ⊕ A2 ⊕ ... is stored for each stripe"],
        ["Extra disks", "None", "One for each data disk (double)", "One (or two for RAID 6) for the whole array"],
        ["Survives a disk failure", "No; losing one disk loses the data", "Yes; the copy is used", "Yes; XOR of the other blocks rebuilds the lost one"],
        ["Read speed", "High (all disks at once)", "High (either copy can be read)", "High"],
        ["Write speed", "High", "Good (two writes at once)", "Lower: each write also updates the parity"],
        ["RAID levels", "0, and part of 2 to 6", "1 (and 1 + 0)", "3, 4, 5 and 6"]
      ]
    }],
    read: ["4.1#ideas"],
    questions: ["u4-a1", "u4-b1"]
  },
  {
    id: "file-organizations",
    topics: ["4.2"],
    title: "Heap, sequential, hashing and clustering file organizations",
    keywords: "file organization heap sequential ordered hash multitable clustering vs difference",
    summary: "Heap files keep records in any order and sequential files keep them sorted. Hashing places them by a hash value, and clustering stores related records of several tables together.",
    tables: [{ from: "4.2", ref: "cmp-file-orgs" }],
    tip: "For heap and sequential files (2 marks), write the order, insert speed and search speed rows.",
    questions: ["u4-a4", "u4-b2"]
  },
  {
    id: "fixed-vs-variable-records",
    topics: ["4.3"],
    title: "Fixed-length and variable-length records",
    keywords: "fixed length variable length records slotted page vs difference",
    summary: "Fixed-length records all have one size, so they are easy to find but waste space; variable-length records save space but need a slotted page to be found.",
    tables: [{ from: "4.3", ref: "cmp-fixed-variable" }],
    tip: "Draw the slotted page: the header with entries at the start, free space in the middle and records packed at the end.",
    read: ["4.3#slotted"],
    questions: ["u4-a3", "u4-b3"]
  },
  {
    id: "active-vs-passive-dictionary",
    topics: ["4.3"],
    title: "Active and passive data dictionary",
    keywords: "data dictionary system catalog metadata active passive vs difference",
    summary: "An active data dictionary is kept up to date by the DBMS itself; a passive one is kept by people, only for documentation.",
    tables: [{ from: "4.3", ref: "cmp-active-passive" }],
    questions: ["u4-b3"]
  },
  {
    id: "row-vs-column-storage",
    topics: ["4.3"],
    title: "Row-oriented and column-oriented storage",
    keywords: "row oriented column oriented columnar storage analytics oltp olap vs difference",
    summary: "Row storage keeps all the values of one record together; column storage keeps all the values of one attribute together.",
    tables: [
      {
        caption: "Row-oriented and column-oriented storage",
        head: ["Basis", "Row-oriented storage", "Column-oriented storage"],
        rows: [
          ["Stored together", "All the attributes of one record", "All the values of one attribute"],
          ["Reading one whole record", "Fast: one place", "Slower: one read per column"],
          ["Reading one column of all records", "Slow: every record is read", "Fast: only that column is read"],
          ["Inserting a record", "Fast", "Slower: every column file changes"],
          ["Compression", "Low", "High, because values in one column are alike"],
          ["Suits", "Transaction processing (OLTP): orders, bookings, payments", "Analytics (OLAP): reports, data warehouses"],
          ["Example systems", "MySQL (InnoDB), Oracle, PostgreSQL", "Amazon Redshift, Google BigQuery, ClickHouse"]
        ]
      },
      { from: "4.3", ref: "cmp-row-column-demo" }
    ],
    tip: "Column-oriented storage is not the same as a column-family NoSQL store such as Cassandra. Unit V compares the two.",
    read: ["4.3#columnar"]
  },
  {
    id: "indexing-vs-hashing",
    topics: ["4.4"],
    title: "Ordered indexing and hashing",
    keywords: "index hashing ordered index hash index range query vs difference",
    summary: "An ordered index keeps keys sorted, so it handles both exact lookups and ranges. Hashing jumps straight to a bucket, so it is best for exact lookups only.",
    tables: [{ from: "4.4", ref: "cmp-index-hash" }],
    syntax: [
      { label: "B+ tree index (InnoDB)", code: "CREATE INDEX idx_roll\nON student (roll_no);\n-- good for = and ranges:\nSELECT * FROM student\nWHERE roll_no BETWEEN 110 AND 125;" },
      { label: "Hash index (MEMORY engine)", code: "CREATE TABLE s_mem (\n  roll_no INT,\n  INDEX USING HASH (roll_no)\n) ENGINE = MEMORY;\n-- good for = only:\nSELECT * FROM s_mem\nWHERE roll_no = 126;" }
    ],
    tip: "InnoDB ignores USING HASH and builds a B+ tree. Only the MEMORY engine builds a real hash index.",
    read: ["4.4#mysql"],
    questions: ["u4-a17"]
  },
  {
    id: "dense-vs-sparse",
    topics: ["4.5"],
    title: "Dense and sparse indices",
    keywords: "dense sparse index entry every search key block vs difference",
    summary: "A dense index has an entry for every search-key value; a sparse index has entries for only some values, one for each block.",
    tables: [{ from: "4.5", ref: "cmp-dense-sparse" }],
    tip: "Draw the same sorted file twice: one index with an arrow to every record, and one with an arrow to the first record of each block.",
    read: ["4.5#dense-sparse"],
    questions: ["u4-a6", "u4-b6"]
  },
  {
    id: "clustering-vs-non-clustering",
    topics: ["4.5"],
    title: "Clustering (primary) and non-clustering (secondary) indices",
    keywords: "clustering non-clustering primary secondary index clustered vs difference",
    summary: "A clustering index is on the key the file is sorted by, so there is only one. A non-clustering index is on any other key, so there can be many and each must be dense.",
    tables: [{ from: "4.5", ref: "cmp-clustering" }],
    syntax: [
      { label: "Clustering index", code: "CREATE TABLE student (\n  roll_no INT PRIMARY KEY,\n  name    VARCHAR(30),\n  dept    VARCHAR(10)\n);\n-- InnoDB stores the rows in\n-- roll_no order" },
      { label: "Non-clustering index", code: "CREATE INDEX idx_dept\nON student (dept);\n\nSHOW INDEX FROM student;\n-- PRIMARY and idx_dept" }
    ],
    read: ["4.5#primary", "4.5#secondary"],
    questions: ["u4-a5", "u4-a12", "u4-b6"]
  },
  {
    id: "single-vs-multilevel-index",
    topics: ["4.5"],
    title: "Single-level and multilevel indices",
    keywords: "single level multilevel index inner outer index b+ tree vs difference",
    summary: "A single-level index is one sorted list of entries. A multilevel index adds a small sparse index on top of it, so a search reads far fewer blocks.",
    tables: [{
      caption: "Single-level and multilevel indices (1,000,000 records, 100 records or entries per block)",
      head: ["Basis", "Single-level index", "Multilevel index"],
      rows: [
        ["Structure", "One sorted index file", "An inner index, plus an outer sparse index on its blocks (and more levels if needed)"],
        ["Size of the top level", "10,000 entries in 100 blocks (sparse)", "100 entries in 1 block, which stays in memory"],
        ["Search", "Binary search on the index", "Go down one level at a time"],
        ["Index blocks read", "About log<sub>2</sub>(100) ≈ 7", "About 1 (plus the block in memory)"],
        ["Suits", "Small files", "Large files"],
        ["Keeping it balanced", "Not needed", "A B+ tree is a multilevel index that stays balanced on inserts and deletes"]
      ]
    }],
    read: ["4.5#multilevel"],
    questions: ["u4-b6"]
  },
  {
    id: "btree-vs-bplus-tree",
    topics: ["4.7", "4.6"],
    title: "B tree and B+ tree",
    keywords: "b tree b+ tree b-tree index leaf linked fan-out vs difference",
    summary: "A B tree stores each key once, in any node. A B+ tree keeps every key in the linked leaves, so it is shorter and much better for range queries.",
    tables: [{ from: "4.7", ref: "cmp-btree-bplus" }],
    tip: "Build both trees for the same few keys, side by side. Then point out the repeated keys and the leaf links in the B+ tree.",
    read: ["4.6#merits"],
    questions: ["u4-a7", "u4-b4", "u4-b5"]
  },
  {
    id: "open-vs-closed-hashing",
    topics: ["4.8"],
    title: "Overflow chaining (closed hashing) and linear probing (open hashing)",
    keywords: "open hashing closed hashing overflow chaining linear probing bucket overflow vs difference",
    summary: "Overflow chaining puts extra records in overflow buckets linked to the full bucket; linear probing puts them in the next bucket that has space.",
    tables: [{
      caption: "Two ways to handle bucket overflow (Silberschatz's names)",
      head: ["Basis", "Overflow chaining (closed hashing)", "Linear probing (open hashing)"],
      rows: [
        ["Where an extra record goes", "An overflow bucket linked to its own bucket", "The next bucket with free space"],
        ["Set of buckets", "Fixed; chains grow", "Fixed; records spill into other buckets"],
        ["Search", "Read the bucket, then follow its chain", "Probe bucket after bucket until found or an empty slot is met"],
        ["When the file is full", "New overflow buckets can always be added", "No record can be added"],
        ["Deletion", "Easy", "Hard: removing a record can break other keys' probe paths"],
        ["Clustering of full buckets", "No", "Yes, so searches get longer"],
        ["Used in", "Database systems", "In-memory tables, for example in compilers"],
        ["Example", "h(K) = K mod 5: bucket 0 holds 10 and 15, and its chain holds 20 and 25", "h(K) = K mod 10: 105 tries buckets 5, 6 and 7, then goes to 8"]
      ]
    }],
    tip: "Some books swap the names open and closed hashing. Always name the method too: overflow chaining or linear probing.",
    read: ["4.8#overflow"],
    questions: ["u4-a11"]
  },
  {
    id: "static-vs-dynamic-hashing",
    topics: ["4.9", "4.8"],
    title: "Static and dynamic hashing",
    keywords: "static dynamic extendible hashing bucket directory vs difference",
    summary: "Static hashing has a fixed number of buckets, so a growing file overflows; dynamic (extendible) hashing splits buckets as the file grows.",
    tables: [{ from: "4.9", ref: "cmp-static-dynamic" }],
    tip: "For the 16-mark question, show the same keys inserted both ways: an overflow chain forms in static hashing, while a bucket splits in extendible hashing.",
    questions: ["u4-a9", "u4-a10", "u4-a16", "u4-b7"]
  },
  {
    id: "join-algorithms",
    topics: ["4.10"],
    title: "Nested-loop, block nested-loop, indexed nested-loop, merge and hash joins",
    keywords: "join algorithms nested loop block indexed merge sort hash join cost vs difference",
    summary: "The join algorithms find matching tuples in different ways. They test every pair, use an index, sort both inputs or hash both inputs into partitions.",
    tables: [{ from: "4.10", ref: "cmp-join-algorithms" }],
    syntax: [
      { label: "See the plan in MySQL", code: "EXPLAIN FORMAT=TREE\nSELECT s.name, d.dept_name\nFROM student s\nJOIN department d\n  ON s.dept_id = d.dept_id;\n-- shows a nested loop\n-- or a hash join" }
    ],
    syntaxTitle: "Try it",
    tip: "Learn the block nested-loop formula, br × bs + br. Then say that the smaller relation should be the outer one.",
    questions: ["u4-b8"]
  },
  {
    id: "heuristic-vs-cost-based",
    topics: ["4.11"],
    title: "Heuristic and cost-based optimization",
    keywords: "query optimization heuristic rule based cost based statistics vs difference",
    summary: "Heuristic optimization applies fixed rules to the query tree; cost-based optimization estimates the cost of many plans from statistics and picks the cheapest.",
    tables: [{ from: "4.11", ref: "cmp-heuristic-cost" }],
    syntax: [
      { label: "Heuristic rule: select early", code: "π name (σ dept = 'CSE'\n  (student ⋈ marks))\n\n-- becomes\nπ name ((σ dept = 'CSE'\n  (student)) ⋈ marks)" },
      { label: "Cost-based: statistics", code: "ANALYZE TABLE student;\n-- refresh the statistics\n\nEXPLAIN SELECT name\nFROM student\nWHERE dept = 'CSE';\n-- estimated rows and cost" }
    ],
    syntaxTitle: "Each one at work",
    tip: "Real optimizers use both: heuristics to cut down the plans, then cost estimates to choose among the rest.",
    questions: ["u4-a13", "u4-a14", "u4-b9", "u4-b10"]
  }
]);
