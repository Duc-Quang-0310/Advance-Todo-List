import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { initializeAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDhNJ3h5v-m5l-HfW_n8u3xc2-vd3lKXzM",
  authDomain: "q-todo-app-101.firebaseapp.com",
  projectId: "q-todo-app-101",
  storageBucket: "q-todo-app-101.appspot.com",
  messagingSenderId: "803567338263",
  appId: "1:803567338263:web:aeda9768477a457cc12d52",
  measurementId: "G-TC7D6YBGFC",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = initializeAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);

export default getAnalytics(firebaseApp);
