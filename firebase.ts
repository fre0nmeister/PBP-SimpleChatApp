// firebase.ts
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  CollectionReference,
  DocumentData,
} from 'firebase/firestore';

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCORTMJI4PGMrX9uyjjTbb22eMqqDKFMEA',
  authDomain: 'rn-mahasiswa.firebaseapp.com',
  projectId: 'rn-mahasiswa',
  storageBucket: 'rn-mahasiswa.firebasestorage.app',
  messagingSenderId: '369493786946',
  appId: '1:369493786946:web:c2bfa1e15bae79a0aac8db',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const messagesCollection = collection(
  db,
  'messages',
) as CollectionReference<DocumentData>;

export {
  auth,
  db,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  messagesCollection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
};
