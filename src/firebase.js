import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 【請注意】這裡需要換成你從 Firebase Console 拿到的真實設定
// 如果暫時沒有，保持這樣也可以讓網頁先跑起來（但無法登入後台）
const firebaseConfig = {
  apiKey: "AIzaSyDBnfhFc0mbXE0cFpEteTb2hfDeezLksQA",
  authDomain: "lab-website-5f952.firebaseapp.com",
  projectId: "lab-website-5f952",
  storageBucket: "lab-website-5f952.firebasestorage.app",
  messagingSenderId: "456843068100",
  appId: "1:456843068100:web:21ade159f0166ba0897f91",
  measurementId: "G-BPL4QQNRWP"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const appId = 'lab-website-local';