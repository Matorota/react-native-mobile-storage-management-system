// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD09qqmTKCo7GWGOthPqh9TbYLl5LIhihk",
  authDomain: "storeqr-b7a6c.firebaseapp.com",
  projectId: "storeqr-b7a6c",
  storageBucket: "storeqr-b7a6c.firebasestorage.app",
  messagingSenderId: "678315667462",
  appId: "1:678315667462:web:f18b1878fac43a21c2d387",
  measurementId: "G-RXH3QK9HGT",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
