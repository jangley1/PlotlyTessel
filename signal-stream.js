// console.log("Loading signal-stream.js");

// console.log("Creating a Signal stream…");
/*
 * random signal stream options
 * Plotly only accepts stringified newline seperated JSON
 * so the separator is very important
 */


///// Setup plot



// setInterval(function() {
//     var data = { 'x': Date.now(), 'y': Math.random()*10 };
//     var dataToPush = JSON.stringify(data) + '\n';
//     signalstream.push(dataToPush);
// }, 250);

var myDate = new Date()
var splitDate = myDate.toString().split(' ')
var titleMonth = splitDate[1]
var titleDay = splitDate[2]
var titleYear = splitDate[3]
var titleDate = titleMonth + ' ' + titleDay + ", " + titleYear


function setupPlot(token, title, callback) {
    var Plotly = require('plotly')(); // Load Plotly _and execute the function_

    Plotly['apiKey'] = "xojqlgubes";
    Plotly['username'] = "jangley1";
    Plotly['token'] = token;

    console.log("Building a data object…");
    // build a data object - see https://plot.ly/api/rest/docs for information
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

    console.log("Building a layout…");
    // build your layout and file options
    var layout = {
        "filename": title,
        "fileopt": "overwrite",
        "layout": {
            "title": title
        },
        "world_readable": true
    }

    Plotly.plot(data, layout, function(err, resp) {
        if (err) return console.log("ERROR", err)

        console.log(resp);

        var plotlystream = Plotly.stream(token, function() {});

        var Readable = require('readable-stream').Readable;

        var signalstream = new Readable();
        signalstream._read = function() {};

        // Okay - stream to our plot!
        signalstream.pipe(plotlystream);
        callback();
    });
}

function sendData(token, x, y) {
    var Plotly = require('plotly')(); // Load Plotly _and execute the function_

    Plotly['apiKey'] = "xojqlgubes";
    Plotly['username'] = "jangley1";
    Plotly['token'] = token;

    /// Begin Plotting

    console.log("Building streaming HTTP request and Plotly object…")
    var hyperquest = require('hyperquest');

    //Function taken from https://gist.github.com/chriddyp/9882485 to generate an opts object for hyperequest
    function options(token) {
        return {
            method: 'POST',
            uri: "http://stream.plot.ly",
            port: 10101,
            headers: {
                "connection": "keepalive",
                "plotly-streamtoken": token //stream_token
            }
        }
    };

    var myOptions = options(token);

    var plotly = hyperquest(myOptions);

    plotly.on("error", function(err) {
        console.log(err)
    })

    var Readable = require('readable-stream').Readable;

    var signalstream = new Readable();
    signalstream._read = function() {};


    console.log("Beginning to stream!");

    var data = {
        'x': x,
        'y': y
    };
    var dataToPush = JSON.stringify(data) + '\n';
    signalstream.push(dataToPush);


    // Okay - stream to our plot!
    signalstream.pipe(plotly);
}

setupPlot("zvygzif4bz", titleDate, function() {
    sendData("zvygzif4bz", 10, 10);
});
