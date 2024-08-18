function createMap(data) {
  // STEP 1: Init the Base Layers

  // Define variables for our tile layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  let darkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  });

  // Step 2: Create the Overlay layers
  let markers = L.markerClusterGroup();
  let heatArray = [];

  let markerColor = 'green';

  //Custom Icons to be loaded onto markers for each Category
  // There are far more shapes than categories in our dataset. Applying custom icons to each marker based on category allows for quick visual representation of each marker.
  const iconMapping = {
    'Circular': 'static/icons/circle.png',
    'Angular': 'static/icons/triangle.png',
    'Formation': 'static/icons/formation.png',
    'Luminous': 'static/icons/light.png',
    'Other': 'static/icons/other.png',
    'Elliptical': 'static/icons/oval.png',
    'Rectangular': 'static/icons/rectangle.png'
  };

  for (let i = 0; i < data.length; i++){
    let row = data[i];
    let latitude = row.latitude;
    let longitude = row.longitude;

    // Once category column is created, use this to convert to variable for icon usage
    let category = row.category;

    // Assign variable to populate appropriate icon for each marker
    let iconUrl = iconMapping[category] || 'static/icons/alien.png';

    // extract coord
    let point = [latitude, longitude];

    // Capitalize City names returned from db
    const capitalizeString = str => str.replace(/\b\w/g, substr => substr.toUpperCase());
    let capitalCity = capitalizeString(row.city);
    let capitalShape = capitalizeString(row.shape);

    // Create a custom icon with the color and custom icon
    let customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color:${markerColor}; width:20px; height:20px; border-radius:50%; display: flex; align-items: center; justify-content: center;">
      <img src="${iconUrl}" style="width:32px; height:32px;">
      </div>`,
      iconSize: [20, 20],
      popupAnchor: [0, -10]
    });
    
    // make marker
    let marker = L.marker(point, { icon: customIcon });
    let popup = `<h5>Date Posted: ${row.date_posted}</h5><hr>
      <h6>Day of Sighting: ${row.dayofweek}<hr>City: ${capitalCity}<hr>Shape: ${capitalShape}<hr>Category: ${category}<hr>Comments: ${row.comments}</h6>`;
    marker.bindPopup(popup);
    markers.addLayer(marker);

    // add to heatmap
    heatArray.push(point);
  }

  // create heat layer
  let heatLayer = L.heatLayer(heatArray, {
    radius: 40,
    blur: 15
  });

  // Step 3: BUILD the Layer Controls

  // Only one base layer can be shown at a time.
  let baseLayers = {
    Dark: darkMatter,
    Street: street,
    Topography: topo
  };

  let overlayLayers = {
    Markers: markers,
    Heatmap: heatLayer
  }

  // Step 4: INIT the Map

  // Destroy the old map
  d3.select("#map-container").html("");

  // rebuild the map
  d3.select("#map-container").html("<div id='map'></div>");

  let myMap = L.map("map", {
    center: [39.828175, -98.5795],
    zoom: 5,
    layers: [darkMatter, markers]
  });

  // Step 5: Add the Layer Control filter
  L.control.layers(baseLayers, overlayLayers).addTo(myMap);

}

function do_work() {
  // Extract user input (abbreviation will be sent)
  let state = d3.select("#state_filter").property("value");
  let categoryValue = d3.select("#category_filter").property("value");

  // Make the API request with the selected abbreviation
  let url = `/api/v1.0/get_map/${categoryValue}/${state}`;
  
  d3.json(url).then(function (data) {
      createMap(data);
  });
}


// event listener for CLICK on Button
d3.select("#filter").on("click", do_work);

do_work();



