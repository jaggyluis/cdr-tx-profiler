
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
