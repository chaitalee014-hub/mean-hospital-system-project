// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeMJG_-xl8oxgq2X4aQ9rl-ZNZflf2e7E",
  authDomain: "hospital-website-7864f.firebaseapp.com",
  projectId: "hospital-website-7864f",
  storageBucket: "hospital-website-7864f.firebasestorage.app",
  messagingSenderId: "499419236303",
  appId: "1:499419236303:web:52d069db3c280240f074ba",
  measurementId: "G-9ZQGLKFCF2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);