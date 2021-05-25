import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyCOK0ZMFsseLPhfuBFaX8o_DwSThfCaOWs",
    authDomain: "eatup-38786.firebaseapp.com",
    projectId: "eatup-38786",
    storageBucket: "eatup-38786.appspot.com",
    messagingSenderId: "1059761084597",
    appId: "1:1059761084597:web:ba1bddd6f7f9d6d0fe46fc",
    measurementId: "G-1RNDRNT3PM"
  };


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

firebase.analytics();

export { firebase };
