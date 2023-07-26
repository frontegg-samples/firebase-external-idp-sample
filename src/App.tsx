import { useCallback, useEffect, useState } from 'react'
import { signOut, getAuth } from 'firebase/auth'
import './App.css'
import { User, OAuthProvider, signInWithRedirect, getRedirectResult } from '@firebase/auth';
import { AdminPortal, ContextHolder, HostedLogin, useAuth, useAuthActions, useTenantsActions } from '@frontegg/react';
import { api } from '@frontegg/rest-api';

const authProvider = new OAuthProvider('oidc.frontegg');


function App() {
  const { setTenantsState } = useTenantsActions()
  const { isLoading } = useAuth()
  const { setState } = useAuthActions()
  const [ isAuthReady, setAuthReady ] = useState<boolean>(false);
  const [ currentUser, setCurrentUser ] = useState<User | null>(null);

  useEffect(() => {
    // wait for firebase initialization to complete
    getAuth().authStateReady().then(() => {
      setAuthReady(true)
    })
  }, [ setAuthReady ])


  const checkRedirectResult = useCallback(()=>{
    getRedirectResult(getAuth()).then(async (result) => {
      if (result) {
        console.log('getRedirectResult()', 'oauth redirect result found')
        if (result.providerId === authProvider.providerId) {
          console.log('getRedirectResult("oidc.frontegg")', 'credential', result)
          const credential = OAuthProvider.credentialFromResult(result)!;

          const {
            user,
            tenants,
            activeTenant
          } = await api.auth.generateLoginResponseV3({ accessToken: credential.idToken, } as never)

          console.log(credential.idToken)

          HostedLogin.setAuthentication(true, credential.idToken, user);
          setTenantsState({ tenants, activeTenant, loading: false, error: null })

        }
      } else {
        console.log('getRedirectResult()', 'no oauth redirect result found')
        if (ContextHolder.getAccessToken() == '') {
          setState({ isLoading: true })
          // user already logged in and we don't have oauth access token
          loginUsingFrontegg()
        }
      }
    }).catch((error) => {
      console.error('getRedirectResult()', error)
    })

  }, [setTenantsState]);

  useEffect(() => {
    if (!isAuthReady) {
      console.log('isAuthReady is false');
      return;
    }
    const unsubscribe = getAuth().onAuthStateChanged(async (user: User | null) => {
      console.log('onAuthStateChanged()', 'user', user, isAuthReady);
      setCurrentUser(user);

      if(user) {
        checkRedirectResult();
      }
    });

    return () => {
      unsubscribe()
    }
  }, [setCurrentUser, isAuthReady, checkRedirectResult])


  const logoutUser = useCallback(() => {
    signOut(getAuth()).then(() => {
      console.log('Sign-out successful')
    }).catch((error) => {
      console.error('failed to logout', error)
    });
  }, [])


  const loginUsingFrontegg = useCallback(() => {

    authProvider.addScope('openid');
    authProvider.addScope('profile');
    authProvider.addScope('email');

    signInWithRedirect(getAuth(), authProvider).then(() => {
      console.log('navigate to frontegg login page')
    }).catch(error => {
      console.error('failed to signIn with redirect', error)
    })
  }, [])

  if (!isAuthReady || isLoading) {
    return <h1>
      Loading...
    </h1>
  }


  return (
    <>
      {currentUser ?
        <div>
          <div>Logged in as {currentUser.email}</div>
          <button onClick={logoutUser}>Logout</button>
          <button onClick={() => AdminPortal.show()}>Open admin portal</button>
        </div>
        :
        <div>
          <button onClick={loginUsingFrontegg}>Login with Frontegg</button>
        </div>
      }
    </>
  )
}

export default App
