var express = require('express'); // Express web server framework

var app = express()

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/login.html');
});

app.get('/jquery-3.3.1.min.js', function (req, res) {
    res.sendFile(__dirname + '/jquery-3.3.1.min.js');
});

app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/login.html');
});

app.get('/lobby', function (req, res) {
    res.sendFile(__dirname + '/lobby.html');
});

app.get('/Room', function (req, res) {
    res.sendFile(__dirname + '/room.html');
});

console.log('Listening on 8888');
app.listen(8888);