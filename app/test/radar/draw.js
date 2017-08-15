var width = 300,
    height = 300,
    radius = Math.min(width, height) / 2,
    innerRadius = 0.3 * radius;

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.width; });

var arc = d3.svg.arc()
  .innerRadius(function (d) { 
      //return (radius - innerRadius) * (d.data.min / 100.0) + innerRadius; 
      return innerRadius;
  })
  .outerRadius(function (d) { 
    return (radius - innerRadius) * (d.data.mean / 100.0) + innerRadius; 
  });

var arcLine = d3.svg.arc()
  .innerRadius(function (d) {
      return (radius - innerRadius) * (d.data.mean / 100.0) + innerRadius;
  })
  .outerRadius(function (d) {
      return (radius - innerRadius) * (d.data.mean / 100.0) + innerRadius;
  });

var arcOutline = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius);

var labelArc = d3.svg.arc()
  .innerRadius(radius)
  .outerRadius(function (d) {
      return radius + 20;
  });

var svg = d3.select("body").append("svg")
    .attr("width", width*2)
    .attr("height", height*2)
    .append("g")
    .attr("transform", "translate(" + width+ "," + height + ")");

function createInnerArcs() {

    var arcs = [];
    var count = 4;
    var ring = (radius - innerRadius) / count;

    for (var i = 0; i < count; i++) {

        var r =  innerRadius + i * ring;
        arcs.push(d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(r));
    }

    return arcs;
}

d3.csv('passengerProfile.csv', function (error, data) {

    data.forEach(function (d) {
        d.id = d.id;
        d.color = d.color;
        d.weight = +d.weight;
        d.min = +d.min;
        d.mean = +d.mean;
        d.max = +d.max;
        d.width = +d.weight;
        d.label = d.label;
    });

    function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    var arcPath = svg.selectAll(".arcLine")
        .data(pie(data))
      .enter().append("path")
        .attr("fill", function (d) { return d.data.color; })
        .attr("class", "arcLine")
        .attr("stroke", function (d) { return d.data.color; })
        .attr("stroke-width", "0px")
        .attr("opacity", "0.5")
        .attr("d", arc)

    var arcLinePath = svg.selectAll(".solidArc")
         .data(pie(data))
       .enter().append("path")
         .attr("fill", function (d) { return d.data.color; })
         .attr("class", "solidArc")
         .attr("stroke", function (d) { return d.data.color; })
         .attr("stroke-width", "10px")
         .attr("d", arcLine)

    var arcOutlinePath = svg.selectAll(".outlineArc")
        .data(pie(data))
      .enter().append("path")
        .attr("fill", "none")
        .attr("stroke", "black")
        //.attr("stroke-width", "0.1")
        .attr("class", "outlineArc")
        .attr("d", arcOutline);

    var labelArcPath = svg.selectAll(".labelArc")
        .data(pie(data))
      .enter().append("path")
        .attr("id", function (d, i) { return "group" + d.id + "-" + i; })
        .attr("fill", "black")
        .attr("stroke", "black")
        .attr("class", "labelArc")
        .attr("d", labelArc);

    createInnerArcs().forEach(function (ia) {

        var innerPath = svg.selectAll(".innerArcs")
            .data(pie(data))
          .enter().append("path")
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("stroke-width", "0.3")
            .attr("class", "innerArc")
            .attr("d", ia);
    })

    var text = svg.selectAll(".text")
        .data(pie(data))
      .enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function (d) {
            return d.data.mean + "%";
        })
        .attr("transform", function (d) {

            var pos = arc.centroid(d);
            return "translate(" + pos + ")";
        })

    var label = svg.selectAll(".label")
        .data(pie(data))
       .enter()
            .append("text")
            .attr("x", 6)
            .attr("dy", 15)
            .attr("fill", "white")
            .append("textPath")
                .attr("xlink:href", function (d, i) { return "#group" + d.id + "-" + i; })
                .text(function (d) {
                    return d.data.label.toUpperCase();
                })
});

