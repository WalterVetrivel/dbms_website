/* Unit II question bank items.
   Every question is mapped to its unit, never to a test or exam paper, because
   test papers change each semester.
   id: "u2-a1" is Unit II, Part A, question 1 of the unit question bank. A question
   that is not in the unit bank takes the next free number in its part, and its
   source is { bank: "Unit II", extra: true }.
   "original" keeps the source wording; "question" is the corrected wording shown
   on the site. "parts" lists the a), b) sub-questions and "include" is the hint
   printed under some 16-mark questions; both are optional. "answer" is the 2-mark
   answer (HTML), or null. "outline" links a 16-mark question to the worked answer
   on a topic page, or is null. */
(function () {
  var D = (window.DBMS = window.DBMS || {});
  D.questions = (D.questions || []).concat([
    {
      id: "u2-a1",
      unit: 2,
      part: "A",
      marks: 2,
      topics: ["2.1"],
      sources: [{ bank: "Unit II", no: 1 }],
      original: "Define Entity and Attribute in an ER model.",
      question: "Define entity and attribute in the E-R model.",
      answer:
        "<p><strong>Entity:</strong> a real-world thing or object that can be told apart from all other objects. Examples: a student, a course, a bank account.</p>" +
        "<p><strong>Attribute:</strong> a property that describes an entity. Examples: RollNo, Name and Phone of a student.</p>" +
        "<p>In an E-R diagram (Chen notation), an entity set is drawn as a <strong>rectangle</strong> and an attribute as an <strong>ellipse</strong>.</p>"
    },
    {
      id: "u2-a2",
      unit: 2,
      part: "A",
      marks: 2,
      topics: ["1.7", "2.3"],
      sources: [{ bank: "Unit II", no: 2 }],
      original: "What is the difference between a primary key and a foreign key?",
      question: "What is the difference between a primary key and a foreign key?",
      answer:
        "<table><thead><tr><th>Primary key</th><th>Foreign key</th></tr></thead><tbody>" +
        "<tr><td>Identifies each row of <strong>its own table</strong> uniquely.</td><td>Refers to the primary key of <strong>another table</strong>; it links the two tables.</td></tr>" +
        "<tr><td>Values must be <strong>unique</strong> and <strong>not NULL</strong>.</td><td>Values <strong>can repeat</strong> and can be NULL.</td></tr>" +
        "<tr><td>Only <strong>one</strong> per table.</td><td>A table can have <strong>many</strong>.</td></tr>" +
        "</tbody></table>" +
        "<p>Example: DeptID is the primary key of DEPARTMENT and a foreign key in STUDENT.</p>"
    },
    {
      id: "u2-a3",
      unit: 2,
      part: "A",
      marks: 2,
      topics: ["2.1"],
      sources: [{ bank: "Unit II", no: 3 }],
      original: "List any two advantages of ER modeling.",
      question: "List any two advantages of E-R modeling.",
      answer:
        "<ol>" +
        "<li><strong>Easy to understand:</strong> the E-R diagram is a simple picture of the data. Users and designers can discuss it and find mistakes before any table is built.</li>" +
        "<li><strong>Easy to convert to tables:</strong> each entity set and relationship set maps directly to relations by <strong>ER-to-relational mapping</strong>.</li>" +
        "</ol>"
    },
    {
      id: "u2-a4",
      unit: 2,
      part: "A",
      marks: 2,
      topics: ["2.4"],
      sources: [{ bank: "Unit II", no: 4 }],
      original: "Define functional dependency with an example.",
      question: "Define functional dependency with an example.",
      answer:
        "<p>A <strong>functional dependency</strong> X → Y holds on a relation R if any two tuples that have the <strong>same value for X</strong> also have the <strong>same value for Y</strong>. We say \"X functionally determines Y\".</p>" +
        "<p>Example: in STUDENT(RollNo, Name, Dept), <strong>RollNo → Name</strong>. One roll number always gives the same name. But Name → RollNo does not hold, because two students can have the same name.</p>"
    },
    {
      id: "u2-a5",
      unit: 2,
      part: "A",
      marks: 2,
      topics: ["2.5"],
      sources: [{ bank: "Unit II", no: 5 }],
      original: "What is meant by non-loss decomposition?",
      question: "What is meant by non-loss decomposition?",
      answer:
        "<p>A <strong>non-loss decomposition</strong> (lossless-join decomposition) splits a relation R into R1 and R2 so that the <strong>natural join</strong> R1 ⋈ R2 gives back <strong>exactly R</strong>. No information is lost and no extra (spurious) tuples appear.</p>" +
        "<p><strong>Test:</strong> the decomposition is lossless if R1 ∩ R2 → R1 or R1 ∩ R2 → R2.</p>" +
        "<p>Example: STUDENT(RollNo, Name, DeptID, DeptName) splits into (RollNo, Name, DeptID) and (DeptID, DeptName), since DeptID → DeptName.</p>"
    },
    {
      id: "u2-a6",
      unit: 2,
      part: "A",
      marks: 2,
      topics: ["2.6"],
      sources: [{ bank: "Unit II", no: 6 }],
      original: "Write any two differences between 1NF and 2NF.",
      question: "Write any two differences between 1NF and 2NF.",
      answer:
        "<table><thead><tr><th>1NF</th><th>2NF</th></tr></thead><tbody>" +
        "<tr><td>Every attribute holds only <strong>atomic</strong> (single, indivisible) values.</td><td>The relation is in 1NF <strong>and</strong> has no partial dependency.</td></tr>" +
        "<tr><td><strong>Partial dependencies</strong> are allowed: a non-prime attribute may depend on only part of a composite key.</td><td>Every non-prime attribute depends on the <strong>whole</strong> candidate key.</td></tr>" +
        "</tbody></table>" +
        "<p>Example: in (RollNo, CourseID, CourseName), CourseID → CourseName is a partial dependency, so it is in 1NF but not in 2NF.</p>"
    },
    {
      id: "u2-a7",
      unit: 2,
      part: "A",
      marks: 2,
      topics: ["2.8"],
      sources: [{ bank: "Unit II", no: 7 }],
      original: "Define Boyce–Codd Normal Form (BCNF).",
      question: "Define Boyce-Codd Normal Form (BCNF).",
      answer:
        "<p>A relation R is in <strong>Boyce-Codd Normal Form (BCNF)</strong> if, for every non-trivial functional dependency X → Y in R, <strong>X is a superkey</strong> of R.</p>" +
        "<p>BCNF is <strong>stricter than 3NF</strong>: every BCNF relation is in 3NF, but not every 3NF relation is in BCNF.</p>" +
        "<p>Example: in R(Student, Course, Teacher) with Teacher → Course, Teacher is not a superkey. So R is not in BCNF.</p>"
    },
    {
      id: "u2-a8",
      unit: 2,
      part: "A",
      marks: 2,
      topics: ["2.9"],
      sources: [{ bank: "Unit II", no: 8 }],
      original: "What is a multivalued dependency? Give an example.",
      question: "What is a multivalued dependency? Give an example.",
      answer:
        "<p>A <strong>multivalued dependency</strong> X →→ Y holds when each value of X has a <strong>set of Y values</strong>, and this set does not depend on the other attributes.</p>" +
        "<p>Example: STUDENT(RollNo, Course, Hobby). A student takes many courses and has many hobbies, and the two are unrelated. So <strong>RollNo →→ Course</strong> and <strong>RollNo →→ Hobby</strong>.</p>" +
        "<p>This causes repeated rows. <strong>4NF</strong> removes it by splitting the relation into (RollNo, Course) and (RollNo, Hobby).</p>"
    },
    {
      id: "u2-a9",
      unit: 2,
      part: "A",
      marks: 2,
      topics: ["2.10"],
      sources: [{ bank: "Unit II", no: 9 }],
      original: "Define join dependency.",
      question: "Define join dependency.",
      answer:
        "<p>A relation R satisfies the <strong>join dependency</strong> *(R1, R2, ..., Rn) if R is always <strong>equal to the natural join</strong> of its projections on R1, R2, ..., Rn. So R can be split into these parts and joined back <strong>without loss</strong>.</p>" +
        "<p>A multivalued dependency is a join dependency with n = 2.</p>" +
        "<p>A relation is in <strong>5NF</strong> (project-join normal form) if every join dependency in it is implied by its candidate keys.</p>"
    },
    {
      id: "u2-a10",
      unit: 2,
      part: "A",
      marks: 2,
      topics: ["2.11"],
      sources: [{ bank: "Unit II", no: 10 }],
      original: "Write any two set operations in SQL with syntax.",
      question: "Write any two set operations in SQL with syntax.",
      answer:
        "<p><strong>UNION</strong> returns the rows found in <strong>either</strong> query, without duplicates.</p>" +
        "<pre><code class=\"language-sql\">SELECT name FROM depositor\nUNION\nSELECT name FROM borrower;</code></pre>" +
        "<p><strong>INTERSECT</strong> returns only the rows found in <strong>both</strong> queries.</p>" +
        "<pre><code class=\"language-sql\">SELECT name FROM depositor\nINTERSECT\nSELECT name FROM borrower;</code></pre>" +
        "<p>Both queries must have the same number of columns with matching types. MySQL supports INTERSECT and EXCEPT from version 8.0.31.</p>"
    },
    {
      id: "u2-a11",
      unit: 2,
      part: "A",
      marks: 2,
      topics: ["2.13"],
      sources: [{ bank: "Unit II", no: 11 }],
      original: "What is the difference between GROUP BY and HAVING clauses in SQL?",
      question: "What is the difference between the GROUP BY and HAVING clauses in SQL?",
      answer:
        "<table><thead><tr><th>GROUP BY</th><th>HAVING</th></tr></thead><tbody>" +
        "<tr><td><strong>Forms groups</strong> of rows that have the same value in the given columns.</td><td><strong>Filters groups</strong> after they are formed.</td></tr>" +
        "<tr><td>Comes after WHERE.</td><td>Comes after GROUP BY and can use aggregate functions.</td></tr>" +
        "</tbody></table>" +
        "<pre><code class=\"language-sql\">SELECT dept, AVG(salary)\nFROM employee\nGROUP BY dept\nHAVING AVG(salary) &gt; 50000;</code></pre>"
    },
    {
      id: "u2-a12",
      unit: 2,
      part: "A",
      marks: 2,
      topics: ["2.14"],
      sources: [{ bank: "Unit II", no: 12 }],
      original: "List any two types of SQL joins.",
      question: "List any two types of SQL joins.",
      answer:
        "<ol>" +
        "<li><strong>Inner join:</strong> returns only the rows that have <strong>matching values</strong> in both tables.</li>" +
        "<li><strong>Left outer join:</strong> returns <strong>all rows of the left table</strong>, with the matching rows of the right table. Where there is no match, the right-side columns are NULL.</li>" +
        "</ol>" +
        "<pre><code class=\"language-sql\">SELECT s.name, d.dept_name\nFROM student s\nINNER JOIN department d ON s.dept_id = d.dept_id;</code></pre>" +
        "<p>Others: right outer, full outer, natural, cross and self join.</p>"
    },
    {
      id: "u2-a13",
      unit: 2,
      part: "A",
      marks: 2,
      topics: ["2.15"],
      sources: [{ bank: "Unit II", no: 13 }],
      original: "Define subquery in SQL with an example.",
      question: "Define a subquery in SQL with an example.",
      answer:
        "<p>A <strong>subquery</strong> (inner query) is a SELECT query written <strong>inside another query</strong>, in brackets. The outer query uses its result. It can appear in the WHERE, FROM or SELECT clause.</p>" +
        "<p>Example: find the employees who earn more than the average salary.</p>" +
        "<pre><code class=\"language-sql\">SELECT name\nFROM employee\nWHERE salary &gt; (SELECT AVG(salary) FROM employee);</code></pre>"
    },
    {
      id: "u2-a14",
      unit: 2,
      part: "A",
      marks: 2,
      topics: ["2.16"],
      sources: [{ bank: "Unit II", no: 14 }],
      original: "What is a view in SQL?",
      question: "What is a view in SQL?",
      answer:
        "<p>A <strong>view</strong> is a <strong>virtual table</strong> defined by a query. It stores only its definition, not its own data. Each time we use the view, the DBMS runs the query on the base tables.</p>" +
        "<p>Views give <strong>security</strong> (hide some columns or rows) and make complex queries <strong>simple</strong> to reuse.</p>" +
        "<pre><code class=\"language-sql\">CREATE VIEW cse_students AS\nSELECT roll_no, name FROM student WHERE dept = 'CSE';</code></pre>"
    },
    {
      id: "u2-a15",
      unit: 2,
      part: "A",
      marks: 2,
      topics: ["2.17"],
      sources: [{ bank: "Unit II", no: 15 }],
      original: "Write the syntax of a trigger in SQL.",
      question: "Write the syntax of a trigger in SQL.",
      answer:
        "<pre><code class=\"language-sql\">CREATE TRIGGER trigger_name\n{BEFORE | AFTER} {INSERT | UPDATE | DELETE}\nON table_name\nFOR EACH ROW\nBEGIN\n  -- statements; use NEW.column and OLD.column\nEND;</code></pre>" +
        "<p>A <strong>trigger</strong> runs <strong>automatically</strong> when the given event happens on the table. <strong>NEW</strong> holds the new row values and <strong>OLD</strong> holds the old ones. In the MySQL client, change the DELIMITER before a trigger with BEGIN ... END.</p>"
    },
    {
      id: "u2-b1",
      unit: 2,
      part: "B",
      marks: 16,
      topics: ["2.2", "2.3"],
      sources: [{ bank: "Unit II", no: 1 }],
      original: "Draw an ER diagram for a university database system and map it into a relational schema.",
      question: "Draw an E-R diagram for a university database system and map it into a relational schema.",
      answer: null,
      outline: null
    },
    {
      id: "u2-b2",
      unit: 2,
      part: "B",
      marks: 16,
      topics: ["2.3"],
      sources: [{ bank: "Unit II", no: 2 }],
      original: "Explain in detail the steps in ER-to-relational mapping with suitable examples.",
      question: "Explain in detail the steps in ER-to-relational mapping with suitable examples.",
      answer: null,
      outline: null
    },
    {
      id: "u2-b3",
      unit: 2,
      part: "B",
      marks: 16,
      topics: ["2.4"],
      sources: [{ bank: "Unit II", no: 3 }],
      original: "Define functional dependency. Explain different types of functional dependencies with examples.",
      question: "Define functional dependency. Explain the different types of functional dependencies with examples.",
      answer: null,
      outline: null
    },
    {
      id: "u2-b4",
      unit: 2,
      part: "B",
      marks: 16,
      topics: ["2.5", "2.7"],
      sources: [{ bank: "Unit II", no: 4 }],
      original: "Discuss non-loss decomposition and dependency preservation with examples.",
      question: "Discuss non-loss decomposition and dependency preservation with examples.",
      answer: null,
      outline: null
    },
    {
      id: "u2-b5",
      unit: 2,
      part: "B",
      marks: 16,
      topics: ["2.6", "2.8"],
      sources: [{ bank: "Unit II", no: 5 }],
      original: "Explain 1NF, 2NF, 3NF, and BCNF with suitable examples.",
      question: "Explain 1NF, 2NF, 3NF and BCNF with suitable examples.",
      answer: null,
      outline: null
    },
    {
      id: "u2-b6",
      unit: 2,
      part: "B",
      marks: 16,
      topics: ["2.9", "2.10"],
      sources: [{ bank: "Unit II", no: 6 }],
      original: "Write short notes on: a) Multivalued dependencies and 4NF b) Join dependencies and 5NF",
      question: "Write short notes on:",
      parts: ["Multivalued dependencies and 4NF", "Join dependencies and 5NF"],
      answer: null,
      outline: null
    },
    {
      id: "u2-b7",
      unit: 2,
      part: "B",
      marks: 16,
      topics: ["2.11"],
      sources: [{ bank: "Unit II", no: 7 }],
      original: "Discuss various SQL set operations with examples.",
      question: "Discuss the various SQL set operations with examples.",
      answer: null,
      outline: null
    },
    {
      id: "u2-b8",
      unit: 2,
      part: "B",
      marks: 16,
      topics: ["2.12"],
      sources: [{ bank: "Unit II", no: 8 }],
      original: "Explain aggregate functions in SQL with examples.",
      question: "Explain aggregate functions in SQL with examples.",
      answer: null,
      outline: null
    },
    {
      id: "u2-b9",
      unit: 2,
      part: "B",
      marks: 16,
      topics: ["2.13", "2.14"],
      sources: [{ bank: "Unit II", no: 9 }],
      original: "Write SQL queries for the following: a) Using GROUP BY and HAVING b) Performing joins (inner, left, right, full)",
      question: "Write SQL queries for the following:",
      parts: ["Using GROUP BY and HAVING", "Performing joins (inner, left, right and full)"],
      answer: null,
      outline: null
    },
    {
      id: "u2-b10",
      unit: 2,
      part: "B",
      marks: 16,
      topics: ["2.15"],
      sources: [{ bank: "Unit II", no: 10 }],
      original: "Explain subqueries in SQL with examples (single-row, multiple-row, correlated subqueries).",
      question: "Explain subqueries in SQL with examples (single-row, multiple-row and correlated subqueries).",
      answer: null,
      outline: null
    },
    {
      id: "u2-b11",
      unit: 2,
      part: "B",
      marks: 16,
      topics: ["2.16"],
      sources: [{ bank: "Unit II", no: 11 }],
      original: "Define a view in SQL. Explain creation, modification, and deletion of views with examples.",
      question: "Define a view in SQL. Explain the creation, modification and deletion of views with examples.",
      answer: null,
      outline: null
    },
    {
      id: "u2-b12",
      unit: 2,
      part: "B",
      marks: 16,
      topics: ["2.17"],
      sources: [{ bank: "Unit II", no: 12 }],
      original: "What are triggers? Explain types of triggers in SQL with syntax and examples.",
      question: "What are triggers? Explain the types of triggers in SQL with syntax and examples.",
      answer: null,
      outline: null
    },
    {
      id: "u2-b13",
      unit: 2,
      part: "B",
      marks: 16,
      topics: ["2.6", "2.8"],
      sources: [{ bank: "Unit II", no: 13 }],
      original: "Compare and contrast different normal forms up to BCNF.",
      question: "Compare and contrast the different normal forms up to BCNF.",
      answer: null,
      outline: null
    },
    {
      id: "u2-b14",
      unit: 2,
      part: "B",
      marks: 16,
      topics: ["2.3", "2.6"],
      sources: [{ bank: "Unit II", no: 14 }],
      original: "Write and explain the steps for converting an ER diagram into normalized relations.",
      question: "Write and explain the steps for converting an E-R diagram into normalized relations.",
      answer: null,
      outline: null
    },
    {
      id: "u2-b15",
      unit: 2,
      part: "B",
      marks: 16,
      topics: ["2.5", "2.7"],
      sources: [{ bank: "Unit II", no: 15 }],
      original: "Explain dependency preservation and lossless join with examples.",
      question: "Explain dependency preservation and lossless join with examples.",
      answer: null,
      outline: null
    },
    {
      id: "u2-b16",
      unit: 2,
      part: "B",
      marks: 16,
      topics: ["2.2"],
      sources: [{ bank: "Unit II", extra: true }],
      original: "Draw an E-R diagram for a car-insurance company whose customers own one or more cars each. Each car has associated with it zero to any number of recorded accidents. State any assumptions you make.",
      question: "Draw an E-R diagram for a car insurance company whose customers own one or more cars each. Each car has zero or more recorded accidents. State any assumptions you make.",
      answer: null,
      outline: null
    },
    {
      id: "u2-b17",
      unit: 2,
      part: "B",
      marks: 16,
      topics: ["2.4", "2.6", "2.8"],
      sources: [{ bank: "Unit II", extra: true }],
      original: "Consider a relation R(StudentID, StudentName, CourseID, CourseName, Instructor). Identify partial and transitive dependencies and normalize R into 2NF, 3NF and BCNF with examples.",
      question: "Consider a relation R(StudentID, StudentName, CourseID, CourseName, Instructor). Identify the partial and transitive dependencies, and normalize R into 2NF, 3NF and BCNF with examples.",
      answer: null,
      outline: null
    }
  ]);
})();
