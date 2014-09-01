var __slice = [].slice;

function getTextNodes(elem) {
  var walker = document.createTreeWalker(
      elem, 
      NodeFilter.SHOW_TEXT, 
      null, 
      false
      );

  var node;
  var textNodes = [];

  while(node = walker.nextNode()) {
    textNodes.push(node);
  }

  return textNodes;
}

function highlightText () {
  var highlightable = document.getElementsByClassName('js-highlighted');

  __slice.call(highlightable).forEach(function (h) {
    var nodes = getTextNodes(h);

    __slice.call(nodes).forEach(function (node) {
      var parent = node.parentNode;
      var span = document.createElement('span');

      span.innerHTML = node.nodeValue;
      parent.replaceChild(span,node);
    });
  });
}

highlightText();

