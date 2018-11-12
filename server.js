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


var session = require('express-session');
/**
 * 
*/

//end of module import


//Import Custom Javascript Classes

var User = require('./User');
var Room = require('./Room');
var Song = require('./Song');
var RoomList = require('./RoomList').default;
var UserList = require('./UserList').default;


//End of Javascript Class Import;


//Create Variables

//use these instead of database
var roomList = new RoomList();
var users = new UserList();

/**
 * Variables used for spotify app integration. These are found in the spotify app dashboard. 
 * Redirect urls must be whitelisted in the spotify dashboard first.
*/
var client_id = '2b7eab7f84fb470486ef8aafbe0715c4'; 
var client_secret = '52c420a710134fa5b102d6d5c3e6ad3e';
var redirect_uri = 'http://localhost:8080/callback';
var stateKey = 'spotify_auth_state';
var userSercretKey = 'user_secret_key'

//End of variables


//Server Setup
var app = express();

app.engine('hbs', exbars({defaultLayout: 'main'}));
app.set('view engine', 'hbs');
app.use(
    express.static(__dirname + '/public')).use(cookieParser()).use(session({
        'secret': 'ensemble rocks'
    }));


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

/**
 * The callback url for spotify after login.
 * If all is good we store neccessary variables in the session
*/
app.get('/callback', function (req, res) {
    var code = req.query.code || null;
    var state = req.query.state || null;

    if(code === null){

    }else{
        console.log(req.headers.host);
        var redirect = "http://" + req.headers.host + "/callback";

        req.session.userAccessCode = code;
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {

            if (!error && response.statusCode === 200) {

                //store tokens in session
                req.session.access_token = body.access_token;
                console.log("Scopes ",body.scope);
                console.log("Token type ",body.token_type);
                req.session.refresh_token = body.refresh_token;

            }else{

                // console.log(error);
                // console.log(body);
            }

            res.redirect('/');

        });
        
    }

});


/*When the user's browser is directed to /login the webserver redirects them 
to the spotify login page, passing in our app credentials and a redirect url
for it to redirect the users back to*/ 
app.get('/login', function (req, res) {

    var scope = "streaming user-modify-playback-state user-read-playback-state user-read-recently-played user-read-birthdate user-read-private user-read-email";//["streaming", "user-read-birthdate", "user-read-email", "user-read-private"]
    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    console.log(req.headers.host);
    var redirect = "http://" + req.headers.host + "/callback";
    // res.sendFile(__dirname + '/login.html');
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect
        }));
        //, state: state

});



//Routing
app.get('/', function (req, res) {

    if(req.session.refresh_token){
        console.log('user access code is saved in sesssion');
        // console.log(req.session.refresh_token);

        let refresh_token = req.session.refresh_token;
        let access_token = req.session.access_token;
        let user_id = "";
        var code = req.session.userAccessCode;

        //check if user with that access tokenalready exists
        var user = users.getUserByAccessToken(access_token);
        if(user === null){
            //new user create them and log in

            //get spotify user details
            var options = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };

            request.get(options, function (error, response, body) {

                if(body.id === null){
                    //error getting user details
                    var data = [];
                    data['error'] = "There was an error getting your user details from spotify";
                    data['layout'] = false;
                    res.render('loggedout', data);
                }
                else{
                    user_id = body.id;

                    //create user
                    user = users.NewUser( user_id , access_token );
                    console.log("new user recorded/updated");
                    // console.log(user);

                    var data = [];
                    data['access_token'] = access_token; 
        
                    data['title'] = "Logged In"; 
                    data['layout'] = false; 
                    res.render('loggedin', data);

                }
            });


        }else{
            //returning user
            console.log("user has returned");

            //load page
            var data = [];
            data['access_token'] = access_token; 

            data['title'] = "Logged In"; 
            data['layout'] = false; 
            res.render('loggedin', data);
        }
        
    }else{
        console.log('user access code is not saved in session. user needs to login');
        res.render('loggedout', {title : "Please Log In", message : "you are logged out", layout: false });
    }

});


