import React, {useState, useEffect, Children} from 'react';
import {auth, db} from '../firebase';
import firebase from "firebase/app";
import Logo from '../styles/cogicogi.svg';
import { motion } from 'framer-motion';

export const AuthContext = React.createContext();

const logoAnimation =  {
	transition: { duration: 1,
		          ease: "easeInOut", },
	animate: { opacity: 1, rotate: 360 },
}

export const AuthProvider = ({children}) => {
	const [loading, setLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) =>{
			if(user !== null) {
				const o = {
					username: user.displayName,
                    photo: user.photoURL,
                    uid: user.uid,
					create:  firebase.firestore.FieldValue.serverTimestamp(),
				}
				db.collection('users').doc(user.uid).set(o, { merge: true})
			}
			setCurrentUser(user);
			setLoading(false)
		})
		return unsubscribe
	}, []);

	return (
		<AuthContext.Provider value={{currentUser}}>
			<>
            	{
					loading  ? (
						<motion.div  {...logoAnimation}>
						    <img src={Logo} olt="loading..." />
						</motion.div>
					): (
						children
					)}
			</>
        </AuthContext.Provider>
	)
}