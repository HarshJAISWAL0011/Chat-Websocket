import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { New_Connection, New_Message, WS_MESSAGE, WS_SENDER_ID, WS_SEND_TO_ID, WS_TYPE} from './Constant.mjs';
'./Firebase/FirebaseSetup.mjs';
import { saveMessageFirestore } from './Firebase/util.mjs'; 
import {sendCloudMessage} from './Firebase/Messaging.mjs';

const ws_port = process.env.PORT ;


const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const clients = new Map();


app.get('/', (req, res) => {
  res.send('Hello World!');
});

wss.on('connection', (ws) => {
  console.log('WebSocket connection established ' );
  console.log(ws);

  ws.on('message', (message) => {
    try {
    console.log(`Received: ${message}}`);
    ws.send(`Server Recived you msg: ${message}`);
    var msgJson = JSON.parse(message);

    if(msgJson[WS_TYPE] == New_Connection)
      clients.set(msgJson[WS_SENDER_ID], ws);

    else if(msgJson[WS_TYPE] ==New_Message){
      var sendto=msgJson[WS_SEND_TO_ID];
      if(clients.has(sendto)){
        sendMessageToClient(sendto, msgJson)
      }else{
        console.log("Save message to firebase");
        saveMessageFirestore(message)
        sendCloudMessage(sendto,msgJson[WS_SENDER_ID],msgJson[WS_MESSAGE])
      }
    }
    } catch (error){
      console.log(error)
    }
  });
});

server.listen(ws_port, () => {
  console.log('WebSocket server listening on port '+ws_port);
});


function sendMessageToClient(clientId, messageObj) {
  const client = clients.get(clientId);
  console.log('Sending message to client with id ' + clientId+ ': ' + JSON.stringify(messageObj))
  if (client) {
    client.send(JSON.stringify(messageObj));
  } 
}