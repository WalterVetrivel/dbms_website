/* Unit IV quiz items. Types: mcq (one answer), multi (all that apply),
   tf (true or false) and order (put the steps in order; options are listed in
   the correct order and shuffled on screen). */
(function () {
  var D = (window.DBMS = window.DBMS || {});
  D.quizzes = (D.quizzes || []).concat([
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
