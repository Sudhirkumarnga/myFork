// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts(
  'https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js'
)

// // Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyDhXQVfE8lvio3CXPR2IZG-ouw-efk1LRQ",
  authDomain: "cleanr-1e54f.firebaseapp.com",
  databaseURL: "https://cleanr-1e54f-default-rtdb.firebaseio.com",
  projectId: "cleanr-1e54f",
  storageBucket: "cleanr-1e54f.appspot.com",
  messagingSenderId: "987250699049",
  appId: "1:987250699049:web:1a63318ed4c3c556a9a538",
  measurementId: "G-TXH7HD92HM"
}

firebase.initializeApp(firebaseConfig)

// Retrieve firebase messaging
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
