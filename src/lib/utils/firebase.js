// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-eY6V7ySwKW1vmPJEXXYwxXEeuyNJvVs",
  authDomain: "mesuchh-d667b.firebaseapp.com",
  projectId: "mesuchh-d667b",
  storageBucket: "mesuchh-d667b.appspot.com",
  messagingSenderId: "950459512986",
  appId: "1:950459512986:web:294aa23a682d2e930cc723"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };