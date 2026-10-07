/* Unit IV question bank items.
   "original" keeps the wording from the source bank; "question" is the corrected
   wording shown on the site. Sources: "Unit IV" is the unit question bank, and
   "IAT-1" and "IAT-2" are the internal assessment banks. */
(function () {
  var D = (window.DBMS = window.DBMS || {});
  D.questions = (D.questions || []).concat([
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
      id: "u4-b5",
      unit: 4,
      part: "B",
      marks: 16,
      topics: ["4.6", "4.7"],
      sources: [{ bank: "Unit IV", no: 5 }],
      original: "Compare B-tree and B+ tree index files. Illustrate with examples where B+ tree is preferred.",
      question: "Compare B tree and B+ tree index files. Illustrate with examples where a B+ tree is preferred.",
      answer: null,
      outline: null
    },
    {
      id: "iat2-b6",
      unit: 4,
      part: "B",
      marks: 16,
      topics: ["4.6"],
      sources: [{ bank: "IAT-2", no: 6 }],
      original: "Construct a B+ Tree for the following set of key values: (2, 3, 5, 7, 11, 17, 19, 23, 29, 31). Assume that the tree is initially empty and the values are inserted in ascending order. Consider that each node can contain a maximum of Three pointers.",
      question: "Construct a B+ tree for the following set of key values: (2, 3, 5, 7, 11, 17, 19, 23, 29, 31). Assume that the tree is initially empty and the values are inserted in ascending order. Each node can contain a maximum of three pointers.",
      answer: null,
      outline: { href: "units/unit-4/b-plus-tree-index-files.html#worked-example", text: "See the worked answer, step by step" }
    }
  ]);
})();
