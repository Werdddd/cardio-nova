import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "vitals-strap.firebaseapp.com",
    databaseURL: "https://vitals-strap-default-rtdb.asia-southeast1.firebasedatabase.app", // ✅ Corrected URL
    projectId: "vitals-strap",
    storageBucket: "vitals-strap.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue };
