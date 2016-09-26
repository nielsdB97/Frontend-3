const width = 500,
      height = 200,
      svg = d3.select("#glazenwater")
        .attr("width", width)
        .attr("height", height),
      xScale = d3.scale.linear()
        .range([0, width]),
      yScale = d3.scale.linear()
        .range([height, 0]);

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}

d3.tsv("glazenwater.tsv", type, function(error, data) {
  console.log(data);

  xScale.domain(['woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag', 'maandag', 'dinsdag']);
  yScale.domain([0, d3.max(data, function(d) { return d.value; })]);

  const spacing = 71;
  const maxHeight = 180;

  for(let i = 0; i < data.length; i++) {
    let day = +data[i].dag * 4;
    let glassesWater = +data[i].aantal * 5;

    svg
      .append('rect')
      .attr('x', (spacing * i) + 60)
      .attr('y', maxHeight - glassesWater) //400-88!
      .attr('width', 25)
      .attr('height', glassesWater)
      .attr('class', 'glazen-water')
      .text(function(data) { return `${day} glazen water`; });
  }

  const xAxis = d3.svg.axis().scale(xScale),
        yAxis = d3.svg.axis().scale(yScale).orient("left");

  svg.append("g").call(xAxis)
    .attr("transform", "translate(0," + (height - 20) + ")");
  svg.append("g").call(yAxis);
});
