var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var fs = require("fs");
var client = new Twitter(keys.twitterKeys);
var spotify = new Spotify(keys.spotifyKeys);

liri(process.argv[2], process.argv[3])

function liri(action, data) {

    switch (action) {
        case "my-tweets":
            appendLogFile("-- my-tweets --")
            var twitterParams = {
                screen_name: 'catfactbot',
                tweet_mode: 'extended',
                count: 20

            };
            client.get('statuses/user_timeline', twitterParams, function (error, tweets, response) {
                if (!error) {
                    for (var i = 0; i < tweets.length; i++) {

                        appendLogFile(tweets[i].full_text);
                        appendLogFile(tweets[i].created_at);

                        console.log(tweets[i].full_text);
                        console.log(tweets[i].created_at);
                    }
                    appendLogFile("-----------")
                }
            });
            break;
        case "spotify-this-song":
            var song = data;
            appendLogFile("-- spotify-this-song --")

            if (song == null) {
                spotify
                    .request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
                    .then(function (data) {
                        var songInfo = data;

                        appendLogFile("Artist: " + songInfo.artists[0].name)
                        appendLogFile("Song Name: " + songInfo.name)
                        appendLogFile("Album: " + songInfo.album.name)
                        appendLogFile("Preview Song: " + songInfo.preview_url)

                        console.log("Artist: " + songInfo.artists[0].name)
                        console.log("Song Name: " + songInfo.name)
                        console.log("Album: " + songInfo.album.name)
                        console.log("Preview Song: " + songInfo.preview_url)

                        appendLogFile("-----------")
                    })
                    .catch(function (err) {
                        console.error('Error occurred: ' + err);
                    });
            } else {

                spotify.search({
                    type: 'track',
                    query: song,
                    limit: 1
                }, function (err, data) {
                    if (err) {
                        return console.log('Error occurred: ' + err);
                    } else {
                        var songInfo = data.tracks.items[0];

                        appendLogFile("Artist: " + songInfo.artists[0].name)
                        appendLogFile("Song Name: " + songInfo.name)
                        appendLogFile("Album: " + songInfo.album.name)
                        appendLogFile("Preview Song: " + songInfo.preview_url)

                        console.log("Artist: " + songInfo.artists[0].name)
                        console.log("Song Name: " + songInfo.name)
                        console.log("Album: " + songInfo.album.name)
                        console.log("Preview Song: " + songInfo.preview_url)

                        appendLogFile("-----------")
                    }
                });
            }

            break;
        case "movie-this":
            var movie = data;

            if (movie === null || movie === undefined) {
                movie = "Mr. Nobody"
            }

            appendLogFile("-- movie-this --")
            request("http://www.omdbapi.com/?apikey=" + keys.omdbKeys.key + "&t=" + movie, function (error, response, body) {

                if (!error && response.statusCode === 200) {
                    appendLogFile("Title: " + JSON.parse(body).Title);
                    appendLogFile("Year: " + JSON.parse(body).Year);
                    appendLogFile("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
                    appendLogFile("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                    appendLogFile("Production Country: " + JSON.parse(body).Country);
                    appendLogFile("Language: " + JSON.parse(body).Language);
                    appendLogFile("Plot: " + JSON.parse(body).Plot);
                    appendLogFile("Actors: " + JSON.parse(body).Actors);

                    console.log("Title: " + JSON.parse(body).Title);
                    console.log("Year: " + JSON.parse(body).Year);
                    console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
                    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                    console.log("Production Country: " + JSON.parse(body).Country);
                    console.log("Language: " + JSON.parse(body).Language);
                    console.log("Plot: " + JSON.parse(body).Plot);
                    console.log("Actors: " + JSON.parse(body).Actors);
                } else {
                    console.log(error)
                }
                appendLogFile("-----------")
            });
            break;
        case "do-what-it-says":
            fs.readFile("random.txt", "utf8", function (error, data) {

                if (error) {
                    return console.log(error);
                }

                // Then split it by commas (to make it more readable)
                var randomFileData = data.split(",");
                liri(randomFileData[0], randomFileData[1]);
            });
            break;
        default:
            console.log("Does not compute. Try again.");
            break;
    }
}

function appendLogFile(text) {
    fs.appendFile("log.txt", text + "\n", function (err) {
        if (err) {
            console.log(err);
        }
    })
}