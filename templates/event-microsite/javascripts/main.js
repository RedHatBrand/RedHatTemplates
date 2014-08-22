$(function() {
  var countDays, fullHeight, scaleHero, selectFirstDay;
  $(".main").fitVids();
  $('.nav-toggle').on('click', function() {
    $(this).toggleClass('active');
    $('.nav-menu').toggleClass('nav-hide');
  });
  $('a.menu-link').on('click', function() {
    var target;
    $('.nav-menu').addClass('nav-hide');
    $('.nav-toggle').removeClass('active');
    $('.menu-link').removeClass('active');
    $(this).addClass('active');
    target = $(this).attr('href');
    $.smoothScroll({
      offset: -40,
      scrollTarget: target
    });
    return false;
  });
  $.each($('section.main'), function(index, section) {
    var height, position;
    position = $(section).position();
    height = $(section).height();
    return $(self).scrollspy({
      min: position.top - 300,
      max: position.top + height - 300,
      onEnter: function(element) {
        $("a.menu-link").removeClass('active');
        return $("a.menu-link[href='#" + section.id + "']").addClass('active');
      },
      onLeave: function(element) {
        return $("a.menu-link[href='#" + section.id + "']").removeClass('active');
      }
    });
  });
   function scaleHero() {
    if (document.getElementById('heroImage').height > window.innerHeight) {
      return fullHeight('.hero');
    }
  };
   function fullHeight(elem) {
    if (!$(elem).get(0)) {

    } else {
      $(elem).css('height', 'auto');
      if ($(elem).outerHeight() < window.innerHeight) {
        return $(elem).outerHeight(Math.ceil(window.innerHeight));
      }
    }
  };
  if ($("[name='active-day']").length > 0) {
    (function selectFirstDay() {
      return $("[name='active-day']").first().attr('checked', 'checked');
    })();
  }
  (function countDays() {
    return $(".section-agenda").addClass("agenda-" + ($("[name='active-day']").length));
  })();
});
