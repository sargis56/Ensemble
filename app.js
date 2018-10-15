//import modules
var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var websocket = require('ws');
var querystring = require('querystring');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var exbars = require('exbars');


//import classes
// var Room = require('./Room.js');
// var User = require('./User.js');
// var Song = require('./Song.js');


// var rooms = [];
// var room = new Room("Test Name", "password");
// rooms.push(room);

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

var client_id = '2b7eab7f84fb470486ef8aafbe0715c4'; // Your client id
var client_secret = '00e168b4afb2401788422276f37224da'; // Your secret
var redirect_uri = 'http://localhost:8080'; // Your redirect uri

var stateKey = 'spotify_auth_state';


app.get('/login', function (req, res) {

    var scope = 'user-read-private user-read-email';
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
        res.render('loggedout', {title : "Please Log In", message : "you are logged out", layout: false });

    } else {
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

                // we can also pass the token to the browser to make requests from there
                // res.redirect('/#' +
                //     querystring.stringify({
                //         access_token: access_token,
                //         refresh_token: refresh_token
                //     })
                // );
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
});


app.get('/lobby', function (req, res) {
    res.sendFile(__dirname + '/lobby.html');
});

// app.get('/room.html', function (req, res) {
//     res.sendFile(__dirname + '/room.html');
// });
app.get('/SearchView.js', function (req, res) {
    res.sendFile(__dirname + '/SearchView.js');
});

console.log('Listening on 8080');
app.listen(8080);