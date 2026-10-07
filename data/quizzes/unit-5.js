/* Unit V quiz items. Types: mcq (one answer), multi (all that apply),
   tf (true or false) and order (put the steps in order; options are listed in
   the correct order and shuffled on screen). */
(function () {
  var D = (window.DBMS = window.DBMS || {});
  D.quizzes = (D.quizzes || []).concat([
    /* 5.1 Distributed Databases: Architecture */
    {
      id: "q5.1-01",
      topic: "5.1",
      type: "mcq",
      question: "Which statement best describes a distributed database?",
      options: [
        "One database stored on one large server",
        "Related data stored at several sites joined by a network, which looks like one database to users",
        "Many unrelated databases that never share data",
        "A database that is copied to a USB drive every night"
      ],
      answer: 1,
      explain: "The data is spread over several sites, but the DDBMS makes it look like one database.",
      link: "#what"
    },
    {
      id: "q5.1-02",
      topic: "5.1",
      type: "mcq",
      question: "Student is split into F1 = σ City='Salem' (Student) and F2 = σ City≠'Salem' (Student). How is Student rebuilt?",
      options: ["F1 ⋈ F2", "F1 ∪ F2", "F1 − F2", "F1 × F2"],
      answer: 1,
      explain: "This is horizontal fragmentation (split by rows), so the fragments are combined with union.",
      link: "#storage"
    },
    {
      id: "q5.1-03",
      topic: "5.1",
      type: "tf",
      question: "In vertical fragmentation, every fragment should keep the primary key.",
      answer: true,
      explain: "True. The key is needed to join the fragments back into the original relation.",
      link: "#storage"
    },
    {
      id: "q5.1-04",
      topic: "5.1",
      type: "multi",
      question: "Which are merits (advantages) of data replication? Choose all that apply.",
      options: [
        "Data stays available when one site fails",
        "Queries can run in parallel at different sites",
        "Updates are cheaper, because only one copy changes",
        "Reads can often be answered locally"
      ],
      answer: [0, 1, 3],
      explain: "Replication helps availability, parallelism and local reads. Updates cost more, because every copy must change.",
      link: "#storage"
    },
    {
      id: "q5.1-05",
      topic: "5.1",
      type: "mcq",
      question: "A user writes a query on Student without knowing which city's server stores the rows. Which property is this?",
      options: ["Location transparency", "Local autonomy", "Full replication", "Disjointness"],
      answer: 0,
      explain: "Location transparency hides the site where the data is stored.",
      link: "#transparency"
    },
    {
      id: "q5.1-06",
      topic: "5.1",
      type: "order",
      question: "Put the steps in order for a request made at site Si for data stored at site Sj.",
      options: [
        "Site Si looks in its local database",
        "Site Si sends the request over the network to Sj",
        "Site Sj runs the request on its local data",
        "Site Sj sends the result back to Si"
      ],
      explain: "The local database is searched first. Only data that is not local is fetched from another site.",
      link: "#architecture"
    },
    /* 5.2 Types of Distributed Databases */
    {
      id: "q5.2-01",
      topic: "5.2",
      type: "mcq",
      question: "All branches of a bank run MySQL 8.4 with the same tables, and the sites cooperate fully. What type of distributed database is this?",
      options: ["Homogeneous", "Heterogeneous", "Federated", "Centralized"],
      answer: 0,
      explain: "Same DBMS and same schema at every site, with full cooperation, means a homogeneous system.",
      link: "#homogeneous"
    },
    {
      id: "q5.2-02",
      topic: "5.2",
      type: "multi",
      question: "Which of these are true for a heterogeneous distributed database? Choose all that apply.",
      options: [
        "Sites may use different DBMS software",
        "Middleware translates queries between sites",
        "Every site must have the same schema",
        "Global transactions are harder to manage"
      ],
      answer: [0, 1, 3],
      explain: "Heterogeneous sites can differ in software and schema, so translation is needed and global transactions are harder.",
      link: "#heterogeneous"
    },
    {
      id: "q5.2-03",
      topic: "5.2",
      type: "mcq",
      question: "Another name for a federated database system is:",
      options: ["Multidatabase system", "Replicated database", "Centralized database", "Key-value store"],
      answer: 0,
      explain: "A federated database system is also called a multidatabase system. Autonomous databases share some of their data through a common layer.",
      link: "#federated"
    },
    {
      id: "q5.2-04",
      topic: "5.2",
      type: "mcq",
      question: "A hospital can refuse or delay a request that comes from the federated system. Which kind of autonomy is this?",
      options: ["Design autonomy", "Communication autonomy", "Execution autonomy", "Schema autonomy"],
      answer: 2,
      explain: "Execution autonomy means each site runs its work in its own way and can refuse or delay global requests.",
      link: "#federated"
    },
    {
      id: "q5.2-05",
      topic: "5.2",
      type: "tf",
      question: "In a homogeneous distributed database, each site keeps full control and can change its schema whenever it likes.",
      answer: false,
      explain: "False. Sites in a homogeneous system give up part of their autonomy, such as the right to change the schema or software on their own.",
      link: "#homogeneous"
    }
  ]);
})();
