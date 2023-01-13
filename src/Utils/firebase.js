import * as firebase from 'firebase/app'

const config = {
  apiKey: "AIzaSyDhXQVfE8lvio3CXPR2IZG-ouw-efk1LRQ",
  authDomain: "cleanr-1e54f.firebaseapp.com",
  databaseURL: "https://cleanr-1e54f-default-rtdb.firebaseio.com",
  projectId: "cleanr-1e54f",
  storageBucket: "cleanr-1e54f.appspot.com",
  messagingSenderId: "987250699049",
  appId: "1:987250699049:web:1a63318ed4c3c556a9a538",
  measurementId: "G-TXH7HD92HM"
};

firebase.initializeApp(config)
export const fireBase = firebase
export default firebase
