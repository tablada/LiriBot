// DO NOT DELETE
require("dotenv").config();

// Variables (Loading Modules)
var keys = require('./keys.js');
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var spotify = new spotify(keys.spotify);
var client = new twitter(keys.twitter);


// Switch Functions
function execCmd(cmd, prm){
  switch(cmd){
  
    case "my-tweets":
      showTweets('tablada16');
    break;

    case 'spotify-this-song':
      spotifySong(prm);
    break;

    case "movie-this":
      omdbData(prm);
    break;

    case "do-what-it-says":
      doThing();
    break;

    default:
      console.log("Please enter a command: my-tweets, spotify-this-song, movie-this, or do-what-it-says");
    break;
  }
}

//Twitter API
function showTweets(){
  
  // Display last Tweets
  console.log('Displaying tweets: ');
  console.log("-----------------------");
  var screenName = {screen_name: 'tablada16'};
  client.get('statuses/user_timeline', screenName, function(error, tweets, response){
    if(!error){
      for(var i = 0; i < tweets.length; i++){
        console.log(tweets[i].created_at);
        console.log(tweets[i].text);
        console.log("-----------------------");
      }
    }
  });
}

// Spotify API
function spotifySong(){
  var song = 'HOUSTONFORNICATION';
  if (process.argv.length > 3){
    song = process.argv[3];
  }

  spotify.search({ type: 'track', query: song}, function(err, data){
    if(err){
      return console.log("Error occurred: " + err);
    }
    if (data != null) {
      var artists = data.tracks.items[0].artists[0].name;
      for(var i = 1; i < data.tracks.items[0].artists; i++){
        var artist =+ ", " + data.tracks.items[0].artists[i].name;       
      } 
        //artist
        console.log("Artist: " + artists);      
        //song name
        console.log("Song: " + data.tracks.items[0].name);
        //album name
        console.log("Album: " + data.tracks.items[0].album.name);        
        //spotify preview link
        console.log("Preview URL: " + data.tracks.items[0].preview_url);       
        console.log("-----------------------");
      }
    else { console.log('No song info'); }
  });
}

// Movie API
function omdbData(){

  var movie = "Inception";


  request("http://www.omdbapi.com/?t=" + encodeURI( movie ) + "&apikey=trilogy", function (error, response, body){
    if(!error && response.statusCode == 200){
      
      var body = JSON.parse(body);

      console.log("Title: " + body.Title);
      console.log("Release Year: " + body.Year);
      console.log("IMdB Rating: " + body.imdbRating);
      console.log("Country: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
      for (var i=0; i < body.Ratings.length; i++){
        console.log(body.Ratings[i].Source + " rating: " + body.Ratings[i].Value);
      }
      console.log("-----------------------");
    }

  });

}

// Do What I say
function doThing(){
  fs.readFile('random.txt', "utf8", function(error, data){
    if (error) {
      return console.log(error);
    }
    var dataArr = data.split(',');

    execCmd(dataArr[0], dataArr[1]);
  });
}

//Grab parameter input
var cmd = '';
if (process.argv.length > 2) {
    cmd = process.argv[2].toLowerCase();
}

var str = 'node liri.js ';
for ( var i = 2; i<process.argv.length; i++) {
    if ( i === 3 ) { 
        str += '"' + process.argv[i] + '"'; 
    }
    else { 
        str += process.argv[i]+' '; 
    }
}
str += '\n';

execCmd( cmd );