// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_apiKey,
  
    authDomain: process.env.EXPO_PUBLIC_authDomain,
  
    projectId: process.env.EXPO_PUBLIC_projectId,
  
    storageBucket: process.env.EXPO_PUBLIC_storageBucket,
  
    messagingSenderId: process.env.EXPO_PUBLIC_messagingSenderId,
  
    appId: process.env.EXPO_PUBLIC_appId
    
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// export const auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(ReactNativeAsyncStorage)
//   })
export const db = getFirestore(app);