
var initMap = function initMap () {

  window.map = L.map('map', {
    scrollWheelZoom: false,
    zoomControl: false
  });

  L.control.zoom({
    position: 'topright'
  }).addTo(map);

  L.tileLayer('http://{s}.tile.stamen.com/{style}/{z}/{x}/{y}.png', {style: 'toner'}).addTo(map);

  L.control.locate({
    position: 'topright',
    follow: true,
    icon: 'icon-target'
  }).addTo(map);

  window.markersList = {};
  var markers = L.featureGroup();

  var icon =  L.divIcon({className: 'event-marker-icon'});

  $.each(RHEvents.events, function(i, event) {
    var latlng = [event.latitude, event.longitude]

    var customMarker = L.Marker.extend({
      options: {
        location_id: event.location_id
      }
    });

    var marker = new customMarker(latlng, {
      icon: icon
    });

    marker.on('click', function(e) {
      window.location = event.link;
    });

    markers.addLayer(marker);
    markersList[event.location_id] = marker;
  });

  map.addLayer(markers);
  map.setView([setlectedLocation.latitude, setlectedLocation.longitude], 10);
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

});
