function do_work() {
  // extract user input
  let month = d3.select("#month_filter").property("value");
  month = parseInt(month);
  let state = d3.select("#state").property("value");
  let shape = d3.select("#shape").property("value");

  // We need to make a request to the API
  let url = `/api/v1.0/get_dashboard/${month}/${state}/${shape}`;
  d3.json(url).then(function (data) {

    // create the graphs
    make_line(data.line_data);
    make_sunburst(data.sunburst_data);
    make_table(data.table_data)
  });
}

function make_table(filtered_data) {
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
    row.append("td").text(data_row.city);
    row.append("td").text(data_row.state);
    row.append("td").text(data_row.shape);
    row.append("td").text(data_row.hour);
    row.append("td").text(data_row.month);
    row.append("td").text(data_row.year);
    row.append("td").text(data_row.duration_seconds);
    row.append("td").text(data_row.dayofweek);
  }
}

function make_sunburst(filtered_data) {
  // sort values
  filtered_data.sort((a, b) => (b.launch_attempts - a.launch_attempts));

  // extract data for pie chart
  let sunburst_data = filtered_data.map(x => x.launch_attempts);
  let sunburst_labels = filtered_data.map(x => x.name);

  let trace1 = {
    values: sunburst_data,
    labels: sunburst_labels,
    type: 'line',
    hoverinfo: 'label+percent+name',
    hole: 0.4,
    name: "Sightings"
  }

  // Create data array
  let data = [trace1];

  // Apply a title to the layout
  let layout = {
    title: "UFO Shape Categories",
  }

  Plotly.newPlot("sunburst_chart", data, layout);
}

function make_line(filtered_data) {
  // sort values
  filtered_data.sort((a, b) => (b.launch_attempts - a.launch_attempts));

  // extract the x & y values for our bar chart
  let line_x = filtered_data.map(x => x.name);
  let line_text = filtered_data.map(x => x.full_name);
  let line_y1 = filtered_data.map(x => x.launch_attempts);
  let line_y2 = filtered_data.map(x => x.launch_successes);

  // Trace1 for the Launch Attempts
  let trace1 = {
    x: bar_x,
    y: bar_y1,
    type: 'bar',
    marker: {
      color: "skyblue"
    },
    text: bar_text,
    name: "Attempts"
  };

  // Trace 2 for the Launch Successes
  let trace2 = {
    x: bar_x,
    y: bar_y2,
    type: 'bar',
    marker: {
      color: "firebrick"
    },
    text: bar_text,
    name: "Successes"
  };

  // Create data array
  let data = [trace1, trace2];

  // Apply a title to the layout
  let layout = {
    title: "SpaceX Launch Results",
    barmode: "group",
    // Include margins in the layout so the x-tick labels display correctly
    margin: {
      l: 50,
      r: 50,
      b: 200,
      t: 50,
      pad: 4
    }
  };

  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("bar_chart", data, layout);

}

// event listener for CLICK on Button
d3.select("#filter").on("click", do_work);

// on page load, don't wait for the click to make the graph, use default
do_work();
