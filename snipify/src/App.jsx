import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import Settings from './pages/Settings.jsx';
import FromPlaylistOrAlbumSelect from './pages/FromPlaylistOrAlbumSelect.jsx';

const App = () => {
  const { token, setToken } = useToken();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1)); // skip the #
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token'); // optional if needed
  
    if (access_token) {
      setToken(access_token);
      window.history.replaceState(null, '', window.location.pathname); // Clean up the URL
    }
  
    setLoading(false);
  }, [setToken]);
  

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <Routes>
        
        <Route 
          path="/" 
          element={token ? <Navigate to="/add-or-remove" /> : <Navigate to="/login" />} 
        />

        <Route path="/login" element={<Login />} />
        <Route path="/playlist-select" element={<PlaylistSelect />} />
        <Route path="/add-or-remove" element={<AddOrRemoveSelect />} />
        <Route path="/confirm-add" element={<ConfirmAdd />} />
        <Route path="/confirm-remove" element={<ConfirmRemove />} />
        <Route path="/from-tracks-select" element={<FromTracksSelect />} />
        <Route path="/swipe-add/:playlistId" element={<SwipeTracksAdd />} />
        <Route path="/swipe-remove/:playlistId" element={<SwipeTracksRemove />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/from-playlist-or-album-select" element={<FromPlaylistOrAlbumSelect />} />
        
        {/* Fallback route */}
      </Routes>
    </Router>
  );
}

export default App;
