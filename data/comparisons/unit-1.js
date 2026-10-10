/* Unit I comparisons, shown on comparisons/unit-1.html.
   Each item lists its topics (the first one decides where it sits on the page) and
   its tables. A table is either copied from a topic page, { from: topic, ref: element id },
   or written here, { caption, head, rows }; the first cell of each row is its heading.
   syntax holds code shown side by side. After you change this file, run
   node tools/build-comparisons.mjs. tools/check.mjs fails if the pages are out of date. */
window.DBMS = window.DBMS || {};

DBMS.comparisons = (DBMS.comparisons || []).concat([
  {
    id: "file-system-vs-database",
    topics: ["1.1"],
    title: "File-processing system and database system",
    keywords: "file system dbms advantages vs difference",
    summary: "A file-processing system keeps data in separate files owned by separate programs; a database system keeps it once, under one DBMS that controls access to it.",
    tables: [{ from: "1.1", ref: "cmp-file-vs-db" }],
    tip: "This table is also the answer to “advantages of a DBMS”. Each row of the database column is one advantage.",
    questions: ["u1-a1", "u1-a2", "u1-b1"]
  },
  {
    id: "schema-vs-instance",
    topics: ["1.2"],
    title: "Schema and instance",
    keywords: "intension extension database state structure vs difference",
    summary: "The schema is the design of the database and rarely changes; the instance is the data stored in it at one moment and changes all the time.",
    tables: [{
      caption: "Schema and instance",
      head: ["Basis", "Schema", "Instance"],
      rows: [
        ["Meaning", "The overall design (structure) of the database", "The data stored in the database at one moment"],
        ["Other names", "Intension, database structure", "Extension, database state, snapshot"],
        ["How often it changes", "Rarely, and only by the designer", "All the time, with every insert, update and delete"],
        ["Defined with", "DDL (<code>CREATE TABLE</code>, <code>ALTER TABLE</code>)", "DML (<code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>)"],
        ["Kinds", "Physical schema, logical schema and subschemas (views)", "One current instance"],
        ["Programming idea", "Like a variable's type", "Like the variable's value"],
        ["Example", "student(roll_no, name, city)", "The rows (1, Anitha, Salem) and (2, Bharath, Chennai) at 10 a.m. today"]
      ]
    }],
    syntax: [
      { label: "Schema (DDL)", code: "CREATE TABLE student (\n  roll_no INT PRIMARY KEY,\n  name    VARCHAR(30),\n  city    VARCHAR(20)\n);" },
      { label: "Instance changes (DML)", code: "INSERT INTO student\nVALUES (3, 'Charan', 'Salem');\n-- The schema is the same;\n-- the instance now has one more row." }
    ],
    read: ["1.2#schema"],
    questions: ["u1-b1"]
  },
  {
    id: "data-independence",
    topics: ["1.2"],
    title: "Physical and logical data independence",
    keywords: "data independence levels mapping vs difference",
    summary: "Physical data independence hides changes in storage from the logical level; logical data independence hides changes in the logical schema from the views.",
    tables: [{ from: "1.2", ref: "cmp-data-independence" }],
    tip: "“Physical changes do not reach the logical level; logical changes do not reach the views.” Write this line, then give one example change for each.",
    questions: ["u1-a5", "u1-b1"]
  },
  {
    id: "data-models",
    topics: ["1.3"],
    title: "Data models: relational, E-R, object-based, semi-structured, hierarchical and network",
    keywords: "types of data models vs difference",
    summary: "Each data model describes data, relationships and constraints in its own way: as tables, entities, objects, tagged documents, a tree or a graph.",
    tables: [
      {
        caption: "The six data models at a glance",
        head: ["Model", "Data is kept as", "Relationships through", "Query style", "Example system"],
        rows: [
          ["Relational", "Tables (relations) of rows and columns", "Common values (keys)", "Declarative SQL", "MySQL, Oracle, PostgreSQL"],
          ["Entity-relationship (E-R)", "Entities with attributes, drawn as a diagram", "Relationship sets", "None; a design model, mapped to tables", "Used on paper and in design tools"],
          ["Object-based", "Objects with attributes and methods", "Object references and inheritance", "Object query languages or SQL with object types", "PostgreSQL types, db4o"],
          ["Semi-structured", "Tagged documents (XML, JSON); each item can have different fields", "Nesting and references", "XPath, XQuery or a document query language", "MongoDB, XML databases"],
          ["Hierarchical", "Records in a tree; each child has one parent", "Parent-child pointers", "Navigate the tree", "IBM IMS"],
          ["Network", "Records in a graph; a child can have many parents", "Pointers (owner-member sets)", "Navigate the pointers", "IDMS"]
        ]
      },
      { from: "1.3", ref: "cmp-models-compared" }
    ],
    tip: "For the 16-mark question, give one small example for each model, then end with these tables.",
    questions: ["u1-a6", "u1-b2"]
  },
  {
    id: "two-tier-vs-three-tier",
    topics: ["1.4"],
    title: "Two-tier and three-tier architecture",
    keywords: "2-tier 3-tier client server application server vs difference",
    summary: "In two-tier, the client talks to the database directly; in three-tier, an application server sits between the client and the database.",
    tables: [{ from: "1.4", ref: "cmp-two-three-tier" }],
    tip: "Draw both diagrams side by side: user, application, database system (two-tier); user, application client, application server, database system (three-tier).",
    questions: ["u1-b3"]
  },
  {
    id: "types-of-keys",
    topics: ["1.7"],
    title: "Super key, candidate key, primary key, alternate key, composite key and foreign key",
    keywords: "keys types superkey candidate primary alternate composite foreign vs difference",
    summary: "Every primary key is a candidate key, every candidate key is a super key, and a foreign key points to the primary key of another table.",
    tables: [{
      caption: "The keys of Student(RegNo, RollNo, Dept, Name, Email) and Marks(RegNo, CourseID, Marks)",
      head: ["Key", "Meaning", "How many per table", "Example", "SQL"],
      rows: [
        ["Super key", "Any set of attributes that identifies each tuple uniquely; it need not be minimal", "Many", "{RegNo}, {RegNo, Name}", "Not declared"],
        ["Candidate key", "A minimal super key: no attribute can be removed", "One or more", "{RegNo}, {Email}, {RollNo, Dept}", "Not declared as such"],
        ["Primary key", "The candidate key chosen to identify tuples; never NULL", "Exactly one", "{RegNo}", "<code>PRIMARY KEY</code>"],
        ["Alternate key", "A candidate key that was not chosen as the primary key", "Zero or more", "{Email}, {RollNo, Dept}", "<code>UNIQUE</code> (with <code>NOT NULL</code>)"],
        ["Composite key", "A key made of two or more attributes", "Any key above can be composite", "{RollNo, Dept}; {RegNo, CourseID} in Marks", "<code>PRIMARY KEY (a, b)</code>"],
        ["Foreign key", "Attributes that refer to the primary key of another (or the same) table; may be NULL", "Zero or more", "RegNo in Marks refers to Student", "<code>FOREIGN KEY ... REFERENCES</code>"]
      ]
    }],
    syntax: [
      { label: "Primary, alternate and composite keys", code: "CREATE TABLE student (\n  reg_no  CHAR(10) PRIMARY KEY,\n  roll_no INT NOT NULL,\n  dept    VARCHAR(5) NOT NULL,\n  name    VARCHAR(30) NOT NULL,\n  -- alternate key:\n  email   VARCHAR(40) NOT NULL UNIQUE,\n  -- composite alternate key:\n  UNIQUE (roll_no, dept)\n);" },
      { label: "Composite primary key and foreign keys", code: "CREATE TABLE marks (\n  reg_no    CHAR(10),\n  course_id CHAR(5),\n  marks     INT,\n  PRIMARY KEY (reg_no, course_id),\n  FOREIGN KEY (reg_no)\n    REFERENCES student (reg_no),\n  FOREIGN KEY (course_id)\n    REFERENCES course (course_id)\n);" }
    ],
    tip: "Draw the keys as nested circles: super keys outside, candidate keys inside them, and the primary key in the middle.",
    read: ["1.7#super-key", "1.7#candidate-key", "1.7#primary-key", "1.7#composite-key", "1.7#foreign-key"],
    questions: ["u1-a11"]
  },
  {
    id: "primary-key-vs-foreign-key",
    topics: ["1.7"],
    title: "Primary key and foreign key",
    keywords: "pk fk primary foreign key referential vs difference",
    summary: "A primary key identifies each row of its own table; a foreign key in another table refers to that primary key and links the two tables.",
    tables: [{
      caption: "Primary key and foreign key",
      head: ["Basis", "Primary key", "Foreign key"],
      rows: [
        ["Purpose", "Identifies each tuple of its own table uniquely", "Links a tuple to a tuple of another (parent) table"],
        ["Unique values", "Yes, always", "No; many child rows can hold the same value"],
        ["NULL", "Never allowed", "Allowed, unless declared NOT NULL"],
        ["Number per table", "Exactly one (it may be composite)", "Zero, one or many"],
        ["Table it lives in", "The parent (referenced) table", "The child (referencing) table"],
        ["Rule it enforces", "Entity integrity", "Referential integrity"],
        ["Value comes from", "Chosen for each new row", "Must already exist in the parent's primary key (or be NULL)"],
        ["Deleting a row", "A parent row that is still referenced cannot be deleted, unless ON DELETE CASCADE or SET NULL is given", "A child row can be deleted freely"],
        ["Index", "Created automatically", "MySQL (InnoDB) creates one if none exists"],
        ["Example", "course_id in Course", "course_id in Marks"]
      ]
    }],
    syntax: [
      { label: "Primary key (parent)", code: "CREATE TABLE course (\n  course_id CHAR(5) PRIMARY KEY,\n  title     VARCHAR(40)\n);" },
      { label: "Foreign key (child)", code: "CREATE TABLE marks (\n  reg_no    CHAR(10),\n  course_id CHAR(5),\n  marks     INT,\n  FOREIGN KEY (course_id)\n    REFERENCES course (course_id)\n    ON DELETE CASCADE\n);" }
    ],
    read: ["1.7#primary-key", "1.7#foreign-key"],
    questions: ["u2-a2", "u1-a11"]
  },
  {
    id: "primary-key-vs-unique",
    topics: ["1.8", "1.7"],
    title: "PRIMARY KEY and UNIQUE constraints",
    keywords: "primary key unique constraint null vs difference",
    summary: "Both stop duplicate values, but a table has only one PRIMARY KEY and it never holds NULL, while it can have many UNIQUE constraints that allow NULL.",
    tables: [{
      caption: "PRIMARY KEY and UNIQUE",
      head: ["Basis", "PRIMARY KEY", "UNIQUE"],
      rows: [
        ["Duplicates", "Not allowed", "Not allowed"],
        ["NULL", "Not allowed (the columns become NOT NULL)", "Allowed; in MySQL many rows may hold NULL"],
        ["Number per table", "Only one", "Many"],
        ["Used for", "The primary key", "Alternate keys, such as an email or a phone number"],
        ["Can a foreign key refer to it?", "Yes; this is the usual case", "Yes, in MySQL, but referring to the primary key is the normal practice"],
        ["Index in MySQL (InnoDB)", "The clustered index; rows are stored in its order", "A separate secondary index"],
        ["Syntax", "<code>col INT PRIMARY KEY</code>", "<code>col VARCHAR(40) UNIQUE</code>"]
      ]
    }],
    syntax: [
      { label: "Column level", code: "CREATE TABLE student (\n  reg_no CHAR(10)    PRIMARY KEY,\n  email  VARCHAR(40) UNIQUE,\n  phone  CHAR(10)    UNIQUE\n);" },
      { label: "Table level, with names", code: "CREATE TABLE student (\n  reg_no CHAR(10),\n  email  VARCHAR(40),\n  CONSTRAINT pk_student\n    PRIMARY KEY (reg_no),\n  CONSTRAINT uq_email\n    UNIQUE (email)\n);" },
      { label: "What happens", code: "INSERT INTO student (reg_no, email)\n  VALUES (NULL, 'a@kiot.in');\n-- Error: reg_no cannot be NULL\n\nINSERT INTO student (reg_no, email)\n  VALUES ('7110231001', NULL);\n-- OK: UNIQUE allows NULL" }
    ],
    read: ["1.8#column", "1.7#primary-key"],
    questions: ["u1-a16"]
  },
  {
    id: "entity-vs-referential-integrity",
    topics: ["1.8"],
    title: "Entity integrity and referential integrity",
    keywords: "integrity constraints entity referential foreign key vs difference",
    summary: "Entity integrity: a primary key is never NULL. Referential integrity: a foreign key matches a primary key value in the parent table, or is NULL.",
    tables: [{
      caption: "Entity integrity and referential integrity",
      head: ["Basis", "Entity integrity", "Referential integrity"],
      rows: [
        ["Rule", "No attribute of a primary key can be NULL", "A foreign key value must match a primary key value in the parent table, or be NULL"],
        ["Tables involved", "One table", "Two tables (or one table that refers to itself)"],
        ["Declared with", "<code>PRIMARY KEY</code>", "<code>FOREIGN KEY ... REFERENCES</code>"],
        ["Protects against", "Rows that cannot be identified", "Child rows that point to a parent that does not exist (orphan rows)"],
        ["Checked on", "INSERT and UPDATE of the table", "INSERT and UPDATE of the child; UPDATE and DELETE of the parent"],
        ["On a violation", "The statement is rejected", "The statement is rejected, or the change is passed on with CASCADE, SET NULL or RESTRICT"],
        ["Example", "A student row with no register number is rejected", "Marks for course CS999 are rejected when Course has no CS999"]
      ]
    }],
    syntax: [
      { label: "Entity integrity", code: "CREATE TABLE customer (\n  cust_id INT PRIMARY KEY,\n  name    VARCHAR(30)\n);\nINSERT INTO customer\n  VALUES (NULL, 'Ravi');\n-- Error: cust_id cannot be NULL" },
      { label: "Referential integrity", code: "CREATE TABLE orders (\n  order_id INT PRIMARY KEY,\n  cust_id  INT,\n  FOREIGN KEY (cust_id)\n    REFERENCES customer (cust_id)\n    ON DELETE SET NULL\n);\nINSERT INTO orders VALUES (1, 99);\n-- Error if there is no\n-- customer 99" }
    ],
    read: ["1.8#entity", "1.8#referential"],
    questions: ["u1-a10", "u1-b4"]
  },
  {
    id: "select-vs-project",
    topics: ["1.9"],
    title: "Selection (σ) and projection (π)",
    keywords: "select project sigma pi rows columns relational algebra vs difference",
    summary: "Selection picks rows that satisfy a condition; projection picks columns and removes duplicate rows.",
    tables: [{
      caption: "Selection and projection",
      head: ["Basis", "Selection (σ)", "Projection (π)"],
      rows: [
        ["Picks", "Tuples (rows)", "Attributes (columns)"],
        ["Needs", "A condition (predicate)", "A list of attributes"],
        ["Notation", "σ<sub>condition</sub>(r)", "π<sub>A1, A2</sub>(r)"],
        ["Degree of the result (columns)", "Same as r", "The number of attributes listed"],
        ["Cardinality of the result (rows)", "Same as r or fewer", "Same as r or fewer, because duplicates are removed"],
        ["Duplicates", "Cannot appear (r has none)", "Removed, because a relation is a set"],
        ["Commutative?", "Yes: σ<sub>c1</sub>(σ<sub>c2</sub>(r)) = σ<sub>c2</sub>(σ<sub>c1</sub>(r))", "No; the outer list must be part of the inner list"],
        ["SQL part", "<code>WHERE</code>", "The column list after <code>SELECT</code> (with <code>DISTINCT</code>)"],
        ["Example", "σ<sub>age &gt; 18</sub>(Student)", "π<sub>city</sub>(Student)"]
      ]
    }],
    syntax: [
      { label: "Relational algebra", code: "σ age > 18 (Student)\n\nπ city (Student)\n\nπ sname (σ city = 'Salem' (Student))" },
      { label: "SQL", code: "SELECT * FROM Student WHERE age > 18;\n\nSELECT DISTINCT city FROM Student;\n\nSELECT sname FROM Student\nWHERE city = 'Salem';" }
    ],
    tip: "SQL's SELECT keyword does projection, not selection. Selection is the WHERE clause.",
    read: ["1.9#select", "1.9#project"],
    questions: ["u1-a13", "u1-b5"]
  },
  {
    id: "relational-algebra-joins",
    topics: ["1.9"],
    title: "Theta join, equijoin, natural join and outer joins",
    keywords: "join theta equi natural outer left right full relational algebra vs difference",
    summary: "All joins combine related tuples of two relations; they differ in the condition they use and in what they do with tuples that have no match.",
    tables: [{
      caption: "Joins in relational algebra",
      head: ["Join", "Notation", "Condition", "Common attributes in the result", "Unmatched tuples", "SQL"],
      rows: [
        ["Theta join", "r ⋈<sub>θ</sub> s", "Any comparison: =, ≠, &lt;, ≤, &gt;, ≥", "Both copies kept", "Dropped", "<code>JOIN ... ON r.a &lt; s.b</code>"],
        ["Equijoin", "r ⋈<sub>r.a = s.a</sub> s", "Only =", "Both copies kept", "Dropped", "<code>JOIN ... ON r.a = s.a</code>"],
        ["Natural join", "r ⋈ s", "None written; equal values in all attributes with the same name", "Kept once", "Dropped", "<code>NATURAL JOIN</code>"],
        ["Left outer join", "r ⟕ s", "As in the join", "Kept once (natural) or both", "Kept from r, padded with NULL", "<code>LEFT JOIN</code>"],
        ["Right outer join", "r ⟖ s", "As in the join", "Kept once (natural) or both", "Kept from s, padded with NULL", "<code>RIGHT JOIN</code>"],
        ["Full outer join", "r ⟗ s", "As in the join", "Kept once (natural) or both", "Kept from both, padded with NULL", "No FULL JOIN in MySQL; use LEFT JOIN UNION RIGHT JOIN"]
      ]
    }],
    syntax: [
      { label: "Relational algebra", code: "Student ⋈ Student.sid = Reserve.sid\n  Reserve\n\nReserve ⋈ Book\n\nEmp ⟕ Dept" },
      { label: "SQL (MySQL)", code: "SELECT * FROM Student\nJOIN Reserve\n  ON Student.sid = Reserve.sid;\n\nSELECT * FROM Reserve\nNATURAL JOIN Book;\n\nSELECT * FROM Emp\nLEFT JOIN Dept ON Emp.dno = Dept.dno;" }
    ],
    tip: "Theta join, equijoin and natural join are all inner joins. Say this in one line, then show the NULL-padded rows of an outer join.",
    read: ["1.9#joins", "1.9#outer"],
    questions: ["u1-b5"]
  },
  {
    id: "relational-algebra-vs-sql",
    topics: ["1.9", "1.11"],
    title: "Relational algebra and SQL",
    keywords: "relational algebra sql procedural declarative vs difference",
    summary: "Relational algebra is a procedural set of operators on relations used inside the DBMS; SQL is the declarative language that users write.",
    tables: [
      {
        caption: "Relational algebra and SQL",
        head: ["Basis", "Relational algebra", "SQL"],
        rows: [
          ["Kind of language", "Procedural: says how to get the result, step by step", "Declarative (non-procedural): says what result is wanted"],
          ["Used by", "The DBMS, to plan and optimize queries", "Users and application programs"],
          ["Works on", "Relations (sets), so duplicates are removed", "Tables (multisets), so duplicates are kept unless DISTINCT is used"],
          ["Operators", "σ, π, ∪, ∩, −, ×, ρ, ⋈, ÷", "SELECT, FROM, WHERE, JOIN, UNION, GROUP BY and more"],
          ["Changes data?", "No, it only queries", "Yes: INSERT, UPDATE, DELETE, and DDL too"],
          ["Aggregates and sorting", "Not in the basic operators", "COUNT, SUM, AVG, ORDER BY"]
        ]
      },
      {
        caption: "Each relational algebra operator and its SQL form",
        head: ["Operator", "Relational algebra", "SQL"],
        rows: [
          ["Selection", "σ<sub>city = 'Salem'</sub>(Student)", "<code>WHERE city = 'Salem'</code>"],
          ["Projection", "π<sub>sname</sub>(Student)", "<code>SELECT DISTINCT sname</code>"],
          ["Cartesian product", "Student × Reserve", "<code>FROM Student, Reserve</code> or <code>CROSS JOIN</code>"],
          ["Natural join", "Reserve ⋈ Book", "<code>Reserve NATURAL JOIN Book</code>"],
          ["Union", "r ∪ s", "<code>UNION</code>"],
          ["Intersection", "r ∩ s", "<code>INTERSECT</code> (MySQL 8.0.31 and later)"],
          ["Set difference", "r − s", "<code>EXCEPT</code> (MINUS in Oracle)"],
          ["Rename", "ρ<sub>S</sub>(Student)", "<code>Student AS S</code>"]
        ]
      }
    ],
    syntax: [
      { label: "Relational algebra", code: "π sname (σ bname = 'DBMS'\n  (Student ⋈ Reserve ⋈ Book))" },
      { label: "SQL", code: "SELECT DISTINCT s.sname\nFROM Student s\nNATURAL JOIN Reserve\nNATURAL JOIN Book\nWHERE bname = 'DBMS';" }
    ],
    read: ["1.9#what", "1.11#structure"],
    questions: ["u1-a12", "u1-b5"]
  },
  {
    id: "ddl-dml-dcl-tcl",
    topics: ["1.10"],
    title: "DDL, DML, DCL and TCL",
    keywords: "parts of sql commands data definition manipulation control transaction vs difference",
    summary: "DDL defines the structure, DML works on the rows, DCL gives and takes away access rights, and TCL ends or undoes transactions.",
    tables: [{ from: "1.10", ref: "cmp-sql-parts" }],
    syntax: [
      { label: "DDL", code: "CREATE TABLE student (\n  roll_no INT PRIMARY KEY,\n  name    VARCHAR(30)\n);\nALTER TABLE student\n  ADD city VARCHAR(20);" },
      { label: "DML", code: "INSERT INTO student\n  VALUES (1, 'Anitha', 'Salem');\nUPDATE student SET city = 'Erode'\n  WHERE roll_no = 1;\nSELECT * FROM student;" },
      { label: "DCL", code: "GRANT SELECT, INSERT\n  ON college.student\n  TO 'clerk'@'localhost';\nREVOKE INSERT\n  ON college.student\n  FROM 'clerk'@'localhost';" },
      { label: "TCL", code: "START TRANSACTION;\nUPDATE student SET city = 'Salem'\n  WHERE roll_no = 1;\nSAVEPOINT sp1;\nDELETE FROM student;\nROLLBACK TO sp1;\nCOMMIT;" }
    ],
    tip: "Memory aid: DDL is the shape, DML is the data, DCL is the door (who may enter) and TCL is the save button.",
    read: ["1.10#parts"],
    questions: ["u1-a14", "u3-a12"]
  },
  {
    id: "char-vs-varchar",
    topics: ["1.10"],
    title: "CHAR and VARCHAR",
    keywords: "char varchar data types fixed variable length string vs difference",
    summary: "CHAR(n) always takes n characters, padded with spaces; VARCHAR(n) takes only as many characters as the value needs, up to n.",
    tables: [{
      caption: "CHAR and VARCHAR in MySQL",
      head: ["Basis", "CHAR(n)", "VARCHAR(n)"],
      rows: [
        ["Length", "Fixed: always n characters", "Variable: up to n characters"],
        ["Storage of 'Ram' in (10)", "'Ram' plus 7 spaces", "'Ram' plus 1 length byte"],
        ["Extra bytes", "None", "1 length byte (2 if the column can be longer than 255 bytes)"],
        ["Maximum n", "255", "65,535 bytes in all for the row"],
        ["Trailing spaces", "Added when stored, removed when read", "Kept as given"],
        ["Speed", "Slightly faster to find and update, because every value has the same size", "Saves space when values vary in length"],
        ["Best for", "Values of one length: PIN code, gender code, register number", "Values that vary: names, addresses, emails"],
        ["Example", "<code>pin_code CHAR(6)</code>", "<code>name VARCHAR(30)</code>"]
      ]
    }],
    syntax: [
      { label: "CHAR", code: "CREATE TABLE t (code CHAR(5));\nINSERT INTO t VALUES ('ab');\nSELECT LENGTH(code) FROM t;\n-- 2 (the padding spaces are removed\n--    when the value is read)" },
      { label: "VARCHAR", code: "CREATE TABLE u (code VARCHAR(5));\nINSERT INTO u VALUES ('ab ');\nSELECT LENGTH(code) FROM u;\n-- 3 (the space is kept)" }
    ],
    read: ["1.10#types"]
  },
  {
    id: "ddl-vs-dml",
    topics: ["1.12", "1.13"],
    title: "DDL and DML",
    keywords: "data definition manipulation language commands vs difference",
    summary: "DDL commands create and change the structure (schema) of the database; DML commands insert, change, delete and read the rows.",
    tables: [{ from: "1.12", ref: "cmp-ddl-dml" }],
    syntax: [
      { label: "DDL: works on the structure", code: "CREATE TABLE person (\n  id   INT PRIMARY KEY,\n  name VARCHAR(30)\n);\nALTER TABLE person ADD age INT;\nTRUNCATE TABLE person;\nDROP TABLE person;" },
      { label: "DML: works on the rows", code: "INSERT INTO person\n  VALUES (1, 'Arun', 20);\nUPDATE person SET age = 21\n  WHERE id = 1;\nDELETE FROM person WHERE id = 1;\nSELECT * FROM person;" }
    ],
    tip: "For 2 marks, write the full names and three rows: works on, commands and rollback. Add one example statement for each.",
    read: ["1.13#ddl-vs-dml"],
    questions: ["u1-a15", "u1-b6"]
  },
  {
    id: "delete-truncate-drop",
    topics: ["1.12"],
    title: "DELETE, TRUNCATE and DROP",
    keywords: "delete truncate drop remove rows table vs difference",
    summary: "DELETE removes chosen rows and can be rolled back; TRUNCATE quickly removes all rows but keeps the table; DROP removes the table itself.",
    tables: [{ from: "1.12", ref: "cmp-delete-truncate-drop" }],
    syntax: [
      { label: "DELETE (DML)", code: "DELETE FROM person\nWHERE age < 18;\n-- or every row:\nDELETE FROM person;" },
      { label: "TRUNCATE (DDL)", code: "TRUNCATE TABLE person;\n-- all rows gone,\n-- the table is still there" },
      { label: "DROP (DDL)", code: "DROP TABLE person;\n-- rows and table gone;\n-- DESC person now fails" }
    ],
    read: ["1.13#delete"]
  },
  {
    id: "alter-vs-update",
    topics: ["1.12", "1.13"],
    title: "ALTER and UPDATE",
    keywords: "alter table update set modify column vs difference",
    summary: "ALTER TABLE changes the structure of a table, such as its columns; UPDATE changes the values stored in its rows.",
    tables: [{
      caption: "ALTER and UPDATE",
      head: ["Basis", "ALTER TABLE", "UPDATE"],
      rows: [
        ["Language", "DDL", "DML"],
        ["Changes", "The structure: columns, data types, constraints, table name", "The data: values in existing rows"],
        ["Rows affected", "The whole table's definition (every row gets the new column)", "Only the rows that match WHERE (all rows if WHERE is left out)"],
        ["Uses a WHERE clause", "No", "Yes"],
        ["Can be rolled back in MySQL", "No; it commits at once", "Yes, inside a transaction"],
        ["Typical forms", "ADD, MODIFY, CHANGE, RENAME COLUMN, DROP COLUMN, ADD CONSTRAINT", "SET column = value"],
        ["Example task", "Add an age column to person", "Change Arun's age to 21"]
      ]
    }],
    syntax: [
      { label: "ALTER TABLE (structure)", code: "ALTER TABLE person ADD age INT;\nALTER TABLE person\n  MODIFY name VARCHAR(50);\nALTER TABLE person\n  RENAME COLUMN age TO years;\nALTER TABLE person DROP COLUMN years;" },
      { label: "UPDATE (data)", code: "UPDATE person\nSET age = 21\nWHERE name = 'Arun';\n\nUPDATE person\nSET age = age + 1;  -- every row" }
    ],
    tip: "A common slip is writing “UPDATE TABLE”. The table keyword belongs to ALTER TABLE; UPDATE is followed directly by the table name.",
    read: ["1.12#alter", "1.13#update"],
    questions: ["u1-b6"]
  }
]);
