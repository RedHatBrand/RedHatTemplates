var baseUrl = 'http://www.mapquestapi.com/geocoding/v1/address';
var params = {
  key: 'Fmjtd%7Cluurnu6ylu%2C8x%3Do5-9wrn1r',
  outFormat: 'json',
  location:  window.encodeURIComponent(mapSettings.address)
};

function queryString (params) {
  return Object.keys(params).map(function (key) {
    return key + '=' + params[key];
  }).join('&');
}

var url = baseUrl + '?' + queryString(params);

$.ajax({
  type: 'get',
  url: url, 
  success: function (res) {
    var latLng = res.results[0].locations[0].latLng;
    var lat = latLng.lat;
    var lon = latLng.lng;

    initMap([lat, lon]);
  }
});

function initMap (loc) {
  var zoom = parseInt(mapSettings.zoom);
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

  var icon =  L.divIcon({ 
    className: 'marker-icon',
    html: '<div>' + mapSettings.locationLabel + '</div>'
  });

  var marker = L.marker(loc, { icon: icon }).addTo(map);

  map.setView(loc, zoom);

  return map;
}
