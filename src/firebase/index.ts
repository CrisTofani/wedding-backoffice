// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBovXquUadfWhFsNBLguQvTKXPFuJffNMM",
  authDomain: "matrimonio-marta-cri.firebaseapp.com",
  projectId: "matrimonio-marta-cri",
  storageBucket: "matrimonio-marta-cri.appspot.com",
  messagingSenderId: "1051800470772",
  appId: "1:1051800470772:web:65db1bdef757eb36478aa1",
  measurementId: "G-KKBD29G71S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firestoreDb = getFirestore(app);
