'use strict';

const m = {
  margin: {
    top: 20,
    right: 20,
    bottom: 40,
    left: 40
  },
  width: 960,
  height: 400,
  innerWidth: function() {
    let innerWidth = this.width - this.margin.right - this.margin.left;
    return +innerWidth;
  },
  innerHeight: function() {
    let innerHeight = this.height - this.margin.top - this.margin.bottom;
    return +innerHeight;
  }
}

d3.tsv("../data/project-data.tsv", type, draw);

function draw(err, data) {
  if (err) throw err;

  const $prevWeek = document.querySelector('button.prevWeek');
  const $nextWeek = document.querySelector('button.nextWeek');
  const $currWeek = document.querySelector('span.currWeek');
  let week;

  const x = d3.scale.ordinal().rangeRoundBands([0, m.innerWidth()], 0);
  const y = d3.scale.linear()
    .range([m.innerHeight(), 0]);

  const spacing = 10;

  week = d3.min( data.map( (d) => ( d["Week"] ) ) );
  $currWeek.innerHTML = `Week ${week}`;

  const chart = d3.select("svg.chart")
    .attr("width", m.width)
    .attr("height", m.height)
    .append("g")
    .attr("transform", `translate(${m.margin.left},${m.margin.top})`);

  /*
    X- and Y-Domain
  */
  x.domain(data.map((d) => ( d["Dag"] )));
  y.domain([0, d3.max( data.map( (d) => ( d["Slaap minuten"] ) ) )]);

  /*
    X- and Y-Axis
  */

  const xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  const yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${m.innerHeight()})`)
      .call(xAxis)
    .selectAll("text")
      .attr("dx", "0")
      .attr("dy", "2em");

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("minuten");

  /*
    SVG group in chart holding the data bars
  */

  chart.append('g').attr('class', 'chartData');
  const chartData = d3.select('.chartData');

  /*
    Tooltip
  */

  const tooltip = d3.select('body').append('div')
    .style('position', 'absolute')
    .style('padding', '0 10px')
    .style('background', 'white')
    .style('opacity', 0)
    .attr("class", "tooltip");

  update(err, data);

  /*
    Week switching buttons
  */

  $prevWeek.addEventListener('click', (event) => {
    if (minMaxWeek(event.target.className, week) === true) {
      tooltip.style("opacity", "0");
      week = week - 1;
      $currWeek.innerHTML = `Week ${week}`;
      update(err, data);
    }
  });
  $nextWeek.addEventListener('click', () => {
    if (minMaxWeek(event.target.className, week) === true) {
      tooltip.style("opacity", "0");
      week = week + 1;
      $currWeek.innerHTML = `Week ${week}`;
      update(err, data);
    }
  });

  function minMaxWeek(button, week) {
    if (button === 'prevWeek' && week <= d3.min( data.map( (d) => ( d["Week"] ) ) )) {
      return false;
    } else if (button === 'nextWeek' && week >= d3.max( data.map( (d) => ( d["Week"] ) ) )) {
      return false;
    } else {
      return true;
    }
  }

  function update(err, data) {
    let subset = data.filter(function (d) {
      return +d["Week"] === +week;
    });
    const bars = chartData.selectAll("rect").data(subset);

    bars.enter().append('rect');
    bars.exit().remove();

    bars
      .attr('width', x.rangeBand() - spacing)
      .attr('x', function (d, i) { return i * x.rangeBand() + spacing/2 })
      .attr('y', function (d) { return y(d["Slaap minuten"]); })
      .attr('height', function (d) { return m.innerHeight() - y(d["Slaap minuten"]); })
      .attr("fill", "steelblue")
      .on('mouseover', function(d) {
        d3.select(this)
          .attr("opacity", "0.5");
        tooltip.transition()
          .style("opacity", ".9");
        tooltip.html(d["Slaap minuten"])
          .style('left', (d3.event.pageX - 35) + 'px')
          .style('top',  (d3.event.pageY - 30) + 'px');
      })
      .on('mouseout', function(d) {
        tooltip.style("opacity", "0");
        d3.select(this)
          .attr("opacity", "1")
      });

      // .append("svg:title")
      //   .text(function(d) { return d["Slaap minuten"]; })
  }
}

function type(d) {
  d["Week"] = +d["Week"]; // coerce to number
  return d;
}
