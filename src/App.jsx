import { useState } from 'react';
import './App.css';
import LogInSignUp from './components/Authentication/LogInSighUp.jsx';
import Editor from './components/Editor/Editor.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  function changeApp() {
    setIsLoggedIn(true);
  }

  function logOut(e)
  {
    const userConfirmed = window.confirm("Are you sure you saved all your files?");
    if (userConfirmed) {
      sessionStorage.removeItem('current-user');
      setIsLoggedIn(false);
    }
  }
  return (
    <div className="app-container">
      {!isLoggedIn ? (
        <>
          <h1>Welcome to The Text Editor Website!!</h1>
          <LogInSignUp end={changeApp} /></>
      ) : (
        <>
          <button className="log-out" type='button' onClick={logOut}>Log Out</button>
          <Editor logOut={logOut}></Editor>
        </>
      )}
    </div>
  )
}

export default App
