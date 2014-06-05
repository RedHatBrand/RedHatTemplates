
var initMap = function initMap () {

  var map = L.map('map', {
    scrollWheelZoom: false,
    zoomControl: false
  });

  L.control.zoom({
    position: 'topright'
  }).addTo(map);

  L.tileLayer('http://{s}.tile.stamen.com/{style}/{z}/{x}/{y}.png', {style: 'toner-background'}).addTo(map);

  // L.control.locate({
  //   follow: true,
  //   icon: 'icon-target'
  // }).addTo(map);

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
      "<span class='date'>" + moment(event.date).format('d MMM') + "</span>" +
      "<a href=" + event.link  + ">Visit site</a>" +
      "<p class='description'>" + event.description + "</p>"
    );

    marker.on('mouseover', function(e) {
      $('[data-event-id=' + event.location_id + ']').addClass('active');
      console.log( $('[data-event-id=' + event.location_id + ']') );
    }).on('mouseout', function(e) {
      $('[data-event-id=' + event.location_id + ']').removeClass('active')
    });

    marker.on('click', function(e) {
      map.panTo(latlng);
    });

    markers.addLayer(marker);
  });

  map.addLayer(markers);
  map.fitBounds(markers.getBounds(), {
    paddingTopLeft: [320, 0]
  });
}

$(function () {

  initMap();

$('[data-event-id="2"]')

});
