import firebase from "firebase";

const config = {
	apiKey: "AIzaSyCaJ4753A8RNTl5T56cqe0El2nUWRa0NB8",
	authDomain: "social-animals-4fb45.firebaseapp.com",
	databaseURL: "https://social-animals-4fb45.firebaseio.com",
	projectId: "social-animals-4fb45",
	storageBucket: "social-animals-4fb45.appspot.com",
	messagingSenderId: "176848507510"
};

firebase.initializeApp(config);

export default firebase;

export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
