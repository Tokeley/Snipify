import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WebPlayback from './WebPlayback.jsx';
import Playlists from './Playlists.jsx';
import PlaylistPlayer from './PlaylistPlayer.jsx';
import './App.css';
import { useToken } from './contexts/TokenContext.jsx';
import AddOrRemoveSelect from './pages/AddOrRemoveSelect.jsx';
import ConfirmAdd from './pages/ConfirmAdd.jsx';
import ConfirmRemove from './pages/ConfirmRemove.jsx';
import FromTracksSelect from './pages/FromTracksSelect.jsx';
import Login from './pages/Login.jsx';
import PlaylistSelect from './pages/PlaylistSelect.jsx';
import SwipeTracksAdd from './pages/SwipeTracksAdd.jsx';
import SwipeTracksRemove from './pages/SwipeTracksRemove.jsx';
import Loading from './pages/Loading.jsx';


const App = () => {
  const { token, setToken } = useToken();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getToken() {
      try {
        const response = await fetch('https://snipify-production.up.railway.app/auth/token');
        if (!response.ok) throw new Error('Network response was not ok');
        const json = await response.json();
        setToken(json.access_token);
      } catch (error) {
        console.error('Error fetching token:', error);
      } finally {
        setLoading(false);
      }
    }

    getToken();
  }, [setToken]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <Routes>
        
        <Route 
          path="/" 
          element={token ? <Navigate to="/playlist-select" /> : <Navigate to="/login" />} 
        />

        <Route path="/login" element={<Login />} />
        <Route path="/playlist-select" element={<PlaylistSelect />} />
        <Route path="/add-or-remove" element={<AddOrRemoveSelect />} />
        <Route path="/confirm-add" element={<ConfirmAdd />} />
        <Route path="/confirm-remove" element={<ConfirmRemove />} />
        <Route path="/from-tracks-select" element={<FromTracksSelect />} />
        <Route path="/swipe-add/:playlistId" element={<SwipeTracksAdd />} />
        <Route path="/swipe-remove/:playlistId" element={<SwipeTracksRemove />} />
      </Routes>
    </Router>
  );
}

export default App;
