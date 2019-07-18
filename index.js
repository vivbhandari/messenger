const express = require('express');
const app = express();
const Joi = require('joi');
const redis =  require('redis');
const WebSocket = require('ws');
const url = require('url');

app.use(express.json());

const redisClientPub = redis.createClient(6379, 'redis');
redisClientPub.on('error', (err) =>{
    console.log('Error:', err);
});

const redisClientSub = redis.createClient(6379, 'redis');
redisClientSub.on('error', (err) =>{
    console.log('Error:', err);
});
redisClientSub.on('message', (channel, msg) => {
    console.log('received on channel ' + channel);
    if(activeConnections.has(channel))
        activeConnections.get(channel).send(msg);
});

const wss = new WebSocket.Server({ port: 8080 });

let activeConnections = new Map();

wss.on('connection', (ws, req) => {
  ws.on('message', message => {
    console.log(`Received message => ${message}`)
    let jsonMsg = JSON.parse(message);
    if(activeConnections.has(jsonMsg['reciever'])){
        let reply = `${ws.username}: ${jsonMsg['message']}`;
        redisClientPub.publish(jsonMsg['reciever'], reply);
        ws.send(reply);
    }else{
        ws.send('Invalid receiver!');
    }
  });
  
  const parameters = url.parse(req.url, true);
  ws.username = parameters.query.user;
  activeConnections.set(parameters.query.user.toString(), ws);
  console.log(activeConnections);
  redisClientSub.subscribe(ws.username);
  ws.send(`${ws.username} connected...`);
});

app.get('/', (req, res) => {
    res.send('Hello world');
});

function buildJsObj(obj) {
    let jsObj = {};
    Object.keys(obj).forEach(key => {
        jsObj[key] = obj[key];
    });
    return jsObj;
}

function validateMessage(message){
    const schema = {
        receiver: Joi.string().min(3).required(),
        message: Joi.string().max(30).required
    }
    return Joi.validate(message, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log(`Listening on port ${port}...`));
