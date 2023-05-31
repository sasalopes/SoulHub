import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBlMHrT1LH2hFtHbSomlmZ1IWd8yg8KDqs",
  authDomain: "soulhub-v1.firebaseapp.com",
  projectId: "soulhub-v1",
  storageBucket: "soulhub-v1.appspot.com",
  messagingSenderId: "229229881406",
  appId: "1:229229881406:web:9e2a61457e28c41c64c96f",
  measurementId: "G-BTNBVLJGYF"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Configurando o Authentication e seus recursos login/cadastro
export const auth = getAuth(app);
// Configura o Firestore e seus recursos de banco de dados
export const db = getFirestore(app);
// Configura o Storage e seus recursos de Upload
export const storage = getStorage(app);
