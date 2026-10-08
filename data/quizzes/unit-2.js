/* Unit II quiz items. Types: mcq (one answer), multi (all that apply),
   tf (true or false) and order (put the steps in order; options are listed in
   the correct order and shuffled on screen). */
(function () {
  var D = (window.DBMS = window.DBMS || {});
  D.quizzes = (D.quizzes || []).concat([
    /* 2.1 Entity-Relationship Model */
    {
      id: "q2.1-01",
      topic: "2.1",
      type: "mcq",
      question: "In which step of database design is the E-R diagram drawn?",
      options: ["Requirement analysis", "Conceptual design", "Physical design", "Schema refinement"],
      answer: 1,
      explain: "The E-R diagram is the conceptual design. Logical design then turns it into tables.",
      link: "#design"
    },
    {
      id: "q2.1-02",
      topic: "2.1",
      type: "mcq",
      question: "A student can have several phone numbers. In Chen notation, Phone is drawn as:",
      options: ["A dashed ellipse", "A double ellipse", "A double rectangle", "An ellipse with its name underlined"],
      answer: 1,
      explain: "A multivalued attribute is a double ellipse. A dashed ellipse is a derived attribute.",
      link: "#attributes"
    },
    {
      id: "q2.1-03",
      topic: "2.1",
      type: "mcq",
      question: "Which attribute is best stored as a derived attribute?",
      options: ["Date of birth", "Register number", "Age", "Name"],
      answer: 2,
      explain: "Age can be calculated from the date of birth, so it is derived and need not be stored.",
      link: "#attributes"
    },
    {
      id: "q2.1-04",
      topic: "2.1",
      type: "mcq",
      question: "Many students belong to one department, and each student belongs to only one department. What is the mapping cardinality from Student to Department?",
      options: ["One to one", "One to many", "Many to one", "Many to many"],
      answer: 2,
      explain: "Many students map to one department, so Student to Department is many to one (N : 1).",
      link: "#cardinality"
    },
    {
      id: "q2.1-05",
      topic: "2.1",
      type: "tf",
      question: "A double line between an entity set and a relationship set means every entity in that set must take part in the relationship.",
      answer: true,
      explain: "True. The double line shows total participation.",
      link: "#participation"
    },
    {
      id: "q2.1-06",
      topic: "2.1",
      type: "mcq",
      question: "What is the primary key of the weak entity set Section, whose owner is Course(CourseID) and whose discriminator is SecNo?",
      options: ["SecNo", "CourseID", "(CourseID, SecNo)", "Section has no key at all"],
      answer: 2,
      explain: "The key of a weak entity set is the owner's primary key plus the discriminator.",
      link: "#weak"
    },
    {
      id: "q2.1-07",
      topic: "2.1",
      type: "multi",
      question: "Which of these are drawn with a double shape in Chen notation? Select all that apply.",
      options: ["Weak entity set", "Multivalued attribute", "Identifying relationship", "Key attribute"],
      answer: [0, 1, 2],
      explain: "Weak entity sets (double rectangle), multivalued attributes (double ellipse) and identifying relationships (double diamond) are doubled. A key attribute is underlined.",
      link: "#weak"
    },
    {
      id: "q2.1-08",
      topic: "2.1",
      type: "mcq",
      question: "Grade depends on both the student and the course. Where does Grade belong in the E-R diagram?",
      options: ["On Student", "On Course", "On the relationship set Takes", "On a new weak entity set"],
      answer: 2,
      explain: "Grade describes one student in one course, so it is a descriptive attribute of Takes.",
      link: "#relationship"
    },
    /* 2.2 E-R Diagrams */
    {
      id: "q2.2-01",
      topic: "2.2",
      type: "mcq",
      question: "A problem statement says: \"Students borrow books from the library.\" How is \"borrow\" drawn?",
      options: ["As a rectangle", "As a diamond", "As an ellipse", "As a double ellipse"],
      answer: 1,
      explain: "A verb that joins two entity sets is a relationship set, drawn as a diamond.",
      link: "#method"
    },
    {
      id: "q2.2-02",
      topic: "2.2",
      type: "mcq",
      question: "\"Each car has zero or more recorded accidents.\" What is the participation of Car in Participated?",
      options: ["Total, so a double line", "Partial, so a single line", "It cannot be decided", "Car must be a weak entity set"],
      answer: 1,
      explain: "Zero accidents is allowed, so some cars do not take part. That is partial participation, a single line.",
      link: "#insurance"
    },
    {
      id: "q2.2-03",
      topic: "2.2",
      type: "mcq",
      question: "In the bank diagram, why is Payment a weak entity set?",
      options: ["It has no attributes", "Payment number 1 exists for every loan, so PayNo alone is not unique", "It is many to many with Loan", "It is a derived attribute"],
      answer: 1,
      explain: "PayNo is unique only within one loan, so Payment needs the owner's key: (LoanNo, PayNo).",
      link: "#bank"
    },
    {
      id: "q2.2-04",
      topic: "2.2",
      type: "tf",
      question: "In an E-R diagram, the Student entity set should show DeptID as an attribute to link it to Department.",
      answer: false,
      explain: "False. The relationship line is the link. Foreign keys such as DeptID appear only when the diagram is mapped to tables.",
      link: "#method"
    },
    {
      id: "q2.2-05",
      topic: "2.2",
      type: "order",
      question: "Put the steps for drawing an E-R diagram in order.",
      options: ["Find the entity sets", "Find the attributes and keys", "Find the relationship sets", "Mark the mapping cardinality", "Mark the participation"],
      explain: "Things first, then their facts, then the links, then how many and whether every entity must take part.",
      link: "#method"
    },
    {
      id: "q2.2-06",
      topic: "2.2",
      type: "mcq",
      question: "Given Employee(empno, ...), Books(isbn, ...) and Loan(empno, isbn, date), what is Loan in the E-R diagram?",
      options: ["An entity set with key date", "A weak entity set of Employee", "A relationship set between Employee and Books, with attribute date", "A multivalued attribute of Books"],
      answer: 2,
      explain: "Loan holds the keys of both entity sets plus one fact about the pair, so it is a relationship set with the attribute date.",
      link: "#reverse"
    },
    {
      id: "q2.2-07",
      topic: "2.2",
      type: "multi",
      question: "In the car insurance diagram, which entity sets have total participation? Select all that apply.",
      options: ["Customer in Owns", "Car in Participated", "Policy in Covers", "Premium_payment in Pays"],
      answer: [0, 2, 3],
      explain: "Every customer owns a car, every policy covers a car, and every payment belongs to a policy. A car may have no accident.",
      link: "#insurance"
    },
    /* 2.3 ER-to-Relational Mapping */
    {
      id: "q2.3-01",
      topic: "2.3",
      type: "mcq",
      question: "Advisor is 1 : N from Instructor to Student. Where does the foreign key go?",
      options: ["InstID goes into Student", "ID goes into Instructor", "A new table Advisor is required", "Both tables get a foreign key"],
      answer: 0,
      explain: "The foreign key goes into the many side. Each student has one advisor, so Student stores InstID.",
      link: "#one-many"
    },
    {
      id: "q2.3-02",
      topic: "2.3",
      type: "mcq",
      question: "What is the primary key of the table for the M : N relationship Takes(ID, CourseID, Grade)?",
      options: ["ID", "CourseID", "(ID, CourseID)", "(ID, CourseID, Grade)"],
      answer: 2,
      explain: "The primary key of an M : N relationship table is the combination of the participating entity sets' keys.",
      link: "#many-many"
    },
    {
      id: "q2.3-03",
      topic: "2.3",
      type: "mcq",
      question: "The weak entity set Payment (partial key PayNo) belongs to Loan (key LoanNo). What is the primary key of the Payment table?",
      options: ["PayNo", "LoanNo", "(LoanNo, PayNo)", "A new surrogate key"],
      answer: 2,
      explain: "A weak entity set's primary key is the owner's key plus the partial key.",
      link: "#weak"
    },
    {
      id: "q2.3-04",
      topic: "2.3",
      type: "mcq",
      question: "How is the multivalued attribute Phone of Student mapped?",
      options: ["As a column that holds a comma-separated list", "As three columns Phone1, Phone2 and Phone3", "As a new table Student_Phone(ID, Phone)", "It is not stored"],
      answer: 2,
      explain: "A multivalued attribute gets its own table with the owner's key and the attribute; both form the primary key.",
      link: "#multi"
    },
    {
      id: "q2.3-05",
      topic: "2.3",
      type: "tf",
      question: "A derived attribute such as Age becomes a column of the table.",
      answer: false,
      explain: "False. A derived attribute is not stored. It is calculated from DOB when needed.",
      link: "#strong"
    },
    {
      id: "q2.3-06",
      topic: "2.3",
      type: "multi",
      question: "Which E-R constructs always need a new table of their own? Select all that apply.",
      options: ["An M : N relationship set", "A 1 : N relationship set", "A multivalued attribute", "A composite attribute"],
      answer: [0, 2],
      explain: "M : N relationships and multivalued attributes need new tables. A 1 : N relationship is a foreign key, and a composite attribute becomes several columns.",
      link: "#summary"
    },
    {
      id: "q2.3-07",
      topic: "2.3",
      type: "mcq",
      question: "A relationship table Works_In(EmpID, DeptID, EName, Salary, DeptName) is proposed. What is wrong with it?",
      options: ["Nothing; relationship tables copy all attributes", "EName, Salary and DeptName belong to the entity tables and cause redundancy", "It must not have EmpID", "It needs Age as well"],
      answer: 1,
      explain: "A relationship table holds only the keys and the relationship's own attributes. Copying entity attributes repeats data.",
      link: "#many-many"
    },
    /* 2.4 Functional Dependencies */
    {
      id: "q2.4-01",
      topic: "2.4",
      type: "mcq",
      question: "In R, two rows have RollNo = 5. One has Name = Ravi and the other Name = Kavin. What does this show?",
      options: ["RollNo → Name holds", "RollNo → Name does not hold", "Name → RollNo holds", "RollNo is a candidate key"],
      answer: 1,
      explain: "Rows that agree on RollNo disagree on Name, so the FD RollNo → Name fails on this table.",
      link: "#what"
    },
    {
      id: "q2.4-02",
      topic: "2.4",
      type: "mcq",
      question: "Which FD is trivial?",
      options: ["A → B", "AB → A", "A → AB", "AB → C"],
      answer: 1,
      explain: "An FD is trivial when the right side is a subset of the left side. {A} is a subset of {A, B}.",
      link: "#types"
    },
    {
      id: "q2.4-03",
      topic: "2.4",
      type: "mcq",
      question: "Which rule says: if X → Y and Y → Z, then X → Z?",
      options: ["Reflexivity", "Augmentation", "Transitivity", "Decomposition"],
      answer: 2,
      explain: "That is the transitivity rule, one of Armstrong's three axioms.",
      link: "#axioms"
    },
    {
      id: "q2.4-04",
      topic: "2.4",
      type: "mcq",
      question: "R(A, B, C, D) with F = {A → B, B → C, C → D}. What is A+?",
      options: ["{A, B}", "{A, B, C}", "{A, B, C, D}", "{A}"],
      answer: 2,
      explain: "A gives B, B gives C and C gives D, so A+ = {A, B, C, D}. A is a superkey.",
      link: "#attr-closure"
    },
    {
      id: "q2.4-05",
      topic: "2.4",
      type: "mcq",
      question: "R(A, B, C) with F = {A → B, B → C}. Which is the only candidate key?",
      options: ["A", "B", "AB", "C"],
      answer: 0,
      explain: "A never appears on a right side, so it is in every key, and A+ = {A, B, C}. So A is the only candidate key.",
      link: "#keys"
    },
    {
      id: "q2.4-06",
      topic: "2.4",
      type: "tf",
      question: "In Marks(RegNo, CourseID, StudentName, Marks) with key {RegNo, CourseID}, the FD RegNo → StudentName is a partial dependency.",
      answer: true,
      explain: "True. StudentName is non-prime and depends on RegNo, which is only part of the key.",
      link: "#types"
    },
    {
      id: "q2.4-07",
      topic: "2.4",
      type: "mcq",
      question: "F = {A → B, AB → C}. In AB → C, which attribute is extraneous?",
      options: ["A", "B", "C", "None"],
      answer: 1,
      explain: "A+ = {A, B, C} using A → B, so A alone determines C. B is extraneous and the FD becomes A → C.",
      link: "#cover"
    },
    {
      id: "q2.4-08",
      topic: "2.4",
      type: "order",
      question: "Put the steps for finding a canonical cover in order.",
      options: ["Split every right side into single attributes", "Remove extraneous attributes from left sides", "Remove redundant FDs", "Combine FDs with the same left side"],
      explain: "Split, simplify the left sides, drop redundant FDs, then combine with the union rule.",
      link: "#cover"
    },
    {
      id: "q2.5-01",
      topic: "2.5",
      type: "mcq",
      question: "A new department cannot be stored until it has at least one employee. Which anomaly is this?",
      options: ["Update anomaly", "Insertion anomaly", "Deletion anomaly", "Join anomaly"],
      answer: 1,
      explain: "We cannot insert a fact (the department) without an unrelated fact (an employee). That is an insertion anomaly.",
      link: "#anomalies"
    },
    {
      id: "q2.5-02",
      topic: "2.5",
      type: "tf",
      question: "In a non-loss decomposition, joining the parts gives back exactly the original rows, with no extra rows.",
      answer: true,
      explain: "True. Lossless means r = r1 ⋈ r2. A lossy split adds extra (spurious) rows, so we can no longer tell which rows are real.",
      link: "#lossless"
    },
    {
      id: "q2.5-03",
      topic: "2.5",
      type: "mcq",
      question: "A lossy decomposition is joined back. What do we get?",
      options: ["Fewer rows than the original", "Extra rows that were never in the original", "Exactly the original rows", "An error"],
      answer: 1,
      explain: "The join always contains the original rows. A lossy split adds spurious rows, and the information about which rows are real is lost.",
      link: "#spurious"
    },
    {
      id: "q2.5-04",
      topic: "2.5",
      type: "multi",
      question: "R is split into R1 and R2. Which conditions make the split lossless? Select all that apply.",
      options: ["R1 ∩ R2 → R1 is in F+", "R1 ∩ R2 → R2 is in F+", "R1 ∪ R2 → R1 is in F+", "R1 and R2 have no common attribute"],
      answer: [0, 1],
      explain: "The common attributes must be a superkey of R1 or of R2. Either one is enough. With no common attribute the join is a cross product, which is lossy.",
      link: "#binary-test"
    },
    {
      id: "q2.5-05",
      topic: "2.5",
      type: "mcq",
      question: "R(A, B, C) with F = {A → B}. Which split is lossless?",
      options: ["(A, B) and (A, C)", "(A, B) and (B, C)", "(A, C) and (B, C)", "(A) and (B, C)"],
      answer: 0,
      explain: "(A, B) ∩ (A, C) = A, and A → AB, so A is a key of the first part. In the other splits the common attribute is not a key of either part.",
      link: "#binary-test"
    },
    {
      id: "q2.5-06",
      topic: "2.5",
      type: "tf",
      question: "In the tableau test, the decomposition is lossless when some row becomes all a symbols.",
      answer: true,
      explain: "True. A row of only a symbols means the join must contain the original tuple, so no information is lost.",
      link: "#tableau"
    },
    {
      id: "q2.5-07",
      topic: "2.5",
      type: "order",
      question: "Put the steps of the tableau test in order.",
      options: ["Make one row for each part and one column for each attribute", "Put a in the columns the part has and b symbols elsewhere", "Apply each FD to make matching rows agree", "Repeat until no FD changes the table", "Check for a row of only a symbols"],
      explain: "Build the table, fill in a and b symbols, chase with the FDs until nothing changes, then look for an all-a row.",
      link: "#tableau"
    }
  ]);
})();
