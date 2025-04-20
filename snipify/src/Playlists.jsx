import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToken } from './contexts/TokenContext.jsx';

const Playlists = ({playlist}) => {
    const [playlists, setPlaylists] = useState([]);
    const navigate = useNavigate();
    const { token } = useToken();
  
    useEffect(() => {
      const fetchPlaylists = async () => {
        try {
          const response = await fetch('https://api.spotify.com/v1/me/playlists', {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          if (!response.ok) throw new Error('Failed to fetch playlists');
  
          const data = await response.json();
          setPlaylists(data.items);
        } catch (error) {
          console.error('Error fetching playlists:', error);
        }
      };
  
      fetchPlaylists();
    }, [token]);
  
    return (
      <div className="playlists-container">
        <h2>Your Playlists</h2>
        {playlists.length === 0 ? (
          <p>No playlists found.</p>
        ) : (
          <div className="playlist-grid">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="playlist-card"
                onClick={() => navigate(`/playlist/${playlist.id}`)}
                style={{ cursor: 'pointer' }}
              >
                {Array.isArray(playlist.images) && playlist.images.length > 0 && playlist.images[0] !== null ? (
                  <img
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    className="playlist-image"
                    width={250}
                    height={250}
                  />
                ) : (
                  <div className="playlist-placeholder">No Image</div>
                )}
                <div className="playlist-info">
                  <h3>{playlist.name}</h3>
                  <p><strong>By:</strong> {playlist.owner.display_name}</p>
                  <p>{playlist.description || 'No description'}</p>
                  <p><strong>Total Tracks:</strong> {playlist.tracks.total}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  export default Playlists;
  