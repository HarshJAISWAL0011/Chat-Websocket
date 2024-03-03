import { getMessaging } from 'firebase-admin/messaging';
import { getRegistrationTokenFirestore } from "./util.mjs";
import { FCM_SENDER_ID,FCM_MESSAGE,FCM_TOKEN,FCM_TITLE } from "../Constant.mjs";


// Initialize messaging
const messaging = getMessaging();


const registrationToken = "ehYLw0JgRkuY1duiMvBTEy:APA91bEmvUO6rmidllcRBQtnQIqF2cmOkvlUZqEAlQX6K6HQi6rNWA4PDHgpr8GojtesfEP5UZlwFjigre6RnyBG07T3Rd1vamcJr4XWvXVfYqSYtgcoCHyoyR4ybBWm7l9ReyY8WJXl"



export async function sendCloudMessage(sendto, senderId, message) {
    registrationToken = getRegistrationTokenFirestore(sendto)
    const FCMmessage = {
  
        data: {
          // max size of 4kb
          messageId: '123456',
          FCM_TITLE: senderId,
          FCM_SENDER_ID: senderId,
          FCM_MESSAGE: message,
        },
        FCM_TOKEN: registrationToken
      };
  messaging.send(FCMmessage)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
}
