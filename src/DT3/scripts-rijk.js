{
// Anonimize by adding a block scope

/* TODO
  Slaap HH:MM toevoegen
  Emotie toevoegen
  Filtering toevoegen van soorten minuten
*/

'use strict';

/*
  Declare measurements in an object
*/
const m = {
  margin: {
    top: 25,
    right: 20,
    bottom: 40,
    left: 40
  },
  width: 960,
  height: 500,
  innerWidth: function() {
    let innerWidth = this.width - this.margin.right - this.margin.left;
    return +innerWidth;
  },
  innerHeight: function() {
    let innerHeight = this.height - this.margin.top - this.margin.bottom;
    return +innerHeight;
  },
  weekSelectorMargin: {
    top: 20,
    right: 20,
    bottom: 35,
    left: 20
  },
  weekSelectorHeight: 150,
  weekSelectorInnerWidth: function() {
    let weekSelectorInnerWidth = this.innerWidth() - this.weekSelectorMargin.right - this.weekSelectorMargin.left;
    return +weekSelectorInnerWidth;
  },
  weekSelectorInnerHeight: function() {
    let weekSelectorInnerHeight = this.weekSelectorHeight - this.weekSelectorMargin.top - this.weekSelectorMargin.bottom;
    return +weekSelectorInnerHeight;
  }
};

/*
  Set locale to the Netherlands
*/
moment.locale('nl');

const NL = d3.locale({
    'decimal': ',',
    'thousands': '.',
    'grouping': [3],
    'currency': ['€', ''],
    'dateTime': '%a %b %e %X %Y',
    'date': '%d-%m-%Y',
    'time': '%H:%M:%S',
    'periods': ['AM', 'PM'],
    'days': ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'],
    'shortDays': ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'],
    'months': ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'],
    'shortMonths': ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
    'week': {
      'dow': 1
    }
});

const tickFormat = NL.timeFormat.multi([
    ['%H:%M', function(d) { return d.getMinutes(); }],
    ['%H:%M', function(d) { return d.getHours(); }],
    ['%a %d', function(d) { return d.getDay() && d.getDate() != 1; }],
    ['%b %d', function(d) { return d.getDate() != 1; }],
    ['%W', function(d) { return d.getWeek(); }],
    ['%B', function(d) { return d.getMonth(); }],
    ['%Y', function() { return true; }]
]);

/*
  Get the data and call functions to handle it
*/

d3.tsv('../data/project-data.tsv', type, draw);

/*
  Draw the svg's using the provided data
*/

function draw(err, data) {
  // Error handling in case the data doesn't come through
  if (err) throw err;

  // Declare variables
  let selectedWeek;
  const $weekSelectorGraphic = document.querySelector('svg.weekSelectorGraphic');
  const $prevWeek = document.querySelector('button.prevWeek');
  const $nextWeek = document.querySelector('button.nextWeek');

  const x0 = d3.scale.ordinal().rangeRoundBands([0, m.innerWidth()], 0);
  const x1 = d3.scale.ordinal();
  const x2 = d3.time.scale()
    .domain([firstDate(data, 'date'), lastDate(data, 'date')])
    .rangeRound([0, m.weekSelectorInnerWidth()]);
  const y0 = d3.scale.linear()
    .range([m.innerHeight(), 0]);
  const y1 = d3.scale.linear()
    .range([(m.innerHeight() / 2), 0]);

  const color = d3.scale.ordinal()
      .range(['hsl(200,100%,20%)', 'hsl(200,100%,50%)', 'hsl(200,100%,80%)', 'hsl(166, 58%, 46%)', 'hsl(100,60%,30%)',  'hsl(100,40%,50%)', 'hsl(100,70%,60%)']);

  selectedWeek = d3.min( data.map( (d) => ( d['Week'] ) ) );

  typesOfminutes = [
    'Smartphone minuten',
    'Computer minuten',
    'Facebook minuten',
    'Media minuten',
    'Studie minuten',
    'Sport minuten',
    'Werk minuten'
  ];



  let maxMinutes = 1;

  data.forEach((d, i) => {
    d.minutes = typesOfminutes.map((name) => ( { name, value: +d[name] } ));
    for (let j = 0; j < d.minutes.length; j++) {
      d.minutes[j].value > maxMinutes ? maxMinutes = d.minutes[j].value : false;
    }

    d.zeroMinutes = typesOfminutes.map((name) => ( d[name] ));
    for (let k = 0; k < typesOfminutes.length; k++) {
      let type = typesOfminutes[k];
      d.zeroMinutes[k] === 0 ? d[type] = 3 : false;
    }
  });

  const chart = d3.select('svg.chart')
    .attr('width', m.width)
    .attr('height', m.height)
    .append('g')
    .attr('transform', `translate(${m.margin.left},${m.margin.top})`);

  /*
    X- and Y-Domain
  */
  x0.domain(data.map((d) => ( d['Dag'] )));
  x1.domain(typesOfminutes).rangeRoundBands([0, x0.rangeBand()]);
  y0.domain([0, maxMinutes]);
  y1.domain([1, 5]);

  /*
    X- and Y-Axis
  */
  const xAxis = d3.svg.axis()
      .scale(x0)
      .orient('bottom');

  const yAxis = d3.svg.axis()
      .scale(y0)
      .orient('left');

  const yAxis1 = d3.svg.axis()
      .scale(y1)
      .orient('right')
      .ticks(5);

  chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${m.innerHeight()})`)
      .call(xAxis)
    .selectAll('text')
      .attr('y', '1em');

  chart.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
    .selectAll('text')
      .attr('x', '-1em')
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', 20)
      .attr('y', 20)
      .style('text-anchor', 'end')
      .text('minuten');

  chart.append('g')
      .attr('class', 'y axis right')
      .attr('transform', `translate(${m.innerWidth()}, ${m.innerHeight() / 3})`)
      .call(yAxis1)
    .selectAll('text')
      .attr('x', '1em');

  /*
    SVG group in chart holding the data bars
  */
  chart.append('g').attr('class', 'chartData');
  const chartData = d3.select('.chartData');

  /*
    Legend
  */
  const legend = chart.append('g').attr('class', 'legend')
    .selectAll('.legend-item')
      .data(typesOfminutes.slice())
    .enter().append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => ( `translate(-${i * (m.innerWidth() / typesOfminutes.length)}, -25)` ));

  legend.append('rect')
      .attr('x', m.innerWidth() - 18)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', color);

  legend.append('text')
      .attr('x', m.innerWidth() - 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text(function(d) {
        // Subtract the word 'minuten'
        const kind = d.split(' ').shift();
        return kind;
      });

  /*
    Call update
  */
  update(data);

  /*
    Week switching buttons
  */
  $prevWeek.addEventListener('click', (event) => {
    if (minMaxWeek(event.target.className, selectedWeek) === true) {
      selectedWeek = selectedWeek - 1;

      const extent0 = brush.extent(),
          extent1 = extent0.map(d3.time.week.round);

      const min = moment(d3.time.week.floor(extent1[0])).subtract(1, 'week')._d;
      const max = moment(d3.time.week.ceil(extent1[1])).subtract(1, 'week')._d;

      d3.select('.brush').call(brush.extent([min, max]));

      update(data);
    }
  });
  $nextWeek.addEventListener('click', () => {
    if (minMaxWeek(event.target.className, selectedWeek) === true) {
      selectedWeek = selectedWeek + 1;

      const extent0 = brush.extent(),
          extent1 = extent0.map(d3.time.week.round);

      const min = moment(d3.time.week.floor(extent1[0])).add(1, 'week')._d;
      const max = moment(d3.time.week.ceil(extent1[1])).add(1, 'week')._d;

      d3.select('.brush').call(brush.extent([min, max]));

      update(data);
    }
  });

  function minMaxWeek(button, week) {
    if (button === 'prevWeek' && week <= d3.min( data.map( (d) => ( d['Week'] ) ) )) {
      return false;
    } else if (button === 'nextWeek' && week >= d3.max( data.map( (d) => ( d['Week'] ) ) )) {
      return false;
    } else {
      return true;
    }
  }

  /*
    Graphical week selector
  */
  const weekSelectorGraphic = d3.select($weekSelectorGraphic)
    .attr('width', m.innerWidth())
    .attr('height', m.weekSelectorHeight)
  .append('g')
    .attr('transform', `translate(${m.weekSelectorMargin.left}, ${m.weekSelectorMargin.top})`);

  function firstDate (d, type) {
    const firstDate = d[0].Datum;

    if (type == 'date') {
      const date = moment(firstDate, 'DD-MM-YYYY');
      return date._d;
    } else if (type == 'string') {
      return firstDate;
    } else if (type == 'week') {
      const week = moment(firstDate, 'DD-MM-YYYY').isoWeek();
      return week;
    } else {
      return false;
    }
  };

  function lastDate (d, type) {
    const lastItem = d.length - 1;
    const lastDate = d[lastItem].Datum;

    if (type == 'date') {
      const date = moment(lastDate, 'DD-MM-YYYY');
      return date;
    } else if (type == 'string') {
      return lastDate;
    } else if (type == 'week') {
      const week = moment(lastDate, 'DD-MM-YYYY').isoWeek();
      return week;
    } else {
      return false;
    }
  };

  function lastDayFirstWeek (d) {
    const lastDayFirstWeek = d[6].Datum;

    const date = moment(lastDayFirstWeek, 'DD-MM-YYYY');
    return date._d;
  };

  function whatWeek(d) {
    const week = moment(d, 'DD-MM-YYYY').isoWeek();
    return week;
  }

  function whatDayOfTheWeek(d) {
    const day = moment(d, 'DD-MM-YYYY').isoWeekday();
    return day;
  }

  const xAxis1 = d3.svg.axis()
    .scale(x2)
    .orient('bottom')
    .ticks(d3.time.week)
      .tickSize(-m.weekSelectorInnerHeight())
      .tickFormat(() => ( null ));

  const xAxis2 = d3.svg.axis()
    .scale(x2)
    .orient('bottom')
    .ticks(d3.time.week)
      .tickPadding(0)
      .tickFormat(tickFormat);

  const brush = d3.svg.brush();
  brush
    .x(x2)
    .extent([firstDate(data, 'date'), lastDayFirstWeek(data)])
    .on('brushend', brushended);

  weekSelectorGraphic.append('g')
    .attr('class', 'x axis axis--grid')
    .attr('height', m.weekSelectorInnerHeight())
    .attr('transform', `translate(0, ${m.weekSelectorInnerHeight()})`)
    .call(xAxis1)
  .selectAll('.tick')
    .attr('class', 'tick--minor', function(d) { return d.getHours(); });

  weekSelectorGraphic.append('g')
    .attr('class', 'axis axis--x')
    .attr('transform', 'translate(0,' + m.weekSelectorInnerHeight() + ')')
    .call(xAxis2)
    .attr('text-anchor', null)
  .selectAll('text')
    .attr('y', 15);

  const gBrush = weekSelectorGraphic.append('g')
    .attr('class', 'brush')
    .call(brush)
    .call(brush.event);

  gBrush.selectAll('rect')
      .attr('height', m.weekSelectorInnerHeight());

  function brushended() {
    if (!d3.event.sourceEvent) return; // only transition after input
    const extent0 = brush.extent(),
        extent1 = extent0.map(d3.time.week.round);

    // if empty when rounded, use floor & ceil instead
    if (extent1[0] >= extent1[1]) {
      extent1[0] = d3.time.week.floor(extent0[0]);
      extent1[1] = d3.time.week.ceil(extent0[1]);
    }

    if (whatWeek(extent1[0]) === whatWeek(extent1[1]) - 1) {
      selectedWeek = whatWeek(extent1[0]) + 1;
      update(data);
    } else {
      alert('You can only select ONE week at a time!');
      d3.select(this).call(brush.extent([firstDate(data, 'date'), lastDayFirstWeek(data)]));
      return false;
    }
    d3.select(this).transition()
      .call(brush.extent(extent1))
      .call(brush.event);
  }


  /*
    Update function
  */
  function update(data) {
    const subset = data.filter((d) => {
      return +d['Week'] === +selectedWeek;
    });

    // const line = d3.svg.line()
    //   .x((d) => ( x2(moment(d.Datum, 'DD-MM-YYYY')._d)))
    //   // .x((d) => ( x2(moment(d.Datum, 'DD-MM-YYYY')._d) + x0.rangeBand() / 2 ))
    //   .y((d) => ( y1(d.Blijheid) ));
    //
    // chart.append("path")
    //   .datum(subset)
    //   .attr('transform', `translate(40, ${m.innerHeight() / 3})`)
    //   .attr("class", "line")
    //   .attr("d", line);


    // const days = chartData.selectAll('.day').data(subset);
    // const daysEnter = days.enter().append('g')
    //   .attr('class', 'day')
    //   .attr('transform', (d) => { return 'translate(' + x0(d['Dag']) + ',0)'; });
    // // daysEnter.append('rect');
    // // days.selectAll('rect').data((d) => { return d.minutes }).exit().remove();
    //
    // daysEnter.selectAll('rect')
    //   // .attr('width', x0.rangeBand() - spacing)
    //   .attr('width', x1.rangeBand())
    //   .attr('x', (d, i) => (x1(d.minutes[i].name)))
    //   // .attr('x', (d, i) => ( i * x0.rangeBand() + spacing/2 ))
    //   .attr('y', (d, i) => ( y0(d.minutes[i].value) ))
    //   .attr('height', (d, i) => ( m.innerHeight() - y0(d.minutes[i].value) ))
    //   .attr('fill', (d, i) => (color(d.minutes[i].name)))
    //   .append('svg:title')
    //     .text((d, i) => ( d.minutes[i].value ));
    //
    // days.exit().remove();

    const days = chartData.selectAll('.day').data(subset);

    days
      .enter()
      .append('g')
        .attr('class', (d) => `day ${d.Dag}`)
        .attr('transform', (d) => 'translate(' + x0(d.Dag) + ',0)' );


    for (let i = 0; i < typesOfminutes.length; i++) {
      days
        .append('rect')
        .attr('width', x1.rangeBand())
        .attr('height', (d) => (m.innerHeight() - y0(d[typesOfminutes[i]])))
        .attr('x', (d) => x1(d.minutes[i].name))
        .attr('y', (d) => y0(d[typesOfminutes[i]]))
        .attr('fill', (d) => (color(d.minutes[i].name)));
    }

    days.exit().remove();

    // days
    //   .enter()
    //   .append('rect')
    //   .attr('width', x1.rangeBand())
    //   .attr('height', (d) => (m.innerHeight() - y0(d[typesOfminutes[0]])))
    //   .attr('x', (d) => { console.log(x1(d.minutes[0].name)); return x1(d.minutes[0].name)})
    //   .attr('y', (d) => y0(d[typesOfminutes[0]]))
    //   .attr('fill', (d) => (color(d.minutes[0].name)));
    //
    //   days
    //     .enter()
    //     .append('rect')
    //     .attr('width', x1.rangeBand())
    //     .attr('height', (d) => (m.innerHeight() - y0(d[typesOfminutes[1]])))
    //     .attr('x', (d) => { console.log(d[typesOfminutes[1]]); return x1(d.minutes[1].name)})
    //     .attr('y', (d) => y0(d[typesOfminutes[1]]))
    //     .attr('fill', (d) => (color(d.minutes[1].name)));


    //
    // const myGroups = chartData.selectAll('g').data(subset);
    //
    // // enter selection
    // const myGroupsEnter = myGroups.enter()
    //   .append('g')
    //   .attr('class', 'day');
    //   // .attr('transform', (d) => { return 'translate(' + x0(d['Dag']) + ',0)'; });
    // myGroupsEnter.append('rect');
    // // myGroupsEnter.append('rect');
    // // myGroupsEnter.append('rect');
    // // myGroupsEnter.append('rect');
    // // myGroupsEnter.append('rect');
    // // myGroupsEnter.append('rect');
    // // myGroupsEnter.append('rect');
    // // ...
    //
    // // update selection -- this will also contain the newly appended elements
    // myGroups.select('rect')
    //   // .attr('width', x0.rangeBand() - spacing)
    //   .attr('width', x1.rangeBand())
    //   .attr('x', (d, i) => (x1(d.minutes[i].name)))
    //   // .attr('x', (d, i) => ( i * x0.rangeBand() + spacing/2 ))
    //   .attr('y', (d, i) => ( y0(d.minutes[i].value) ))
    //   .attr('height', (d, i) => ( m.innerHeight() - y0(d.minutes[i].value) ))
    //   .attr('fill', (d, i) => (color(d.minutes[i].name)))
    //   .append('svg:title')
    //     .text((d, i) => ( d.minutes[i].value ));
    // // ...
    //
    // // exit selection
    // myGroups.exit().remove();




    // const myGroups = chartData.selectAll('g').data(subset);
    //
    // // enter selection
    // const myGroupsEnter = myGroups.enter().append('g');
    // myGroupsEnter.append('rect');
    // // ...
    //
    // // update selection -- this will also contain the newly appended elements
    // myGroups.select('rect')
    //   // .attr('width', x0.rangeBand() - spacing)
    //   .attr('width', x1.rangeBand())
    //   .attr('x', (d, i) => (x1(d.minutes[i].name)))
    //   // .attr('x', (d, i) => ( i * x0.rangeBand() + spacing/2 ))
    //   .attr('y', (d, i) => ( y0(d.minutes[i].value) ))
    //   .attr('height', (d, i) => ( m.innerHeight() - y0(d.minutes[i].value) ))
    //   .attr('fill', (d, i) => (color(d.minutes[i].name)))
    //   .append('svg:title')
    //     .text((d, i) => ( d.minutes[i].value ));
    // // ...
    //
    // // exit selection
    // myGroups.exit().remove();

  }
}

function type(d, i) {
  // coerce to number
  d['Week'] = +d['Week'];
  d['Slaap minuten'] = +d['Slaap minuten'];
  d['Slaap kwaliteit'] = +d['Slaap kwaliteit'];
  d['Smartphone minuten'] = +d['Smartphone minuten'];
  d['Computer minuten'] = +d['Computer minuten'];
  d['Facebook minuten'] = +d['Facebook minuten'];
  d['Media minuten'] = +d['Media minuten'];
  d['Studie minuten'] = +d['Studie minuten'];
  d['Sport minuten'] = +d['Sport minuten'];
  d['Werk minuten'] = +d['Werk minuten'];

  return d;
}

}
