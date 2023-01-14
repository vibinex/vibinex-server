import { initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore";

class FirestoreSingleton
{
    private static _instance: Firestore;

    private static _getdb()
    {
        const firebaseConfig = {
            apiKey: "AIzaSyBMlZ-c2TlpoavZYUefqmrkJU-zuo1HzpQ",
            authDomain: "vibi-prod.firebaseapp.com",
            projectId: "vibi-prod",
            storageBucket: "vibi-prod.appspot.com",
            messagingSenderId: "758994881953",
            appId: "1:758994881953:web:0a765131e5d6c7dfe30fe0",
            measurementId: "G-VQZKRX3MDR"
        };

        // Initialize firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        return db;
    }

    public static get Instance()
    {
        return this._instance || (this._instance = this._getdb());
    }
}

export const FIRESTORE_DB = FirestoreSingleton.Instance;