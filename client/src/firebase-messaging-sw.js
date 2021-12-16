//we are not including entire firebase bundle 
//just including the firebase/app to reduce loading time
import firebase from 'firebase/app';

//==============================================Firebase messaging background listener====================
// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// This import loads the firebase namespace

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDIrFJmXvpuajpgds0DE7N9S36OsoMpVH4",
  authDomain: "my-pal-6e781.firebaseapp.com",
  projectId: "my-pal-6e781",
  storageBucket: "my-pal-6e781.appspot.com",
  messagingSenderId: "407513853070",
  appId: "1:407513853070:web:be0dfc67968b16c8e1eddf",
  measurementId: "G-2NCC9ESLNC"
});
// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});