import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyBlh2Z7yb0PNZLlXhOfqydn_YFGBEWR3pk",
    authDomain: "informatia-afee5.firebaseapp.com",
    databaseURL: "https://informatia-afee5.firebaseio.com",
    projectId: "informatia-afee5",
    storageBucket: "informatia-afee5.appspot.com",
    messagingSenderId: "319902405905"
}

firebase.initializeApp(config)

export const ref = firebase.database().ref()
export const db = firebase.database();
export const firebaseAuth = firebase.auth
export const storage = firebase.storage()
export const str = firebase.storage;
