// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwtY2jNQCPN5BdTNVSQWBkbK-rPXRjbBs",
  authDomain: "mern-blog1-fe106.firebaseapp.com",
  projectId: "mern-blog1-fe106",
  storageBucket: "mern-blog1-fe106.appspot.com",
  messagingSenderId: "1014869137193",
  appId: "1:1014869137193:web:187d822ebf00671eab8938"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app