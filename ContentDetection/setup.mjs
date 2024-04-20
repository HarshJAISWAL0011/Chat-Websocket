import{ImageAnnotatorClient} from "@google-cloud/vision"
// require('@google-cloud/vision');

// 18508372192-n21mfseff0fpctarcljv33iffk4a2as0.apps.googleusercontent.com

// Creates a client

export async function checkContent() {
  // Initialize the ImageAnnotatorClient with the service account key file
  const client = new ImageAnnotatorClient({
    keyFilename: 'ApiKey.json'
  });

  const bucketName = 'chat-e34cc.appspot.com';
  const fileName = 'explicit.jpg'; // Ensure fileName is the correct path within the bucket

  try {
    // Perform safe search detection on the remote image file
    const [result] = await client.safeSearchDetection(
      `gs://${bucketName}/${fileName}`
    );

    const detections = result.safeSearchAnnotation;
    console.log(detections)
    console.log('Safe search:');
    // console.log(`Adult: ${detections.adult}`);
    // console.log(`Medical: ${detections.medical}`);
    // console.log(`Spoof: ${detections.spoof}`);
    // console.log(`Violence: ${detections.violence}`);
    // console.log(`Racy: ${detections.racy}`);
  } catch (error) {
    console.error('Error performing safe search detection:', error);
  }
}

// Call the checkContent function
// checkContent();