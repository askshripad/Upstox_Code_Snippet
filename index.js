//Initilization:
var Upstox = require("upstox");
var express = require('express');

const PORT = 5000;
const HOST = 'localhost';

var app = express();
var apisecret = '4reu7odzxb';
var apikey = 'LeFF9WSs5B8UFDnU2S2Xo3wBJm0TjKEpfHzs2W9i';

var upstox = new Upstox(apikey);
var redirectUrl = "http://localhost:3000";
var accessToken;
var feedsymbols = null;

// Add code start server
var server = app.listen(PORT, HOST, function () {
  var port = server.address().port;
  console.log('Algo Server is listening at ', port);

});


// Create Rest API
app.get('/login', function (req, res) {
  var input = require('./input.json');
  console.log('inside LOGIN :', input.code);

  var params = {
    "apiSecret": apisecret,
    "code": input.code,
    "redirect_uri": redirectUrl
  };

  upstox.getAccessToken(params)
    .then(function (response) {
      accessToken = response.access_token;
      upstox.setToken(accessToken);
      console.log('Success with token ' + accessToken);
	  CreateSocketConnection();
      res.send({ result: "Success with token " + accessToken });
    })
    .catch(function (err) {
      console.log('Error in login ', err);
    });

});

// Create Socket connection method
function CreateSocketConnection() {
    feedsymbols = 'nifty18dec10800ce,nifty18dec10850ce';
    upstox.connectSocket()
      .then(function () {
        console.log('socket connected successfully');
  
        upstox.subscribeFeed({
          "exchange": "nse_fo",
          "symbol": feedsymbols,
          "type": "full"
        })
          .then(function (response) {
            console.log('feedsymbols subscribeFeed response ', response);
          })
          .catch(function (error) {
            console.log('Error in subscribe feed ', error);
          });
  
        upstox.on("liveFeed", function (livedata) {
          console.log(livedata);
          // Add your startegy        
        });
        upstox.on("disconnected", function (message) {
          console.log('########### DISCONNECTED ############');        
        });
        upstox.on("error", function (error) {
          console.log('&&&&&&&&&&&& ERROR &&&&&&&&&&', error);        
        });
      }).catch(function (err) {
        console.log('Something went wrong : ', error);
      })
  }
  