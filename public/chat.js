//Connection to Server
var socket = io.connect('http://localhost:3000');


//Elements from Login
var username = document.getElementById('username');
loginBtn = document.getElementById('login');


//Elements from Chat
loginBtn.addEventListener('click', function () {
    socket.emit()
});

