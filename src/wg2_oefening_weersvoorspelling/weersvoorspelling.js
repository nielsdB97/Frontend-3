d3.json("weather.json", function(error, data){
    let svg = d3.select('#weersvoorspelling');

    for(let i = 0; i < data.length; i++) {
      const spacing = 70;
      const maxHeight = 400;

      let day = data[i].dag * 4;
      let night = data[i].nacht * 4;

      svg
        .append('rect')
        .attr('x', spacing * i)
        .attr('y', maxHeight - day) //400-88!
        .attr('width', 25)
        .attr('height', day)
        .attr('class', 'dag');

      svg
        .append('rect')
        .attr('x', (spacing * i) + 25)
        .attr('y', maxHeight - night) //400-88!
        .attr('width', 25)
        .attr('height', night)
        .attr('class', 'nacht');
    }
});