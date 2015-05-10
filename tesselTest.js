var tessel = require('tessel');

var myUser = 'aresnick';
var myApi = '9bbnwitbcm';
var myToken = 'xzu4phsh77';

var plotly = require('plotly')(myUser, myApi);
var initdata = [{
    x:[],
    y:[],
    stream:{
      token: myToken,
      maxpoints:200
    }
}];
 
var initlayout = {
  fileopt : "overwrite",
  filename : "mynodenodenode"
};
 
plotly.plot(initdata, initlayout, function (err, msg) {
  if (err) {
    return console.log(err);
  }
  console.log(msg);

  var myStream = plotly.stream(myToken, function (err, res) {
    if (err) return console.log(err);
  });

  // Loop forever
  var i = 0;
  setInterval(function () {
    var data = JSON.stringify({ x : i, y : Math.random()*10 });
    myStream.write(data+'\n');
    i++;
  }, 250);
});