import { getMessaging } from 'firebase-admin/messaging';
import { getRegistrationTokenFirestore } from "./util.mjs";
import { getFCMMessageJson } from "../Constant.mjs";


// Initialize messaging
const messaging = getMessaging();


var registrationToken = "ehYLw0JgRkuY1duiMvBTEy:APA91bEmvUO6rmidllcRBQtnQIqF2cmOkvlUZqEAlQX6K6HQi6rNWA4PDHgpr8GojtesfEP5UZlwFjigre6RnyBG07T3Rd1vamcJr4XWvXVfYqSYtgcoCHyoyR4ybBWm7l9ReyY8WJXl"



export async function sendCloudMessage(sendto, senderId, message) {
  try{
    registrationToken = await getRegistrationTokenFirestore(sendto)
    if(!registrationToken){
     return
}
    const FCMmessage = getFCMMessageJson(senderId,message,registrationToken)

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
