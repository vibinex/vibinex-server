import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMlZ-c2TlpoavZYUefqmrkJU-zuo1HzpQ",
  authDomain: "vibi-prod.firebaseapp.com",
  projectId: "vibi-prod",
  storageBucket: "vibi-prod.appspot.com",
  messagingSenderId: "758994881953",
  appId: "1:758994881953:web:0a765131e5d6c7dfe30fe0",
  measurementId: "G-VQZKRX3MDR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const analytics = getAnalytics(app);