/* The topic registry: the single source for menus, unit pages, search and checks.
   status: "planned" (not written yet), "draft" (being written) or "published" (live).
   level: Bloom level from the syllabus. textbooks: S = Silberschatz, E = Elmasri (chapter numbers).
   prereqs and related hold topic ids; they are filled in as each unit is written. */
window.DBMS = window.DBMS || {};

DBMS.units = [
  {
    n: 1,
    roman: "I",
    title: "Introduction to Relational Database",
    slug: "unit-1",
    objective: "Learn the basics of data models, relational algebra and SQL.",
    co: "CO1",
    coText: "Apply relational algebra operations and SQL queries to database tasks.",
    coLevel: "Apply"
  },
  {
    n: 2,
    roman: "II",
    title: "Database Design",
    slug: "unit-2",
    objective: "Learn to design a database using E-R diagrams and normalization.",
    co: "CO2",
    coText: "Design a database using the E-R model and normalize the design.",
    coLevel: "Apply"
  },
  {
    n: 3,
    roman: "III",
    title: "Transaction Management",
    slug: "unit-3",
    objective: "Understand transactions, concurrency control and recovery.",
    co: "CO3",
    coText: "Write queries that handle transactions and keep the database consistent.",
    coLevel: "Apply"
  },
  {
    n: 4,
    roman: "IV",
    title: "Implementation Techniques",
    slug: "unit-4",
    objective: "Learn how data is stored using files, indexing and hashing.",
    co: "CO4",
    coText: "Choose a suitable file organization and indexing method for an application.",
    coLevel: "Apply"
  },
  {
    n: 5,
    roman: "V",
    title: "Advanced Topics",
    slug: "unit-5",
    objective: "Explore distributed databases, NoSQL databases and database security.",
    co: "CO5",
    coText: "Classify advanced databases and choose a suitable one for a need.",
    coLevel: "Understand"
  }
];

