import React, { useState, useEffect } from 'react';
import MobileWrapper from '../components/MobileWrapper.jsx';
import { useToken } from '../contexts/TokenContext.jsx';
import { useNavigate } from 'react-router-dom';
import PlaylistCard from '../components/PlaylistCard.jsx';
import Loading from './Loading.jsx';

const PlaylistSelect = () => {
  const { token } = useToken();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [userDisplayName, setUserDisplayName] = useState(null); // Store user's display name
  const limit = 21;

  const fetchPlaylists = async (offset) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch playlists');

      const data = await response.json();
      // Filter playlists by userDisplayName
      const filteredPlaylists = data.items.filter(
        (playlist) => playlist.owner.display_name === userDisplayName
      );
      setPlaylists(filteredPlaylists);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDisplayName = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch user data');

      const data = await response.json();
      setUserDisplayName(data.display_name); // Set the display name of the user
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserDisplayName(); // Fetch the user's display name
    }
  }, [token]);

  useEffect(() => {
    if (token && userDisplayName) {
      const offset = (page - 1) * limit;
      fetchPlaylists(offset);
    }
  }, [token, userDisplayName, page]);

  const handleClick = (id) => {
    window.location.href = `/swipe-remove/${id}`
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <MobileWrapper>
      <div className="flax">
        <h1 className="text-3xl mb-3 text-center font-semibold">Select Playlist</h1>
        <p className='text-gray-500 mb-3 text-center'>To remove tracks from</p>
        {/* Wrap Playlist Cards in a Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} handleClick={handleClick} />
          ))}
        </div>
      </div>

      <div className="join my-5 justify-center flex">
        <button
          className="join-item btn"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          «
        </button>
        <button className="join-item btn cursor-default">Page {page}</button>
        <button
          className="join-item btn"
          onClick={() => setPage((prev) => prev + 1)}
        >
          »
        </button>
      </div>
    </MobileWrapper>
  );
};

export default PlaylistSelect;
