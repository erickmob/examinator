// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";  // Certifique-se de que isto está presente
        
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDyEr7Ds5y-elJAwUzSKq6vXKiRZx0sbDA",
  authDomain: "examinator-5262e.firebaseapp.com",
  projectId: "examinator-5262e",
  storageBucket: "examinator-5262e.appspot.com",
  messagingSenderId: "419782917432",
  appId: "1:419782917432:web:83c3c1a32d7586084395cd",
  measurementId: "G-HENMSMKE9R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializa o Firestore
const db = getFirestore(app);  // Isto cria a conexão com o Firestore

// Exporta o Firestore para uso no resto do projeto
export { db };