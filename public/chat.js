//Connection to Server
var socket = io.connect('http://localhost:3000');


/*
//Elements from Login
var username = document.getElementById('username');
    loginBtn = document.getElementById('login');


//Elements from Chat
/*
loginBtn.addEventListener('click', function () {
   socket.emit()
});


/*
$(function () {
    var socket = io();
    $('form').submit(function (e) {
        e.preventDefault(); // prevents page reloading
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function (msg) {
        $('#messages').append($('<li>').text(msg));
    });
});
*/