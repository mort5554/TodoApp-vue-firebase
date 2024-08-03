// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB66kexn8PUtAu97tjXTUFsN13C1KLeIBE',
  authDomain: 'badass-todo-8e984.firebaseapp.com',
  projectId: 'badass-todo-8e984',
  storageBucket: 'badass-todo-8e984.appspot.com',
  messagingSenderId: '373186832280',
  appId: '1:373186832280:web:73c929a5fe7b0cdca4aded'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }
