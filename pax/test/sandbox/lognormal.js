
"use strict"; //for now

//from http://stackoverflow.com/questions/646628/javascript-startswith
if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}


var isChromeApp = function() {
  return location.href.startsWith("chrome"); //for now
};

//TODO: mathjax inside the tooltips? when it loads, fade out manual equation with mathjax
//        need to see about more generally hooking into the onload event
//TODO: short writeup in the About, with references
//TODO: weirdness with sigma/mu staying highlighted when it shouldn't
//DONE: hidden divs for static words for translation
//TODO: Better looking tooltips
//TODO: how had to animate transitions when they enter a value?
//DONE: when moving sigma on normal DOWN, always fixTIcks so you can it get naoow
//TODO: basic instructions
//      "mouseover about anything to get more info", move mouse within input boxes
//      moving formulas that show what's what
//TODO: font on titles bigger
//TODO: tooltip on mouseover on the divs
//DONE: be able to drag lower 95th
//TODO: better fitting within window
//TODO: onresize have it update
//TODO: better dynamic scaling
//TODO: color scheme pass
//DONE add lower95th ones to curve
//TODO: when move mouse, show area and what percentile current one is
//TODO: add "fix mean/sigma" for when you change 95th percentile_value
//OBE since can move div: jankiness with grabbing lines (kind of dealt with by letting you drag the div)
//TODO: numerical blowup when moving percentile or mean
//I think dealt with - was due to changing tick scale when moving with mouse I think: NaN when chaninging 95th
//TODO: make sure unsetting active in all the cases
//NONEED: include % next to mean/mode?
//TODO: keep up with little things I learned
//DONE: be able to drag the div flags to changes things
//TODO: mouseover curve itself and show some info or something - show what percentile it is?
//TODO: revisit moving 95th to fix arithmetic mean while you do that
//Learn: moving median forces moving mu_N, which then forces moving mu_L

//mobile related stuff to centralize later in a general utility place
var isMobile = function() {
     
    var isIPhone = navigator.userAgent.match(/iPhone/i) != null;
    //var isiPad = navigator.userAgent.toLowerCase().indexOf("ipad");
    var isIPad = navigator.userAgent.match(/iPad/i) != null;

    var isAndroid = navigator.userAgent.match(/Android/i) != null;
    var isNexus = navigator.userAgent.match(/Nexus/i) != null;
    
    var isAndroidMobileDevice = isAndroid && (isNexus); 

     
      if (isIPhone || isIPad || isAndroidMobileDevice) {
        
          return true;
        
      }
      else {
         return false; 
      }
      
};
//end mobile stuff

//http://stackoverflow.com/questions/3216013/get-the-last-item-in-an-array
Array.prototype.last = function() {
    return this[this.length-1];
};

Array.prototype.lastIndex = function() {
    return this.length-1;
};

  var lastMouseX;
  var lastMouseY;

var myLognormalHelper;  

//this is used for dynamic text; we read from a hidden div that contains
//  the static text hopefully translated by the google translation gadget
var getText = function(divId) {  
  return $("#" + divId).html();
};
var wrapInNoTranslate = function(s) {
  return "<span class='notranslate'>" + s + "</span>"
};

var graphUpdater;
var LognormalHelperTests = function() {
    
  var that = this;

  var logMeans = [10,2,14,1000,0.1,2000,30000,300000];
  var logSigmas = [0.001, 0.01,0.1,10,100,1000];
  var p=[0.001,0.01,0.1,0.25,0.5,0.75,0.90,0.99, 0.999, 0.9999];

  //standard normal table from http://www.fmi.uni-sofia.bg/vesta/Virtual_Labs/tables/tables1.html
  var z=[];  
  //fixed typo for 0.68 - they had 0.7157 instead of 0.7517 (based on http://www.sjsu.edu/faculty/gerstman/EpiInfo/z-table.htm)
    // 0.05 - should be 0.5199 not 0.5190
    // 1.08 - should be 0.8599 not 0.8529
    // 1.05 - should be 0.8531 not 0.8513
    // 1.44 - should be 0.9251 not 0.9215
    // 1.58 - should be 0.9429 not 0.9492
  // z  .00 .01 .02 .03 .04 .05 .06 .07 .08 .09
  z[0]=".0 .5000 .5040 .5080 .5120 .5160 .5199 .5239 .5279 .5319 .5359";
  z[1]=".1 .5398 .5438 .5478 .5517 .5557 .5596 .5636 .5675 .5714 .5753";
  z[2]=".2 .5793 .5832 .5871 .5910 .5948 .5987 .6026 .6064 .6103 .6141";
  z[3]=".3 .6179 .6217 .6255 .6293 .6331 .6368 .6406 .6443 .6480 .6517";
  z[4]=".4 .6554 .6591 .6628 .6664 .6700 .6736 .6772 .6808 .6844 .6879";
  z[5]=".5 .6915 .6950 .6985 .7019 .7054 .7088 .7123 .7157 .7190 .7224";
  z[6]=".6 .7257 .7291 .7324 .7357 .7389 .7422 .7454 .7486 .7517 .7549";
  z[7]=".7 .7580 .7611 .7642 .7673 .7704 .7734 .7764 .7794 .7823 .7852";
  z[8]=".8 .7881 .7910 .7939 .7969 .7995 .8023 .8051 .8078 .8106 .8133";
  z[9]=".9 .8159 .8186 .8212 .8238 .8264 .8289 .8315 .8340 .8365 .8389";
  z[10]="1.0 .8413 .8438 .8461 .8485 .8508 .8531 .8554 .8577 .8599 .8621";
  z[11]="1.1 .8643 .8665 .8686 .8708 .8729 .8749 .8770 .8790 .8810 .8830";
  z[12]="1.2 .8849 .8869 .8888 .8907 .8925 .8944 .8962 .8980 .8997 .9015";
  z[13]="1.3 .9032 .9049 .9066 .9082 .9099 .9115 .9131 .9147 .9162 .9177";
  z[14]="1.4 .9192 .9207 .9222 .9236 .9251 .9265 .9279 .9292 .9306 .9319";
  z[15]="1.5 .9332 .9345 .9357 .9370 .9382 .9394 .9406 .9418 .9429 .9441";
  z[16]="1.6 .9452 .9463 .9474 .9484 .9495 .9505 .9515 .9525 .9535 .9545";
  z[17]="1.7 .9554 .9564 .9573 .9582 .9591 .9599 .9608 .9616 .9625 .9633";
  z[18]="1.8 .9641 .9649 .9656 .9664 .9671 .9678 .9686 .9693 .9699 .9706";
  z[19]="1.9 .9713 .9719 .9726 .9732 .9738 .9744 .9750 .9756 .9761 .9767";
  z[20]="2.0 .9772 .9778 .9783 .9788 .9793 .9798 .9803 .9808 .9812 .9817";
  z[21]="2.1 .9821 .9826 .9830 .9834 .9838 .9842 .9846 .9850 .9854 .9857";
  z[22]="2.2 .9861 .9864 .9868 .9871 .9875 .9878 .9881 .9884 .9887 .9890";
  z[23]="2.3 .9893 .9896 .9898 .9901 .9904 .9906 .9909 .9911 .9913 .9916";
  z[24]="2.4 .9918 .9920 .9922 .9925 .9927 .9929 .9931 .9932 .9934 .9936";
  z[25]="2.5 .9938 .9940 .9941 .9943 .9945 .9946 .9948 .9949 .9951 .9952";
  z[26]="2.6 .9953 .9955 .9956 .9957 .9959 .9960 .9961 .9962 .9963 .9964";
  z[27]="2.7 .9965 .9966 .9967 .9968 .9969 .9970 .9971 .9972 .9973 .9974";
  z[28]="2.8 .9974 .9975 .9976 .9977 .9977 .9978 .9979 .9979 .9980 .9981";
  z[29]="2.9 .9981 .9982 .9982 .9983 .9984 .9984 .9985 .9985 .9986 .9986";
  z[30]="3.0 .9987 .9987 .9987 .9988 .9988 .9989 .9989 .9989 .9990 .9990";
  z[31]="3.1 .9990 .9991 .9991 .9991 .9992 .9992 .9992 .9992 .9993 .9993";
  z[32]="3.2 .9993 .9993 .9994 .9994 .9994 .9994 .9994 .9995 .9995 .9995";
  z[33]="3.3 .9995 .9995 .9995 .9996 .9996 .9996 .9996 .9996 .9996 .9997";
  z[34]="3.4 .9997 .9997 .9997 .9997 .9997 .9997 .9997 .9997 .9997 .9998 ";
      
  
  that.runTests = function() {
    
    console.log("Back and Forth tests OK? " + this.checkConversionBackAndForth());
    
    this.doPercentileTest();
    this.checkHittingPercentiles();
    
  };
  
  this.doPercentileTest = function() {

    var i;
    for (i=0;i<z.length;i++) {
    
      var s = z[i];
      var valuesForThisOne = [];
      valuesForThisOne = s.split(' ');

      var normal = new NormalDistribution(0,1);
      
      var baseValue = Number(valuesForThisOne[0]);
      for (j=1;j<valuesForThisOne.length;j++) {
       
        var zValue = baseValue + 0.01*(j-1);
        var p = valuesForThisOne[j];
        
        //check with jstat
        var jstatValue = normal.getQuantile(p);
        console.log("p: " + p + ", AbsDiff = " + Math.abs(zValue - jstatValue).toExponential(1) + ", " + zValue.toFixed(4) + ", " + jstatValue.toFixed(4));
        
      }
    }

    
  };

  this.checkHittingPercentiles = function() {
  
    var tolerance = 1e-8;
    var hadFailure = false;
    var i;
    
    for (i=0;i<logMeans.length;i++) {
      
    for (j=0;j<logSigmas.length;j++) {
      
          var myLognormalHelper = 
          new LognormalHelper({mean:logMeans[i], standardDeviation:logSigmas[j]});

          var upper95th =  myLognormalHelper.getPercentilesNormalAndLognormal(0.95);
          
          var percentile_p = 0.95;
          var percentile_value = upper95th.lognormal + 5;;
          var keepNormalMeanFixedElseSigma = true;
          
          myLognormalHelper.setParametersForToHitLognormalPercentile(
                        percentile_p, 
                        percentile_value, 
                        keepNormalMeanFixedElseSigma) ;
          
          var upper95thAfter =  myLognormalHelper.getPercentilesNormalAndLognormal(0.95);
          
          if (Math.abs(percentile_value - upper95thAfter.lognormal) > tolerance) {
            hadFailure = true;
            console.log("Error checking hitting percentile: (mean,sigma) are (" + logMeans[i] + ", " + logSigmas[j] + ")");
          }
          

    }
    }
  
    console.log("Hit percentile check test OK? " + hadFailure);
  
  };

  this.checkConversionBackAndForth = function() {
  
  var hadFailure = false;
    
  var tolerance = 1e-8;
  var i;
  var j;
  var numberChecks = 0;
  for (i=0;i<logMeans.length;i++) {
    for (j=0;j<logSigmas.length;j++) {
      

      numberChecks++;
      var myLognormalHelper = 
          new LognormalHelper({mean:logMeans[i], standardDeviation:logSigmas[j]});


      var normalSettings = myLognormalHelper.getSettingsForNormal();
      
      myLognormalHelper.setNormalParameters(normalSettings); //normalSettings.mean, normalSettings.standardDeviation);
      
      var logNormalSettings = myLognormalHelper.getSettingsForLogNormal();
      
      if (Math.abs(logMeans[i]-logNormalSettings.mean) +
                        Math.abs(logSigmas[j]-logNormalSettings.standardDeviation) < tolerance) {
                          
        //onsole.log("(" + logMeans[i] + ", " + logSigmas[j] + "): OK" );
                        
      }
      else {
        hadFailure = true;
        console.log("(" + logMeans[i] + ", " + logSigmas[j] + "), err: " + 
                      (Math.abs(logMeans[i]-logNormalSettings.mean) +
                        Math.abs(logSigmas[j]-logNormalSettings.standardDeviation)).toExponential(1));
      }
      

    }    
  }
  return !hadFailure + " (Number checks: " + numberChecks + ")";
  };
  
  
};


