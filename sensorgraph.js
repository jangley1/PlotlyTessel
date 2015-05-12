var tessel = require('tessel');
var myPin = tessel.port['GPIO'].pin['G3'];
var myPin2 = tessel.port['GPIO'].pin['G4'];

var myUser = "jangley1";
var myApi = "xojqlgubes";
var myToken = 'zvygzif4bz';

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
var getMyDataFunction = function(stream) {
    return function() {
        var myDate = new Date() 
        var time = (myDate.getHours() -4) + ":" + ('0'+myDate.getMinutes()).slice(-2);
        var yvalue = null;
        var label = null;
        if (myPin.read()==0) {
            yvalue = 2,
            label = 'Standing'
        }
        else if (myPin2.read()==0) {
            yvalue = 0
            label = 'Away'
        }
        else if (myPin.read()==1 && myPin2.read()==1) {
            yvalue = .5
            label = 'Sitting'      
          }
        var data = { 'x': time , 'y': yvalue, 'text': label};
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
        'type': 'bar',
        'text': [],
        'marker': {
            'color': '#00005C'
        },
        stream: {
            "token": token
            //"maxpoints": 500
        }
    }

    var layout = {
        "filename": getTitle(),
        "fileopt": "overwrite",
        "layout": {
            autosize:true,
            "title": getTitle(),
            bargap: 0, 
            "yaxis":{
                type:"linear",
                showgrid:false,
                domain:[
                  0,
                  1
                ],
                showticklabels:false,
                range:[
                  0,
                  2
                ],
                autorange:false
                },
            "xaxis":{
              type:"category",
              autorange:true
            }
        },
        "world_readable": true
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
