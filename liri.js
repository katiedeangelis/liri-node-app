var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var client = new Twitter(keys.twitterKeys);
var spotify = new Spotify(keys.spotifyKeys);

switch (process.argv[2]) {
    case "my-tweets":
        var twitterParams = {
            screen_name: 'catfactbot',
            tweet_mode: 'extended',
            count: 1

        };
        client.get('statuses/user_timeline', twitterParams, function (error, tweets, response) {
            if (!error) {
                for (var i = 0; i < tweets.length; i++) {
                    console.log(tweets[i].full_text);
                    console.log(tweets[i].created_at);
                }
            }
        });
        break;
    case "spotify-this-song":
        var song = process.argv[3];

        searchSong(song);
        
        break;
    case "movie-this":
        var movie = process.argv[3];

        if (movie === null || movie === undefined) {
            movie = "Mr. Nobody"
        }

        request("http://www.omdbapi.com/?apikey=" + keys.omdbKeys.key + "&t=" + movie, function (error, response, body) {

            if (!error && response.statusCode === 200) {
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
        });
        break;
    default:
        console.log("Does not compute. Try again.");
        break;
}

function searchSong(song) {

    if (song == null) {
        spotify
            .request('https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE')
            .then(function (data) {
                var songInfo = data;
                console.log("Artist: " + songInfo.artists[0].name)
                console.log("Song Name: " + songInfo.name)
                console.log("Album: " + songInfo.album.name)
                console.log("Preview Song: " + songInfo.preview_url)
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
                console.log("Artist: " + songInfo.artists[0].name)
                console.log("Song Name: " + songInfo.name)
                console.log("Album: " + songInfo.album.name)
                console.log("Preview Song: " + songInfo.preview_url)
            }
        });
    }
}