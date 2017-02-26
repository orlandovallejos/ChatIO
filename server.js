var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var users = [];
var connections = [];

server.listen(process.env.PORT || 3000);

console.log('Server running...');

//static files:
app.use('/static', express.static(__dirname + '/static'));

//home:
app.get('/', function (request, response) {
    response.sendFile(__dirname + '/index.html');
});

//sockets configuration:
io.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log('Connected: Sockets connected: %s', connections.length);

    socket.on('disconnect', function (data) {
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: Sockets connected: %s', connections.length);
    });
});