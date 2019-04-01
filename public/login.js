var socket = io.connect('http://localhost:3000');

var app = new Vue({
    el: '#abb',
    data: {
        user: ""
    },
    methods: {
        login: function (event) {

            if(this.user.length < 4){
                alert("Please take a length of min. 4 Chars")
                return
            }
            localStorage.setItem("user", this.user);
            window.location.href = "chat.html";
        }
    }
});