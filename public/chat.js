//Connection to Server
var socket = io.connect('http://localhost:3000');

//Elements from Login
var username = document.getElementById('username');
loginBtn = document.getElementById('login');


//Elements from Chat
loginBtn.addEventListener('click', function () {
    if (username.value != null) {
        socket.emit('chat', {
            username: username.value
        });
        window.location.href = "chat.html";
    }
    else{
        alert("Please enter an Username");
    }

})
;

