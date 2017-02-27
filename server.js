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
        //remove the user from list:
        users.splice(users.indexOf(data), 1);

        //remove the socket from list:
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: Sockets connected: %s', connections.length);

        sendUsernames();
    });

    socket.on('send message', function (data) {
        console.log('Server send message: ');
        console.log(data);
        io.sockets.emit('new message', { msg: data, user: socket.username });
    });

    socket.on('login', function (data, callback) {
        callback(true);

        //here I add a property to the socket:
        socket.username = data;

        console.log('Server login:');
        console.log(data);
        users.push(data);

        sendUsernames();
    });

    function sendUsernames() {
        io.sockets.emit('get users', users);
    }
});