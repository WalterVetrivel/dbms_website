/* Revision pages.
   On a unit revision sheet: a [data-print] button prints the sheet.
   On the hub page:          <div data-revision-units></div> draws one card per unit. */
(function () {
  "use strict";
  var D = window.DBMS || {};
  var esc = D.esc;
  var url = D.url;

  function renderUnits(box) {
    box.innerHTML = (D.units || [])
      .map(function (u) {
        var topics = (D.topics || []).filter(function (t) {
          return t.unit === u.n;
        });
        var live = topics.filter(D.isPublished).length;
        if (!live) {
          return (
            '<div class="card unit-card is-disabled u-' + u.n + '"><span class="unit-label">Unit ' + u.roman + "</span>" +
            "<h3>" + esc(u.title) + '</h3><div class="card-foot"><span class="badge badge-soon">Coming soon</span></div></div>'
          );
        }
        return (
          '<a class="card unit-card u-' + u.n + '" href="' + url("revision/" + u.slug + ".html") + '">' +
          '<span class="unit-label">Unit ' + u.roman + "</span>" +
          "<h3>" + esc(u.title) + "</h3>" +
          '<div class="card-foot"><span class="badge badge-unit">Key points of ' + live + " topics</span></div></a>"
        );
      })
      .join("");
  }

  document.querySelectorAll("[data-revision-units]").forEach(renderUnits);
  document.querySelectorAll("[data-print]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      window.print();
    });
  });
})();
