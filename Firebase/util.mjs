import { Collection_name,WS_SEND_TO_ID,MESSAGES,FIRESTORE_REGISTRATION_TOKEN } from "../Constant.mjs";
import { db } from "./FirebaseSetup.mjs";


export async function saveMessageFirestore(message){
    message = JSON.parse(message)
const docRef = db.collection(Collection_name).doc(message[WS_SEND_TO_ID]).collection(MESSAGES).doc();

 docRef.set(message)
}


export async function getRegistrationTokenFirestore(userId){
const registrationToken =await  db.collection(Collection_name).doc(userId).collection(FIRESTORE_REGISTRATION_TOKEN).get();
console.log(registrationToken)
return registrationToken
}

