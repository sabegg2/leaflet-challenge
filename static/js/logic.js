// Define earthquakes and tectonic plates GeoJSON url variables
var earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var tectonicplatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Create two layerGroups
var earthquakes = L.layerGroup();
var tectonicplates = L.layerGroup();

// Create satellite tile
var satelliteMap = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
  minZoom: 2,
  maxZoom: 12,
  attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});

// Create topo tile
var openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  minZoom: 2,
  maxZoom: 12,
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create street tile
var openStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  minZoom: 2,
  maxZoom: 12,
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create baseMaps object
var baseMaps = {
  "Satellite" : satelliteMap,
  "OpenTopo": openTopoMap,
  "OpenStreet": openStreetMap
};

// Create overlayMaps object to hold the overlay layers
var overlayMaps = {
  "Earthquakes": earthquakes,
  "Tectonic Plates": tectonicplates
};

// Create the map, giving it the satelliteMap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [0, 0],
  zoom: 2,
  layers: [satelliteMap, earthquakes]
});

// Create a layer control
// Pass in the baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

// Define functions for size and color of earthquake markers 
d3.json(earthquakesURL, function(earthquakeData) {
  // Determine the marker size by magnitude
  function markerSize(magnitude) {
    if (magnitude < 0.25) {
      return 1;
  } else {
      return magnitude * 4;
  }
  };
  // Determine the marker color by depth
  function markerColor(depth) {
    switch(true) {
      case depth > 90:
        return "red";
      case depth > 70:
        return "orangered";
      case depth > 50:
        return "orange";
      case depth > 30:
        return "gold";
      case depth > 10:
        return "yellow";
      default: // depth -10 to 10
        return "lightgreen";
    }
  }

  // Create a GeoJSON layer containing the features array
  // Each feature has popup describing the place/time/magnitude/depth of the earthquake
  L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, 
        // Set the style of the markers 
        {
          radius: markerSize(feature.properties.mag),
          fillColor: markerColor(feature.geometry.coordinates[2]),
          fillOpacity: 0.7,
          color: "black",
          stroke: true,
          weight: 0.5
        }
      );
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h4>Location: " + feature.properties.place 
        + "</h4><hr>Date: " + new Date(feature.properties.time) 
        + "<br>Magnitude: " + feature.properties.mag 
        + "<br>Depth: " + feature.geometry.coordinates[2] );
    }
  }).addTo(earthquakes);
  // Send earthquakes layer to the map
  earthquakes.addTo(myMap);

  // Get the tectonic plate data from tectonicplatesURL
  d3.json(tectonicplatesURL, function(data) {
    L.geoJSON(data, {
      color: "pink",
      weight: 2
    }).addTo(tectonicplates);
    //tectonicplates.addTo(myMap); // uncomment if this layer is to be shown on load along with earthquakes
  });

  // Create and add legend
  var legend = L.control({position: "bottomright"});

  legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend"),

      depths = [-10, 10, 30, 50, 70, 90];
      
      div.innerHTML = "<h4>Depth Legend (m)</h4><hr/>"
  
      for (var i=0; i < depths.length; i++) {
        div.innerHTML += 
        '<div class="box" style="background-color:'+ markerColor(depths[i] + 1) +'"></div> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');  // condition ? expressionIfTrue : expressionIfFalse
        }

      return div;
  };
      
  legend.addTo(myMap);
});
