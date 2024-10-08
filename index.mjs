import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { New_Connection, New_Message, WS_MESSAGE, WS_SENDER_ID, WS_SEND_TO_ID,
   WS_TYPE,WS_NEW_GROUP_MESSAGE, WS_GROUP_ID,
   New_Connection_EXAM} from './Constant.mjs';
'./Firebase/FirebaseSetup.mjs';
import { saveMessageFirestore,deleteMessage, getGroupMember,addGroupMember, addChannelMessage } from './Firebase/util.mjs'; 
import {sendCloudMessage} from './Firebase/Messaging.mjs';
import {checkContent} from './ContentDetection/setup.mjs'
import { fileURLToPath } from 'url';
import cors from 'cors'
import path from 'path';

// setTimeout(() => {
//   checkContent();
// }, 2000);


const ws_port = process.env.PORT || 3000 ;


const app = express();
app.use(express.json());
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const clients = new Map();
const exam_set = new Set();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(cors())
app.use(express.static(path.join(__dirname)));




app.post('/delete', (req, res) => {
  console.log('delete request for '+ JSON.stringify(req.body))
  if(req.body.userId)
  deleteMessage(req.body.userId)
  res.status(204).send("deleted")
});

// let msg ={"channelId":"jrAm9SYJzUMYHGIswTgp","message":"hello","messageId":"1713608059282jrAm9SYJzUMYHGIswTgp","messageType":"text","timestamp":1713608059283}
// addChannelMessage(msg)


app.post('/channel_message', async (req, res) => {
  console.log('channel message '+ req.body);
  console.log('channel message '+ JSON.stringify(req.body))
  let msg = req.body
  // check if message is not explicit
  if(msg.messageType == 'image'){
   let result = await checkContent(msg.message)
   console.log("result = "+result)
   if(result == 1){
    addChannelMessage(msg)
    console.log('Saving channel message...')
  }
   else{
    // Inform user about explicit content
    console.log('Explicit content was detected')
  }
  }else
   addChannelMessage(msg)
  res.status(200).send({message: "ok"})
});

app.post('/exam_message', async(req, res) => {
  try{
    
    var body = req.body
    console.log(body)
    if(body){
      for(var user of exam_set){
         user.send(JSON.stringify(body));
    }
  }
  
  res.status(200)
}catch(err){
  console.log("Error at endpoint: exam_message Error: " + err.message);
}
});

app.post('/create_group', async(req, res) => {
  console.log('create_group request '+ JSON.stringify(req.body))
 
    var body = req.body
    if(body)
    var id = await addGroupMember(body.groupMembers,body.groupName,body.createdBy)
  
  res.status(200).send({id})
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


wss.on('connection', (ws) => {
  console.log('WebSocket connection established ' );
  // console.log(ws);

  ws.on('message', (message) => {
    try {
    console.log(`Received: ${message}}`);
    ws.send(`Server Recived you msg: ${message}`);
    var msgJson = JSON.parse(message);

    if(msgJson[WS_TYPE] == "StartAudioCall"  || msgJson[WS_TYPE] == "StartVideoCall" || msgJson[WS_TYPE] =="Offer" || msgJson[WS_TYPE] =="Answer"
    || msgJson[WS_TYPE] =="IceCandidates" || msgJson[WS_TYPE] =="EndCall"){
      sendMessageToClient(msgJson['target'], msgJson)
    }

    else if(msgJson[WS_TYPE] == New_Connection )
      clients.set(msgJson[WS_SENDER_ID], ws);
    
    else if(msgJson[WS_TYPE] == New_Connection_EXAM )
      exam_set.add(ws);

    else if(msgJson[WS_TYPE] ==New_Message){
      var sendto=msgJson[WS_SEND_TO_ID];
      if(clients.has(sendto)){
        sendMessageToClient(sendto, msgJson)
      }else{
        console.log("Save message to firebase");
        saveMessageFirestore(message)
        sendCloudMessage(sendto,msgJson[WS_SENDER_ID],msgJson[WS_MESSAGE], "New message received")
      }
    }else if(msgJson[WS_TYPE] == WS_NEW_GROUP_MESSAGE){
      sendMessageToGroup(msgJson)
    }

    } catch (error){
      console.log(error)
    }


    
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
    clients.forEach((value,key) => {
      if(value == ws){
      console.log("removing key from map "+key);   
      clients.delete(key); 
      }
    });

    if(exam_set.has(ws))
     exam_set.delete(ws);
  });

 

  wss.on("msg", (message) => {
      console.log(`Received: ${message}`);
      wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
              client.send(message);
          }
      });
  });


});

server.listen(ws_port, () => {
  console.log('WebSocket server listening on port '+ws_port);
});


function sendMessageToClient(clientId, messageObj) {
  const client = clients.get(clientId);
  if (client) {
    client.send(JSON.stringify(messageObj));
  } 
}

async function sendMessageToGroup(msgJson){
  const groupId = msgJson[WS_GROUP_ID]
  let groupMember =await getGroupMember(groupId)
  groupMember.forEach( sendto=>{
    if(clients.has(sendto)){
      sendMessageToClient(sendto, msgJson)
    }
    else{
      // saveMessageFirestore(message)
    }
  })
}








