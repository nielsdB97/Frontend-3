const margin = {
  top: 20,
  right: 30,
  bottom: 130,
  left: 39
};
const width = 960;
const height = 500;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const y = d3.scale.linear()
  .range([innerHeight, 0]);
const x = d3.scale.ordinal().rangeRoundBands([0, width - margin.right], 0);

const chart = d3.select("#glazenwater")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

d3.tsv("glazenwater.tsv", type, (error, data) => {
  console.table(data);

  x.domain(data.map((d) => ( d.dag )));
  y.domain([0, d3.max( data.map( (d) => ( d.aantal ) ) )]);

  const spacing = 5;
  const barWidth = innerWidth / data.length - spacing;

  const bar = chart.selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", (d, i) => ( `translate(${i * barWidth},0)` ));

  bar.append("rect")
      .attr("x", (d, i) => ( i * spacing ))
      .attr("y", (d) => ( y(d.aantal) ))
      .attr("height", (d) => ( innerHeight - y(d.aantal) ))
      .attr("width", barWidth);

  const xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  const yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks((d) => {
        const max = d3.max( data.map( (d) => ( d.aantal ) ) );
        return max + 2;
      });

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis)
    .selectAll("text")
      .attr("dx", barWidth/2)
      .attr("dy", "2em")
      .attr("transform", "rotate(45)");

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Aantal glazen");
});

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}