//Room page
app.get('/room', function (req, res){

    //check that we are logged in.
    if(req.session.access_token){
        //logged in
        var user = users.getUserByAccessToken(req.session.access_token);

        //check if user is admin of any rooms
        var room = roomList.getAdminsRoom(user);
        var isAdmin = false;

        if(room === null){
            isAdmin = false;
            room = roomList.getContributorsRoom(user);
            if(room === null){
                //user is not in any room
                console.log("user is not in any room");
                res.redirect('/');
            }
        }else{
            isAdmin = true;
        }
        if(room === null){

        }else{
            var data = [];
            data['access_token'] = req.session.access_token;
            data['refresh_token'] = req.session.refresh_token;
            data['roomId'] = req.session.roomId;
            data['isAdmin'] = isAdmin;
            data['layout'] = false;
            if(isAdmin){
                res.render('room_admin', data);
            }else{
                res.render('room', data);
            }
        }

    }else{
        //not logged in. not supposed to be here
        console.log("user is not logged in");
        res.redirect('/');
    }

    
});


//Server - Client Asynchronous Communication End Points

//create room
app.get('/createRoom', function(req, res){
    let roomName = req.query.roomName || null;
    let roomPassword = req.query.roomPassword || null;
    let userAccessToken =  req.query.userAccessToken;//=  //req.query.user secret or something
    
    var data = {};
    if( roomName === null || roomPassword === null || userAccessToken === null){
        data['error'] = 'You did not complete all of the form fields';
        // console.log(data);

        // res.setHeader('Content-Type', 'application/json');
        res.send(data);
    }else{

        var user = users.getUserByAccessToken(userAccessToken);
        // console.log(user);

        var room = roomList.create(roomName, roomPassword, user);

        if(room === null){
            data['error'] = "Could not create room";
            // res.setHeader('Content-Type', 'application/json');
            // console.log(data);
            res.send(data);
        }else{
            // console.log(room);
            data['success'] = "Room created successfully";

            req.session.roomId = room.roomId;
            
            // res.setHeader('Content-Type', 'application/json');
            res.send(data);
        }
    }

  
});

//Join room
app.get('/joinRoom', function(req, res){

    let roomName = req.query.roomName || null;
    let roomPassword = req.query.roomPassword || null;
    let userAccessToken =  req.query.userAccessToken;//=  //req.query.user secret or something
    
    var data = {};
    if( roomName === null || roomPassword === null || userAccessToken === null){
        data['error'] = 'You did not complete all of the form fields';
        console.log(data);

        // res.setHeader('Content-Type', 'application/json');
        res.send(data);
    }else{
        var user = users.getUserByAccessToken(userAccessToken);
        console.log(user);

        var room = roomList.join(roomName, roomPassword, user);

        if(room === null){
            data['error'] = "Could not join room";
            data['message'] = roomList.getRoomByName(roomName);
            // res.setHeader('Content-Type', 'application/json');
            console.log(data);
            res.send(data);
        }else{
            console.log(room);
            data['success'] = "Room joined successfully";
            
            req.session.roomId = room.roomId;
            
            // res.setHeader('Content-Type', 'application/json');
            res.send(data);
        }
    }
});

//leave room
app.get('/leaveRoom', function(req, res){

});

//add song to room
app.get('/addSong', function(req, res){
    var songID = req.query.songID;
    var roomID = req.query.roomID;
   // var UserID = req.query.usertoken;

    var room = roomList.getRoomById(roomID);
//spotify get info on this song id
//var newsong = new Song(id name, artist); ================================

    room.addSong(songID);
    console.log(room);
    console.log(room.playlist);

    res.send(songID);
    

});


//get room songs

//get room now playing


console.log('Listening on 8080');
app.listen(process.env.PORT || 8080);
