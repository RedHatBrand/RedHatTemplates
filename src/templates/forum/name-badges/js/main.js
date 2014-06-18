(function (global) {
  var categoryTitleElem = document.getElementById('categoryTitlize');

  var string = S(categoryTitleElem.innerHTML).humanize();
  categoryTitleElem.innerHTML = string;
})(window || this);
