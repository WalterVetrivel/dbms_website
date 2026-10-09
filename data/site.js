/* Site-wide settings and the list of main pages.
   A page appears in the menus only when its status is "published".
   navTitle, when given, is the shorter label used in the header. */
window.DBMS = window.DBMS || {};

DBMS.site = {
  name: "DBMS Study Guide",
  courseTitle: "Database Management System",
  credit: {
    name: "Walter Vetrivel S",
    role: "Assistant Professor, Department of CSE",
    institution: "Knowledge Institute of Technology, Salem",
    institutionUrl: "https://kiot.ac.in/"
  },
  license: {
    name: "CC BY-NC-SA 4.0",
    url: "https://creativecommons.org/licenses/by-nc-sa/4.0/"
  }
};

DBMS.pages = [
  { id: "home", title: "Home", href: "index.html", status: "published", nav: true },
  { id: "question-bank", title: "Question Banks", href: "question-bank/index.html", status: "published", nav: true, icon: "file-question", summary: "Important questions from every unit, with model answers for 2-mark questions." },
  { id: "outlines", title: "16-Mark Outlines", navTitle: "Outlines", href: "outlines/index.html", status: "published", nav: true, icon: "file-text", summary: "A plan for every 16-mark question: the headings, diagrams, tables and examples to include." },
  { id: "labs", title: "Labs", href: "labs/index.html", status: "published", nav: true, icon: "flask", summary: "All 10 lab exercises, with each sample solution explained step by step." },
  { id: "quizzes", title: "Quizzes", href: "quizzes/index.html", status: "published", nav: true, icon: "list-checks", summary: "A quiz for every topic and a 20-question quiz for every unit." },
  { id: "revision", title: "Revision", href: "revision/index.html", status: "published", nav: true, icon: "layers", summary: "A revision sheet for each unit with the key points of every topic." },
  { id: "glossary", title: "Glossary", href: "glossary.html", status: "planned", nav: false, summary: "Every important term with a short, simple definition." },
  { id: "resources", title: "Resources", href: "resources.html", status: "published", nav: true },
  { id: "about", title: "About", href: "about.html", status: "published", nav: true }
];

/* The 10 lab exercises from the syllabus, in record order. topics lists the
   topic pages to read first; topic pages show a link back to these labs. */
DBMS.labs = [
  { n: 1, slug: "ex-01-design-database", short: "Design the database", title: "Design a database and create the required tables", topics: ["2.1", "1.10", "1.12"], summary: "CREATE DATABASE, CREATE TABLE and DESC for the online game store." },
  { n: 2, slug: "ex-02-ddl-dml-constraints", short: "Constraints, insert, update and delete", title: "Create database tables, add constraints and insert, update and delete rows using DDL and DML", topics: ["1.7", "1.8", "1.12", "1.13"], summary: "PRIMARY KEY, UNIQUE, NOT NULL and CHECK with ALTER TABLE, then INSERT, UPDATE and DELETE." },
  { n: 3, slug: "ex-03-foreign-keys", short: "Foreign keys", title: "Create a set of tables, add foreign key constraints and incorporate referential integrity", topics: ["1.7", "1.8"], summary: "FOREIGN KEY with ON DELETE CASCADE and ON DELETE SET NULL, and testing referential integrity." },
  { n: 4, slug: "ex-04-where-and-aggregates", short: "WHERE and aggregate functions", title: "Query the database tables using different WHERE clauses and implement aggregate functions", topics: ["1.11", "2.12", "2.13"], summary: "WHERE with =, >, LIKE, AND, BETWEEN and IN; COUNT, MIN, MAX, AVG, GROUP BY and HAVING." },
  { n: 5, slug: "ex-05-subqueries-and-joins", short: "Sub-queries and joins", title: "Query the database tables and explore sub-queries and simple join operations", topics: ["2.15", "2.14"], summary: "Sub-queries in WHERE and FROM, INNER JOIN and LEFT JOIN, and the best-selling game." },
  { n: 6, slug: "ex-06-triggers", short: "Triggers", title: "Write SQL triggers for insert, update and delete operations", topics: ["2.17"], summary: "AFTER INSERT, UPDATE and DELETE triggers that keep a game's current price in step with its offer." },
  { n: 7, slug: "ex-07-views-and-indexes", short: "Views and indexes", title: "Create views and indexes for database tables", topics: ["2.16", "4.4", "4.6"], summary: "CREATE VIEW, CREATE INDEX, SHOW INDEXES and EXPLAIN." },
  { n: 8, slug: "ex-08-transactions-dcl-tcl", short: "Transactions, DCL and TCL", title: "Execute complex database transactions and realize DCL and TCL commands", topics: ["3.1", "3.2", "3.10", "3.14", "5.11"], summary: "A checkout transaction with START TRANSACTION and COMMIT, ROLLBACK and SAVEPOINT, and GRANT and REVOKE." },
  { n: 9, slug: "ex-09-bplus-tree", short: "B+ tree in C", title: "Write a program to implement B+ tree", topics: ["4.6", "4.7"], summary: "The record's C program explained function by function, and a true B+ tree version beside the visualizer." },
  { n: 10, slug: "ex-10-nosql-documents", short: "Document database (MongoDB)", title: "Create a document database using NoSQL", topics: ["5.4", "5.6"], summary: "Create, read, update and delete documents with mongosh, each next to its SQL equivalent." }
];
