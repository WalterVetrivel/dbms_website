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
    }
  ]);
})();
