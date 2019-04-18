/*
  Daniel Menlicki 762399, Jonathan Schärtel 762378
*/
const express = require('express');
const socket = require('socket.io');
const defs = require('./public/defs');

const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

const toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  iam_apikey: 'L7fu8VvlT91ra38Z1THvK2ZRF_INwQ8YeqNI5FkbKEBr',
  url: 'https://gateway-fra.watsonplatform.net/tone-analyzer/api'
});

const app = express();

let port = process.env.PORT || 3000;
const server = app.listen(port, function () {
  console.log(' listening on Port ' + port)
})
//Default location for Files
app.use(express.static('public'));
app.use('favicon.*', express.static('public'));

const io = socket(server);

const userList = {};
//functions for connectet Users
io.on('connection', function (client) {

  //recive a chat message and send it to the clients
  client.on('chat message', function (data) {

    toneAnalyzer.tone({
      tone_input: { 'text': data.msg.text },
      content_type: 'application/json',
    })
      .then(toneAnalysis => {
        console.log(JSON.stringify(toneAnalysis, null, 2));
        data.msg.text+= ` mood: ${toneAnalysis.document_tone.tones[0].tone_name}` 
      })
      .catch(err => {
        console.log('error:', err);
      })
      .finally(() => {
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
      });

  });

  //get Logindata from a new Client
  client.on('login', function (data) {
    let username = data.username
    console.log(username + ' connected to the Chat');

    userList[client.id] = username;
    user(username, defs.UserEvent.join)
  });

  //Delete disconnected Client
  client.on('disconnect', (params) => {
    let username = userList[client.id]
    if (!username) return // hack: login page leave wont display disconnect

    delete userList[client.id]
    user(username, defs.UserEvent.dc)
  });

})



//Check if User connect/disconnect and send specific Message to all users
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
