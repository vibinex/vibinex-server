import { FIRESTORE_DB } from './firestore_singleton';
import { collection, query, where, getDocs, addDoc, DocumentData } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export async function get_user(linkedin_id: string) {
    const db = FIRESTORE_DB;
    const q = query(collection(db, "users"), where("linkedin_id", "==", linkedin_id));
    console.log("Query formed");
    const querySnapshot = await getDocs(q);
    console.log("Querysnapshot formed");
    if (!querySnapshot || querySnapshot.size != 1) {
        console.log("snapshot invalid");
        return undefined;
    }
    let result: DocumentData = querySnapshot.docs[0].data();
    console.log("Doc recieved");
    return result;
}

export async function create_user(user_dict: Record<string, string>) {
    const db = FIRESTORE_DB;
    await addDoc(collection(db, "users"), user_dict);
}