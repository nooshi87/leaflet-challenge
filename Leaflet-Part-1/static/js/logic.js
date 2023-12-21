//selected "USGS Significant Earthquakes, Past Month" from https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
//pull in the data for the visualization
d3.json(url).then(function(data) {
    console.log(data.features);
    earthquakeFeatures(data.features);
   

// Define a markerSize() function that will give each city a different radius based on the earthquake magnitude.
  function markersize(magnitude) {
    return magnitude* 3.5;
  }

  // Define a marker color function that will give each each earthquake a different intensity/darkness based on the depth.
  function markerbold(depth) {
    if (depth < 2) return "#ffff00";
    else if (depth >=2 && depth < 6 ) return "#ccff33";
    else if (depth >=6 && depth < 10) return "#99ff33";
    else if (depth >=10 && depth < 14) return "#33cc33";
    else if (depth >= 14 && depth <60) return "#339933";
    else if (depth >= 60) return "#003300";
  }

// Define a function that we want to run once for each feature in the features array.
function earthquakeFeatures(earthquakeData) {
    // Give each feature a popup that describes the id and category of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Alert Category:${feature.properties.alert}, Magnitude:${feature.properties.mag}</p>`);
    }
  
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData,
      {onEachFeature: onEachFeature, pointToLayer (feature, earthquakeData){
        return L.circleMarker(earthquakeData, 
          {radius: markersize(feature.properties.mag),
            color: markerbold(feature.geometry.coordinates[2]),
            weight: 2,
            opacity: 1
        })},
      })

    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
  }

  function createMap(earthquakes) {

    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
;
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes,
  
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
      //setting Agadir, Morrocco as center coordinates for immediate view to capture the 14 major earthquakes
      center: [
        30.4280, 9.5925
      ],
      zoom: 2,
      layers: [street, earthquakes]
    });
    var legend = L.control({position: 'bottomright'});
//Create legend
  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          depthval = [0,2,6,10,14,60,],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < depthval.length; i++) {
          div.innerHTML +=
              '<i style="background:' + markerbold(depthval[i] + 1) + '"></i> ' +
              depthval[i] + (depthval[i + 1] ? '&ndash;' + depthval[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);
  }

  
  });
  
  
