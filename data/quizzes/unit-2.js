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
    },
    {
      id: "q2.6-01",
      topic: "2.6",
      type: "mcq",
      question: "A Student table stores two phone numbers in one cell for some students. Which normal form does it break?",
      options: ["1NF", "2NF", "3NF", "BCNF"],
      answer: 0,
      explain: "1NF needs one atomic value in every cell. A list of phone numbers in one cell is not atomic.",
      link: "#first"
    },
    {
      id: "q2.6-02",
      topic: "2.6",
      type: "mcq",
      question: "R(A, B, C, D) has candidate keys AB and BC. Which attributes are prime?",
      options: ["A and B only", "B only", "A, B and C", "A, B, C and D"],
      answer: 2,
      explain: "A prime attribute is part of some candidate key. A, B and C each appear in a key; D does not.",
      link: "#prime"
    },
    {
      id: "q2.6-03",
      topic: "2.6",
      type: "mcq",
      question: "In Student_Course(sid, sname, cid, cname) with key {sid, cid}, what kind of dependency is sid → sname?",
      options: ["Full dependency", "Partial dependency", "Transitive dependency", "Trivial dependency"],
      answer: 1,
      explain: "sname is non-prime and depends on sid, which is only part of the key. That is a partial dependency, so the table is not in 2NF.",
      link: "#second"
    },
    {
      id: "q2.6-04",
      topic: "2.6",
      type: "tf",
      question: "A table in 1NF whose only candidate key has a single attribute is always in 2NF.",
      answer: true,
      explain: "True. A partial dependency needs a proper part of a key, and a one-attribute key has no proper part.",
      link: "#second"
    },
    {
      id: "q2.6-05",
      topic: "2.6",
      type: "mcq",
      question: "Student_details(sid, sname, zipcode, cityname) has sid → sname, zipcode and zipcode → cityname. Why is it not in 3NF?",
      options: ["sname is not atomic", "cityname depends on the key only through zipcode", "zipcode is part of the key", "sid is not a key"],
      answer: 1,
      explain: "sid → zipcode → cityname is a transitive dependency. zipcode is not a key, and cityname is non-prime.",
      link: "#third"
    },
    {
      id: "q2.6-06",
      topic: "2.6",
      type: "multi",
      question: "R is in 3NF if, for every non-trivial FD X → A, at least one of these holds. Select the two conditions.",
      options: ["X is a superkey of R", "A is a prime attribute", "A is a non-prime attribute", "X is a single attribute"],
      answer: [0, 1],
      explain: "3NF allows X → A when X is a superkey or when A is prime. BCNF drops the second condition.",
      link: "#third"
    },
    {
      id: "q2.6-07",
      topic: "2.6",
      type: "mcq",
      question: "R(A to J) with AB → C, A → DE, B → F, F → GH, D → IJ. Which set of tables is in 3NF?",
      options: ["(A, B, C), (A, D, E), (D, I, J), (B, F), (F, G, H)", "(A, B, C), (A, D, E, I, J), (B, F, G, H)", "(A, B, C), (A, D, E), (D, I, J), (B, E), (E, G, H)", "(A, B), (C, D, E), (F, G, H, I, J)"],
      answer: 0,
      explain: "The second set is only 2NF: D → IJ and F → GH are transitive. The third set uses E where it should use F.",
      link: "#worked"
    },
    {
      id: "q2.6-08",
      topic: "2.6",
      type: "order",
      question: "Put the steps for normalizing a table up to 3NF in order.",
      options: ["Make every value atomic (1NF)", "Find the candidate keys and the prime attributes", "Move out each partial dependency (2NF)", "Move out each transitive dependency (3NF)"],
      explain: "First fix the cells, then find the keys, because 2NF and 3NF are defined using keys. Remove partial dependencies before transitive ones.",
      link: "#ladder"
    },
    {
      id: "q2.7-01",
      topic: "2.7",
      type: "mcq",
      question: "When is a decomposition of R into R1, ..., Rn dependency preserving?",
      options: ["When F1 ∪ ... ∪ Fn = F", "When (F1 ∪ ... ∪ Fn)+ = F+", "When R1 ∩ R2 is a key", "When R1 ⋈ ... ⋈ Rn = R"],
      answer: 1,
      explain: "The closures must be equal. The sets themselves can differ. R1 ⋈ ... ⋈ Rn = R is the lossless-join condition.",
      link: "#definition"
    },
    {
      id: "q2.7-02",
      topic: "2.7",
      type: "tf",
      question: "Fi, the set of FDs that hold on part Ri, contains only FDs that are written in F.",
      answer: false,
      explain: "False. Fi is taken from F+. For R(A, B, C) with A → B and B → C, the part (A, C) has A → C, which is not written in F.",
      link: "#restriction"
    },
    {
      id: "q2.7-03",
      topic: "2.7",
      type: "mcq",
      question: "R(A, B, C) with F = {A → B, B → C} is split into (A, C) and (B, C). Which FD is lost?",
      options: ["A → B", "B → C", "A → C", "None"],
      answer: 0,
      explain: "F1 = {A → C} and F2 = {B → C}. Under these, A+ = {A, C}, which does not contain B. So A → B is lost.",
      link: "#lost"
    },
    {
      id: "q2.7-04",
      topic: "2.7",
      type: "mcq",
      question: "R(A, B, C, D) with A → B, B → C, C → D, D → B is split into (A, B), (B, C) and (B, D). How is C → D preserved?",
      options: ["It fits inside (B, C)", "C → B from (B, C) and B → D from (B, D)", "It is not preserved", "A → B and B → C"],
      answer: 1,
      explain: "C → D fits in no single part. But C → B holds on (B, C) and B → D holds on (B, D), so C → D follows by transitivity.",
      link: "#kept"
    },
    {
      id: "q2.7-05",
      topic: "2.7",
      type: "multi",
      question: "Which statements are true? Select all that apply.",
      options: ["Lossless join is required for every decomposition", "Dependency preservation is always possible with BCNF", "3NF can always be both lossless and dependency preserving", "A split can be lossless but not dependency preserving"],
      answer: [0, 2, 3],
      explain: "BCNF sometimes has to lose an FD, as in Enrollment(sid, course, teacher). 3NF never needs to. Splitting (A, B, C) into (A, B) and (A, C) is lossless but loses B → C.",
      link: "#both"
    },
    {
      id: "q2.7-06",
      topic: "2.7",
      type: "tf",
      question: "If every FD of F has all its attributes inside one part, the decomposition is dependency preserving.",
      answer: true,
      explain: "True. Each such FD is in some Fi, so it follows from F1 ∪ ... ∪ Fn.",
      link: "#test"
    },
    {
      id: "q2.7-07",
      topic: "2.7",
      type: "mcq",
      question: "An FD is lost in a decomposition. What does the database need to enforce it?",
      options: ["A primary key", "A UNIQUE constraint on one table", "A join on every change, for example in a trigger", "Nothing; it is enforced automatically"],
      answer: 2,
      explain: "Its attributes are in different tables, so no key in one table can check it. A trigger or a query must join the tables.",
      link: "#sql"
    },
    {
      id: "q2.8-01",
      topic: "2.8",
      type: "mcq",
      question: "A relation is in BCNF when, for every non-trivial FD X → Y:",
      options: ["X is a superkey", "Y is a prime attribute", "X is a superkey or Y is prime", "X is a single attribute"],
      answer: 0,
      explain: "BCNF needs every determinant to be a superkey. “X is a superkey or Y is prime” is the 3NF rule.",
      link: "#definition"
    },
    {
      id: "q2.8-02",
      topic: "2.8",
      type: "tf",
      question: "Every relation in BCNF is also in 3NF.",
      answer: true,
      explain: "True. If X is a superkey for every FD, the 3NF condition “X is a superkey or A is prime” always holds.",
      link: "#gap"
    },
    {
      id: "q2.8-03",
      topic: "2.8",
      type: "mcq",
      question: "Enrollment(sid, course, teacher) has (sid, course) → teacher and teacher → course. What is its highest normal form?",
      options: ["1NF", "2NF", "3NF", "BCNF"],
      answer: 2,
      explain: "The keys are {sid, course} and {sid, teacher}, so every attribute is prime and the relation is in 3NF. teacher is not a superkey, so teacher → course breaks BCNF.",
      link: "#example"
    },
    {
      id: "q2.8-04",
      topic: "2.8",
      type: "mcq",
      question: "R(A, B, C, D) with AB → C, AB → D, C → A, B → D. What is its highest normal form?",
      options: ["1NF", "2NF", "3NF", "BCNF"],
      answer: 0,
      explain: "The keys are AB and BC, and D is non-prime. B → D is a partial dependency, so R is not in 2NF.",
      link: "#test"
    },
    {
      id: "q2.8-05",
      topic: "2.8",
      type: "tf",
      question: "Every relation with exactly two attributes is in BCNF.",
      answer: true,
      explain: "True. Any non-trivial FD on R(A, B) is A → B or B → A, and its left side is then a key.",
      link: "#more"
    },
    {
      id: "q2.8-06",
      topic: "2.8",
      type: "multi",
      question: "Which statements about BCNF decomposition are true? Select all that apply.",
      options: ["It is always lossless", "It is always dependency preserving", "It may lose an FD", "It splits on an FD whose left side is not a superkey"],
      answer: [0, 2, 3],
      explain: "Each split keeps X as a key of one part, so it is lossless. But an FD can end up across tables, as (sid, course) → teacher does.",
      link: "#decompose"
    },
    {
      id: "q2.8-07",
      topic: "2.8",
      type: "mcq",
      question: "When can a relation be in 3NF but not in BCNF?",
      options: ["When it has a repeating group", "When it has a partial dependency", "When it has overlapping candidate keys", "When it has only one candidate key"],
      answer: 2,
      explain: "The gap needs an FD X → A with A prime and X not a superkey. That only happens when candidate keys overlap.",
      link: "#gap"
    },
    {
      id: "q2.8-08",
      topic: "2.8",
      type: "order",
      question: "Put the steps for finding the highest normal form of a relation in order.",
      options: ["Find all candidate keys and the prime attributes", "Check BCNF: is every left side a superkey?", "Check 3NF: is every left side a superkey or every right side prime?", "Check 2NF: is there a partial dependency?"],
      explain: "Keys first, because every test uses them. Then test from the top (BCNF) down until one passes.",
      link: "#test"
    },
    {
      id: "q2.9-01",
      topic: "2.9",
      type: "mcq",
      question: "Student(sid, course, skill) stores each student's courses and spoken languages, which are unrelated. Which dependency holds?",
      options: ["sid → course", "sid →→ course", "course → skill", "course →→ skill"],
      answer: 1,
      explain: "A student has a set of courses that is independent of the student's skills. That is the MVD sid →→ course (and sid →→ skill).",
      link: "#mvd"
    },
    {
      id: "q2.9-02",
      topic: "2.9",
      type: "tf",
      question: "Student(sid, course, skill) with sid →→ course and no FDs is in BCNF.",
      answer: true,
      explain: "True. No non-trivial FD holds, so BCNF has nothing to complain about. The redundancy comes from the MVD, which 4NF handles.",
      link: "#problem"
    },
    {
      id: "q2.9-03",
      topic: "2.9",
      type: "mcq",
      question: "In R(A, B, C), A →→ B holds. Which other MVD must hold?",
      options: ["B →→ C", "A →→ C", "C →→ A", "None"],
      answer: 1,
      explain: "Complementation: X →→ Y gives X →→ R − X − Y. Here that is A →→ C.",
      link: "#rules"
    },
    {
      id: "q2.9-04",
      topic: "2.9",
      type: "multi",
      question: "Which MVDs are trivial in R(A, B, C)? Select all that apply.",
      options: ["A →→ A", "A →→ BC", "A →→ B", "AB →→ C"],
      answer: [0, 1, 3],
      explain: "An MVD is trivial if Y ⊆ X or X ∪ Y = R. A →→ A has Y ⊆ X; A →→ BC and AB →→ C cover all of R. A →→ B is not trivial.",
      link: "#rules"
    },
    {
      id: "q2.9-05",
      topic: "2.9",
      type: "mcq",
      question: "A relation is in 4NF when, for every non-trivial MVD X →→ Y:",
      options: ["Y is prime", "X is a superkey", "X is a single attribute", "Y is a superkey"],
      answer: 1,
      explain: "4NF is the BCNF rule applied to MVDs: the left side must be a superkey.",
      link: "#fourth"
    },
    {
      id: "q2.9-06",
      topic: "2.9",
      type: "mcq",
      question: "How should Student(sid, course, skill), with sid →→ course, be split into 4NF?",
      options: ["(sid, course) and (course, skill)", "(sid, course) and (sid, skill)", "(sid) and (course, skill)", "(sid, skill) and (course, skill)"],
      answer: 1,
      explain: "Split on X →→ Y into (X ∪ Y) and (X ∪ the rest). sid stays in both, and the join gives back exactly the original rows.",
      link: "#decompose"
    },
    {
      id: "q2.9-07",
      topic: "2.9",
      type: "tf",
      question: "Every functional dependency is also a multivalued dependency.",
      answer: true,
      explain: "True. If X → Y, each X value has a set of exactly one Y value, so X →→ Y holds.",
      link: "#rules"
    },
    {
      id: "q2.10-01",
      topic: "2.10",
      type: "mcq",
      question: "What does the join dependency *(R1, R2, R3) on R say?",
      options: ["R1, R2 and R3 have a common key", "R always equals the natural join of its projections on R1, R2 and R3", "R1 → R2 → R3", "R has no spurious rows only when split into two"],
      answer: 1,
      explain: "A JD says that splitting R into those parts and joining them back is always lossless.",
      link: "#jd"
    },
    {
      id: "q2.10-02",
      topic: "2.10",
      type: "tf",
      question: "A multivalued dependency is a join dependency with two parts.",
      answer: true,
      explain: "True. X →→ Y holds exactly when *(X ∪ Y, X ∪ Z) holds, where Z is the rest of R.",
      link: "#jd"
    },
    {
      id: "q2.10-03",
      topic: "2.10",
      type: "mcq",
      question: "Supply(seller, company, product) follows the seller rule. Splitting it into (seller, company) and (company, product) adds (Kumar, Godrej, AC). What does that show?",
      options: ["The table is not in 1NF", "This two-way split is lossy", "The three-way split is lossy too", "seller → company"],
      answer: 1,
      explain: "A row that was never in the table appeared after the join, so the split loses information. The three-way split removes it.",
      link: "#example"
    },
    {
      id: "q2.10-04",
      topic: "2.10",
      type: "mcq",
      question: "A relation is in 5NF (PJNF) when:",
      options: ["It has no MVDs", "Every non-trivial JD is implied by its candidate keys", "It has only two attributes", "Every attribute is prime"],
      answer: 1,
      explain: "5NF allows only the join dependencies that follow from the keys, which cause no redundancy.",
      link: "#fifth"
    },
    {
      id: "q2.10-05",
      topic: "2.10",
      type: "multi",
      question: "Which statements about Supply(seller, company, product) are true? Select all that apply.",
      options: ["It is in BCNF", "It is in 4NF", "It is in 5NF", "Its 5NF design has three tables"],
      answer: [0, 1, 3],
      explain: "It has no non-trivial FD or MVD, so it is in BCNF and 4NF. Its three-part JD is not implied by the key, so it is not in 5NF until split into three tables.",
      link: "#decompose"
    },
    {
      id: "q2.10-06",
      topic: "2.10",
      type: "order",
      question: "Put the normal forms in order, from weakest to strongest.",
      options: ["1NF", "2NF", "3NF", "BCNF", "4NF", "5NF"],
      explain: "Each normal form includes all the ones before it.",
      link: "#summary"
    },
    {
      id: "q2.11-01",
      topic: "2.11",
      type: "multi",
      question: "Two SELECT queries are combined with UNION. What must be true? Select all that apply.",
      options: ["They return the same number of columns", "Matching columns have compatible types", "The columns have the same names", "Both queries read the same table"],
      answer: [0, 1],
      explain: "Columns are matched by position, so names do not matter. The result takes its names from the first query.",
      link: "#rules"
    },
    {
      id: "q2.11-02",
      topic: "2.11",
      type: "mcq",
      question: "First has 3 rows and Second has 3 rows. One row is in both. How many rows does First UNION ALL Second return?",
      options: ["5", "6", "1", "3"],
      answer: 1,
      explain: "UNION ALL keeps every row, so the count is always 3 + 3 = 6. UNION would return 5.",
      link: "#union-all"
    },
    {
      id: "q2.11-03",
      topic: "2.11",
      type: "mcq",
      question: "Which operation returns the rows of the first query that are not in the second?",
      options: ["UNION", "INTERSECT", "EXCEPT", "UNION ALL"],
      answer: 2,
      explain: "EXCEPT (called MINUS in Oracle) is set difference: A − B.",
      link: "#except"
    },
    {
      id: "q2.11-04",
      topic: "2.11",
      type: "tf",
      question: "In MySQL, SELECT * FROM First MINUS SELECT * FROM Second; is a valid query.",
      answer: false,
      explain: "False. MINUS is Oracle syntax. MySQL uses EXCEPT, available from version 8.0.31.",
      link: "#except"
    },
    {
      id: "q2.11-05",
      topic: "2.11",
      type: "tf",
      question: "INTERSECT always returns its rows in ascending order.",
      answer: false,
      explain: "False. No set operation promises an order. Add ORDER BY at the end when order matters.",
      link: "#order"
    },
    {
      id: "q2.11-06",
      topic: "2.11",
      type: "mcq",
      question: "Depositor has Asha, Ravi, Meena, Ravi. Borrower has Ravi, Kumar, Asha. What does Depositor INTERSECT Borrower return?",
      options: ["Ravi", "Asha, Ravi", "Asha, Ravi, Ravi", "Meena"],
      answer: 1,
      explain: "Asha and Ravi are in both tables. INTERSECT removes duplicates, so Ravi appears once.",
      link: "#try"
    },
    {
      id: "q2.11-07",
      topic: "2.11",
      type: "mcq",
      question: "Where does ORDER BY go in a query that uses UNION?",
      options: ["In each SELECT", "Only in the first SELECT", "Once, at the end of the whole query", "ORDER BY cannot be used with UNION"],
      answer: 2,
      explain: "One ORDER BY at the end sorts the whole combined result.",
      link: "#order"
    }
  ]);
})();
