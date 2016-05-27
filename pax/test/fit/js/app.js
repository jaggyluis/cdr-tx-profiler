var data_x = [2,5,7,12,20,32,50];
var data_y = [5,10,15,20,25,30,35];

var cubic = function(params,x) {
  return params[0] * x*x*x +
    params[1] * x*x +
    params[2] * x +
    params[3];
};

var objective = function(params) {
  var total = 0.0;
  for(var i=0; i < data_x.length; ++i) {
    var resultThisDatum = cubic(params, data_x[i]);
    var delta = resultThisDatum - data_y[i];
    total += (delta*delta);
  }
  return total;
};

var initial = [1,1,1,1];
var minimiser = numeric.uncmin(objective,initial);

console.log("initial:");
for(var j=0; j<initial.length; ++j) {
  console.log(initial[j]);  
}

console.log("minimiser:");
for(var j=0; j<minimiser.solution.length; ++j) {
  console.log(minimiser.solution[j]);
}



/*
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


var objective = makeObjective(cubic, data_x, data_y); // then carry on as before
*/