import firebase from "firebase/app";
// import 'firebase/auth';
// import 'firebase/firestore';

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCDLv0qu9sSb_gTnv0Wt0K5o0xnIk3vW94",
  authDomain: "listify-akash95.firebaseapp.com",
  projectId: "listify-akash95",
  storageBucket: "listify-akash95.appspot.com",
  messagingSenderId: "844878237220",
  appId: "1:844878237220:web:5b0bf9985a6af8889092b1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var provider = new firebase.auth.GoogleAuthProvider();
