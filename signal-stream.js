console.log("Loading signal-stream.js");

var Plotly = require('plotly')(); // Load Plotly _and execute the function_

Plotly['apiKey'] = ""; // Personal API key
Plotly['username'] = ""; // Username
Plotly['token'] = ""; // Stream token

console.log("Building a data object…");
// build a data object - see https://plot.ly/api/rest/docs for information
var data = {
    'x': [] // empty arrays since we will be streaming our data to into these arrays
        ,
    'y': [],
    'type': 'scatter',
    'mode': 'lines+markers',
    marker: {
        color: "rgba(31, 119, 180, 0.96)"
    },
    line: {
        color: "rgba(31, 119, 180, 0.31)"
    },
    stream: {
        "token": Plotly.token,
        "maxpoints": 100
    }
}

console.log("Building a layout…");
// build your layout and file options
var layout = {
    "filename": String(new Date()),
    "fileopt": "overwrite",
    "layout": {
        "title": String(Date.now())
    },
    "world_readable": true
}

console.log("Creating a Signal stream…");
/*
 * random signal stream options
 * Plotly only accepts stringified newline seperated JSON
 * so the separator is very important
 */

// Function taken from https://gist.github.com/chriddyp/9882485 to generate an opts object for hyperequest
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

///// Setup plot


var Readable = require('readable-stream').Readable;

var signalstream = new Readable();
signalstream._read = function () {};

setInterval(function() {
    var data = { 'x': Date.now(), 'y': Math.random()*10 };
    var dataToPush = JSON.stringify(data) + '\n';
    signalstream.push(dataToPush);
}, 250);


Plotly.plot(data, layout, function(err, resp) {
    if (err) return console.log("ERROR", err)

    console.log(resp)

    var plotlystream = Plotly.stream(Plotly.token, function() {});

    // Okay - stream to our plot!
    signalstream.pipe(plotlystream);
});



///// Begin Plotting

console.log("Building streaming HTTP request and Plotly object…")
var hyperquest = require('hyperquest');
var myOptions = options(Plotly.token);

var plotly = hyperquest(myOptions);

plotly.on("error", function(err) {
    console.log(err)
})

console.log("Beginning to stream!");
// Okay - stream to our plot!
signalstream.pipe(plotly);
