
// var trace1 = {
//   x: [], 
//   y: [], 
//   name: [], 
//   type: "bar"
// };
// var trace2 = {
//   x: [], 
//   y: [], 
//   name: [], 
//   type: "bar"
// };
// var data = [trace1, trace2];
// var layout = {barmode: "stack"};
// var graphOptions = {layout: layout, filename: "stacked-bar", fileopt: "overwrite"};
// plotly.plot(data, graphOptions, function (err, msg) {
//     console.log(msg);
// });

//////////////////////


var tessel = require('tessel');
var myPin = tessel.port['GPIO'].pin['G3'];
var myPin2 = tessel.port['GPIO'].pin['G4'];

var myUser = "jangley1";
var myApi = "xojqlgubes";
var myToken = 'yzy1b8lad4';

function getTitle() {
    var myDate = new Date()
    var splitDate = myDate.toString().split(' ')
    var titleMonth = splitDate[1]
    var titleDay = splitDate[2]
    var titleYear = splitDate[3]
    var titleDate = titleMonth + ' ' + titleDay + ", " + titleYear;
    return titleDate;
}

var refresh = 30 * 1000;

var sitarray = [];
var sitinc = '1';

var standarray = [];
var standinc = '1';

var awayarray = [];
var awayinc = '1';

setInterval(function () {
	if (myPin.read()==0) {
	standarray.push(standinc);
	}
}, refresh);


setInterval(function () {
	if (myPin2.read()==0) {
	awayarray.push(awayinc);
	}
}, refresh);


setInterval(function () {
	if (myPin.read()==1 && myPin2.read()==1) {
	sitarray.push(sitinc);
	}
}, refresh);

var getMyDataFunction = function(stream) {
    return function() {
        var xvalue = null;
        var label = null;
        var yvalue = null;
        if (myPin.read()==0) {
        	xvalue = 'Standing',
        	label = 'Standing',
            yvalue = (standarray.length)/2
        }
        else if (myPin2.read()==0) {
            xvalue = 'Away',
            label = 'Away',
            yvalue = (awayarray.length)/2
        }
        else if (myPin.read()==1 && myPin2.read()==1) {
            xvalue = 'Sitting',
            label = 'Sitting',
            yvalue = (sitarray.length)/2    
          }
        var data = { 'x': xvalue, 'y': yvalue, 'name': label};
        // console.log('Away: ' + awayarray);
        // console.log('Sit: ' + sitarray);
        // console.log('Stand: ' + standarray);
        console.log("Sending", JSON.stringify(data));
        stream.write(JSON.stringify(data) + '\n');
    };
};


function sendData(token, refreshRate) {
    var plotly = require('plotly')(myUser, myApi);
    var data = {
        'x': [] // empty arrays since we will be streaming our data to into these arrays
            ,
        'y': [],
        'name': [],
        'type': 'bar',
        'marker': {
            'color': '#666666'
        },
        stream: {
            "token": token
            //"maxpoints": 500
        }
    }

    var layout = {
        "filename": 'Time in Each Position ' + getTitle(),
        "fileopt": "overwrite",
        "layout": {
            autosize:true,
            "yaxis":{
            	title:"minutes",
                showgrid:false
                }
        },
        "world_readable": true,
        title:"Time in Each Position"
    };



    plotly.plot(data, layout, function(err, msg) {
        if (err) {
            return console.log(err);
        }
        console.log(msg);

        var myStream = plotly.stream(token, function(err, res) {
            if (err) return console.log(err);
        });

        // Loop forever
        setInterval(getMyDataFunction(myStream), refreshRate);
    });
};

sendData(myToken, refresh);

