/* Unit I quiz items. Types: mcq (one answer), multi (all that apply),
   tf (true or false) and order (put the steps in order; options are listed in
   the correct order and shuffled on screen). */
(function () {
  var D = (window.DBMS = window.DBMS || {});
  D.quizzes = (D.quizzes || []).concat([
    /* 1.1 Purpose of Database System */
    {
      id: "q1.1-01",
      topic: "1.1",
      type: "mcq",
      question: "Which is the best definition of a DBMS?",
      options: [
        "A collection of interrelated data and a set of programs to access that data",
        "A program that stores each record in a separate text file",
        "A spreadsheet with many sheets",
        "A language for writing operating systems"
      ],
      answer: 0,
      explain: "A DBMS is both the related data and the programs that store, change and retrieve it.",
      link: "#what"
    },
    {
      id: "q1.1-02",
      topic: "1.1",
      type: "mcq",
      question: "A student's address is changed in the office file but not in the hostel file. Which problem is this?",
      options: ["Data isolation", "Data inconsistency", "Atomicity problem", "Security problem"],
      answer: 1,
      explain: "The two copies of the same data no longer match. That is data inconsistency, caused by redundancy.",
      link: "#problems"
    },
    {
      id: "q1.1-03",
      topic: "1.1",
      type: "mcq",
      question: "The power fails during a fee transfer. Money leaves the student's account but never reaches the college account. Which file-system problem does this show?",
      options: ["Data redundancy", "Concurrent-access anomaly", "Atomicity problem", "Difficulty in accessing data"],
      answer: 2,
      explain: "The transfer must happen completely or not at all. A half-done transfer is an atomicity problem.",
      link: "#problems"
    },
    {
      id: "q1.1-04",
      topic: "1.1",
      type: "multi",
      question: "Which of these are disadvantages of a file-processing system? Select all that apply.",
      options: ["Data redundancy", "Integrity problems", "A simple query language", "Security problems"],
      answer: [0, 1, 3],
      explain: "Redundancy, integrity problems and security problems are file-system drawbacks. A simple query language is an advantage of a DBMS.",
      link: "#problems"
    },
    {
      id: "q1.1-05",
      topic: "1.1",
      type: "tf",
      question: "A DBMS removes every duplicate copy of data, with no exceptions.",
      answer: false,
      explain: "False. A DBMS controls redundancy. Some copies, such as foreign key values and backups, are kept on purpose.",
      link: "#key-points"
    },
    {
      id: "q1.1-06",
      topic: "1.1",
      type: "mcq",
      question: "Which of these is a disadvantage of a DBMS?",
      options: ["Concurrent access", "High hardware and software cost", "Data integrity", "Controlled redundancy"],
      answer: 1,
      explain: "A DBMS needs powerful hardware and costly software. The other three are advantages.",
      link: "#merits"
    },
    {
      id: "q1.1-07",
      topic: "1.1",
      type: "mcq",
      question: "To answer the new question “list students from Salem with more than 80% marks”, a file system needs a new program. Which problem is this?",
      options: ["Difficulty in accessing data", "Data inconsistency", "Atomicity problem", "Data redundancy"],
      answer: 0,
      explain: "A file system has no easy way to ask new questions, so each one needs a new program.",
      link: "#problems"
    },
    /* 1.2 Views of Data */
    {
      id: "q1.2-01",
      topic: "1.2",
      type: "order",
      question: "Put the three levels of abstraction in order, from the lowest to the highest.",
      options: ["Physical level", "Logical level", "View level"],
      explain: "The physical level is the lowest, the logical level is in the middle and the view level is the highest.",
      link: "#levels"
    },
    {
      id: "q1.2-02",
      topic: "1.2",
      type: "mcq",
      question: "Which level describes what data is stored in the database and the relationships among the data?",
      options: ["Physical level", "Logical level", "View level", "Disk level"],
      answer: 1,
      explain: "The logical level describes what data is stored and how it is related. The physical level describes how it is stored.",
      link: "#levels"
    },
    {
      id: "q1.2-03",
      topic: "1.2",
      type: "mcq",
      question: "A college adds a new index and moves its data files to a faster disk. Programs work without any change. Which property is this?",
      options: ["Logical data independence", "Physical data independence", "Data redundancy", "Atomicity"],
      answer: 1,
      explain: "A change at the physical level that does not affect the logical schema shows physical data independence.",
      link: "#independence"
    },
    {
      id: "q1.2-04",
      topic: "1.2",
      type: "tf",
      question: "The instance of a database changes every time data is inserted, deleted or updated, but the schema changes rarely.",
      answer: true,
      explain: "True. The schema is the overall design. The instance is the data at one moment.",
      link: "#schema"
    },
    {
      id: "q1.2-05",
      topic: "1.2",
      type: "mcq",
      question: "What is a schema at the view level called?",
      options: ["Physical schema", "Logical schema", "Subschema", "Instance"],
      answer: 2,
      explain: "A database can have several views. Each view's schema is a subschema.",
      link: "#schema"
    },
    {
      id: "q1.2-06",
      topic: "1.2",
      type: "tf",
      question: "Logical data independence is easier to achieve than physical data independence.",
      answer: false,
      explain: "False. Programs depend on the tables they use, so logical data independence is harder to achieve.",
      link: "#independence"
    },
    {
      id: "q1.2-07",
      topic: "1.2",
      type: "multi",
      question: "Which changes need logical data independence to keep the views unchanged? Select all that apply.",
      options: ["Adding a column to a table", "Splitting one table into two", "Moving data files to a new disk", "Adding an index"],
      answer: [0, 1],
      explain: "Adding a column and splitting a table change the logical schema. Moving files and adding an index are physical changes.",
      link: "#independence"
    },
    /* 1.3 Data Models */
    {
      id: "q1.3-01",
      topic: "1.3",
      type: "mcq",
      question: "A data model is best described as:",
      options: [
        "A collection of conceptual tools for describing data, relationships, semantics and constraints",
        "A copy of the database kept for backup",
        "The physical file where records are stored",
        "A program that prints reports"
      ],
      answer: 0,
      explain: "A data model is the set of tools used to describe a database's data, relationships, meaning and constraints.",
      link: "#what"
    },
    {
      id: "q1.3-02",
      topic: "1.3",
      type: "mcq",
      question: "In which data model can a record have only one parent?",
      options: ["Network model", "Relational model", "Hierarchical model", "Semi-structured model"],
      answer: 2,
      explain: "The hierarchical model is a tree, so each record has exactly one parent.",
      link: "#hierarchical"
    },
    {
      id: "q1.3-03",
      topic: "1.3",
      type: "mcq",
      question: "Two products in a catalog have different attributes: a phone has a battery size, a shirt has a fabric. Which data model suits this best?",
      options: ["Hierarchical model", "Semi-structured model", "Network model", "E-R model"],
      answer: 1,
      explain: "In the semi-structured model, items of the same type can have different sets of attributes, as in XML or JSON.",
      link: "#semi"
    },
    {
      id: "q1.3-04",
      topic: "1.3",
      type: "tf",
      question: "The relational model links tables using pointers between records.",
      answer: false,
      explain: "False. The relational model links tables using common values (keys). Pointers are used by the hierarchical and network models.",
      link: "#compare"
    },
    {
      id: "q1.3-05",
      topic: "1.3",
      type: "mcq",
      question: "Which model adds inheritance and methods to the relational model?",
      options: ["Object-based model", "Network model", "Hierarchical model", "Semi-structured model"],
      answer: 0,
      explain: "The object-based model combines object-oriented features such as methods and inheritance with the relational model.",
      link: "#object"
    },
    {
      id: "q1.3-06",
      topic: "1.3",
      type: "multi",
      question: "Which models can show a many-to-many relationship directly? Select all that apply.",
      options: ["Network model", "Relational model (with a linking table)", "Hierarchical model"],
      answer: [0, 1],
      explain: "The network model allows many parents, and the relational model uses a linking table. The hierarchical tree cannot.",
      link: "#compare"
    },
    {
      id: "q1.3-07",
      topic: "1.3",
      type: "mcq",
      question: "In an E-R diagram drawn in Chen notation, what does a diamond show?",
      options: ["An entity set", "An attribute", "A relationship set", "A table"],
      answer: 2,
      explain: "Rectangles are entity sets and diamonds are relationship sets.",
      link: "#er"
    },
    /* 1.4 Database System Architecture */
    {
      id: "q1.4-01",
      topic: "1.4",
      type: "mcq",
      question: "Which part of the query processor records table definitions in the data dictionary?",
      options: ["DML compiler", "DDL interpreter", "Query evaluation engine", "Buffer manager"],
      answer: 1,
      explain: "The DDL interpreter reads DDL statements such as CREATE TABLE and records the definitions in the data dictionary.",
      link: "#query-processor"
    },
    {
      id: "q1.4-02",
      topic: "1.4",
      type: "mcq",
      question: "Which component picks the cheapest evaluation plan for a query?",
      options: ["File manager", "DML compiler and organizer (query optimization)", "Authorization manager", "DDL interpreter"],
      answer: 1,
      explain: "The DML compiler translates the query into a plan and, through query optimization, chooses the lowest-cost plan.",
      link: "#query-processor"
    },
    {
      id: "q1.4-03",
      topic: "1.4",
      type: "multi",
      question: "Which of these are parts of the storage manager? Select all that apply.",
      options: ["Buffer manager", "Transaction manager", "Query evaluation engine", "File manager"],
      answer: [0, 1, 3],
      explain: "The storage manager has the authorization and integrity manager, transaction manager, file manager and buffer manager. The query evaluation engine is in the query processor.",
      link: "#storage-manager"
    },
    {
      id: "q1.4-04",
      topic: "1.4",
      type: "mcq",
      question: "What does the data dictionary store?",
      options: ["The rows of every table", "Metadata, such as the schema and constraints", "Only backup copies", "The query results"],
      answer: 1,
      explain: "The data dictionary stores metadata: data about data, such as the schema of each table.",
      link: "#disk"
    },
    {
      id: "q1.4-05",
      topic: "1.4",
      type: "mcq",
      question: "A bank clerk uses a ready-made form to deposit money. What type of database user is the clerk?",
      options: ["Sophisticated user", "Application programmer", "Naive user", "Database administrator"],
      answer: 2,
      explain: "Naive users work through application interfaces such as forms, without writing queries.",
      link: "#users"
    },
    {
      id: "q1.4-06",
      topic: "1.4",
      type: "tf",
      question: "In a three-tier architecture, the client machine sends SQL directly to the database system.",
      answer: false,
      explain: "False. In three-tier, the client talks to an application server, and only the server talks to the database.",
      link: "#tiers"
    },
    {
      id: "q1.4-07",
      topic: "1.4",
      type: "mcq",
      question: "Which component brings data from disk into main memory and decides what to keep there?",
      options: ["Buffer manager", "File manager", "Transaction manager", "DDL interpreter"],
      answer: 0,
      explain: "The buffer manager fetches blocks into memory and decides what to cache.",
      link: "#storage-manager"
    },
    /* 1.5 Introduction to Relational Databases */
    {
      id: "q1.5-01",
      topic: "1.5",
      type: "mcq",
      question: "A relational database is:",
      options: [
        "A collection of tables, each with a unique name",
        "A tree of records linked by pointers",
        "A single text file with all the data",
        "A set of XML documents"
      ],
      answer: 0,
      explain: "A relational database keeps all its data in tables, and each table has a unique name.",
      link: "#what"
    },
    {
      id: "q1.5-02",
      topic: "1.5",
      type: "mcq",
      question: "How are two tables linked in a relational database?",
      options: ["By pointers stored in each row", "By common values in matching columns", "By the order of their rows", "By storing both in one file"],
      answer: 1,
      explain: "Tables are linked only by matching values, such as the same RollNo in Student and Admission.",
      link: "#linking"
    },
    {
      id: "q1.5-03",
      topic: "1.5",
      type: "tf",
      question: "If the rows of a table are shuffled, the table means something different.",
      answer: false,
      explain: "False. The order of rows in a table does not matter.",
      link: "#tables"
    },
    {
      id: "q1.5-04",
      topic: "1.5",
      type: "multi",
      question: "Which of these are relational database management systems? Select all that apply.",
      options: ["MySQL", "PostgreSQL", "Microsoft Excel", "Oracle Database"],
      answer: [0, 1, 3],
      explain: "MySQL, PostgreSQL and Oracle Database are RDBMS products. Excel is a spreadsheet, not a DBMS.",
      link: "#products"
    },
    {
      id: "q1.5-05",
      topic: "1.5",
      type: "mcq",
      question: "Using the Student, Admission and Course tables on this page, which course did student 002 join?",
      options: ["Computer Science", "Mechanical", "Civil", "None"],
      answer: 1,
      explain: "Admission has (002, 101), and course 101 is Mechanical.",
      link: "#linking"
    },
    {
      id: "q1.5-06",
      topic: "1.5",
      type: "mcq",
      question: "Who proposed the relational model?",
      options: ["Charles Bachman", "E. F. Codd", "Peter Chen", "Dennis Ritchie"],
      answer: 1,
      explain: "E. F. Codd of IBM proposed the relational model in 1970.",
      link: "#what"
    }
  ]);
})();
