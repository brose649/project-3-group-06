function do_work() {
  // extract user input
  let years = d3.select("#year_filter").property("value");
  let year = d3.select("#year_filter").property("value");
  let shape = d3.select("#shape_filter").property("value");
  let state = d3.select("#state_filter").property("value");


  if(years === "All") {
    console.log("Data for all years " + years)
  } else {
    console.log("Data for year: " + years)
  }

  // We need to make a request to the API
  let url = `/api/v1.0/get_frequency/${years}`;
  let url2 = `/api/v1.0/get_dashboard/${year}`;
  let url3 = `/api/v1.0/get_dashboard/${shape}/${state}`;

  d3.json(url).then(function (data) {

    // create the graph
    make_line(data);
    // make_table(data.table_data);
  });

  d3.json(url3).then(function(data) {
    // create the graph
    make_bar(data.bar_data);
  });

  d3.json(url2).then(function (data) {

    // create the graph
    // make_line(data);
    make_table(data.table_data);
  });
}

function make_table(filtered_data) {
  console.log(filtered_data);
  // select table
  let table = d3.select("#data_table");
  let table_body = table.select("tbody");
  table_body.html(""); // destroy any existing rows
  // create table
  for (let i = 0; i < filtered_data.length; i++){
    // get data row
    let data_row = filtered_data[i];
    // creates new row in the table
    let row = table_body.append("tr");
    row.append("td").text(data_row.dayofweek);
    row.append("td").text(data_row.city);
    row.append("td").text(data_row.state);
    row.append("td").text(data_row.hour);
    row.append("td").text(data_row.month);
    row.append("td").text(data_row.year);
    row.append("td").text(data_row.latitude);
    row.append("td").text(data_row.longitude);
    row.append("td").text(data_row.comment);
  }
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
    line: { color: 'FFFFFF ' }
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
      color: 'FFFFFF '
    },
    xaxis: {
      title: title,
      type: 'linear'
    },
    plot_bgcolor: '#141414', // Black background for the plot area
    paper_bgcolor: '#141414', // Black background for the whole graph
    xaxis: {
        color: '#FFFFFF ', // white  axis labels
        title: {
            text: 'Year',
            font: {
                color: '#FFFFFF ' // white  axis title color
            }
        }
    },
    
    yaxis: {
      color: '#FFFFFF ', // white axis labels
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

function make_bar(filtered_data) {
  let bar_x = filtered_data.map(x => x.state);
  let bar_y1 = filtered_data.map(x => x.shape);

  let trace1 = {
    x: bar_x,
    y: bar_y1,
    type: 'bar',
    marker: {
      color: "skyblue"
    },
    name: "UFO Shapes"
  };

  let data = [trace1];

  let layout = {
    title: "UFO Shapes by State",
    barmode: "group",
    margin: {
      l: 50,
      r: 50,
      b: 100,
      t: 50,
      pad: 4
    }
  };

  Plotly.newPlot("bar_chart", data, layout);
}

// event listener for CLICK on Button
d3.select("#filter").on("click", do_work);

// on page load, don't wait for the click to make the graph, use default
do_work();
