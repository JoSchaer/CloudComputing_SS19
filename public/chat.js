/*
  Daniel Menlicki 762399, Jonathan Schärtel 762378
*/
//Connection to Server
let port = process.env.PORT || 3000;
var socket = io.connect(port);

//Generate new Vue Object
var app = new Vue({
  el: '#app',
  data: {
    messages: [Msg("Best Server EU West", Type.msg, "Welcome to the INSTANT Chat")],
    inp: "",
    user: null,
    upload: null,
    file: null,
    users: [1, 2, 3, 4],
    checkedUsers: [],
    Type
  },
  methods: {
    processFile: function (event) { this.upload = event.target.files[0] },
    send: function (event) {
      // Check if its a File Message
      if (this.upload) {
        let reader = new FileReader();

        reader.onloadend = (e) => {
          this.file = { bin: e.target.result, name: this.upload.name }
          this.socket()
        };

        // reader.readAsBinaryString(this.file);
        reader.readAsDataURL(this.upload);
      } else if (this.inp.length < 1) return;
      else {
        this.socket()
      }
    },
    // Send Messages top Server
    socket: function (params) {
      socket.emit('chat message', {
        to: this.checkedUsers,
        msg: Msg(this.user, Type.msg, this.inp, this.file)
      });

      this.inp = ""
      this.file = null
      this.upload = null
      this.$refs.upload.value = null
      this.checkedUsers = []
    }
  },
  //Observe the messages and scroll down to actual message
  watch: {
    messages: function (params) {
      Vue.nextTick(function () {
        // DOM updated
        objDiv.scrollTop = objDiv.scrollHeight;
      })
    }
  },
  //When Page was loaded get Username and Userlist 
  created: function () {
    this.user = localStorage.getItem("user");
    socket.emit('login', { username: this.user });
    // socket.emit('userList', null);
  }
});

//Recive a Chatmessage and push it to the other Messages
socket.on('chat message', function (msg) {
  app.$data.messages.push(msg)
});
//Recive the Userlist
socket.on('user', function (data) {
  app.$data.messages.push(Msg(data.username, Type.user, data.text))
  app.$data.users = data.userList
})

// socket.on('userList', data => app.$data.users = data.userList);

var objDiv = document.getElementById("chat");
