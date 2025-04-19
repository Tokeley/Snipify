import React, { useState, useEffect } from 'react';
import WebPlayback from './WebPlayback.jsx'
import Login from './Login.jsx'
import './App.css';

function App() {
  const [token, setToken] = useState('');

  useEffect(() => {
      async function getToken() {
        try {
          const response = await fetch('/auth/token');
          
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
    
          const json = await response.json();
          setToken(json.access_token);
        } catch (error) {
          console.error('Error fetching token:', error);
        }
      }
    
      getToken();
    
    }, []);

  return (
    <>
        { (token === '') ? <Login/> : <WebPlayback token={token} /> }
    </>
  );
}

export default App
