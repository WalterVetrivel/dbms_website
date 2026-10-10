/* Unit II comparisons, shown on comparisons/unit-2.html. See data/comparisons/unit-1.js
   for the shape of an item. After you change this file, run node tools/build-comparisons.mjs. */
window.DBMS = window.DBMS || {};

DBMS.comparisons = (DBMS.comparisons || []).concat([
  {
    id: "strong-vs-weak-entity",
    topics: ["2.1"],
    title: "Strong and weak entity sets",
    keywords: "strong weak entity set discriminator partial key identifying relationship vs difference",
    summary: "A strong entity set has a primary key of its own; a weak entity set has only a partial key and depends on an owner entity set.",
    tables: [{ from: "2.1", ref: "cmp-strong-weak" }],
    tip: "Draw one small example: Loan (strong, single rectangle) and Payment (weak, double rectangle), joined by a double diamond.",
    read: ["2.1#weak"]
  },
  {
    id: "attribute-types",
    topics: ["2.1"],
    title: "Simple and composite, single-valued and multivalued, stored and derived attributes",
    keywords: "attribute types simple composite multivalued derived stored key e-r vs difference",
    summary: "Attributes come in pairs: simple or composite (can it be split?), single-valued or multivalued (how many values?) and stored or derived (kept or calculated?).",
    tables: [{ from: "2.1", ref: "cmp-attribute-types" }],
    tip: "One attribute belongs to one type from each pair. For example, Phone is simple, multivalued and stored.",
    questions: ["u2-a1"]
  },
  {
    id: "specialization-vs-generalization",
    topics: ["2.3"],
    title: "Specialization and generalization",
    keywords: "specialization generalization superclass subclass isa inheritance eer top-down bottom-up vs difference",
    summary: "Specialization splits one entity set into subclasses (top-down); generalization joins several entity sets into one superclass (bottom-up). Both give the same ISA picture.",
    tables: [
      {
        caption: "Specialization and generalization",
        head: ["Basis", "Specialization", "Generalization"],
        rows: [
          ["Direction", "Top-down", "Bottom-up"],
          ["Starts from", "One higher-level entity set", "Several lower-level entity sets"],
          ["Result", "New subclasses (lower-level entity sets)", "A new superclass (higher-level entity set)"],
          ["Why it is done", "Some entities have attributes or relationships that others do not", "Several entity sets share common attributes"],
          ["Attributes", "Subclasses add their own attributes and inherit the rest", "The common attributes move up to the superclass"],
          ["Symbol", "ISA triangle under the superclass", "The same ISA triangle"],
          ["Constraints", "Disjoint or overlapping; total or partial", "Usually total: every lower-level entity belongs to the superclass"],
          ["Example", "Person is specialized into Student and Employee", "Car and Truck are generalized into Vehicle"]
        ]
      },
      { from: "2.3", ref: "cmp-map-specialization" }
    ],
    tip: "The two are opposite design steps that give the same diagram. Say which way you worked: from one entity down, or from many entities up.",
    read: ["2.3#special"]
  },
  {
    id: "fd-types",
    topics: ["2.4"],
    title: "Trivial, non-trivial, full, partial and transitive dependencies",
    keywords: "functional dependency types trivial full partial transitive fd vs difference",
    summary: "A trivial FD says nothing new. A partial FD depends on part of a key. A transitive FD goes through a non-key attribute.",
    tables: [{ from: "2.4", ref: "cmp-fd-types" }],
    tip: "Partial dependencies break 2NF, and transitive dependencies break 3NF. Say this when you list the types.",
    questions: ["u2-a4", "u2-b3"]
  },
  {
    id: "fd-vs-mvd",
    topics: ["2.4", "2.9"],
    title: "Functional dependency and multivalued dependency",
    keywords: "fd mvd functional multivalued dependency 4nf vs difference",
    summary: "In an FD X → Y, each X value fixes one Y value. In an MVD X →→ Y, each X value fixes a set of Y values, whatever the other attributes are.",
    tables: [{
      caption: "Functional dependency and multivalued dependency",
      head: ["Basis", "Functional dependency (FD)", "Multivalued dependency (MVD)"],
      rows: [
        ["Notation", "X → Y", "X →→ Y"],
        ["Meaning", "Each X value has exactly one Y value", "Each X value has a set of Y values, independent of the rest of the attributes"],
        ["Tuple rule", "Two tuples that agree on X also agree on Y", "If two tuples agree on X, the tuples with their Y values swapped must also exist"],
        ["Attributes needed", "At least two", "At least three (X, Y and the rest)"],
        ["Trivial when", "Y ⊆ X", "Y ⊆ X, or X ∪ Y is all the attributes"],
        ["Relationship", "Every FD is also an MVD", "An MVD is not always an FD"],
        ["Extra rule", "Armstrong's axioms", "Complementation: X →→ Y gives X →→ R − X − Y"],
        ["Normal form it drives", "2NF, 3NF and BCNF", "4NF"],
        ["Example", "RegNo → Name", "sid →→ course and sid →→ skill in Student(sid, course, skill)"]
      ]
    }],
    read: ["2.4#what", "2.9#mvd"],
    questions: ["u2-a8", "u2-b6"]
  },
  {
    id: "lossless-vs-lossy",
    topics: ["2.5"],
    title: "Lossless and lossy decomposition",
    keywords: "lossless lossy non-loss decomposition spurious tuples vs difference",
    summary: "A lossless decomposition joins back to exactly the original table; a lossy one gives extra (spurious) rows, so information is lost.",
    tables: [{ from: "2.5", ref: "cmp-lossless-lossy" }],
    tip: "The test for two parts: R1 ∩ R2 → R1 or R1 ∩ R2 → R2 must hold. Write it as a formula, then check it on the example.",
    questions: ["u2-a5", "u2-b4"]
  },
  {
    id: "lossless-vs-dependency-preservation",
    topics: ["2.7"],
    title: "Lossless join and dependency preservation",
    keywords: "lossless join dependency preserving decomposition vs difference",
    summary: "Lossless join is about the data (can we get the table back?); dependency preservation is about the rules (can every FD still be checked in one table?).",
    tables: [{ from: "2.7", ref: "cmp-lossless-vs-dp" }],
    questions: ["u2-b4", "u2-b15"]
  },
  {
    id: "1nf-2nf-3nf",
    topics: ["2.6"],
    title: "1NF, 2NF and 3NF",
    keywords: "first second third normal form 1nf 2nf 3nf partial transitive vs difference",
    summary: "1NF needs atomic values, 2NF also removes partial dependencies, and 3NF also removes transitive dependencies.",
    tables: [{ from: "2.6", ref: "cmp-1nf-2nf-3nf" }],
    tip: "For the 2-mark question on 1NF and 2NF, write two rows: the rule, and what each depends on (cell values or the keys).",
    questions: ["u2-a6", "u2-b13"]
  },
  {
    id: "3nf-vs-bcnf",
    topics: ["2.8"],
    title: "3NF and BCNF",
    keywords: "third normal form boyce codd bcnf vs difference",
    summary: "3NF allows X → A when A is a prime attribute; BCNF does not, so every determinant must be a superkey.",
    tables: [{ from: "2.8", ref: "cmp-3nf-bcnf" }],
    tip: "Give the Enrollment(student, course, teacher) example: it is in 3NF but not BCNF, because teacher → course and teacher is not a superkey.",
    questions: ["u2-a7", "u2-b13"]
  },
  {
    id: "normal-forms",
    topics: ["2.10", "2.9"],
    title: "The normal forms from 1NF to 5NF",
    keywords: "normal forms 1nf 2nf 3nf bcnf 4nf 5nf normalization ladder vs difference",
    summary: "Each normal form adds one more condition to the one before it, so each removes one more kind of redundancy.",
    tables: [
      { from: "2.10", ref: "cmp-all-nf" },
      { from: "2.9", ref: "cmp-bcnf-4nf" }
    ],
    tip: "Draw the forms as a ladder or as nested boxes: 5NF inside 4NF inside BCNF inside 3NF inside 2NF inside 1NF.",
    questions: ["u2-b13", "u2-b5", "u2-b6"]
  },
  {
    id: "set-operations",
    topics: ["2.11"],
    title: "UNION, UNION ALL, INTERSECT and EXCEPT",
    keywords: "set operations union all intersect except minus vs difference",
    summary: "All four combine the results of two queries with the same columns. UNION ALL keeps duplicates; the others remove them.",
    tables: [{ from: "2.11", ref: "cmp-set-ops" }],
    syntax: [
      { label: "UNION and UNION ALL", code: "SELECT id FROM First\nUNION\nSELECT id FROM Second;\n\nSELECT id FROM First\nUNION ALL\nSELECT id FROM Second;" },
      { label: "INTERSECT", code: "SELECT id FROM First\nINTERSECT\nSELECT id FROM Second;\n-- MySQL 8.0.31 and later" },
      { label: "EXCEPT (MINUS)", code: "SELECT id FROM First\nEXCEPT\nSELECT id FROM Second;\n-- Oracle writes MINUS" }
    ],
    tip: "Both queries must return the same number of columns, with compatible types. The column names come from the first query.",
    read: ["2.11#rules"],
    questions: ["u2-a10", "u2-b7"]
  },
  {
    id: "count-forms",
    topics: ["2.12"],
    title: "COUNT(*), COUNT(column) and COUNT(DISTINCT column)",
    keywords: "count star column distinct aggregate null vs difference",
    summary: "COUNT(*) counts rows; COUNT(column) counts the non-NULL values in a column; COUNT(DISTINCT column) counts the different non-NULL values.",
    tables: [{
      caption: "The three forms of COUNT, on student(roll, name, dept_id) with dept_id = 10, 20, 10 and NULL",
      head: ["Basis", "COUNT(*)", "COUNT(dept_id)", "COUNT(DISTINCT dept_id)"],
      rows: [
        ["Counts", "Rows", "Non-NULL values", "Different non-NULL values"],
        ["NULL values", "Counted (the row is counted)", "Skipped", "Skipped"],
        ["Duplicates", "Counted", "Counted", "Counted once"],
        ["Result on the sample", "4", "3", "2"],
        ["On an empty table", "0", "0", "0"],
        ["Typical use", "How many students?", "How many students have a department?", "How many departments have students?"]
      ]
    }],
    syntax: [
      { label: "SQL", code: "SELECT COUNT(*),\n       COUNT(dept_id),\n       COUNT(DISTINCT dept_id)\nFROM student;" },
      { label: "Result", code: "COUNT(*)  COUNT(dept_id)  COUNT(DISTINCT dept_id)\n       4               3                        2" }
    ],
    tip: "The other aggregates (SUM, AVG, MIN and MAX) also skip NULL. So AVG(marks) divides by the number of non-NULL marks, not by the number of rows.",
    read: ["2.12#count", "2.12#nulls"],
    questions: ["u2-b8"]
  },
  {
    id: "where-vs-having",
    topics: ["2.13"],
    title: "WHERE and HAVING",
    keywords: "where having group by filter rows groups aggregate vs difference",
    summary: "WHERE filters single rows before they are grouped; HAVING filters whole groups after GROUP BY, so it can use aggregates.",
    tables: [{ from: "2.13", ref: "cmp-where-having" }],
    syntax: [
      { label: "WHERE: filter rows", code: "SELECT COMPANY, COST\nFROM PRODUCT_MAST\nWHERE RATE >= 20;" },
      { label: "HAVING: filter groups", code: "SELECT COMPANY, SUM(COST) AS total\nFROM PRODUCT_MAST\nGROUP BY COMPANY\nHAVING SUM(COST) > 150;\n-- Com1 335, Com3 170" },
      { label: "Wrong", code: "SELECT COMPANY\nFROM PRODUCT_MAST\nWHERE SUM(COST) > 150\nGROUP BY COMPANY;\n-- Error: aggregates are not\n-- allowed in WHERE" }
    ],
    tip: "The question bank asks for “GROUP BY and HAVING”. Answer with GROUP BY (makes groups) and HAVING (keeps some groups), then add the WHERE row to show the difference.",
    read: ["2.13#where-having"],
    questions: ["u2-a11", "u2-b9"]
  },
  {
    id: "group-by-vs-order-by",
    topics: ["2.13"],
    title: "GROUP BY and ORDER BY",
    keywords: "group by order by sort groups asc desc vs difference",
    summary: "GROUP BY puts rows with the same value into one group and gives one result row per group; ORDER BY only sorts the result rows.",
    tables: [{
      caption: "GROUP BY and ORDER BY",
      head: ["Basis", "GROUP BY", "ORDER BY"],
      rows: [
        ["Purpose", "Makes groups of rows with equal values", "Sorts the result rows"],
        ["Number of result rows", "One row per group (fewer rows)", "Same number of rows"],
        ["Used with aggregates", "Yes; COUNT, SUM, AVG, MIN, MAX work on each group", "Not needed; can sort by an aggregate after grouping"],
        ["Columns in SELECT", "Only grouping columns and aggregates", "Any columns"],
        ["Place in the query", "After WHERE, before HAVING", "Last clause (before LIMIT)"],
        ["Logical order", "Runs before SELECT", "Runs after SELECT, so it can use column aliases"],
        ["Options", "WITH ROLLUP adds a total row", "ASC (default) or DESC for each column"],
        ["Example", "<code>GROUP BY COMPANY</code>", "<code>ORDER BY total DESC</code>"]
      ]
    }],
    syntax: [
      { label: "GROUP BY", code: "SELECT COMPANY, COUNT(*) AS items\nFROM PRODUCT_MAST\nGROUP BY COMPANY;\n-- Com1 5, Com2 3, Com3 2" },
      { label: "ORDER BY", code: "SELECT PRODUCT, COST\nFROM PRODUCT_MAST\nORDER BY COST DESC;\n-- all 10 rows, Item7 first" },
      { label: "Both together", code: "SELECT COMPANY, SUM(COST) AS total\nFROM PRODUCT_MAST\nGROUP BY COMPANY\nORDER BY total DESC;\n-- Com1 335, Com3 170, Com2 165" }
    ],
    read: ["2.13#group-by", "2.13#order"],
    questions: ["u2-b9"]
  },
  {
    id: "join-types",
    topics: ["2.14"],
    title: "Inner, outer, cross, natural and self joins",
    keywords: "join types inner left right full outer cross natural self vs difference",
    summary: "Joins differ in the rows they keep. Inner keeps only matches, outer also keeps unmatched rows of one or both sides, and cross keeps every pair.",
    tables: [{ from: "2.14", ref: "cmp-join-types" }],
    syntax: [
      { label: "INNER JOIN (3 rows)", code: "SELECT s.name, d.dept_name\nFROM student s\nJOIN department d\n  ON s.dept_id = d.dept_id;" },
      { label: "LEFT JOIN (4 rows)", code: "SELECT s.name, d.dept_name\nFROM student s\nLEFT JOIN department d\n  ON s.dept_id = d.dept_id;\n-- Divya, NULL" },
      { label: "RIGHT JOIN (4 rows)", code: "SELECT s.name, d.dept_name\nFROM student s\nRIGHT JOIN department d\n  ON s.dept_id = d.dept_id;\n-- NULL, ECE" },
      { label: "FULL OUTER JOIN in MySQL (5 rows)", code: "SELECT s.name, d.dept_name\nFROM student s LEFT JOIN department d\n  ON s.dept_id = d.dept_id\nUNION\nSELECT s.name, d.dept_name\nFROM student s RIGHT JOIN department d\n  ON s.dept_id = d.dept_id;" },
      { label: "CROSS and NATURAL JOIN", code: "SELECT * FROM student\nCROSS JOIN department;  -- 12 rows\n\nSELECT * FROM student\nNATURAL JOIN department;\n-- joins on dept_id" },
      { label: "Self join", code: "SELECT e.name, m.name AS manager\nFROM employee e\nJOIN employee m\n  ON e.manager_id = m.emp_id;" }
    ],
    tip: "Draw a Venn diagram for inner, left, right and full joins. It earns marks quickly in a 16-mark answer.",
    read: ["2.14#compare"],
    questions: ["u2-a12", "u2-b9"]
  },
  {
    id: "join-vs-subquery",
    topics: ["2.14", "2.15"],
    title: "Join and subquery",
    keywords: "join subquery nested query performance vs difference",
    summary: "A join puts columns of two tables side by side. A subquery is a query inside another query that passes its result outward.",
    tables: [
      {
        caption: "Join and subquery",
        head: ["Basis", "Join", "Subquery"],
        rows: [
          ["How it works", "Combines rows of two or more tables on a condition", "An inner query gives a value, a list or a table to the outer query"],
          ["Columns in the result", "From all the joined tables", "Only from the outer query's tables"],
          ["Written in", "The FROM clause (JOIN ... ON)", "WHERE, HAVING, FROM or SELECT, inside parentheses"],
          ["Duplicates", "Can repeat a row once for each match", "IN and EXISTS do not repeat outer rows"],
          ["Readability", "Clear when you need data from both tables", "Clear for “a question inside a question”, such as “more than the average”"],
          ["Speed", "Usually well optimized", "Often rewritten into a join by MySQL; a correlated subquery may run once per row"]
        ]
      },
      { from: "2.15", ref: "cmp-subquery-vs-join" }
    ],
    syntax: [
      { label: "Join", code: "SELECT DISTINCT d.dept_name\nFROM department d\nJOIN student s\n  ON s.dept_id = d.dept_id;" },
      { label: "Subquery (same result)", code: "SELECT dept_name\nFROM department\nWHERE dept_id IN\n  (SELECT dept_id FROM student);" }
    ],
    read: ["2.15#vs-join"],
    questions: ["u2-b10"]
  },
  {
    id: "correlated-vs-non-correlated",
    topics: ["2.15"],
    title: "Correlated and non-correlated subqueries",
    keywords: "correlated non-correlated nested subquery inner outer vs difference",
    summary: "A non-correlated subquery runs once on its own. A correlated subquery uses a column of the outer query, so it runs again for each outer row.",
    tables: [
      {
        caption: "Correlated and non-correlated subqueries",
        head: ["Basis", "Non-correlated (simple) subquery", "Correlated subquery"],
        rows: [
          ["Uses the outer query's columns", "No", "Yes"],
          ["Runs", "Once, before the outer query", "Once for each row of the outer query"],
          ["Can run on its own", "Yes", "No; it needs the outer row's value"],
          ["Order of work", "Inner query first, then the outer query", "Outer row first, then the inner query for that row"],
          ["Speed", "Usually faster", "Can be slow on big tables (MySQL may rewrite it as a join)"],
          ["Common operators", "=, &lt;, &gt;, IN, ANY, ALL", "EXISTS, NOT EXISTS, or a comparison with the outer row"],
          ["Example question", "Employees who earn more than the company average", "Employees who earn more than the average of their own department"]
        ]
      },
      { from: "2.15", ref: "cmp-subquery-kinds" }
    ],
    syntax: [
      { label: "Non-correlated", code: "SELECT NAME, SALARY\nFROM EMPLOYEE\nWHERE SALARY >\n  (SELECT AVG(SALARY)\n   FROM EMPLOYEE);" },
      { label: "Correlated", code: "SELECT e.NAME, e.DEPT, e.SALARY\nFROM EMPLOYEE e\nWHERE e.SALARY >\n  (SELECT AVG(x.SALARY)\n   FROM EMPLOYEE x\n   WHERE x.DEPT = e.DEPT);" }
    ],
    tip: "Look for the outer table's alias inside the inner query. If it is there, the subquery is correlated.",
    read: ["2.15#correlated"],
    questions: ["u2-a13", "u2-b10"]
  },
  {
    id: "in-vs-exists-any-vs-all",
    topics: ["2.15"],
    title: "IN and EXISTS, ANY and ALL",
    keywords: "in exists not in not exists any all some subquery operators null vs difference",
    summary: "IN checks whether a value is in the list a subquery returns, while EXISTS only checks whether the subquery returns any row. ANY needs one value to pass the comparison, while ALL needs every value to pass.",
    tables: [
      {
        caption: "IN and EXISTS",
        head: ["Basis", "IN", "EXISTS"],
        rows: [
          ["Checks", "Is the value in the list the subquery returns?", "Does the subquery return at least one row?"],
          ["Subquery returns", "One column of values", "Any rows; the columns do not matter (SELECT 1 or SELECT *)"],
          ["Usually", "Non-correlated", "Correlated"],
          ["Stops early", "No; the list is built first", "Yes; it stops at the first row found"],
          ["NULL in the subquery", "NOT IN returns no rows if the list holds a NULL", "NOT EXISTS is not affected by NULL"],
          ["Best when", "The subquery's list is small", "The subquery's table is large and indexed"]
        ]
      },
      {
        caption: "ANY and ALL (x is the value being compared)",
        head: ["Basis", "ANY (same as SOME)", "ALL"],
        rows: [
          ["True when", "The comparison holds for at least one value", "The comparison holds for every value"],
          ["x &gt; ANY (list) / x &gt; ALL (list)", "x is more than the smallest value", "x is more than the largest value"],
          ["x = ANY (list)", "Same as IN", "Only true if every value equals x"],
          ["x &lt;&gt; ALL (list)", "Not the same as NOT IN", "Same as NOT IN"],
          ["Empty subquery", "False", "True"]
        ]
      }
    ],
    syntax: [
      { label: "IN", code: "SELECT name FROM student\nWHERE dept_id IN\n  (SELECT dept_id FROM department\n   WHERE dept_name <> 'ECE');" },
      { label: "EXISTS", code: "SELECT d.dept_name\nFROM department d\nWHERE EXISTS\n  (SELECT 1 FROM student s\n   WHERE s.dept_id = d.dept_id);\n-- CSE, IT" },
      { label: "ANY and ALL", code: "SELECT NAME FROM EMPLOYEE\nWHERE SALARY > ANY\n  (SELECT SALARY FROM EMPLOYEE\n   WHERE DEPT = 'Sales');\n\nSELECT NAME FROM EMPLOYEE\nWHERE SALARY > ALL\n  (SELECT SALARY FROM EMPLOYEE\n   WHERE DEPT = 'Sales');" }
    ],
    tip: "NOT IN with a NULL in the list is a classic trap: x NOT IN (10, NULL) is never true, so the query returns no rows. Use NOT EXISTS instead.",
    read: ["2.15#multi", "2.15#exists"],
    questions: ["u2-b10"]
  },
  {
    id: "table-vs-view",
    topics: ["2.16"],
    title: "Table, view and materialized view",
    keywords: "table view virtual table materialized view stored query vs difference",
    summary: "A table stores rows; a view stores only a query and shows its result when used; a materialized view stores the query's result and must be refreshed.",
    tables: [
      {
        caption: "Table, view and materialized view",
        head: ["Basis", "Table (base table)", "View", "Materialized view"],
        rows: [
          ["Stores", "The rows", "Only the SELECT query", "The query and a copy of its result"],
          ["Also called", "Base relation", "Virtual table", "Snapshot"],
          ["Disk space", "Needed for all rows", "Almost none", "Needed for the copied result"],
          ["Data is current?", "Yes", "Yes, it is computed each time it is used", "Only as fresh as the last refresh"],
          ["Speed of reading", "Fast", "Same as running the query", "Fast, like a table"],
          ["INSERT, UPDATE, DELETE", "Yes", "Only on an updatable view (one table, no aggregates, GROUP BY or DISTINCT)", "No; it is refreshed from the base tables"],
          ["Main use", "Store data", "Hide columns, simplify complex queries, give each user their own view", "Speed up slow reports"],
          ["In MySQL", "<code>CREATE TABLE</code>", "<code>CREATE VIEW</code>", "Not available (Oracle and PostgreSQL have it)"]
        ]
      },
      { from: "2.16", ref: "cmp-view-kinds" }
    ],
    syntax: [
      { label: "Table", code: "CREATE TABLE Student_Detail (\n  S_ID    INT PRIMARY KEY,\n  NAME    VARCHAR(20),\n  ADDRESS VARCHAR(20)\n);" },
      { label: "View", code: "CREATE VIEW DetailsView AS\nSELECT NAME, ADDRESS\nFROM Student_Detail\nWHERE S_ID < 5;\n\nSELECT * FROM DetailsView;\nDROP VIEW DetailsView;" },
      { label: "Materialized view (PostgreSQL)", code: "CREATE MATERIALIZED VIEW city_count AS\nSELECT ADDRESS, COUNT(*) AS n\nFROM Student_Detail\nGROUP BY ADDRESS;\n\nREFRESH MATERIALIZED VIEW city_count;" }
    ],
    read: ["2.16#what", "2.16#updatable"],
    questions: ["u2-a14", "u2-b11"]
  },
  {
    id: "trigger-types",
    topics: ["2.17"],
    title: "BEFORE and AFTER triggers, row-level and statement-level triggers, NEW and OLD",
    keywords: "trigger before after row level statement level for each row new old vs difference",
    summary: "BEFORE triggers run before the change and can fix or reject it; AFTER triggers run once the change is made and suit logging. MySQL triggers are row-level and see the row as NEW and OLD.",
    tables: [
      {
        caption: "BEFORE and AFTER triggers",
        head: ["Basis", "BEFORE trigger", "AFTER trigger"],
        rows: [
          ["Runs", "Before the row is inserted, updated or deleted", "After the row is inserted, updated or deleted"],
          ["Can change the new values", "Yes, with <code>SET NEW.col = ...</code>", "No; NEW is read-only"],
          ["Can stop the change", "Yes, with <code>SIGNAL SQLSTATE '45000'</code>", "Yes, but the work is undone only by the error"],
          ["Typical use", "Check or fill in values", "Write an audit log, update a summary table"],
          ["Example", "Save a negative balance as 0", "Copy a deleted row to an archive table"]
        ]
      },
      {
        caption: "Row-level and statement-level triggers, and NEW and OLD",
        head: ["Basis", "Row-level trigger", "Statement-level trigger"],
        rows: [
          ["Runs", "Once for each row the statement changes", "Once for the whole statement"],
          ["Sees the row values", "Yes, through NEW and OLD", "No"],
          ["In SQL", "<code>FOR EACH ROW</code>", "<code>FOR EACH STATEMENT</code> (Oracle, PostgreSQL)"],
          ["In MySQL", "The only kind", "Not available"],
          ["NEW", "INSERT and UPDATE: the row after the change", "Not available"],
          ["OLD", "UPDATE and DELETE: the row before the change", "Not available"]
        ]
      },
      { from: "2.17", ref: "cmp-trigger-timing" }
    ],
    syntax: [
      { label: "BEFORE: fix the new value", code: "CREATE TRIGGER account_fix\nBEFORE INSERT ON account\nFOR EACH ROW\n  SET NEW.balance =\n      GREATEST(NEW.balance, 0);\n-- a negative balance is saved as 0" },
      { label: "AFTER: log the change", code: "CREATE TRIGGER account_au\nAFTER UPDATE ON account\nFOR EACH ROW\n  INSERT INTO balance_log\n    (acc_no, action,\n     old_balance, new_balance)\n  VALUES (NEW.acc_no, 'UPDATE',\n          OLD.balance, NEW.balance);" }
    ],
    tip: "Write the event, condition and action (ECA) of your trigger in words before the code. It shows that you understand it.",
    read: ["2.17#types", "2.17#new-old"],
    questions: ["u2-a15", "u2-b12"]
  }
]);
