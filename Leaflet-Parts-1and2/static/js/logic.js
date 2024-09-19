// Earthquake geoJSON 
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Function to create the map
function createMap(eq){

    // Create satellite tile
    let sat = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}', {
        minZoom:2,
        maxZoom: 12,
        attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
    });

    // Create topo Tile
    let openTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        minZoom:2,
        maxZoom: 12,
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
 
    // Create street Tile
    let openStreet = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom:2,
        maxZoom: 12,
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });


    // baseMaps object
    let baseMaps = {
        "Satellite" : sat,
        "OpenTopo": openTopo,
        "OpenStreet": openStreet
    };

    // Create an overlay object
    let overlayMaps = {
        "Earthquakes" : eq
    };

    // Create the map
    let myMap = L.map("map",{
        center: [0, 0],
        zoom:2,
        layers:[sat,eq]
    });

    // Create a layer control
    var layerControl = L.control.layers(baseMaps, overlayMaps,{
        collapsed:false
    }).addTo(myMap);

    // Create the Tectonic Plate geoJSON
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then((geodata) => {

    let plates = L.geoJson(geodata,{
        style: {
            color: "pink",            
            fill: false
        }
    });

    // Add the plates to the Overlay
    layerControl.addOverlay(plates, "Tectonic Plates");

    });

    // Create a legend control
    let legend = L.control({
        position:"bottomright"
    });

    // Add a div class to legend control
    legend.onAdd = function(){
        let div = L.DomUtil.create("div", "legend");
        return div;
    };

    // Add legend control to map
    legend.addTo(myMap);

}

//createMap();

// Function to create the earthquake markers
function eqMarkers(response){

    // Function to determine the marker color by depth
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
      default:
        return "lightgreen";
    }
  }

    // Function to determine marker size
    function markerSize(magnitude){
        if (magnitude < 0.25) {
            return 1;
        } else {
            return magnitude * 4;
        }
    }

    // Function to bindpopup
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h4>Earthquake Details</h4><hr/>\
        <small><b>Date/Time:</b> ${new Date(feature.properties.time).toUTCString()}<br/>\
        <b>Location:</b> ${feature.properties.place}<br/>\
        <b>Lat:</b> ${feature.geometry.coordinates[1]}<br/>\
        <b>Long:</b> ${feature.geometry.coordinates[0]}<br/>\
        <b>Depth:</b> ${feature.geometry.coordinates[2]}<br/>\
        <b>Magnitude:</b> ${feature.properties.mag}<br/>\
        <a target="_blank" href=${feature.properties.url}>USGS Eventpage</a></small>`
        )};

    // Function to create marker
    function createMarker(geoJsonPoint, latlng){
        //console.log(geoJsonPoint);
        return L.circleMarker(latlng, {
            radius : markerSize(geoJsonPoint.properties.mag),
            weight: 1,
            color: "gray",
            fillColor: markerColor(geoJsonPoint.geometry.coordinates[2]),
            fillOpacity: 0.9
        });
    };

    // Create the earthquake markers
    let eq_markers = L.geoJson(response,{
        pointToLayer : createMarker,
        onEachFeature : onEachFeature
        });
    
    // Call functions to create the map and legend
    createMap(eq_markers);
    createLegend();
}

// Function to create legend
function createLegend(){
    document.querySelector(".legend").innerHTML = [
        "<h4>Depth Legend</h4><hr/>",
        "<div class='legoption'><div class='box' style='background-color:lightgreen;'></div> -10-10</div>",
        "<div class='legoption'><div class='box' style='background-color:yellow;'></div> 10-30</div>",
        "<div class='legoption'><div class='box' style='background-color:gold;'></div> 30-50</div>",
        "<div class='legoption'><div class='box' style='background-color:orange;'></div> 50-70</div>",
        "<div class='legoption'><div class='box' style='background-color:orangered;'></div> 70-90</div>",
        "<div class='legoption'><div class='box' style='background-color:red;'></div> 90+</div>",
    ].join("");
}

d3.json(url).then(eqMarkers);