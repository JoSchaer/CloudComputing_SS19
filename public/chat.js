//Connection to Server
var socket = io.connect('http://localhost:3000');


var app = new Vue({
  el: '#app',
  data: {
    messages: [Msg("Best Server EU West", Type.msg, "Hello Party Pipael")],
    inp: "",
    user: null,
    upload: null,
    file: null,
    //users: [{name: 1, link: "sefsdf"}, {name: 1, link: "sefsdf"}, {name: 1, link: "sefsdf"}],
    users: [1, 2, 3, 4],
    checkedUsers: [],
    Type
  },
  methods: {
    processFile: function (event) { this.upload = event.target.files[0] },
    send: function (event) {
      if (this.upload) {
        let reader = new FileReader();

        reader.onloadend = (e) => {
          // The file's text will be printed here
          // console.log(e.target.result)
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
  watch: {
    messages: function (params) {
      Vue.nextTick(function () {
        // DOM updated
        objDiv.scrollTop = objDiv.scrollHeight;
      })
    }
  },
  created: function () {
    this.user = localStorage.getItem("user");
    socket.emit('login', { username: this.user });
    // socket.emit('userList', null);
  }
});

socket.on('chat message', function (msg) {
  app.$data.messages.push(msg)
});

socket.on('user', function (data) {
  app.$data.messages.push(Msg(data.username, Type.user, data.text))
  app.$data.users = data.userList
})

// socket.on('userList', data => app.$data.users = data.userList);

var objDiv = document.getElementById("chat");
