import { Collection_name,WS_SEND_TO_ID,MESSAGES,FIRESTORE_REGISTRATION_TOKEN, Collection_Group } from "../Constant.mjs";
import { db } from "./FirebaseSetup.mjs";



export async function saveMessageFirestore(message){
    try {
    message = JSON.parse(message)
const docRef = db.collection(Collection_name).doc(message[WS_SEND_TO_ID]).collection(MESSAGES).doc();

 docRef.set(message)
 console.log("Message saved to Firestore")
    }catch(error){console.log(`error in saveMessageFirestore: ${error}`)
}
}

export async function getRegistrationTokenFirestore(userId){
    try {
        const docRef = db.collection('users').doc(userId);
        const docSnapshot = await docRef.get( { fields: ['registrationToken'] });
        if (docSnapshot.exists) {
            const userData = docSnapshot.data();
            if (userData && userData.registrationToken) {
                return userData.registrationToken;
            } else {
                console.log('registrationToken field not found in user document.');
                return null;
            }
        } else {
            console.log('User document does not exist for userId:', userId);
            return null;
        }
    } catch (error) {
        console.error('Error fetching registrationToken:', error);
        return null;
    }
}

export async function deleteMessage(id){
    try{
    var path = db.collection(Collection_name).doc(id).collection(MESSAGES)
    path.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          doc.ref.delete();
        });
      });
    }catch(e){console.log("error deleting message"+e);}
}

export async function getGroupMember(groupId){
    const snapshot =await db.collection(Collection_Group).doc(groupId).get();
    let memberId=[]
    snapshot.forEach(docRef => {
        memberId.push(docRef.data)
    })
    console.log(`Member ${memberId}`)
    return memberId;
}