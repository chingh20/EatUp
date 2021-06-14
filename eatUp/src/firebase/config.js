
import { firebase } from '@firebase/app';
import '@firebase/auth';
import '@firebase/firestore';
import '@firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyCOK0ZMFsseLPhfuBFaX8o_DwSThfCaOWs",
    authDomain: "eatup-38786.firebaseapp.com",
    projectId: "eatup-38786",
    storageBucket: "eatup-38786.appspot.com",
    messagingSenderId: "1059761084597",
    appId: "1:1059761084597:web:ba1bddd6f7f9d6d0fe46fc",
    measurementId: "G-1RNDRNT3PM"
  };



firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export {firebase, storage};
