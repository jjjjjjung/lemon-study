import React, { useEffect, useState } from 'react';
import AppRouter from "components/Router"
import { authService } from 'fbase';
import { getAuth, onAuthStateChanged } from "firebase/auth"

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(()=>{
    const auth = getAuth();
    onAuthStateChanged(auth,(user) => {
      if(user){
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      }else{
        setIsLoggedIn(false);
        setUserObj(null)
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  }
  return (
      <>
        {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={isLoggedIn} userObj={userObj} /> : "Initializing..."}
        <footer>&copy; {new Date().getFullYear()} ntwitter</footer>
      </>
  );
}

export default App;