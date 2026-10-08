/* Unit II 16-mark answer outlines, keyed by question id. See assets/js/outlines.js for the shape.
   Each outline is a plan only. The pages it links to hold the content the student must write out. */
(function () {
  var D = (window.DBMS = window.DBMS || {});
  D.outlines = D.outlines || {};

  D.outlines["u2-b1"] = {
    aim: "A complete, correct E-R diagram for a university, with your assumptions stated, followed by a step-by-step mapping into tables with primary and foreign keys underlined and marked. The diagram and the final schema carry most of the marks, so give each of them a full page.",
    sections: [
      {
        title: "Introduction and requirements",
        pages: 0.5,
        see: ["2.1#design", "2.2#university"],
        points: [
          "Define the E-R model and an E-R diagram in one or two sentences each.",
          "Write the requirements as a short list: students take courses and get a grade, instructors teach courses and advise students, each course has numbered sections, each instructor belongs to a department.",
          "State your assumptions clearly, such as \"a student has one advisor\" and \"a course belongs to one department\"."
        ]
      },
      {
        title: "Entity sets, attributes and relationship sets",
        pages: 0.75,
        see: ["2.1#entity", "2.1#attributes", "2.1#relationship", "2.1#weak"],
        points: [
          "List the entity sets with their attributes and keys: Student, Course, Instructor, Department, and Section as a weak entity set.",
          "Point out each attribute type: composite (Name), multivalued (Phone), derived (Age from DOB).",
          "List the relationship sets: Takes (with grade), Teaches, Advisor, Sec_of (identifying) and the department links."
        ]
      },
      {
        title: "Symbols used",
        pages: 0.25,
        see: ["2.2#symbols"],
        points: [
          "Show a small legend so the examiner can read your diagram."
        ],
        draw: ["A legend: rectangle, double rectangle, diamond, double diamond, oval, double oval, dashed oval, underline for keys."]
      },
      {
        title: "The E-R diagram",
        pages: 1.25,
        see: ["2.2#method", "2.2#university", "2.1#cardinality", "2.1#participation"],
        points: [
          "Draw it neatly across a full page with a pencil, and mark the cardinality (1, N, M) on every relationship line.",
          "Show total participation with double lines, such as Section in Sec_of.",
          "Below the diagram, explain each relationship and its cardinality in one sentence."
        ],
        draw: ["University E-R diagram: Student, Course, Instructor, Department, weak entity Section, relationships Takes (grade), Teaches, Advisor, Sec_of, with keys underlined and cardinalities marked."]
      },
      {
        title: "Mapping the diagram to tables, step by step",
        pages: 1.5,
        see: ["2.3#strong", "2.3#weak", "2.3#one-many", "2.3#many-many", "2.3#multi", "2.3#try"],
        points: [
          "Strong entity sets become tables: Student, Course, Instructor, Department.",
          "The weak entity set Section gets the owner's key plus its partial key as primary key.",
          "1 : N relationships (Advisor, course to department) become a foreign key on the N side.",
          "M : N relationships (Takes) become a new table whose key is both foreign keys, plus grade.",
          "The multivalued Phone becomes its own table; the derived Age is not stored; the composite Name becomes two columns."
        ],
        table: ["The final relational schema: each table with its primary key underlined and foreign keys marked with an arrow to the table they refer to."]
      },
      {
        title: "Sample SQL for two tables",
        pages: 0.5,
        see: ["1.12#constraints"],
        points: [
          "Write CREATE TABLE statements for two tables, such as Student and Takes, to show the keys and foreign keys."
        ],
        example: ["CREATE TABLE takes (ID, course_id, sec_no, semester, grade, PRIMARY KEY (...), FOREIGN KEY ... REFERENCES ...)."]
      },
      {
        title: "Conclusion",
        pages: 0.25,
        points: [
          "Sum up: the E-R diagram captures the requirements, and the mapping rules turn it into tables with the right keys."
        ]
      }
    ]
  };

  D.outlines["u2-b2"] = {
    aim: "Each mapping step as its own heading, with a small E-R fragment and the table it becomes. The examiner expects all seven steps in order, plus the attribute rules and specialization, ending with a summary table.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["2.3#idea"],
        points: [
          "Explain why mapping is needed: the E-R diagram is a design, but the DBMS stores tables.",
          "Say that each E-R construct has a fixed rule, and list the steps you will cover."
        ]
      },
      {
        title: "Step 1: strong entity sets",
        pages: 0.5,
        see: ["2.3#strong"],
        points: [
          "Each strong entity set becomes a table; its key becomes the primary key.",
          "Composite attributes become one column per part; derived attributes are not stored."
        ],
        draw: ["Student entity with ID, Name (First, Last) and DOB, and the table it becomes."]
      },
      {
        title: "Step 2: weak entity sets",
        pages: 0.5,
        see: ["2.3#weak"],
        points: [
          "Primary key = owner's key + partial key; a foreign key refers to the owner, usually with ON DELETE CASCADE."
        ],
        draw: ["Course and its weak entity Section, and the Section table."]
      },
      {
        title: "Steps 3 to 5: binary relationships",
        pages: 1.5,
        see: ["2.3#one-one", "2.3#one-many", "2.3#many-many"],
        points: [
          "<strong>1 : 1</strong>: put a UNIQUE foreign key in one table, preferably on the total-participation side.",
          "<strong>1 : N</strong>: put a foreign key in the table of the N side; relationship attributes go with it.",
          "<strong>M : N</strong>: create a new table whose primary key is both foreign keys; relationship attributes become its columns."
        ],
        draw: ["One E-R fragment for each case: Manager manages Department (1 : 1), Department has Employees (1 : N), Student takes Course with grade (M : N)."],
        table: ["The tables for each of the three fragments, with keys underlined."]
      },
      {
        title: "Step 6: multivalued attributes",
        pages: 0.5,
        see: ["2.3#multi"],
        points: [
          "Create a new table with the owner's key and the attribute; the key is both columns."
        ],
        example: ["Student phone numbers: Student_Phone(ID, Phone)."]
      },
      {
        title: "Step 7: relationships of degree three or more",
        pages: 0.5,
        see: ["2.3#nary"],
        points: [
          "Create a new table holding the keys of all participating entity sets."
        ],
        example: ["Supplier supplies Part to Project: Supply(supplier_id, part_id, project_id, qty)."]
      },
      {
        title: "Specialization and generalization",
        pages: 0.5,
        see: ["2.3#special"],
        points: [
          "Method 1: a table for the superclass and one for each subclass, sharing the key.",
          "Method 2: only subclass tables, each with the inherited attributes. Say when each is better."
        ],
        draw: ["Person with subclasses Student and Employee (an ISA triangle)."]
      },
      {
        title: "Summary table and conclusion",
        pages: 0.5,
        see: ["2.3#summary", "2.3#try"],
        points: [
          "End with the table of rules and one sentence on why following the steps gives a correct schema."
        ],
        table: ["E-R construct and its relational construct: at least eight rows."]
      }
    ]
  };

  D.outlines["u2-b3"] = {
    aim: "An exact definition of a functional dependency with notation and a test on a table, then every type of FD with its own example from one relation. Armstrong's axioms and closure make the answer complete and lead into normalization.",
    sections: [
      {
        title: "Definition and notation",
        pages: 0.75,
        see: ["2.4#what"],
        points: [
          "Define X → Y: for any two tuples, if they agree on X they must agree on Y. Name the determinant (X) and the dependent (Y).",
          "Say that an FD comes from the meaning of the data (business rules), not from one sample instance."
        ],
        example: ["A small table where RollNo → Name holds and Name → RollNo does not, with the rows that show it."]
      },
      {
        title: "The sample relation",
        pages: 0.5,
        see: ["2.4#types"],
        points: [
          "Use one relation for every type, such as Marks(RegNo, CourseID, StudentName, CourseName, Marks, Dept, HOD), and write its business rules."
        ],
        table: ["Marks with four or five rows of sample data."]
      },
      {
        title: "Types of functional dependencies",
        pages: 1.75,
        see: ["2.4#types"],
        points: [
          "<strong>Trivial</strong> and <strong>non-trivial</strong>; <strong>completely non-trivial</strong>.",
          "<strong>Full</strong> functional dependency and <strong>partial</strong> dependency (leads to 2NF).",
          "<strong>Transitive</strong> dependency (leads to 3NF).",
          "<strong>Multivalued</strong> dependency (leads to 4NF), in brief.",
          "For each type: definition, example from the Marks relation, and why it matters."
        ],
        table: ["Type, meaning, example: one row for each type."]
      },
      {
        title: "Armstrong's axioms",
        pages: 0.75,
        see: ["2.4#axioms"],
        points: [
          "Reflexivity, augmentation and transitivity, with a one-line example each.",
          "The derived rules: union, decomposition and pseudotransitivity.",
          "Say that the axioms are sound and complete."
        ]
      },
      {
        title: "Closure and finding keys",
        pages: 1,
        see: ["2.4#closure-set", "2.4#attr-closure", "2.4#keys", "2.4#try"],
        points: [
          "Define F+ and attribute closure X+.",
          "Work the closure algorithm step by step on a small set of FDs.",
          "Show how X+ tells whether X is a super key or a candidate key."
        ],
        example: ["R(A, B, C, D) with F = {A → B, B → C, C → D}: compute A+ and show A is a candidate key."]
      },
      {
        title: "Conclusion",
        pages: 0.25,
        see: ["2.4#cover"],
        points: [
          "Sum up: FDs describe how attributes depend on each other; their types decide the normal form of a relation."
        ]
      }
    ]
  };

  D.outlines["u2-b4"] = {
    aim: "Explain both properties of a good decomposition with definitions, tests and worked examples. Show one lossy split with spurious tuples, one lossless split with the test, one decomposition that loses a dependency and one that keeps it.",
    sections: [
      {
        title: "Introduction: why decompose?",
        pages: 0.75,
        see: ["2.5#anomalies", "2.5#decomposition"],
        points: [
          "Redundancy causes insert, update and delete anomalies; give one example of each from a table that stores student and department together.",
          "Define decomposition: replacing R by R1 ... Rn whose attributes together make up R.",
          "Name the two properties we want: lossless join and dependency preservation."
        ]
      },
      {
        title: "Non-loss (lossless join) decomposition",
        pages: 0.75,
        see: ["2.5#lossless"],
        points: [
          "Definition: joining the parts gives back exactly the original relation, r = π<sub>R1</sub>(r) ⋈ π<sub>R2</sub>(r).",
          "Explain that a lossy join gives extra (spurious) tuples, which is a loss of information."
        ]
      },
      {
        title: "Example of a lossy decomposition",
        pages: 0.75,
        see: ["2.5#spurious"],
        points: [
          "Split Student(RollNo, Name, Dept) on Name, join the parts back and mark the spurious tuples."
        ],
        table: ["The original table, the two parts and the joined result with the spurious rows marked."]
      },
      {
        title: "Testing for a lossless join",
        pages: 0.75,
        see: ["2.5#binary-test", "2.5#tableau", "2.5#try"],
        points: [
          "Binary test: R1 ∩ R2 → R1 or R1 ∩ R2 → R2 must be in F+.",
          "Apply the test to a lossless split, such as Student(RollNo, Name, DeptID) and Dept(DeptID, DeptName).",
          "Mention the tableau (matrix) test for three or more parts."
        ]
      },
      {
        title: "Dependency preservation",
        pages: 1,
        see: ["2.7#why", "2.7#restriction", "2.7#definition", "2.7#test"],
        points: [
          "Explain why it matters: if an FD is lost, checking it needs a join on every update.",
          "Define the restriction F<sub>i</sub> of F on each part, and the condition (F1 ∪ F2 ∪ ... ∪ Fn)+ = F+.",
          "Describe the test with attribute closures."
        ]
      },
      {
        title: "Examples: a lost and a preserved dependency",
        pages: 0.75,
        see: ["2.7#lost", "2.7#kept"],
        points: [
          "R(A, B, C) with F = {A → B, B → C} split into (A, C) and (B, C): A → B is lost.",
          "The same R split into (A, B) and (B, C): both FDs are kept, and the join is lossless."
        ]
      },
      {
        title: "Both properties together and conclusion",
        pages: 0.5,
        see: ["2.5#compare", "2.7#both"],
        points: [
          "3NF can always be reached with both properties; BCNF always keeps lossless join but may lose a dependency.",
          "Conclude: lossless join is required; dependency preservation is strongly preferred."
        ],
        table: ["Lossless and lossy decomposition compared, or lossless join and dependency preservation compared: four rows."]
      }
    ]
  };

  D.outlines["u2-b5"] = {
    aim: "Define normalization, then for each normal form give the definition, the problem it removes, an example table that breaks it and the decomposed tables that satisfy it. The examples carry the marks, so show every table.",
    sections: [
      {
        title: "Introduction to normalization",
        pages: 0.75,
        see: ["2.6#why", "2.6#ladder", "2.5#anomalies"],
        points: [
          "Define normalization and its goals: less redundancy, no anomalies.",
          "Show the ladder: 1NF, 2NF, 3NF, BCNF, each stricter than the last."
        ],
        draw: ["Nested boxes or steps: 1NF contains 2NF contains 3NF contains BCNF."]
      },
      {
        title: "First normal form",
        pages: 0.75,
        see: ["2.6#first"],
        points: [
          "Definition: every attribute holds only atomic values; no repeating groups.",
          "Example: a student table with several phone numbers in one cell, then the 1NF version."
        ],
        table: ["The table before and after 1NF."]
      },
      {
        title: "Second normal form",
        pages: 1,
        see: ["2.6#prime", "2.6#second"],
        points: [
          "Define prime and non-prime attributes.",
          "Definition: in 1NF and no non-prime attribute is partially dependent on a candidate key.",
          "Example with key {StudentID, CourseID}: StudentID → StudentName is partial; decompose."
        ],
        table: ["The 1NF table with its FDs, and the 2NF tables."]
      },
      {
        title: "Third normal form",
        pages: 1,
        see: ["2.6#third", "2.6#worked"],
        points: [
          "Definition: in 2NF and no transitive dependency of a non-prime attribute on a key (or: for every X → A, X is a super key or A is prime).",
          "Example: Student(RollNo, Dept, HOD) with RollNo → Dept → HOD; decompose."
        ],
        table: ["The 2NF table and the 3NF tables."]
      },
      {
        title: "Boyce-Codd normal form",
        pages: 1,
        see: ["2.8#definition", "2.8#gap", "2.8#example", "2.8#decompose"],
        points: [
          "Definition: for every non-trivial X → Y, X is a super key.",
          "Show what 3NF misses: Enrollment(sid, course, teacher) with teacher → course.",
          "Decompose into BCNF and note that (sid, course) → teacher is not preserved."
        ],
        table: ["Enrollment with sample rows, and the BCNF tables."]
      },
      {
        title: "Comparison and conclusion",
        pages: 0.75,
        see: ["2.6#compare", "2.8#compare", "2.6#try"],
        points: [
          "Compare the four forms, then conclude that most real designs aim for 3NF or BCNF."
        ],
        table: ["1NF, 2NF, 3NF, BCNF: condition, what it removes, example of a violation."]
      }
    ]
  };

  D.outlines["u2-b6"] = {
    aim: "Two short notes of equal weight, about 2½ pages each. Each note needs the definition with notation, a table that shows the redundancy, the normal form's rule, and the decomposition with the result tables.",
    sections: [
      {
        title: "a) Multivalued dependency: the problem",
        pages: 0.75,
        see: ["2.9#problem"],
        points: [
          "Show a table that is in BCNF but still repeats data: Student(sid, course, skill), where courses and languages are independent.",
          "Count the rows: 2 courses × 2 languages = 4 rows for one student."
        ],
        table: ["Student(sid, course, skill) with sample rows."]
      },
      {
        title: "a) Multivalued dependency and its rules",
        pages: 1,
        see: ["2.9#mvd", "2.9#rules"],
        points: [
          "Define X →→ Y and the tuple condition in your own words.",
          "Trivial MVD; every FD is also an MVD; the complementation rule."
        ]
      },
      {
        title: "a) Fourth normal form",
        pages: 1,
        see: ["2.9#fourth", "2.9#decompose", "2.9#compare"],
        points: [
          "Definition: for every non-trivial MVD X →→ Y, X is a super key.",
          "Decompose Student into (sid, course) and (sid, skill), and show the join gives back the table."
        ],
        table: ["The two 4NF tables.", "BCNF and 4NF compared."]
      },
      {
        title: "b) Join dependency",
        pages: 1,
        see: ["2.10#jd", "2.10#example"],
        points: [
          "Define a join dependency *(R1, R2, ..., Rn): R equals the join of its projections.",
          "Say that an MVD is a join dependency with two parts.",
          "Use the Supply(seller, company, product) example and its business rule."
        ],
        table: ["Supply with sample rows."]
      },
      {
        title: "b) Fifth normal form",
        pages: 1,
        see: ["2.10#fifth", "2.10#decompose", "2.10#summary"],
        points: [
          "Definition: every join dependency is implied by the candidate keys (also called PJNF).",
          "Decompose Supply into three two-column tables, and show that any two of them joined give spurious tuples while all three give the original."
        ],
        table: ["The three 5NF tables, and the join of two of them with the spurious row marked."]
      },
      {
        title: "Conclusion",
        pages: 0.5,
        see: ["2.10#try"],
        points: [
          "4NF removes redundancy from independent multivalued facts; 5NF removes redundancy that needs three or more parts. Both are rare in practice but complete the theory."
        ]
      }
    ]
  };

  D.outlines["u2-b7"] = {
    aim: "State the rules for set operations, then explain UNION, UNION ALL, INTERSECT and EXCEPT (MINUS) one by one with syntax, a query on the same two tables and the result table each time. A Venn diagram for each operation helps.",
    sections: [
      {
        title: "Introduction and rules",
        pages: 0.75,
        see: ["2.11#rules"],
        points: [
          "Set operations combine the results of two SELECT queries.",
          "Rules: same number of columns, compatible data types, column names from the first query, ORDER BY only at the end.",
          "Link them to ∪, ∩ and − in relational algebra."
        ]
      },
      {
        title: "The sample tables",
        pages: 0.5,
        see: ["2.11#sample"],
        points: [
          "Use two small tables with one common row, such as First(ID, NAME) and Second(ID, NAME)."
        ],
        table: ["First and Second with three rows each."]
      },
      {
        title: "UNION and UNION ALL",
        pages: 1.25,
        see: ["2.11#union", "2.11#union-all"],
        points: [
          "UNION: all rows from both, duplicates removed.",
          "UNION ALL: duplicates kept, and faster because it does not sort.",
          "Syntax, query and result for each."
        ],
        draw: ["Venn diagram for union."],
        table: ["The result of UNION and of UNION ALL."]
      },
      {
        title: "INTERSECT",
        pages: 0.75,
        see: ["2.11#intersect"],
        points: [
          "Rows found in both results.",
          "Note that MySQL added INTERSECT only in version 8.0.31; show the IN or JOIN form as an alternative."
        ],
        draw: ["Venn diagram for intersection."],
        table: ["The result."]
      },
      {
        title: "EXCEPT (MINUS)",
        pages: 0.75,
        see: ["2.11#except"],
        points: [
          "Rows in the first result but not in the second; Oracle calls it MINUS.",
          "Show that A EXCEPT B differs from B EXCEPT A; give the NOT IN form."
        ],
        draw: ["Venn diagram for difference."],
        table: ["The results of both directions."]
      },
      {
        title: "Combining operations and a real query",
        pages: 0.5,
        see: ["2.11#order", "2.11#try"],
        points: [
          "Use ORDER BY with a set operation and brackets to combine two of them.",
          "Give a practical query, such as students who took DBMS but not Java."
        ]
      },
      {
        title: "Comparison and conclusion",
        pages: 0.5,
        see: ["2.11#compare"],
        points: [
          "Compare the four operations, then sum up in two sentences."
        ],
        table: ["Operation, what it returns, duplicates, relational algebra symbol."]
      }
    ]
  };

  D.outlines["u2-b8"] = {
    aim: "Define aggregate functions and explain all five (COUNT, SUM, AVG, MIN, MAX) with syntax, a query on one sample table and its result. Add how they treat NULL, DISTINCT, and their use with GROUP BY and HAVING for full marks.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["2.12#what"],
        points: [
          "Define an aggregate function: it takes a set of values from many rows and returns one value.",
          "List the five functions and where they can be used (SELECT and HAVING, not WHERE)."
        ]
      },
      {
        title: "The sample table",
        pages: 0.5,
        see: ["2.12#sample"],
        points: [
          "Write the CREATE TABLE and the rows of one table, such as PRODUCT_MAST(PRODUCT, COMPANY, QTY, RATE, COST), and use it for every query."
        ],
        table: ["PRODUCT_MAST with its rows."]
      },
      {
        title: "COUNT",
        pages: 0.75,
        see: ["2.12#count"],
        points: [
          "COUNT(*), COUNT(column) and COUNT(DISTINCT column), with the result of each and the difference when the column has NULL."
        ]
      },
      {
        title: "SUM and AVG",
        pages: 0.75,
        see: ["2.12#sum", "2.12#avg"],
        points: [
          "Work only on numbers; show a query and its result for each.",
          "Show AVG with a WHERE clause."
        ]
      },
      {
        title: "MIN and MAX",
        pages: 0.5,
        see: ["2.12#minmax"],
        points: [
          "Work on numbers, text and dates; show a query and result for each."
        ]
      },
      {
        title: "Aggregates and NULL",
        pages: 0.5,
        see: ["2.12#nulls"],
        points: [
          "All functions except COUNT(*) ignore NULL; explain why AVG may differ from SUM / COUNT(*)."
        ],
        example: ["A three-row table with one NULL, and the results of COUNT(*), COUNT(col), SUM and AVG."]
      },
      {
        title: "Aggregates with GROUP BY and HAVING",
        pages: 1,
        see: ["2.12#rules", "2.13#group-by", "2.13#having"],
        points: [
          "Total cost for each company with GROUP BY; companies whose total is above a limit with HAVING.",
          "Rules: every non-aggregated column in SELECT must be in GROUP BY; an aggregate cannot be in WHERE."
        ],
        table: ["The grouped result."]
      },
      {
        title: "Summary table and conclusion",
        pages: 0.5,
        see: ["2.12#summary", "2.12#try"],
        points: [
          "Compare the five functions, then sum up their use in reports."
        ],
        table: ["Function, what it returns, data types, NULL handling."]
      }
    ]
  };

  D.outlines["u2-b9"] = {
    aim: "Two query-writing parts of about equal weight. Define your tables first, then for each requirement write the SQL, explain it in one or two sentences and show the result table. Correct syntax and the result tables decide the marks.",
    sections: [
      {
        title: "The sample tables",
        pages: 0.75,
        see: ["2.14#sample", "2.13#full"],
        points: [
          "Create two related tables with CREATE TABLE and INSERT, such as department(dept_id, dept_name) and student(roll, name, dept_id, marks).",
          "Include one student with no department and one department with no students, so the outer joins show a difference."
        ],
        table: ["Both tables with their rows."]
      },
      {
        title: "a) GROUP BY",
        pages: 0.75,
        see: ["2.13#group-by", "2.13#rules", "2.13#more"],
        points: [
          "Explain what GROUP BY does and its rule for the SELECT list.",
          "Queries: number of students in each department; average marks per department; grouping by two columns."
        ],
        table: ["The result of each query."]
      },
      {
        title: "a) HAVING",
        pages: 1,
        see: ["2.13#having", "2.13#where-having", "2.13#order"],
        points: [
          "HAVING filters groups after grouping; WHERE filters rows before.",
          "Queries: departments with more than two students; departments whose average is above 70, with a WHERE clause too.",
          "Show the order the clauses run."
        ],
        table: ["WHERE and HAVING compared.", "The result of each query."]
      },
      {
        title: "b) Inner join",
        pages: 0.75,
        see: ["2.14#inner", "2.14#natural"],
        points: [
          "Syntax with JOIN ... ON; only matching rows.",
          "Mention NATURAL JOIN and USING in one line."
        ],
        table: ["The result."]
      },
      {
        title: "b) Left, right and full outer joins",
        pages: 1.25,
        see: ["2.14#left", "2.14#right", "2.14#full", "2.14#try"],
        points: [
          "Left join keeps every student; right join keeps every department; full join keeps both.",
          "MySQL has no FULL JOIN: write it as a LEFT JOIN UNION a RIGHT JOIN.",
          "Mark the NULLs in each result."
        ],
        draw: ["Venn diagrams for inner, left, right and full joins."],
        table: ["The result of each of the three joins."]
      },
      {
        title: "Comparison and conclusion",
        pages: 0.5,
        see: ["2.14#compare"],
        points: [
          "Compare the join types, then sum up in two sentences."
        ],
        table: ["Join type, rows kept, NULLs, example use."]
      }
    ]
  };

  D.outlines["u2-b10"] = {
    aim: "Define a subquery, then explain single-row, multiple-row and correlated subqueries with the operators each uses, a query on one sample table, the steps the DBMS follows and the result. EXISTS and subqueries in other clauses add the final marks.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["2.15#what"],
        points: [
          "Define a subquery (inner query) and the outer query; rules: in brackets, usually on the right of the operator.",
          "List the types you will cover."
        ]
      },
      {
        title: "The sample table",
        pages: 0.5,
        see: ["2.15#sample"],
        points: [
          "Use one table for all examples, such as EMPLOYEE(ID, NAME, AGE, ADDRESS, DEPT, SALARY)."
        ],
        table: ["EMPLOYEE with its rows."]
      },
      {
        title: "Single-row subqueries",
        pages: 0.75,
        see: ["2.15#single"],
        points: [
          "The inner query returns one value; use =, &lt;, &gt;, &lt;=, &gt;=, &lt;&gt;.",
          "Example: employees who earn more than the average salary. Show the inner result, then the final result."
        ],
        table: ["The result."]
      },
      {
        title: "Multiple-row subqueries",
        pages: 1,
        see: ["2.15#multi"],
        points: [
          "The inner query returns several values; use IN, NOT IN, ANY and ALL.",
          "Explain &gt; ANY (more than the smallest) and &gt; ALL (more than the largest) with examples."
        ],
        table: ["Operator, meaning, example."]
      },
      {
        title: "Correlated subqueries",
        pages: 1,
        see: ["2.15#correlated", "2.15#exists", "2.15#try"],
        points: [
          "The inner query refers to the outer row, so it runs once for every outer row.",
          "Example: employees who earn more than the average of their own department; trace it for two rows.",
          "EXISTS and NOT EXISTS."
        ],
        draw: ["A flow showing the outer row passed to the inner query and the result coming back, repeated for each row."]
      },
      {
        title: "Subqueries in other clauses",
        pages: 0.75,
        see: ["2.15#from-select", "2.15#dml"],
        points: [
          "In FROM (a derived table), in SELECT (a scalar subquery), in HAVING.",
          "In INSERT, UPDATE and DELETE, with one example."
        ]
      },
      {
        title: "Subquery or join, and conclusion",
        pages: 0.5,
        see: ["2.15#vs-join"],
        points: [
          "Compare subqueries and joins, then sum up."
        ],
        table: ["Single-row, multiple-row and correlated subqueries compared: returns, operators, how often the inner query runs."]
      }
    ]
  };

  D.outlines["u2-b11"] = {
    aim: "Define a view and explain its full life: create, query, update through it, alter or replace, and drop, each with syntax and an example on sample tables. The uses of views and the rules for updatable views complete the answer.",
    sections: [
      {
        title: "Definition",
        pages: 0.5,
        see: ["2.16#what"],
        points: [
          "A view is a virtual table defined by a query; only its definition is stored, and its rows come from the base tables each time.",
          "Link it to the view level of abstraction."
        ],
        draw: ["Two base tables with an arrow to a view that shows some of their columns and rows."]
      },
      {
        title: "Sample tables",
        pages: 0.5,
        see: ["2.16#sample"],
        points: [
          "Use two tables, such as Student_Detail(STU_ID, NAME, ADDRESS) and Student_Marks(STU_ID, NAME, MARKS, AGE)."
        ],
        table: ["Both tables with their rows."]
      },
      {
        title: "Creating views",
        pages: 1,
        see: ["2.16#create", "2.16#multi"],
        points: [
          "Syntax: CREATE VIEW name AS SELECT ...",
          "A view on one table with a WHERE clause, and a view on two tables with a join.",
          "Query each view with SELECT and show the result."
        ],
        table: ["The rows of each view."]
      },
      {
        title: "Changing data through a view",
        pages: 1,
        see: ["2.16#update", "2.16#check", "2.16#updatable"],
        points: [
          "INSERT, UPDATE and DELETE through a simple view change the base table.",
          "WITH CHECK OPTION stops changes that would make a row leave the view.",
          "Rules for an updatable view: one base table, no aggregates, no DISTINCT, no GROUP BY, includes the NOT NULL columns."
        ]
      },
      {
        title: "Modifying and deleting views",
        pages: 0.75,
        see: ["2.16#change"],
        points: [
          "CREATE OR REPLACE VIEW and ALTER VIEW, with an example that adds a column.",
          "DROP VIEW, and what happens to the base tables (nothing)."
        ]
      },
      {
        title: "Uses and kinds of views",
        pages: 1,
        see: ["2.16#uses", "2.16#kinds"],
        points: [
          "Security (hide columns), simplicity (hide joins), logical data independence, consistent reports.",
          "Simple and complex views; materialized views in brief."
        ],
        table: ["Table compared with view: storage, data, update, use."]
      },
      {
        title: "Conclusion",
        pages: 0.5,
        points: [
          "Sum up: views give each user a tailored, secure window on the data without copying it."
        ]
      }
    ]
  };

  D.outlines["u2-b12"] = {
    aim: "Define a trigger and its event-condition-action parts, give the general syntax, then explain the six kinds (BEFORE or AFTER with INSERT, UPDATE or DELETE) with NEW and OLD. At least two complete, working trigger examples with the table before and after carry the most marks.",
    sections: [
      {
        title: "Definition",
        pages: 0.5,
        see: ["2.17#what"],
        points: [
          "A trigger is a stored program that the DBMS runs automatically when a given event happens on a table.",
          "Uses: computing values, enforcing rules, auditing, keeping tables in step."
        ]
      },
      {
        title: "Event, condition and action",
        pages: 0.5,
        see: ["2.17#eca"],
        points: [
          "Explain the ECA model with one example."
        ],
        draw: ["A flow: event (INSERT, UPDATE, DELETE) leads to a condition check, which leads to the action."]
      },
      {
        title: "Syntax",
        pages: 0.75,
        see: ["2.17#syntax"],
        points: [
          "Write the MySQL syntax: CREATE TRIGGER name {BEFORE | AFTER} {INSERT | UPDATE | DELETE} ON table FOR EACH ROW BEGIN ... END, with DELIMITER.",
          "Explain row-level and statement-level triggers."
        ]
      },
      {
        title: "Types of triggers and NEW and OLD",
        pages: 1,
        see: ["2.17#types", "2.17#new-old", "2.17#try"],
        points: [
          "The six kinds and when each is useful.",
          "BEFORE triggers can change NEW values; AFTER triggers see the final row.",
          "NEW is available for INSERT and UPDATE; OLD for UPDATE and DELETE."
        ],
        table: ["Trigger type, when it runs, NEW or OLD available, typical use: six rows."],
        draw: ["A timeline: BEFORE trigger, the change to the row, AFTER trigger."]
      },
      {
        title: "Example 1: computing values (BEFORE INSERT)",
        pages: 0.75,
        see: ["2.17#compute"],
        points: [
          "A trigger that fills in total and percentage from the marks; show the INSERT and the stored row."
        ]
      },
      {
        title: "Example 2: rejecting bad data or an audit log",
        pages: 1,
        see: ["2.17#validate", "2.17#audit"],
        points: [
          "A BEFORE UPDATE trigger with SIGNAL SQLSTATE that rejects a negative salary, or an AFTER DELETE trigger that writes to an audit table.",
          "Show the table before and after."
        ]
      },
      {
        title: "Managing triggers, limits and conclusion",
        pages: 0.75,
        see: ["2.17#manage", "2.17#limits"],
        points: [
          "SHOW TRIGGERS and DROP TRIGGER.",
          "Limits: hidden logic, cascading triggers, performance. Then a two-sentence conclusion."
        ]
      }
    ]
  };

  D.outlines["u2-b13"] = {
    aim: "A comparison question: the examiner wants each normal form defined side by side, one running example that moves through the forms, and a detailed comparison table. Give the differences, not only the definitions.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["2.6#why", "2.6#ladder"],
        points: [
          "Define normalization and the anomalies it removes.",
          "Say that each normal form adds one condition to the one before."
        ],
        draw: ["The ladder of normal forms."]
      },
      {
        title: "Key terms used in the comparison",
        pages: 0.5,
        see: ["2.6#prime", "2.4#types"],
        points: [
          "Candidate key, prime and non-prime attributes, full, partial and transitive dependency, super key."
        ]
      },
      {
        title: "1NF and 2NF compared",
        pages: 1,
        see: ["2.6#first", "2.6#second"],
        points: [
          "Definitions side by side; what 2NF removes (partial dependency).",
          "A table that is in 1NF but not in 2NF, and its 2NF tables."
        ],
        table: ["The example tables."]
      },
      {
        title: "2NF and 3NF compared",
        pages: 1,
        see: ["2.6#third", "2.6#worked", "2.6#compare"],
        points: [
          "Definitions side by side; what 3NF removes (transitive dependency).",
          "A table in 2NF but not 3NF, and its 3NF tables."
        ],
        table: ["The example tables."]
      },
      {
        title: "3NF and BCNF compared",
        pages: 1,
        see: ["2.8#gap", "2.8#example", "2.8#compare"],
        points: [
          "BCNF drops the \"A is prime\" escape of 3NF.",
          "A table in 3NF but not BCNF, its BCNF tables, and the dependency that is lost.",
          "3NF always keeps dependencies; BCNF may not."
        ]
      },
      {
        title: "Full comparison table and conclusion",
        pages: 1,
        see: ["2.8#test", "2.6#try"],
        points: [
          "Finish with a detailed table and a short note on which form to aim for in practice."
        ],
        table: ["1NF, 2NF, 3NF and BCNF compared on: condition, dependency removed, redundancy left, lossless join, dependency preservation, example."]
      }
    ]
  };

  D.outlines["u2-b14"] = {
    aim: "A procedure answer: list the steps from E-R diagram to normalized tables, then work one example all the way through. Draw the diagram, map it to tables, write the FDs of each table and check the normal form.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["2.1#design", "2.3#idea"],
        points: [
          "Explain the design path: requirements, E-R diagram, mapping to tables, then normalization to check and fix them."
        ],
        draw: ["A flow: requirements, conceptual design (E-R), logical design (tables), normalization, physical design."]
      },
      {
        title: "Step 1: draw the E-R diagram",
        pages: 1,
        see: ["2.2#method", "2.2#bank"],
        points: [
          "Identify entities, attributes, keys, relationships, cardinality and participation.",
          "Work one example, such as a bank with customers, accounts, loans and branches."
        ],
        draw: ["The E-R diagram for the example."]
      },
      {
        title: "Step 2: map the diagram to tables",
        pages: 1.25,
        see: ["2.3#strong", "2.3#weak", "2.3#one-many", "2.3#many-many", "2.3#multi", "2.3#summary"],
        points: [
          "Apply the mapping rules in order: strong entities, weak entities, 1 : 1, 1 : N, M : N, multivalued attributes, n-ary relationships.",
          "Write the resulting schema with keys."
        ],
        table: ["The mapped tables with primary and foreign keys."]
      },
      {
        title: "Step 3: write the functional dependencies",
        pages: 0.5,
        see: ["2.4#what", "2.4#keys"],
        points: [
          "List the FDs of each table from the business rules, and find the candidate keys."
        ]
      },
      {
        title: "Step 4: check and normalize",
        pages: 1.25,
        see: ["2.6#second", "2.6#third", "2.8#test", "2.8#decompose"],
        points: [
          "Check 1NF, 2NF, 3NF and BCNF for each table.",
          "Show one table that breaks a normal form (for example a branch city stored in the account table) and decompose it.",
          "Check that the split is lossless and preserves dependencies."
        ],
        table: ["The final normalized schema."]
      },
      {
        title: "Conclusion",
        pages: 0.5,
        see: ["2.5#compare"],
        points: [
          "A good E-R design usually gives tables already in 3NF; normalization catches what the design missed."
        ]
      }
    ]
  };

  D.outlines["u2-b15"] = {
    aim: "The same two properties as the non-loss decomposition question, with the weight on clear definitions, the formal tests and worked examples. Show each test being applied, not only stated.",
    sections: [
      {
        title: "Introduction",
        pages: 0.5,
        see: ["2.5#anomalies", "2.5#decomposition"],
        points: [
          "Why we decompose, and the two properties a good decomposition must have."
        ]
      },
      {
        title: "Lossless join decomposition",
        pages: 0.75,
        see: ["2.5#lossless"],
        points: [
          "Definition with the join condition; what spurious tuples are."
        ]
      },
      {
        title: "Lossless join: examples",
        pages: 1,
        see: ["2.5#spurious", "2.5#binary-test"],
        points: [
          "A lossy split with the spurious tuples shown.",
          "A lossless split with the binary test R1 ∩ R2 → R1 or R2 worked through."
        ],
        table: ["The lossy join result with the spurious rows marked."]
      },
      {
        title: "Testing with three or more parts",
        pages: 0.5,
        see: ["2.5#tableau", "2.5#try"],
        points: [
          "The tableau (matrix) test: set up the rows, apply the FDs, look for a row of all a's."
        ]
      },
      {
        title: "Dependency preservation",
        pages: 1,
        see: ["2.7#why", "2.7#restriction", "2.7#definition", "2.7#test", "2.7#algorithm"],
        points: [
          "Definition with restrictions and closure.",
          "The test that avoids computing F+.",
          "What a lost FD costs in SQL: a join or a trigger on every update."
        ]
      },
      {
        title: "Dependency preservation: examples",
        pages: 1,
        see: ["2.7#lost", "2.7#kept", "2.7#sql"],
        points: [
          "One decomposition that loses an FD and one that keeps it, worked step by step."
        ]
      },
      {
        title: "Comparison and conclusion",
        pages: 0.5,
        see: ["2.7#both", "2.5#compare"],
        points: [
          "Compare the two properties, then conclude."
        ],
        table: ["Lossless join and dependency preservation compared: meaning, test, what happens without it, required or preferred."]
      }
    ]
  };

  D.outlines["u2-b16"] = {
    aim: "A diagram question. State your assumptions first, list the entities and relationships, then draw one large, correct diagram with keys, cardinality and participation. Explain each relationship afterwards and, for extra marks, map it to tables.",
    sections: [
      {
        title: "Requirements and assumptions",
        pages: 0.75,
        see: ["2.2#insurance"],
        points: [
          "Restate the requirements in your own words.",
          "List your assumptions clearly, such as: a car is owned by one customer; an accident can involve several cars; each policy covers one or more cars; premium payments are numbered within a policy."
        ]
      },
      {
        title: "Entity sets and attributes",
        pages: 0.75,
        see: ["2.1#entity", "2.1#attributes", "2.1#weak"],
        points: [
          "Customer, Car, Accident, Policy, and Premium_payment as a weak entity set, each with its attributes and key."
        ],
        table: ["Entity set, attributes, key."]
      },
      {
        title: "Relationship sets",
        pages: 0.5,
        see: ["2.1#relationship", "2.1#cardinality", "2.1#participation"],
        points: [
          "Owns (Customer, Car) 1 : N; Participated (Car, Accident) M : N with DamageAmt; Covers (Policy, Car); Pays (identifying, Policy and Premium_payment).",
          "Give the cardinality and participation of each, with the reason."
        ]
      },
      {
        title: "The E-R diagram",
        pages: 1.5,
        see: ["2.2#symbols", "2.2#method", "2.1#try"],
        points: [
          "Draw it across a full page, with a legend, keys underlined, partial key dashed and cardinality on every line.",
          "Show total participation with double lines (every car is owned)."
        ],
        draw: ["Car insurance E-R diagram: Customer, Car, Accident, Policy, weak Premium_payment, with Owns, Participated (DamageAmt), Covers and Pays."]
      },
      {
        title: "Explanation of the diagram",
        pages: 0.5,
        points: [
          "Explain each relationship and each constraint in one or two sentences, linking back to your assumptions."
        ]
      },
      {
        title: "Mapping to tables",
        pages: 0.75,
        see: ["2.3#summary"],
        points: [
          "Map the diagram to tables to show the design works."
        ],
        table: ["The relational schema with keys underlined and foreign keys marked."]
      },
      {
        title: "Conclusion",
        pages: 0.25,
        points: [
          "Sum up the design and repeat that it rests on the stated assumptions."
        ]
      }
    ]
  };

  D.outlines["u2-b17"] = {
    aim: "A problem to solve, not a theory essay. State the business rules (FDs) because the question gives none, find the key, identify the partial and transitive dependencies, then show the tables after 2NF, 3NF and BCNF with every step justified. Add sample rows to show the redundancy.",
    sections: [
      {
        title: "The relation and its business rules",
        pages: 0.75,
        see: ["2.6#question", "2.4#what"],
        points: [
          "Write R(StudentID, StudentName, CourseID, CourseName, Instructor) with five or six sample rows.",
          "State the FDs you assume: StudentID → StudentName; CourseID → CourseName, Instructor."
        ],
        table: ["R with sample rows that show a student and a course repeated."]
      },
      {
        title: "Finding the candidate key",
        pages: 0.5,
        see: ["2.4#attr-closure", "2.4#keys"],
        points: [
          "Compute {StudentID, CourseID}+ and show it contains every attribute; show neither attribute alone is enough.",
          "Name the prime and non-prime attributes."
        ]
      },
      {
        title: "Anomalies in R",
        pages: 0.5,
        see: ["2.5#anomalies"],
        points: [
          "One insert, one update and one delete anomaly from the sample rows."
        ]
      },
      {
        title: "Partial dependencies and 2NF",
        pages: 1,
        see: ["2.6#prime", "2.6#second"],
        points: [
          "Identify StudentID → StudentName and CourseID → CourseName, Instructor as partial.",
          "Decompose into Student, Course and Enrollment, and show the sample rows in each."
        ],
        table: ["The three 2NF tables with rows."]
      },
      {
        title: "Transitive dependencies and 3NF",
        pages: 1,
        see: ["2.6#third"],
        points: [
          "With these rules there is no transitive dependency, so the 2NF tables are in 3NF. Say this clearly with the reason.",
          "Show what changes if the table also stored the instructor's room: CourseID → Instructor → Room, and the extra table it needs."
        ]
      },
      {
        title: "BCNF",
        pages: 1,
        see: ["2.8#definition", "2.8#test", "2.8#example"],
        points: [
          "Check every FD of each table: its left side is a key, so all are in BCNF.",
          "Show the other rule (a course has several instructors, each teaches one course): Instructor → CourseID breaks BCNF; decompose and note the lost dependency."
        ]
      },
      {
        title: "Final schema and conclusion",
        pages: 0.5,
        see: ["2.6#sql", "2.6#try"],
        points: [
          "Write the final tables with keys, check that the decomposition is lossless, and conclude."
        ],
        table: ["Final tables with primary and foreign keys."]
      }
    ]
  };
})();
