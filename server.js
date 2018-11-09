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

var WebSocket = require('ws');
/**
 * Websocket Server module.
 * Create socket connections and send socket messages.
 * https://github.com/websockets/ws
*/

var mysql = require('mysql');


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

var Rooms = require('./Rooms').default;
var Song = require('./Room').default;



//End of Javascript Class Import;


//Create Variables

//use these instead of database
var rooms = new Rooms();

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

app.engine('hbs', exbars({ defaultLayout: 'main' }));
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

const wss = new WebSocket.Server({ port: 8181 });


wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log(message);

        var SocketData = JSON.parse(message);
        var event = SocketData.event;
        var data = SocketData.data;

        switch (event) {
            case "room-connect":
                var user_id = data.username;
                var room_id = data.room_id;
                rooms.addClient(room_id, user_id, ws);
                break;
            case "room-disconnect":
                var user_id = data.username;
                var room_id = data.room_id;
                rooms.removeClient(room_id, user_id);
                break;
            case "room-":

                break;
        }

        // ws.send(message);
    });
});

//client side websocket plugin
app.get('/ws_events_dispatcher.js', function (req, res) {
    res.sendfile(__dirname + '/ws_events_dispatcher.js');
});

app.get('/jquery-3.3.1.min.js', function (req, res) {
    res.sendFile(__dirname + '/jquery-3.3.1.min.js');
});
app.get('/styles.css', function (req, res) {
    res.sendFile(__dirname + '/styles.css');
});

/**
 * The callback url for spotify after login.
 * If all is good we store neccessary variables in the session
*/
app.get('/callback', function (req, res) {
    var code = req.query.code || null;
    var state = req.query.state || null;

    if (code === null) {

    } else {
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

                console.log("Scopes ", body.scope);
                console.log("Token type ", body.token_type);
                req.session.refresh_token = body.refresh_token;

            } else {

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

    if (req.session.access_token) {
        // console.log('user access code is saved in sesssion', req.session.access_token);
        // console.log(req.session.refresh_token);

        let refresh_token = req.session.refresh_token;
        let access_token = req.session.access_token;
        let user_id = req.session.user_id;
        var code = req.session.userAccessCode;


        //new user create them and log in

        //get spotify user details
        var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        };

        request.get(options, function (error, response, body) {

            if (body.id === null) {
                //error getting user details
                var data = [];
                data['error'] = "There was an error getting your user details from spotify";
                data['layout'] = false;
                res.render('loggedout', data);
            }
            else {
                user_id = body.id;
                insertUser(user_id, access_token);
                req.session.user_id = user_id;

                var data = [];
                data['access_token'] = access_token;

                data['title'] = "Logged In";
                data['layout'] = false;
                res.render('loggedin', data);

            }
        });
    } else {
        console.log('user access code is not saved in session. user needs to login');
        res.render('loggedout', { title: "Please Log In", message: "you are logged out", layout: false });
    }

});


//Room page
app.get('/room', function (req, res) {

    //check that we are logged in. and have a room id storred
    if (req.session.access_token != null && req.session.room_id != null) {
        //check database for room;
        var room = getRoomExists(req.session.room_id);

        if (room !== false) {

            //check if user is admin
            var roomAdminId = getRoomAdminId(req.session.room_id);
            var isAdmin = false;
            if (roomAdminId == req.session.user_id) {
                isAdmin = true;
            }

            var data = [];
            data['access_token'] = req.session.access_token;
            data['refresh_token'] = req.session.refresh_token;
            data['user_id'] = req.session.user_id;
            data['room_id'] = req.session.room_id;
            console.log("room id for data send", req.session.room_id);
            data['isAdmin'] = isAdmin;
            data['layout'] = false;
            if (isAdmin) {
                res.render('room_admin', data);
            } else {
                res.render('room', data);
            }

        } else {
            console.log("Room no longer exists");
            req.session.room_id = null;
            res.redirect('/');
        }


    } else {
        //not logged in. not supposed to be here
        console.log("user is not in any rooms");
        console.log("access_token", req.session.access_token);
        console.log("room_id", req.session.room_id);
        res.redirect('/');
        console.log("session room  id", req.session.room_id);
    }

});


//Server - Client Asynchronous Communication End Points

//create room
app.get('/createRoom', function (req, res) {
    var room_name = req.query.roomName || null;
    var room_password = req.query.roomPassword || null;
    var userAccessToken = req.query.userAccessToken;
    var user_id = req.session.user_id;

    var data = {};
    if (room_name === null || room_password === null || userAccessToken === null) {
        data['error'] = 'You did not complete all of the form fields';
        res.send(data);
    } else {

        var connection;
        var result ="not set";
        mysql.createConnection(connectionCredentials).then(function (conn) {
            connection = conn;
            return connection.query("Select count(*) as count from rooms where room_name = '" + room_name + "' ");
        }).then(function (rows) {
            var count = rows[0].count;
            console.log("room count for that name", count)
            if (count > 0) {

            } else {

                connection.query("insert into rooms (room_name, room_password, room_admin_user_id) values( '" + room_name + "' , '" + room_password + "' , '" + user_id + "' )");

            }
            return count;
        }).then(function (count) {
            if (count > 0) {
                connection.end();
                result = false;
                return false;
            } else {
                result = true;
                return connection.query("Select room_id as id from rooms where room_name = '" + room_name + "' ");
            }
        }).then(function (rows) {
            if (rows != false) {
                console.log("select from rooms for room id", result);
                result = rows[0].id;
                connection.end();
            }else{
                result = null;
            }
            return result;

        }).then(function(room_id){
            if (room_id == false) {
                data['error'] = "Room exists";
                console.log("room not created in database");
    
            } else {
                data['success'] = "Room created";
                console.log("room created in database");
                
                req.session.room_id = room_id;
            }
            res.send(data);
        });
    }
});

