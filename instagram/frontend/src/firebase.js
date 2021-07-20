import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDRtdpD_qPtWo3Z7LPXHrlSRYzUdyKXSxI",
  authDomain: "instagram-63d72.firebaseapp.com",
  databaseURL: "https://instagram-63d72-default-rtdb.firebaseio.com",
  projectId: "instagram-63d72",
  storageBucket: "instagram-63d72.appspot.com",
  messagingSenderId: "177996837276",
  appId: "1:177996837276:web:5c1fe8243b1bb9f7e55859",
  measurementId: "G-5FCFYD0H8W"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
