(function (global) {
  __slice = [].slice;

  var size = getComputedStyle(document.body).fontSize;
  em = parseInt(size.substring(0, size.length -2));
  var side = em * 3.75;

  function tilePattern (pattern, element) {
    var n = (element.offsetWidth * element.offsetHeight) / (element.offsetHeight * element.offsetHeight);
    var d;

    element.classList.add('tile-pattern-container');

    for(var i = 0; i < n; i++) {
      d = document.createElement('div');
      d.classList.add('tile-pattern-tile');
      d.innerHTML = pattern;

      element.appendChild(d);
    }
  }

  var fillable = __slice.call(document.getElementsByClassName('js-pattern-fill'));

  fillable.forEach(function (elem) {
    tilePattern(global.pattern, elem);
  });
  
  global.tilePattern = tilePattern;
})(window);


  
