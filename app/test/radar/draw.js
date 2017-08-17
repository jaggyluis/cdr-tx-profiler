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
    return (radius - innerRadius) * (d.data.radius / 100.0) + innerRadius; 
  });

var arcLine = d3.svg.arc()
  .innerRadius(function (d) {
      return (radius - innerRadius) * (d.data.radius / 100.0) + innerRadius -10;
  })
  .outerRadius(function (d) {
      return (radius - innerRadius) * (d.data.radius / 100.0) + innerRadius;
  });

var arcOutline = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(radius);

var labelArc = d3.svg.arc()
   .innerRadius(radius)
   .outerRadius(radius + 20);

var tagArc = d3.svg.arc()
   .innerRadius(radius + 35)
   .outerRadius(radius + 40);


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

d3.csv('passengerProfiles.csv', function (error, data) {

    var charts = [],
        names = [],
        ignore = ['color', 'name'],
        bounds = {},
        units = data.filter(function (d) {
            return d.name == 'unit';
        })[0];

    data.splice(data.indexOf(units), 1);

    console.log(data);
    console.log(units);

    data.forEach(function (d) {

        var chart = [],
            name = d.name;

        Object.keys(d).forEach(function (k) {

            if (!ignore.includes(k)) {

                var val = +d[k];

                var piece = {
                    "id": k,
                    "mean": val,
                    "weight": 1,
                    "color": d.color,
                    "label": k,
                    "unit" : units[k]
                }

                if (!(k in bounds)) {
                    bounds[k] = [Infinity, -Infinity];
                }

                if (val < bounds[k][0]) bounds[k][0] = val;
                if (val > bounds[k][1]) bounds[k][1] = val;

                chart.push(piece);
            }
        })

        charts.push(chart);
        names.push(name);
    });

    charts.forEach(function (chart, i) {

        chart.forEach(function (piece) {

            var scale = d3.scale.linear().domain(bounds[piece.id]).range([5, 100]);

            if (bounds[piece.id][0] < 0 || bounds[piece.id][1] > 100) {
                piece.radius = scale(piece.mean);
            } else {
                piece.radius = piece.mean;
            }

            
        });

        drawChart(chart, names[i]);
    });
});

function drawChart(data, name) {

    console.log(name);

    var svg = d3.select("body").append("svg")
        .attr("width", width * 2)
        .attr("height", height * 2)
        .append("g")
        .attr("transform", "translate(" + width + "," + height + ")");

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

    var arcOutlinePath = svg.selectAll(".outlineArc")
        .data(pie(data))
      .enter().append("path")
        .attr("fill", "none")
        .attr("stroke", "white")
        //.attr("stroke-width", "0.1")
        .attr("class", "outlineArc")
        .attr("d", arcOutline);

    var labelArcPath = svg.selectAll(".labelArc")
        .data(pie(data))
      .enter().append("path")
        .attr("id", function (d, i) { return "group" + d.id + "-" + i; })
        .attr("fill", "black")
        .attr("stroke", "white")
        .attr("class", "labelArc")
        .attr("d", labelArc);

    //createInnerArcs().forEach(function (ia) {

    //    var innerPath = svg.selectAll(".innerArcs")
    //        .data(pie(data))
    //      .enter().append("path")
    //        .attr("fill", "none")
    //        .attr("stroke", "white")
    //        .attr("stroke-width", "1")
    //        .attr("class", "innerArc")
    //        .attr("d", ia);
    //})

    var arcLinePath = svg.selectAll(".solidArc")
         .data(pie(data))
       .enter().append("path")
         .attr("fill", function (d) { return d.data.color; })
         .attr("class", "solidArc")
         .attr("stroke", "white")
         .attr("stroke-width", "1px")
         .attr("d", arcLine)

    var text = svg.selectAll(".text")
        .data(pie(data))
      .enter()
        .append("text")
        .attr("dy", ".35em")
        .style("font-size", "15px")
        .attr("text-anchor", "middle")
        .text(function (d) {
            return Math.round(d.data.mean) + d.data.unit;
        })
        .attr("transform", function (d) {

            var pos = tagArc.centroid(d);
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

    var tag = svg.append("text")
        .text(function (d) {
            return name;
        })
        .style("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("transform", "translate(0," + height*0.75 + ")");
}
