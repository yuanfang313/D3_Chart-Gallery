// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 40 },
  height = 400 - margin.top - margin.bottom;
var width = 400 - margin.left - margin.right;

// append the svg object to the body of the page
const svg = d3
  .select("#my_dataviz_1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// create dummy data
const data = [12, 19, 11, 13, 12, 22, 13, 4, 15, 16, 18, 19, 20, 12, 11, 9];

// Compute summary statistics used for the box:
const data_sorted = data.sort(d3.ascending);
const q1 = d3.quantile(data_sorted, 0.25);
const median = d3.quantile(data_sorted, 0.5);
const q3 = d3.quantile(data_sorted, 0.75);
const interQuantileRange = q3 - q1;
const min = q1 - 1.5 * interQuantileRange;
const max = q1 + 1.5 * interQuantileRange;

// Show the Y scale
const y = d3.scaleLinear().domain([0, 24]).range([height, 0]);
svg.call(d3.axisLeft(y));

// a few features for the box
const center = 200;
var width = 100;

// Show the main vertical line
svg
  .append("line")
  .attr("x1", center)
  .attr("x2", center)
  .attr("y1", y(min))
  .attr("y2", y(max))
  .attr("stroke", "black");

// Show the box
svg
  .append("rect")
  .attr("x", center - width / 2)
  .attr("y", y(q3))
  .attr("height", y(q1) - y(q3))
  .attr("width", width)
  .attr("stroke", "black")
  .style("fill", "#69b3a2");

// show median, min and max horizontal lines
svg
  .selectAll("toto")
  .data([min, median, max])
  .enter()
  .append("line")
  .attr("x1", center - width / 2)
  .attr("x2", center + width / 2)
  .attr("y1", function (d) {
    return y(d);
  })
  .attr("y2", function (d) {
    return y(d);
  })
  .attr("stroke", "black");
