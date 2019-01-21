require("dotenv").config();
var Spotify = require('node-spotify-api');
var spotifyKeys = require("./keys.js");
var fs = require("fs");
var request = require('request');
var moment = require('moment');
var spotify = new Spotify(spotifyKeys.spotify);
var arg = process.argv;
var input = "";
var argLow = "";

//not working entirely, nned to revise

//build input string
for (var i = 3; i < arg.length; i++) {
    if (i > 3 && i < arg.length) {
        input = input + " " + arg[i];
    }
    else {
        input += arg[i];
    }
}

function concertThis(band) {
    if (!band) {
        return console.log("\nPlease enter a program choice and corresponding search query:\n\n> concert-this <band name here>\n> spotify-this-song <song name here>\n> movie-this <movie name here>\n> do-what-it-says");
    }
    request("https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp", function (error, response, body) {
        body = JSON.parse(body);
        if (error) {
            return console.log('error:', error);
        }//end error
        if (!error && response.statusCode === 200) {
            console.log("\n\n<==========> Here are your results <==========>\n");
            for (var i = 0; i < body.length; i++) {
                var lineup = body[i].lineup.join(", ");
                var venueName = body[i].venue.name;
                if (body[i].venue.region === "") {
                    var venueLoc = body[i].venue.city + ", " + body[i].venue.country;
                }
                else {
                    var venueLoc = body[i].venue.city + ", " + body[i].venue.region;
                }
                var venueDate = moment(body[i].datetime).format("MM/DD/YYYY, h:mm:ss a");
                console.log(
                    "Lineup: " + lineup + ".\n"
                    + "Venue: " + venueName + ".\n"
                    + "Location: " + venueLoc + ".\n"
                    + "Date/Time: " + venueDate + "."
                    + "\n----------------------------------------\n"
                );//end string build
            }//end for
        }//end bandintown api call
    });//end request
}//end concert-this function

function spotifyThisSong(song) {
    if (!song) {
        return console.log("\nPlease enter a program choice and corresponding search query:\n\n> concert-this <band name here>\n> spotify-this-song <song name here>\n> movie-this <movie name here>\n> do-what-it-says");
    }
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("\n\n<==========> Here are your results <==========>\n");
        for (var i = 0; i < data.tracks.items.length; i++) {
            var artist = data.tracks.items[i].artists[0].name;
            var trackName = data.tracks.items[i].name;
            var preview_url = data.tracks.items[i].preview_url;
            var albumName = data.tracks.items[i].album.name;
            console.log(
                "Artist: " + artist + ".\n"
                + "Song: " + trackName + ".\n"
                + "Preview Link: " + preview_url + ".\n"
                + "Album: " + albumName + "."
                + "\n----------------------------------------\n"
            );//end string build
        }//end for
    });//end node-spotify-api call
}//end spotify-this-song

function movieThis(movie) {
    request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
        body = JSON.parse(body);
        if (error) {
            //return console.log('error:', error);
            return console.log("please enter a valid movie")
        }//end error
        if (movie === "Mr. Nobody") {
            console.log("\n\nIf you havent seen '" + nobody + ",' then you should: http://www.imdb.com/title/" + body.imdbID + "\nIt's on Netflix!")
        }
        if (!error && response.statusCode === 200) {
            console.log("\n\n<==========> Here are your results <==========>\n");
            console.log(
                "* Title: " + body.Title + "\n" +
                "* Year: " + body.Year + "\n" +
                "* Rating: " + body.Ratings[1].Value + "\n" +
                "* Country: " + body.Country + "\n" +
                "* Language: " + body.Language + "\n" +
                "\n* Plot: " + body.Plot + "\n\n" +
                "* Actors: " + body.Actors
            );
        }//end movie-this return
    });//end request
}//end movie-this

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }//end error
        var dataArr = data.split(",");
        dataArr[1] = dataArr[1].replace(/"/g, ''); //remove " from random.txt
        switch (dataArr[0]) {
            case "concert-this":
                concertThis(dataArr[1]);
                break;//end concert-this
            case "spotify-this-song":
                spotifyThisSong(dataArr[1]);
                break;//end spotify-this-song
            case "movie-this":
                movieThis(dataArr[1]);
                break;//end movie-this
        }//end nested switch
    })//end readfile
}
//check for enough args
if (arg[2]){
    argLow = arg[2].toLowerCase();
}
switch (argLow) {
    case "concert-this":
        concertThis(input);
        break;//end concert-this
    case "spotify-this-song":
        if (arg.length > 3) {
            spotifyThisSong(input);
        }
        else {
            var sign = "The Sign, Ace of Base";
            spotifyThisSong(sign);
        }
        break;//end spotify-this-song
    case "movie-this":
        if (arg.length > 3) {
            movieThis(input);
        }
        else {
            var nobody = "Mr. Nobody";
            movieThis(nobody);
        }
        break;//end movie-this
    case "do-what-it-says":
        doWhatItSays();
        break;//end do-what-it-says
    default:
        console.log("\nPlease enter a program choice and corresponding search query:\n\n> concert-this <band name here>\n> spotify-this-song <song name here>\n> movie-this <movie name here>\n> do-what-it-says");
}//end switch