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

// Read the data and compute summary statistics for each specie
d3.csv(
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv",
  function (data) {
    //Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
    const sumstat = d3
      .nest() // nest function allows to group the calculation per level of a factor
      .key(function (d) {
        return d.Species;
      })
      .rollup(function (d) {
        q1 = d3.quantile(
          d
            .map(function (g) {
              return g.Sepal_Length;
            })
            .sort(d3.ascending),
          0.25
        );
        median = d3.quantile(
          d
            .map(function (g) {
              return g.Sepal_Length;
            })
            .sort(d3.ascending),
          0.5
        );
        q3 = d3.quantile(
          d
            .map(function (g) {
              return g.Sepal_Length;
            })
            .sort(d3.ascending),
          0.75
        );

        interQuantileRange = q3 - q1;
        min = q1 - 1.5 * interQuantileRange;
        max = q3 + 1.5 * interQuantileRange;
        return {
          q1: q1,
          median: median,
          q3: q3,
          interQuantileRange: interQuantileRange,
          min: min,
          max: max,
        };
      })
      .entries(data);

    console.log(sumstat);
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
      .selectAll("vertLines")
      .data(sumstat)
      .enter()
      .append("line")
      .attr("x1", function (d) {
        return x(d.key);
      })
      .attr("x2", function (d) {
        return x(d.key);
      })
      .attr("y1", function (d) {
        return y(d.value.min);
      })
      .attr("y2", function (d) {
        return y(d.value.max);
      })
      .attr("stroke", "black")
      .style("width", 40);

    // rectangle for the main box
    const boxWidth = 100;
    svg
      .selectAll("boxes")
      .data(sumstat)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x(d.key) - boxWidth / 2;
      })
      .attr("y", function (d) {
        return y(d.value.q3);
      })
      .attr("height", function (d) {
        return y(d.value.q1) - y(d.value.q3);
      })
      .attr("width", boxWidth)
      .attr("stroke", "black")
      .style("fill", "#69b3a2");

    // Show the median
    svg
      .selectAll("medianLines")
      .data(sumstat)
      .enter()
      .append("line")
      .attr("x1", function (d) {
        return x(d.key) - boxWidth / 2;
      })
      .attr("x2", function (d) {
        return x(d.key) + boxWidth / 2;
      })
      .attr("y1", function (d) {
        return y(d.value.median);
      })
      .attr("y2", function (d) {
        return y(d.value.median);
      })
      .attr("stroke", "black")
      .style("width", 80);
  }
);
