import React, {useState, useEffect} from 'react'
import MobileWrapper from '../components/MobileWrapper';
import { useToken } from '../contexts/TokenContext.jsx';
import { useNavigate } from 'react-router-dom';
import PlaylistCard from '../components/PlaylistCard.jsx';
import Loading from '../pages/Loading.jsx';



const PlaylistSelect = () => {
  const { token } = useToken();

  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch playlists');

        const data = await response.json();
        console.log(data.items);
        setPlaylists(data.items);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [token]);

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
    </MobileWrapper>
  )
}

export default PlaylistSelect