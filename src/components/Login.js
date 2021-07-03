import React, {useEffect, useState} from 'react';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from '../firebase';
import '../App.css';

const Login = () => {
    const uiConfig = {
        signInFlow: "popup",
        signInSuccessUrl: "/",
        signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
    }

    return (
        <div>
            <p className='center font'>googleからログインしてください</p>
            <p className='center font'>失敗したらリロードしてやり直してみてください</p>
            <StyledFirebaseAuth
                 uiConfig={uiConfig}
                 firebaseAuth={firebase.auth()}
            />
        </div>
    )
}

export default Login
