
require("dotenv").config();


var fs = require("fs");
var moment = require("moment");
var keys = require("./keys.js");
var axios = require("axios");

const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
var omdb = (keys.omdb);
var bandsintown = (keys.bandsintown);


var command = process.argv[2];
var userQuery = process.argv.slice(3).join(" ");



function userCommand(command, userQuery) {

    switch (command) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this-song":
            spotifyThis();
            break;
        case "movie-this":
            movieThis();
            break;
        case "do-this":
            doThis(userQuery);
            break;
        default:
            console.log("I dont understand");
            break;
    }
}
userCommand(command, userQuery);


function concertThis() {
    var URL = "https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=codingbootcamp";

    axios.get(URL).then(function (response) {
        var jsonData = response.data[0];
        var divider = "\n------------------------------" + userQuery + "------------------------------\n\n";

        var bandData = [
            "Name of the venue: " + jsonData.venue.name,
            "Location: " + jsonData.venue.city,
            "Date of the Event: " + moment(jsonData.venue.datetime).format("MM/DD/YYYY")
        ].join("\n\n");

        console.log(divider + bandData + divider);

    })
};


function spotifyThis() {
    var divider = "\n------------------------------" + userQuery + "------------------------------\n\n";

    if (!userQuery) {
        userQuery = "the sign ace of base";
    };

    spotify.search({ type: 'track', query: userQuery, limit: 1 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        let spotifyArr = data.tracks.items;

        for (var i = 0; i < spotifyArr.length; i++) {


            console.log(divider);
            console.log("\n\nArtist(s): " + data.tracks.items[i].album.artists[0].name);
            console.log("\nSong: " + data.tracks.items[i].name);
            console.log("\nSpotify Link: " + data.tracks.items[i].external_urls.spotify);
            console.log("\nAlbum: " + data.tracks.items[i].album.name);
            console.log(divider);
        }
    })
};


function movieThis() {
    if (!userQuery) {
        userQuery = "mr nobody";
    };

    var divider = "\n------------------------------" + userQuery + "------------------------------\n\n";

    var URL = "http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&apikey=trilogy";

    axios.get(URL).then(function (response) {
        var jsonData = response.data;

        console.log(jsonData.Ratings[1].Value);
        var movieData = [
            "Title: " + jsonData.Title,
            "Year: " + jsonData.Year,
            "IMDB Rating: " + jsonData.Ratings[0].Value,
            "Rotten tomatoes Rating: " + jsonData.Ratings[1].Value,
            "Country Produced: " + jsonData.Country,
            "Language: " + jsonData.Language,
            "Plot: " + jsonData.Plot,
            "Actors: " + jsonData.Actors
        ].join("\n\n");

        console.log(divider + movieData + divider);

    })

};

function doThis() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) { return console.log(error); }
        console.log(data);
        var dataArr = data.split(",");

        command = dataArr[0];
        userQuery = dataArr[1];

        userCommand(command, userQuery);
    })
};
