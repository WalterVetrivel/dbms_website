/* Unit IV question bank items.
   Every question is mapped to its unit, never to a test or exam paper, because
   test papers change each semester.
   id: "u4-a1" is Unit IV, Part A, question 1 of the unit question bank. A question
   that is not in the unit bank takes the next free number in its part, and its
   source is { bank: "Unit IV", extra: true }.
   "original" keeps the source wording; "question" is the corrected wording shown
   on the site. "parts" lists the a), b) sub-questions and "include" is the hint
   printed under some 16-mark questions; both are optional. "answer" is the 2-mark
   answer (HTML), or null. "outline" is true when a 16-mark question
   has an answer outline in data/outlines, or null. */
(function () {
  var D = (window.DBMS = window.DBMS || {});
  D.questions = (D.questions || []).concat([
    {
      id: "u4-a1",
      unit: 4,
      part: "A",
      marks: 2,
      topics: ["4.1"],
      sources: [{ bank: "Unit IV", no: 1 }],
      original: "What is RAID? Mention any two advantages of using RAID.",
      question: "What is RAID? Mention any two advantages of using RAID.",
      answer:
        "<p><strong>RAID (Redundant Array of Independent Disks)</strong> uses <strong>many disks together</strong> so that they work as one large, fast and reliable disk.</p>" +
        "<ol>" +
        "<li><strong>Higher reliability:</strong> with <strong>redundancy</strong> (mirroring or parity), data survives when one disk fails.</li>" +
        "<li><strong>Higher performance:</strong> with <strong>striping</strong>, data is spread over several disks, so many blocks are read in parallel.</li>" +
        "</ol>"
    },
    {
      id: "u4-a2",
      unit: 4,
      part: "A",
      marks: 2,
      topics: ["4.1"],
      sources: [{ bank: "Unit IV", no: 2 }],
      original: "List the different RAID levels and briefly state their main feature.",
      question: "List the different RAID levels and briefly state the main feature of each.",
      answer:
        "<table><thead><tr><th>Level</th><th>Main feature</th></tr></thead><tbody>" +
        "<tr><td>RAID 0</td><td>Block striping, no redundancy</td></tr>" +
        "<tr><td>RAID 1</td><td>Mirroring: every disk has a copy</td></tr>" +
        "<tr><td>RAID 2</td><td>Bit striping with error-correcting (Hamming) codes</td></tr>" +
        "<tr><td>RAID 3</td><td>Bit-interleaved parity on one parity disk</td></tr>" +
        "<tr><td>RAID 4</td><td>Block-interleaved parity on one parity disk</td></tr>" +
        "<tr><td>RAID 5</td><td>Block-interleaved parity spread over all disks</td></tr>" +
        "<tr><td>RAID 6</td><td>Two sets of parity (P + Q); survives two disk failures</td></tr>" +
        "</tbody></table>"
    },
    {
      id: "u4-a3",
      unit: 4,
      part: "A",
      marks: 2,
      topics: ["4.3"],
      sources: [{ bank: "Unit IV", no: 3 }],
      original: "Differentiate between fixed-length and variable-length records in file organization.",
      question: "Differentiate between fixed-length and variable-length records in file organization.",
      answer:
        "<table><thead><tr><th>Fixed-length records</th><th>Variable-length records</th></tr></thead><tbody>" +
        "<tr><td>Every record has the <strong>same size</strong>.</td><td>Records can have <strong>different sizes</strong>.</td></tr>" +
        "<tr><td>Simple: record <em>i</em> starts at byte n × (<em>i</em> − 1).</td><td>Needs extra structure, such as the <strong>slotted-page</strong> structure.</td></tr>" +
        "<tr><td>May waste space.</td><td>Uses space well.</td></tr>" +
        "<tr><td>Example: CHAR(20) fields.</td><td>Example: VARCHAR fields.</td></tr>" +
        "</tbody></table>"
    },
    {
      id: "u4-a4",
      unit: 4,
      part: "A",
      marks: 2,
      topics: ["4.2"],
      sources: [{ bank: "Unit IV", no: 4 }],
      original: "What is the difference between heap (unordered) files and sequential (ordered) files?",
      question: "What is the difference between heap (unordered) files and sequential (ordered) files?",
      answer:
        "<table><thead><tr><th>Heap file</th><th>Sequential file</th></tr></thead><tbody>" +
        "<tr><td>Records are stored in <strong>any order</strong>, wherever there is space.</td><td>Records are stored <strong>sorted on a search key</strong>.</td></tr>" +
        "<tr><td><strong>Insertion is fast</strong>: add at the end.</td><td>Insertion is slow: the order must be kept.</td></tr>" +
        "<tr><td>Search needs a <strong>linear scan</strong>.</td><td>Search by key and range queries are <strong>fast</strong> (binary search).</td></tr>" +
        "</tbody></table>"
    },
    {
      id: "u4-a5",
      unit: 4,
      part: "A",
      marks: 2,
      topics: ["4.5"],
      sources: [{ bank: "Unit IV", no: 5 }],
      original: "Define primary index and secondary index.",
      question: "Define primary index and secondary index.",
      answer:
        "<p><strong>Primary index</strong> (clustering index): an index whose search key <strong>also sets the order of the records</strong> in the file. It can be sparse. Example: an index on RollNo when the file is sorted by RollNo.</p>" +
        "<p><strong>Secondary index</strong> (non-clustering index): an index whose search key is in a <strong>different order</strong> from the file. It must be dense. Example: an index on Name when the file is sorted by RollNo.</p>"
    },
    {
      id: "u4-a6",
      unit: 4,
      part: "A",
      marks: 2,
      topics: ["4.5"],
      sources: [{ bank: "Unit IV", no: 6 }],
      original: "Write two differences between dense index and sparse index.",
      question: "Write two differences between a dense index and a sparse index.",
      answer:
        "<table><thead><tr><th>Dense index</th><th>Sparse index</th></tr></thead><tbody>" +
        "<tr><td>Has an index entry for <strong>every search-key value</strong> in the file.</td><td>Has entries for <strong>only some</strong> search-key values (for example, one per block).</td></tr>" +
        "<tr><td>Faster to find a record, but needs <strong>more space</strong>.</td><td>Needs <strong>less space</strong> and less upkeep, but finding a record is a little slower.</td></tr>" +
        "<tr><td>Can be used with any file.</td><td>Only when the file is <strong>sorted</strong> on the search key.</td></tr>" +
        "</tbody></table>"
    },
    {
      id: "u4-a7",
      unit: 4,
      part: "A",
      marks: 2,
      topics: ["4.6", "4.7"],
      sources: [{ bank: "Unit IV", no: 7 }],
      original: "What is a B+ tree? How does it differ from a B-tree?",
      question: "What is a B+ tree? How does it differ from a B tree?",
      answer:
        "<p>A <strong>B+ tree</strong> is a <strong>balanced tree</strong> that is used as an index. All search keys and record pointers are stored in the <strong>leaf nodes</strong>. The leaves are <strong>linked</strong> in key order. Internal nodes hold only guide keys that direct the search.</p>" +
        "<table><thead><tr><th>B+ tree</th><th>B tree</th></tr></thead><tbody>" +
        "<tr><td>Record pointers are only in the leaves.</td><td>Record pointers are in every node.</td></tr>" +
        "<tr><td>A key can appear in an internal node and in a leaf.</td><td>Each key appears only once.</td></tr>" +
        "<tr><td>Leaves are linked, so range queries are fast.</td><td>Leaves are not linked.</td></tr>" +
        "</tbody></table>"
    },
    {
      id: "u4-a8",
      unit: 4,
      part: "A",
      marks: 2,
      topics: ["4.6"],
      sources: [{ bank: "Unit IV", no: 8 }],
      original: "Define fan-out in a B+ tree.",
      question: "Define fan-out in a B+ tree.",
      answer:
        "<p><strong>Fan-out</strong> is the number of pointers (children) that a node of a B+ tree has. If a node can hold <em>n</em> pointers, each internal node except the root has between <strong>⌈n/2⌉ and n</strong> children.</p>" +
        "<p>A <strong>high fan-out</strong> keeps the tree <strong>short</strong>, so a search needs <strong>fewer disk reads</strong>. For example, with a fan-out of 100, a tree with only three levels can index about one million keys.</p>"
    },
    {
      id: "u4-a9",
      unit: 4,
      part: "A",
      marks: 2,
      topics: ["4.8"],
      sources: [{ bank: "Unit IV", no: 9 }],
      original: "What is static hashing? Give one advantage and one disadvantage.",
      question: "What is static hashing? Give one advantage and one disadvantage.",
      answer:
        "<p>In <strong>static hashing</strong>, a <strong>hash function</strong> h maps each search-key value to one of a <strong>fixed number of buckets</strong>. Example: h(k) = k mod 10 gives 10 buckets.</p>" +
        "<p><strong>Advantage:</strong> an equality search needs only <strong>about one disk access</strong>.</p>" +
        "<p><strong>Disadvantage:</strong> the number of buckets cannot change. When the database grows, buckets <strong>overflow</strong> and searches slow down; when it shrinks, space is wasted.</p>"
    },
    {
      id: "u4-a10",
      unit: 4,
      part: "A",
      marks: 2,
      topics: ["4.9"],
      sources: [{ bank: "Unit IV", no: 10 }],
      original: "Define dynamic hashing. Why is it needed?",
      question: "Define dynamic hashing. Why is it needed?",
      answer:
        "<p><strong>Dynamic hashing</strong> is hashing in which the <strong>number of buckets grows or shrinks</strong> as the database changes. <strong>Extendible hashing</strong> is one form: it splits one bucket at a time and doubles the bucket address table when needed.</p>" +
        "<p><strong>Why needed:</strong> static hashing has a fixed number of buckets. A growing file causes bucket overflows, and a large starting size wastes space. Reorganizing the whole file is costly. Dynamic hashing avoids all three.</p>"
    },
    {
      id: "u4-a11",
      unit: 4,
      part: "A",
      marks: 2,
      topics: ["4.8"],
      sources: [{ bank: "Unit IV", no: 11 }],
      original: "What is a bucket overflow in hashing?",
      question: "What is bucket overflow in hashing?",
      answer:
        "<p><strong>Bucket overflow</strong> happens when a new record hashes to a bucket that is <strong>already full</strong>.</p>" +
        "<p><strong>Causes:</strong> too few buckets, or <strong>skew</strong> (many records hash to the same bucket because of repeated key values or a poor hash function).</p>" +
        "<p><strong>Handling:</strong> <strong>overflow chaining</strong> links extra overflow buckets to the full bucket (closed hashing). Open hashing puts the record in another bucket instead.</p>"
    },
    {
      id: "u4-a12",
      unit: 4,
      part: "A",
      marks: 2,
      topics: ["4.5"],
      sources: [{ bank: "Unit IV", no: 12 }],
      original: "List two differences between clustering index and non-clustering index.",
      question: "List two differences between a clustering index and a non-clustering index.",
      answer:
        "<table><thead><tr><th>Clustering index</th><th>Non-clustering index</th></tr></thead><tbody>" +
        "<tr><td>The file is <strong>sorted on the same search key</strong> as the index.</td><td>The file is sorted on a <strong>different key</strong>.</td></tr>" +
        "<tr><td>Only <strong>one</strong> per file.</td><td>A file can have <strong>many</strong>.</td></tr>" +
        "<tr><td>Can be <strong>sparse</strong>.</td><td>Must be <strong>dense</strong>.</td></tr>" +
        "</tbody></table>"
    },
    {
      id: "u4-a13",
      unit: 4,
      part: "A",
      marks: 2,
      topics: ["4.11"],
      sources: [{ bank: "Unit IV", no: 13 }],
      original: "What is query optimization? Why is it necessary?",
      question: "What is query optimization? Why is it necessary?",
      answer:
        "<p><strong>Query optimization</strong> is the process of choosing the <strong>most efficient evaluation plan</strong> from the many equivalent plans for a query.</p>" +
        "<p><strong>Why necessary:</strong></p>" +
        "<ul>" +
        "<li>Equivalent plans can differ in cost greatly, for example seconds against hours.</li>" +
        "<li>A good plan reduces <strong>disk reads</strong> and <strong>response time</strong>.</li>" +
        "<li>SQL says only <em>what</em> is needed, so the system must decide <em>how</em> to compute it.</li>" +
        "</ul>"
    },
    {
      id: "u4-a14",
      unit: 4,
      part: "A",
      marks: 2,
      topics: ["4.11"],
      sources: [{ bank: "Unit IV", no: 14 }],
      original: "Define cost-based optimization. How does it differ from heuristic optimization?",
      question: "Define cost-based optimization. How does it differ from heuristic optimization?",
      answer:
        "<p><strong>Cost-based optimization</strong> builds many equivalent plans, <strong>estimates the cost</strong> of each from <strong>statistics</strong> (number of tuples, blocks and distinct values), and picks the <strong>cheapest</strong>.</p>" +
        "<table><thead><tr><th>Cost-based</th><th>Heuristic</th></tr></thead><tbody>" +
        "<tr><td>Compares estimated costs.</td><td>Applies fixed rules, with no cost estimates.</td></tr>" +
        "<tr><td>Usually finds a better plan.</td><td>May miss the best plan.</td></tr>" +
        "<tr><td>Takes longer to optimize.</td><td>Fast to optimize.</td></tr>" +
        "</tbody></table>"
    },
    {
      id: "u4-a15",
      unit: 4,
      part: "A",
      marks: 2,
      topics: ["4.11"],
      sources: [{ bank: "Unit IV", no: 15 }],
      original: "Mention two heuristic rules used in query optimization.",
      question: "Mention two heuristic rules used in query optimization.",
      answer:
        "<ol>" +
        "<li><strong>Perform selection operations as early as possible.</strong> This reduces the number of tuples passed to later steps.<br>σ<sub>Dept = \"CSE\"</sub>(STUDENT ⋈ MARKS) becomes σ<sub>Dept = \"CSE\"</sub>(STUDENT) ⋈ MARKS.</li>" +
        "<li><strong>Perform projection operations as early as possible.</strong> This keeps only the needed attributes, so tuples are smaller.</li>" +
        "</ol>" +
        "<p>Another rule: replace a Cartesian product followed by a selection with a join.</p>"
    },
    {
      id: "u4-a16",
      unit: 4,
      part: "A",
      marks: 2,
      topics: ["4.8", "4.9"],
      sources: [{ bank: "Unit IV", extra: true }],
      original: "Distinguish between Static Hashing and Dynamic Hashing.",
      question: "Distinguish between static hashing and dynamic hashing.",
      answer:
        "<table><thead><tr><th>Static hashing</th><th>Dynamic hashing</th></tr></thead><tbody>" +
        "<tr><td>The <strong>number of buckets is fixed</strong> when the file is created.</td><td>The number of buckets <strong>grows and shrinks</strong> with the data.</td></tr>" +
        "<tr><td>The hash function never changes.</td><td>The function uses more or fewer bits of the hash value (extendible hashing).</td></tr>" +
        "<tr><td>A growing file causes <strong>bucket overflow</strong>.</td><td>Splits a full bucket, so overflow is rare.</td></tr>" +
        "<tr><td>Simple; no directory.</td><td>Needs a <strong>bucket address table</strong> (directory).</td></tr>" +
        "</tbody></table>"
    },
    {
      id: "u4-a17",
      unit: 4,
      part: "A",
      marks: 2,
      topics: ["4.4"],
      sources: [{ bank: "Unit IV", extra: true }],
      original: "Distinguish between Indexing and Hashing.",
      question: "Distinguish between indexing and hashing.",
      answer:
        "<table><thead><tr><th>Indexing</th><th>Hashing</th></tr></thead><tbody>" +
        "<tr><td>Keeps <strong>search keys in sorted order</strong> (for example, a B+ tree) with pointers to records.</td><td>A <strong>hash function</strong> computes the bucket that holds the record.</td></tr>" +
        "<tr><td>Good for <strong>range queries</strong> (marks between 60 and 80).</td><td>Poor for range queries.</td></tr>" +
        "<tr><td>Equality search takes a few disk reads (the height of the tree).</td><td>Equality search takes <strong>about one</strong> disk read.</td></tr>" +
        "</tbody></table>"
    },
    {
      id: "u4-b1",
      unit: 4,
      part: "B",
      marks: 16,
      topics: ["4.1"],
      sources: [{ bank: "Unit IV", no: 1 }],
      original: "Explain the different RAID levels (RAID 0 to RAID 6) with their advantages and disadvantages.",
      question: "Explain the different RAID levels (RAID 0 to RAID 6) with their advantages and disadvantages.",
      answer: null,
      outline: true
    },
    {
      id: "u4-b2",
      unit: 4,
      part: "B",
      marks: 16,
      topics: ["4.2"],
      sources: [{ bank: "Unit IV", no: 2 }],
      original: "Describe the various file organization techniques (heap, sequential, hashing, and clustered) and their use cases.",
      question: "Describe the various file organization techniques (heap, sequential, hashing and clustered) and their use cases.",
      answer: null,
      outline: true
    },
    {
      id: "u4-b3",
      unit: 4,
      part: "B",
      marks: 16,
      topics: ["4.3"],
      sources: [{ bank: "Unit IV", no: 3 }],
      original: "Explain how records are organized in files. Discuss fixed-length vs. variable-length records with examples.",
      question: "Explain how records are organized in files. Discuss fixed-length and variable-length records with examples.",
      answer: null,
      outline: true
    },
    {
      id: "u4-b4",
      unit: 4,
      part: "B",
      marks: 16,
      topics: ["4.7"],
      sources: [{ bank: "Unit IV", no: 4 }],
      original: "With neat diagrams, explain the structure and operations (insertion, deletion, search) of a B-tree index file.",
      question: "With neat diagrams, explain the structure and operations (insertion, deletion and search) of a B tree index file.",
      answer: null,
      outline: true
    },
    {
      id: "u4-b5",
      unit: 4,
      part: "B",
      marks: 16,
      topics: ["4.6", "4.7"],
      sources: [{ bank: "Unit IV", no: 5 }],
      original: "Compare B-tree and B+ tree index files. Illustrate with examples where B+ tree is preferred.",
      question: "Compare B tree and B+ tree index files. Illustrate with examples where a B+ tree is preferred.",
      answer: null,
      outline: true
    },
    {
      id: "u4-b6",
      unit: 4,
      part: "B",
      marks: 16,
      topics: ["4.5"],
      sources: [{ bank: "Unit IV", no: 6 }],
      original: "Explain ordered indices. Discuss primary, secondary, dense, and sparse indices with examples.",
      question: "Explain ordered indices. Discuss primary, secondary, dense and sparse indices with examples.",
      answer: null,
      outline: true
    },
    {
      id: "u4-b7",
      unit: 4,
      part: "B",
      marks: 16,
      topics: ["4.8", "4.9"],
      sources: [{ bank: "Unit IV", no: 7 }],
      original: "Explain static and dynamic hashing techniques. Illustrate how dynamic hashing resolves bucket overflow.",
      question: "Explain static and dynamic hashing techniques. Illustrate how dynamic hashing resolves bucket overflow.",
      answer: null,
      outline: true
    },
    {
      id: "u4-b8",
      unit: 4,
      part: "B",
      marks: 16,
      topics: ["4.10"],
      sources: [{ bank: "Unit IV", no: 8 }],
      original: "With an example, explain query processing steps from high-level SQL query to low-level execution plan.",
      question: "With an example, explain the query processing steps from a high-level SQL query to a low-level execution plan.",
      answer: null,
      outline: true
    },
    {
      id: "u4-b9",
      unit: 4,
      part: "B",
      marks: 16,
      topics: ["4.11"],
      sources: [{ bank: "Unit IV", no: 9 }],
      original: "Discuss heuristic-based query optimization rules with examples.",
      question: "Discuss heuristic-based query optimization rules with examples.",
      answer: null,
      outline: true
    },
    {
      id: "u4-b10",
      unit: 4,
      part: "B",
      marks: 16,
      topics: ["4.11"],
      sources: [{ bank: "Unit IV", no: 10 }],
      original: "Explain cost-based query optimization. Show how cost estimation helps in selecting the best query execution plan.",
      question: "Explain cost-based query optimization. Show how cost estimation helps in selecting the best query execution plan.",
      answer: null,
      outline: true
    },
    {
      id: "u4-b11",
      unit: 4,
      part: "B",
      marks: 16,
      topics: ["4.6"],
      sources: [{ bank: "Unit IV", extra: true }],
      original: "Construct a B+ Tree for the following set of key values: (2, 3, 5, 7, 11, 17, 19, 23, 29, 31). Assume that the tree is initially empty and the values are inserted in ascending order. Consider that each node can contain a maximum of Three pointers.",
      question: "Construct a B+ tree for the following set of key values: (2, 3, 5, 7, 11, 17, 19, 23, 29, 31). Assume that the tree is initially empty and the values are inserted in ascending order. Each node can contain a maximum of three pointers.",
      answer: null,
      outline: true
    }
  ]);
})();
