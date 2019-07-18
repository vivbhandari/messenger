// const WebSocket = require('ws');
let connection;
function login() {
  let username = document.getElementById("username").value;
  console.log(username);
  let url = 'ws://localhost:8080?user='+username;
  connection = new WebSocket(url);
  
  connection.onopen = () => {
    console.log('connected...');
  };
  
  connection.onerror = (error) => {
    console.log(`WebSocket error: ${error}`);
  };
  
  connection.onmessage = (e) => {
    console.log(e.data);
    document.getElementById("chatOutput").value += e.data + "\n";
  };
}

function send(){
  let msg = {
    reciever: document.getElementById("reciever").value,
    message: document.getElementById("message").value
  }
  connection.send(JSON.stringify(msg));
}