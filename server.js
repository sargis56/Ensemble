//import modules

var express = require('express'); 
/**
 * Express web server framework
 * https://expressjs.com/en/api.html
*/

var request = require('request'); 
/** 
 * Library to easily make https requests. 
 * Really simplifies communication from our node server to spotify.
 * https://github.com/request/request
*/

var websocket = require('ws');
/**
 * Websocket Server module.
 * Create socket connections and send socket messages.
 * https://github.com/websockets/ws
*/

var querystring = require('querystring');
/**
 * Module to quickly make url query strings from key value arrays;
 * ex: querystring.stringify({
 *  name: 'daniel',
 *  email: 'dan@email.com'
 * })
 * https://nodejs.org/api/querystring.html
*/

var cookieParser = require('cookie-parser');
/**
 * Cookie parser for express server
 * ex: req.cookies;
 * https://github.com/expressjs/cookie-parser
*/

var exbars = require('exbars');
/**
 * Handlebar template engine for express.
 * ex: res.render('index', {title: 'Welcome!'});
 * https://github.com/YoussefKababe/exbars
*/

//end of module import


//Import Custom Javascript Classes

var Room = require('./Room.js');
var RoomList = require('./RoomList.js');
var User = require('./User.js');
var Song = require('./Song.js');

//End of Javascript Class Import;


//Create Static Variables


/**
 * Variables used for spotify app integration. These are found in the spotify app dashboard. 
 * Redirect urls must be whitelisted in the spotify dashboard first.
*/
var client_id = '2b7eab7f84fb470486ef8aafbe0715c4'; 
var client_secret = '52c420a710134fa5b102d6d5c3e6ad3e';
var redirect_uri = 'http://localhost:8080';
var stateKey = 'spotify_auth_state';

//End of static variables


//Server Setup
var app = express();

app.engine('hbs', exbars({defaultLayout: 'main'}));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public')).use(cookieParser());


var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

app.get('/jquery-3.3.1.min.js', function (req, res) {
    res.sendFile(__dirname + '/jquery-3.3.1.min.js');
});





/*When the user's browser is directed to /login the webserver redirects them 
to the spotify login page, passing in our app credentials and a redirect url
for it to redirect the users back to*/ 
app.get('/login', function (req, res) {

    var scope = 'streaming user-modify-playback-state user-read-private user-read-email';//["streaming", "user-read-birthdate", "user-read-email", "user-read-private"]
    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // res.sendFile(__dirname + '/login.html');
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));

});



app.get('/', function (req, res) {

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        // res.redirect('/#' +
        //     querystring.stringify({
        //         error: 'state_mismatch'
        //     }));

        /*User is not logged in. Direct them to the loggin view*/
        res.render('loggedout', {title : "Please Log In", message : "you are logged out", layout: false });

    } else {
        
        //User is logged in. request access code from spotify using authorization_code method
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {

                var access_token = body.access_token,
                    refresh_token = body.refresh_token;

                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };

                // use the access token to access the Spotify Web API
                request.get(options, function (error, response, body) {
                    console.log(body);
                    console.log(access_token);

                    var data = [];
                    data['access_token'] = access_token; 
                    data['title'] = "Logged In"; 
                    data['layout'] = false; 
                    data['username'] = body['id'];

                    // res.redirect('/room');//.html' + ?access_token=' + access_token);
                    res.render('loggedin', data)

                });
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
});

console.log('Listening on 8080');
app.listen(8080);