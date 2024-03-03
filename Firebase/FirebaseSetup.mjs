import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { readFileSync } from 'fs';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';

import { serviceAccountKey } from '../Constant.mjs';

initializeApp({
  credential: cert(serviceAccountKey)
});

export const db = getFirestore();
