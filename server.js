var express = require('express');
var socket = require('socket.io');
var defs = require('./public/defs');

var app = express();
var server = app.listen(3000, function () {
  console.log(' listening on Port 3000')
})

app.use(express.static('public'));
app.use('favicon.*', express.static('public'));

var io = socket(server);

var userList = {};
//functions for connectet Users
io.on('connection', function (client) {

  
  client.on('chat message', function (data) {
    let recipients = data.to

    if (recipients.length > 0) {
      let names = []
      recipients.forEach(r => names.push(userList[r]))

      data.msg.username += ` --privat--> ${names.join(', ')}`

      if (!recipients.includes(client.id)) recipients.push(client.id) // sent also to back to self 
      recipients.forEach(r => { io.to(r).emit('chat message', data.msg) });
    } else {
      io.emit('chat message', data.msg)
    }
  })

  client.on('login', function (data) {
    let username = data.username
    console.log(username + ' connected to the Chat');

    userList[client.id] = username;
    user(username, defs.UserEvent.join)
  });

  client.on('disconnect', (params) => {
    let username = userList[client.id]
    if (!username) return // hack: login page leave wont display disconnect

    delete userList[client.id]
    user(username, defs.UserEvent.dc)
  });

})

function user(username, ev) {
  let text;
  switch (ev) {
    case defs.UserEvent.join:
      text = "has joined the chat."
      break;
    case defs.UserEvent.dc:
      text = "has left the chat."
      break;
    default:
      text = "fuuuuuuuuuuuuuuuuk."
      break;
  }
  io.emit('user', { username, userList, text })
}

