$(function () {
  function findLocations () {
    var locations = [];

    $('.events-list .event .location .text-content').each(function (_i, elem) {
      var text = $(elem).text()
      locations.push({ text: text, elem: $(elem).parent() });
      $(elem).remove();
    });

    return locations;
  }

  function findLongest (arr, prop) {
    return arr.sort(function (a, b) { return b[prop].length - a[prop].length; })[0];
  }

  var baseUrl = $('#baseUrl').data('base-url');
  var locations = findLocations();
  var longest = findLongest(locations, 'text').text.length;

  longest = longest > 10 ? longest : 10;

  var elemWidth = 100 / (longest + 1.5);

  $(locations).each(function (_i, location) {
      for (var i = 0; i < longest; i++) {
        (function elem() {
          var char = location.text[i];
          char = char ? char.toUpperCase() : '';

          var elem = $('<div class="outer-letter" />');
          location.elem.append(elem);
          elem.css({
            width: elemWidth + '%'
          });

          elem.append('<img src="' + baseUrl +'/templates/forum/assets/images/space.svg" />');

          var svgContainer = $('<div class="svgs">');
          elem.append(svgContainer);
          svgContainer.append('<svg class="letter" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 36"><text x="50%" y="24" font-size="18" text-anchor="middle">' + char + '</text></svg>');
        })(i, location);
      }
  });

  $('.events-list .event .date').css({
    width: elemWidth + '%',
    marginRight: elemWidth * 0.5 + '%'
  });
});
