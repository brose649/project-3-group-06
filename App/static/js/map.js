// GOAL 1
// Can I render a basic base map? - Set up Leaflet correctly
// Can we fetch the data that we need to plot?


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

  let Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
    minZoom: 0,
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'png'
  });

  // Step 2: Create the Overlay layers
  let markers = L.markerClusterGroup();
  let heatArray = [];

  let markerColor = 'green';

  //Custom Icons to be loaded onto markers for each Category
  // const iconMapping = {
  //   'circle': 'static/icons/circle.png',
  //   'triangle': 'static/icons/triangle.png',
  //   'formation': 'static/icons/formation.png',
  //   'light': 'static/icons/light.png',
  //   'other': 'static/icons/other.png',
  //   'oval': 'static/icons/oval.png',
  //   'rectangle': 'static/icons/rectangle.png'
  // };

  for (let i = 0; i < data.length; i++){
    let row = data[i];
    let latitude = row.latitude;
    let longitude = row.longitude;

    // Once category column is created, use this to convert to variable for icon usage
    //let category = row.category;

    // Assign variable to populate appropriate icon for each marker
    // let iconUrl = iconMapping[shape] || 'static/icons/alien.png';

    // extract coord
    let point = [latitude, longitude];

    // Capitalize City names returned from db
    const capitalizeString = str => str.replace(/\b\w/g, substr => substr.toUpperCase());
    let capitalCity = capitalizeString(row.city);
    let capitalShape = capitalizeString(row.shape);

    // Create a custom icon with the color
    let customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color:${markerColor}; width:20px; height:20px; border-radius:50%;"></div>`,
      iconSize: [20, 20],
      popupAnchor: [0, -10]
    });

    // Create a custom icon with the color and custom icon
    // let customIcon = L.divIcon({
    //   className: 'custom-div-icon',
    //   html: `<div style="background-color:${markerColor}; width:20px; height:20px; border-radius:50%; display: flex; align-items: center; justify-content: center;">
    //   <img src="${iconMapping[shape]}" style="width:16px; height:16px;">
    //   </div>`,
    //   iconSize: [20, 20],
    //   popupAnchor: [0, -10]
    // });
    
    // make marker
    let marker = L.marker(point, { icon: customIcon });
    let popup = `<h3>Date Posted: ${row.date_posted}</h3><hr>
      <h4>Day of Sighting: ${row.dayofweek}<hr>City: ${capitalCity}<hr>Shape: ${capitalShape}<hr>Comments: ${row.comments}</h4>`;
    marker.bindPopup(popup);
    markers.addLayer(marker);

    // add to heatmap
    heatArray.push(point);
  }

  // create layer
  let heatLayer = L.heatLayer(heatArray, {
    radius: 25,
    blur: 20
  });

  // Step 3: BUILD the Layer Controls

  // Only one base layer can be shown at a time.
  let baseLayers = {
    Dark: darkMatter,
    Street: street,
    Topography: topo,
    SmoothDark: Stadia_AlidadeSmoothDark
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

  // Step 5: Add the Layer Control filter + legends as needed
  L.control.layers(baseLayers, overlayLayers).addTo(myMap);

}

function do_work() {
  // Extract user input (abbreviation will be sent)
  let shape = d3.select("#shape_filter").property("value");
  let state = d3.select("#state_filter").property("value");

  // Make the API request with the selected abbreviation
  let url = `/api/v1.0/get_map/${shape}/${state}`;
  
  d3.json(url).then(function (data) {
      createMap(data);
  });
}


// event listener for CLICK on Button
d3.select("#filter").on("click", do_work);

do_work();



