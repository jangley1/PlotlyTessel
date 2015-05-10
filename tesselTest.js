var tessel = require('tessel');

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

var refresh = 250;
var getMyDataFunction = function(stream) {
    return function() {
        var data = {
            'x': Date.now(),
            'y': Math.random() * 10
        }

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
        marker: {
            color: "rgba(31, 119, 180, 0.96)"
        },
        stream: {
            "token": token,
            "maxpoints": 100
        }
    }

    var layout = {
        "filename": getTitle(),
        "fileopt": "overwrite",
        "layout": {
            "title": getTitle()
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

sendData(myToken, 250);
