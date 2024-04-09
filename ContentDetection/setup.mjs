import{ImageAnnotatorClient} from "@google-cloud/vision"
// require('@google-cloud/vision');

// Creates a client
const client = new ImageAnnotatorClient({
    keyFilename: 'ApiKey.json'
});

export async function checkContent(){

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const bucketName = 'chat-e34cc.appspot.com';
const fileName = '/images/JPEG_20240311_190533.jpeg';

// Performs safe search property detection on the remote file
const [result] = await client.safeSearchDetection(
    `gs://${bucketName}/${fileName}`
  );
const detections = result.safeSearchAnnotation;
console.log('Safe search:');
console.log(`Adult: ${detections.adult}`);
console.log(`Medical: ${detections.medical}`);
console.log(`Spoof: ${detections.spoof}`);
console.log(`Violence: ${detections.violence}`);
console.log(`Racy: ${detections.racy}`);
}