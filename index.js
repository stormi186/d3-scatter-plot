var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

var margin = {top: 100, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

d3.json(url, function(error, data) {
  data.forEach(function(d) {
    d.Place += d.Place;
    d.Year = new Date(d.Year.toString());
    console.log(d.Year.toString());
    var parsedTime = d.Time.split(':');
    d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
  })
  
  var xScale = d3.scaleTime().range([0, width])
    .domain([d3.min(data, function(d) {
    return d.Year.setFullYear(d.Year.getFullYear() - 1);
  }),
             d3.max(data, function(d) {
    return d.Year.setFullYear(d.Year.getFullYear() + 2);
  })]);
  
  var yScale = d3.scaleTime().range([0, height])
    .domain(d3.extent(data, function(d) {
      return d.Time;
    }));

  var timeFormatX = d3.timeFormat("%Y");
  var xAxis = d3.axisBottom(xScale).tickFormat(timeFormatX);
  
  var timeFormatY = d3.timeFormat("%M:%S");
  var yAxis = d3.axisLeft(yScale).tickFormat(timeFormatY);
  
  var tooltip = d3.select('body').append('div')
    .attr('id', 'tooltip')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  var svg = d3.select('body').append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "graph-svg-component")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  svg.append('g')
    .attr("class", "x axis")
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0,' + height + ')');
    
  svg.append('g')
    .attr("class", "y axis")
    .call(yAxis)
    .attr('id', 'y-axis');
  
  svg.append('text')
    .attr('x', -40)
    .attr('y', -10)
    .style('font-size', 18)
    .text('Time(min)');
  
  svg.append('text')
    .attr('x', 450)
    .attr('y', 400)
    .style('font-size', 18)
    .text('Year');
  
  svg.append('text')
    .attr('id','title')
    .attr('x', (width / 2))             
    .attr('y', 0 - (margin.top / 2))
    .attr('text-anchor', 'middle')  
    .style('font-size', '30px') 
    .text('Doping in Professional Bicycle Racing');
  
  svg.selectAll('.dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .style("fill", function(d) {
      if (d.Doping != '') 
        return 'red';
      else 
        return 'blue';
    })
    .attr('r', 6)
    .attr('cx', function(d) {
      return xScale(d.Year);
    })
    .attr('cy', function(d) {
      return yScale(d.Time);
    })
    .attr('data-xvalue', function(d){
      return d.Year.toISOString();
    })
    .attr('data-yvalue', function(d){
      return d.Time.toISOString();
    })
    .on('mouseover', function(d) {
          tooltip.style('opacity', 1);
          tooltip.style('left', d3.event.pageX + 'px')
            .style('top', (d3.event.pageY - 28) + 'px')
            .html(d.Name + ": " + d.Nationality + "<br/>"
              + "Year: " +  timeFormatX(d.Year) + ", Time: " 
              + timeFormatY(d.Time))
            .attr('data-year', d.Year.toISOString());
        })
     .on('mouseout', function(d) {
        tooltip.transition().style('opacity', 0)
        })   
  
  var legend = d3.select('svg')
    .append('g')
    .attr('id', 'legend')
    .attr('transform', 'translate(' + (width / 4) * 3 + ', ' + (height / 4) + ')');

  legend.append('circle')
    .attr('fill', 'blue')
    .attr('stroke', 'black')
    .attr('r', 6)
    .attr('cx', 15)
    .attr('cy', 45);

  legend.append('text')
    .attr('font-size', '12px')
    .attr('x', 35)
    .attr('y', 49)
    .text('no doping allegations');

  legend.append('circle')
    .attr('fill', 'red')
    .attr('stroke', 'black')
    .attr('r', 6)
    .attr('cx', 15)
    .attr('cy', 75);

  legend.append('text')
    .attr('font-size', '12px')
    .attr('x', 35)
    .attr('y', 79)
    .text('riders with doping allegations');
  
  });