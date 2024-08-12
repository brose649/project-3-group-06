
function do_work() {
  // extract user input
  let years = d3.select("#year_filter").property("value");
  
  if(years === "All") {
    console.log("Data for all years " + years)
  } else {
    console.log("Data for year: " + years)
  }

  // We need to make a request to the API
  let url = `/api/v1.0/get_frequency/${years}`;

  d3.json(url).then(function (data) {
    
    make_line(data);
  });
}


function make_line(filtered_data) {

  // this prints all of the filtered data we get from the query
  // console.log(filtered_data);
  
  let freq = filtered_data.map(entry => entry.frequency);
  let timeData;
  let title;
  if(filtered_data.length > 12) {
    timeData = filtered_data.map(entry => entry.years);
    title = "Year";
    
  } else {
    timeData = filtered_data.map(entry => entry.month);
    title = "Month";
  }

  const trendData = linear_regression(timeData, freq);

  const trace1 = {
    x: timeData,
    y: freq,
    mode: 'lines+markers',
    name: 'Sightings',
    line: { color: '39FF14' }
  };

  const trace2 = {
    x: timeData,
    y: trendData,
    mode: 'lines',
    name: 'Trend Line',
    line: {
      color: 'FF3131', 
      width: 4,
      opacity: 0.2,
      dash: 'dash' }
  };

  const layout = {
    title: 'UFO Sightings Over Time',
    font: {
      color: '39FF14'
    },
    xaxis: {
      title: title,
      type: 'linear'
    },
    plot_bgcolor: '#000000', // Black background for the plot area
    paper_bgcolor: '#000000', // Black background for the whole graph
    xaxis: {
        color: '#39FF14', // Green axis labels
        title: {
            text: 'Year',
            font: {
                color: '#39FF14' // Green axis title color
            }
        }
    },
    
    yaxis: {
      color: '#39FF14', // Green axis labels
      title: 'Number of Sightings'
    }
  };

  let data = [trace1, trace2];

  Plotly.newPlot("line-graph", data, layout);

};

function linear_regression (x, y) {
  
  const n = x.length;
  const sumX = x.reduce((sum, value) => sum + value, 0);
  const sumY = y.reduce((sum, value) => sum + value, 0);
  const sumXY = x.reduce((sum, value, i) => sum + value * y[i], 0);
  const sumXX = x.reduce((sum, value) => sum + value * value, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return x.map(value => slope * value + intercept);
}

// event listener for CLICK on Button
d3.select("#filter").on("click", do_work);
// on page load, don't wait for the click to make the graph, use default
do_work();



