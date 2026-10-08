/* Unit I 16-mark answer outlines, keyed by question id. See assets/js/outlines.js for the shape.
   Each outline is a plan only. The pages it links to hold the content the student must write out. */
(function () {
  var D = (window.DBMS = window.DBMS || {});
  D.outlines = D.outlines || {};

  D.outlines["u1-b1"] = {
    aim: "Two clear halves. First, why a DBMS is needed: the problems of file-processing systems and how a DBMS solves each one. Second, the views of data: data abstraction, the three levels with a neat diagram, schemas and instances, and the two kinds of data independence with examples.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["1.1#what", "1.1#applications"],
        points: [
          "Define a <strong>database</strong> and a <strong>database management system (DBMS)</strong> in one or two exact sentences.",
          "State the main goal: to store and retrieve information conveniently, efficiently and safely.",
          "List four or five applications: banking, airlines, universities, online shopping, telecom, hospitals."
        ]
      },
      {
        title: "The file-processing system",
        pages: 0.5,
        see: ["1.1#file-system"],
        points: [
          "Explain how organisations kept data before a DBMS: separate files, each with its own application program.",
          "Use one running example for the whole answer, such as a university with separate files for the office, the library and the hostel."
        ],
        draw: ["Several application programs, each reading its own file (for example accounts file, library file, hostel file)."]
      },
      {
        title: "Purpose of a database system: problems it solves",
        pages: 1.5,
        see: ["1.1#problems", "1.1#compare"],
        points: [
          "Write a short paragraph on each of the eight problems of file systems: <strong>data redundancy and inconsistency</strong>, <strong>difficulty in accessing data</strong>, <strong>data isolation</strong>, <strong>integrity problems</strong>, <strong>atomicity problems</strong>, <strong>concurrent-access anomalies</strong> and <strong>security problems</strong>.",
          "For every problem, give a small example from the university case (the same student's address in two files that disagree, a fund transfer that stops halfway, two clerks updating one balance).",
          "After each problem, say in one sentence how a DBMS removes it (one copy of each fact, query language, constraints, transactions, concurrency control, authorization)."
        ],
        table: ["File system compared with database system: at least six rows (redundancy, consistency, access, integrity, concurrency, security, backup and recovery)."]
      },
      {
        title: "Data abstraction",
        pages: 0.5,
        see: ["1.2#abstraction"],
        points: [
          "Define data abstraction: hiding the complex details of storage and showing users only what they need.",
          "Explain why it is needed: most users are not computer experts, and the storage details are complex."
        ]
      },
      {
        title: "The three levels of abstraction",
        pages: 1,
        see: ["1.2#levels", "1.2#try"],
        points: [
          "<strong>Physical level</strong>: how data is actually stored (blocks, files, indices).",
          "<strong>Logical level</strong>: what data is stored and how the pieces are related; the level a DBA works at.",
          "<strong>View level</strong>: only the part of the database one group of users needs; there can be many views.",
          "Show the same record at all three levels, for example an instructor record with ID, name, dept_name and salary."
        ],
        draw: ["The three-level architecture: several views (View 1, View 2 ... View n) at the top, the logical level in the middle and the physical level at the bottom, with mappings between them. Label every level."],
        example: ["A record type in a programming language (type instructor = record ...) for the logical level, and a view that hides salary for the view level."]
      },
      {
        title: "Instances and schemas",
        pages: 0.5,
        see: ["1.2#schema"],
        points: [
          "Define <strong>schema</strong> (the overall design, changes rarely) and <strong>instance</strong> (the data at one moment, changes often).",
          "Name the physical schema, the logical schema and the subschemas (views).",
          "Give the variable-and-value analogy from programming."
        ],
        table: ["Schema compared with instance: meaning, how often it changes, example."]
      },
      {
        title: "Data independence",
        pages: 0.5,
        see: ["1.2#independence"],
        points: [
          "Define <strong>physical data independence</strong>: changing the physical schema without changing the logical schema. Example: adding an index or moving files to a new disk.",
          "Define <strong>logical data independence</strong>: changing the logical schema without changing views or programs. Example: adding a new column to a table.",
          "Explain why logical data independence is harder to achieve."
        ]
      },
      {
        title: "Conclusion",
        pages: 0.25,
        points: [
          "Sum up: a DBMS solves the problems of file systems, and data abstraction with three levels gives data independence, so programs keep working when the storage or design changes."
        ]
      }
    ]
  };

  D.outlines["u1-b2"] = {
    aim: "Define a data model, then explain each model with a diagram and a small example of the same data, and finish with a comparison table. The hierarchical, network, relational and object-based models must each get their own heading; the E-R and semi-structured models add value.",
    sections: [
      {
        title: "Introduction: what is a data model?",
        pages: 0.5,
        see: ["1.3#what"],
        points: [
          "Define a <strong>data model</strong>: a collection of conceptual tools for describing data, data relationships, data semantics and consistency constraints.",
          "List the categories: relational, entity-relationship, object-based, semi-structured, and the older hierarchical and network models.",
          "Choose one example to use for every model, such as departments and their employees, or students and courses."
        ]
      },
      {
        title: "Hierarchical model",
        pages: 0.75,
        see: ["1.3#hierarchical"],
        points: [
          "Data is organised as a <strong>tree</strong> of records; each child has exactly one parent (one-to-many).",
          "Data is reached by starting at the root and moving down.",
          "Advantages: simple, fast for one-to-many data. Disadvantages: cannot show many-to-many directly, needs duplicate records, changes are hard.",
          "Give one real product, such as IBM IMS."
        ],
        draw: ["A tree with a college at the root, departments below it and students below each department."]
      },
      {
        title: "Network model",
        pages: 0.75,
        see: ["1.3#network"],
        points: [
          "Data is a <strong>graph</strong> of records joined by links (pointers); a record can have many parents.",
          "Can show many-to-many relationships directly.",
          "Advantages: flexible, less duplication than the hierarchical model. Disadvantages: complex structure, programs depend on the links.",
          "Mention the CODASYL standard."
        ],
        draw: ["Students and courses as record boxes, with a student linked to two courses and a course linked to two students."]
      },
      {
        title: "Relational model",
        pages: 1,
        see: ["1.3#relational", "1.6#terms", "1.5#linking"],
        points: [
          "Data and relationships are stored as <strong>tables (relations)</strong> of rows and columns; proposed by E. F. Codd in 1970.",
          "Explain row (tuple), column (attribute) and how tables are linked through common values (keys), not pointers.",
          "Advantages: simple, flexible, SQL support, strong theory; it is the most widely used model.",
          "Name products: MySQL, Oracle, PostgreSQL, SQL Server."
        ],
        table: ["Two small related tables, such as department(dept_id, dept_name) and employee(emp_id, name, dept_id), with three or four rows each."]
      },
      {
        title: "Entity-relationship (E-R) model",
        pages: 0.75,
        see: ["1.3#er", "2.1#entity"],
        points: [
          "Describes the real world as <strong>entities</strong>, their <strong>attributes</strong> and the <strong>relationships</strong> among them.",
          "Used mainly for database design, before the tables are created."
        ],
        draw: ["A small E-R diagram: rectangles for student and course, a diamond for enrolls, ovals for attributes."]
      },
      {
        title: "Object-based data model",
        pages: 0.75,
        see: ["1.3#object"],
        points: [
          "Extends the relational model with <strong>objects</strong>, <strong>methods</strong>, <strong>encapsulation</strong> and <strong>inheritance</strong>.",
          "Suits complex data such as multimedia, CAD and engineering designs.",
          "Give an example class with attributes and a method, and a subclass that inherits from it."
        ],
        draw: ["A class box for person with a subclass student that inherits its attributes."]
      },
      {
        title: "Semi-structured data model",
        pages: 0.5,
        see: ["1.3#semi"],
        points: [
          "Items of the same type may have different sets of attributes.",
          "XML and JSON are the common languages; used for data exchange between applications."
        ],
        example: ["Two JSON objects for students, where one has a phone number and the other does not."]
      },
      {
        title: "Comparison and conclusion",
        pages: 0.5,
        see: ["1.3#compare"],
        points: [
          "Compare the models in a table, then end with one or two sentences: the relational model is the most used today, and the others suit special needs."
        ],
        table: ["Models compared: structure, how relationships are shown, many-to-many support, ease of use, example product. At least four rows."]
      }
    ]
  };

  D.outlines["u1-b3"] = {
    aim: "A large, neatly labelled diagram of the overall database system structure is the heart of this answer. Then explain every box in it: the users, the query processor and its parts, the storage manager and its parts, and the disk storage. Add the two-tier and three-tier architectures for full marks.",
    sections: [
      {
        title: "Introduction",
        pages: 0.25,
        see: ["1.4#overview"],
        points: [
          "Say that a database system is divided into modules, each with one job, and that the two main parts are the <strong>query processor</strong> and the <strong>storage manager</strong>."
        ]
      },
      {
        title: "The overall structure diagram",
        pages: 1.25,
        see: ["1.4#overview", "1.4#try"],
        points: [
          "Draw the diagram across a full page so that every label is readable.",
          "After the diagram, explain the flow of one query from the user down to the disk and back."
        ],
        draw: ["Structure of a database system, top to bottom: users (naive users, application programmers, sophisticated users, DBA) and their tools; the query processor (DML compiler and organizer, DDL interpreter, query evaluation engine); the storage manager (authorization and integrity manager, transaction manager, file manager, buffer manager); disk storage (data files, data dictionary, indices, statistical data). Use arrows to show the flow."]
      },
      {
        title: "Database users and the DBA",
        pages: 0.75,
        see: ["1.4#users"],
        points: [
          "<strong>Naive users</strong>: use ready-made application interfaces (an ATM, a railway booking form).",
          "<strong>Application programmers</strong>: write the application programs.",
          "<strong>Sophisticated users</strong>: write their own queries with query tools.",
          "<strong>Database administrator (DBA)</strong>: defines the schema, decides storage structures, grants access, does backups and routine maintenance."
        ]
      },
      {
        title: "Query processor components",
        pages: 0.75,
        see: ["1.4#query-processor"],
        points: [
          "<strong>DDL interpreter</strong>: reads DDL statements and records the definitions in the data dictionary.",
          "<strong>DML compiler</strong>: translates a DML query into a low-level evaluation plan, and does <strong>query optimization</strong> to choose the cheapest plan.",
          "<strong>Query evaluation engine</strong>: runs the plan."
        ],
        example: ["Follow a SELECT query through the three parts."]
      },
      {
        title: "Storage manager components",
        pages: 1,
        see: ["1.4#storage-manager"],
        points: [
          "<strong>Authorization and integrity manager</strong>: checks access rights and integrity constraints.",
          "<strong>Transaction manager</strong>: keeps the database consistent after failures and controls concurrent transactions.",
          "<strong>File manager</strong>: allocates space on disk and manages the files.",
          "<strong>Buffer manager</strong>: brings data from disk into main memory and decides what to keep in memory."
        ],
        table: ["Component, its job and an example of when it acts. One row for each of the four components."]
      },
      {
        title: "Disk storage",
        pages: 0.5,
        see: ["1.4#disk"],
        points: [
          "<strong>Data files</strong> hold the database itself.",
          "<strong>Data dictionary</strong> holds metadata, such as the schema and constraints.",
          "<strong>Indices</strong> give fast access to records.",
          "<strong>Statistical data</strong> is used by the query optimizer."
        ]
      },
      {
        title: "Two-tier and three-tier architectures",
        pages: 0.5,
        see: ["1.4#tiers"],
        points: [
          "Two-tier: the client application talks directly to the database server.",
          "Three-tier: the client talks to an application server, which talks to the database. Used by web applications; better security and scaling."
        ],
        draw: ["Two side-by-side diagrams: user, application, database system (two-tier); user, application client, application server, database system (three-tier)."]
      },
      {
        title: "Conclusion",
        pages: 0.25,
        points: [
          "Sum up how the query processor and storage manager work together so that users get correct results quickly and safely."
        ]
      }
    ]
  };

  D.outlines["u1-b4"] = {
    aim: "Explain the relational model through its terminology, keys and integrity constraints, using one sample relation throughout. The examiner looks for exact definitions, a labelled table diagram, the properties of a relation, every key type with an example, and the integrity rules with SQL.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["1.5#what", "1.5#tables"],
        points: [
          "Proposed by E. F. Codd in 1970; data is stored as relations (tables).",
          "Explain why it is the most widely used model: simple, based on set theory, works with SQL."
        ]
      },
      {
        title: "Relational model terminology",
        pages: 1.25,
        see: ["1.6#terms", "1.6#definitions"],
        points: [
          "Define each term with the sample table: <strong>relation</strong>, <strong>tuple</strong>, <strong>attribute</strong>, <strong>domain</strong> (and atomic values), <strong>relation schema</strong>, <strong>relation instance</strong>, <strong>degree</strong>, <strong>cardinality</strong> and <strong>NULL</strong>.",
          "Write the schema in the standard form, such as Staff(StaffID, Name, Sex, Designation, Salary, DOJ)."
        ],
        draw: ["A relation drawn as a table, with arrows labelling the relation name, an attribute (column), a tuple (row), the degree and the cardinality."],
        table: ["Formal term, table term and file term: relation, table, file; tuple, row, record; attribute, column, field."]
      },
      {
        title: "Worked example",
        pages: 0.5,
        see: ["1.6#worked"],
        points: [
          "Count the degree and cardinality of the Staff table and list its attributes and the domain of each."
        ],
        example: ["The Staff table from the topic page, with three tuples."]
      },
      {
        title: "Properties of a relation",
        pages: 0.5,
        see: ["1.6#properties"],
        points: [
          "Each relation has a distinct name; each attribute has a distinct name; values are atomic; no two tuples are identical; the order of tuples and of attributes does not matter."
        ]
      },
      {
        title: "Keys",
        pages: 1.25,
        see: ["1.7#super-key", "1.7#candidate-key", "1.7#primary-key", "1.7#composite-key", "1.7#foreign-key", "1.7#relation"],
        points: [
          "Define each key with an example from one table, such as student(roll_no, reg_no, email, name, dept_id): <strong>super key</strong>, <strong>candidate key</strong> (minimal super key), <strong>primary key</strong>, <strong>alternate key</strong>, <strong>composite key</strong> and <strong>foreign key</strong>.",
          "State the link: every candidate key is a super key, but not every super key is a candidate key."
        ],
        draw: ["Nested sets: super keys contain candidate keys, which contain the primary key and alternate keys."],
        table: ["Student and department tables, with an arrow from the foreign key dept_id to the primary key of department."]
      },
      {
        title: "Integrity constraints",
        pages: 1,
        see: ["1.8#what", "1.8#domain", "1.8#key", "1.8#column", "1.8#entity", "1.8#referential"],
        points: [
          "Define an integrity constraint: a rule the data must always satisfy.",
          "<strong>Domain constraint</strong>, <strong>key constraint</strong>, NOT NULL, UNIQUE, CHECK and DEFAULT.",
          "<strong>Entity integrity</strong>: a primary key can never be NULL.",
          "<strong>Referential integrity</strong>: a foreign key value must match a primary key value in the parent table or be NULL; explain ON DELETE CASCADE and SET NULL.",
          "Show one example of an insert or delete that each rule rejects."
        ],
        example: ["A CREATE TABLE statement with PRIMARY KEY, NOT NULL, CHECK and a FOREIGN KEY ... REFERENCES clause."]
      },
      {
        title: "Conclusion",
        pages: 0.25,
        points: [
          "Sum up: relations, keys and integrity constraints together keep the data simple to use, unique and correct."
        ]
      }
    ]
  };

  D.outlines["u1-b5"] = {
    aim: "Define relational algebra and explain every operation with its symbol, its notation and a worked example on small sample relations, showing the result table each time. The fundamental operations must all be there; the additional operations (intersection, joins, division, assignment) earn the top marks.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["1.9#what"],
        points: [
          "Define relational algebra: a <strong>procedural</strong> query language; each operation takes one or two relations and gives a new relation, so operations can be combined.",
          "Classify the operations: unary and binary; fundamental and additional."
        ]
      },
      {
        title: "Sample relations",
        pages: 0.5,
        see: ["1.9#sample"],
        points: [
          "Write two or three small relations at the start and use them for every example, so the examiner can follow each result."
        ],
        table: ["Student(sid, sname, age, city), Reserve(sid, isbn) and Book(isbn, bname), with three or four tuples each."]
      },
      {
        title: "Select and project",
        pages: 0.75,
        see: ["1.9#select", "1.9#project"],
        points: [
          "<strong>Select σ</strong>: picks rows that satisfy a predicate; give the notation σ<sub>predicate</sub>(r) and the comparison and logical operators allowed.",
          "<strong>Project π</strong>: picks columns and removes duplicate rows.",
          "Combine them: the names of students from Salem."
        ],
        example: ["σ<sub>city = 'Salem'</sub>(Student) and π<sub>sname</sub>(σ<sub>age &gt; 18</sub>(Student)), each with its result table."]
      },
      {
        title: "Set operations: union, intersection and set difference",
        pages: 0.75,
        see: ["1.9#set-ops"],
        points: [
          "Explain <strong>union compatibility</strong>: same number of attributes and matching domains.",
          "Union ∪, intersection ∩ and set difference −, each with a result; point out that r − s is not the same as s − r."
        ],
        draw: ["Venn diagrams for union, intersection and difference."]
      },
      {
        title: "Cartesian product and rename",
        pages: 0.75,
        see: ["1.9#product", "1.9#rename"],
        points: [
          "<strong>Cartesian product ×</strong>: pairs every tuple of r with every tuple of s; degree adds and cardinality multiplies.",
          "<strong>Rename ρ</strong>: gives a name to a relation or its attributes; needed when a relation is joined with itself."
        ],
        example: ["Student × Reserve on a small part of the data, showing the number of result rows."]
      },
      {
        title: "Joins",
        pages: 1,
        see: ["1.9#joins", "1.9#outer"],
        points: [
          "<strong>Theta join</strong> = σ<sub>θ</sub>(r × s); <strong>equijoin</strong> uses only equality; <strong>natural join</strong> ⋈ matches common attributes and keeps them once.",
          "<strong>Outer joins</strong>: left ⟕, right ⟖ and full ⟗ keep unmatched tuples and fill the gaps with NULL."
        ],
        example: ["Student ⋈ Reserve, and Student ⟕ Reserve showing a student with no reservation and NULL in isbn."]
      },
      {
        title: "Division and assignment",
        pages: 0.5,
        see: ["1.9#division", "1.9#assignment"],
        points: [
          "<strong>Division ÷</strong> answers \"for all\" queries, such as students who reserved every book.",
          "<strong>Assignment ←</strong> stores a partial result in a temporary relation."
        ],
        example: ["Reserve ÷ π<sub>isbn</sub>(Book), with the steps."]
      },
      {
        title: "Summary table and conclusion",
        pages: 0.5,
        see: ["1.9#try"],
        points: [
          "List every operation with its symbol, type and purpose, then end with one sentence on why relational algebra matters: it is the basis of SQL and of query optimization."
        ],
        table: ["Operation, symbol, unary or binary, what it does: at least ten rows."]
      }
    ]
  };

  D.outlines["u1-b6"] = {
    aim: "Explain the SELECT-FROM-WHERE structure and how SQL runs it, then show DDL and DML commands with correct syntax and a working example on one table. The examiner expects the general syntax of each command, a real statement, and the table before and after.",
    sections: [
      {
        title: "Introduction to SQL and its parts",
        pages: 0.5,
        see: ["1.10#what", "1.10#parts"],
        points: [
          "Define SQL: the standard, declarative language of relational databases.",
          "List its parts: DDL, DML, DCL and TCL, with two commands each."
        ],
        table: ["Part of SQL, purpose, commands."]
      },
      {
        title: "Basic structure of an SQL query",
        pages: 1,
        see: ["1.11#structure", "1.11#select", "1.11#where", "1.11#multiple", "1.11#order-by"],
        points: [
          "General form: SELECT A1, A2 ... FROM r1, r2 ... WHERE P.",
          "Explain each clause and its link to relational algebra: SELECT is π, FROM is ×, WHERE is σ.",
          "DISTINCT, the * symbol, AND, OR, NOT, BETWEEN, IN and LIKE.",
          "ORDER BY with ASC and DESC; queries on two tables with a join condition."
        ],
        example: ["Three queries on the student table: all CSE students, names of students with marks above 80 ordered by marks, and a two-table query with a join condition."]
      },
      {
        title: "Order in which the clauses run",
        pages: 0.25,
        see: ["1.11#order-of-evaluation"],
        points: [
          "FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY."
        ],
        draw: ["A flow of boxes from FROM to ORDER BY."]
      },
      {
        title: "DDL commands",
        pages: 1.25,
        see: ["1.12#create", "1.12#constraints", "1.12#alter", "1.12#drop", "1.12#truncate", "1.12#rename"],
        points: [
          "<strong>CREATE TABLE</strong>: syntax, data types and constraints (PRIMARY KEY, NOT NULL, UNIQUE, CHECK, FOREIGN KEY).",
          "<strong>ALTER TABLE</strong>: ADD a column, MODIFY a column, DROP COLUMN, add a constraint.",
          "<strong>DROP</strong>, <strong>TRUNCATE</strong> and <strong>RENAME</strong>, each with one statement.",
          "Note that DDL is auto-committed and cannot be rolled back."
        ],
        example: ["CREATE TABLE student (...) with four or five columns and constraints, then two ALTER TABLE statements on it."]
      },
      {
        title: "DML commands",
        pages: 1.25,
        see: ["1.13#insert", "1.13#update", "1.13#delete", "1.13#select", "1.13#worked"],
        points: [
          "<strong>INSERT</strong>: one row, many rows, and INSERT ... SELECT.",
          "<strong>UPDATE ... SET ... WHERE</strong>: warn what happens without WHERE.",
          "<strong>DELETE FROM ... WHERE</strong>: and DELETE without WHERE.",
          "<strong>SELECT</strong>: show the result of each change.",
          "Mention COMMIT and ROLLBACK for DML."
        ],
        table: ["The student table after INSERT, after UPDATE and after DELETE, so the examiner sees each change."]
      },
      {
        title: "DDL compared with DML",
        pages: 0.5,
        see: ["1.12#ddl-vs-dml", "1.12#truncate"],
        points: [
          "Compare by purpose, commands, effect, rollback and examples. Add DELETE, TRUNCATE and DROP compared."
        ],
        table: ["DDL compared with DML: five rows.", "DELETE, TRUNCATE and DROP compared: what is removed, WHERE allowed, rollback possible."]
      },
      {
        title: "Conclusion",
        pages: 0.25,
        points: [
          "Sum up: DDL defines the structure, DML works on the data, and the SELECT-FROM-WHERE block is the basis of every query."
        ]
      }
    ]
  };
})();
