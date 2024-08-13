function do_work() {
  // extract user input
  let years = d3.select("#year_filter").property("value");
  // let year = d3.select("#year_filter").property("value");

  if(years === "All") {
    console.log("Data for all years " + years)
  } else {
    console.log("Data for year: " + years)
  }

  // We need to make a request to the API
  let url = `/api/v1.0/get_frequency/${years}`;
  // let url2 = `/api/v1.0/get_dashboard/${year}`;
  d3.json(url).then(function (data) {

    // create the graph
    make_line(data);
    make_table(data);
  });

  // d3.json(url2).then(function (data) {

  //   // if (region !== "All") {
  //   //   filtered_data = data.filter(x => x.year === year);
  //   // }

  //   // create the graph
  //   make_table(data.table_data);
  // });
}

function make_table(data_object) {
  // console.log(data_object);
  // console.log(data_object.table_data);
  // console.log(data_object.table_data[0]);
  $('#data_table').DataTable().clear().destroy();
  // select table
  let table = d3.select("#data_table");
  let table_body = table.select("tbody");
  table_body.html(""); // destroy any existing rows
  // create table
  for (let i = 0; i < data_object.table_data.length; i++){
    console.log(data_object.table_data[i]);
    // get data row
    let data_row = data_object.table_data[i];
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
    row.append("td").text(data_row.comments);
  }
  $('#data_table').DataTable();
}


function make_line(data_object) {

  // this prints all of the filtered data we get from the query
  console.log(data_object);
  console.log(data_object.line_data);
  
  let freq = data_object.line_data.map(entry => entry.frequency);
  let timeData;
  let title;
  if(data_object.line_data.length > 12) {
    timeData = data_object.line_data.map(entry => entry.years);
    title = "Year";
    
  } else {
    timeData = data_object.line_data.map(entry => entry.month);
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


// event listener for CLICK on Button
d3.select("#filter").on("click", do_work);

// on page load, don't wait for the click to make the graph, use default
do_work();
