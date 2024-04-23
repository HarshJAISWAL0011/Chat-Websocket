import{ImageAnnotatorClient} from "@google-cloud/vision"
 
// 18508372192-n21mfseff0fpctarcljv33iffk4a2as0.apps.googleusercontent.com
const CREDENTIALS = JSON.parse(JSON.stringify({
  "type": "service_account",
  "project_id": "crafty-shelter-420015",
  "private_key_id": "0b71f597ddba3fcd2d1a3e845be7668ec0ce6296",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCzxvp0uaHIw7w+\nDesAtY1StD3r4F/gm5s/ICQeKW6HnGxfNIBzTEduOvaqUvX21f0Q7oSUdi3GEw/q\nUI57lvQYEUnKRjRtU7DETbp7WMhRHhQtjgReV5/yQvCx1k1gIJZGddR2mE3q5IN3\npIkqAH55BERg6kRBnPLhH0jbhzy3pWy5HujN1b9fxyfJpRKkaztLZTOu8CfKSb07\nPjQv2eCUw74cbmCXuhIMd9p2CJj0wUWC0YZ3hnryeRW8/fsq5HsGzg+j/k6NMUhR\nq/u8ktIH2UcpsfReTFrtMUtq4rRZouXLMge+YUmnK99oKJ3pf29GHg7eXfpP98+v\nXFkINPVdAgMBAAECggEAA29QqQSRJbQvR2YKxvS92nMFDUA4QyL995oLDp3e702q\n2Jo42EGAfa4ebEX3zjHe9+D/j/plDzG28WFjvR+qElnZAmzoD6AUePlKNmHNhZbX\nSFqJCCHQ9ZCkjb7imhMgg+ae7iG+HvfwPUvO7uPbbSXKrHZbyP9Xnztl8ANr6QKC\ndCnKpR6ov74iH5t1+Mzf25fcjrYhdPuEeRS8WD1AJkjdbjNw/DUst3YnfGfYaukm\n38L6mp9vAmPO/HyvwTlOnCf2QmWEjsOo3A46ISH7iyB0J8X9Mvbuqh2FiQpS3Egb\nIu2bJ8S2gkFKOFEfsEsRBNX3qK9QHhpeJSaV4CDDmQKBgQD9vwR7HYCpA7F8+r5d\n9GSJr/Mfoj6DNsSfX7+RMkD0ZOg6+5mHKS0C0/MWNCOJOBOdNa1JhYovt0sq06tA\nDMSrliD8v3+ySJGvjc0jCTvfLpITkTSA18PirHYLMs6drDf+Ke2f8JexPBjd6T9y\nlYOzE3GX8h3Oep1S6xfrLIUxSQKBgQC1X8QhDyo177XO7QpDfhSF5xuly83vTKc3\nrfZWAB+N24UBzRr6W8KcFqhfL7PjCxnLE0L5QyTRtmWQKF7QxEGuNFGEx12HofX2\nCAatFFkRzOEAYDTgsz/vjIiUBR4tjdjvaZZU0Nm4hfBjOxtW+WwBZzrdKCOrrpKW\noCfNDoj3dQKBgQDW8mT9VbSTd8l2MYHpXQl9iUrOVUXXKSHOT/GbMZLMdF40+MTJ\nNhwm9RxKhshDiPk0hy/PxAuW+BH4qW27yBUhtP8km6O0hrzClcBcGYpaOL0NTkfH\njP8mmSk1u0hDUIvuBd6BSfF19Y6rDNbuXbE+lQ34xORy8HMstnGAiioZ4QKBgFu6\noF275rQ6lK+fkJZL2KNUG9aBOZiyIsv1LmWWUF8VS7J6gg9mgwkgKG1jmc3VGmlr\nR277N07cuYbr8/APocwx55yIm9Px5IxWyNGWPenTvWPMRFH0Nfy4DYcXA4k0eSe0\nNfSVX9eD3ezBwvT81lPrWojpOQkmFDsbqqV5mWnVAoGBANkKj7fYfDQ1prJJKTg/\nyUI55D+/obz4qPX/bBPf/elUiEz8iW/CteKk65Ov3awK+sXNBe2AbOBXsweCkzDM\nU0pFLDVJB++OvY7gAyHgC+vLjFZLP88mIuCe8BZQ5lflOjoA0b2WlTU7YmHRQ7Ux\nYwHjc8EphqtD4ub1wGvBWrg/\n-----END PRIVATE KEY-----\n",
  "client_email": "contentdetection@crafty-shelter-420015.iam.gserviceaccount.com",
  "client_id": "113918327350172913270",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/contentdetection%40crafty-shelter-420015.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
));

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
  // const imgUrl = `https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*`

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

//  checkContent();