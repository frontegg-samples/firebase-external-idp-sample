import './App.css';
import { useState } from 'react';
import { initializeApp } from "firebase/app";
import { AdminPortal, HostedLogin, useAuthActions } from "@frontegg/react";
import { getAuth, signInWithPopup, OAuthProvider, signOut } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCNCLmqDPW8nQwiu2IiDsMnNVR5wLXxkl0",
    authDomain: "test-frontegg-integration.firebaseapp.com",
    projectId: "test-frontegg-integration",
    storageBucket: "test-frontegg-integration.appspot.com",
    messagingSenderId: "397043190502",
    appId: "1:397043190502:web:73270761e83a7310594927",
    measurementId: "G-T2PL3XTBPP"
};

// Initialize Firebase
initializeApp(firebaseConfig);

function App() {
    const auth = getAuth();

    const {loadProfile, loadTenants} = useAuthActions()
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    auth.onAuthStateChanged((user) => {
        if (!isAuthReady) {
            setIsAuthReady(true);
        }

        if (user) {
            console.log('loggedIn user - ', user);
        }
        setCurrentUser(user);
    });

    const logoutUser = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });
    }

    const loginUsingFrontegg = () => {
        const auth = getAuth();
        const provider = new OAuthProvider('oidc.frontegg');
        provider.addScope('openid');
        provider.addScope('profile');
        provider.addScope('email');

        signInWithPopup(auth, provider).then((result) => {
            console.log('result', result);
            const credential = OAuthProvider.credentialFromResult(result);
            HostedLogin.setAuthentication(true, credential.idToken);
            loadProfile();
            loadTenants();

        }).catch((error) => {
            console.error(error);
        });

        // signInWithPopup(auth, provider).then((result) => {
        //     console.log('result', result)
        // }).catch((error) => {
        //     console.error(error);
        // });
    }

    if (!isAuthReady) {
        return <div className="App">Loading...</div>
    }

  return (
    <div className="App">
        {currentUser ?
            <div>
                <div>Logged in as {currentUser.email}</div>
                <button onClick={() => logoutUser(auth)}>Logout</button>
                <button onClick={() => AdminPortal.show()}>Open admin portal</button>
            </div>
            :
            <div>
                <button onClick={() => loginUsingFrontegg()}>Login with Frontegg</button>
            </div>
        }
    </div>
  );
}

export default App;
