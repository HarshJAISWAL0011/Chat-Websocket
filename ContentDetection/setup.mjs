import{ImageAnnotatorClient} from "@google-cloud/vision" 
import CREDENTIALS from '../ApiKey.json' assert { type: 'json' };

const CONFIG = {
  credentials: {
      private_key: CREDENTIALS.private_key,
      client_email: CREDENTIALS.client_email
  }
};
 

export async function checkContent(imgUrl) {

const client = new ImageAnnotatorClient(CONFIG);
  // const bucketName = 'chat-e34cc.appspot.com';
  // const fileName = 'explicit.jpg';  
  //  imgUrl = `https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*`

  try {
     const [result] = await client.safeSearchDetection(`${imgUrl}`)

    const detections = result.safeSearchAnnotation;
    console.log('Safe search:');
    console.log(detections)
    // console.log(`Adult: ${detections.adult}`);
    // console.log(`Medical: ${detections.medical}`);
    // console.log(`Spoof: ${detections.spoof}`);
    // console.log(`Violence: ${detections.violence}`);
    // console.log(`Racy: ${detections.racy}`);
    if(detections.adult == 'VERY_LIKELY' || detections.racy == 'VERY_LIKELY' || detections.violence == 'VERY_LIKELY' ) {
    return -1;
    }
    else 
     return 1

  } catch (error) {
    console.error('Error performing safe search detection:', error);
  }
   return 1;
}

//  checkContent("");