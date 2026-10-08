/* Unit V question bank items.
   Every question is mapped to its unit, never to a test or exam paper, because
   test papers change each semester.
   id: "u5-a1" is Unit V, Part A, question 1 of the unit question bank. A question
   that is not in the unit bank takes the next free number in its part, and its
   source is { bank: "Unit V", extra: true }.
   "original" keeps the source wording; "question" is the corrected wording shown
   on the site. "parts" lists the a), b) sub-questions and "include" is the hint
   printed under some 16-mark questions; both are optional. "answer" is the 2-mark
   answer (HTML), or null. "outline" is true when a 16-mark question
   has an answer outline in data/outlines, or null. */
(function () {
  var D = (window.DBMS = window.DBMS || {});
  D.questions = (D.questions || []).concat([
    {
      id: "u5-a1",
      unit: 5,
      part: "A",
      marks: 2,
      topics: ["5.1"],
      sources: [{ bank: "Unit V", no: 1 }],
      original: "What is a distributed database?",
      question: "What is a distributed database?",
      answer:
        "<p>A <strong>distributed database</strong> is a collection of related data stored at <strong>several sites</strong> that are connected by a <strong>network</strong>. Each site has its own DBMS and can work on its own local data. To users, the whole system looks like <strong>one single database</strong> (transparency).</p>" +
        "<p>Example: a bank keeps each branch's accounts at that branch, but a customer can see their balance from any branch.</p>"
    },
    {
      id: "u5-a2",
      unit: 5,
      part: "A",
      marks: 2,
      topics: ["5.1"],
      sources: [{ bank: "Unit V", no: 2 }],
      original: "List any two advantages of using distributed databases.",
      question: "List any two advantages of using distributed databases.",
      answer:
        "<ol>" +
        "<li><strong>Reliability and availability:</strong> if one site fails, the other sites keep working. With <strong>replication</strong>, its data is still available from another site.</li>" +
        "<li><strong>Faster local access:</strong> data is stored near the users who need it most, so most queries do not cross the network.</li>" +
        "</ol>" +
        "<p>Others: sharing of data between sites, local control and easy growth by adding sites.</p>"
    },
    {
      id: "u5-a3",
      unit: 5,
      part: "A",
      marks: 2,
      topics: ["5.2"],
      sources: [{ bank: "Unit V", no: 3 }],
      original: "Differentiate between homogeneous and heterogeneous distributed databases.",
      question: "Differentiate between homogeneous and heterogeneous distributed databases.",
      answer:
        "<table><thead><tr><th>Homogeneous</th><th>Heterogeneous</th></tr></thead><tbody>" +
        "<tr><td>All sites use the <strong>same DBMS</strong> software and schema.</td><td>Sites may use <strong>different DBMS</strong> software and schemas.</td></tr>" +
        "<tr><td>Sites know each other and <strong>cooperate</strong> fully.</td><td>Sites may know little about each other; they cooperate only in a limited way.</td></tr>" +
        "<tr><td><strong>Easy</strong> to design and manage.</td><td>Needs translation between systems, so it is <strong>harder</strong>.</td></tr>" +
        "</tbody></table>"
    },
    {
      id: "u5-a4",
      unit: 5,
      part: "A",
      marks: 2,
      topics: ["5.3"],
      sources: [{ bank: "Unit V", no: 4 }],
      original: "Define a distributed transaction.",
      question: "Define a distributed transaction.",
      answer:
        "<p>A <strong>distributed transaction</strong> (global transaction) is a transaction that <strong>reads or updates data at more than one site</strong>. A transaction that uses data at only one site is a local transaction.</p>" +
        "<p>A <strong>transaction coordinator</strong> controls it, and a <strong>commit protocol</strong> such as two-phase commit makes sure it commits at all sites or at none.</p>" +
        "<p>Example: moving money from an account in the Chennai branch to one in the Salem branch.</p>"
    },
    {
      id: "u5-a5",
      unit: 5,
      part: "A",
      marks: 2,
      topics: ["5.3"],
      sources: [{ bank: "Unit V", no: 5 }],
      original: "What is the difference between a single-phase and a two-phase commit protocol?",
      question: "What is the difference between the single-phase and two-phase commit protocols?",
      answer:
        "<table><thead><tr><th>Single-phase commit</th><th>Two-phase commit (2PC)</th></tr></thead><tbody>" +
        "<tr><td>The coordinator simply <strong>tells every site to commit</strong>.</td><td><strong>Phase 1 (prepare):</strong> the coordinator asks every site to vote. <strong>Phase 2 (commit):</strong> it commits only if <strong>all vote yes</strong>; otherwise it aborts.</td></tr>" +
        "<tr><td>A site cannot refuse, so a failure can break <strong>atomicity</strong>.</td><td>Guarantees <strong>atomicity</strong> across all sites.</td></tr>" +
        "<tr><td>Fewer messages.</td><td>More messages and waiting.</td></tr>" +
        "</tbody></table>"
    },
    {
      id: "u5-a6",
      unit: 5,
      part: "A",
      marks: 2,
      topics: ["5.4"],
      sources: [{ bank: "Unit V", no: 6 }],
      original: "Define NoSQL databases. Mention any two advantages.",
      question: "Define NoSQL databases. Mention any two advantages.",
      answer:
        "<p><strong>NoSQL</strong> (\"not only SQL\") databases are <strong>non-relational</strong> databases. They store data as <strong>documents, key-value pairs, wide columns or graphs</strong>, usually without a fixed schema.</p>" +
        "<ol>" +
        "<li><strong>Horizontal scaling:</strong> they grow by adding more ordinary servers.</li>" +
        "<li><strong>Flexible schema:</strong> records can have different fields, which suits semi-structured data such as JSON.</li>" +
        "</ol>"
    },
    {
      id: "u5-a7",
      unit: 5,
      part: "A",
      marks: 2,
      topics: ["5.5"],
      sources: [{ bank: "Unit V", no: 7 }],
      original: "State the CAP theorem.",
      question: "State the CAP theorem.",
      answer:
        "<p>The <strong>CAP theorem</strong> states that a distributed system can guarantee <strong>at most two</strong> of these three properties at the same time:</p>" +
        "<ul>" +
        "<li><strong>Consistency (C):</strong> every read sees the latest write.</li>" +
        "<li><strong>Availability (A):</strong> every request gets a response.</li>" +
        "<li><strong>Partition tolerance (P):</strong> the system keeps working when the network splits.</li>" +
        "</ul>" +
        "<p>Network partitions cannot be avoided, so a system must choose <strong>C or A</strong> during a partition.</p>"
    },
    {
      id: "u5-a8",
      unit: 5,
      part: "A",
      marks: 2,
      topics: ["5.6"],
      sources: [{ bank: "Unit V", no: 8 }],
      original: "Name any two document-based NoSQL systems.",
      question: "Name any two document-based NoSQL systems.",
      answer:
        "<ol>" +
        "<li><strong>MongoDB:</strong> stores documents in a binary JSON format (BSON) and is queried with the mongosh shell.</li>" +
        "<li><strong>Apache CouchDB:</strong> stores JSON documents and is used through a web (HTTP) interface.</li>" +
        "</ol>" +
        "<p>Both store data as <strong>documents</strong>, grouped into <strong>collections</strong> or databases. Each document can have its own fields. Example document:</p>" +
        "<pre><code class=\"language-json\">{ \"rollNo\": 101, \"name\": \"Anu\", \"skills\": [\"SQL\", \"Java\"] }</code></pre>"
    },
    {
      id: "u5-a9",
      unit: 5,
      part: "A",
      marks: 2,
      topics: ["5.7"],
      sources: [{ bank: "Unit V", no: 9 }],
      original: "What is a key-value store? Give an example.",
      question: "What is a key-value store? Give an example.",
      answer:
        "<p>A <strong>key-value store</strong> is a NoSQL database that stores data as pairs of a <strong>unique key</strong> and a <strong>value</strong>. The database does not look inside the value. Data is read and written only by key, with simple operations such as get(key) and put(key, value), so it is very fast.</p>" +
        "<p>Examples: <strong>Redis</strong> and <strong>Amazon DynamoDB</strong>. Use: storing a shopping cart under the key \"cart:user42\".</p>"
    },
    {
      id: "u5-a10",
      unit: 5,
      part: "A",
      marks: 2,
      topics: ["5.8"],
      sources: [{ bank: "Unit V", no: 10 }],
      original: "What is a column-based NoSQL database? Name one example.",
      question: "What is a column-based NoSQL database? Name one example.",
      answer:
        "<p>A <strong>column-based</strong> (wide-column) NoSQL database stores data in rows, but groups the columns into <strong>column families</strong>. Each row can have a <strong>different set of columns</strong>, and each column family is stored together. It handles very large data and fast writes across many servers.</p>" +
        "<p>Example: <strong>Apache Cassandra</strong> (also Apache HBase).</p>"
    },
    {
      id: "u5-a11",
      unit: 5,
      part: "A",
      marks: 2,
      topics: ["5.9"],
      sources: [{ bank: "Unit V", no: 11 }],
      original: "Define a graph database. Mention one application of it.",
      question: "Define a graph database. Mention one application of it.",
      answer:
        "<p>A <strong>graph database</strong> stores data as a graph:</p>" +
        "<ul>" +
        "<li><strong>nodes</strong> for entities (people, places),</li>" +
        "<li><strong>edges</strong> for the relationships between them, and</li>" +
        "<li><strong>properties</strong> on both.</li>" +
        "</ul>" +
        "<p>Example: <strong>Neo4j</strong>.</p>" +
        "<p><strong>Application:</strong> a social network uses it to suggest \"friends of friends\" by following edges quickly.</p>"
    },
    {
      id: "u5-a12",
      unit: 5,
      part: "A",
      marks: 2,
      topics: ["5.10"],
      sources: [{ bank: "Unit V", no: 12 }],
      original: "Mention two common security issues in databases.",
      question: "Mention two common security issues in databases.",
      answer:
        "<ol>" +
        "<li><strong>Unauthorized access (loss of confidentiality):</strong> a person reads data they should not see, such as other students' marks or bank details.</li>" +
        "<li><strong>Improper modification (loss of integrity):</strong> data is changed or deleted wrongly, for example through <strong>SQL injection</strong>.</li>" +
        "</ol>" +
        "<p>Another issue is <strong>loss of availability</strong>, for example a denial-of-service attack.</p>"
    },
    {
      id: "u5-a13",
      unit: 5,
      part: "A",
      marks: 2,
      topics: ["5.12"],
      sources: [{ bank: "Unit V", no: 13 }],
      original: "What is Role-Based Access Control (RBAC)?",
      question: "What is role-based access control (RBAC)?",
      answer:
        "<p>In <strong>role-based access control (RBAC)</strong>, privileges are given to <strong>roles</strong> (such as Teacher or Student), not directly to users. Each user is assigned one or more roles and gets their privileges. This makes privileges easy to manage.</p>" +
        "<pre><code class=\"language-sql\">CREATE ROLE teacher;\nGRANT SELECT, UPDATE ON college.marks TO teacher;\nGRANT teacher TO 'ravi'@'localhost';</code></pre>"
    },
    {
      id: "u5-a14",
      unit: 5,
      part: "A",
      marks: 2,
      topics: ["5.13"],
      sources: [{ bank: "Unit V", no: 14 }],
      original: "Define SQL injection. Why is it dangerous?",
      question: "Define SQL injection. Why is it dangerous?",
      answer:
        "<p><strong>SQL injection</strong> is an attack in which a user types <strong>SQL code into an input field</strong>. The application adds this input directly to its query, so the meaning of the query changes.</p>" +
        "<p>Example: typing <code>' OR '1'='1</code> as a password can make the login check always true.</p>" +
        "<p><strong>Why dangerous:</strong> an attacker can <strong>bypass login</strong>, <strong>read secret data</strong>, or <strong>change and delete</strong> data.</p>"
    },
    {
      id: "u5-a15",
      unit: 5,
      part: "A",
      marks: 2,
      topics: ["5.14"],
      sources: [{ bank: "Unit V", no: 15 }],
      original: "What is Public Key Infrastructure (PKI) in database security?",
      question: "What is public key infrastructure (PKI) in database security?",
      answer:
        "<p><strong>Public key infrastructure (PKI)</strong> is the set of <strong>certificate authorities (CAs)</strong>, policies and software that create, share, manage and cancel <strong>digital certificates</strong>. A certificate links a <strong>public key</strong> to its owner, so others can trust that key.</p>" +
        "<p>In databases, PKI is used to:</p>" +
        "<ul>" +
        "<li><strong>encrypt connections</strong> between clients and the server (TLS),</li>" +
        "<li><strong>authenticate</strong> users and servers, and</li>" +
        "<li>check <strong>digital signatures</strong>.</li>" +
        "</ul>"
    },
    {
      id: "u5-b1",
      unit: 5,
      part: "B",
      marks: 16,
      topics: ["5.1"],
      sources: [{ bank: "Unit V", no: 1 }],
      original: "Explain the architecture of distributed databases with a neat diagram.",
      question: "Explain the architecture of distributed databases with a neat diagram.",
      answer: null,
      outline: null
    },
    {
      id: "u5-b2",
      unit: 5,
      part: "B",
      marks: 16,
      topics: ["5.2"],
      sources: [{ bank: "Unit V", no: 2 }],
      original: "Discuss the types of distributed databases (homogeneous, heterogeneous, federated, etc.) with examples.",
      question: "Discuss the types of distributed databases (homogeneous, heterogeneous, federated and others) with examples.",
      answer: null,
      outline: null
    },
    {
      id: "u5-b3",
      unit: 5,
      part: "B",
      marks: 16,
      topics: ["5.3"],
      sources: [{ bank: "Unit V", no: 3 }],
      original: "Describe transaction management in distributed databases. Explain the two-phase commit protocol.",
      question: "Describe transaction management in distributed databases. Explain the two-phase commit protocol.",
      answer: null,
      outline: null
    },
    {
      id: "u5-b4",
      unit: 5,
      part: "B",
      marks: 16,
      topics: ["5.5"],
      sources: [{ bank: "Unit V", no: 4 }],
      original: "Explain the CAP theorem in detail. How does it apply to distributed systems?",
      question: "Explain the CAP theorem in detail. How does it apply to distributed systems?",
      answer: null,
      outline: null
    },
    {
      id: "u5-b5",
      unit: 5,
      part: "B",
      marks: 16,
      topics: ["5.4", "5.6", "5.7", "5.8", "5.9"],
      sources: [{ bank: "Unit V", no: 5 }],
      original: "Compare and contrast the four main types of NoSQL databases (document, key-value, column-based, graph) with examples.",
      question: "Compare and contrast the four main types of NoSQL databases (document, key-value, column-based and graph) with examples.",
      answer: null,
      outline: null
    },
    {
      id: "u5-b6",
      unit: 5,
      part: "B",
      marks: 16,
      topics: ["5.6"],
      sources: [{ bank: "Unit V", no: 6 }],
      original: "Explain document-based NoSQL databases. How do they differ from relational databases?",
      question: "Explain document-based NoSQL databases. How do they differ from relational databases?",
      answer: null,
      outline: null
    },
    {
      id: "u5-b7",
      unit: 5,
      part: "B",
      marks: 16,
      topics: ["5.10"],
      sources: [{ bank: "Unit V", no: 7 }],
      original: "Explain database security issues in detail.",
      question: "Explain database security issues in detail.",
      answer: null,
      outline: null
    },
    {
      id: "u5-b8",
      unit: 5,
      part: "B",
      marks: 16,
      topics: ["5.11", "5.12"],
      sources: [{ bank: "Unit V", no: 8 }],
      original: "Describe access control based on privileges and Role-Based Access Control (RBAC).",
      question: "Describe access control based on privileges and role-based access control (RBAC).",
      answer: null,
      outline: null
    },
    {
      id: "u5-b9",
      unit: 5,
      part: "B",
      marks: 16,
      topics: ["5.13"],
      sources: [{ bank: "Unit V", no: 9 }],
      original: "What is SQL injection? Explain its types, impacts, and prevention techniques.",
      question: "What is SQL injection? Explain its types, impacts and prevention techniques, with examples.",
      answer: null,
      outline: null
    },
    {
      id: "u5-b10",
      unit: 5,
      part: "B",
      marks: 16,
      topics: ["5.14", "5.15"],
      sources: [{ bank: "Unit V", no: 10 }],
      original: "Explain encryption and public key infrastructures used in databases. What challenges are involved in database security?",
      question: "Explain encryption and the public key infrastructures used in databases. What challenges are involved in database security?",
      answer: null,
      outline: null
    }
  ]);
})();
