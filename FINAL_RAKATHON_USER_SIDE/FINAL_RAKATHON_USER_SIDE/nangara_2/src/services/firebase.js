import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// 1) Rename this file to "firebase.js".

// 2) Fill firebaseConfig with the settings of your Firebase project.

const firebaseConfig = {
  apiKey: "AIzaSyB8SOF598TDnbM06XjhNHb3vHW0MH-7ta8",
  authDomain: "hernan-9922c.firebaseapp.com",
  databaseURL: "https://hernan-9922c-default-rtdb.firebaseio.com",
  projectId: "hernan-9922c",
  storageBucket: "hernan-9922c.appspot.com",
  messagingSenderId: "60478048124",
  appId: "1:60478048124:web:11d954b5b6e4cebdb146f9",
  measurementId: "G-8D8CXF9S43"
};

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()

export default firebase;
