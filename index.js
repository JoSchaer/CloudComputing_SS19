var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/chat.html');
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});

io.on('connection', function(socket){

    console.log('Yay, connection was recorded')

    //emit message to all front-end clients
    io.emit('chat message', 'Some **** Joined the gangbang Party');

    //handling disconnects
    socket.on('disconnect', function() {
        io.emit('chat message', '**** left early');
    });

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
