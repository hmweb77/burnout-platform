
// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAA2JecVCW_dKXVli03Pnh6Nd9zAvLAVA0",
    authDomain: "burnout-8019c.firebaseapp.com",
    projectId: "burnout-8019c",
    storageBucket: "burnout-8019c.firebasestorage.app",
    messagingSenderId: "882769165895",
    appId: "1:882769165895:web:31024cbe544be87760fb62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;



