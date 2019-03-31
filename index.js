var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(3000, function () {
    console.log(' listening on Port 3000')
})

app.use(express.static('public'));

var io = socket(server);


var userList = [];

io.on('connection', function (socket) {
    socket.on('chat', function (data) {
        socket.emit(data.username + ' joined the Chat')
        console.log(data.username + ' connectet to the Chat');
        userList.push(socket);

        console.log(userList.length);
    });

    socket.on('chat message', function (msg) {
       sockets.emit('chat message', msg);
    });
});

