// import { initializeApp, getApps } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';

// const app = getApps().length === 0 ? initializeApp({

// }) : getApps()[0];

// function firestore() {
// 	return getFirestore(app);
// }

// export { firestore };

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

var firebaseConfig = {
    
};

const app = initializeApp(firebaseConfig);

// export const auth = firebase.auth();
// export const googleProvider = new firebase.auth.GoogleAuthProvider();

export const db = getFirestore(app);
export const auth = getAuth(app);
