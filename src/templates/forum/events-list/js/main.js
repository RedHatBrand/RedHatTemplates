$(function () {
  function findLongestName () {
    var locations = [];

    $('.event .location').each(function (_i, elem) {
      var text = $(elem).text();

      locations.push(text);
    });

    return locations.sort(function (a, b) { return b.length - a.length; })[0];
  }

  var longest = findLongestName();
  var elemWidth = 100 / (longest.length + 1.5);

  $('.event .location').lettering();

  $('.event .location span').each(function (_i, elem) {
    var char = $(elem).text().toLowerCase();
    char = char === ' ' ? 'space' : char;

    $(elem)
      .empty()
      .addClass(char)
      .css({
        width: elemWidth + '%'
      });
  });

  $('.event .location').each(function (_i, elem) {
    var excess = longest.length - $(elem).find('span').length;
    if (excess > 0) {
      for(var i = 0; i < excess; i++) {
        $(elem).append('<span class="space" style="width: ' + elemWidth + '%" />');
      }
    }
  });

  $('.event .date').css({
    width: elemWidth + '%',
    marginRight: elemWidth * 0.5 + '%'
  });
});
