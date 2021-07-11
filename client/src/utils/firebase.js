// firebase setup

import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAmgKF6OSgnM4E2I0b6ixeeAQkHuoSHSSs",
  authDomain: "meet-your-team.firebaseapp.com",
  projectId: "meet-your-team",
  storageBucket: "meet-your-team.appspot.com",
  messagingSenderId: "452841367415",
  appId: "1:452841367415:web:4d012cd12ec57019846372",
  measurementId: "G-HJ11G56KCN",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