var LognormalHelper = function(settings) {
    
  //  normal space are determined, and vice versa.
  //Therefore, you don't have to store both, although there could be
  //  performance issues down the road
  
  var that = this;
  
  //need this for the standard normal percentiles...
  var standardNormal = new NormalDistribution(0,1);
    
  var PI = Math.PI;
  var sqrtPI = Math.sqrt(PI);
  
  var myLognormalMean = Number(settings.mean);
  var myLognormalStandardDeviation = Number(settings.standardDeviation);

  that.getMeanLognormal = function() {
    return myLognormalMean;
  };
  
  that.getMean = function(which) {
    
    if (which==="lognormal") {
      return myLognormalMean;
    }
    else {
      var normalSettings = that.getSettingsForNormal();    
      return normalSettings.mean;
    }
    
  };

  that.getMedian = function(which) {
    var normalSettings = that.getSettingsForNormal();    
    if (which==="lognormal") {
      return Math.exp(normalSettings.mean);
    }
    else {
      return normalSettings.mean; //normal mean = median
    }
  };

  that.getMedianLognormal = function() {
    var normalSettings = that.getSettingsForNormal();    
    return Math.exp(normalSettings.mean);
  };

  that.getMode = function(which) {
    var normalSettings = that.getSettingsForNormal();    
    if (which==="lognormal") {
    var variance = normalSettings.standardDeviation * normalSettings.standardDeviation;
    return Math.exp(normalSettings.mean - variance);
    }
    else {
      return normalSettings.mean; //normal mean = mode
    }
  };

    
  that.getModeLognormal = function() {
    var normalSettings = that.getSettingsForNormal();    
    var variance = normalSettings.standardDeviation * normalSettings.standardDeviation;
    return Math.exp(normalSettings.mean - variance);
  };


  that.getCdf = function(x) {

    var normalSettings = that.getSettingsForNormal();

    var mu = normalSettings.mean;
    var sigma = normalSettings.standardDeviation;
    
    var y;
    var yLognormal;
    
      yLognormal = jstat.plnorm(x,mu, sigma);
      y = jstat.pnorm(x,mu, sigma);
      return {normal:y, lognormal:yLognormal};
  }

  that.getPdfValue = function(x) {
    
    var normalSettings = that.getSettingsForNormal();
    
    var mu = normalSettings.mean;
    var sigma = normalSettings.standardDeviation;
    
    var y;
    var yLognormal;
    
    if ($.isArray(x)) {
      var yValues = [];
      var yLognormalValues = [];
      var i;
      for (i=0;i<x.length;i++) {
         y = jstat.dnorm(x,mu,sigma);
         yLognormal = jstat.dlnorm(x,mu, sigma);
         yValues.push(y);
         yLognormalValues.push(yLognormal);         
      }
      return {normal:yValues, lognormal:yLognormalValues};
    }
    else {
      yLognormal = jstat.dlnorm(x,mu, sigma);
      y = jstat.dnorm(x,mu, sigma);
      //var yLognormal = Math.exp(y); //jstat.dlnorm(x,mu, sigma);
      
      //onsole.log(yLognormal + ", " + jstat.dlnorm(myLognormalMean, myLognormalStandardDeviation));
      
      //normal will be on different x range - duh...
      //onsole.log(myLognormalMean);
      //onsole.log("x, lognormal: " + x + ", " + y);
      
      return {normal:y, lognormal:yLognormal};
    }
    
  };
    

  //we need to fix either the mean in normal space or the sigma in normal space
  //the percentile is given by
  //   exp( mu + zp * sigma)
  //
  that.setParametersForToHitLognormalPercentile =
          function(percentile_p, percentile_value, keepNormalMeanFixedElseSigma) {
  
          var valueToHit_NormalSpace = Math.log(Number(percentile_value));
          
          return that.setParametersForToHitNormalPercentile (Number(percentile_p), 
                                valueToHit_NormalSpace, 
                                keepNormalMeanFixedElseSigma);
          
  };

    that.getNormalParametersForToHitNormalPercentile =
          function(percentile_p, percentile_value,  keepNormalMeanFixedElseSigma) {

          percentile_p=Number(percentile_p);
          var zp = standardNormal.getQuantile(percentile_p);

          var valueToHit_NormalSpace = Number(percentile_value);
          var currentNormalSettings = that.getSettingsForNormal();
          
          var mu = currentNormalSettings.mean;
          var sigma = currentNormalSettings.standardDeviation;
          //
          // mu + zp * sigma = valueToHit_NormalSpace
          if ( keepNormalMeanFixedElseSigma) {
            sigma = (valueToHit_NormalSpace - mu)/zp;
          }
          else {
            mu = (valueToHit_NormalSpace - zp*sigma);
          }
          //this can return a negative sigma, which makes no sense but can happen depending on , but let caller handle that for now
          return {mean:mu, standardDeviation:sigma};
          
    };

    that.setParametersForToHitNormalPercentile =
          function(percentile_p, percentile_value,  keepNormalMeanFixedElseSigma) {

          percentile_p=Number(percentile_p);
          var zp = standardNormal.getQuantile(percentile_p);

          var valueToHit_NormalSpace = Number(percentile_value);
          var currentNormalSettings = that.getSettingsForNormal();
          
          var mu = currentNormalSettings.mean;
          var sigma = currentNormalSettings.standardDeviation;
          //
          // mu + zp * sigma = valueToHit_NormalSpace
          if ( keepNormalMeanFixedElseSigma) {
            sigma = (valueToHit_NormalSpace - mu)/zp;
          }
          else {
            mu = (valueToHit_NormalSpace - zp*sigma);
          }
          
          //now switch back
          that.setNormalParameters({mean:mu,standardDeviation:sigma});
          
          return that;  

    };


  that.getPercentilesNormalAndLognormal = function(p) {
    
    var normalSettings = that.getSettingsForNormal();
    
    var zp = standardNormal.getQuantile(p);
    
    var normalPercentile = normalSettings.mean + zp*normalSettings.standardDeviation;
    var lognormalPercentile = Math.exp(normalPercentile);
    
    return {normal:normalPercentile,lognormal:lognormalPercentile};
    
  };

  that.setLognormalParameters = function(settings) {
    myLognormalMean = Number(settings.mean);
    myLognormalStandardDeviation = Number(settings.standardDeviation);
  };

  that.setNormalParameters = function(normalSettings) {
   
   
   var settings = {mean:Number(normalSettings.mean),
                     standardDeviation:Number(normalSettings.standardDeviation)};
                     
   var lognormalSettings = getLogNormalMeanAndStandardDeviationFromNormalMeanAndStandardDeviation(settings);
   
   myLognormalMean = lognormalSettings.mean;
   myLognormalStandardDeviation = lognormalSettings.standardDeviation;
   
  };

  that.getCurrentSettings = function() {
      return that.getSettingsForLogNormal();
      };    

  that.getSettingsForLogNormal = function() {
    var settings = {mean:myLognormalMean,
                      standardDeviation:myLognormalStandardDeviation};
   
    return settings; 
  }
  
  that.getSettingsForNormal = function() {
      var settings = {mean:myLognormalMean,
                      standardDeviation:myLognormalStandardDeviation};
                      
      var settingsNormal = 
        getNormalMeanAndStandardDeviationFromLognormalMeanAndStandardDeviation(settings);
      
      return settingsNormal;
  };
  
  
  //for now, using http://en.wikipedia.org/wiki/Log-normal_distribution
  var getNormalMeanAndStandardDeviationFromLognormalMeanAndStandardDeviation
        = function(lognormalSettings) {
          
          var m = lognormalSettings.mean;
          var sd = lognormalSettings.standardDeviation;
          
          var msquared = m*m;
          var variance = sd*sd;
          
          var mu = Math.log( msquared/Math.sqrt(variance+msquared));
          var sigma = Math.sqrt(Math.log(1 + variance/msquared));
          
          return {  mean:mu,
                    standardDeviation:sigma};          
          
        };
        
  var getLogNormalMeanAndStandardDeviationFromNormalMeanAndStandardDeviation
        = function(normalSettings) {
          
          var mu = normalSettings.mean;
          var sigma = normalSettings.standardDeviation;  

          var variance = sigma*sigma;
                    
          var meanLognormal = Math.exp(mu + 0.5*variance);
          var varianceLognormal = (Math.exp(variance) - 1) * Math.exp(2*mu + variance);
          
          var standardDeviationLognormal = Math.sqrt(varianceLognormal);
          
          return {  mean:meanLognormal,
                    standardDeviation:standardDeviationLognormal};          
          
   };
        
  that.getPdf = function(x) {    
    return jstat.dlnorm(x,lognormalMean,lognormalStandardDeviation); 
  };
  
  that.getPdfOfUnderlyingNormal = function(x) {
   
   var normalSettings = getNormalMeanAndStandardDeviationFromLognormalMeanAndStandardDeviation(
                          {mean:lognormalMean, standardDeviation:lognormalStandardDeviation});
    
    

    return jstat.dnorm(x,normalSettings.mean,normalSettings.StandardDeviation); 
    
  };

  
};


var currentlySelectedInput = null;
var that = {};

var isUndefined = function(x) {
  return (typeof x === "undefined");
};
var isDefined = function(x) {
  return !isUndefined(x);
};

var isDefinedAndNotNull = function(x) {
  return (isDefined(x) && (x!==null));
};

  var formatNumberForDisplay = function(theNumber) {
      if (Math.abs(theNumber) < 0.001) {        
        return theNumber.toExponential(3);
      }
      else if (Math.abs(theNumber) < 1000) {
        return theNumber.toFixed(2);        
      }
      else {
        return theNumber.toExponential(3);
      }
  };

  


var loadSettingsIntoInputs = function(logNormalHelper) {

//what is "best" formatting for the number?
//use commas?

  var lognormalSettings = logNormalHelper.getSettingsForLogNormal();
  var normalSettings = logNormalHelper.getSettingsForNormal();


  var median =  myLognormalHelper.getPercentilesNormalAndLognormal(0.5);
  var mode =  myLognormalHelper.getModeLognormal();
  var upper95th =  myLognormalHelper.getPercentilesNormalAndLognormal(0.95);
  var upper99th =  myLognormalHelper.getPercentilesNormalAndLognormal(0.99);

  //onsole.log(lognormalSettings.mean + ", " + lognormalSettings.standardDeviation + ", " + upper95th.lognormal);


  //formatNumberForDisplay(
  $('#lognormal_mean').val(lognormalSettings.mean.toExponential(2));
  $('#lognormal_sigma').val(lognormalSettings.standardDeviation.toExponential(2));
  $('#lognormal_median').html(median.lognormal.toExponential(2));
  $('#lognormal_mode').html(mode.toExponential(2));
  $('#lognormal_upper95th').html(upper95th.lognormal.toExponential(2));
  $('#lognormal_upper99th').html(upper99th.lognormal.toExponential(2));

  $('#normal_mean').val(normalSettings.mean.toFixed(2));
  $('#normal_sigma').val(normalSettings.standardDeviation.toFixed(2));
  $('#normal_median').html(median.normal.toFixed(2));
  $('#normal_upper95th').html(upper95th.normal.toFixed(2));
  $('#normal_upper99th').html(upper99th.normal.toFixed(2));


};

//Don't need this...
// var loadInputsIntoSettings = function(settings) {

//   settings.lognormalMean = $('#lognormal_mean').val();
//   settings.lognormalSigma = $('#lognormal_sigma').val();

//   settings.normalMean = $('#normal_mean').val();
//   settings.normalSigma = $('#normal_sigma').val();

// };


var currentResize = 0;
var onResizeDivs = function() {

  currentResize++;
  //console.log("Resize start " + currentResize);

  var windowHeight = $(window).height();
  var topBarTop = $("#topBar").offset().top;
  var topBarBottom = topBarTop + $("#topBar").height();
  
  $('#bottomPart').css("top", topBarBottom + 0); //10); //windowHeight - topBarBottom - 10);
  $('#aboutDetails').css('top', topBarBottom);

  if (isDefined(graphUpdater)) {
    var fixTicks = false;
    graphUpdater.doUpdate(myLognormalHelper,fixTicks);
  }

  //console.log("Resize end " + currentResize);
  
};
window.onresize = onResizeDivs;


var showAbout = function() {
  //$('#aboutDetails').center();
  $('#aboutDetails').fadeIn(600);
};
var hideAbout = function() {
  $('#aboutDetails').fadeOut(1100);
};

