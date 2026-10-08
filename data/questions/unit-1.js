/* Unit I question bank items.
   Every question is mapped to its unit, never to a test or exam paper, because
   test papers change each semester.
   id: "u1-a1" is Unit I, Part A, question 1 of the unit question bank. A question
   that is not in the unit bank takes the next free number in its part, and its
   source is { bank: "Unit I", extra: true }.
   "original" keeps the source wording; "question" is the corrected wording shown
   on the site. "parts" lists the a), b) sub-questions and "include" is the hint
   printed under some 16-mark questions; both are optional. "answer" is the 2-mark
   answer (HTML), or null. "outline" links a 16-mark question to the worked answer
   on a topic page, or is null. */
(function () {
  var D = (window.DBMS = window.DBMS || {});
  D.questions = (D.questions || []).concat([
    {
      id: "u1-a1",
      unit: 1,
      part: "A",
      marks: 2,
      topics: ["1.1"],
      sources: [{ bank: "Unit I", no: 1 }],
      original: "What is the purpose of a Database Management System (DBMS)?",
      question: "What is the purpose of a database management system (DBMS)?",
      answer:
        "<p>A <strong>database management system (DBMS)</strong> is software that stores related data and lets many people use it easily and safely.</p>" +
        "<p>Its purpose is to remove the problems of <strong>file-processing systems</strong>:</p>" +
        "<ul>" +
        "<li>It reduces <strong>data redundancy</strong> and <strong>inconsistency</strong>.</li>" +
        "<li>It makes data easy to <strong>access</strong> with queries.</li>" +
        "<li>It enforces <strong>integrity constraints</strong>.</li>" +
        "<li>It allows safe <strong>concurrent access</strong>, <strong>security</strong> and <strong>recovery</strong> after failures.</li>" +
        "</ul>"
    },
    {
      id: "u1-a2",
      unit: 1,
      part: "A",
      marks: 2,
      topics: ["1.1"],
      sources: [{ bank: "Unit I", no: 2 }],
      original: "List any two advantages of using a DBMS.",
      question: "List any two advantages of using a DBMS.",
      answer:
        "<ol>" +
        "<li><strong>Less redundancy:</strong> each fact is stored once, so the data stays <strong>consistent</strong>. A student's address is kept in one place, not in the library file and the hostel file.</li>" +
        "<li><strong>Data security:</strong> the DBMS gives each user only the access they need. A student can read marks but cannot change them.</li>" +
        "</ol>" +
        "<p>Other advantages: concurrent access, backup and recovery, and easy querying with SQL.</p>"
    },
    {
      id: "u1-a3",
      unit: 1,
      part: "A",
      marks: 2,
      topics: ["1.2"],
      sources: [{ bank: "Unit I", no: 3 }],
      original: "Define data abstraction.",
      question: "Define data abstraction.",
      answer:
        "<p><strong>Data abstraction</strong> means hiding the complex details of how data is stored, and showing users only the data they need.</p>" +
        "<p>A DBMS uses three <strong>levels of abstraction</strong>: <strong>physical</strong>, <strong>logical</strong> and <strong>view</strong>.</p>" +
        "<p>Example: a student sees their marks on the college portal (view level). They do not know how the marks are stored in files and blocks on the disk (physical level).</p>"
    },
    {
      id: "u1-a4",
      unit: 1,
      part: "A",
      marks: 2,
      topics: ["1.2"],
      sources: [{ bank: "Unit I", no: 4 }],
      original: "What are the three levels of data abstraction?",
      question: "What are the three levels of data abstraction?",
      answer:
        "<table><thead><tr><th>Level</th><th>What it describes</th></tr></thead><tbody>" +
        "<tr><td><strong>Physical level</strong> (lowest)</td><td><em>How</em> the data is stored: files, blocks and indexes on the disk.</td></tr>" +
        "<tr><td><strong>Logical level</strong></td><td><em>What</em> data is stored and how it is related: tables, columns and constraints.</td></tr>" +
        "<tr><td><strong>View level</strong> (highest)</td><td>Only the part of the database that one group of users needs.</td></tr>" +
        "</tbody></table>"
    },
    {
      id: "u1-a5",
      unit: 1,
      part: "A",
      marks: 2,
      topics: ["1.2"],
      sources: [{ bank: "Unit I", no: 5 }],
      original: "Differentiate between logical and physical data independence.",
      question: "Differentiate between logical and physical data independence.",
      answer:
        "<table><thead><tr><th>Logical data independence</th><th>Physical data independence</th></tr></thead><tbody>" +
        "<tr><td>We can change the <strong>logical schema</strong> without changing the views or application programs.</td><td>We can change the <strong>physical schema</strong> without changing the logical schema.</td></tr>" +
        "<tr><td>Example: add a new column to a table.</td><td>Example: add an index, or move the data files to a new disk.</td></tr>" +
        "<tr><td>Harder to achieve.</td><td>Easier to achieve.</td></tr>" +
        "</tbody></table>"
    },
    {
      id: "u1-a6",
      unit: 1,
      part: "A",
      marks: 2,
      topics: ["1.3"],
      sources: [{ bank: "Unit I", no: 6 }],
      original: "What is a data model? Name any two types.",
      question: "What is a data model? Name any two types.",
      answer:
        "<p>A <strong>data model</strong> is a set of concepts for describing the <strong>data</strong>, the <strong>relationships</strong> between data, the meaning of the data and the <strong>constraints</strong> on it.</p>" +
        "<p>Two types:</p>" +
        "<ol>" +
        "<li><strong>Relational model:</strong> data is kept in tables (relations).</li>" +
        "<li><strong>Entity-relationship (E-R) model:</strong> data is described as entities and the relationships between them.</li>" +
        "</ol>" +
        "<p>Others: object-based, semi-structured, hierarchical and network models.</p>"
    },
    {
      id: "u1-a7",
      unit: 1,
      part: "A",
      marks: 2,
      topics: ["1.4"],
      sources: [{ bank: "Unit I", no: 7 }],
      original: "Write the components of the database system architecture.",
      question: "Write the components of the database system architecture.",
      answer:
        "<ul>" +
        "<li><strong>Query processor:</strong> DDL interpreter, DML compiler and query evaluation engine.</li>" +
        "<li><strong>Storage manager:</strong> authorization and integrity manager, transaction manager, file manager and buffer manager.</li>" +
        "<li><strong>Disk storage:</strong> data files, the data dictionary and indices.</li>" +
        "<li><strong>Users:</strong> naive users, application programmers, sophisticated users and the database administrator (DBA).</li>" +
        "</ul>"
    },
    {
      id: "u1-a8",
      unit: 1,
      part: "A",
      marks: 2,
      topics: ["1.5"],
      sources: [{ bank: "Unit I", no: 8 }],
      original: "Define a relational database.",
      question: "Define a relational database.",
      answer:
        "<p>A <strong>relational database</strong> is a database that stores all its data in <strong>tables</strong> (called <strong>relations</strong>).</p>" +
        "<ul>" +
        "<li>Each table has <strong>rows</strong> (tuples) and <strong>columns</strong> (attributes).</li>" +
        "<li>Tables are linked to each other through <strong>keys</strong>.</li>" +
        "<li>The data is queried with <strong>SQL</strong>.</li>" +
        "</ul>" +
        "<p>Examples: MySQL, Oracle and PostgreSQL manage relational databases.</p>"
    },
    {
      id: "u1-a9",
      unit: 1,
      part: "A",
      marks: 2,
      topics: ["1.6"],
      sources: [{ bank: "Unit I", no: 9 }],
      original: "What is a relation in the relational model?",
      question: "What is a relation in the relational model?",
      answer:
        "<p>A <strong>relation</strong> is a table with rows and columns. Formally, it is a <strong>set of tuples</strong>. Each tuple has one value for each <strong>attribute</strong>, taken from that attribute's <strong>domain</strong>.</p>" +
        "<table><caption>Relation STUDENT</caption><thead><tr><th>RollNo</th><th>Name</th><th>Dept</th></tr></thead><tbody>" +
        "<tr><td>101</td><td>Anu</td><td>CSE</td></tr>" +
        "<tr><td>102</td><td>Ravi</td><td>IT</td></tr>" +
        "</tbody></table>" +
        "<p>Here the <strong>degree</strong> (number of attributes) is 3 and the <strong>cardinality</strong> (number of tuples) is 2.</p>"
    },
    {
      id: "u1-a10",
      unit: 1,
      part: "A",
      marks: 2,
      topics: ["1.8"],
      sources: [{ bank: "Unit I", no: 10 }],
      original: "List the types of integrity constraints in a relational database.",
      question: "List the types of integrity constraints in a relational database.",
      answer:
        "<ul>" +
        "<li><strong>Domain constraint:</strong> each value must come from the attribute's domain (for example, age is a number).</li>" +
        "<li><strong>Key constraint:</strong> key values must be unique.</li>" +
        "<li><strong>Entity integrity:</strong> a primary key value can never be NULL.</li>" +
        "<li><strong>Referential integrity:</strong> a foreign key value must match a primary key value in the referenced table, or be NULL.</li>" +
        "<li><strong>NOT NULL, UNIQUE and CHECK</strong> constraints on single columns.</li>" +
        "</ul>"
    },
    {
      id: "u1-a11",
      unit: 1,
      part: "A",
      marks: 2,
      topics: ["1.7"],
      sources: [{ bank: "Unit I", no: 11 }],
      original: "Define primary key and foreign key.",
      question: "Define primary key and foreign key.",
      answer:
        "<p><strong>Primary key:</strong> a candidate key chosen to identify each tuple in a relation uniquely. Its values are unique and never NULL.</p>" +
        "<p><strong>Foreign key:</strong> an attribute in one relation that refers to the primary key of another relation. Its values must match an existing primary key value, or be NULL.</p>" +
        "<p>Example: in DEPARTMENT(<u>DeptID</u>, DeptName), DeptID is the primary key. In STUDENT(<u>RollNo</u>, Name, DeptID), DeptID is a foreign key.</p>"
    },
    {
      id: "u1-a12",
      unit: 1,
      part: "A",
      marks: 2,
      topics: ["1.9"],
      sources: [{ bank: "Unit I", no: 12 }],
      original: "What is relational algebra?",
      question: "What is relational algebra?",
      answer:
        "<p><strong>Relational algebra</strong> is a <strong>procedural query language</strong>. Each operation takes one or two relations as input and gives a new relation as output.</p>" +
        "<p>Its basic operations are <strong>select (σ)</strong>, <strong>project (π)</strong>, <strong>union (∪)</strong>, <strong>set difference (−)</strong>, <strong>Cartesian product (×)</strong> and <strong>rename (ρ)</strong>.</p>" +
        "<p>It is the base of SQL. Example: σ<sub>Dept = \"CSE\"</sub>(STUDENT) gives all CSE students.</p>"
    },
    {
      id: "u1-a13",
      unit: 1,
      part: "A",
      marks: 2,
      topics: ["1.9"],
      sources: [{ bank: "Unit I", no: 13 }],
      original: "Mention any two relational algebra operations.",
      question: "Mention any two relational algebra operations.",
      answer:
        "<ol>" +
        "<li><strong>Select (σ):</strong> picks the <strong>rows</strong> that satisfy a condition.<br>σ<sub>Marks &gt; 80</sub>(STUDENT) gives the students who scored more than 80.</li>" +
        "<li><strong>Project (π):</strong> picks the <strong>columns</strong> we name and removes duplicate rows.<br>π<sub>Name, Dept</sub>(STUDENT) gives only the name and department of each student.</li>" +
        "</ol>"
    },
    {
      id: "u1-a14",
      unit: 1,
      part: "A",
      marks: 2,
      topics: ["1.10"],
      sources: [{ bank: "Unit I", no: 14 }],
      original: "What is the purpose of the SQL language?",
      question: "What is the purpose of the SQL language?",
      answer:
        "<p><strong>SQL (Structured Query Language)</strong> is the standard language for relational databases. We use it to:</p>" +
        "<ul>" +
        "<li><strong>define</strong> tables and constraints (DDL),</li>" +
        "<li><strong>insert, change, delete and query</strong> data (DML),</li>" +
        "<li><strong>control access</strong> to data (DCL), and</li>" +
        "<li><strong>manage transactions</strong> (TCL).</li>" +
        "</ul>" +
        "<p>SQL is <strong>declarative</strong>: we say <em>what</em> data we want, and the DBMS decides <em>how</em> to get it.</p>"
    },
    {
      id: "u1-a15",
      unit: 1,
      part: "A",
      marks: 2,
      topics: ["1.12", "1.13"],
      sources: [{ bank: "Unit I", no: 15 }],
      original: "Differentiate between DDL and DML.",
      question: "Differentiate between DDL and DML.",
      answer:
        "<table><thead><tr><th>DDL (Data Definition Language)</th><th>DML (Data Manipulation Language)</th></tr></thead><tbody>" +
        "<tr><td>Defines and changes the <strong>structure</strong> (schema) of the database.</td><td>Works on the <strong>data</strong> stored in the tables.</td></tr>" +
        "<tr><td>CREATE, ALTER, DROP, TRUNCATE, RENAME</td><td>INSERT, UPDATE, DELETE, SELECT</td></tr>" +
        "<tr><td>Changes are saved at once (auto-commit in MySQL).</td><td>Changes can be undone with ROLLBACK before COMMIT.</td></tr>" +
        "</tbody></table>"
    },
    {
      id: "u1-a16",
      unit: 1,
      part: "A",
      marks: 2,
      topics: ["1.7", "1.8"],
      sources: [{ bank: "Unit I", extra: true }],
      original: "Define primary key constraint.",
      question: "Define the primary key constraint.",
      answer:
        "<p>A <strong>primary key constraint</strong> marks a column, or a set of columns, as the <strong>primary key</strong> of a table. The DBMS then makes sure that its values are <strong>unique</strong> and <strong>never NULL</strong>. A table can have only <strong>one</strong> primary key.</p>" +
        "<pre><code class=\"language-sql\">CREATE TABLE student (\n  roll_no INT PRIMARY KEY,\n  name    VARCHAR(50)\n);</code></pre>" +
        "<p>Inserting two rows with the same roll_no gives an error.</p>"
    },
    {
      id: "u1-b1",
      unit: 1,
      part: "B",
      marks: 16,
      topics: ["1.1", "1.2"],
      sources: [{ bank: "Unit I", no: 1 }],
      original: "Explain in detail the purpose of database systems and the views of data. Include data abstraction, data independence, and levels of architecture.",
      question: "Explain in detail the purpose of database systems and the views of data.",
      include: "Include data abstraction, data independence and the levels of architecture.",
      answer: null,
      outline: true
    },
    {
      id: "u1-b2",
      unit: 1,
      part: "B",
      marks: 16,
      topics: ["1.3"],
      sources: [{ bank: "Unit I", no: 2 }],
      original: "Describe the types of data models in DBMS with examples. Hierarchical, Network, Relational, and Object-based models.",
      question: "Describe the types of data models in a DBMS with examples.",
      include: "Include the hierarchical, network, relational and object-based models.",
      answer: null,
      outline: true
    },
    {
      id: "u1-b3",
      unit: 1,
      part: "B",
      marks: 16,
      topics: ["1.4"],
      sources: [{ bank: "Unit I", no: 3 }],
      original: "Illustrate the architecture of a DBMS with a neat diagram. Explain each component.",
      question: "Illustrate the architecture of a DBMS with a neat diagram. Explain each component.",
      answer: null,
      outline: true
    },
    {
      id: "u1-b4",
      unit: 1,
      part: "B",
      marks: 16,
      topics: ["1.6", "1.7", "1.8"],
      sources: [{ bank: "Unit I", no: 4 }],
      original: "Explain the relational model in detail. Include terminology like tuples, attributes, domains, keys, and integrity constraints.",
      question: "Explain the relational model in detail.",
      include: "Include terms such as tuples, attributes, domains, keys and integrity constraints.",
      answer: null,
      outline: true
    },
    {
      id: "u1-b5",
      unit: 1,
      part: "B",
      marks: 16,
      topics: ["1.9"],
      sources: [{ bank: "Unit I", no: 5 }],
      original: "Explain in detail about relational algebra. With example.",
      question: "Explain relational algebra in detail with examples.",
      answer: null,
      outline: true
    },
    {
      id: "u1-b6",
      unit: 1,
      part: "B",
      marks: 16,
      topics: ["1.11", "1.12", "1.13"],
      sources: [{ bank: "Unit I", no: 6 }],
      original: "Write and explain the basic structure of SQL queries. Also, illustrate DDL and DML commands with examples. Include CREATE, ALTER, INSERT, UPDATE, DELETE, and SELECT statements.",
      question: "Write and explain the basic structure of SQL queries. Also illustrate DDL and DML commands with examples.",
      include: "Include the CREATE, ALTER, INSERT, UPDATE, DELETE and SELECT statements.",
      answer: null,
      outline: true
    }
  ]);
})();
