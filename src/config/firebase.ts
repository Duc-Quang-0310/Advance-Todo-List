import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
import { initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCxLaCWt3idfNkPqtGUXI3SZMFuYx69zuk",
  authDomain: "cv-todo-list.firebaseapp.com",
  projectId: "cv-todo-list",
  storageBucket: "cv-todo-list.appspot.com",
  messagingSenderId: "31797268535",
  appId: "1:31797268535:web:807525effd632a45622fb2",
  measurementId: "G-WMF8WNJ7LD",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = initializeAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const analytics = getAnalytics(firebaseApp);

export default analytics;
