/* Site-wide settings and the list of main pages.
   A page appears in the menus only when its status is "published". */
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
  { id: "labs", title: "Labs", href: "labs/index.html", status: "planned", nav: true, icon: "flask", summary: "All 10 lab exercises, with each sample solution explained step by step." },
  { id: "quizzes", title: "Quizzes", href: "quizzes/index.html", status: "planned", nav: true, icon: "list-checks", summary: "Short quizzes for every topic and every unit, with instant feedback." },
  { id: "revision", title: "Revision", href: "revision/index.html", status: "planned", nav: true, icon: "layers", summary: "Key points, infographics and flashcards for quick revision." },
  { id: "glossary", title: "Glossary", href: "glossary.html", status: "planned", nav: false, summary: "Every important term with a short, simple definition." },
  { id: "resources", title: "Resources", href: "resources.html", status: "published", nav: true },
  { id: "about", title: "About", href: "about.html", status: "published", nav: true }
];
