import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyDhXQVfE8lvio3CXPR2IZG-ouw-efk1LRQ",
  authDomain: "cleanr-1e54f.firebaseapp.com",
  databaseURL: "https://cleanr-1e54f-default-rtdb.firebaseio.com",
  projectId: "cleanr-1e54f",
  storageBucket: "cleanr-1e54f.appspot.com",
  messagingSenderId: "987250699049",
  appId: "1:987250699049:web:1a63318ed4c3c556a9a538",
  measurementId: "G-TXH7HD92HM"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app)
