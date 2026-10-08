/* Unit V 16-mark answer outlines, keyed by question id. See assets/js/outlines.js for the shape.
   Each outline is a plan only. The pages it links to hold the content the student must write out. */
(function () {
  var D = (window.DBMS = window.DBMS || {});
  D.outlines = D.outlines || {};

  D.outlines["u5-b1"] = {
    aim: "Define a distributed database, draw the general architecture with sites and the network, explain each component, then cover how data is stored (replication and fragmentation), transparency, and merits and demerits. The labelled diagram is essential.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["5.1#what"],
        points: [
          "Define a distributed database and a distributed DBMS; say how it differs from a centralized database.",
          "Give an example: a bank or college with branches in Salem, Chennai and Coimbatore."
        ]
      },
      {
        title: "The architecture diagram",
        pages: 1,
        see: ["5.1#architecture", "5.1#try-it"],
        points: [
          "Draw the general architecture across half a page, then explain the flow of a query that needs data from two sites."
        ],
        draw: ["Three sites, each with users, a local DBMS and a local database, joined by a communication network."]
      },
      {
        title: "Components of the architecture",
        pages: 0.75,
        see: ["5.1#architecture", "5.3#system"],
        points: [
          "Sites, local DBMS, communication network, global system catalog, transaction manager and transaction coordinator.",
          "Local and global transactions."
        ]
      },
      {
        title: "Data storage: replication and fragmentation",
        pages: 1.25,
        see: ["5.1#storage"],
        points: [
          "Replication: full, partial, none; merits (availability, parallel reads) and demerits (update cost).",
          "Fragmentation: horizontal (by rows), vertical (by columns, keeping the key) and mixed; the rule that the fragments must rebuild the relation."
        ],
        example: ["A student relation split horizontally by campus and vertically into personal and academic columns, with the SQL or relational algebra for each fragment."]
      },
      {
        title: "Transparency",
        pages: 0.5,
        see: ["5.1#transparency"],
        points: [
          "Fragmentation, replication and location transparency, with one line each."
        ]
      },
      {
        title: "Centralized and distributed compared",
        pages: 0.5,
        see: ["5.1#compare"],
        points: [
          "Compare the two in a table."
        ],
        table: ["Centralized and distributed databases: location, availability, cost, complexity, performance."]
      },
      {
        title: "Merits, demerits and conclusion",
        pages: 0.75,
        see: ["5.1#merits"],
        points: [
          "Merits: local autonomy, availability, reliability, faster local access, growth.",
          "Demerits: complexity, cost, security, harder concurrency and recovery. Then conclude."
        ]
      }
    ]
  };

  D.outlines["u5-b2"] = {
    aim: "Explain the two questions that decide the type (same software or not, how much local control), then homogeneous, heterogeneous and federated systems each with a diagram, an example, merits and demerits. Close with a comparison table.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["5.1#what", "5.2#overview"],
        points: [
          "Define a distributed database in one sentence.",
          "The two deciding questions: do all sites run the same DBMS, and how independent is each site?"
        ]
      },
      {
        title: "Homogeneous distributed databases",
        pages: 1.25,
        see: ["5.2#homogeneous"],
        points: [
          "Same DBMS and schema at every site; sites know each other and cooperate.",
          "Example: a bank running the same DBMS in every branch.",
          "Merits: easy to design and manage. Demerits: every site must use the same software."
        ],
        draw: ["Several sites with the same DBMS joined by a network."]
      },
      {
        title: "Heterogeneous distributed databases",
        pages: 1.25,
        see: ["5.2#heterogeneous"],
        points: [
          "Different DBMSs, schemas or data models at different sites; gateways or middleware translate between them.",
          "Example: one site on MySQL, another on Oracle, another on MongoDB, after a merger.",
          "Merits: uses existing systems. Demerits: translation, harder transactions."
        ],
        draw: ["Sites with different DBMSs connected through middleware."]
      },
      {
        title: "Federated (multidatabase) systems",
        pages: 1,
        see: ["5.2#federated"],
        points: [
          "Autonomous databases that agree to share some data through a federated schema; each keeps full local control.",
          "Loosely and tightly coupled federations.",
          "Example: hospitals sharing patient summaries."
        ]
      },
      {
        title: "Other ways to classify",
        pages: 0.5,
        see: ["5.1#storage"],
        points: [
          "By data placement: replicated, fragmented or both.",
          "By architecture: client-server and peer-to-peer."
        ]
      },
      {
        title: "Comparison and conclusion",
        pages: 0.75,
        see: ["5.2#compare"],
        points: [
          "Compare the types, then conclude on when each is used."
        ],
        table: ["Homogeneous, heterogeneous and federated compared: DBMS at sites, schema, autonomy, complexity, example."]
      }
    ]
  };

  D.outlines["u5-b3"] = {
    aim: "Explain local and global transactions, the transaction manager and coordinator, and the failures special to distributed systems. Then two-phase commit with both phases, the log records, a message diagram, and how it handles each kind of failure. Mention 3PC to finish.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["5.3#basics"],
        points: [
          "Local and global transactions; why atomicity is harder when a transaction runs at several sites."
        ]
      },
      {
        title: "System structure",
        pages: 0.75,
        see: ["5.3#system"],
        points: [
          "Transaction manager at each site: log, concurrency control.",
          "Transaction coordinator: starts the transaction, splits it into subtransactions, runs the commit protocol."
        ],
        draw: ["Two sites, each with a transaction coordinator and transaction manager above its local database."]
      },
      {
        title: "Failure modes",
        pages: 0.5,
        see: ["5.3#failures"],
        points: [
          "Site failure, loss of messages, communication link failure, network partition."
        ]
      },
      {
        title: "Two-phase commit: phase 1 (voting)",
        pages: 0.75,
        see: ["5.3#two-phase"],
        points: [
          "The coordinator writes &lt;prepare T&gt; and sends prepare T to all sites.",
          "Each site writes &lt;ready T&gt; and replies ready, or writes &lt;no T&gt; and replies abort."
        ]
      },
      {
        title: "Two-phase commit: phase 2 (decision)",
        pages: 1,
        see: ["5.3#two-phase", "5.3#try-it"],
        points: [
          "All ready: the coordinator writes &lt;commit T&gt; and sends commit; otherwise &lt;abort T&gt; and abort.",
          "Each site records the decision and acknowledges."
        ],
        draw: ["A message sequence diagram: coordinator and two participants, with prepare, ready, commit and ack arrows and the log record written at each step."]
      },
      {
        title: "How 2PC handles failures",
        pages: 1,
        see: ["5.3#handling"],
        points: [
          "Participant fails: what it finds in its log on restart (commit, abort, ready, nothing) and what it does.",
          "Coordinator fails: participants decide if any has commit or abort; otherwise they block.",
          "The blocking problem."
        ],
        table: ["Log record found on recovery and the action taken."]
      },
      {
        title: "Three-phase commit and conclusion",
        pages: 0.75,
        see: ["5.3#three-phase", "5.3#compare"],
        points: [
          "3PC adds a pre-commit phase to avoid blocking, assuming no network partition.",
          "Compare 2PC and 3PC, then conclude."
        ],
        table: ["2PC and 3PC compared: phases, messages, blocking, assumptions."]
      }
    ]
  };

  D.outlines["u5-b4"] = {
    aim: "State the three guarantees precisely, state the theorem, prove it with the two-server partition example, then classify real systems as CP, AP or CA and explain the link to ACID and BASE. A diagram of the triangle and the partition example are essential.",
    sections: [
      {
        title: "Introduction: the setting",
        pages: 0.5,
        see: ["5.5#setting"],
        points: [
          "Distributed systems keep copies of data on many servers; the network can fail.",
          "Who proposed the theorem (Eric Brewer, 2000) and who proved it (Gilbert and Lynch, 2002)."
        ]
      },
      {
        title: "The three guarantees",
        pages: 1,
        see: ["5.5#three"],
        points: [
          "<strong>Consistency</strong>: every read sees the latest write.",
          "<strong>Availability</strong>: every request to a working node gets a response.",
          "<strong>Partition tolerance</strong>: the system keeps working when messages between nodes are lost."
        ],
        draw: ["The CAP triangle with C, A and P at the corners and CP, AP, CA on the sides."]
      },
      {
        title: "The theorem",
        pages: 0.5,
        see: ["5.5#theorem"],
        points: [
          "A distributed system can guarantee at most two of the three at once; since partitions happen, the real choice is C or A during a partition."
        ]
      },
      {
        title: "Why only two: a worked example",
        pages: 1,
        see: ["5.5#why", "5.5#try-it"],
        points: [
          "Servers in Chennai and Delhi hold a balance of ₹5,000; the link breaks; ₹4,000 is withdrawn in Chennai.",
          "Delhi either answers ₹5,000 (available, not consistent) or refuses (consistent, not available)."
        ],
        draw: ["The two servers with the broken link and the two possible answers."],
        table: ["S2's two choices: what it keeps and what it loses."]
      },
      {
        title: "CP, AP and CA systems",
        pages: 1,
        see: ["5.5#choices", "5.5#choosing"],
        points: [
          "CP: MongoDB (default), HBase; used for banking and stock.",
          "AP: Cassandra, DynamoDB, CouchDB; used for carts, likes, feeds.",
          "CA: a single-site RDBMS; not possible once there is a network.",
          "Two worked choices: train seat booking (CP) and a social media like count (AP)."
        ],
        table: ["System type, gives up, examples, suitable applications."]
      },
      {
        title: "CAP, ACID and BASE",
        pages: 0.5,
        see: ["5.5#acid-base", "5.4#base"],
        points: [
          "BASE: basically available, soft state, eventual consistency; how AP systems follow it."
        ]
      },
      {
        title: "Merits, criticism and conclusion",
        pages: 0.5,
        see: ["5.5#merits"],
        points: [
          "CAP helps designers choose; it simplifies (consistency is not all or nothing). Then conclude."
        ]
      }
    ]
  };

  D.outlines["u5-b5"] = {
    aim: "A comparison question: introduce NoSQL briefly, describe each of the four types with its data model drawn, an example of stored data, real products and uses, then compare all four in a detailed table. Do not just describe; compare.",
    sections: [
      {
        title: "Introduction to NoSQL",
        pages: 0.75,
        see: ["5.4#what", "5.4#need", "5.4#types"],
        points: [
          "Define NoSQL and why it arose: big data, flexible schemas, scaling out.",
          "List the four types."
        ]
      },
      {
        title: "Document databases",
        pages: 0.75,
        see: ["5.6#what", "5.6#terms"],
        points: [
          "Data as JSON or BSON documents in collections; each document can have its own fields.",
          "Products: MongoDB, CouchDB. Uses: content management, product catalogs."
        ],
        example: ["A student document with an embedded list of courses."]
      },
      {
        title: "Key-value stores",
        pages: 0.75,
        see: ["5.7#what", "5.7#ops"],
        points: [
          "Data as key and value pairs; get, put and delete only.",
          "Products: Redis, DynamoDB. Uses: caching, sessions, shopping carts."
        ],
        example: ["Keys such as session:1001 with their values."]
      },
      {
        title: "Column-based (wide-column) databases",
        pages: 0.75,
        see: ["5.8#what", "5.8#model"],
        points: [
          "Rows with a row key and column families; each row can have different columns.",
          "Products: Cassandra, HBase. Uses: time-series, logs, IoT."
        ],
        draw: ["A row key with two column families and their columns."]
      },
      {
        title: "Graph databases",
        pages: 0.75,
        see: ["5.9#what", "5.9#model"],
        points: [
          "Nodes, relationships and properties; links are stored directly, so traversals are fast.",
          "Products: Neo4j. Uses: social networks, recommendations, fraud detection."
        ],
        draw: ["A small property graph of students, courses and friendships."]
      },
      {
        title: "Detailed comparison",
        pages: 1.25,
        see: ["5.9#four", "5.4#compare"],
        points: [
          "Explain the main rows of the table: when each type is the best fit and when it is not."
        ],
        table: ["Document, key-value, column-based and graph compared: data model, query power, schema, scaling, best use, weak point, example product."]
      },
      {
        title: "Conclusion",
        pages: 0.25,
        points: [
          "Each NoSQL type suits one shape of data; many applications combine an RDBMS with one or more of them."
        ]
      }
    ]
  };

  D.outlines["u5-b6"] = {
    aim: "Explain the document model (documents, collections, embedding and referencing) with a sample document, show the same operations in MongoDB and SQL side by side, then compare document and relational databases point by point.",
    sections: [
      {
        title: "Introduction",
        pages: 0.75,
        see: ["5.6#what", "5.4#types"],
        points: [
          "Define a document database as one type of NoSQL database; JSON and BSON."
        ]
      },
      {
        title: "Documents and collections",
        pages: 0.75,
        see: ["5.6#terms"],
        points: [
          "Document, field, _id, collection, database; how they map to row, column, primary key, table, schema."
        ],
        example: ["A student document with nested address and an array of courses."],
        table: ["Relational term and MongoDB term."]
      },
      {
        title: "Embedding and referencing",
        pages: 1,
        see: ["5.6#design"],
        points: [
          "Embed data read together (one-to-few); reference data shared or growing without limit (one-to-many, many-to-many).",
          "Show the same student and courses data both ways."
        ],
        draw: ["An embedded document, and two documents linked by a reference."]
      },
      {
        title: "Operations: MongoDB and SQL side by side",
        pages: 1,
        see: ["5.6#crud", "5.6#try-it"],
        points: [
          "Insert, find with a condition, update, delete and a count, each in SQL and in MongoDB."
        ],
        table: ["Task, SQL, MongoDB: five rows."]
      },
      {
        title: "MongoDB and CouchDB",
        pages: 0.75,
        see: ["5.6#systems"],
        points: [
          "Key features of each: replica sets and sharding; HTTP API and multi-master replication."
        ]
      },
      {
        title: "Document and relational databases compared",
        pages: 1,
        see: ["5.6#compare", "5.6#merits"],
        points: [
          "Explain each difference, then give merits and demerits of document databases and conclude."
        ],
        table: ["Data model, schema, relationships and joins, transactions, scaling, query language, best use: at least seven rows."]
      }
    ]
  };

  D.outlines["u5-b7"] = {
    aim: "Define database security and its three goals, then explain the types of security issues, the threats (with an example of each), the control measures, and the DBA's role. A worked inference attack and a table of threats and countermeasures make the answer strong.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["5.10#what"],
        points: [
          "Define database security; the goals of confidentiality, integrity and availability."
        ],
        draw: ["The CIA triad."]
      },
      {
        title: "Types of security issues",
        pages: 0.75,
        see: ["5.10#issues"],
        points: [
          "Legal and ethical, policy, system-related, and multilevel classification issues, each with an example.",
          "Mention India's Digital Personal Data Protection Act, 2023."
        ]
      },
      {
        title: "Threats to databases",
        pages: 1,
        see: ["5.10#threats", "5.10#classify"],
        points: [
          "Loss of integrity, loss of availability, loss of confidentiality.",
          "Specific threats: excessive privileges, SQL injection, malware and ransomware, weak authentication, backup exposure, insiders.",
          "Name the threat in a few short scenarios."
        ],
        table: ["Threat, example, what is lost."]
      },
      {
        title: "Control measures",
        pages: 1.25,
        see: ["5.10#controls"],
        points: [
          "Access control (discretionary, mandatory, role-based), inference control, flow control, encryption, auditing.",
          "One or two sentences on each, with a link to the topic that covers it."
        ],
        table: ["Threat and the control that counters it."]
      },
      {
        title: "Worked example: an inference attack",
        pages: 0.75,
        see: ["5.10#inference"],
        points: [
          "Use aggregate queries to work out one person's salary, and the controls that stop it."
        ]
      },
      {
        title: "The DBA's role and conclusion",
        pages: 0.75,
        see: ["5.10#dba", "5.10#merits"],
        points: [
          "Account creation, privilege granting and revoking, security level assignment, audit trails.",
          "Conclude that security needs several layers working together."
        ]
      }
    ]
  };

  D.outlines["u5-b8"] = {
    aim: "Two parts. Discretionary access control: privilege levels, the access matrix, GRANT and REVOKE, propagation with a chain of grants, and mandatory access control in brief. Role-based access control: roles, hierarchies, separation of duties and a MySQL example. Compare DAC, MAC and RBAC at the end.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["5.11#what"],
        points: [
          "Define a privilege and access control; name the three models: DAC, MAC and RBAC."
        ]
      },
      {
        title: "Privilege levels and the access matrix",
        pages: 0.75,
        see: ["5.11#levels", "5.11#matrix"],
        points: [
          "Account level and relation level privileges.",
          "The access matrix: subjects as rows, objects as columns."
        ],
        table: ["An access matrix for three users and three tables."]
      },
      {
        title: "GRANT, REVOKE and propagation",
        pages: 1,
        see: ["5.11#grant", "5.11#propagation", "5.11#chain"],
        points: [
          "GRANT and REVOKE with syntax and examples; WITH GRANT OPTION.",
          "A chain of grants and what a cascading REVOKE removes."
        ],
        draw: ["An authorization graph before and after a REVOKE."]
      },
      {
        title: "Mandatory access control",
        pages: 0.75,
        see: ["5.11#mac", "5.11#blp"],
        points: [
          "Security classes (top secret, secret, confidential, unclassified); Bell-LaPadula's no read up and no write down.",
          "Decide a few read and write requests."
        ]
      },
      {
        title: "Role-based access control",
        pages: 1,
        see: ["5.12#what", "5.12#why", "5.12#hierarchy", "5.12#sod"],
        points: [
          "Users get roles, roles get privileges; why this is easier to manage.",
          "Role hierarchies and separation of duties."
        ],
        draw: ["Users linked to roles linked to privileges, and a small role hierarchy."]
      },
      {
        title: "RBAC in MySQL",
        pages: 0.5,
        see: ["5.12#mysql", "5.12#changes"],
        points: [
          "CREATE ROLE, GRANT to role, GRANT role to user, SET DEFAULT ROLE; what happens when someone changes job."
        ]
      },
      {
        title: "DAC, MAC and RBAC compared, and conclusion",
        pages: 0.75,
        see: ["5.12#compare", "5.11#compare"],
        points: [
          "Compare the three, then conclude."
        ],
        table: ["DAC, MAC and RBAC compared: who decides access, basis, flexibility, use."]
      }
    ]
  };

  D.outlines["u5-b9"] = {
    aim: "Define SQL injection and show exactly how it works on a vulnerable login query, then the types with an example each, the impacts, and the prevention techniques, with a before and after code example using a prepared statement.",
    sections: [
      {
        title: "Definition",
        pages: 0.5,
        see: ["5.13#what"],
        points: [
          "An attack where user input is joined into an SQL statement and changes its meaning.",
          "Why it is one of the most common web attacks."
        ]
      },
      {
        title: "How the attack works",
        pages: 1,
        see: ["5.13#how", "5.13#try-it"],
        points: [
          "Show the vulnerable code that builds the query by string concatenation.",
          "Explain how the quote character ends the string and lets the attacker add SQL."
        ],
        draw: ["A flow: login form, application builds the SQL string, database runs the changed query."]
      },
      {
        title: "Worked examples",
        pages: 1,
        see: ["5.13#examples"],
        points: [
          "Tautology: ' OR '1'='1 and how AND and OR precedence makes it true for every row.",
          "Comment: admin' -- cuts off the password check.",
          "Piggy-backed query: '; DROP TABLE users; --"
        ]
      },
      {
        title: "Types of SQL injection",
        pages: 0.75,
        see: ["5.13#types"],
        points: [
          "In-band (error-based, UNION-based), blind (boolean and time-based), out-of-band, second-order."
        ],
        table: ["Type, how it works, example input."]
      },
      {
        title: "Impacts",
        pages: 0.5,
        see: ["5.13#impacts"],
        points: [
          "Data theft, authentication bypass, data changed or deleted, full server control, legal and reputation damage."
        ]
      },
      {
        title: "Prevention",
        pages: 1,
        see: ["5.13#prevention", "5.13#prepared"],
        points: [
          "Prepared statements (parameterized queries), stored procedures, input validation with allow-lists, least privilege, escaping as a last resort, web application firewalls, error messages that hide details.",
          "Show the vulnerable code and the fixed code with a prepared statement."
        ]
      },
      {
        title: "Conclusion",
        pages: 0.25,
        points: [
          "Never build SQL from user input; prepared statements stop almost all injection."
        ]
      }
    ]
  };

  D.outlines["u5-b10"] = {
    aim: "Two parts, about 3 and 2 pages. Encryption: symmetric and asymmetric with diagrams, a small RSA example, hashing, digital signatures, certificates and PKI, and encryption in MySQL. Challenges: data quality, intellectual property, survivability, privacy and newer challenges, each with an example.",
    sections: [
      {
        title: "Encryption basics",
        pages: 0.5,
        see: ["5.14#basics"],
        points: [
          "Plaintext, ciphertext, key, encryption and decryption; encryption at rest and in transit."
        ]
      },
      {
        title: "Symmetric and asymmetric encryption",
        pages: 1,
        see: ["5.14#symmetric", "5.14#asymmetric", "5.14#compare"],
        points: [
          "Symmetric: one shared key (AES); fast; the key-sharing problem.",
          "Asymmetric: public and private key pair (RSA); slower; solves key sharing."
        ],
        draw: ["Sender, key, ciphertext, receiver for each method."],
        table: ["Symmetric and asymmetric compared."]
      },
      {
        title: "Worked example: RSA with small numbers",
        pages: 0.5,
        see: ["5.14#rsa"],
        points: [
          "p = 3, q = 11, n = 33, φ = 20, e = 3, d = 7; encrypt and decrypt one small number."
        ]
      },
      {
        title: "Hashing, digital signatures and PKI",
        pages: 1,
        see: ["5.14#hashing", "5.14#signatures", "5.14#pki", "5.14#mysql"],
        points: [
          "Hashing passwords with a salt.",
          "Digital signatures: sign with the private key, verify with the public key.",
          "Certificates, certificate authorities and the chain of trust; TLS for database connections.",
          "Encryption functions and encrypted connections in MySQL."
        ],
        draw: ["The PKI chain: root CA, intermediate CA, server certificate."]
      },
      {
        title: "Challenges in database security",
        pages: 1.5,
        see: ["5.15#overview", "5.15#quality", "5.15#ip", "5.15#survivability", "5.15#privacy", "5.15#emerging"],
        points: [
          "Data quality, intellectual property rights, database survivability (confinement, damage assessment, reconfiguration, repair, fault treatment), privacy and anonymization, newer challenges (cloud, insiders, AI).",
          "One example for each, such as surviving a ransomware attack or making data k-anonymous."
        ],
        table: ["Challenge, what it means, example, how it is handled."]
      },
      {
        title: "Merits, demerits and conclusion",
        pages: 0.5,
        see: ["5.14#merits", "5.15#summary"],
        points: [
          "Encryption protects confidentiality but costs speed and needs careful key management. Conclude that security is never finished."
        ]
      }
    ]
  };
})();