//Join room
app.get('/joinRoom', function (req, res) {

    let room_name = req.query.roomName || null;
    let room_password = req.query.roomPassword || null;
    let userAccessToken = req.query.userAccessToken;//=  //req.query.user secret or something

    var data = {};
    if (room_name === null || room_password === null || userAccessToken === null) {
        data['error'] = 'You did not complete all of the form fields';
        res.send(data);
    } else {

        var connection;
        var result ="not set";
        mysql.createConnection(connectionCredentials).then(function (conn) {
            connection = conn;
            return connection.query("Select room_id, room_name, room_password, room_admin_user_id from rooms where room_name = '" + room_name + "' and room_password = '" + room_password + "' ");
        }).then(function (rows) {
            var count = rows[0].count;
            console.log("room count for that name", count)
            if (count > 0) {

            } else {

                connection.query("insert into rooms (room_name, room_password, room_admin_user_id) values( '" + room_name + "' , '" + room_password + "' , '" + user_id + "' )");

            }
            return count;
        })
    }
});

//url: '/getUserList'
app.get('/getUserList', function (req, res) {
    var user = users.getUserList();
    var roomid = req.query.room;
    res.send(user);
});

//leave room
app.get('/leaveRoom', function (req, res) {

});

//add song to room

//get room songs


//get room now playing


console.log('Listening on 8080');
app.listen(process.env.PORT || 8080);



function getUsers() {
    var connection = mysql.createConnection({
        host: 'us-cdbr-iron-east-01.cleardb.net',
        user: 'ba4392ebdbcb5e',
        password: 'a3629f9c',
        database: 'heroku_a06745153006398'
    });

    connection.connect();

    connection.query('SELECT * from users', function (err, rows, fields) {
        if (err) {
            console.log('error: ', err);
            throw err;
        }
        console.log('Hello World!!!! HOLA MUNDO!!!!', rows);
    });
    connection.end();

}
/*
function getUser(user_id) {
    var connection = mysql.createConnection({
        host: 'us-cdbr-iron-east-01.cleardb.net',
        user: 'ba4392ebdbcb5e',
        password: 'a3629f9c',
        database: 'heroku_a06745153006398'
    });

    connection.connect();
    var foundUserId;
    connection.query("SELECT * from users where user_id = '" + user_id + "' ", function (err, rows, fields) {
        if (err) {
            console.log('error: ', err);
            throw err;
        }
        console.log('user 0', rows);
        foundUserId = user_id;
        selectUser(connection, foundUserId);
    });
    // console.log("found user id between two querys" , foundUserId);
    
    
}
*/

var mysql = require('promise-mysql');

var connectionCredentials = {
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'ba4392ebdbcb5e',
    password: 'a3629f9c',
    database: 'heroku_a06745153006398'
};



function insertUser(user_id, access_token) {

    var connection;
    mysql.createConnection(connectionCredentials).then(function (conn) {
        connection = conn;
        return connection.query("Select count(user_id) as count from users where user_id = '" + user_id + "' ");
    }).then(function (rows) {
        var count = rows[0].count;

        if (count > 0) {
            //update access code
            connection.query("Update users set access_token ='" + access_token + "' where user_id = '" + user_id + "' ");
            connection.end();

        } else {
            //insert new user
            connection.query("insert into users (user_id, access_token) values( '" + user_id + "' , '" + access_token + "' )");
            connection.end();

        }
        return count;
    }).then(function (rows) {
        // Logs out a ring that Frodo owns
        console.log("user count was", rows);
    });
}




//rooms

function insertRoom(room_name, room_password, user_id) {

    var connection;
    var result ="not set";
    mysql.createConnection(connectionCredentials).then(function (conn) {
        connection = conn;
        return connection.query("Select count(*) as count from rooms where room_name = '" + room_name + "' ");
    }).then(function (rows) {
        var count = rows[0].count;
        console.log("room count for that name", count)
        if (count > 0) {

        } else {

            connection.query("insert into rooms (room_name, room_password, room_admin_user_id) values( '" + room_name + "' , '" + room_password + "' , '" + user_id + "' )");

        }
        return count;
    }).then(function (count) {
        if (count > 0) {
            connection.end();
            result = false;
            return false;
        } else {
            result = true;
            return connection.query("Select room_id as id from rooms where room_name = '" + room_name + "' ");
        }
    }).then(function (rows) {
        if (rows != false) {
            console.log("select from rooms for room id", result);
            result = rows[0].id;
            connection.end();
        }
        return result;

    });
    console.log("insert room result", result);
    return result;
}

function getRoomExists(room_id){
    var connection;
    var result;
    mysql.createConnection(connectionCredentials).then(function (conn) {
        connection = conn;
        return connection.query("Select count(*) as count from rooms where room_id = '" + room_id + "' ");
    }).then(function (rows) {
        var count = rows[0].count;
        if (count > 0) {
            connection.end();
            result = true;
        } else {
            connection.end();
            result = false;
        }
    });

    return result;
}

function getRoomAdminId(room_id){
    var connection;
    var result;
    mysql.createConnection(connectionCredentials).then(function (conn) {
        connection = conn;
        return connection.query("Select room_admin_user_id as id from rooms where room_id = '" + room_id + "' ");
    }).then(function (rows) {
        result = rows[0].id;
    });

    return result;
}