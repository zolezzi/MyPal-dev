//we are not including entire firebase bundle 
//just including the firebase/app to reduce loading time
import firebase from 'firebase/app';
// These imports load individual services into the firebase namespace.
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage'
import 'firebase/messaging';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDIrFJmXvpuajpgds0DE7N9S36OsoMpVH4",
    authDomain: "my-pal-6e781.firebaseapp.com",
    projectId: "my-pal-6e781",
    storageBucket: "my-pal-6e781.appspot.com",
    messagingSenderId: "407513853070",
    appId: "1:407513853070:web:be0dfc67968b16c8e1eddf",
    measurementId: "G-2NCC9ESLNC"
});

const DataBase = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();
const realtime = firebaseApp.database();
// const messaging = firebaseApp.messaging();
// // const perf = firebaseApp.performance();
// // const analytics = firebaseApp.analytics();

// //get permission from the user to allow push notifications to the browser
// const getToken = (setTokenFound) => {
//     return messaging.getToken({vapidKey: process.env.GENERATED_MESSAGING_KEY}).then((currentToken) => {
//       if (currentToken) {
//         console.log('current token for client: ', currentToken);
//         setTokenFound(true);
//         // Track the token -> client mapping, by sending to backend server
//         // show on the UI that permission is secured
//       } else {
//         console.log('No registration token available. Request permission to generate one.');
//         setTokenFound(false);
//         // shows on the UI that permission is required 
//       }
//     }).catch((err) => {
//       console.log('An error occurred while retrieving token. ', err);
//       // catch error while creating client token
//     });
//   }

// //=================================Firebase foreground listener=====================
// const onMessageListener = () =>
//   new Promise((resolve) => {
//     messaging.onMessage((payload) => {
//       resolve(payload);
//     });
// });

export  {DataBase,auth,storage,realtime}; 