function getEvents () {
  return $.get('http://d3s84xo5cmutkt.cloudfront.net/renders/attachments/000/002/483/original/latest_event-data.html');
}

function parseRespose(data) {
  var doc = new DOMParser().parseFromString(data, "application/xml");
  return JSON.parse($('#event-data', doc).text());
}

function initMap (events, selectedLocation) {
  var zoom = parseFloat($('#zoom').data('zoom'));
  var offsetLat = parseFloat($('#offsetLatitude').data('offset-lat'));
  var offsetLon = parseFloat($('#offsetLongitude').data('offset-lon'));

  var map = L.map('map', {
    scrollWheelZoom: false,
    zoomControl: false,
    attributionControl: false
  });
  map.dragging.disable();

  var tileLayer = new L.tileLayer('http://{s}.tile.stamen.com/{style}/{z}/{x}/{y}.png', {style: 'toner-background'})
  tileLayer.addTo(map);

  var markersList = map.markersList = {};
  var markers = L.featureGroup();

  var icon =  L.divIcon({className: 'event-marker-icon'});
  var currentIcon = L.divIcon({className: 'event-marker-icon-current'});

  $.each(events, function(i, eventData) {
    if(!(eventData.latitude && eventData.longitude)) return;

    var latlng = [eventData.latitude, eventData.longitude]

    var customMarker = L.Marker.extend({
      options: {
        location_id: eventData.location_id
      }
    });

    var marker = new customMarker(latlng, {
      icon: eventData.location === selectedLocation.location ? currentIcon : icon
    });

    markers.addLayer(marker);
    markersList[eventData.location_id] = marker;
  });

  map.addLayer(markers);
  map.setView([
    selectedLocation.latitude + offsetLat,
    selectedLocation.longitude + offsetLon
  ], zoom);

  return map;
}

$(function () {
  var locationName = $('#locationName').data('location-name');

  getEvents().then(function (data) {
    var events = parseRespose(data);

    var selectedLocation = _.find(events, function (eventData) {
      return eventData.location === locationName;
    });

    initMap(events, selectedLocation);
  });
});
