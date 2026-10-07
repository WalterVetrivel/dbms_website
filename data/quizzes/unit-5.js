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
    },
    /* 5.3 Transaction Processing */
    {
      id: "q5.3-01",
      topic: "5.3",
      type: "mcq",
      question: "Transaction T starts at site S1 and updates data at S2 and S3. What is S1 called?",
      options: ["The coordinating site", "A participating site", "A partitioned site", "A replica site"],
      answer: 0,
      explain: "The site where a transaction starts is the coordinating site. S2 and S3, where its subtransactions run, are participating sites.",
      link: "#basics"
    },
    {
      id: "q5.3-02",
      topic: "5.3",
      type: "order",
      question: "Put the steps of two-phase commit in order for a transaction that commits.",
      options: [
        "The coordinator logs <prepare T> and sends prepare T",
        "Each site logs <ready T> and replies ready T",
        "The coordinator logs <commit T> and sends commit T",
        "Each site logs <commit T> and sends an acknowledgment",
        "The coordinator logs <complete T>"
      ],
      explain: "Phase 1 collects the votes. Phase 2 sends the decision, and the coordinator finishes with <complete T>.",
      link: "#two-phase"
    },
    {
      id: "q5.3-03",
      topic: "5.3",
      type: "mcq",
      question: "In 2PC, the coordinator gets “ready T” from Site 2 but no reply from Site 3 before the timeout. What does it decide?",
      options: ["Commit T", "Abort T", "Wait forever for Site 3", "Commit T at Site 2 only"],
      answer: 1,
      explain: "T can commit only if every site votes ready. A missing vote is treated as abort.",
      link: "#two-phase"
    },
    {
      id: "q5.3-04",
      topic: "5.3",
      type: "mcq",
      question: "The coordinator fails. Every active site has <ready T> in its log and no other record for T. What must the sites do?",
      options: ["Commit T", "Abort T", "Wait for the coordinator to recover", "Restart T from the beginning"],
      answer: 2,
      explain: "The sites cannot know whether the coordinator decided commit or abort, so they must wait. This is the blocking problem of 2PC.",
      link: "#handling"
    },
    {
      id: "q5.3-05",
      topic: "5.3",
      type: "tf",
      question: "A participating site recovers and finds no log record at all for T. It can safely abort T.",
      answer: true,
      explain: "True. With no <ready T>, the site never voted ready, so the coordinator cannot have committed T.",
      link: "#handling"
    },
    {
      id: "q5.3-06",
      topic: "5.3",
      type: "multi",
      question: "Which of these are failure modes of a distributed system? Choose all that apply.",
      options: ["Failure of a site", "Loss of messages", "Network partition", "A query with a syntax error"],
      answer: [0, 1, 2],
      explain: "The four failure modes are site failure, lost messages, link failure and network partition. A syntax error is not a system failure.",
      link: "#failures"
    },
    {
      id: "q5.3-07",
      topic: "5.3",
      type: "mcq",
      question: "What does three-phase commit add to two-phase commit?",
      options: ["A pre-commit phase", "A second voting phase", "A phase that copies all the data", "A phase that removes the log"],
      answer: 0,
      explain: "3PC adds a pre-commit phase. If the coordinator fails, a new coordinator can use the pre-commit records to decide, so the sites do not block.",
      link: "#three-phase"
    },
    /* 5.4 NoSQL Introduction */
    {
      id: "q5.4-01",
      topic: "5.4",
      type: "mcq",
      question: "What does “NoSQL” stand for?",
      options: ["No SQL at all", "Not only SQL", "New SQL", "Non-standard query language"],
      answer: 1,
      explain: "NoSQL means “not only SQL”: tables are not the only way to store data. Some NoSQL systems even have SQL-like languages.",
      link: "#what"
    },
    {
      id: "q5.4-02",
      topic: "5.4",
      type: "mcq",
      question: "A website adds more ordinary servers and spreads its data across them. What is this called?",
      options: ["Vertical scaling (scale up)", "Horizontal scaling (scale out)", "Normalization", "Indexing"],
      answer: 1,
      explain: "Adding more servers is horizontal scaling. Buying one bigger server is vertical scaling.",
      link: "#scaling"
    },
    {
      id: "q5.4-03",
      topic: "5.4",
      type: "multi",
      question: "Which of these are features of NoSQL databases? Select all that apply.",
      options: ["Flexible schema", "Data spread across many servers", "Joins through foreign keys are the main way to link data", "Handles semi-structured data", "A fixed schema must be defined first"],
      answer: [0, 1, 3],
      explain: "NoSQL databases have a flexible schema, run across many servers and handle semi-structured data. Foreign keys and a fixed schema belong to relational databases.",
      link: "#features"
    },
    {
      id: "q5.4-04",
      topic: "5.4",
      type: "mcq",
      question: "In BASE, what does the “E” stand for?",
      options: ["Exact consistency", "Eventual consistency", "Every read is correct", "Error handling"],
      answer: 1,
      explain: "BASE is basically available, soft state and eventual consistency: copies agree after some time when writes stop.",
      link: "#base"
    },
    {
      id: "q5.4-05",
      topic: "5.4",
      type: "tf",
      question: "A short delay before every user sees the new number of likes on a post is an example of eventual consistency.",
      answer: true,
      explain: "The copies differ for a moment and then all show the same count. That is eventual consistency.",
      link: "#base"
    },
    {
      id: "q5.4-06",
      topic: "5.4",
      type: "mcq",
      question: "Which kind of data is the best fit for a relational database with ACID rather than a BASE NoSQL store?",
      options: ["Likes on posts", "Bank account balances", "Website click logs", "Product page views"],
      answer: 1,
      explain: "A bank balance must always be correct, so it needs ACID. Likes, logs and view counts can be a little old for a moment.",
      link: "#base"
    },
    {
      id: "q5.4-07",
      topic: "5.4",
      type: "mcq",
      question: "Which pair is a NoSQL type matched with a correct example?",
      options: ["Graph: Redis", "Document: MongoDB", "Key-value: Neo4j", "Column-based: MySQL"],
      answer: 1,
      explain: "MongoDB is a document database. Redis is key-value, Neo4j is a graph database and MySQL is relational.",
      link: "#types"
    },
    /* 5.5 CAP Theorem */
    {
      id: "q5.5-01",
      topic: "5.5",
      type: "mcq",
      question: "In the CAP theorem, what does consistency (C) mean?",
      options: ["The data obeys all constraints", "Every read gets the most recent write, or an error", "Every request gets a response", "The system works when the network splits"],
      answer: 1,
      explain: "CAP consistency means every copy shows the latest value. Obeying constraints is the C in ACID, which is different.",
      link: "#three"
    },
    {
      id: "q5.5-02",
      topic: "5.5",
      type: "mcq",
      question: "What does the CAP theorem state?",
      options: ["A distributed system can guarantee all three of C, A and P", "A distributed system can guarantee at most two of C, A and P at the same time", "Only NoSQL systems can be partition tolerant", "Consistency is always more important than availability"],
      answer: 1,
      explain: "A distributed system with replicated data can guarantee at most two of consistency, availability and partition tolerance at once.",
      link: "#theorem"
    },
    {
      id: "q5.5-03",
      topic: "5.5",
      type: "mcq",
      question: "During a network partition, a server answers a read from its own old copy. Which guarantee has it given up?",
      options: ["Availability", "Partition tolerance", "Consistency", "Durability"],
      answer: 2,
      explain: "It answered, so it is available, but the answer may be old, so it is not consistent.",
      link: "#why"
    },
    {
      id: "q5.5-04",
      topic: "5.5",
      type: "mcq",
      question: "Which system is usually given as an example of an AP system?",
      options: ["HBase", "Apache Cassandra", "MySQL on one server", "MongoDB with default settings"],
      answer: 1,
      explain: "Cassandra keeps answering during a partition and syncs copies later. HBase and MongoDB (default) are CP; MySQL on one server is CA.",
      link: "#choices"
    },
    {
      id: "q5.5-05",
      topic: "5.5",
      type: "mcq",
      question: "A train booking system must never sell one seat twice. Which choice suits it best?",
      options: ["CP", "AP", "Neither; it should drop partition tolerance", "BASE with eventual consistency"],
      answer: 0,
      explain: "An old seat count could sell a seat twice. Refusing for a while is better than a wrong answer, so CP fits.",
      link: "#choosing"
    },
    {
      id: "q5.5-06",
      topic: "5.5",
      type: "tf",
      question: "In a system spread across many servers, partition tolerance cannot really be given up, so the real choice is between consistency and availability.",
      answer: true,
      explain: "Network failures will happen across many servers. So during a partition the system must pick C or A.",
      link: "#why"
    },
    {
      id: "q5.5-07",
      topic: "5.5",
      type: "multi",
      question: "Which of these describe an AP system? Select all that apply.",
      options: ["Every working server keeps answering during a partition", "Copies become the same later (eventual consistency)", "Some requests get “try again later” during a partition", "Users may read old data for a short time"],
      answer: [0, 1, 3],
      explain: "AP systems stay available and allow old reads; copies agree later. Refusing requests is what CP systems do.",
      link: "#choices"
    },
    /* 5.6 Document Based Systems */
    {
      id: "q5.6-01",
      topic: "5.6",
      type: "mcq",
      question: "In a document database, what is a collection?",
      options: ["A single field and its value", "A group of documents, like a table", "A list of values inside a document", "The unique key of a document"],
      answer: 1,
      explain: "A collection groups similar documents, much like a table groups rows. The documents need not have the same fields.",
      link: "#terms"
    },
    {
      id: "q5.6-02",
      topic: "5.6",
      type: "multi",
      question: "Which are document-based NoSQL databases? Select all that apply.",
      options: ["MongoDB", "Apache CouchDB", "Neo4j", "Redis"],
      answer: [0, 1],
      explain: "MongoDB and CouchDB store documents. Neo4j is a graph database and Redis is a key-value store.",
      link: "#systems"
    },
    {
      id: "q5.6-03",
      topic: "5.6",
      type: "mcq",
      question: "Which MongoDB command matches SELECT * FROM students WHERE dept = 'CSE'?",
      options: ["db.students.insertOne({ dept: \"CSE\" })", "db.students.find({ dept: \"CSE\" })", "db.students.updateOne({ dept: \"CSE\" })", "db.students.createIndex({ dept: 1 })"],
      answer: 1,
      explain: "find() with a query document returns the matching documents, like SELECT with WHERE.",
      link: "#crud"
    },
    {
      id: "q5.6-04",
      topic: "5.6",
      type: "mcq",
      question: "A post has a few comments that are always shown with it. How should the comments be stored?",
      options: ["Embedded in the post document", "In a separate collection, referenced by _id", "In a relational table", "As separate keys in a key-value store"],
      answer: 0,
      explain: "The comments belong to one post and are read with it, so embedding them gives one fast read.",
      link: "#design"
    },
    {
      id: "q5.6-05",
      topic: "5.6",
      type: "tf",
      question: "In a MongoDB collection, every document must have exactly the same fields.",
      answer: false,
      explain: "Document databases have a flexible schema. A mouse and a T-shirt can be in the same products collection with different fields.",
      link: "#terms"
    },
    {
      id: "q5.6-06",
      topic: "5.6",
      type: "mcq",
      question: "Which is a demerit of document databases?",
      options: ["They cannot store arrays", "Embedded data may be copied in many documents", "Every query needs a join", "New fields need ALTER TABLE"],
      answer: 1,
      explain: "Embedding copies data, so a change may have to be made in many documents. Arrays are allowed and joins are often not needed.",
      link: "#merits"
    },
    /* 5.7 Key Value Stores */
    {
      id: "q5.7-01",
      topic: "5.7",
      type: "mcq",
      question: "How does a key-value store find data?",
      options: ["By searching inside every value", "Only by the key", "By joining tables", "By scanning column families"],
      answer: 1,
      explain: "The store treats the value as opaque and finds data only by its unique key.",
      link: "#what"
    },
    {
      id: "q5.7-02",
      topic: "5.7",
      type: "multi",
      question: "Which are the basic operations of a key-value store? Select all that apply.",
      options: ["put(key, value)", "get(key)", "delete(key)", "join(table1, table2)"],
      answer: [0, 1, 2],
      explain: "put, get and delete are enough. There are no joins.",
      link: "#ops"
    },
    {
      id: "q5.7-03",
      topic: "5.7",
      type: "mcq",
      question: "Login sessions should vanish after 30 minutes. Which Redis feature helps?",
      options: ["Sorted sets", "An expiry time (TTL) on the key", "Column families", "Foreign keys"],
      answer: 1,
      explain: "SET key value EX 1800 stores the session with a 1800-second time to live, after which Redis deletes it.",
      link: "#examples"
    },
    {
      id: "q5.7-04",
      topic: "5.7",
      type: "mcq",
      question: "How does a large key-value store decide which server holds a key?",
      options: ["Alphabetical order of values", "By hashing the key", "By the size of the value", "The user picks the server"],
      answer: 1,
      explain: "A hash of the key picks the server, so any server can find the key without a central index.",
      link: "#scale"
    },
    {
      id: "q5.7-05",
      topic: "5.7",
      type: "mcq",
      question: "Which of these is a key-value store?",
      options: ["MongoDB", "Neo4j", "Redis", "HBase"],
      answer: 2,
      explain: "Redis is a key-value store. MongoDB is a document store, Neo4j a graph database and HBase a column store.",
      link: "#systems"
    },
    {
      id: "q5.7-06",
      topic: "5.7",
      type: "tf",
      question: "A key-value store can directly answer “find all users from Salem” by looking inside each value.",
      answer: false,
      explain: "It cannot look inside values. The app must keep an extra key, such as city:Salem, holding the matching user ids.",
      link: "#ops"
    },
    /* 5.8 Column Based Systems */
    {
      id: "q5.8-01",
      topic: "5.8",
      type: "mcq",
      question: "In a wide-column database, what is a column family?",
      options: ["A group of related columns stored together", "A list of row keys", "A copy of a table on another server", "A join between two tables"],
      answer: 0,
      explain: "Columns are grouped into column families, such as info and marks, and each family is stored together.",
      link: "#model"
    },
    {
      id: "q5.8-02",
      topic: "5.8",
      type: "tf",
      question: "In HBase, every column must be declared when the table is created.",
      answer: false,
      explain: "Only the column families are declared. Any row can add new columns inside a family at any time.",
      link: "#hbase"
    },
    {
      id: "q5.8-03",
      topic: "5.8",
      type: "mcq",
      question: "Row 102 has no OS mark. How does a wide-column store keep this?",
      options: ["As NULL, which takes space", "As zero", "The cell is simply not stored", "It refuses to insert the row"],
      answer: 2,
      explain: "Missing cells are not stored at all, so sparse rows cost nothing extra.",
      link: "#model"
    },
    {
      id: "q5.8-04",
      topic: "5.8",
      type: "multi",
      question: "Which are column-based (wide-column) NoSQL databases? Select all that apply.",
      options: ["Apache HBase", "Apache Cassandra", "CouchDB", "Neo4j"],
      answer: [0, 1],
      explain: "HBase and Cassandra are wide-column stores. CouchDB is a document store and Neo4j is a graph database.",
      link: "#what"
    },
    {
      id: "q5.8-05",
      topic: "5.8",
      type: "mcq",
      question: "In the Cassandra table PRIMARY KEY ((sensor_id, day), read_at), what does read_at do?",
      options: ["Chooses the server", "Sorts rows inside a partition (clustering column)", "Encrypts the data", "Makes a join possible"],
      answer: 1,
      explain: "(sensor_id, day) is the partition key that picks the servers. read_at is a clustering column that orders rows inside the partition.",
      link: "#cassandra"
    },
    {
      id: "q5.8-06",
      topic: "5.8",
      type: "mcq",
      question: "Why are writes fast in HBase and Cassandra?",
      options: ["They skip writing to disk", "Writes are appended to a log and a memory table, not updated in place", "They lock the whole table", "They use two-phase commit"],
      answer: 1,
      explain: "A write is added to a commit log and a sorted table in memory, then flushed as a new file. Appending is much faster than updating in place.",
      link: "#writes"
    },
    /* 5.9 Graph Databases */
    {
      id: "q5.9-01",
      topic: "5.9",
      type: "multi",
      question: "Which are parts of the property graph model? Select all that apply.",
      options: ["Nodes", "Relationships (edges)", "Properties", "Column families"],
      answer: [0, 1, 2],
      explain: "A property graph has nodes, relationships and properties on both. Column families belong to wide-column stores.",
      link: "#model"
    },
    {
      id: "q5.9-02",
      topic: "5.9",
      type: "mcq",
      question: "Why can a graph database follow links faster than a relational database?",
      options: ["It keeps all data in one table", "Each node stores direct pointers to its relationships (index-free adjacency)", "It never writes to disk", "It uses SQL joins internally"],
      answer: 1,
      explain: "Links are stored directly, so the database follows pointers instead of searching a table with joins.",
      link: "#why"
    },
    {
      id: "q5.9-03",
      topic: "5.9",
      type: "mcq",
      question: "In the Cypher pattern (a:Person)-[:KNOWS]->(b:Person), what is :KNOWS?",
      options: ["A node label", "A relationship type", "A property", "A table name"],
      answer: 1,
      explain: "Square brackets inside an arrow hold the relationship. KNOWS is its type; :Person is a node label.",
      link: "#cypher"
    },
    {
      id: "q5.9-04",
      topic: "5.9",
      type: "mcq",
      question: "Which application suits a graph database best?",
      options: ["Storing login sessions", "Suggesting friends of friends", "Storing sensor readings every second", "Caching a results page"],
      answer: 1,
      explain: "Friend suggestions follow links two hops away, which is what graph databases do best.",
      link: "#uses"
    },
    {
      id: "q5.9-05",
      topic: "5.9",
      type: "mcq",
      question: "Which of these is a graph database?",
      options: ["Neo4j", "Redis", "MongoDB", "Cassandra"],
      answer: 0,
      explain: "Neo4j is a graph database. Redis is key-value, MongoDB is a document store and Cassandra is wide-column.",
      link: "#uses"
    },
    {
      id: "q5.9-06",
      topic: "5.9",
      type: "tf",
      question: "In SQL, each extra hop in a friends-of-friends query usually adds more joins.",
      answer: true,
      explain: "Each hop joins the friendship table again. In Cypher, the pattern just gets one more relationship.",
      link: "#sql"
    },
    /* 5.10 Database Security: Security Issues */
    {
      id: "q5.10-01",
      topic: "5.10",
      type: "mcq",
      question: "A hacker copies a list of customers' phone numbers but changes nothing. Which loss is this?",
      options: ["Loss of integrity", "Loss of availability", "Loss of confidentiality", "Loss of durability"],
      answer: 2,
      explain: "Private data was seen by someone who should not see it. That is loss of confidentiality.",
      link: "#threats"
    },
    {
      id: "q5.10-02",
      topic: "5.10",
      type: "mcq",
      question: "A program bug sets every student's attendance to 0%. Which loss is this?",
      options: ["Loss of integrity", "Loss of availability", "Loss of confidentiality", "No loss, since no one meant harm"],
      answer: 0,
      explain: "The data is now wrong. Integrity can be lost by accident as well as on purpose.",
      link: "#classify"
    },
    {
      id: "q5.10-03",
      topic: "5.10",
      type: "multi",
      question: "Which are the four main control measures for database security? Select all that apply.",
      options: ["Access control", "Inference control", "Flow control", "Data encryption", "Normalization"],
      answer: [0, 1, 2, 3],
      explain: "The four control measures are access control, inference control, flow control and encryption. Normalization is a design method, not a security control.",
      link: "#controls"
    },
    {
      id: "q5.10-04",
      topic: "5.10",
      type: "mcq",
      question: "A statistical database answers an AVG query for a group with only one person. Which control should have stopped this?",
      options: ["Flow control", "Inference control", "Encryption", "Backup"],
      answer: 1,
      explain: "Inference control stops users from working out one person's value from summary answers, for example by refusing very small groups.",
      link: "#inference"
    },
    {
      id: "q5.10-05",
      topic: "5.10",
      type: "mcq",
      question: "What are covert channels?",
      options: ["Encrypted network links", "Hidden paths that let information flow against the security policy", "Backup copies of the database", "Roles in RBAC"],
      answer: 1,
      explain: "Flow control tries to block covert channels, the hidden paths that leak information to unauthorized users.",
      link: "#controls"
    },
    {
      id: "q5.10-06",
      topic: "5.10",
      type: "multi",
      question: "Which actions does the DBA perform with the superuser account? Select all that apply.",
      options: ["Account creation", "Privilege granting", "Privilege revocation", "Security level assignment"],
      answer: [0, 1, 2, 3],
      explain: "The DBA creates accounts, grants and revokes privileges, and assigns security levels.",
      link: "#dba"
    },
    /* 5.11 Access Control Based on Privileges */
    {
      id: "q5.11-01",
      topic: "5.11",
      type: "mcq",
      question: "In discretionary access control (DAC), who decides who may use a table?",
      options: ["The operating system", "The owner of the table", "A security level chosen by the government", "Any user who can log in"],
      answer: 1,
      explain: "In DAC, the owner grants and revokes privileges at their own discretion.",
      link: "#what"
    },
    {
      id: "q5.11-02",
      topic: "5.11",
      type: "mcq",
      question: "In the access matrix, what do the rows stand for?",
      options: ["Objects such as tables", "Subjects such as users and programs", "Privileges", "Security levels"],
      answer: 1,
      explain: "Rows are subjects, columns are objects, and each cell lists the privileges of that subject on that object.",
      link: "#matrix"
    },
    {
      id: "q5.11-03",
      topic: "5.11",
      type: "mcq",
      question: "Which statement lets Ravi read the marks table and also pass that right to others?",
      options: ["GRANT SELECT ON college.marks TO 'ravi'@'localhost';", "GRANT SELECT ON college.marks TO 'ravi'@'localhost' WITH GRANT OPTION;", "REVOKE SELECT ON college.marks FROM 'ravi'@'localhost';", "CREATE USER 'ravi'@'localhost';"],
      answer: 1,
      explain: "WITH GRANT OPTION allows the receiver to grant the same privilege to other users.",
      link: "#propagation"
    },
    {
      id: "q5.11-04",
      topic: "5.11",
      type: "mcq",
      question: "DBA grants SELECT to A with grant option; A grants it to B; the DBA also grants it directly to B. The DBA revokes from A with CASCADE. What happens to B?",
      options: ["B loses SELECT", "B keeps SELECT, because of the direct grant from the DBA", "B gets the grant option", "The REVOKE fails"],
      answer: 1,
      explain: "CASCADE removes privileges that depended only on A. B still holds SELECT through the DBA's direct grant.",
      link: "#chain"
    },
    {
      id: "q5.11-05",
      topic: "5.11",
      type: "mcq",
      question: "Under Bell-LaPadula, a user with Secret clearance asks to write into an Unclassified table. What is the decision?",
      options: ["Allowed, because Secret is higher", "Denied, because of the no write down rule", "Allowed only with GRANT OPTION", "Denied, because of the no read up rule"],
      answer: 1,
      explain: "The star property forbids writing down, so secret data cannot leak into a lower level.",
      link: "#blp"
    },
    {
      id: "q5.11-06",
      topic: "5.11",
      type: "tf",
      question: "In MySQL, a GRANT can name chosen rows of a table directly, such as only CSE students.",
      answer: false,
      explain: "GRANT works on databases, tables, columns and views. To limit rows, create a view with a WHERE clause and grant on the view.",
      link: "#grant"
    },
    /* 5.12 Role Based Access Control */
    {
      id: "q5.12-01",
      topic: "5.12",
      type: "mcq",
      question: "In RBAC, privileges are given directly to what?",
      options: ["Users", "Roles", "Tables", "Security levels"],
      answer: 1,
      explain: "Privileges go to roles, and users get privileges by being assigned roles.",
      link: "#what"
    },
    {
      id: "q5.12-02",
      topic: "5.12",
      type: "mcq",
      question: "HOD inherits Teacher, and Teacher inherits Staff. Which privileges does a user with only the HOD role get?",
      options: ["Only HOD privileges", "HOD and Teacher privileges, but not Staff", "HOD, Teacher and Staff privileges", "None until the DBA grants each table"],
      answer: 2,
      explain: "In a role hierarchy, a senior role inherits all privileges of the roles below it, step by step.",
      link: "#hierarchy"
    },
    {
      id: "q5.12-03",
      topic: "5.12",
      type: "order",
      question: "Put the MySQL 8.4 steps for giving Ravi the teacher role in order.",
      options: [
        "CREATE ROLE 'teacher';",
        "GRANT SELECT, INSERT, UPDATE ON college.marks TO 'teacher';",
        "GRANT 'teacher' TO 'ravi'@'%';",
        "SET DEFAULT ROLE ALL TO 'ravi'@'%';"
      ],
      explain: "Create the role, give it privileges, give the role to the user, then make it active at login.",
      link: "#mysql"
    },
    {
      id: "q5.12-04",
      topic: "5.12",
      type: "tf",
      question: "In MySQL 8.4, a role granted to a user is always active as soon as it is granted.",
      answer: false,
      explain: "The role must be activated with SET DEFAULT ROLE (at login) or SET ROLE (for a session).",
      link: "#mysql"
    },
    {
      id: "q5.12-05",
      topic: "5.12",
      type: "mcq",
      question: "No user may ever hold both the fee_entry and the fee_approver roles. What is this rule called?",
      options: ["Role hierarchy", "Static separation of duties", "No write down", "Grant option"],
      answer: 1,
      explain: "Static separation of duties makes the two roles mutually exclusive for every user.",
      link: "#sod"
    },
    {
      id: "q5.12-06",
      topic: "5.12",
      type: "mcq",
      question: "A college adds a new attendance table that all 200 teachers need. With RBAC, how many grants are needed?",
      options: ["200", "1, to the teacher role", "400", "0, it is automatic"],
      answer: 1,
      explain: "One grant to the teacher role reaches every user who holds that role.",
      link: "#changes"
    },
    /* 5.13 SQL Injection */
    {
      id: "q5.13-01",
      topic: "5.13",
      type: "mcq",
      question: "What is the root cause of SQL injection?",
      options: ["A weak database password", "User input joined directly into an SQL query", "Too many indexes", "Using MySQL instead of Oracle"],
      answer: 1,
      explain: "When input is pasted into the query text, a quote in it can end the string and turn the rest into SQL code.",
      link: "#how"
    },
    {
      id: "q5.13-02",
      topic: "5.13",
      type: "mcq",
      question: "The password field gets ' OR '1'='1. Why does the unsafe login succeed?",
      options: ["The password is guessed", "The WHERE clause becomes true for every row", "MySQL ignores the password column", "The user table is deleted"],
      answer: 1,
      explain: "AND is done before OR, so the condition becomes (... AND password = '') OR '1'='1', which is true for every row.",
      link: "#examples"
    },
    {
      id: "q5.13-03",
      topic: "5.13",
      type: "mcq",
      question: "In the input admin' -- , what does the -- do in MySQL?",
      options: ["Subtracts two numbers", "Starts a comment, so the password check is ignored", "Ends the statement", "Joins two queries"],
      answer: 1,
      explain: "-- followed by a space starts a comment. Everything after it, including the password check, is ignored.",
      link: "#examples"
    },
    {
      id: "q5.13-04",
      topic: "5.13",
      type: "mcq",
      question: "An attacker sees no data or errors, but learns one yes-or-no answer at a time from how the page changes. Which type is this?",
      options: ["UNION based", "Boolean-based blind", "Error based", "Out-of-band"],
      answer: 1,
      explain: "Blind injection shows nothing directly. In boolean-based blind injection, the attacker asks true or false questions and watches the page.",
      link: "#types"
    },
    {
      id: "q5.13-05",
      topic: "5.13",
      type: "mcq",
      question: "Which is the main defense against SQL injection?",
      options: ["Hiding error messages", "Prepared statements with ? placeholders", "Longer passwords", "Adding more indexes"],
      answer: 1,
      explain: "Prepared statements send the SQL and the values separately, so a value can never change the query.",
      link: "#prevention"
    },
    {
      id: "q5.13-06",
      topic: "5.13",
      type: "tf",
      question: "conn.prepareStatement(\"SELECT * FROM users WHERE name = '\" + user + \"'\") is safe because it uses a prepared statement.",
      answer: false,
      explain: "The input was joined into the text before preparing. Only input passed through a ? placeholder is safe.",
      link: "#prepared"
    },
    {
      id: "q5.13-07",
      topic: "5.13",
      type: "multi",
      question: "Which measures help prevent or limit SQL injection? Select all that apply.",
      options: ["Prepared statements", "Allow-list input validation", "Giving the web app account only the privileges it needs", "Showing full database errors to users"],
      answer: [0, 1, 2],
      explain: "Parameters, validation and least privilege all help. Showing full errors helps attackers, so errors should be hidden and logged.",
      link: "#prevention"
    },
    /* 5.14 Encryption and Public Key Infrastructures */
    {
      id: "q5.14-01",
      topic: "5.14",
      type: "mcq",
      question: "In symmetric encryption, which key decrypts the data?",
      options: ["The receiver's public key", "The same key that encrypted it", "The sender's private key", "No key is needed"],
      answer: 1,
      explain: "Symmetric encryption, such as AES, uses one shared secret key for both encryption and decryption.",
      link: "#symmetric"
    },
    {
      id: "q5.14-02",
      topic: "5.14",
      type: "mcq",
      question: "Asha wants to send Ravi a secret message using public key encryption. Which key does she encrypt with?",
      options: ["Asha's private key", "Ravi's public key", "Ravi's private key", "A key both of them chose in public"],
      answer: 1,
      explain: "Anyone can encrypt with Ravi's public key, and only Ravi's private key can decrypt it.",
      link: "#asymmetric"
    },
    {
      id: "q5.14-03",
      topic: "5.14",
      type: "mcq",
      question: "In RSA with p = 3, q = 11 and e = 3, what is n?",
      options: ["14", "20", "33", "7"],
      answer: 2,
      explain: "n = p × q = 3 × 11 = 33. φ(n) = 20, and the private exponent d is 7.",
      link: "#rsa"
    },
    {
      id: "q5.14-04",
      topic: "5.14",
      type: "mcq",
      question: "How is a digital signature made?",
      options: ["Encrypt the message hash with the sender's private key", "Encrypt the message with the receiver's public key", "Hash the password with a salt", "Send the private key with the message"],
      answer: 0,
      explain: "The sender encrypts the hash with their private key. Anyone can check it with the sender's public key.",
      link: "#signatures"
    },
    {
      id: "q5.14-05",
      topic: "5.14",
      type: "multi",
      question: "Which are parts of a public key infrastructure (PKI)? Select all that apply.",
      options: ["Certificate authority", "Registration authority", "Certificate revocation list", "Column family"],
      answer: [0, 1, 2],
      explain: "A PKI has CAs, RAs, certificates, repositories and revocation lists. Column families belong to wide-column NoSQL stores.",
      link: "#pki"
    },
    {
      id: "q5.14-06",
      topic: "5.14",
      type: "tf",
      question: "Passwords should be stored encrypted with AES so the DBA can read them when needed.",
      answer: false,
      explain: "Passwords are hashed with a salt, which cannot be reversed. Encrypted passwords could all be read by anyone with the key.",
      link: "#hashing"
    },
    {
      id: "q5.14-07",
      topic: "5.14",
      type: "mcq",
      question: "Why do TLS connections use both asymmetric and symmetric encryption?",
      options: ["Asymmetric shares a key safely; symmetric then encrypts the data fast", "Symmetric is used only for certificates", "Asymmetric is faster for large data", "It is required by SQL"],
      answer: 0,
      explain: "This is hybrid encryption: the slow public key method shares a fresh AES key, and fast AES encrypts the data.",
      link: "#asymmetric"
    }
  ]);
})();
