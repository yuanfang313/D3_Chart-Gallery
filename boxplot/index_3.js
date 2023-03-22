// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 40 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3
  .select("#my_dataviz_2")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define the data for the boxplot
d3.csv(
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv"
).then(function (data) {
  //Define the x scale for the boxplot
  const xScale = d3
    .scaleBand()
    .domain([...new Set(data.map((d) => d.group))])
    .range([margin.left, innerWidth + margin.left])
    .paddingInner(0.1)
    .paddingOuter(0.2);

  // Define the y scale for the boxplot
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .range([innerHeight + margin.top, margin.top]);

  // Define the rollup function to compute summary statistics for each group
  const rollupFn = (group) => {
    const values = group.map((d) => d.Sepal_Length).sort(d3.ascending);
    const q1 = d3.quantile(values, 0.25);
    const median = d3.median(values);
    const q3 = d3.quantile(values, 0.75);
    const iqr = q3 - q1;
    const upper = q3 + 1.5 * iqr;
    const lower = q1 - 1.5 * iqr;
    return { values, q1, median, q3, upper, lower };
  };

  // Compute the summary statistics for each group using rollup
  const summary = d3.rollup(data, rollupFn, (d) => d.Species);
  const sumstat_arr = Array.from(summary, ([key, values]) => ({
    key,
    ...values,
  }));
  const sumstat_obj = { ...sumstat_arr };

  console.log(summary);
  console.log(sumstat_arr);
  console.log(sumstat_obj);

  // Show the X scale
  const x = d3
    .scaleBand()
    .range([0, width])
    .domain(["setosa", "versicolor", "virginica"])
    .paddingInner(1)
    .paddingOuter(0.5);

  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Show the Y scale
  const y = d3.scaleLinear().domain([3, 9]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // Show the main vertical line
  svg
    .append("g")
    .selectAll("line")
    .data(sumstat_arr)
    .enter()
    .append("line")
    .attr("x1", (d) => x(d.key))
    .attr("x2", (d) => x(d.key))
    .attr("y1", (d) => y(d.lower))
    .attr("y2", (d) => y(d.upper))
    .attr("stroke", "black")
    .style("width", 40);

  // rectangle for the main box
  const boxWidth = 100;
  svg
    .append("g")
    .selectAll("boxes")
    .data(sumstat_arr)
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.key) - boxWidth / 2)
    .attr("y", (d) => y(d.q3))
    .attr("height", (d) => y(d.q1) - y(d.q3))
    .attr("width", boxWidth)
    .attr("stroke", "black")
    .style("fill", "#69b3a2");

  // Show the median
  svg
    .append("g")
    .selectAll("medianLines")
    .data(sumstat_arr)
    .enter()
    .append("line")
    .attr("x1", (d) => x(d.key) - boxWidth / 2)
    .attr("x2", (d) => x(d.key) + boxWidth / 2)
    .attr("y1", (d) => y(d.median))
    .attr("y2", (d) => y(d.median))
    .attr("stroke", "black")
    .style("white", 80);

  // Add individual points with jitter
  const jitterWidth = 70;
  svg
    .append("g")
    .selectAll("indPoints")
    .data(data)
    .enter()
    .append("circle")
    .attr(
      "cx",
      (d) => x(d.Species) - jitterWidth / 2 + Math.random() * jitterWidth
    )
    .attr("cy", (d) => y(d.Sepal_Length))
    .attr("r", 2)
    .style("fill", "blue");
});
