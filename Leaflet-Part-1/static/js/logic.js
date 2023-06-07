function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map.
    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
  
    // Create a baseMaps object to hold the streetmap layer.
    var baseMaps = {
      "Street Map": streetmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer.
    var overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Create the map object with options.
    var map = L.map("map", {
      center: [38.73, -117.0059],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);

    legend(map)
}

function createMarkers(response) {

  // Pull the "stations" property from response.data.
  var quakes = response.features;
  console.log(quakes[0].geometry.coordinates[1])
  // Initialize an array to hold bike markers.
  var quakeMarkers = [];

  // // Loop through the stations array.
  for (var i = 0; i < quakes.length; i++) {
    var quake = quakes[i];
    let lat = quake.geometry.coordinates[0];
    let lon = quake.geometry.coordinates[1];
    let depth = quake.geometry.coordinates[2];
    let mag = quake.properties.mag
    var color
    //if/else to determine color
    if (depth >= 90){
      color = "orangered"
    } else if (depth >= 70) {
      color = "darkorange"
    } else if (depth >= 50) {
      color = "orange"
    } else if (depth >= 30) {
      color = "gold"
    } else if (depth >= 10) {
      color = "yellow"
    } else {
      color = "lime"
    }

    // For each station, create a marker, and bind a popup with the station's name.
    let quakeMarker = L.circle([lon, lat], {
      radius: mag * 10000,
      fillColor: color,
      color: "white",
      fillOpacity: .7,
      weight: .5
    }).bindPopup("<h3>" + quake.properties.title + "<h3><h3>Magnitude: " + mag + "</h3>");

    // Add the marker to the bikeMarkers array.
    quakeMarkers.push(quakeMarker);
  }

  // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
  createMap(L.layerGroup(quakeMarkers));
}

function getColor (d) {
  return d > 90 ? "orangered":
          d > 70 ? "darkorange":
          d > 50 ? "orange" : 
          d > 30 ? "gold" : 
          d > 10 ? "yellow" : 
                    "lime";
};



function legend(map) {
  const getColor = d => {
      return d > 90
        ? "orangered"
        : d > 70
        ? "darkorange"
        : d > 50
        ? "orange"
        : d > 30
        ? "gold"
        : d > 10
        ? "yellow"
        : "lime";
    };

    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const grades = [0, 10, 30, 50, 70, 90];
      let labels = [];

      for (let i = 0; i < grades.length; i++) {

        labels.push(
          '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] : "+")
        );
      console.log(getColor(grades[i]+1))
      }

      div.innerHTML = labels.join("<br>");
      console.log(div.innerHTML)
      return div;
    };

    // const { map } = this.props.leaflet;
    legend.addTo(map);
  }


// Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
