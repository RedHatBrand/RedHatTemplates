$(function () {
  function findLongestName () {
    var locations = [];
    var baseUrl = $('#baseUrl').data('base-url');

    $('.event .location').each(function (_i, elem) {
      var text = $(elem).text();

      locations.push(text);
    });

    return locations.sort(function (a, b) { return b.length - a.length; })[0];
  }

  var longest = findLongestName();
  var elemWidth = 100 / (longest.length);

  $('.event .location').lettering();

  $('.event .location span').each(function (_i, elem) {
    var char = $(elem).text().toLowerCase();

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

  $('.event').css({
    paddingLeft: '12.5%',
    boxSizing: 'border-box'
  })

  $('.event .date').each(function (_i, elem) {
    var date = moment($(elem).text() + ' 2014');
    $(elem).empty();

    var day = date.date();
    var month = date.format('MMMM').toLowerCase();

    $(this)
      .addClass('month-' + month)
      .addClass('day-' + day).css({
        width: elemWidth * 0.8752 + '%'
      });
  });
});
