import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyD09qqmTKCo7GWGOthPqh9TbYLl5LIhihk",
  authDomain: "storeqr-b7a6c.firebaseapp.com",
  projectId: "storeqr-b7a6c",
  storageBucket: "storeqr-b7a6c.firebasestorage.app",
  messagingSenderId: "678315667462",
  appId: "1:678315667462:web:f18b1878fac43a21c2d387",
  measurementId: "G-RXH3QK9HGT",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

export { app, auth, db };
