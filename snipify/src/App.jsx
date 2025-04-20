import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WebPlayback from './WebPlayback.jsx';
import Login from './Login.jsx';
import Playlists from './Playlists.jsx';
import PlaylistPlayer from './PlaylistPlayer.jsx';
import './App.css';

function App() {
  const [token, setToken] = useState('');

  useEffect(() => {
    async function getToken() {
      try {
        const response = await fetch('/auth/token');

        if (!response.ok) throw new Error('Network response was not ok');

        const json = await response.json();
        setToken(json.access_token);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    }

    getToken();
  }, []);

  if (!token) return <Login />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Playlists token={token} />} />
        <Route path="/playlist/:playlistId" element={<PlaylistPlayer token={token} />} />
      </Routes>
    </Router>
  );
}

export default App;
