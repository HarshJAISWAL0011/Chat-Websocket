import { getMessaging } from 'firebase-admin/messaging';
import { getRegistrationTokenFirestore } from "./util.mjs";
 

// Initialize messaging
const messaging = getMessaging();


var registrationToken = "ehYLw0JgRkuY1duiMvBTEy:APA91bEmvUO6rmidllcRBQtnQIqF2cmOkvlUZqEAlQX6K6HQi6rNWA4PDHgpr8GojtesfEP5UZlwFjigre6RnyBG07T3Rd1vamcJr4XWvXVfYqSYtgcoCHyoyR4ybBWm7l9ReyY8WJXl"



export async function sendCloudMessage(sendto, senderId, message, title) {
  try{
    registrationToken = await getRegistrationTokenFirestore(sendto)
    if(!registrationToken){
     return
}
    const FCMmessage = getFCMMessageJson(senderId,message,title,registrationToken)

  messaging.send(FCMmessage)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
  }
  catch (error) {console.log('Error sending cloud message:', error);}
}


 function getFCMMessageJson(senderId, message,title, registrationToken){
  const FCMmessage = {
  data: {
    // max size of 4kb
    // messageId: message.messageId,
    title: title,
    sender_id: senderId,
    message: message,
  },
  token: registrationToken
};
return FCMmessage
}
