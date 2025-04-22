import React, { useState, useEffect } from 'react';
import MobileWrapper from '../components/MobileWrapper';
import { useToken } from '../contexts/TokenContext.jsx';
import { useNavigate } from 'react-router-dom';
import PlaylistCard from '../components/PlaylistCard.jsx';
import Loading from '../pages/Loading.jsx';

const PlaylistSelect = () => {
  const { token } = useToken();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 20; // changed to 20 as per your request

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
      setPlaylists(data.items);
    } catch (error) {
      console.error('Error fetching playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      const offset = (page - 1) * limit;
      fetchPlaylists(offset);
    }
  }, [token, page]);

  if (loading) {
    return <Loading />;
  }

  return (
    <MobileWrapper>
      <div className="pt-16">
        <h1 className="text-3xl mb-4 text-center font-semibold">Select Playlist</h1>
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
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
