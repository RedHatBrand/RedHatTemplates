
var initMap = function initMap () {

  window.map = L.map('map', {
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

  window.markersList = {};
  var markers = L.featureGroup();

  var icon =  L.divIcon({className: 'event-marker-icon'});

  $.each(events, function(i, event) {
    var latlng = [event.latitude, event.longitude]

    var customMarker = L.Marker.extend({
      options: {
        location_id: event.location_id
      }
    });

    var marker = new customMarker(latlng, {
      icon: icon
    });

    marker.bindPopup(
      "<h3 class='location'>" + event.location + "</h3>" +
      "<span class='date'>" + event.date + "</span>" +
      "<div class='description'>" + event.description + "</div>" +
      "<a class='link-footer' href=" + event.link  + ">Visit site</a>"
    );

    marker.on('click', function(e) {
      map.panTo(latlng);
      $('[data-event-id=' + event.location_id + ']').addClass('active');

    }).on('popupclose', function(e) {
      $('[data-event-id=' + event.location_id + ']').removeClass('active');
    });

    markers.addLayer(marker);
    markersList[event.location_id] = marker;
  });

  console.log(markersList);
  map.addLayer(markers);
  map.fitBounds(markers.getBounds(), {
    paddingTopLeft: [320, 0]
  });
}

$(function () {

  initMap();

  $('li.event').on('click', function(e) {
    var $this = $(this),
       marker = markersList[$this.data('event-id')];

    $('li.event').not($this).removeClass('active');
    $this.addClass('active');

    map.panTo( marker.getLatLng() );
    marker.openPopup();
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


});