DBMS.topics = [
  // Unit I
  { id: "1.1", unit: 1, slug: "purpose-of-database-system", title: "Purpose of Database System", level: "L2", textbooks: ["S1", "E1"], covers: "Problems with file systems, uses of databases and the advantages of a DBMS", status: "published", prereqs: [], related: ["1.2", "1.4", "3.2"] },
  { id: "1.2", unit: 1, slug: "views-of-data", title: "Views of Data", level: "L2", textbooks: ["S1", "E2"], covers: "Data abstraction, the three levels, instances, schemas and data independence", status: "published", prereqs: ["1.1"], related: ["1.3", "1.4", "1.6"], widgets: ["V1"] },
  { id: "1.3", unit: 1, slug: "data-models", title: "Data Models", level: "L2", textbooks: ["S1", "E2"], covers: "Relational, E-R, object-based, semi-structured, hierarchical and network models", status: "published", prereqs: ["1.2"], related: ["1.5", "1.6", "2.1"] },
  { id: "1.4", unit: 1, slug: "database-system-architecture", title: "Database System Architecture", level: "L2", textbooks: ["S1", "E2"], covers: "Query processor, storage manager, database users, and two-tier and three-tier designs", status: "published", prereqs: ["1.2"], related: ["1.10", "3.1", "4.10"], widgets: ["V2"] },
  { id: "1.5", unit: 1, slug: "introduction-to-relational-databases", title: "Introduction to Relational Databases", level: "L2", textbooks: ["S2", "E5"], covers: "Tables, rows and columns, and common relational database products", status: "published", prereqs: ["1.1"], related: ["1.3", "1.6", "1.7"] },
  { id: "1.6", unit: 1, slug: "relational-model", title: "Relational Model", level: "L2", textbooks: ["S2", "E5"], covers: "Relation, tuple, attribute, domain, schema, instance, degree and cardinality", status: "published", prereqs: ["1.5"], related: ["1.7", "1.8", "1.9"] },
  { id: "1.7", unit: 1, slug: "keys", title: "Keys", level: "L3", textbooks: ["S2", "E5"], covers: "Super, candidate, primary, alternate, composite and foreign keys", status: "published", prereqs: ["1.6"], related: ["1.8", "1.12", "2.4"], widgets: ["V3"] },
  { id: "1.8", unit: 1, slug: "constraints", title: "Constraints", level: "L2", textbooks: ["S4", "E5"], covers: "Domain, key, NOT NULL, UNIQUE and CHECK constraints, entity integrity and referential integrity", status: "published", prereqs: ["1.6", "1.7"], related: ["1.12", "3.2"] },
  { id: "1.9", unit: 1, slug: "relational-algebra", title: "Relational Algebra", level: "L3", textbooks: ["S2", "E8"], covers: "Select, project, set operations, Cartesian product, rename, joins and division", status: "published", prereqs: ["1.6"], related: ["1.11", "2.14", "4.11"], widgets: ["V4"] },
  { id: "1.10", unit: 1, slug: "overview-of-sql", title: "Overview of the SQL Query Language", level: "L3", textbooks: ["S3", "E6"], covers: "The parts of SQL (DDL, DML, DCL and TCL) and the basic data types", status: "published", prereqs: ["1.5"], related: ["1.11", "1.12", "1.13", "3.14"] },
  { id: "1.11", unit: 1, slug: "basic-structure-of-sql-queries", title: "Basic Structure of SQL Queries", level: "L3", textbooks: ["S3", "E6"], covers: "SELECT, FROM and WHERE, queries on more than one table, and ORDER BY", status: "published", prereqs: ["1.9", "1.10"], related: ["1.13", "2.13", "2.14"], widgets: ["V5"] },
  { id: "1.12", unit: 1, slug: "ddl", title: "DDL", level: "L3", textbooks: ["S3", "S4", "E6"], covers: "CREATE, ALTER, DROP, TRUNCATE and RENAME, with constraints", status: "published", prereqs: ["1.8", "1.10"], related: ["1.7", "1.13"] },
  { id: "1.13", unit: 1, slug: "dml", title: "DML", level: "L3", textbooks: ["S3", "E6"], covers: "INSERT, UPDATE, DELETE and SELECT", status: "published", prereqs: ["1.10", "1.12"], related: ["1.11", "2.12"] },

  // Unit II
  { id: "2.1", unit: 2, slug: "entity-relationship-model", title: "Entity-Relationship Model", level: "L2", textbooks: ["S6", "E3"], covers: "Entities, attributes, relationships, mapping cardinality, participation and weak entity sets", status: "published", prereqs: ["1.3"], related: ["2.2", "2.3", "1.7"], widgets: ["V6"] },
  { id: "2.2", unit: 2, slug: "er-diagrams", title: "E-R Diagrams", level: "L3", textbooks: ["S6", "E3"], covers: "E-R symbols and worked diagrams for a university, a bank and a car insurance company", status: "published", prereqs: ["2.1"], related: ["2.3"], widgets: ["V6"] },
  { id: "2.3", unit: 2, slug: "er-to-relational-mapping", title: "ER-to-Relational Mapping", level: "L3", textbooks: ["S6", "E9"], covers: "Turning entities, relationships and attributes into tables", status: "published", prereqs: ["2.2", "1.7"], related: ["1.12", "2.6"], widgets: ["V7"] },
  { id: "2.4", unit: 2, slug: "functional-dependencies", title: "Functional Dependencies", level: "L3", textbooks: ["S7", "E14"], covers: "Armstrong's axioms, closures, canonical cover and the types of dependencies", status: "published", prereqs: ["1.7"], related: ["2.5", "2.6"], widgets: ["V8"] },
  { id: "2.5", unit: 2, slug: "non-loss-decomposition", title: "Non-loss Decomposition", level: "L2", textbooks: ["S7", "E14", "E15"], covers: "Update anomalies, decomposition and the lossless-join test", status: "published", prereqs: ["2.4"], related: ["2.7", "2.6"], widgets: ["V10"] },
  { id: "2.6", unit: 2, slug: "first-second-and-third-normal-forms", title: "First, Second and Third Normal Forms", level: "L3", textbooks: ["S7", "E14"], covers: "1NF, 2NF and 3NF, with partial and transitive dependencies", status: "published", prereqs: ["2.4", "2.5"], related: ["2.8", "2.7"], widgets: ["V9"] },
  { id: "2.7", unit: 2, slug: "dependency-preservation", title: "Dependency Preservation", level: "L3", textbooks: ["S7", "E15"], covers: "Checking that a decomposition keeps every functional dependency", status: "published", prereqs: ["2.5"], related: ["2.6", "2.8"], widgets: ["V10"] },
  { id: "2.8", unit: 2, slug: "boyce-codd-normal-form", title: "Boyce-Codd Normal Form", level: "L3", textbooks: ["S7", "E14"], covers: "BCNF, how to decompose into BCNF, and BCNF compared with 3NF", status: "published", prereqs: ["2.6"], related: ["2.7", "2.9"], widgets: ["V9"] },
  { id: "2.9", unit: 2, slug: "multivalued-dependencies-and-fourth-normal-form", title: "Multivalued Dependencies and Fourth Normal Form", level: "L3", textbooks: ["S7", "E14"], covers: "Multivalued dependencies and 4NF", status: "published", prereqs: ["2.8"], related: ["2.10", "2.5"], widgets: ["V9"] },
  { id: "2.10", unit: 2, slug: "join-dependencies-and-fifth-normal-form", title: "Join Dependencies and Fifth Normal Form", level: "L3", textbooks: ["S7", "E14"], covers: "Join dependencies and 5NF", status: "published", prereqs: ["2.9"], related: ["2.5", "2.8"], widgets: ["V9"] },
  { id: "2.11", unit: 2, slug: "sql-set-operations", title: "SQL Set Operations", level: "L3", textbooks: ["S3", "E6"], covers: "UNION, UNION ALL, INTERSECT and EXCEPT", status: "published", prereqs: ["1.11"], related: ["2.12", "2.15"], widgets: ["V12"] },
  { id: "2.12", unit: 2, slug: "aggregate-functions", title: "Aggregate Functions", level: "L3", textbooks: ["S3", "E7"], covers: "COUNT, SUM, AVG, MIN and MAX", status: "published", prereqs: ["1.11"], related: ["2.13", "2.11"], widgets: ["V12"] },
  { id: "2.13", unit: 2, slug: "group-by-and-having", title: "GROUP BY and HAVING", level: "L3", textbooks: ["S3", "E7"], covers: "Grouping rows and filtering groups", status: "published", prereqs: ["2.12"], related: ["1.11", "2.15"], widgets: ["V5", "V12"] },
  { id: "2.14", unit: 2, slug: "joins", title: "Joins", level: "L3", textbooks: ["S4", "E7"], covers: "Inner, natural, outer, cross and self joins", status: "planned", prereqs: [], related: [] },
  { id: "2.15", unit: 2, slug: "sub-queries", title: "Sub Queries", level: "L3", textbooks: ["S3", "E7"], covers: "Single-row, multiple-row and correlated subqueries", status: "planned", prereqs: [], related: [] },
  { id: "2.16", unit: 2, slug: "views", title: "Views", level: "L3", textbooks: ["S4", "E7"], covers: "Creating, changing and dropping views", status: "planned", prereqs: [], related: [] },
  { id: "2.17", unit: 2, slug: "triggers", title: "Triggers", level: "L3", textbooks: ["S5", "E7"], covers: "BEFORE and AFTER triggers, and NEW and OLD values", status: "planned", prereqs: [], related: [] },

  // Unit III
  { id: "3.1", unit: 3, slug: "transaction-concepts", title: "Transaction Concepts", level: "L2", textbooks: ["S17", "E20"], covers: "Read and write operations, commit and abort, and the states of a transaction", status: "published", prereqs: [], related: ["3.2", "3.9", "5.3"], widgets: ["V15"] },
  { id: "3.2", unit: 3, slug: "acid-properties", title: "ACID Properties", level: "L2", textbooks: ["S17", "E20"], covers: "Atomicity, consistency, isolation and durability, with the funds-transfer example", status: "published", prereqs: ["3.1"], related: ["3.5", "3.9", "3.11"] },
  { id: "3.3", unit: 3, slug: "schedules", title: "Schedules", level: "L3", textbooks: ["S17", "E20"], covers: "Serial and concurrent schedules, and recoverable, cascadeless and strict schedules", status: "published", prereqs: ["3.1"], related: ["3.4", "3.5", "3.9"], widgets: ["V17"] },
  { id: "3.4", unit: 3, slug: "serializability", title: "Serializability", level: "L3", textbooks: ["S17", "E20"], covers: "Conflicting instructions, conflict and view serializability, and the precedence graph test", status: "published", prereqs: ["3.3"], related: ["3.6", "3.7", "3.11"], widgets: ["V17"] },
  { id: "3.5", unit: 3, slug: "concurrency-control", title: "Concurrency Control and Need for Concurrency", level: "L2", textbooks: ["S18", "E21"], covers: "The need for concurrency, and the lost update, dirty read, unrepeatable read and phantom problems", status: "published", prereqs: ["3.3", "3.4"], related: ["3.6", "3.11"], widgets: ["V16"] },
  { id: "3.6", unit: 3, slug: "locking-protocols", title: "Locking Protocols", level: "L2", textbooks: ["S18", "E21"], covers: "Shared and exclusive locks, the compatibility matrix, the lock manager and starvation", status: "published", prereqs: ["3.5"], related: ["3.7", "3.8"], widgets: ["V18"] },
  { id: "3.7", unit: 3, slug: "two-phase-locking", title: "Two Phase Locking", level: "L3", textbooks: ["S18", "E21"], covers: "Growing and shrinking phases, lock point, strict and rigorous two phase locking, and lock conversion", status: "published", prereqs: ["3.6"], related: ["3.8", "3.4"], widgets: ["V18"] },
  { id: "3.8", unit: 3, slug: "deadlock", title: "Deadlock", level: "L2", textbooks: ["S18", "E21"], covers: "Prevention (wait-die, wound-wait, timeout), wait-for graph detection, recovery, livelock", status: "published", prereqs: ["3.7"], related: ["3.6", "3.9"], widgets: ["V19"] },
  { id: "3.9", unit: 3, slug: "transaction-recovery", title: "Transaction Recovery", level: "L2", textbooks: ["S19", "E22"], covers: "Failure classification, storage types, log-based recovery (deferred and immediate), checkpoints, shadow paging", status: "published", prereqs: ["3.1", "3.2"], related: ["3.8", "3.10", "3.13", "5.3"], widgets: ["V20"] },
  { id: "3.10", unit: 3, slug: "save-points", title: "Save Points", level: "L3", textbooks: ["S4", "E20"], covers: "SAVEPOINT, ROLLBACK TO SAVEPOINT, RELEASE SAVEPOINT", status: "published", prereqs: ["3.1"], related: ["3.14", "3.9"], widgets: ["V21"] },
  { id: "3.11", unit: 3, slug: "isolation-levels", title: "Isolation Levels", level: "L2", textbooks: ["S17", "E20"], covers: "Read uncommitted, read committed, repeatable read, serializable; phenomena each allows", status: "published", prereqs: ["3.5"], related: ["3.10", "3.12", "3.7"], widgets: ["V22"] },
  { id: "3.12", unit: 3, slug: "sql-facilities-for-concurrency-and-recovery", title: "SQL Facilities for Concurrency and Recovery", level: "L2", textbooks: ["S17", "E20"], covers: "START TRANSACTION, SET TRANSACTION, SELECT ... FOR UPDATE and FOR SHARE, LOCK TABLES", status: "published", prereqs: ["3.11", "3.6"], related: ["3.13", "3.14", "3.10"] },
  { id: "3.13", unit: 3, slug: "backup-and-recovery-system", title: "Backup and Recovery System", level: "L2", textbooks: ["S19", "E22"], covers: "Full, incremental and differential backups, binary log, point-in-time recovery", status: "published", prereqs: ["3.9"], related: ["3.12", "4.1"] },
  { id: "3.14", unit: 3, slug: "sql-dcl-and-tcl-commands", title: "SQL DCL and TCL Commands", level: "L3", textbooks: ["S4", "E7"], covers: "GRANT, REVOKE; COMMIT, ROLLBACK, SAVEPOINT", status: "published", prereqs: ["3.1"], related: ["3.10", "3.12", "5.11", "5.12"], widgets: ["V21"] },

  // Unit IV
  { id: "4.1", unit: 4, slug: "raid", title: "RAID", level: "L2", textbooks: ["S12", "E16"], covers: "Striping, mirroring, parity and RAID levels 0 to 6", status: "published", prereqs: [], related: ["4.2", "4.3"], widgets: ["V23"] },
  { id: "4.2", unit: 4, slug: "file-organization", title: "File Organization", level: "L2", textbooks: ["S13", "E16"], covers: "Heap, sequential, hashing and clustering file organizations", status: "published", prereqs: [], related: ["4.3", "4.5", "4.8"] },
  { id: "4.3", unit: 4, slug: "organization-of-records-in-files", title: "Organization of Records in Files", level: "L2", textbooks: ["S13", "E16"], covers: "Fixed-length and variable-length records, the slotted-page structure, the data dictionary and column-oriented storage", status: "published", prereqs: ["4.2"], related: ["4.1", "4.4"], widgets: ["V24"] },
  { id: "4.4", unit: 4, slug: "indexing-and-hashing", title: "Indexing and Hashing", level: "L2", textbooks: ["S14", "E17"], covers: "Search keys, kinds of index, and indexing compared with hashing", status: "published", prereqs: ["4.2"], related: ["4.5", "4.6", "4.8"] },
  { id: "4.5", unit: 4, slug: "ordered-indices", title: "Ordered Indices", level: "L2", textbooks: ["S14", "E17"], covers: "Primary, secondary, dense, sparse and multilevel indices", status: "published", prereqs: ["4.4"], related: ["4.6", "4.2"], widgets: ["V25"] },
  { id: "4.6", unit: 4, slug: "b-plus-tree-index-files", title: "B+ Tree Index Files", level: "L3", textbooks: ["S14", "E17"], covers: "Structure, fan-out, search, insertion and deletion", status: "published", prereqs: ["4.4", "4.5"], related: ["4.7", "4.8", "4.9"], widgets: ["V26"] },
  { id: "4.7", unit: 4, slug: "b-tree-index-files", title: "B Tree Index Files", level: "L3", textbooks: ["S14", "E17"], covers: "Structure and operations, compared with B+ trees", status: "published", prereqs: ["4.6"], related: ["4.5", "4.4"], widgets: ["V27"] },
  { id: "4.8", unit: 4, slug: "static-hashing", title: "Static Hashing", level: "L2", textbooks: ["S14", "E16"], covers: "Hash functions, buckets and bucket overflow", status: "published", prereqs: ["4.4"], related: ["4.9", "4.2"], widgets: ["V28"] },
  { id: "4.9", unit: 4, slug: "dynamic-hashing", title: "Dynamic Hashing", level: "L2", textbooks: ["S14", "E16"], covers: "Extendible hashing, bucket splits and directory doubling", status: "published", prereqs: ["4.8"], related: ["4.6", "4.4"], widgets: ["V29"] },
  { id: "4.10", unit: 4, slug: "query-processing-overview", title: "Query Processing Overview", level: "L2", textbooks: ["S15", "E18"], covers: "Parsing, optimization and evaluation of a query, query cost, and algorithms for selection, sorting and joins", status: "published", prereqs: ["1.9", "4.4"], related: ["4.11", "4.6", "4.8"], widgets: ["V30"] },
  { id: "4.11", unit: 4, slug: "query-optimization", title: "Query Optimization using Heuristics and Cost Estimation", level: "L3", textbooks: ["S16", "E19"], covers: "Equivalence rules, query trees, heuristic rules, catalog statistics and choosing a plan by cost", status: "published", prereqs: ["4.10", "1.9"], related: ["4.5", "4.6"], widgets: ["V30"] },

  // Unit V
  { id: "5.1", unit: 5, slug: "distributed-database-architecture", title: "Distributed Databases: Architecture", level: "L2", textbooks: ["S20", "S21", "E23"], covers: "Sites, replication and fragmentation", status: "published", prereqs: ["1.6", "1.9"], related: ["5.2", "5.3"], widgets: ["V31"] },
  { id: "5.2", unit: 5, slug: "types-of-distributed-databases", title: "Types of Distributed Databases", level: "L2", textbooks: ["S20", "E23"], covers: "Homogeneous, heterogeneous and federated databases", status: "published", prereqs: ["5.1"], related: ["5.3", "5.4"] },
  { id: "5.3", unit: 5, slug: "distributed-transaction-processing", title: "Transaction Processing", level: "L2", textbooks: ["S23", "E23"], covers: "Coordinators, types of failure, and two-phase and three-phase commit", status: "published", prereqs: ["5.1", "3.1", "3.2", "3.9"], related: ["5.2"], widgets: ["V32"] },
  { id: "5.4", unit: 5, slug: "nosql-introduction", title: "NoSQL Databases: Introduction", level: "L2", textbooks: ["S10", "E24"], covers: "Why NoSQL is needed, its features, and relational databases compared with NoSQL", status: "published", prereqs: ["5.1", "5.3"], related: ["5.5", "5.6", "5.7", "5.8", "5.9"] },
  { id: "5.5", unit: 5, slug: "cap-theorem", title: "CAP Theorem", level: "L2", textbooks: ["S10", "E24"], covers: "Consistency, availability and partition tolerance", status: "published", prereqs: ["5.4", "5.1"], related: ["5.3", "5.6", "5.7"], widgets: ["V33"] },
  { id: "5.6", unit: 5, slug: "document-based-systems", title: "Document Based Systems", level: "L2", textbooks: ["S10", "E24"], covers: "Documents and collections, MongoDB and CouchDB", status: "published", prereqs: ["5.4"], related: ["5.7", "5.8", "5.9"], widgets: ["V33"] },
  { id: "5.7", unit: 5, slug: "key-value-stores", title: "Key Value Stores", level: "L2", textbooks: ["S10", "E24"], covers: "Key-value pairs, Redis and Amazon DynamoDB", status: "published", prereqs: ["5.4"], related: ["5.5", "5.6", "5.8"], widgets: ["V33"] },
  { id: "5.8", unit: 5, slug: "column-based-systems", title: "Column Based Systems", level: "L2", textbooks: ["S10", "E24"], covers: "Wide-column storage, Apache Cassandra and HBase", status: "published", prereqs: ["5.4"], related: ["5.5", "5.6", "5.7", "5.9"], widgets: ["V33"] },
  { id: "5.9", unit: 5, slug: "graph-databases", title: "Graph Databases", level: "L2", textbooks: ["S10", "E24"], covers: "Nodes, edges and properties, and Neo4j", status: "published", prereqs: ["5.4"], related: ["5.6", "5.7", "5.8"], widgets: ["V33"] },
  { id: "5.10", unit: 5, slug: "database-security-issues", title: "Database Security: Security Issues", level: "L2", textbooks: ["S9", "E30"], covers: "Threats to databases and the ways to control them", status: "published", prereqs: [], related: ["5.11", "5.12", "5.13", "5.14"] },
  { id: "5.11", unit: 5, slug: "access-control-based-on-privileges", title: "Access Control Based on Privileges", level: "L2", textbooks: ["S4", "E30"], covers: "Privileges, GRANT and REVOKE, and mandatory access control", status: "published", prereqs: ["5.10"], related: ["5.12", "5.13"] },
  { id: "5.12", unit: 5, slug: "role-based-access-control", title: "Role Based Access Control", level: "L2", textbooks: ["S4", "E30"], covers: "Roles and role hierarchies", status: "published", prereqs: ["5.11"], related: ["5.10", "5.11"] },
  { id: "5.13", unit: 5, slug: "sql-injection", title: "SQL Injection", level: "L2", textbooks: ["S9", "E30"], covers: "How SQL injection works and how to prevent it", status: "published", prereqs: ["5.10", "5.11"], related: ["5.10", "5.14"], widgets: ["V34"] },
  { id: "5.14", unit: 5, slug: "encryption-and-public-key-infrastructures", title: "Encryption and Public Key Infrastructures", level: "L2", textbooks: ["S9", "E30"], covers: "Encryption, digital signatures, certificates and PKI", status: "published", prereqs: ["5.10"], related: ["5.10", "5.13", "5.15"] },
  { id: "5.15", unit: 5, slug: "database-security-challenges", title: "Challenges", level: "L2", textbooks: ["E30"], covers: "Privacy, data quality and other open problems in database security", status: "published", prereqs: ["5.10", "5.14"], related: ["5.10", "5.14"] }
];
