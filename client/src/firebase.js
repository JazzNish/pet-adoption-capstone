import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAs6P3HLW66ZhBtWHZGqamDM32Jg2n77HM",
  authDomain: "pet-adoption-app-87e75.firebaseapp.com",
  projectId: "pet-adoption-app-87e75",
  storageBucket: "pet-adoption-app-87e75.appspot.app",
  appId: "1:655831230944:web:b44053c6506780c091a385"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);