
var xArr = [0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180]
var yArr = [6,4,4,6,9,12,12,12,10,7,4,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
//var yArr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,3,4,3,2,1,1,1,1,6,45,26,2,0,0,0]
//var yArr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,40,40,2,0,0]

/*
var cubic = function(params,x) {
  return params[0] * x*x*x +
    params[1] * x*x +
    params[2] * x +
    params[3];
};
var makeObjective = function(targetFunc,xlist,ylist) {
  var objective = function(params) {
    var total = 0.0;
    for(var i=0; i < xlist.length; ++i) {
      var resultThisDatum = targetFunc(params, xlist[i]);
      var delta = resultThisDatum - ylist[i];
      total += (delta*delta);
    }
    return total;
  };
  return objective;
};


var initial = [1,1,1,1];
var objective = makeObjective(cubic, x, y)
var minimiser = numeric.uncmin(objective,initial);


console.log("initial:");
for(var j=0; j<initial.length; ++j) {
  console.log(initial[j]);  
}

console.log("minimiser:");
for(var j=0; j<minimiser.solution.length; ++j) {
  console.log(minimiser.solution[j]);
}
*/

//------------------------------------------------------------

var makeFitFn = function(pts, order) {
  
  pts = pts.filter(function(pt) {
    return pt.y > 0;
  })
  console.log(pts);
  var  xArr = pts.map(function(pt) {
    return pt.x;
  })
  var yArr = pts.map(function(pt) {
    return pt.y;
  })
  var xMatrix = [];
  var xTemp = [];
  var yMatrix = numeric.transpose([yArr]);

  for (j=0;j<xArr.length;j++)
  {
      xTemp = [];
      for(i=0;i<=order;i++)
      {
          xTemp.push(1*Math.pow(xArr[j],i));
      }
      xMatrix.push(xTemp);
  }
  var xMatrixT = numeric.transpose(xMatrix);
  var dot1 = numeric.dot(xMatrixT,xMatrix);
  var dotInv = numeric.inv(dot1);
  var dot2 = numeric.dot(xMatrixT,yMatrix);
  var solution = numeric.dot(dotInv,dot2);

  var fn = function(x) {
    var y = 0;
    for (var i=0; i<solution.length; i++) {
      y+= solution[i] * Math.pow(x, i);
    }
    return y > 0 ? y : 0;
    
  }
  return fn;
}

//var pts = xArr.map(function(x,i) {
//  return {x:x, y:yArr[i]};
//})

var p1 = Object.keys(t1).map(function(x) {
  return {x:x, y:t1[x]};
})
var p2 = Object.keys(t2).map(function(x) {
  return {x:x, y:t2[x]};
})
var p3 = Object.keys(t3).map(function(x) {
  return {x:x, y:t3[x]};
})
var p4 = Object.keys(t4).map(function(x) {
  return {x:x, y:t4[x]};
})

//var fit = makeFitFn(pts, 3);

var svgContainer = d3.select("body").append("svg")
                                    .attr("width", 1000)
                                    .attr("height", 1000);

 
var lineFunction = d3.svg.line()
                         .x(function(d) { return d.x; })
                         .y(function(d) { return d.y*10; })
                         .interpolate("linear");

var l1 = svgContainer.append("path")
        .attr("d", lineFunction(p1))
        .attr("stroke", "blue")
        .attr("stroke-width", 1)
        .attr("fill", "none");

var l2 = svgContainer.append("path")
        .attr("d", lineFunction(p2))
        .attr("stroke", "red")
        .attr("stroke-width", 1)
        .attr("fill", "none");

var l3 = svgContainer.append("path")
        .attr("d", lineFunction(p3))
        .attr("stroke", "green")
        .attr("stroke-width", 1)
        .attr("fill", "none");

var l4 = svgContainer.append("path")
        .attr("d", lineFunction(p4))
        .attr("stroke", "orange")
        .attr("stroke-width", 1)
        .attr("fill", "none");