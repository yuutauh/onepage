import firebase from "firebase/app"
import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyCozM7wZyULMGy_vrDsJIdCKm0Yvoq5CcI",
	authDomain: "onepage-33ff7.firebaseapp.com",
	projectId: "onepage-33ff7",
	storageBucket: "onepage-33ff7.appspot.com",
	messagingSenderId: "490323431026",
	appId: "1:490323431026:web:2466617f015dd812bc7ceb",
	measurementId: "G-VXC5CSLGQF"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export default firebase;