import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
dotenv.config();
const cred = JSON.parse(process.env.FIRESTORE_CREDENTIALS)


initializeApp({
  credential: cert(cred)
});


export const db = getFirestore();
// db.collection('calls').doc('IN1').set({'type': "Endi"})
// console.log("credd = "+cred.type )
