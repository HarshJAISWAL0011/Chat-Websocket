import { Collection_name,WS_SEND_TO_ID,MESSAGES,FIRESTORE_REGISTRATION_TOKEN, Collection_Group, Document_Group_Members  } from "../Constant.mjs";
import { db } from "./FirebaseSetup.mjs";
import admin from 'firebase-admin';

 


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
    console.log(`$groupId: ${groupId}`);
    const snapshot =await db.collection(Collection_Group).doc(groupId).collection(Document_Group_Members).get();
    let memberId=[]
    snapshot.forEach(docRef => {
        memberId.push(docRef.id)
    })

    console.log(`${memberId}`)
    return memberId;
}

export async function addGroupMember(groupMembers, groupName, createdBy){
    try {
        var docref =  db.collection(Collection_Group).doc();

        docref.set(
            {name: groupName,
            createdBy,
            time:  Date.now(),
            groupMembers: admin.firestore.FieldValue.arrayUnion(...groupMembers)
    })

    // TODO: send cloud message about joining group
        groupMembers.forEach(member =>{
            db.collection(Collection_name).doc(member).update(
                {groups:admin.firestore.FieldValue.arrayUnion(docref.id)}
            )
        }
          );

        console.log(`Data added successfully! ${(docref.id)}`);
        return docref.id
        
      } catch (error) {
        console.error('Error adding data:', error);
      }
}