$(document).ready(function() {


/*
  debounce was TOO delayed and height wasn't updated right or something
  I could be doing something wrong
  //https://gist.github.com/Pushplaybang/3341936
  //this is like 4 years old I think from Paul Irish, but will try for now
  (function($,sr){
   
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
        var timeout;
   
        return function debounced () {
            var obj = this, args = arguments;
            function delayed () {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null; 
            };
   
            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);
   
            timeout = setTimeout(delayed, threshold || 100); 
        };
    }
      // smartresize 
      jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };
   
  })(jQuery,'smartresize');
   
  // usage:
  $(window).smartresize(function(){  
    // code that takes it easy...
    onResizeDivs();
  });  
  //https://gist.github.com/Pushplaybang/3341936
*/

  //$(document).tooltip();
  if (!isMobile()) {
    $(function () {
        $(document).tooltip({
            content: function () {
                return $(this).prop('title');
            }
        });
    });
  }


  var sDragLeft = "<div class='instruction'>Drag this left or right to change its value</div>";
  var sDragUpDown = "<div class='instruction'>Drag your mouse up or down to change the value</div>";
  var s;
  
  s= sDragLeft;
  s += "This is the <span class='instructionterm'>lower 95th percentile</span> of the lognormal distribution:95% of the 'weight' of the density function is ABOVE this value.";
  s += " It is equal to "; //<div class='tipequation'>exp(lower 95th percentile of underlying normal distribution)</div>";
  //s += " and so it is equal to ";
  s += "<div class='tipequation'>exp(&mu;<sub>N</sub> + z<sub>0.05</sub> &sigma;<sub>N</sub>)</div>";
  s += " where &mu;<sub>N</sub> is the mean and";
  s += " &sigma;<sub>N</sub> is the standard deviation of the underlying normal distribution (which is shown below), ";
  s += "and z<sub>0.05</sub> is the 5th percentile of the standard normal distribution (which itself is about -1.64)."
  
   $('#lognormalCurveCurrentLower95th').attr("title",s);

  s= sDragLeft;
  s += "This is the <span class='instructionterm'>lower 95th percentile</span> of the normal distribution:95% of the 'weight' of the density function is ABOVE this value.";
  s += " It is equal to "; 
  s += "<div class='tipequation'>&mu;<sub>N</sub> + z<sub>0.05</sub> &sigma;<sub>N</sub></div>";
  s += " where &mu;<sub>N</sub> is the mean and";
  s += " &sigma;<sub>N</sub> is the standard deviation of the normal distribution, ";
  s += "and z<sub>0.05</sub> is the 5th percentile of the standard normal distribution (which itself is about -1.64)."
   $('#normalCurveCurrentLower95th').attr("title",s);


  

  s= sDragLeft;
  s += "This is the <span class='instructionterm'>upper 95th percentile</span> of the lognormal distribution:95% of the 'weight' of the density function is BELOW this value.";
  s += " It is equal to "; 
  s += "<div class='tipequation'>exp(&mu;<sub>N</sub> + z<sub>0.95</sub> &sigma;<sub>N</sub>)</div>";
  s += " where &mu;<sub>N</sub> is the mean and";
  s += " &sigma;<sub>N</sub> is the standard deviation of the underlying normal distribution (which is shown below), ";
  s += "and z<sub>0.95</sub> is the upper 95th percentile of the standard normal distribution (which itself is about 1.64)."
  
   $('#lognormalCurveCurrentUpper95th').attr("title",s);

  s= sDragLeft;
  s += "This is the <span class='instructionterm'>upper 95th percentile</span> of the normal distribution:95% of the 'weight' of the density function is BELOW this value.";
  s += " It is equal to "; 
  s += "<div class='tipequation'>&mu;<sub>N</sub> + z<sub>0.95</sub> &sigma;<sub>N</sub></div>";
  s += " where &mu;<sub>N</sub> is the mean and";
  s += " &sigma;<sub>N</sub> is the standard deviation of the normal distribution, ";
  s += "and z<sub>0.95</sub> is the upper 95th percentile of the standard normal distribution (which itself is about 1.64)."

   $('#normalCurveCurrentUpper95th').attr("title",s);

    
  s = sDragLeft;
  s += "The <span class='instructionterm'>mode</span> is the largest value for the density function.  ";
  s += "There can be more than one in general, but there is only one for the lognormal and normal pdfs.";
  s += "The lognormal mode is equal to ";
  s += "<div class='tipequation'>exp(&mu;<sub>N</sub> - &sigma;<sub>N</sub><sup>2</sup>)</div>";
  s += "where &mu;<sub>N</sub> is the mean, and ";
  s += "&sigma;<sub>N</sub> the standard deviation of the underlying normal distribution (which is shown below).";
  $('#lognormalCurveCurrentMode').attr("title",s);
  
  s = sDragLeft;
  s += "The <span class='instructionterm'>median</span> is the 'middle' of the density function: half of the values are above, and half of the values are below this value.  ";
  s += "The lognormal median is equal to ";
  s += "<div class='tipequation'>exp(&mu;<sub>N</sub>)</div>";
  s += "where &mu;<sub>N</sub> is the mean ";
  s += "of the underlying normal distribution (which is shown below).";
  s += "If the  median is equal to the mean, then a distribution is called symmetric.  ";
  s += "The lognormal distribution is not symmetric (its median is always less than its mean), but the normal distribution is symmetric.";
  $('#lognormalCurveCurrentMedian').attr("title",s);

  //s = sDragLeft;
  s="";
  s += "The <span class='instructionterm'>mean</span> is the 'average' value for the density function.  ";
  s += "It's a measure of central tendency, but not always in the middle.";
  s += "The lognormal mean is equal to ";
  s += "<div class='tipequation'>exp(&mu;<sub>N</sub> + 0.5 &sigma;<sub>N</sub><sup>2</sup>)</div>";
  s += "where &mu;<sub>N</sub> is the mean, and ";
  s += "&sigma;<sub>N</sub> the standard deviation of the underlying normal distribution (which is shown below).";
  $('#lognormalCurveCurrentMean').attr("title",sDragLeft + s);

  $('#lognormal_mean').attr("title",sDragUpDown + s);

  s="";
  s += "The <span class='instructionterm'>mean</span> is the 'average' value for the density function.  ";
  s += "It's a measure of central tendency, but not always in the middle.  For a normal distribution, it IS in the middle, ";
  s += "and in fact the median and mode of a normal distribution are equal to its mean, which is why there are not separate controls for them here.";
  $('#normalCurveCurrentMean').attr("title",sDragLeft + s);
  $('#normal_mean').attr("title",sDragUpDown + s);


  s="";
  s += "The <span class='instructionterm'>standard deviation</span> is a measure of the 'spread' of the density function.  ";
  s += "It is always a non-negative number. "
  s += "The larger it is, the more 'spread out' the density function will appear; ";
  s += "the smaller it is, the more narrow the density function will be (and focused about its mean). ";
  s += "The lognormal standard deviation is equal to ";
  s += "<div class='tipequation'>(exp(&sigma;<sub>N</sub><sup>2</sup>) - 1) *  exp(2&mu;<sub>N</sub> + &sigma;<sub>N</sub><sup>2</sup>)</div>";
  s += "where &mu;<sub>N</sub> is the mean, and ";
  s += "&sigma;<sub>N</sub> the standard deviation of the underlying normal distribution (which is shown below).";
  $('#lognormal_sigma').attr("title",sDragUpDown + s);


  s="";
  s += "The <span class='instructionterm'>standard deviation</span> is a measure of the 'spread' of the density function.  ";
  s += "It is always a non-negative number. "
  s += "The larger it is, the more 'spread out' the density function will appear; ";
  s += "the smaller it is, the more narrow the density function will be (and focused about its mean). ";
  $('#normal_sigma').attr("title",sDragUpDown + s);

  s = "This (perhaps a bit intimidating) thing is the probability density function for the lognormal distribution. ";
  s += "<span class='instructionterm'>x</span> corresponds to the x-axis shown here.";
  s += "The probability that a sample from a random distribution is in a certain range is calculated by integrating this function over the range ";
  s += "(see the wikipedia article on 'probability density function' for more information). ";
  s += "Intuitively, where the curve is larger, there is a higher likelihood of randomly 'picking' the associated value. ";
  s += "The density function for the lognormal distribution is determined from that of the underlying normal distribution, which is why they look so similar.";
  //s += " Intuitively, where the curve is larger, there is a higher likelihood of randomly 'picking' the associated value ";
  $('#pdf_lognormal').attr("title",s);
  
//   s="";
//   s += "The <span class='instructionterm'>standard deviation</span> is a measure of the 'spread' of the density function.  ";
//   s += "There is a straightford formula for the standard deviation of the lognormal distribution in terms of  ";
//   s += "the mean and the standard deviation of the underlying normal distribution, ";
//   s += "but it was considered a little too complicated to include in this tooltip.";
//   $('#lognormal_sigma').attr("title",sDragUpDown + s);

  s = "This is the probability density function for the normal distribution. ";
  s += "<span class='instructionterm'>x</span> corresponds to the x-axis shown here.";
  s += "The probability that a sample from a random distribution is in a certain range is calculated by integrating this function over the range ";
  s += "(see the wikipedia article on 'probability density function' for more information). ";
  s += "Intuitively, where the curve is larger, there is a higher likelihood of randomly 'picking' the associated value. ";
  //s += "The density function for the lognormal distribution is determined from that of the underlying normal distribution, which is why they look so similar.";
  //s += " Intuitively, where the curve is larger, there is a higher likelihood of randomly 'picking' the associated value ";
  $('#pdf_normal').attr("title",s);



    var divBeingDragged = null;


  $("#lnkShowAbout").click(function() {
    showAbout();
  });
  $('#closeAbout').click(function() {
    hideAbout();
  });

//   window.addEventListener('load', function() {
//     new FastClick(document.body);
//   }, false);

  $(function() {
      FastClick.attach(document.body);
  });

  $('#btnResetToDefaults').button().click(function(event) {
    justResetValues();
    event.preventDefault();
  });
  
  $('#btnRescaleLognormalToFitData').button().click(function(event) {
    rescaleToFit();
    event.preventDefault();
  });
  

  // $(".positive-number").numeric({
    // decimal : true,
    // negative : false,
     // initialParse: false 
  // }, function() {
    // //alert("Positive values only");
    // //this.value = "";
    // $(this).focus();
  // });




 //normal mean and sigma are calculated from these...
 var defaults = {
                    mean:5,
                    standardDeviation:2,
                    };
    //var initialRefX = 20;


  myLognormalHelper = new LognormalHelper(defaults);
  
  var lognormalHelperTests = new LognormalHelperTests();
  //doh - not in release lognormalHelperTests.runTests();


//  var currentSettings = jQuery.extend(true,{}, defaults);

    var justResetValues = function() {  
        //currentSettings = jQuery.extend(true,{}, defaults);          
        myLognormalHelper = new LognormalHelper(defaults);
        loadSettingsIntoInputs(myLognormalHelper);          
        graphUpdater.doUpdate(myLognormalHelper, false, true); //reorganize things!
     };
    //Learned: when moving the bars with the mouse, it's probably best to 
    //        NOT rescale the tick marks ever, as it can mess up where things are
    //        relative to the mouseline.  
    //        So... DO change scale when they enter/drag in one of the boxes, but
    //        not when they move the lines, and provide a way to reset the 
    //        view to contain the entire curve.
    
     var rescaleToFit = function() {
        graphUpdater.doUpdate(myLognormalHelper, false);
     };


  var getValueForInputFromSettings = function(thisId) {

    var current;
    if (thisId==="lognormal_mean") {
        current = myLognormalHelper.getSettingsForLogNormal();        
        return current.mean;
      }
     else if (thisId==="lognormal_sigma") {
        current = myLognormalHelper.getSettingsForLogNormal();        
        return current.standardDeviation;
      }
      else if (thisId==="normal_mean") {
        current = myLognormalHelper.getSettingsForNormal();        
        return current.mean;
      }
      else if (thisId==="normal_sigma") {
        current = myLognormalHelper.getSettingsForNormal();        
        return current.standardDeviation;
      }
  };
  
  //called when one of the inputs has had its value changed and we need to update things
  var loadValueForInput = function(thisId, theValue, fixTicks) {
    
    if (isUndefined(fixTicks)) {
      fixTicks = false;
    }
    
    var current;
    var settings;
    if (thisId==="lognormal_mean") {
        current = myLognormalHelper.getSettingsForLogNormal();        
        if (theValue !== current.mean) {
          settings = {mean:theValue,standardDeviation:current.standardDeviation };
          myLognormalHelper.setLognormalParameters(settings);        
          loadSettingsIntoInputs(myLognormalHelper);
          graphUpdater.doUpdate(myLognormalHelper, fixTicks); //reorganize things!

        }
      }
      else if (thisId==="lognormal_sigma") {
        current = myLognormalHelper.getSettingsForLogNormal();        
        if (theValue !== current.standardDeviation) {
          settings = {mean:current.mean,standardDeviation:theValue};
          myLognormalHelper.setLognormalParameters(settings);        
          loadSettingsIntoInputs(myLognormalHelper);
          graphUpdater.doUpdate(myLognormalHelper, fixTicks); //reorganize things!
        }
      }
      else if (thisId==="normal_mean") {
        current = myLognormalHelper.getSettingsForNormal();        
        if (theValue !== current.mean) {
          settings = {mean:theValue,standardDeviation:current.standardDeviation };
          myLognormalHelper.setNormalParameters(settings);        
          loadSettingsIntoInputs(myLognormalHelper);
          graphUpdater.doUpdate(myLognormalHelper, fixTicks); //reorganize things!
        }
      }
      else if (thisId==="normal_sigma") {
        current = myLognormalHelper.getSettingsForNormal();        
        if (theValue !== current.standardDeviation) {
          settings = {mean:current.mean,standardDeviation:theValue};
          myLognormalHelper.setNormalParameters(settings);        
          loadSettingsIntoInputs(myLognormalHelper);
          graphUpdater.doUpdate(myLognormalHelper, fixTicks); //reorganize things!
        }
      }
    
  };


  $('input').keypress(function(event) {
    //console.log("key down");
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
      
      
      var theVal = $(this).val();
      var thisId = $(this).attr("id");
      
      //console.log(theVal + ", " + thisId);
      
      //var userEnteredValue = true;
      loadValueForInput(thisId, theVal); //,userEnteredValue);

      event.preventDefault();
      //which one is this?      
      //loadInputsIntoSettings(currentSettings);
      //updateBasedOnCurrentSettings(currentSettings);
    }
  });

  $('input.inputNumber').mousedown(function(event) {
    //console.log("mouse down");
    currentlySelectedInput = $(this);
    lastMouseX = event.pageX;
    lastMouseY = event.pageY;
    
     if (!isMobile()) {
      $(document).tooltip('disable');
     }
     
  });

  $('body').on("mouseup touchend", function() {
    
    if (isDefinedAndNotNull(currentlySelectedInput)) {
        if (!currentlySelectedInput.is(":focus")) {
              //too general to do this here... highlightVariable(currentlySelectedInput.attr("variable"),"remove");
        }
    }

    //reenable tooltips
    if (!isMobile()) {
          $(document).tooltip('enable');
    }

    currentlySelectedInput = null;
    if (isDefinedAndNotNull(divBeingDragged)) {
      divBeingDragged.removeClass("divDisplayActive");
      
      //it can still think it's hovering even if it's not if (!divBeingDragged.is(":hover")) {
        highlightVariable(divBeingDragged.attr("variable"),"remove");
      //}
      
      divBeingDragged = null;
      
    }
  });

 var unselectIt = function() {
      d3.selectAll(".actualProbabilityLine").classed("lineActive",false); 
      that.currentLineSelected = null;
  }
  
  var showCurveMessage = function(which, sMessage) {
    
    $('#' + which + 'CurveMessage').stop().html(sMessage).stop().fadeIn(100,function() {
      $(this).delay(5000).fadeOut(function() {
                hideCurveMessage(which);
      });
    });
    
  };
  
  var hideLognormalCurveMessage = function() {
    hideCurveMessage("lognormal");
  };
  
  var hideCurveMessage = function(which) {
    
    if ( $('#' + which + 'CurveMessage').is(":visible")) {
      $('#' + which + 'CurveMessage').fadeOut();
    }
    
  };

//{selector:elementSelector, 
//                                            prefix:prefix, 
//                                            cssConfig:cssConfig, 
//                                            sValue:sValue, 
//                                            centerAbove:centerAbove
                                            
  var updateCurrentValueOnChart = function(config) {


          $(config.elementSelector).attr("actualValue", config.actualValue);

          if (isDefined(config.centerAbove) && (config.centerAbove===true)) {
            
            $(config.elementSelector).html(config.prefix + wrapInNoTranslate(config.sValue));
          
            config.cssConfig.top = config.cssConfig.top - $(config.elementSelector).outerHeight() - 2;
            config.cssConfig.left = config.cssConfig.left - $(config.elementSelector).outerWidth()/2 - 2;
            $(config.elementSelector).css(config.cssConfig);
          
          }
          else if (isDefined(config.putOnLeftOfLine) && (config.putOnLeftOfLine===true)) {
            
            $(config.elementSelector).html(config.prefix + wrapInNoTranslate(config.sValue));
          
            //config.cssConfig.top = config.cssConfig.top - $(config.elementSelector).outerHeight() - 2;
            config.cssConfig.left = config.cssConfig.left - ($(config.elementSelector).outerWidth());
            $(config.elementSelector).css(config.cssConfig);
                        
          }
          else {
          $(config.elementSelector).css(config.cssConfig)
                              .html(config.prefix + wrapInNoTranslate(config.sValue));
          }                    
    
  };
  
//   var updateCurrentLognormalMean = function(cssConfig, dValue) {      
//       updateCurrentValueOnChart({elementSelector:"#lognormalCurveCurrentMean",
//                                   prefix:"Mean &mu;<sub>L</sub>: ",
//                                   cssConfig:cssConfig, 
//                                   actualValue:dValue,
//                                   sValue:formatNumberForDisplay(dValue)});
//   };
  var updateCurrentMean = function(which, cssConfig, dValue) {  
      var sub = "L";
      if (which==="normal") {
        sub = "N";
      }
      
      updateCurrentValueOnChart({elementSelector:"#" + which + "CurveCurrentMean",
                                  prefix:getText("Mean") + wrapInNoTranslate(" &mu;<sub>" + sub + "</sub>: "),
                                  cssConfig:cssConfig, 
                                  actualValue:dValue,
                                  sValue:formatNumberForDisplay(dValue)});
                                  
  };

//   var updateCurrentLognormalMode = function(cssConfig, dValue) {
//       var centerAbove = true;
//       updateCurrentValueOnChart({elementSelector:"#lognormalCurveCurrentMode",
//                                  prefix: "Mode: ",
//                                   cssConfig: cssConfig, 
//                                   actualValue:dValue,
//                                   sValue:formatNumberForDisplay(dValue),
//                                   centerAbove: centerAbove});
//   };

  var updateCurrentMode = function(which, cssConfig, dValue) {
      var centerAbove = true;
      updateCurrentValueOnChart({elementSelector:"#" + which + "CurveCurrentMode",
                                 prefix: getText("Mode") + wrapInNoTranslate(": ")  ,
                                  cssConfig: cssConfig, 
                                  actualValue:dValue,
                                  sValue:formatNumberForDisplay(dValue),
                                  centerAbove: centerAbove});
  };
  
//   var updateCurrentLognormalUpper95th = function(cssConfig, dValue) {

//       updateCurrentValueOnChart({elementSelector: "#lognormalCurveCurrentUpper95th",
//                                  prefix: "Upper 95th: ",
//                                  cssConfig:cssConfig, 
//                                  actualValue:dValue,
//                                   sValue:formatNumberForDisplay(dValue)});
//   };

  var updateCurrentUpper95th = function(which, cssConfig, dValue) {

      updateCurrentValueOnChart({elementSelector: "#" + which + "CurveCurrentUpper95th",
                                 prefix: getText("Upper95th") + wrapInNoTranslate(": "),
                                 cssConfig:cssConfig, 
                                 actualValue:dValue,
                                  sValue:formatNumberForDisplay(dValue)});
  };


  var updateCurrentLower95th = function(which, cssConfig, dValue) {

      updateCurrentValueOnChart({elementSelector: "#" + which + "CurveCurrentLower95th",
                                 prefix: getText("Lower95th") + wrapInNoTranslate(": "),
                                 cssConfig:cssConfig, 
                                 actualValue:dValue,
                                  sValue:formatNumberForDisplay(dValue),
                                 putOnLeftOfLine:true});
  };
  
//   var updateCurrentLognormalMedian = function(cssConfig, dValue) {
//       updateCurrentValueOnChart({elementSelector: "#lognormalCurveCurrentMedian",
//                                  prefix: "Median: ",
//                                  cssConfig: cssConfig, 
//                                  actualValue:dValue,
//                                   sValue:formatNumberForDisplay(dValue),
//                                  putOnLeftOfLine:true});
//   };
  
  var updateCurrentMedian = function(which, cssConfig, dValue) {
      updateCurrentValueOnChart({elementSelector: "#" + which + "CurveCurrentMedian",
                                 prefix: getText("Median") + wrapInNoTranslate(": "),
                                 cssConfig: cssConfig, 
                                 actualValue:dValue,
                                  sValue:formatNumberForDisplay(dValue),
                                 putOnLeftOfLine:true});
  };
  
  

//     var highlightNormalSigma = function() {
//       highlightVariable("sigmaN_","add");
//     };
//     var unhighlightNormalSigma = function() {
//       highlightVariable("sigmaN_","remove");
//     };
//     var highlightNormalMean = function() {
//       highlightVariable("meanN_","add");
//     };
//     var unhighlightNormalMean = function() {
//       highlightVariable("meanN_","remove");
//     };
    
    var highlightVariable = function(whichVariable,addOrRemove) {

      ["1","2","3","4"].forEach(function(s) {
        $("#" + whichVariable + s)[addOrRemove + "Class"]("highlightedVariable");
        
        //console.log($("#" + whichVariable + s).html());
        
      });
    }      
      

  
  var setUpSVG = function(theLognormalHelper) {
    
    var dragStart = function(d) {
      var what = d3.select(this);
      
//       $('.ui-tooltip').fadeOut();
//       $(document).tooltip('disable');
      
      //console.dir(what);
      //console.log(d3.event.dx + " " + d3.event.dy);
    };
    var dragEnd = function(d) {
      var what = d3.select(this);
//       if (!isMobile()) {
//             $(document).tooltip('enable');
//       }
      //console.dir(what);
      //console.log(d3.event.dx + " " + d3.event.dy);
    };
    var dragMove = function(d) {
      var what = d3.select(this);
      //console.dir(what);
      //console.log(d3.event.dx + " " + d3.event.dy);      
      //this works
      
      var divBeingDragged = what; //d3.select(this)[0];
      var whichOne = divBeingDragged.attr("id");
      var which = divBeingDragged.attr("which");
      
      var currentX = Number(divBeingDragged.attr("actualValue"));
      //this seems to work... weird...
      //var newX = x[which].invert(x[which](currentX) + (thisMouseX - lastDivX));
      var newX = x[which].invert(x[which](currentX) + (d3.event.dx));

      //update based on which one it is... in some cases, we can't let them do it
      var fixTicks = true;
      if (whichOne==="normalCurveCurrentMean") {
        
        
        var normalSettings = myLognormalHelper.getSettingsForNormal();                          
        normalSettings.mean = newX;
        myLognormalHelper.setNormalParameters(normalSettings);
        loadSettingsIntoInputs(myLognormalHelper);
        graphUpdater.doUpdate(myLognormalHelper, fixTicks); //reorganize things!        
        
      }
      else if (whichOne==="normalCurveCurrentUpper95th") {
        
          var percentile_p = 0.95;
          var percentile_value = newX;
          var keepNormalMeanFixedElseSigma = true;                          
          var upper95th =  myLognormalHelper.getPercentilesNormalAndLognormal(percentile_p);
          var valueToHit_NormalSpace = percentile_value;
          //check to see if it is possible to hit it in this case
          var normalSettings = myLognormalHelper.getSettingsForNormal();                          

          if (valueToHit_NormalSpace - normalSettings.mean <= 0) {                            
               //we can't hit it - flash the message
              showCurveMessage(which, "In this case, you cannot set the upper 95th percentile lower than its current value of " + 
                                          formatNumberForDisplay(upper95th.normal) + ".");
          }
          else {
              hideCurveMessage(which); 
              myLognormalHelper.setParametersForToHitNormalPercentile(
                            percentile_p, 
                            percentile_value, 
                            keepNormalMeanFixedElseSigma) ;
                            
              loadSettingsIntoInputs(myLognormalHelper);
              graphUpdater.doUpdate(myLognormalHelper, fixTicks); //reorganize things!        
          }                
      }
      else if (whichOne==="normalCurveCurrentLower95th") {
        
          var percentile_p = 0.05;
          var percentile_value = newX;
          var keepNormalMeanFixedElseSigma = true;                          
          var upper95th =  myLognormalHelper.getPercentilesNormalAndLognormal(percentile_p);
          var valueToHit_NormalSpace = percentile_value;
          //check to see if it is possible to hit it in this case
          var normalSettings = myLognormalHelper.getSettingsForNormal();                          

          if (valueToHit_NormalSpace - normalSettings.mean >= 0) {                            
               //we can't hit it - flash the message
              showCurveMessage(which, "In this case, you cannot set the lower 95th percentile larger than its current value of " + 
                                          formatNumberForDisplay(upper95th.normal) + ".");
          }
          else {
              hideCurveMessage(which); 
              myLognormalHelper.setParametersForToHitNormalPercentile(
                            percentile_p, 
                            percentile_value, 
                            keepNormalMeanFixedElseSigma) ;
                            
              loadSettingsIntoInputs(myLognormalHelper);
              graphUpdater.doUpdate(myLognormalHelper, fixTicks); //reorganize things!        
          }                
      }
      else if (whichOne==="lognormalCurveCurrentMedian") {
        var normalSettings = myLognormalHelper.getSettingsForNormal();                          
        //we just want exp(mu) = value, so there is normalSettings
        // "fix mu or fix sigma"
        //so we set mu = log(value)
        normalSettings.mean = Math.log(newX);
        myLognormalHelper.setNormalParameters(normalSettings);
        loadSettingsIntoInputs(myLognormalHelper);
        graphUpdater.doUpdate(myLognormalHelper, fixTicks); //reorganize things!
       }
      else if (whichOne==="lognormalCurveCurrentMode") {        
      
        //we want mu_L - s_L^2 = log(xValue)
        var keepNormalMeanFixedElseSigma = true;                          
        var valueToHit_NormalSpace = Math.log(newX);
        
        var normalSettings = myLognormalHelper.getSettingsForNormal();    
        
        if (valueToHit_NormalSpace > normalSettings.mean) {
           showCurveMessage("lognormal", "The mode of a lognormal distribution can never be larger than the mean.");          
        }
        else {
        
          //console.log(normalSettings.mean - valueToHit_NormalSpace);          
          var sigma = Math.sqrt(normalSettings.mean - valueToHit_NormalSpace);          
          normalSettings.standardDeviation = sigma;
          myLognormalHelper.setNormalParameters(normalSettings);
          loadSettingsIntoInputs(myLognormalHelper);
          graphUpdater.doUpdate(myLognormalHelper, fixTicks); //reorganize things!
          
        }
      }
      else if (whichOne==="lognormalCurveCurrentMean") {        
          loadValueForInput("lognormal_mean", newX, fixTicks);                           
      }
      else if (whichOne==="lognormalCurveCurrentUpper95th") {
        
          var percentile_p = 0.95;
          var percentile_value = newX;
          var keepNormalMeanFixedElseSigma = true;                          
          var upper95th =  myLognormalHelper.getPercentilesNormalAndLognormal(percentile_p);
          var valueToHit_NormalSpace = Math.log(percentile_value);
          //check to see if it is possible to hit it in this case
          var normalSettings = myLognormalHelper.getSettingsForNormal();                          

          if (valueToHit_NormalSpace - normalSettings.mean <= 0) {                            
               //we can't hit it - flash the message
              showCurveMessage("lognormal", "In this case, you cannot set the upper 95th percentile lower than its current value of " + 
                                          formatNumberForDisplay(upper95th.lognormal) + ".");
          }
          else {
              hideLognormalCurveMessage(); 
              myLognormalHelper.setParametersForToHitLognormalPercentile(
                            percentile_p, 
                            percentile_value, 
                            keepNormalMeanFixedElseSigma) ;
                            
              loadSettingsIntoInputs(myLognormalHelper);
              graphUpdater.doUpdate(myLognormalHelper, fixTicks); //reorganize things!        
          }        
      }
      else if (whichOne==="lognormalCurveCurrentLower95th") {
        
          var percentile_p = 0.05;
          var percentile_value = newX;
          var keepNormalMeanFixedElseSigma = true;                          
          var lower95th =  myLognormalHelper.getPercentilesNormalAndLognormal(percentile_p);
          var valueToHit_NormalSpace = Math.log(percentile_value);
          //check to see if it is possible to hit it in this case
          var normalSettings = myLognormalHelper.getSettingsForNormal();                          

          //this check is the opposite of when p=0;905 (>=0.5)
          if (valueToHit_NormalSpace - normalSettings.mean >= 0) {                            
               //we can't hit it - flash the message
              showCurveMessage("lognormal", "In this case, you cannot set the lower 95th percentile larger than its current value of " + 
                                          formatNumberForDisplay(lower95th.lognormal) + ".");
          }
          else {
              hideLognormalCurveMessage(); 
              myLognormalHelper.setParametersForToHitLognormalPercentile(
                            percentile_p, 
                            percentile_value, 
                            keepNormalMeanFixedElseSigma) ;
                            
              loadSettingsIntoInputs(myLognormalHelper);
              graphUpdater.doUpdate(myLognormalHelper, fixTicks); //reorganize things!        
          }        
      }
      
    };
    
    
    var drag = d3.behavior.drag()
                .on("drag",dragMove)
                .on("dragstart",dragStart)
                .on("dragend",dragEnd);
                
    
    d3.selectAll('.divDisplayOnCurve')
        .call(drag);
    
    var updateWidthAndHeight = function() {
      
      
//       console.log(window.screen.availWidth + ", " + window.screen.availHeight);
      
      w.lognormal = $('#lognormal_curve').width() - 20;
      h.lognormal = $('#lognormal_curve').height() - 20;  
      
      w.normal = $('#normal_curve').width() - 20;
      h.normal = $('#normal_curve').height() - 20;

      //console.log(h.lognormal + ", " + h.normal);

      ["lognormal","normal"].forEach(function(which) {
        //width is working great, it seems
        w[which] = $('#mainContent').width() - 20;
        //h[which] = $('#table_' + which).height() - 20;  
      });                


      //w.lognormal="2000";
      //h.lognormal="400";
      //w.normal=w.lognormal;
      //h.normal=h.lognormal;

    };
    
    var xAxis = {};
    xAxis.lognormal = d3.svg.axis();
    xAxis.normal = d3.svg.axis();
    
    var theD3XAxis = {}
    
    var Colors = {curve: "#5555FF",
              upper95th: "#F78A0C",
              lower95th: "#F78A0C",
              median:"#33DD44",
              mean:"#222222"};
    
//       ["1","2","3","4"].forEach(function(s) {
//         $("meanN_"+s).addClass("highlightedVariable");
//       });      
      
    
    
    var lognormalHelper = theLognormalHelper;
    var x_array = {lognormal:[], normal:[]};
    
    var vis = {};
    
    var w = {};
    var h = {};

    var g = {};
    var theCurve = {};
        var _data = {};
        var x = {};
        var y = {};
        var line = {};
        var theXRanges = {};
        //var theXAxis = {};
        //var theYAxis = {};
        
        //see about hooking into using all of the d3 axes functionality
        var theTickRange = {};
        //var theXTickLabels = {};
        //var theXTickMarks = {};
      
        var xForLine = {};
        var theYForLine = {};
        var lineForMean = {};
        var xForLine95th = {};
        var yFor95th = {};
        var xForLineLower95th = {};
        var yForLower95th = {};
        var xForMode = {};
        var xForLineMedian = {};
        var yForMedian = {};
        var whenMouseMovesOnPlotLine = {};
        var lineFunctionForPdfToCurve = {};
        var xForLineOnCurve={};
        var yForLineOnCurve={};
        var lineDataForPdfToCurve={};
        var svgLineForPdfToCurve={};        
        
//     w.lognormal = $('#lognormal_curve').width() - 20;
//     h.lognormal = $('#lognormal_curve').height() - 20;

//     w.normal = $('#normal_curve').width() - 20;
//     h.normal = $('#normal_curve').height() - 20;
    
    updateWidthAndHeight();
    
    var margin=25;

    var line_whenMouseMoves = {};
    var currentLineSelected = {};
    var lineForMean = {};
    var lineForLower95th = {};
    var lineForUpper95th = {};
    var lineForMedian = {};
    
    //set up event handlers for moving the divs - do it in here to have easier access to some of the
    //closure variables...
      $('body').mouseup(function() {
        currentlySelectedInput = null;
        if (isDefinedAndNotNull(divBeingDragged)) {
          divBeingDragged.removeClass("divDisplayActive");
          divBeingDragged = null;
        }
      });



    var getXTickRanges = function(minX, maxX) {

       return  {lognormal:d3.range(minX.lognormal, maxX.lognormal, (maxX.lognormal -minX.lognormal)),
                              normal:d3.range(minX.normal, maxX.normal, (maxX.normal - minX.normal))};

    };
    
    //this gets x-values for plotting the curves
    //the values depend on the properties of the distribution, chosen
    //  to try to make sure we get a nice representation of it.
    //There can still be extreme cases this doesn't handle well    
    var getXRangesForGraph = function(theLognormalHelper) {
            
      var lognormalSettings = theLognormalHelper.getSettingsForLogNormal();
      var normalSettings = theLognormalHelper.getSettingsForNormal();
      
      var lognormalMean = lognormalSettings.mean;
      var theMode = theLognormalHelper.getModeLognormal();

      var theModeNormal = normalSettings.mean; //mean=mode for normal distribution
      var normalMean = normalSettings.mean;
      
      var median = theLognormalHelper.getPercentilesNormalAndLognormal(0.5);
      
      var upper95th= theLognormalHelper.getPercentilesNormalAndLognormal(0.95);
      var upper99th= theLognormalHelper.getPercentilesNormalAndLognormal(0.99);

      var maxX = Math.max(lognormalMean,upper95th.lognormal);      
      maxX = Math.max(maxX,upper99th.lognormal);      

      var maxXNormal = Math.max(normalMean,upper95th.normal);      
      maxXNormal = Math.max(maxXNormal,upper99th.normal);      

      var xs = [];
      var xsNormal = [];
      
      var numberPoints = 100;
      //lognormal       
        var diff = (1.0/(numberPoints-1))* theMode;
        
        for ( var i =1; i < numberPoints; i++ ){
            xs.push( i*diff); 
        }

        //mode to median
        diff = (1.0/(numberPoints-1)) * (median.lognormal - theMode);
        for ( var i =1; i < numberPoints; i++ ){
            xs.push(theMode +  i*diff); 
        }
        
        //median to mean
        diff = (1.0/(numberPoints-1)) * (lognormalMean - median.lognormal);
        for ( var i =1; i < numberPoints; i++ ){
              xs.push(median.lognormal +  i*diff); 
         }
         
         //mean to 95th
        diff = (1.0/(numberPoints-1)) * (upper95th.lognormal - lognormalMean);
        for ( var i =1; i < numberPoints; i++ ){
            xs.push(lognormalMean + i*diff); 
        }
        //95th to max
        diff = (1.0/(numberPoints-1))* (maxX-upper95th.lognormal);
        for ( var i =1; i < numberPoints; i++ ){
            xs.push(upper95th.lognormal +  i*diff); 
        }


      //normal  - we should be symmetric about the mean - duh      
        var lower99th= theLognormalHelper.getPercentilesNormalAndLognormal(0.01);
        var lower95th= theLognormalHelper.getPercentilesNormalAndLognormal(0.05);

        var diffNormal = (1.0/(numberPoints-1))* (lower95th.normal - lower99th.normal);       
        for ( var i =1; i < numberPoints; i++ ){
            xsNormal.push(lower99th.normal + i*diffNormal);
        }

        diffNormal = (1.0/(numberPoints-1))* (normalMean - lower95th.normal);       
        for ( var i =1; i < numberPoints; i++ ){
            xsNormal.push(lower95th.normal + i*diffNormal);
        }

        diffNormal = (1.0/(numberPoints-1))* (upper95th.normal - normalMean);       
        for ( var i =1; i < numberPoints; i++ ){
            xsNormal.push(normalMean + i*diffNormal);
        }

        diff = (1.0/(numberPoints-1)) * (upper99th.normal - upper95th.normal);
        //diffNormal = (1.0/(numberPoints-1)) * (lognormalMean - theMode);
        for ( var i =1; i < numberPoints; i++ ){
            xsNormal.push(upper95th.normal +  i*diffNormal); 
        }
        //console.log(xsNormal[0]);
        return {lognormal:xs, normal:xsNormal};
      
    };
    
    
    //fixTicks controls whether we update the x-axis or not
    //I do this so that when you are moving the upper95th is doesn'this
    //get all wacky when you update because of the scale changing
    //This didn't seem to be necessary when moving the mean
    
    
    
    var update = function(theLognormalHelper, fixTicks) { //, forceNoFixTicks) {
      
      //fixTicks = true;
      //if (isUndefined(forceNoFixTicks)) {
      //  forceNoFixTicks = false;
      //}
      //else if (forceNoFixTicks) {
      //  
      //  fixTicks = false;
      //  
      //}
      
//       w.lognormal = $('#lognormal_curve').width();
//       h.lognormal = $('#lognormal_curve').height();
  
//       w.normal = $('#normal_curve').width();
//       h.normal = $('#normal_curve').height();
      
      updateWidthAndHeight();
      
      //update svg height/width
      ["lognormal","normal"].forEach(function(which) {
        vis[which].attr("width", w[which])
                    .attr("height", h[which]);
      });                

      
      //console.log(w.lognormal + ", " + h.lognormal);
      
      //["lognormal", "normal"].forEach(function(which) {
          //onsole.log(which + ": " + $("#maincurve_" + which).width());
          //onsole.log(which + ": " + $("#maincurve_" + which).height());
          //onsole.log(which + ": " + $("#maincurve_" + which).attr("width"));
          //onsole.log(which + ": " + $("#maincurve_" + which).attr("height"));
          //bfl testing viewbox stuff 12-21-2013 $("#maincurve_" + which).attr("width", w[which]);
          //bfl testing viewbox stuff 12-21-2013$("#maincurve_" + which).attr("height", h[which]);
      //});
      
       var minX;
       var maxX;

       var normalSettings = theLognormalHelper.getSettingsForNormal();
       var upper95thBoth = theLognormalHelper.getPercentilesNormalAndLognormal(0.95);
       var lower95thBoth = theLognormalHelper.getPercentilesNormalAndLognormal(0.05);

        var xForMean = {lognormal:theLognormalHelper.getMeanLognormal(), normal:normalSettings.mean};
        var xForMode = {lognormal:theLognormalHelper.getModeLognormal(), normal:normalSettings.mean};
        var xForLine95th = {lognormal:upper95thBoth.lognormal, normal:upper95thBoth.normal};
        var xForLineLower95th = {lognormal:lower95thBoth.lognormal, normal:lower95thBoth.normal};
        var xForLineMedian = {lognormal:theLognormalHelper.getPercentilesNormalAndLognormal(0.5).lognormal, normal:normalSettings.mean};

      //for now, never fixTicks for normal...
      if (isUndefined(fixTicks)) {
        fixTicks = false;
      }
        var lognormalHelper = theLognormalHelper;
        var theMax = -1;
        
        var theXRanges = getXRangesForGraph(lognormalHelper);
        
        var currentMaxX = {lognormal:x_array.lognormal.last(), normal:x_array.normal.last()};
        var xMaxBasedOnLatestValues = {lognormal: theXRanges.lognormal.last(),
                                        normal: theXRanges.normal.last()};

        var currentMinX = {lognormal:x_array.lognormal[0], normal:x_array.normal[0]};

        //we need to get new values, just not change the x axis min/max or tick marks...
        
        var maxY = {lognormal:-1, normal:-1};        
        var minX = {};
        var maxX = {};
        
        if (!fixTicks) {
          
          x_array.lognormal = theXRanges.lognormal;
          minX.lognormal = x_array.lognormal[0];
          maxX.lognormal = x_array.lognormal.last();
          
          x.lognormal = d3.scale.linear().domain([minX.lognormal, maxX.lognormal]).range([0 + margin, w.lognormal - margin]);

          _data.lognormal = x_array.lognormal.map(function(x) {
                  var y = lognormalHelper.getPdfValue(x).lognormal; // jStat.beta.pdf(x,alpha,beta);
                  maxY.lognormal = Math.max(y,maxY.lognormal);
                  //return y;
                  return {x:x, y:y};
          });

            x_array.normal = theXRanges.normal;
            minX.normal = x_array.normal[0];
            maxX.normal = x_array.normal.last();
            
            x.normal = d3.scale.linear().domain([minX.normal, maxX.normal]).range([0 + margin, w.normal - margin]);

            _data.normal = x_array.normal.map(function(x) {
                    var y = lognormalHelper.getPdfValue(x).normal; // jStat.beta.pdf(x,alpha,beta);
                    maxY.normal = Math.max(y,maxY.normal);
                    //return y;
                    return {x:x, y:y};
            });
         }
         else {
           
           //make sure we stretch all the way to the current XMax
           var x_arrayNow = theXRanges.lognormal;
           
            minX.lognormal = x_arrayNow[0];
            maxX.lognormal = x_arrayNow.last(); //x_arrayNow.length-1];

            minX.normal = currentMinX.normal;
            maxX.normal = theXRanges.normal.last(); //x_arrayNow.length-1];

           
           var maxXNow = x_arrayNow.last(); //[x_arrayNow.length-1];
           if (maxXNow < currentMaxX.lognormal) {
              maxX.lognormal = currentMaxX.lognormal;
              //fill out the upper tail here...
              var numberPoints = 200;
              var diff = (currentMaxX.lognormal - x_arrayNow.last())/numberPoints;
              for (var i=1;i<=numberPoints;i++) {
                x_arrayNow.push(maxXNow + i*diff);
              }
           }
           
          _data.lognormal = x_arrayNow.map(function(x) {
                  var y = lognormalHelper.getPdfValue(x).lognormal; // jStat.beta.pdf(x,alpha,beta);
                  maxY.lognormal = Math.max(y,maxY.lognormal);
                  //return y;
                  return {x:x, y:y};
          }); //create data for lognormal curve

         _data.normal = x_array.normal.map(function(x) {
                var y = lognormalHelper.getPdfValue(x).normal; // jStat.beta.pdf(x,alpha,beta);
                maxY.normal = Math.max(y,maxY.normal);
                //return y;
                return {x:x, y:y};                      
          }); //create data for normal curve
         } //whether tick marks are fixed or not
         
          //minX = x_array[0];
          //maxX = x_array[x_array.length-1];
           

        y.normal = d3.scale.linear().domain([0, maxY.normal]).range([h.normal - margin,0 + margin ]);
        y.lognormal = d3.scale.linear().domain([0, maxY.lognormal]).range([h.lognormal - margin,0 + margin ]);
                
        var line = {lognormal: d3.svg.line()
                                .x(function(d, i) { return x.lognormal(d.x); })
                                .y(function(d, i) { return y.lognormal(d.y); }),
                    normal: d3.svg.line()
                                .x(function(d, i) { return x.normal(d.x); })
                                .y(function(d, i) { return y.normal(d.y); })};
                                            

        theCurve.lognormal.data( [_data.lognormal] )
                    .attr("d", line.lognormal );         
                    
        theCurve.normal.data( [_data.normal] )
                    .attr("d", line.normal );         
       
        theTickRange = getXTickRanges(minX, maxX); 

        lineForMean.lognormal.attr("x1",x.lognormal(xForMean.lognormal)); 
        lineForMean.lognormal.attr("x2",x.lognormal(xForMean.lognormal));     
        
        var yForMean = {lognormal:lognormalHelper.getPdfValue(xForMean.lognormal).lognormal,
                        normal:lognormalHelper.getPdfValue(xForMean.normal).normal};
        
        
        lineForMean.lognormal.attr("y2",y.lognormal(yForMean.lognormal));     
        lineForMean.lognormal.attr("y1",y.lognormal(0));     


        lineForMean.normal.attr("x1",x.normal(xForMean.normal)); 
        lineForMean.normal.attr("x2",x.normal(xForMean.normal));     
        lineForMean.normal.attr("y1",y.normal(0));     
        lineForMean.normal.attr("y2",y.normal(yForMean.normal));     

        
        updateCurrentMean("lognormal", {top:y.lognormal(yForMean.lognormal), left:5 + x.lognormal(xForMean.lognormal)},
                                      xForMean.lognormal);

        updateCurrentMean("normal", {top:y.normal(yForMean.normal), left:5 + x.normal(xForMean.normal)},
                                      xForMean.normal);
        
        var yFor95th = {lognormal:lognormalHelper.getPdfValue(xForLine95th.lognormal).lognormal,
                          normal:lognormalHelper.getPdfValue(xForLine95th.normal).normal};

        var yForLower95th = {lognormal:lognormalHelper.getPdfValue(xForLineLower95th.lognormal).lognormal,
                          normal:lognormalHelper.getPdfValue(xForLineLower95th.normal).normal};

        var yForMedian = {lognormal:lognormalHelper.getPdfValue(xForLineMedian.lognormal).lognormal,
                            normal:lognormalHelper.getPdfValue(xForLineMedian.normal).normal};
                            
                          
        ["lognormal","normal"].forEach(function(which) {
          
          lineForUpper95th[which].attr("x1",x[which](xForLine95th[which])); 
          lineForUpper95th[which].attr("x2",x[which](xForLine95th[which]));  
          lineForUpper95th[which].attr("y2",y[which](yFor95th[which]));            
          lineForUpper95th[which].attr("y1",y[which](0));            

          lineForLower95th[which].attr("x1",x[which](xForLineLower95th[which])); 
          lineForLower95th[which].attr("x2",x[which](xForLineLower95th[which]));  
          lineForLower95th[which].attr("y2",y[which](yForLower95th[which]));            
          lineForLower95th[which].attr("y1",y[which](0));            

          updateCurrentUpper95th(which,{top:y[which](yFor95th[which]), left:5 + x[which](xForLine95th[which])},
                                        xForLine95th[which]);

          updateCurrentLower95th(which,{top:y[which](yForLower95th[which]), left:-2 + x[which](xForLineLower95th[which])},
                                        xForLineLower95th[which]);
          
          if (which==="lognormal") {        
          

            lineForMedian[which].attr("x1",x[which](xForLineMedian[which])); 
            lineForMedian[which].attr("x2",x[which](xForLineMedian[which]));  
            lineForMedian[which].attr("y2",y[which](yForMedian[which]));  
            lineForMedian[which].attr("y1",y[which](0));  
            
            updateCurrentMedian(which,{top:y[which](yForMedian[which]/2), left:x[which](xForLineMedian[which])-2},
                                          xForLineMedian[which]);
                            
            updateCurrentMode(which, {top:y[which](maxY[which]), left:x[which](xForMode[which])},
                                          xForMode[which]);
  
          }
          
           //equationlognormal   
           
           if ($('#pdf_' + which).is(":visible")) {    
           
             var whatToConnectTo = $('#equation' + which);
             var closestParent = whatToConnectTo.closest('.equation');
             var closestPosition = closestParent.position();
             
             if (isDefined(closestParent) && isDefined(closestPosition)) {
             
             var pdfPosition = whatToConnectTo.position();   
             
             var offsetLeft = closestPosition.left - pdfPosition.left;   
             var offsetTop = closestPosition.top + pdfPosition.top + whatToConnectTo.height();  
                
             //console.log(offsetLeft + ", " + offsetTop);   

             xForLineOnCurve[which] = x[which].invert(offsetLeft-100); //lognormalHelper.getPercentilesNormalAndLognormal(0.80)[which]
             yForLineOnCurve[which] = lognormalHelper.getPdfValue(xForLineOnCurve[which])[which];//   y[which].invert(offsetTop+100); //lognormalHelper.getPdfValue(xForLineOnCurve[which])[which]; 

                
             lineDataForPdfToCurve[which] = [{x:x[which].invert(offsetLeft),
                                                y:y[which].invert(offsetTop)},
                                                {x:xForLineOnCurve[which],
                                                y:yForLineOnCurve[which] }                                             
                                             ];
           //console.log(lineDataForPdfToCurve);
               svgLineForPdfToCurve[which].attr("d", lineFunctionForPdfToCurve[which](lineDataForPdfToCurve[which]))
                                          .style("visibility","visible");
               //$('#pdfToCurveCurve_'+which).removeClass("hidden");
               //svgLineForPdfToCurve[which].classed("hidden","false");
             }
          }
          
          //update the xaxes
          xAxis[which].scale(x[which]);          
          theD3XAxis[which].attr("transform", "translate(0," + y[which](0) + ")")
                              .call(xAxis[which]);

          
        });
        
        //console.log(maxY + ", " + yFor95th + ", " + y(yFor95th));
        
        //updateCurrentUpper95th("lognormal", {top:y.lognormal(yFor95th.lognormal), left:5 + x.lognormal(xForLine95th.lognormal)},
        //                              xForLine95th.lognormal);
                
        //updateCurrentMedian("lognormal", {top:y.lognormal(yForMedian.lognormal/2), left:x.lognormal(xForLineMedian.lognormal)-2},
        //                              xForLineMedian.lognormal);
                        
        //updateCurrentMode("lognormal", {top:y.lognormal(maxY.lognormal), left:x.lognormal(xForMode.lognormal)},
        //                              xForMode.lognormal);


    }; //update...
    
    
    ["lognormal", "normal"].forEach(function(which) {

//                       .attr("width", w[which] )
//                       .attr("height", h[which] )
//                        .style("width", "100%" )
//                        .style("height", "100%" )      var minX = {};
//                     .attr("preserveAspectRatio","xMidyMid meet")
//                        .style("width", "100%" )
//                        .style("height", "100%" )      

//This almost works, but you have to set up things right at first, 
//  and the divs don't get placed at the right place, so that would need to get worked out
//  and change aspect ratio 
// For now, just let it set up right the first time 
// why can't  .attr("viewBox","0 0 " + w[which] + " " + h[which])
 
      var minX = {};
      var maxX = {};
      vis[which] = d3.select("#" + which + "_curve")
                      .append("svg:svg")
                      .attr("id","maincurve_" + which)
                      .attr("class","svgPlotArea")                      
                      .attr("width", w[which] )
                      .attr("height", h[which] )
                      .on("mouseleave", function() {
                        whenMouseMovesOnPlotLine[which].classed("hide",true);
                        $('#' + which + 'ShowCurrentValue').addClass("hide");
                      })
                      .on("mouseenter", function() {
                        whenMouseMovesOnPlotLine[which].classed("hide",false);
                        $('#' + which + 'ShowCurrentValue').removeClass("hide");
                      })
                      .on("mouseup",function() {
                        lineForMean[which].isSelected = false;
                        lineForMean[which].classed("lineActive",false); 
                        lineForUpper95th[which].isSelected = false;
                        lineForUpper95th[which].classed("lineActive",false); 

                        lineForLower95th[which].isSelected = false;
                        lineForLower95th[which].classed("lineActive",false); 
                        
                        lineForMedian[which].isSelected = false;
                        lineForMedian[which].classed("lineActive",false); 
                        
                      })
                      .on("mousemove",function() {
                        
                       //map mouse x to place on axis
                       var theX = d3.mouse(this)[0];    

                       theX = Math.max(theX,margin);
                       theX = Math.min(theX,w[which] - margin);

                       var theXInDomain = x[which].invert(theX);

                       //move the "when mouse moves" line 
                       whenMouseMovesOnPlotLine[which].attr("x1",theX); 
                       whenMouseMovesOnPlotLine[which].attr("x2",theX); 
                       
                       var yValue = lognormalHelper.getPdfValue(theXInDomain)[which];
                       //get the p value
                       
                       whenMouseMovesOnPlotLine[which].attr("y2",y[which](yValue)); 
                       whenMouseMovesOnPlotLine[which].attr("y1",y[which](0)); 
                       
                       var el = $('#' + which + 'ShowCurrentValue');
                       var s = formatNumberForDisplay(theXInDomain);
                       s +=  " (p = " + (100*lognormalHelper.getCdf(theXInDomain)[which]).toFixed(0) + "%)"
                       el.html(s);
                       el.css("left",2 + theX);
                       el.css("top",y[which](0) - el.height()-4);
                       
                       if (lineForMean[which].isSelected) {
                          lineForMean[which].attr("x1",theX); 
                          lineForMean[which].attr("x2",theX);                                                    
                           //set the mean
                           var fixTicks = true;

                           loadValueForInput(which + "_mean", theXInDomain, fixTicks);                           
                        }                          
                       if (lineForUpper95th[which].isSelected) {                          
                          
                          var percentile_p = 0.95;
                          var percentile_value = theXInDomain;
                          var keepNormalMeanFixedElseSigma = true;
                          
                          var upper95th =  myLognormalHelper.getPercentilesNormalAndLognormal(0.95);

                          if (which=="normal") {
                            
                            var normalSettings = myLognormalHelper.getSettingsForNormal();                          

                            var valueToHit = percentile_value;
                            if (valueToHit - normalSettings.mean <= 0) {
                              showCurveMessage(which,"In this case, you cannot set the upper 95th percentile lower than its current value of " + 
                                                          formatNumberForDisplay(upper95th.normal) + ".");                              
                            }
                            else {
                                hideLognormalCurveMessage(); 
                                var keepNormalMeanFixedElseSigma = true;
                                myLognormalHelper.setParametersForToHitNormalPercentile(
                                              percentile_p, 
                                              percentile_value, 
                                              keepNormalMeanFixedElseSigma) ;
                                              
                                loadSettingsIntoInputs(myLognormalHelper);
                                var fixTicks = true;
                                graphUpdater.doUpdate(myLognormalHelper, fixTicks); //reorganize things!
      
                                lineForUpper95th[which].attr("x1",theX); 
                                lineForUpper95th[which].attr("x2",theX);                                 
                            }
                          }
                          else {
                            
                          var valueToHit_NormalSpace = Math.log(percentile_value);
                          //check to see if it is possible to hit it in this case
                          var normalSettings = myLognormalHelper.getSettingsForNormal();                          

                          if (valueToHit_NormalSpace - normalSettings.mean <= 0) {
                            
                             //we can't hit it - flash the message
                            showCurveMessage(which,"In this case, you cannot set the upper 95th percentile lower than its current value of " + 
                                                        formatNumberForDisplay(upper95th.lognormal) + ".");
                          }
                          else {
                            
                             //it can be hit...                             
                                hideLognormalCurveMessage(); 
                                myLognormalHelper.setParametersForToHitLognormalPercentile(
                                              percentile_p, 
                                              percentile_value, 
                                              keepNormalMeanFixedElseSigma) ;
                                              
                                loadSettingsIntoInputs(myLognormalHelper);
                                var fixTicks = true;
                                graphUpdater.doUpdate(myLognormalHelper, fixTicks); //reorganize things!
      
                                lineForUpper95th.attr("x1",theX); 
                                lineForUpper95th.attr("x2",theX);   
                          }
                        }
                       } 
                       //this is repeated when they drag the div - combine them
                       if (lineForLower95th[which].isSelected) {                          
                          
                          var percentile_p = 0.05;
                          var percentile_value = theXInDomain;
                          var keepNormalMeanFixedElseSigma = true;
                          
                          var lower95th =  myLognormalHelper.getPercentilesNormalAndLognormal(0.05);

                          if (which=="normal") {
                            
                            var normalSettings = myLognormalHelper.getSettingsForNormal();                          

                            var valueToHit = percentile_value;
                            if (valueToHit - normalSettings.mean >= 0) {
                              showCurveMessage(which,"In this case, you cannot set the lower 95th percentile higher than its current value of " + 
                                                          formatNumberForDisplay(lower95th.normal) + ".");                              
                            }
                            else {
                                hideLognormalCurveMessage(); 
                                var keepNormalMeanFixedElseSigma = true;
                                myLognormalHelper.setParametersForToHitNormalPercentile(
                                              percentile_p, 
                                              percentile_value, 
                                              keepNormalMeanFixedElseSigma) ;
                                              
                                loadSettingsIntoInputs(myLognormalHelper);
                                var fixTicks = true;
                                graphUpdater.doUpdate(myLognormalHelper, fixTicks); //reorganize things!
      
                                lineForLower95th[which].attr("x1",theX); 
                                lineForLower95th[which].attr("x2",theX);                                 
                            }
                          }
                          else {
                            
                          var valueToHit_NormalSpace = Math.log(percentile_value);
                          //check to see if it is possible to hit it in this case
                          var normalSettings = myLognormalHelper.getSettingsForNormal();                          

                          if (valueToHit_NormalSpace - normalSettings.mean >= 0) {
                            
                             //we can't hit it - flash the message
                            showCurveMessage(which,"In this case, you cannot set the lower 95th percentile higher than its current value of " + 
                                                        formatNumberForDisplay(lower95th.lognormal) + ".");
                          }
                          else {
                            
                             //it can be hit...                             
                                hideLognormalCurveMessage(); 
                                myLognormalHelper.setParametersForToHitLognormalPercentile(
                                              percentile_p, 
                                              percentile_value, 
                                              keepNormalMeanFixedElseSigma) ;
                                              
                                loadSettingsIntoInputs(myLognormalHelper);
                                var fixTicks = true;
                                graphUpdater.doUpdate(myLognormalHelper, fixTicks); //reorganize things!
      
                                lineForLower95th.attr("x1",theX); 
                                lineForLower95th.attr("x2",theX);   
                          }
                        }
                       }  
                       
                        if (lineForMedian[which].isSelected) {
                          
                          //onsole.log(d3.mouse(this)[0]);

                          var percentile_p = 0.5;
                          var percentile_value = theXInDomain;
                          var keepNormalMeanFixedElseSigma = true;
                          
                          var median =  myLognormalHelper.getPercentilesNormalAndLognormal(0.5);

                          
                          //var valueToHit_NormalSpace = Math.log(percentile_value);
                          //check to see if it is possible to hit it in this case
                          var normalSettings = myLognormalHelper.getSettingsForNormal();                          

                          //doh - in this case, we just want exp(mu) = value, so there is no normalSettings
                          // "fix mu or fix sigma"
                          //so we set mu = log(value)
                          if (which==="normal") {
                            normalSettings.mean = percentile_value;
                          }
                          else {
                            console.log("Want to hit:" + percentile_value);
                            normalSettings.mean = Math.log(percentile_value);
                          }
                          myLognormalHelper.setNormalParameters(normalSettings);
                          loadSettingsIntoInputs(myLognormalHelper);
                          var fixTicks = true;
                          lineForMedian[which].attr("x1",theX); 
                          lineForMedian[which].attr("x2",theX);   
                          graphUpdater.doUpdate(myLognormalHelper, fixTicks); //reorganize things!
                             
                       }
                       
                      });
        
        
        
        g[which] = vis[which]; //12-21 .append("svg:g");
    

        var theMax = -1;
       
        //we center on the mode for the lognormalSettings
        
        
        var theXRanges = getXRangesForGraph(lognormalHelper);

        x_array[which] = theXRanges[which]; //.lognormal;
        minX[which] = x_array[which][0];
        maxX[which] = x_array[which].last(); //[x_array.length-1];
           
       var maxY = {lognormal:-1, normal:-1};
       _data[which] = x_array[which].map(function(x) {
            var theY = lognormalHelper.getPdfValue(x)[which]; //.lognormal; // jStat.beta.pdf(x,alpha,beta);
            maxY[which] = Math.max(theY,maxY[which]);
            return {x:x, y:theY};
        });

        y[which] = d3.scale.linear().domain([0, maxY[which]]).range([h[which] - margin,0 + margin ]);
        
        //y[which] = d3.scale.linear().domain([0, maxY[which]]).range([h[which],0 ]);
        
        x[which] = d3.scale.linear().domain([x_array[which][0],maxX[which]]).range([0 + margin, w[which] - margin]);
        //x[which] = d3.scale.linear().domain([x_array[which][0],maxX[which]]).range([0 , w[which]]);


        //var scale = d3.scale.linear(x[which].domain());
        //scale.range(x[which]);
        xAxis[which].scale(x[which]);
        xAxis[which].orient("bottom");



        line[which] = d3.svg.line()
            .x(function(d, i) { return x[which](d.x); })
            .y(function(d, i) {return y[which](d.y); });        

          theTickRange = getXTickRanges(minX, maxX); 
                
      
        xForLine[which] = myLognormalHelper.getMean(which); //Lognormal();
        theYForLine[which] = lognormalHelper.getPdfValue(xForLine[which])[which]; //.lognormal; 
        //line for the mean
        lineForMean[which] = g[which].append("svg:line")
            .attr("id","mean_lognormal")
            .attr("variable","meannormal_")
            .attr("x1", x[which](xForLine[which]))
            .attr("y1", y[which](0))
            .attr("x2", x[which](xForLine[which]))
            .attr("y2", y[which](theYForLine[which]))
            .attr("stroke", Colors.mean )            
            .attr("stroke-width","4")
            .attr("class","draggableLine")
            .on("mouseover", function() {
                d3.select(this).classed("lineActive",true);
                $('#' + which + 'CurveCurrentMean').addClass("active");
                
                highlightVariable(d3.select(this).attr("variable"),"add");
//                 if (which==="normal") {
//                   highlightNormalMean();
//                 }
             })
            .on("mousedown",function() {
              lineForMean[which].isSelected = true;
              })
            .on("mouseout", function() {
                if (!lineForMean[which].isSelected) {              
                  d3.select(this).classed("lineActive",false); 
                  $('#' + which + 'CurveCurrentMean').removeClass("active");
                  highlightVariable(d3.select(this).attr("variable"),"remove");
                }
             });
         lineForMean[which].isSelected = false;
      
          updateCurrentMean(which,{top:y[which](theYForLine[which]), left:5 + x[which](xForLine[which])},
                                      xForLine[which]);
      
      
          xForMode[which] = myLognormalHelper.getMode(which); //Lognormal();
          updateCurrentMode(which, {top:y[which](maxY[which]), left:x[which](xForMode[which])},
                                      xForMode[which]);
      
        //line for the upper 95th percentile
          xForLine95th[which] = myLognormalHelper.getPercentilesNormalAndLognormal(0.95)[which]
          yFor95th[which] = lognormalHelper.getPdfValue(xForLine95th[which])[which]; 
        //var gg = g.append("svg:g")
        lineForUpper95th[which] = 
          g[which].append("svg:line")
            .attr("id","percentile_" + which)
            .attr("x1", x[which](xForLine95th[which]))
            .attr("y1", y[which](0))
            .attr("x2", x[which](xForLine95th[which]))
            .attr("y2", y[which](yFor95th[which]))
            .attr("stroke", Colors.upper95th)
            .attr("stroke-width","4")
            .attr("class","ProbabilityLine")
            .on("mouseover", function() {
                d3.select(this).classed("lineActive",true); 
                $('#lognormalCurveCurrentUpper95th').addClass("active");
             })
            .on("mousedown",function() {            
                lineForUpper95th[which].isSelected = true;
              })
            .on("mouseout", function() {
                if (!lineForUpper95th[which].isSelected) {              
                  d3.select(this).classed("lineActive",false); 
                  $('#' + which + 'CurveCurrentUpper95th').removeClass("active");
                }
             });

        updateCurrentUpper95th(which, {top:y[which](yFor95th[which]), left:5 + x[which](xForLine95th[which])},
                                      xForLine95th[which]);


          xForLineLower95th[which] = myLognormalHelper.getPercentilesNormalAndLognormal(0.05)[which]
          yForLower95th[which] = lognormalHelper.getPdfValue(xForLineLower95th[which])[which]; 

        lineForLower95th[which] = 
          g[which].append("svg:line")
            .attr("id","percentile_" + which)
            .attr("x1", x[which](xForLineLower95th[which]))
            .attr("y1", y[which](0))
            .attr("x2", x[which](xForLineLower95th[which]))
            .attr("y2", y[which](yForLower95th[which]))
            .attr("stroke", Colors.lower95th )
            .attr("stroke-width","4")
            .attr("class","ProbabilityLine")
            .on("mouseover", function() {
                d3.select(this).classed("lineActive",true); 
                $('#lognormalCurveCurrentLower95th').addClass("active");
             })
            .on("mousedown",function() {            
                lineForLower95th[which].isSelected = true;
              })
            .on("mouseout", function() {
                if (!lineForLower95th[which].isSelected) {              
                  d3.select(this).classed("lineActive",false); 
                  $('#' + which + 'CurveCurrentLower95th').removeClass("active");
                }
             });

        updateCurrentLower95th(which, {top:y[which](yForLower95th[which]), left:-1 + x[which](xForLineLower95th[which])},
                                      xForLineLower95th[which]);


        //line for the upper 95th percentile
        xForLineMedian[which] = myLognormalHelper.getPercentilesNormalAndLognormal(0.5)[which];
        yForMedian[which] = lognormalHelper.getPdfValue(xForLineMedian[which]).lognormal; 
        //var gg = g.append("svg:g")
        lineForMedian[which] = 
          g[which].append("svg:line")
            .attr("x1", x[which](xForLineMedian[which]))
            .attr("y1", y[which](0))
            .attr("x2", x[which](xForLineMedian[which]))
            .attr("y2", y[which](yForMedian[which]))
            .attr("stroke", Colors.median )
            .attr("stroke-width","4")
            .attr("class","ProbabilityLine")
            .on("mouseover", function() {
                d3.select(this).classed("lineActive",true); 
                $('#' + which + 'CurveCurrentMedian').addClass("active");
             })
            .on("mousedown",function() {            
                lineForMedian[which].isSelected = true;
              })
            .on("mouseout", function() {
                if (!lineForMedian[which].isSelected) {              
                  d3.select(this).classed("lineActive",false); 
                  $('#lognormalCurveCurrentMedian').removeClass("active");
                }
             });
        updateCurrentMedian(which, {top:y[which](yForMedian[which]/2), left:x[which](xForLineMedian[which])-2},
                                      xForLineMedian[which]);
             
        if (which==="normal") {
          lineForMedian[which].classed("hide","true");
        }
        
        whenMouseMovesOnPlotLine[which] = 
             g[which].append("svg:line")
            .attr("id","mean_" + which)
            .attr("x1", x[which](xForLine[which]))
            .attr("y1", y[which](0))
            .attr("x2", x[which](xForLine[which]))
            .attr("y2", y[which](maxY[which]))
            .attr("stroke", "#000000" )
            .attr("stroke-width","1")
            .attr("stroke-dasharray","3, 3")
            .attr("class","whenMouseMovesOnPlotLine")
            .classed("hide","true");
    
    
      theCurve[which] = g[which].selectAll('path.line')
                .data( [_data[which]] )
                .enter()
                .append("svg:path")
                .attr("stroke", Colors.curve)
                .attr("class","area")
                .attr("d", line[which] )
                .attr("stroke-width","3");


      //set up thing for the line from the pdf to the curve
       lineFunctionForPdfToCurve[which] = d3.svg.line()
            .x(function(d, i) { 
              var xx = x[which](d.x);
              return x[which](d.x); 
              })
            .y(function(d, i) {
              var yy = y[which](d.y);
              return y[which](d.y); 
              })
              .interpolate("basis");
       
       
         xForLineOnCurve[which] = lognormalHelper.getPercentilesNormalAndLognormal(0.80)[which]
         yForLineOnCurve[which] = lognormalHelper.getPdfValue(xForLineOnCurve[which])[which]; 
       //equationlognormal   
       var pdfPosition = $('#pdf_' + which).position();   
          
       lineDataForPdfToCurve[which] = [{x:x[which].invert(pdfPosition.top),
                                          y:y[which].invert(pdfPosition.left)},
                                       {x:xForLineOnCurve[which],
                                          y:yForLineOnCurve[which] }];
       //console.log(lineDataForPdfToCurve);
       //if ($('#pdf_lognormal').is(":visible")) {
       
         //.classed("hidden","true")
         
        g[which].append("svg:defs").selectAll("marker")
            .data(["arrow"])
          .enter().append("svg:marker")
            .attr("orient","auto")
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 10)
            .attr("refY", 0)
            .attr("markerWidth", 10)
            .attr("markerHeight", 10)
            .attr("orient", "auto")
            .attr("stroke", Colors.curve)
            .attr("fill", Colors.curve)
            .append("svg:path")
            .attr("d", "M0,-3L10,0L0,3L0,0");         
            //.attr("d", "M0,-5L10,0L0,0");         
         
         svgLineForPdfToCurve[which] = g[which].append("path")
                              .style("visibility","hidden")
                              .attr("id", "pdfToCurveCurve_" + which)
                              .attr("d", lineFunctionForPdfToCurve[which](lineDataForPdfToCurve[which]))
                              .attr("stroke", Colors.curve)
                              .attr("fill", "none")
                              .attr("stroke-dasharray","5,5")
                              .attr("stroke-width", "2")
                              .attr("marker-end","url(#arrow)");

//not adding labels at all definitely cleans up the charts
//Do we really need tick labels for this?  You've got to putz with format, etc.
//All we might need would be min/maxX
//maybe just put raw text boxes at either end
// the visual noise of just a few tick labels can be distracting

         theD3XAxis[which] = g[which].append("g")
                              .attr("class","axis")
                              .attr("id", "xaxis_" + which)
                              .attr("transform", "translate(0," + y[which](0) + ")")
                              .call(xAxis[which]);
                              
       //}   
            

}); //loop over which for lognormal and normal
    
  //man I've got to fix this - things have grown more than I anticipated  
  //this is repeated in the "move line code"... but that might be going away
  //because it is so hard to grab the line
 
  $('body').on("mouseover",'.divDisplayOnCurve', function(event){
      highlightVariable($(this).attr("variable"),"add");
  });
  $('body').on("mouseout",'.divDisplayOnCurve', function(event){
    
    if ( 
        (isDefinedAndNotNull(divBeingDragged))
        &&
        ($(this).attr("id")!==divBeingDragged.attr("id"))
        ) {

          highlightVariable($(this).attr("variable"),"remove");
          
        }
    else if (!isDefinedAndNotNull(divBeingDragged)) {
          highlightVariable($(this).attr("variable"),"remove");      
    }
    
      
      
  });
    
//   $('body').on("mousedown", function(event) {
//       //$(document).tooltip("close");
//   });  
  $('body').on("mousedown touchstart",'.divDisplayOnCurve', function(event){
    
      //$('.divDisplayOnCurve').tooltip("close");
      
      divBeingDragged = $(this); 
      divBeingDragged.addClass("divDisplayActive");
      
      lastDivX = event.pageX;
      lastDivY = event.pageY;

    if (isMobile()) {      
      var where = pointerEventToXY(event);
      lastDivX = where.x;
      lastDivY = where.y;
      //return; //don't do anything for now 12/21/2013
      event.preventDefault();
    }
    else {
      //make sure all tooltips hidden
      $('.ui-tooltip').fadeOut();
      $(document).tooltip('disable');
    }

      
      
      //console.log($(this).attr("variable"));
      highlightVariable($(this).attr("variable"),"add");
      
  });
  
  var lastDivX;
  var lastDivY;
  
  var pointerEventToXY = function(e){
      var out = {x:0, y:0};
      if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        out.x = touch.pageX;
        out.y = touch.pageY;
      } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
        out.x = e.pageX;
        out.y = e.pageY;
      }
      return out;
    };
  //touchmove -I added this to see what happens, and it selects the div
  //but gets NaN in fields, probably because something else needs to be tweaked to 
  //update correctly... Dec 22, 2013
  $('body').on("mousemove touchmove",function(event) {


  

    var thisMouseX = event.pageX;
    var thisMouseY = event.pageY;
    
    if (isMobile()) {      
      var where = pointerEventToXY(event);
      thisMouseX = where.x;
      thisMouseY = where.y;
      //return; //don't do anything for now 12/21/2013
      //event.preventDefault();
    }
    
    
//    $('#mainTitle').html("Hello " + thisMouseX);

    
    if (isDefinedAndNotNull(divBeingDragged)) {

      return; //12-27 using d3's drag functionality now

      //see if this helps for not moving the page
      //almost... look at this later - get's NaN on values so probably need to do some extra stuff if (event.type==="touchmove") {
      //  event.preventDefault();  
      //}

      //console.log(thisMouseX - lastDivX);

      //find out how big the diff is, in actual coordinates

      if (isMobile()) {
        //return; //don't do anything for now 12/21/2013
        event.preventDefault();
      }

      var whichOne = divBeingDragged.attr("id");
      var which = divBeingDragged.attr("which");
      
      var currentX = Number(divBeingDragged.attr("actualValue"));
      //this seems to work... weird...
      var newX = x[which].invert(x[which](currentX) + (thisMouseX - lastDivX));

      //$('#mainTitle').html("Hello " + newX);

      //update based on which one it is... in some cases, we can't let them do it
      var fixTicks = true;
      if (whichOne==="normalCurveCurrentMean") {
        
        
        var normalSettings = myLognormalHelper.getSettingsForNormal();                          
        normalSettings.mean = newX;
        myLognormalHelper.setNormalParameters(normalSettings);
        loadSettingsIntoInputs(myLognormalHelper);
        graphUpdater.doUpdate(myLognormalHelper, fixTicks); //reorganize things!        
        
      }
      else if (whichOne==="normalCurveCurrentUpper95th") {
        
          var percentile_p = 0.95;
          var percentile_value = newX;
          var keepNormalMeanFixedElseSigma = true;                          
          var upper95th =  myLognormalHelper.getPercentilesNormalAndLognormal(percentile_p);
          var valueToHit_NormalSpace = percentile_value;
          //check to see if it is possible to hit it in this case
          var normalSettings = myLognormalHelper.getSettingsForNormal();                          

          if (valueToHit_NormalSpace - normalSettings.mean <= 0) {                            
               //we can't hit it - flash the message
              showCurveMessage(which, "In this case, you cannot set the upper 95th percentile lower than its current value of " + 
                                          formatNumberForDisplay(upper95th.normal) + ".");
          }
          else {
              hideCurveMessage(which); 
              myLognormalHelper.setParametersForToHitNormalPercentile(
                            percentile_p, 
                            percentile_value, 
                            keepNormalMeanFixedElseSigma) ;
                            
              loadSettingsIntoInputs(myLognormalHelper);
              graphUpdater.doUpdate(myLognormalHelper, fixTicks); //reorganize things!        
          }                
      }
      else if (whichOne==="normalCurveCurrentLower95th") {
        
          var percentile_p = 0.05;
          var percentile_value = newX;
          var keepNormalMeanFixedElseSigma = true;                          
          var upper95th =  myLognormalHelper.getPercentilesNormalAndLognormal(percentile_p);
          var valueToHit_NormalSpace = percentile_value;
          //check to see if it is possible to hit it in this case
          var normalSettings = myLognormalHelper.getSettingsForNormal();                          

          if (valueToHit_NormalSpace - normalSettings.mean >= 0) {                            
               //we can't hit it - flash the message
              showCurveMessage(which, "In this case, you cannot set the lower 95th percentile larger than its current value of " + 
                                          formatNumberForDisplay(upper95th.normal) + ".");
          }
          else {
              hideCurveMessage(which); 
              myLognormalHelper.setParametersForToHitNormalPercentile(
                            percentile_p, 
                            percentile_value, 
                            keepNormalMeanFixedElseSigma) ;
                            
              loadSettingsIntoInputs(myLognormalHelper);
              graphUpdater.doUpdate(myLognormalHelper, fixTicks); //reorganize things!        
          }                
      }
      else if (whichOne==="lognormalCurveCurrentMedian") {
        var normalSettings = myLognormalHelper.getSettingsForNormal();                          
        //we just want exp(mu) = value, so there is normalSettings
        // "fix mu or fix sigma"
        //so we set mu = log(value)
        normalSettings.mean = Math.log(newX);
        myLognormalHelper.setNormalParameters(normalSettings);
        loadSettingsIntoInputs(myLognormalHelper);
        graphUpdater.doUpdate(myLognormalHelper, fixTicks); //reorganize things!
       }
      else if (whichOne==="lognormalCurveCurrentMode") {        
      
        //we want mu_L - s_L^2 = log(xValue)
        var keepNormalMeanFixedElseSigma = true;                          
        var valueToHit_NormalSpace = Math.log(newX);
        
        var normalSettings = myLognormalHelper.getSettingsForNormal();    
        
        if (valueToHit_NormalSpace > normalSettings.mean) {
           showCurveMessage("lognormal", "The mode of a lognormal distribution can never be larger than the mean.");          
        }
        else {
        
          //console.log(normalSettings.mean - valueToHit_NormalSpace);          
          var sigma = Math.sqrt(normalSettings.mean - valueToHit_NormalSpace);          
          normalSettings.standardDeviation = sigma;
          myLognormalHelper.setNormalParameters(normalSettings);
          loadSettingsIntoInputs(myLognormalHelper);
          graphUpdater.doUpdate(myLognormalHelper, fixTicks); //reorganize things!
          
        }
      }
      else if (whichOne==="lognormalCurveCurrentMean") {        
          loadValueForInput("lognormal_mean", newX, fixTicks);                           
      }
      else if (whichOne==="lognormalCurveCurrentUpper95th") {
        
          var percentile_p = 0.95;
          var percentile_value = newX;
          var keepNormalMeanFixedElseSigma = true;                          
          var upper95th =  myLognormalHelper.getPercentilesNormalAndLognormal(percentile_p);
          var valueToHit_NormalSpace = Math.log(percentile_value);
          //check to see if it is possible to hit it in this case
          var normalSettings = myLognormalHelper.getSettingsForNormal();                          

          if (valueToHit_NormalSpace - normalSettings.mean <= 0) {                            
               //we can't hit it - flash the message
              showCurveMessage("lognormal", "In this case, you cannot set the upper 95th percentile lower than its current value of " + 
                                          formatNumberForDisplay(upper95th.lognormal) + ".");
          }
          else {
              hideLognormalCurveMessage(); 
              myLognormalHelper.setParametersForToHitLognormalPercentile(
                            percentile_p, 
                            percentile_value, 
                            keepNormalMeanFixedElseSigma) ;
                            
              loadSettingsIntoInputs(myLognormalHelper);
              graphUpdater.doUpdate(myLognormalHelper, fixTicks); //reorganize things!        
          }        
      }
      else if (whichOne==="lognormalCurveCurrentLower95th") {
        
          var percentile_p = 0.05;
          var percentile_value = newX;
          var keepNormalMeanFixedElseSigma = true;                          
          var lower95th =  myLognormalHelper.getPercentilesNormalAndLognormal(percentile_p);
          var valueToHit_NormalSpace = Math.log(percentile_value);
          //check to see if it is possible to hit it in this case
          var normalSettings = myLognormalHelper.getSettingsForNormal();                          

          //this check is the opposite of when p=0;905 (>=0.5)
          if (valueToHit_NormalSpace - normalSettings.mean >= 0) {                            
               //we can't hit it - flash the message
              showCurveMessage("lognormal", "In this case, you cannot set the lower 95th percentile larger than its current value of " + 
                                          formatNumberForDisplay(lower95th.lognormal) + ".");
          }
          else {
              hideLognormalCurveMessage(); 
              myLognormalHelper.setParametersForToHitLognormalPercentile(
                            percentile_p, 
                            percentile_value, 
                            keepNormalMeanFixedElseSigma) ;
                            
              loadSettingsIntoInputs(myLognormalHelper);
              graphUpdater.doUpdate(myLognormalHelper, fixTicks); //reorganize things!        
          }        
      }
      
      
      //have that one update itself
      //console.log(currentX + ", " + newX);

      lastDivX = thisMouseX;
      lastDivY =thisMouseY;
            
    }

    if (currentlySelectedInput) {


      var diff = -(thisMouseY - lastMouseY);

      //console.log(diff);

      var currentVal = parseFloat(currentlySelectedInput.val());

      var diffAmount = currentlySelectedInput.attr("diff");

      if (isUndefined(diffAmount)) {
         var diffRatio = Number(currentlySelectedInput.attr("diffRatio"));
         var ratioOf = currentlySelectedInput.attr("ratioOf");
         var otherElementValue = Number($("#" + ratioOf).val());
         currentVal += diff * (diffRatio * otherElementValue);
      }
      else {
        if ((diffAmount) && (diffAmount.length > 0)) {
          diffAmount = parseFloat(diffAmount);
        } else {
          diffAmount = 1;
        
        }
        currentVal += diff * diffAmount;
      }

      var theMin = currentlySelectedInput.attr("min");
      if ((theMin) && (theMin.length > 0)) {
        theMin = parseFloat(theMin);
        if (currentVal < theMin) {
          currentVal = theMin;
        }
      }

      var theMax = currentlySelectedInput.attr("max");
      if ((theMax) && (theMax.length > 0)) {
        theMax = parseFloat(theMax);
        if (currentVal > theMax) {
          currentVal = theMax;
        }
      }

      //now we can update the relevant one...
      
      //do it here...
      var thisId = currentlySelectedInput.attr("id");
      var fixTicks = true;
      loadValueForInput(thisId,currentVal, fixTicks);


      loadSettingsIntoInputs(myLognormalHelper);
      //graphUpdater.doUpdate(myLognormalHelper); //reorganize things!     

       
      if (diffAmount < 0.5) {
        currentlySelectedInput.val(currentVal.toFixed(2));
      } else {
        currentlySelectedInput.val(currentVal.toFixed(1));
      }

    }

    lastMouseX = event.pageX;
    lastMouseY = event.pageY;

  });


  $('body').on("focus",'input.inputNumber', function(event){
    
        var thisId = $(this).attr("id");
        if ( (thisId ==="lognormal_mean") || (thisId==="lognormal_sigma")) {
          //put the raw number in there 
          $(this).val(getValueForInputFromSettings(thisId));          
        }    
        
        highlightVariable($(this).attr("variable"),"add");
            
  });
  
  //ugh I'm tired this evening, but want to get the "move via div" somewhat started
  //Basically, when you drag one of the "value" divs, it moves the div and
  // modifies the relevant parameter
  // Tedious to keep the coordinate stuff straight in my head
  // so...
  // they click on a div - we mark it as selected
  // Q: do touch events get mapped to this without performance issues?
  


  $('body').on("mouseover",'input.inputNumber', function(event){              
          highlightVariable($(this).attr("variable"),"add");
  });
  
  $('body').on("mouseout",'input.inputNumber', function(event){  

    highlightVariable($(this).attr("variable"),"remove");
//     if (isDefinedAndNotNull(currentlySelectedInput)
//         &&
//         (currentlySelectedInput).attr("id")!==$(this).attr("id")) {
//           highlightVariable($(this).attr("variable"),"remove");
//         }
//     else if (!isDefinedAndNotNull(currentlySelectedInput)) {
//           highlightVariable($(this).attr("variable"),"remove");
//     }
  });
  
  //allow entering stuff as long as it is a number - the numeric plugin won't seem to do that
  $('body').on("keyup onchange change blur",'input.inputNumber', 
            function(event){
              
              if (event.type==="blur") {
                highlightVariable($(this).attr("variable"),"add");
              }

              var whichOneItIs = $(this)
              //console.log(event);
              //event.preventDefault();
              var keycode = (event.keyCode ? event.keyCode : event.which);
                     
              //console.log("Right away: " + $(this).val());       
              if ((keycode===37)
                 || (keycode===38)) {
                                
                  return;
                   
              }
              //ignore left/right arrow       
                            
                            
              var thisId = $(this).attr("id");
              //remove things that won't work no matter what
              
              var theValue = Number($(this).val());
              if (isNaN(theValue)) {             
                $(this).val($(this).val().replace(/[^0-9.\,-]/g, ''));
              }
              
              var sValue = $(this).val().trim();
              
              //cotonsole.log("sValue = " + sValue);
              

              if (sValue.length===0) {
                return;
              }
              var positiveOnly = whichOneItIs.hasClass("positive-only");
              
              if (sValue.charAt(0)==='-') {
                if (positiveOnly) {
                  $(this).val(getValueForInputFromSettings(thisId));
                  return;                    
                }
                else {
                   //ok
                   return;
                }
              }
              
              //is it a number and not blank?
              if (!$.isNumeric(sValue)) {
                //reset to current
                //console.log("Not numeric: " + sValue);
                $(this).val(getValueForInputFromSettings(thisId));
                return;  
              }
              
              var currentlySelectedInput = $(this);
              var s = sValue;              
              if (s.trim().length<=0) {
                s=0; 
              }                                       
              //if (s==="01") {
              // s=1; 
              //}
              if (s==="0.") {
                if ((event.type==="blur") || (event.type==="focusout")) {
                  s = 0;
                }
                else {
                  return; 
               }
              }
              
              var currentVal = s;
                
              console.dir(currentlySelectedInput);
              var theMin = currentlySelectedInput.attr("min");
              if ( (theMin) && (theMin.length>0)) {
                theMin = parseFloat(theMin); //iffAmount);
                if (currentVal < theMin) {
                  console.log("Below min, setting to " + theMin);
                  currentVal = theMin;
                }
              }
              var theMax = currentlySelectedInput.attr("max");
              if ( (theMax) && (theMax.length>0)) {
                theMax = parseFloat(theMax); //iffAmount);
                if (currentVal > theMax) {
                  //console.log("Below min, setting to " + theMin);
                  currentVal = theMax;
                }
              }                


 
              if ( ! (
                      (keycode===13) 
                      ||
                      (event.type==='blur')
                      )
                    ) {
                    
                    return;  
                    
                 }

              //now see about setting it
              var thisId = $(this).attr("id");
              var fixTicks = false;
              loadValueForInput(thisId,currentVal,fixTicks);

            });
          
      return {doUpdate:update};

  }; //setupSVG function

  $("#pdf_lognormal").load('@Url.Action("ActionResultMethod", "ControllerName",{controller parameters})', function () {
    MathJax.Hub.Queue(
      ["Typeset",MathJax.Hub,"pdf_lognormal"],
      function () {
        $("#pdf_lognormal").fadeIn(); //css("visibility","visible"); // may have to be "visible" rather than ""
        if (isDefined(graphUpdater)) {
          graphUpdater.doUpdate(myLognormalHelper);
        }
      }
    );
  });
  $("#pdf_normal").load('@Url.Action("ActionResultMethod", "ControllerName",{controller parameters})', function () {
    MathJax.Hub.Queue(
      ["Typeset",MathJax.Hub,"pdf_normal"],
      function () {
        $("#pdf_normal").fadeIn(); //css("visibility","visible"); // may have to be "visible" rather than ""
        if (isDefined(graphUpdater)) {
          graphUpdater.doUpdate(myLognormalHelper);
        }
      }
    );
  });

  if (isChromeApp() ) {
     //hide the translate thingie
     ["#translate_script_2","#google_translate_element","#translate_script", "east"].forEach(function(s) {
       $(s).remove();
     });
     $('#mainContent').css("left",0);
     $('#mainContent').css("border-left","none");     
  }

  if (isMobile()) {
    //more padding for the divs in general - I do NOT want to mess with
    //  a thousand different media queries right now
    $(".divDisplayOnCurve").css("padding","6px");
     //remove subtitle to give more room at top, too
    $(".equation").css({background:"none",border:"none"});
     ["#mainSubtitle", "#translate_script_2","#google_translate_element","#translate_script", "#mc_embed_signup"].forEach(function(s) {
       $(s).remove();
     });
     
     
  }
  onResizeDivs();
  graphUpdater = setUpSVG(myLognormalHelper);
  loadSettingsIntoInputs(myLognormalHelper);          
  //justResetValues();


});