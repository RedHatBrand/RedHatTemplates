function getEvents () {
  return $.get('http://d3s84xo5cmutkt.cloudfront.net/renders/attachments/000/002/483/original/latest_event-data.html');
}

function parseRespose(data) {
  var doc = new DOMParser().parseFromString(data, "application/xml");
  return JSON.parse($('#event-data', doc).text());
}

function initMap (events) {
  var map = L.map('map', {
    scrollWheelZoom: false,
    zoomControl: false,
    attributionControl: false
  });

  L.control.zoom({
    position: 'topright'
  }).addTo(map);

  L.tileLayer('http://{s}.tile.stamen.com/{style}/{z}/{x}/{y}.png', {style: 'toner-background'}).addTo(map);

  L.control.locate({
    position: 'topright',
    follow: true,
    icon: 'icon-target',
    keepCurrentZoomLevel: true
  }).addTo(map);

  var markersList = map.markersList = {};
  var markers = L.featureGroup();

  var icon =  L.divIcon({className: 'event-marker-icon'});

  $.each(events, function(i, eventData) {
    if(!(eventData.latitude && eventData.longitude)) return;

    var latlng = [eventData.latitude, eventData.longitude]

    var customMarker = L.Marker.extend({
      options: {
        location_id: i
      }
    });

    var marker = new customMarker(latlng, {
      icon: icon
    });

    marker.bindPopup(
      "<h3 class='location'>" + eventData.location + "</h3>" +
      "<span class='date'>" + eventData.date + "</span>" +
      "<a class='link-footer' href=" + eventData.link  + ">Visit site</a>"
    );

    marker.on('click', function(e) {
      map.panTo(latlng);
      $('[data-event-id=' + eventData.location_id + ']').addClass('active');

    }).on('popupclose', function(e) {
      $('[data-event-id=' + eventData.location_id + ']').removeClass('active');
    });

    markers.addLayer(marker);
    markersList[eventData.location_id] = marker;
  });

  map.addLayer(markers);

  var offset = 0;

  if ($(window).outerWidth() > 800) {
    offset = 320;
  }

  map.fitBounds(markers.getBounds(), {
    paddingTopLeft: [offset, 0]
  });

  return map;
}

$(function () {
  getEvents().then(function (data) {
    var events = parseRespose(data);

    var map = initMap(events);

    $('li.event a').on('click', function(e) {
      e.preventDefault();

      var $this = $(this),
         marker = map.markersList[$this.data('event-id')];

      $('li.event a').not($this).removeClass('active');
      $this.addClass('active');

      map.panTo( marker.getLatLng() );
      marker.openPopup();
    });
  });

  $('.info-toggle').on('click', function(e) {
    e.preventDefault();

    var $this = $(this);
    $('.rotate-container').toggleClass('shifted');

    if ($this.hasClass('active')) {
      $this.text('about')
      $($this).removeClass('active');
    } else {
      $this.text('Close')
      $this.addClass('active');
    }
  });

  $('.nav-toggle').on('click', function(e) {
    e.preventDefault();

    $('body').toggleClass('menu-open');
    $(this).toggleClass('active');
  });
});
