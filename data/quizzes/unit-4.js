/* Unit IV quiz items. Types: mcq (one answer), multi (all that apply),
   tf (true or false) and order (put the steps in order; options are listed in
   the correct order and shuffled on screen). */
(function () {
  var D = (window.DBMS = window.DBMS || {});
  D.quizzes = (D.quizzes || []).concat([
    {
      id: "q4.1-01",
      topic: "4.1",
      type: "mcq",
      question: "Which RAID level stripes data across disks but keeps no redundancy at all?",
      options: ["RAID 0", "RAID 1", "RAID 5", "RAID 6"],
      answer: 0,
      explain: "RAID 0 only stripes the data. It is fast, but if any one disk fails, data is lost.",
      link: "#levels"
    },
    {
      id: "q4.1-02",
      topic: "4.1",
      type: "mcq",
      question: "A stripe holds the data blocks 0110, 0011 and 1001. What is the parity block?",
      code: "Disk 1: 0110\nDisk 2: 0011\nDisk 3: 1001\nParity: ????",
      options: ["0000", "1111", "1100", "1010"],
      answer: 2,
      explain: "Parity is the XOR of the data blocks. 0110 XOR 0011 = 0101, and 0101 XOR 1001 = 1100.",
      link: "#ideas"
    },
    {
      id: "q4.1-03",
      topic: "4.1",
      type: "tf",
      question: "In RAID 5, all the parity blocks are stored on one disk.",
      answer: false,
      explain: "False. RAID 5 spreads the parity blocks over all the disks. RAID 4 is the level that keeps all parity on one disk, which becomes a bottleneck.",
      link: "#levels"
    },
    {
      id: "q4.1-04",
      topic: "4.1",
      type: "mcq",
      question: "Which RAID level can survive two disk failures at the same time?",
      options: ["RAID 1", "RAID 4", "RAID 5", "RAID 6"],
      answer: 3,
      explain: "RAID 6 stores two kinds of redundant data (P and Q) in each stripe, so any two disks can fail.",
      link: "#levels"
    },
    {
      id: "q4.1-05",
      topic: "4.1",
      type: "multi",
      question: "Which factors should you consider when choosing a RAID level? Choose all that apply.",
      options: [
        "The monetary cost of the extra disks",
        "Performance during normal operation",
        "Performance while a disk has failed",
        "The color of the disk cases"
      ],
      answer: [0, 1, 2],
      explain: "The choice depends on cost, normal performance, performance after a failure and how fast a failed disk can be rebuilt.",
      link: "#choosing"
    },
    {
      id: "q4.1-06",
      topic: "4.1",
      type: "mcq",
      question: "One disk of a RAID 5 array fails. How is a lost block rebuilt?",
      options: [
        "It is copied from a mirror disk.",
        "It is the XOR of the other blocks in the same stripe.",
        "It is read from a backup tape.",
        "It cannot be rebuilt."
      ],
      answer: 1,
      explain: "XOR of the surviving data blocks and the parity block in the stripe gives back the lost block.",
      link: "#ideas"
    },
    {
      id: "q4.2-01",
      topic: "4.2",
      type: "mcq",
      question: "In which file organization can a record be placed anywhere there is space?",
      options: ["Heap file organization", "Sequential file organization", "Hashing file organization", "Multitable clustering file organization"],
      answer: 0,
      explain: "A heap file has no order, so a new record goes into any free space. Inserts are fast, but searches must read the whole file.",
      link: "#heap"
    },
    {
      id: "q4.2-02",
      topic: "4.2",
      type: "mcq",
      question: "In a sequential file, a new record does not fit in the block where it belongs. Where does it go?",
      options: ["At the start of the file", "In an overflow block, linked by pointers", "In a separate table", "It is rejected"],
      answer: 1,
      explain: "The record goes into an overflow block, and the pointer chain keeps the search-key order. The file is reorganized from time to time.",
      link: "#sequential"
    },
    {
      id: "q4.2-03",
      topic: "4.2",
      type: "tf",
      question: "A hashing file organization is a good choice for range queries such as “marks from 60 to 80”.",
      answer: false,
      explain: "False. A hash function spreads nearby values over different buckets, so a range query must read many buckets. Hashing is best for exact-value lookups.",
      link: "#hashing"
    },
    {
      id: "q4.2-04",
      topic: "4.2",
      type: "mcq",
      question: "Why does a multitable clustering file organization store records of two tables in the same block?",
      options: [
        "To save the cost of indexes",
        "To speed up joins of those tables",
        "To make inserts faster",
        "To make each record smaller"
      ],
      answer: 1,
      explain: "Related records, such as a department and its instructors, are stored together. A join reads fewer blocks.",
      link: "#clustering"
    },
    {
      id: "q4.2-05",
      topic: "4.2",
      type: "multi",
      question: "Which of these are true for a sequential file? Choose all that apply.",
      options: [
        "Records are sorted on a search key.",
        "Reading all records in key order is fast.",
        "Inserting a record in the middle is easy and never needs overflow blocks.",
        "The file needs reorganization from time to time."
      ],
      answer: [0, 1, 3],
      explain: "A sequential file keeps records in search-key order, which makes ordered reads fast. Inserts are slow and need overflow blocks, so the file is reorganized now and then.",
      link: "#sequential"
    },
    {
      id: "q4.2-06",
      topic: "4.2",
      type: "mcq",
      question: "What is the unit of data that moves between the disk and main memory?",
      options: ["A field", "A record", "A block", "A file"],
      answer: 2,
      explain: "Data moves between disk and memory in blocks. A block holds several records.",
      link: "#basics"
    },
    {
      id: "q4.3-01",
      topic: "4.3",
      type: "mcq",
      question: "Each fixed-length record takes 29 bytes. At which byte does record 4 start (counting records from 1 and bytes from 0)?",
      options: ["29", "87", "116", "4"],
      answer: 1,
      explain: "Record i starts at byte n × (i − 1). Here that is 29 × 3 = 87.",
      link: "#fixed"
    },
    {
      id: "q4.3-02",
      topic: "4.3",
      type: "mcq",
      question: "With fixed-length records, how are the places of deleted records kept track of?",
      options: [
        "By shifting all later records up",
        "By a free list that starts at the file header",
        "By a hash table",
        "By a B+ tree"
      ],
      answer: 1,
      explain: "The deleted records are linked in a free list. The file header points to the first one, and a new record reuses a free place.",
      link: "#fixed"
    },
    {
      id: "q4.3-03",
      topic: "4.3",
      type: "multi",
      question: "Which of these are kept in the header of a slotted page? Choose all that apply.",
      options: [
        "The number of record entries",
        "The end of the free space in the block",
        "The location and size of each record",
        "The full text of every record"
      ],
      answer: [0, 1, 2],
      explain: "The header holds the number of entries, the end of free space, and an entry with the location and size of each record. The records themselves are at the end of the block.",
      link: "#slotted"
    },
    {
      id: "q4.3-04",
      topic: "4.3",
      type: "tf",
      question: "In a slotted page, pointers from outside point straight to the record, so records can never move.",
      answer: false,
      explain: "False. Outside pointers point to the record's entry in the header. So a record can move inside the block; only its header entry changes.",
      link: "#slotted"
    },
    {
      id: "q4.3-05",
      topic: "4.3",
      type: "mcq",
      question: "In the usual layout of a variable-length record, what is stored for each variable-length field in the fixed part?",
      options: ["Its hash value", "An (offset, length) pair", "Only its first letter", "A pointer to another file"],
      answer: 1,
      explain: "Each variable-length field has an (offset, length) pair in the fixed part. The field's data comes after the null bitmap.",
      link: "#variable"
    },
    {
      id: "q4.3-06",
      topic: "4.3",
      type: "mcq",
      question: "Which kind of storage suits a query like “average marks of all students” on a very large table?",
      options: ["Row-oriented storage", "Column-oriented storage", "Heap storage", "Slotted-page storage"],
      answer: 1,
      explain: "Column-oriented storage keeps each attribute together, so the query reads only the Marks column.",
      link: "#columnar"
    },
    {
      id: "q4.4-01",
      topic: "4.4",
      type: "mcq",
      question: "What is a search key?",
      options: [
        "The primary key of the table",
        "An attribute or set of attributes used to look up records",
        "A password that protects the index",
        "The address of a disk block"
      ],
      answer: 1,
      explain: "A search key is the attribute (or set of attributes) used to look up records. It need not be the primary key.",
      link: "#terms"
    },
    {
      id: "q4.4-02",
      topic: "4.4",
      type: "mcq",
      question: "What are the two basic kinds of index?",
      options: [
        "Dense and sparse",
        "Ordered indices and hash indices",
        "Primary and foreign",
        "Heap and sequential"
      ],
      answer: 1,
      explain: "Ordered indices keep search-key values in sorted order. Hash indices spread the values over buckets with a hash function.",
      link: "#kinds"
    },
    {
      id: "q4.4-03",
      topic: "4.4",
      type: "multi",
      question: "Which factors are used to evaluate an indexing technique? Choose all that apply.",
      options: ["Access types", "Access time", "Insertion and deletion time", "Space overhead"],
      answer: [0, 1, 2, 3],
      explain: "All of them. An index is judged by the searches it supports, how fast it finds records, how fast inserts and deletes are, and the extra space it needs.",
      link: "#metrics"
    },
    {
      id: "q4.4-04",
      topic: "4.4",
      type: "tf",
      question: "Adding more indices to a table always makes every operation faster.",
      answer: false,
      explain: "False. Each index must be updated on every insert, delete and update, and it uses disk space. Only useful indices should be built.",
      link: "#cost"
    },
    {
      id: "q4.4-05",
      topic: "4.4",
      type: "mcq",
      question: "Which kind of index handles the query “marks between 60 and 80” best?",
      options: ["A hash index", "An ordered index", "No index", "Any index works the same"],
      answer: 1,
      explain: "An ordered index keeps the values sorted, so the search finds 60 and reads forward to 80. A hash index helps only with exact values.",
      link: "#compare"
    },
    {
      id: "q4.4-06",
      topic: "4.4",
      type: "mcq",
      question: "What does an index entry hold?",
      options: [
        "A search-key value and pointers to the records with that value",
        "A copy of the whole record",
        "The name of the table",
        "Only a block number"
      ],
      answer: 0,
      explain: "An index entry is a search-key value with one or more pointers to the records that have that value.",
      link: "#terms"
    },
    {
      id: "q4.5-01",
      topic: "4.5",
      type: "mcq",
      question: "What is the difference between a dense and a sparse index?",
      options: [
        "A dense index has an entry for every search-key value; a sparse index has entries for only some values.",
        "A dense index is stored on disk; a sparse index is stored in memory.",
        "A dense index uses hashing; a sparse index uses sorting.",
        "There is no difference."
      ],
      answer: 0,
      explain: "A dense index has an entry for every search-key value. A sparse index usually has one entry per block.",
      link: "#dense-sparse"
    },
    {
      id: "q4.5-02",
      topic: "4.5",
      type: "mcq",
      question: "A sparse index has the entries 10, 40 and 70, one per block. To find the record with key 55, which block do you read?",
      code: "Index entries:\n10 → B1\n40 → B2\n70 → B3",
      options: ["B1", "B2", "B3", "All three blocks"],
      answer: 1,
      explain: "Take the largest entry that is less than or equal to 55. That is 40, so read block B2 and scan it for 55.",
      link: "#dense-sparse"
    },
    {
      id: "q4.5-03",
      topic: "4.5",
      type: "tf",
      question: "A secondary index can be sparse.",
      answer: false,
      explain: "False. The file is not sorted on the secondary key, so the records with a value can be anywhere. A secondary index must be dense.",
      link: "#secondary"
    },
    {
      id: "q4.5-04",
      topic: "4.5",
      type: "mcq",
      question: "How many primary (clustering) indices can one file have?",
      options: ["None", "Only one", "One per attribute", "Any number"],
      answer: 1,
      explain: "A primary index uses the search key that sets the order of the file. A file can be sorted in only one order, so it has only one.",
      link: "#primary"
    },
    {
      id: "q4.5-05",
      topic: "4.5",
      type: "mcq",
      question: "Why is a multilevel index used?",
      options: [
        "The index itself is too large to search quickly, so a sparse outer index is built on it.",
        "To store each record twice",
        "To replace the data file",
        "To make inserts free"
      ],
      answer: 0,
      explain: "When the index is large, a binary search on it reads many blocks. An outer sparse index on the inner index cuts this to a few reads.",
      link: "#multilevel"
    },
    {
      id: "q4.5-06",
      topic: "4.5",
      type: "multi",
      question: "Which of these are true for a secondary index on a non-key attribute such as Dept? Choose all that apply.",
      options: [
        "Each index entry may point to a bucket of record pointers.",
        "It must be dense.",
        "The file is sorted on Dept.",
        "It speeds up queries such as Dept = 'CSE'."
      ],
      answer: [0, 1, 3],
      explain: "Many records share one Dept value, so each entry points to a bucket of pointers. The index is dense, and the file is sorted on some other key.",
      link: "#secondary"
    },
    {
      id: "q4.7-01",
      topic: "4.7",
      type: "mcq",
      question: "A B tree has order n = 5. What are the largest and smallest numbers of keys in a non-root node?",
      options: ["At most 5, at least 2", "At most 4, at least 2", "At most 4, at least 3", "At most 5, at least 3"],
      answer: 1,
      explain: "A node holds at most n − 1 = 4 keys. Every node except the root holds at least ⌈5 / 2⌉ − 1 = 2 keys.",
      link: "#structure"
    },
    {
      id: "q4.7-02",
      topic: "4.7",
      type: "tf",
      question: "In a B tree, each search key appears only once in the whole tree.",
      answer: true,
      explain: "True. Unlike a B+ tree, a B tree does not repeat keys in the leaves. Each key, wherever it is, has a pointer to its record.",
      link: "#what"
    },
    {
      id: "q4.7-03",
      topic: "4.7",
      type: "mcq",
      question: "With order n = 3, a node holds 10 and 20. You insert 30. What happens?",
      code: "Node before: [10 | 20]\nInsert:      30",
      options: [
        "The node holds 10, 20 and 30.",
        "The node splits into [10] and [30], and 20 moves up.",
        "The node splits into [10 | 20] and [30], and 30 moves up.",
        "30 is put in an overflow block."
      ],
      answer: 1,
      explain: "With n = 3, a node holds at most 2 keys. The node splits, and the middle key 20 moves up to the parent (here a new root).",
      link: "#insertion"
    },
    {
      id: "q4.7-04",
      topic: "4.7",
      type: "mcq",
      question: "You delete a key from an internal node of a B tree. Which key usually takes its place?",
      options: ["The root key", "Its in-order successor", "The largest key in the tree", "Nothing takes its place"],
      answer: 1,
      explain: "The key is replaced by its in-order successor, the smallest key in its right subtree. That key is then deleted from its leaf.",
      link: "#deletion"
    },
    {
      id: "q4.7-05",
      topic: "4.7",
      type: "multi",
      question: "Why are B+ trees used more than B trees in practice? Choose all that apply.",
      options: [
        "The linked leaves make range queries fast.",
        "Internal nodes hold no record pointers, so the fan-out is higher.",
        "A B+ tree stores each key only once.",
        "A higher fan-out keeps the tree short."
      ],
      answer: [0, 1, 3],
      explain: "B+ tree leaves are linked, and internal nodes have room for more pointers, so the tree is shorter. A B+ tree repeats keys, so the third choice is false.",
      link: "#compare"
    },
    {
      id: "q4.7-06",
      topic: "4.7",
      type: "tf",
      question: "A search in a B tree can stop at an internal node.",
      answer: true,
      explain: "True. Each key in an internal node has its own record pointer, so the search stops as soon as it finds the key.",
      link: "#search"
    },
    {
      id: "q4.8-01",
      topic: "4.8",
      type: "mcq",
      question: "With static hashing and h(K) = K mod 5, which bucket does key 37 go to?",
      options: ["Bucket 0", "Bucket 2", "Bucket 3", "Bucket 7"],
      answer: 1,
      explain: "37 mod 5 = 2, because 37 = 7 × 5 + 2.",
      link: "#idea"
    },
    {
      id: "q4.8-02",
      topic: "4.8",
      type: "multi",
      question: "What can cause bucket overflow? Choose all that apply.",
      options: ["Too few buckets", "Skew: many records with the same or similar key values", "A uniform hash function", "Reading a bucket"],
      answer: [0, 1],
      explain: "Overflow happens when there are too few buckets for the records, or when the records are not spread evenly (skew).",
      link: "#overflow"
    },
    {
      id: "q4.8-03",
      topic: "4.8",
      type: "mcq",
      question: "In overflow chaining (closed hashing), where does a record go when its bucket is full?",
      options: [
        "Into the next bucket that has space",
        "Into an overflow bucket linked to the full bucket",
        "It is rejected",
        "Into the first bucket of the file"
      ],
      answer: 1,
      explain: "Overflow buckets are linked in a chain to the full bucket. Databases use this method.",
      link: "#overflow"
    },
    {
      id: "q4.8-04",
      topic: "4.8",
      type: "tf",
      question: "Open hashing with linear probing makes deletion easy.",
      answer: false,
      explain: "False. Removing a record can break the probe path of other keys, so deletion is hard. Probing also forms clusters.",
      link: "#overflow"
    },
    {
      id: "q4.8-05",
      topic: "4.8",
      type: "multi",
      question: "Which of these describe a good hash function? Choose all that apply.",
      options: [
        "Uniform: each bucket gets about the same number of possible key values",
        "Random: each bucket gets about the same number of actual records",
        "Puts all keys in the first bucket",
        "Keeps the keys in sorted order"
      ],
      answer: [0, 1],
      explain: "A good hash function is uniform and random. It does not keep keys in order, which is why hashing is poor for range queries.",
      link: "#hash-function"
    },
    {
      id: "q4.8-06",
      topic: "4.8",
      type: "mcq",
      question: "What is the main problem of static hashing when a database grows a lot?",
      options: [
        "The number of buckets is fixed, so overflow chains grow long.",
        "The hash function stops working.",
        "Records can no longer be deleted.",
        "Each search reads every bucket."
      ],
      answer: 0,
      explain: "B is fixed when the file is created. As the data grows, buckets overflow and searches slow down, unless the whole file is reorganized.",
      link: "#merits"
    },
    {
      id: "q4.9-01",
      topic: "4.9",
      type: "mcq",
      question: "In extendible hashing, the global depth is d = 3 and a bucket has local depth d′ = 1. How many directory entries point to this bucket?",
      options: ["1", "2", "4", "8"],
      answer: 2,
      explain: "2^(d − d′) entries point to the bucket. Here 2^(3 − 1) = 4.",
      link: "#extendible"
    },
    {
      id: "q4.9-02",
      topic: "4.9",
      type: "mcq",
      question: "A key must go into a full bucket whose local depth equals the global depth. What happens first?",
      options: [
        "The bucket splits and the directory stays the same size.",
        "The directory doubles, and then the bucket splits.",
        "The key goes into an overflow chain.",
        "The directory halves."
      ],
      answer: 1,
      explain: "No directory bit is left to tell the two halves apart, so the directory doubles (d increases by 1) before the bucket splits.",
      link: "#operations"
    },
    {
      id: "q4.9-03",
      topic: "4.9",
      type: "tf",
      question: "When a full bucket with local depth less than the global depth splits, the directory doubles.",
      answer: false,
      explain: "False. Several entries already point to that bucket, so it splits and half of those entries point to the new bucket. The directory size does not change.",
      link: "#operations"
    },
    {
      id: "q4.9-04",
      topic: "4.9",
      type: "mcq",
      question: "The global depth is 2 and h(x) = x. Which directory entry does key 13 use, if the directory uses the last bits?",
      code: "13 in binary: 1101",
      options: ["00", "01", "10", "11"],
      answer: 1,
      explain: "The last 2 bits of 1101 are 01, so key 13 uses entry 01.",
      link: "#extendible"
    },
    {
      id: "q4.9-05",
      topic: "4.9",
      type: "order",
      question: "Put the steps for inserting into a full bucket, where local depth = global depth, in the right order.",
      options: [
        "Find the bucket using the last d bits of the hash value.",
        "See that the bucket is full and its local depth equals the global depth.",
        "Double the directory and add 1 to the global depth.",
        "Split the bucket and move each key using its next bit.",
        "Try to insert the key again."
      ],
      explain: "The directory must double before the bucket can split. After the split, the key is inserted again.",
      link: "#operations"
    },
    {
      id: "q4.9-06",
      topic: "4.9",
      type: "mcq",
      question: "What is the main merit (advantage) of extendible hashing over static hashing?",
      options: [
        "It keeps keys in sorted order.",
        "The number of buckets grows and shrinks with the data, without full reorganization.",
        "It needs no directory.",
        "It is best for range queries."
      ],
      answer: 1,
      explain: "Buckets split and merge one at a time as the data changes. The cost is one extra directory lookup.",
      link: "#merits"
    },
    {
      id: "q4.10-01",
      topic: "4.10",
      type: "order",
      question: "Put the steps of query processing in the right order.",
      options: ["Parsing and translation", "Optimization", "Evaluation"],
      explain: "The parser checks the query and translates it into relational algebra. The optimizer picks a plan, and the execution engine runs it.",
      link: "#steps"
    },
    {
      id: "q4.10-02",
      topic: "4.10",
      type: "mcq",
      question: "Which query does the parser reject because of its syntax?",
      options: [
        "SELECT name FORM student;",
        "SELECT name FROM student;",
        "SELECT name FROM student WHERE marks > 50;",
        "SELECT * FROM student;"
      ],
      answer: 0,
      explain: "FORM is not a keyword, so the syntax is wrong. The other queries are written correctly.",
      link: "#steps"
    },
    {
      id: "q4.10-03",
      topic: "4.10",
      type: "mcq",
      question: "A relation takes bᵣ = 100 blocks. What does a linear search for a selection cost?",
      options: [
        "100 block transfers and 1 seek",
        "100 block transfers and 100 seeks",
        "7 block transfers and 7 seeks",
        "1 block transfer and 1 seek"
      ],
      answer: 0,
      explain: "A linear search seeks once to the start of the file, then reads all bᵣ blocks one after another.",
      link: "#selection"
    },
    {
      id: "q4.10-04",
      topic: "4.10",
      type: "mcq",
      question: "A file is sorted on the search key and takes 1,024 blocks. About how many blocks does a binary search read to find the first match?",
      options: ["1", "10", "512", "1,024"],
      answer: 1,
      explain: "A binary search reads ⌈log₂(bᵣ)⌉ blocks. log₂(1,024) = 10.",
      link: "#selection"
    },
    {
      id: "q4.10-05",
      topic: "4.10",
      type: "tf",
      question: "In pipelining, each intermediate result is written to a temporary relation on disk before the next operation starts.",
      answer: false,
      explain: "False. That is materialization. In pipelining, tuples are passed to the next operation as soon as they are made.",
      link: "#plans"
    },
    {
      id: "q4.10-06",
      topic: "4.10",
      type: "mcq",
      question: "Which join algorithm reads both relations once after sorting them on the join attribute?",
      options: ["Nested-loop join", "Block nested-loop join", "Merge join", "Hash join"],
      answer: 2,
      explain: "Merge join sorts both relations, then reads them together once, like merging two sorted lists.",
      link: "#joins"
    },
    {
      id: "q4.10-07",
      topic: "4.10",
      type: "mcq",
      question: "Why does external merge sort exist?",
      options: [
        "The relation is too large to fit in main memory.",
        "The relation has no search key.",
        "Hashing cannot sort numbers.",
        "SQL does not allow ORDER BY."
      ],
      answer: 0,
      explain: "It sorts runs that fit in memory, writes them to disk, and then merges the runs.",
      link: "#sorting"
    },
    {
      id: "q4.11-01",
      topic: "4.11",
      type: "mcq",
      question: "What is query optimization?",
      options: [
        "Choosing the most efficient evaluation plan from the equivalent plans for a query",
        "Checking the syntax of a query",
        "Rewriting a query so it returns fewer rows",
        "Adding an index to every table"
      ],
      answer: 0,
      explain: "The optimizer chooses the cheapest of the many equivalent ways to run the query. The answer stays the same.",
      link: "#what"
    },
    {
      id: "q4.11-02",
      topic: "4.11",
      type: "multi",
      question: "Which of these are heuristic rules for query optimization? Choose all that apply.",
      options: [
        "Perform selections as early as possible.",
        "Perform projections as early as possible.",
        "Perform Cartesian products as early as possible.",
        "Perform the most restrictive selections and joins first."
      ],
      answer: [0, 1, 3],
      explain: "Selections and projections early, and the most restrictive operations first. Cartesian products should be avoided and replaced with joins.",
      link: "#heuristics"
    },
    {
      id: "q4.11-03",
      topic: "4.11",
      type: "mcq",
      question: "Which equivalence rule allows σ(dept = 'CSE')(STUDENT ⋈ MARKS) to become σ(dept = 'CSE')(STUDENT) ⋈ MARKS?",
      options: [
        "Joins are commutative.",
        "Selection distributes over a join when the condition uses attributes of one relation only.",
        "Cascade of projection",
        "Selection with Cartesian product is a join."
      ],
      answer: 1,
      explain: "dept is an attribute of STUDENT only, so the selection can be pushed down to STUDENT before the join.",
      link: "#equivalence"
    },
    {
      id: "q4.11-04",
      topic: "4.11",
      type: "mcq",
      question: "A relation r has nᵣ = 10,000 tuples, and attribute A has V(A, r) = 50 distinct values. About how many tuples does σ(A = v)(r) return?",
      options: ["50", "200", "500", "10,000"],
      answer: 1,
      explain: "The estimate is nᵣ / V(A, r) = 10,000 / 50 = 200, if the values are spread evenly.",
      link: "#statistics"
    },
    {
      id: "q4.11-05",
      topic: "4.11",
      type: "tf",
      question: "Cost-based optimization uses statistics from the catalog, such as the number of tuples and distinct values, to estimate the cost of each plan.",
      answer: true,
      explain: "True. Statistics such as nᵣ, bᵣ, V(A, r) and histograms let the optimizer estimate result sizes and costs.",
      link: "#cost-based"
    },
    {
      id: "q4.11-06",
      topic: "4.11",
      type: "mcq",
      question: "Why does an RDBMS keep histograms on important attributes?",
      options: [
        "To draw charts for users",
        "To estimate sizes better when values are not spread evenly",
        "To store the data compressed",
        "To check the syntax of queries"
      ],
      answer: 1,
      explain: "The simple formulas assume an even spread. A histogram counts the tuples in each range of values, so estimates are closer to the truth.",
      link: "#statistics"
    },
    {
      id: "q4.11-07",
      topic: "4.11",
      type: "mcq",
      question: "Compared with cost-based optimization, what is a demerit (disadvantage) of heuristic optimization?",
      options: [
        "It takes a long time to optimize.",
        "It needs detailed statistics.",
        "It ignores the actual data, so it may miss the best plan.",
        "It cannot use relational algebra."
      ],
      answer: 2,
      explain: "Heuristics are fast and need no statistics, but fixed rules can choose a slower plan for some data.",
      link: "#compare"
    },
    {
      id: "q4.6-01",
      topic: "4.6",
      type: "mcq",
      question: "In a B+ tree, where are all the search keys and their record pointers stored?",
      options: ["Only in the root node", "Only in the internal nodes", "In the leaf nodes", "In a separate hash table"],
      answer: 2,
      explain: "Every search key appears in a leaf, together with the pointer to its record. Internal nodes hold only guide keys.",
      link: "#structure"
    },
    {
      id: "q4.6-02",
      topic: "4.6",
      type: "mcq",
      question: "A node of a B+ tree can hold n = 4 pointers. What is the largest number of keys that a node can hold?",
      options: ["2", "3", "4", "5"],
      answer: 1,
      explain: "A node holds up to n − 1 keys. With n = 4, a node holds up to 3 keys.",
      link: "#structure"
    },
    {
      id: "q4.6-03",
      topic: "4.6",
      type: "mcq",
      question: "With n = 4, a leaf holds 5, 7 and 11. You insert 17, so the leaf splits. Using the method from class, which key is copied up to the parent?",
      code: "Leaf before:  [5 | 7 | 11]\nInsert:       17",
      options: ["5", "7", "11", "17"],
      answer: 2,
      explain: "The sorted keys are 5, 7, 11 and 17. The old leaf keeps 5 and 7, the new leaf gets 11 and 17, and the middle key 11 is copied up.",
      link: "#insertion"
    },
    {
      id: "q4.6-04",
      topic: "4.6",
      type: "tf",
      question: "When a leaf node splits, the middle key moves up to the parent and is removed from the leaf.",
      answer: false,
      explain: "False. A leaf split copies the middle key up, so it also stays in the leaf. Only an internal node split moves the key up and removes it from that level.",
      link: "#insertion"
    },
    {
      id: "q4.6-05",
      topic: "4.6",
      type: "multi",
      question: "Which of these are true for every B+ tree? Choose all that apply.",
      options: [
        "All leaf nodes are on the same level.",
        "The leaf nodes are linked in key order.",
        "Internal nodes store the record pointers.",
        "Every node except the root is at least half full."
      ],
      answer: [0, 1, 3],
      explain: "A B+ tree is balanced, its leaves are linked, and every node except the root is at least half full. Record pointers are in the leaves, not in the internal nodes.",
      link: "#structure"
    },
    {
      id: "q4.6-06",
      topic: "4.6",
      type: "mcq",
      question: "Why is a B+ tree good for a range query such as “find all students with marks from 60 to 80”?",
      options: [
        "It stores the marks in a hash table.",
        "It finds 60 once, then reads along the linked leaves until 80.",
        "It reads every node of the tree.",
        "It keeps a copy of each key in the root."
      ],
      answer: 1,
      explain: "The search goes down the tree once to find 60. The leaves are linked in order, so it then reads the next leaves until it passes 80.",
      link: "#search"
    },
    {
      id: "q4.6-07",
      topic: "4.6",
      type: "order",
      question: "Put the steps for inserting a key into a B+ tree in the right order.",
      options: [
        "Find the leaf where the key belongs.",
        "Put the key into the leaf in sorted order.",
        "If the leaf has too many keys, split it into two leaves.",
        "Copy the middle key up into the parent.",
        "If the parent has too many pointers, split it and move its middle key up."
      ],
      explain: "Insertion always starts at the leaf. Splits then travel upward, one level at a time, and a root split makes the tree one level taller.",
      link: "#insertion"
    },
    {
      id: "q4.6-08",
      topic: "4.6",
      type: "mcq",
      question: "After a deletion, a leaf has too few keys. Its left sibling has more than the minimum number of keys. What happens next?",
      options: [
        "The leaf borrows a key from its left sibling.",
        "The whole tree is rebuilt.",
        "The leaf is left with too few keys.",
        "The root is deleted."
      ],
      answer: 0,
      explain: "When a sibling has a key to spare, the keys are redistributed: the leaf borrows one key and the guide key in the parent is updated. A merge happens only when no sibling can lend.",
      link: "#deletion"
    },
    {
      id: "q4.6-09",
      topic: "4.6",
      type: "mcq",
      question: "What happens when the fan-out of a B+ tree is made larger?",
      options: [
        "The tree becomes taller and searches need more disk reads.",
        "The tree becomes shorter and searches need fewer disk reads.",
        "The leaves stop being linked.",
        "Nothing changes."
      ],
      answer: 1,
      explain: "Each node points to more children, so fewer levels are needed. Each level costs about one disk read during a search.",
      link: "#fan-out"
    },
    {
      id: "q4.6-10",
      topic: "4.6",
      type: "tf",
      question: "A B+ tree becomes one level taller only when the root splits.",
      answer: true,
      explain: "True. The tree grows at the top: a root split creates a new root, so every leaf stays on the same level.",
      link: "#insertion"
    }
  ]);
})();
