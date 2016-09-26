var margin = {
  top: 20,
  right: 30,
  bottom: 130,
  left: 39
};
const width = 960;
const height = 500;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

var y = d3.scale.linear()
.range([innerHeight, 0]);
var x = d3.scale.ordinal().rangeRoundBands([0, width - margin.right], 0);

var chart = d3.select("#glazenwater")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("glazenwater.tsv", type, function(error, data) {
  x.domain(['donderdag', 'vrijdag', 'zaterdag', 'zondag', 'maandag', 'dinsdag', 'woensdag']);
  y.domain([0, d3.max( data.map( (d) => ( d.aantal ) ) )]);

  var barWidth = innerWidth / data.length;

  var bar = chart.selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", (d, i) => ( `translate(${i * barWidth},0)` ));

  bar.append("rect")
  .attr("y", (d) => ( y(d.aantal) ))
  .attr("height", (d) => ( innerHeight - y(d.aantal) ))
  .attr("width", barWidth - 1);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + innerHeight + ")")
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
      .text("Cijfer Deeltoets 1");
    });

function type(d) {
  console.log ("coercing to number: " + d.aantal);
  //console.log("result: " + )
  d.aantal = +d.aantal; // coerce to number
  return d;
}
