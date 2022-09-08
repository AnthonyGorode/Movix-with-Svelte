// import { initializeApp, getApps } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';

// const app = getApps().length === 0 ? initializeApp({
//     apiKey: "AIzaSyA-l8pwnl_e6aE8NeCpu58JeqirGm9ih_o",
//     authDomain: "movix-app-dae11.firebaseapp.com",
//     databaseURL: "https://movix-app-dae11.firebaseio.com",
//     projectId: "movix-app-dae11",
//     storageBucket: "movix-app-dae11.appspot.com",
//     messagingSenderId: "927785726711",
//     appId: "1:927785726711:web:01b18790500b186c4b59f2",
//     measurementId: "G-ZSD74SQSX0"
// }) : getApps()[0];

// function firestore() {
// 	return getFirestore(app);
// }

// export { firestore };

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

var firebaseConfig = {
    apiKey: "AIzaSyA-l8pwnl_e6aE8NeCpu58JeqirGm9ih_o",
    authDomain: "movix-app-dae11.firebaseapp.com",
    databaseURL: "https://movix-app-dae11.firebaseio.com",
    projectId: "movix-app-dae11",
    storageBucket: "movix-app-dae11.appspot.com",
    messagingSenderId: "927785726711",
    appId: "1:927785726711:web:01b18790500b186c4b59f2",
    measurementId: "G-ZSD74SQSX0"
};

const app = initializeApp(firebaseConfig);

// export const auth = firebase.auth();
// export const googleProvider = new firebase.auth.GoogleAuthProvider();

export const db = getFirestore(app);
export const auth = getAuth(app);