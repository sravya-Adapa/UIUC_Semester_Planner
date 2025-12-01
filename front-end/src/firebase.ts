// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCTnMWCPeC_PeW8kHSvFI8m6uNPkQvedgg",
  authDomain: "uiuc-semester-planner.firebaseapp.com",
  projectId: "uiuc-semester-planner",
  storageBucket: "uiuc-semester-planner.firebasestorage.app",
  messagingSenderId: "485488576830",
  appId: "1:485488576830:web:4315adc9a48de6c04d046f",
  measurementId: "G-4DN7RBMNGX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);

// Optional analytics
export const analytics = getAnalytics(app);

