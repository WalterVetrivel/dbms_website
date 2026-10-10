/* Unit V comparisons, shown on comparisons/unit-5.html. See data/comparisons/unit-1.js
   for the shape of an item. After you change this file, run node tools/build-comparisons.mjs. */
window.DBMS = window.DBMS || {};

DBMS.comparisons = (DBMS.comparisons || []).concat([
  {
    id: "centralized-vs-distributed",
    topics: ["5.1"],
    title: "Centralized and distributed databases",
    keywords: "centralized distributed database ddbms sites vs difference",
    summary: "A centralized database keeps all data at one site. A distributed database spreads it over several sites linked by a network, so it keeps working when one site fails.",
    tables: [{ from: "5.1", ref: "cmp-central-distributed" }],
    tip: "Draw both: one database with many users around it, and three sites joined by a network, each with its own database.",
    read: ["5.1#compare"],
    questions: ["u5-a1", "u5-a2", "u5-b1"]
  },
  {
    id: "replication-vs-fragmentation",
    topics: ["5.1"],
    title: "Replication and fragmentation",
    keywords: "replication fragmentation replica fragment allocation distributed storage vs difference",
    summary: "Replication stores copies of the same data at several sites. Fragmentation splits the data into parts and stores each part at a different site.",
    tables: [{
      caption: "Replication and fragmentation",
      head: ["Basis", "Replication", "Fragmentation"],
      rows: [
        ["Meaning", "A copy (replica) of a relation or fragment is kept at two or more sites", "A relation is split into fragments, and each fragment is kept at one site"],
        ["Kinds", "Full, partial or no replication", "Horizontal, vertical or mixed"],
        ["Same data at many sites?", "Yes", "No (only the key repeats in vertical fragments)"],
        ["Reads", "Fast: a copy is often local; sites can answer in parallel", "Fast when a site needs only its own fragment"],
        ["Updates", "Costly: every copy must change", "Cheap: one site holds each row"],
        ["If a site fails", "Another copy is used", "That fragment cannot be reached"],
        ["Disk space", "More", "No extra"],
        ["Rebuilding the relation", "Not needed: each copy is whole", "Union (horizontal) or natural join (vertical)"],
        ["Used together?", "Yes: fragments can also be replicated", "Yes"]
      ]
    }],
    tip: "Replication answers “how many copies?”, fragmentation answers “which part goes where?”, and allocation is the choice of sites.",
    read: ["5.1#storage"],
    questions: ["u5-b1"]
  },
  {
    id: "fragmentation-types",
    topics: ["5.1"],
    title: "Horizontal, vertical and mixed fragmentation",
    keywords: "horizontal vertical mixed hybrid fragmentation selection projection union join vs difference",
    summary: "Horizontal fragmentation splits a relation by rows with a selection (σ). Vertical fragmentation splits it by columns with a projection (π), and mixed fragmentation does both.",
    tables: [{
      caption: "Fragmenting Student(RollNo, Name, Dept, City, Marks)",
      head: ["Basis", "Horizontal", "Vertical", "Mixed (hybrid)"],
      rows: [
        ["Splits by", "Rows (tuples)", "Columns (attributes)", "Columns, then rows (or rows, then columns)"],
        ["Defined with", "Selection σ", "Projection π", "σ and π together"],
        ["Rebuilt with", "Union ∪", "Natural join ⋈ on the key", "Join and union, in reverse order"],
        ["Must keep", "Every row in exactly one fragment", "The primary key in every fragment", "Both rules"],
        ["Each fragment has", "All the columns, some rows", "All the rows, some columns", "Some rows and some columns"],
        ["Suits", "Each site uses its own rows (for example, its own city)", "Each site uses different columns (office, exam cell)", "Both needs at once"],
        ["Example", "F1 = σ<sub>City = 'Salem'</sub>(Student)", "F1 = π<sub>RollNo, Name, Dept</sub>(Student)", "F2 = σ<sub>City = 'Chennai'</sub>(π<sub>RollNo, City, Marks</sub>(Student))"]
      ]
    }],
    syntax: [
      { label: "Horizontal fragment", code: "-- F1 at the Salem site\nSELECT *\nFROM Student\nWHERE City = 'Salem';\n\n-- rebuild:\n-- F1 UNION F2 UNION F3" },
      { label: "Vertical fragment", code: "-- F1 at the college office\nSELECT RollNo, Name, Dept\nFROM Student;\n\n-- rebuild:\n-- F1 JOIN F2 USING (RollNo)" },
      { label: "Mixed fragment", code: "-- F2 at the Chennai site\nSELECT RollNo, City, Marks\nFROM Student\nWHERE City = 'Chennai';\n\n-- rebuild:\n-- F1 JOIN (F2 UNION F3)\n--   USING (RollNo)" }
    ],
    tip: "Draw one small table, then each fragment with its σ or π expression, then the rebuild formula: ∪ for horizontal and ⋈ for vertical.",
    read: ["5.1#storage"],
    questions: ["u5-b1"]
  },
  {
    id: "homogeneous-vs-heterogeneous",
    topics: ["5.2"],
    title: "Homogeneous, heterogeneous and federated distributed databases",
    keywords: "homogeneous heterogeneous federated multidatabase distributed vs difference",
    summary: "In a homogeneous system every site runs the same DBMS and schema. In a heterogeneous system the sites may differ, and a federated system joins independent databases that share only some data.",
    tables: [{ from: "5.2", ref: "cmp-homo-hetero" }],
    tip: "For 2 marks, write the DBMS, schema and cooperation rows for homogeneous and heterogeneous only. Add federated in a 16-mark answer.",
    questions: ["u5-a3", "u5-b2"]
  },
  {
    id: "commit-protocols",
    topics: ["5.3"],
    title: "Single-phase, two-phase and three-phase commit",
    keywords: "1pc 2pc 3pc single phase two phase three phase commit protocol blocking coordinator vs difference",
    summary: "Single-phase commit just tells sites to commit. 2PC first asks every site to vote, and 3PC adds a pre-commit phase so that sites need not block when the coordinator fails.",
    tables: [{ from: "5.3", ref: "cmp-commit-protocols" }],
    syntax: [
      { label: "2PC messages", code: "Coordinator         Site\n  <prepare T>  --->\n               <---  <ready T>\n  <commit T>   --->\n               <---  ack" },
      { label: "3PC messages", code: "Coordinator         Site\n  <prepare T>  --->\n               <---  <ready T>\n  <precommit T> -->\n               <---  ack\n  <commit T>   --->\n               <---  ack" }
    ],
    syntaxTitle: "The messages side by side",
    tip: "Draw the message diagram for each protocol. Then explain what happens when the coordinator fails after sending <code>&lt;prepare T&gt;</code>.",
    read: ["5.3#two-phase", "5.3#three-phase"],
    questions: ["u5-a5", "u5-b3"]
  },
  {
    id: "rdbms-vs-nosql",
    topics: ["5.4"],
    title: "Relational (SQL) and NoSQL databases",
    keywords: "rdbms sql nosql relational non-relational schema scaling vs difference",
    summary: "A relational database stores tables with a fixed schema and uses SQL and ACID transactions. A NoSQL database uses flexible models and scales out over many servers.",
    tables: [{ from: "5.4", ref: "cmp-sql-nosql" }],
    questions: ["u5-a6", "u5-b5", "u5-b6"]
  },
  {
    id: "acid-vs-base",
    topics: ["5.4"],
    title: "ACID and BASE",
    keywords: "acid base basically available soft state eventual consistency vs difference",
    summary: "ACID puts correct data first; BASE (basically available, soft state, eventually consistent) puts availability and speed first.",
    tables: [{ from: "5.4", ref: "cmp-acid-base" }],
    tip: "Expand BASE in full: Basically Available, Soft state, Eventually consistent. Then link it to AP systems in the CAP theorem.",
    read: ["5.4#base"]
  },
  {
    id: "cp-vs-ap",
    topics: ["5.5"],
    title: "CP and AP systems",
    keywords: "cap theorem cp ap ca consistency availability partition tolerance vs difference",
    summary: "During a network partition, a CP system refuses some requests to keep data consistent. An AP system keeps answering, even if some answers are old.",
    tables: [
      {
        caption: "CP and AP systems",
        head: ["Basis", "CP system", "AP system"],
        rows: [
          ["Keeps during a partition", "Consistency and partition tolerance", "Availability and partition tolerance"],
          ["Gives up during a partition", "Availability: some requests wait or fail", "Consistency: some reads return old data"],
          ["Consistency", "Strong", "Eventual"],
          ["Transaction style", "Closer to ACID", "BASE"],
          ["After the partition heals", "Normal service resumes", "Copies are brought into agreement"],
          ["Examples", "HBase, MongoDB (default settings), Redis Cluster", "Cassandra, CouchDB, DynamoDB"],
          ["Good for", "Bank balances, ticket booking, stock levels", "Likes, feeds, shopping carts"]
        ]
      },
      { from: "5.5", ref: "cmp-cap-pairs" }
    ],
    tip: "Partitions cannot be avoided in a distributed system, so the real choice is between C and A while a partition lasts.",
    read: ["5.5#choices"],
    questions: ["u5-a7", "u5-b4"]
  },
  {
    id: "nosql-types",
    topics: ["5.9", "5.6", "5.7", "5.8"],
    title: "Document, key-value, column-based and graph databases",
    keywords: "nosql types document key-value column family wide column graph mongodb redis cassandra neo4j vs difference",
    summary: "The four NoSQL families differ in their unit of data: a JSON document, a key and its value, a row of column families, or nodes and edges.",
    tables: [{ from: "5.9", ref: "cmp-nosql-types" }],
    syntax: [
      { label: "Document (MongoDB)", code: "db.students.find(\n  { dept: \"CSE\" })" },
      { label: "Key-value (Redis)", code: "SET session:42 \"cart=3\"\nGET session:42" },
      { label: "Column-based (Cassandra CQL)", code: "SELECT name, marks\nFROM student\nWHERE roll_no = 101;" },
      { label: "Graph (Neo4j Cypher)", code: "MATCH (a:Person {name: 'Anu'})\n      -[:FRIEND]->(f)\nRETURN f.name;" }
    ],
    syntaxTitle: "One query in each",
    tip: "For the 16-mark question, give each family its data model, a small example, two systems, two uses, and its merits and demerits. End with this table.",
    read: ["5.9#four"],
    questions: ["u5-b5"]
  },
  {
    id: "sql-vs-mongodb",
    topics: ["5.6"],
    title: "SQL (MySQL) and MongoDB commands",
    keywords: "sql mongodb mongosh document relational insert find update delete crud syntax vs difference",
    summary: "The same tasks written both ways. MySQL works on tables and rows with SQL. MongoDB works on collections and documents with methods such as find and updateOne.",
    tables: [
      { from: "5.6", ref: "cmp-sql-mongo-terms" },
      { from: "5.6", ref: "tbl-mongo-sql" },
      { from: "5.6", ref: "cmp-doc-rel" }
    ],
    syntax: [
      { label: "SQL (MySQL 8.4)", code: "INSERT INTO students\n  (roll_no, name, dept)\nVALUES (101, 'Anitha', 'CSE');\n\nSELECT name FROM students\nWHERE marks > 80;\n\nUPDATE students SET dept = 'IT'\nWHERE roll_no = 101;" },
      { label: "MongoDB (mongosh)", code: "db.students.insertOne(\n  { _id: 101, name: \"Anitha\",\n    dept: \"CSE\" })\n\ndb.students.find(\n  { marks: { $gt: 80 } },\n  { name: 1 })\n\ndb.students.updateOne(\n  { _id: 101 },\n  { $set: { dept: \"IT\" } })" }
    ],
    read: ["5.6#crud", "5.6#compare"],
    questions: ["u5-a8", "u5-b6"]
  },
  {
    id: "wide-column-vs-columnar",
    topics: ["5.8"],
    title: "Wide-column stores and columnar databases",
    keywords: "wide column column family columnar database cassandra hbase redshift vs difference",
    summary: "A wide-column store keeps each row's column families together and has a flexible schema. A columnar database keeps each column's values together and uses SQL.",
    tables: [{ from: "5.8", ref: "cmp-wide-columnar" }],
    tip: "Both are called “column” databases, so examiners like to ask this. Say what is stored together in each.",
    read: ["5.8#columnar"],
    questions: ["u5-a10"]
  },
  {
    id: "dac-mac-rbac",
    topics: ["5.11", "5.12"],
    title: "Discretionary, mandatory and role-based access control",
    keywords: "dac mac rbac discretionary mandatory role based access control grant role security levels vs difference",
    summary: "In DAC the owner grants privileges to users. In MAC the system compares security levels, and in RBAC privileges go to roles that users are given.",
    tables: [
      { from: "5.12", ref: "cmp-access-models" },
      { from: "5.11", ref: "cmp-dac-mac" }
    ],
    syntax: [
      { label: "DAC: GRANT to a user", code: "GRANT SELECT, UPDATE\n  ON college.marks\n  TO 'ravi'@'%'\n  WITH GRANT OPTION;" },
      { label: "RBAC: GRANT to a role", code: "CREATE ROLE 'teacher';\nGRANT SELECT, UPDATE\n  ON college.marks\n  TO 'teacher';\nGRANT 'teacher' TO 'ravi'@'%';\nSET DEFAULT ROLE ALL\n  TO 'ravi'@'%';" },
      { label: "MAC: levels (no SQL)", code: "Clearance(Ravi)  = Secret\nClass(marks)     = Confidential\n\nRead:  allowed\n  (Secret ≥ Confidential)\nWrite: refused\n  (no write down)" }
    ],
    read: ["5.11#compare", "5.12#mysql"],
    questions: ["u5-a13", "u5-b8"]
  },
  {
    id: "dynamic-sql-vs-prepared",
    topics: ["5.13"],
    title: "Dynamic SQL and prepared statements",
    keywords: "sql injection dynamic sql string concatenation prepared statement parameterized query placeholder vs difference",
    summary: "Dynamic SQL joins user input into the query text, so input can change the query. A prepared statement fixes the query first and sends input only as values.",
    tables: [{
      caption: "Dynamic SQL and prepared statements",
      head: ["Basis", "Dynamic SQL (string concatenation)", "Prepared statement (parameterized query)"],
      rows: [
        ["How the query is built", "User input is joined into the SQL text", "The SQL has ? placeholders; input is bound to them later"],
        ["When the query is parsed", "After the input is added", "Before the input arrives"],
        ["Can input change the query?", "Yes: quotes and keywords in the input become SQL", "No: input is always treated as a value"],
        ["SQL injection", "Possible", "Prevented"],
        ["Repeated runs", "Parsed again each time", "Parsed once, run many times"],
        ["Input <code>' OR '1'='1</code> as the password", "Logs in without the password", "No row matches; the login fails"],
        ["In code", "<code>\"... WHERE username = '\" + user + \"'\"</code>", "<code>\"... WHERE username = ?\"</code> and <code>setString(1, user)</code>"]
      ]
    }],
    syntax: [
      { label: "Unsafe: dynamic SQL (Java)", code: "String sql =\n  \"SELECT * FROM users\" +\n  \" WHERE username = '\" + user +\n  \"' AND password = '\" + pass +\n  \"'\";\nResultSet rs =\n  stmt.executeQuery(sql);" },
      { label: "Safe: prepared (Java)", code: "String sql =\n  \"SELECT * FROM users\" +\n  \" WHERE username = ?\" +\n  \" AND password = ?\";\nPreparedStatement ps =\n  conn.prepareStatement(sql);\nps.setString(1, user);\nps.setString(2, pass);\nResultSet rs = ps.executeQuery();" },
      { label: "Safe: prepared (MySQL)", code: "PREPARE login FROM\n  'SELECT * FROM users\n   WHERE username = ?\n   AND password = ?';\nSET @u = 'anitha',\n    @p = ''' OR ''1''=''1';\nEXECUTE login USING @u, @p;\n-- no rows: the attack fails\nDEALLOCATE PREPARE login;" }
    ],
    tip: "A prepared statement is safe only if every input goes into a ?. Joining input into the text before calling prepareStatement is still unsafe.",
    read: ["5.13#prepared"],
    questions: ["u5-a14", "u5-b9"]
  },
  {
    id: "symmetric-vs-asymmetric",
    topics: ["5.14"],
    title: "Symmetric and asymmetric encryption",
    keywords: "symmetric asymmetric encryption public key private key aes rsa pki vs difference",
    summary: "Symmetric encryption uses one shared secret key and is fast. Asymmetric encryption uses a public and a private key, which makes key sharing and signatures easy but is slow.",
    tables: [{ from: "5.14", ref: "cmp-key-types" }],
    syntax: [
      { label: "Symmetric (AES in MySQL)", code: "SET @key = 'k3y-0f-16-bytes!';\nSELECT AES_ENCRYPT('Anitha', @key)\n  INTO @c;\nSELECT CAST(\n  AES_DECRYPT(@c, @key)\n  AS CHAR);\n-- Anitha (same key both ways)" },
      { label: "Asymmetric (idea)", code: "Sender:   C = encrypt(M,\n            receiver's PUBLIC key)\nReceiver: M = decrypt(C,\n            receiver's PRIVATE key)\n\nSignature: sign with the sender's\n  PRIVATE key; anyone checks it\n  with the sender's PUBLIC key" }
    ],
    tip: "In practice both are used together: asymmetric encryption shares a symmetric key safely, then the symmetric key encrypts the data.",
    read: ["5.14#compare", "5.14#mysql"],
    questions: ["u5-a15", "u5-b10"]
  }
]);
