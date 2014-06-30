function getEvents () {
  return $.get('http://d3s84xo5cmutkt.cloudfront.net/renders/attachments/000/002/483/original/latest_event-data.html');
}

function parseRespose(data) {
  var doc = new DOMParser().parseFromString(data, "application/xml");
  return JSON.parse($('#event-data', doc).text());
}

function initMap (events, selectedLocation) {
  var zoom = parseFloat($('#zoom').data('zoom'));
  var eventlogo = $('#eventLogo').data('event-logo') || '';
  var offsetLat = parseFloat($('#offsetLatitude').data('offset-lat'));
  var offsetLon = parseFloat($('#offsetLongitude').data('offset-lon'));

  var map = L.map('map', {
    scrollWheelZoom: false,
    zoomControl: false,
    attributionControl: false
  });
  map.dragging.disable();

  // Add a fake GeoJSON line to coerce Leaflet into creating the <svg> tag that d3_geoJson needs
  var geoPlaceholder = new L.geoJson({"type": "LineString","coordinates":[[0,0],[0,0]]})
  geoPlaceholder.addTo(map);

  // Water Areas from OpenStreetMap
  var water = new L.TileLayer.d3_topoJSON("http://tile.openstreetmap.us/vectiles-water-areas/{z}/{x}/{y}.topojson", {
    class: "water",
    layerName: "vectile",
    style: ""
  })
  water.addTo(map);

  // Highways from OpenStreetMap
  var roadSizes = {
    "highway": "2px",
    "major_road": "1px",
    "minor_road": "0.5px",
    "rail": "0.125px",
    "path": "0.25px"
  };
  var roads = new L.TileLayer.d3_topoJSON("http://tile.openstreetmap.us/vectiles-highroad/{z}/{x}/{y}.topojson", {
    class: "road",
    layerName: "vectile",
    style: function(d) { return "stroke-width: " + roadSizes[d.properties.kind]; }
  })
  roads.addTo(map);

  var markersList = map.markersList = {};
  var markers = L.featureGroup();

  var icon =  L.divIcon({className: 'event-marker-icon'});
  var currentIcon = L.divIcon({
    className: 'event-marker-icon-current',
    html: eventlogo
  });

  $.each(events, function(i, eventData) {
    if(!(eventData.latitude && eventData.longitude)) return;

    var latlng = [eventData.latitude, eventData.longitude]

    var customMarker = L.Marker.extend({
      options: {
        location_id: eventData.location_id
      }
    });

    var marker = new customMarker(latlng, {
      icon: eventData.location === (selectedLocation && selectedLocation.location) ? currentIcon : icon
    });

    markers.addLayer(marker);
    markersList[eventData.location_id] = marker;
  });

  map.addLayer(markers);

  var mapWidth = $('#map').width();

  function setViewOffset (latlng, offset) {
    var x = map.latLngToContainerPoint(latlng).x - offset[0];
    var y = map.latLngToContainerPoint(latlng).y - offset[1];
    var point = map.containerPointToLatLng([x, y]);
    return map.setView(point);
  }

  if (selectedLocation) {
    map.setView([
      selectedLocation.latitude,
      selectedLocation.longitude
    ], zoom);
    setViewOffset([
      selectedLocation.latitude,
      selectedLocation.longitude
    ], [-(mapWidth / 3), 0]);
  } else {
    map.fitBounds(markers.getBounds(), {
      paddingTopLeft: [400, 500]
    });
  }

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
