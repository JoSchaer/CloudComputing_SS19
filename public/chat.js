//Connection to Server
var socket = io.connect('http://localhost:3000');

//Elements from Login
var username = document.getElementById('username');
var loginBtn = document.getElementById('login');
var messages = document.getElementById('messages');
var sendBtn = document.getElementById('sending');
var message = document.getElementById('m');



//Elements from Chat
loginBtn.addEventListener('click', function () {
    socket.emit('chat', {
        username: username.value
    });
    window.location.href = "chat.html";
});

sendBtn.addEventListener('click',function () {
    socket.emit('chat message',{
        username : username.value,
        message: message.value
    });
});

socket.on('chat message', function (msg) {
    console.log(msg.username + '   '+ msg.message);
    messages.innerHTML += '<p><strong>'+ msg.username+':</strong>'+msg.message+'</p>';
});

