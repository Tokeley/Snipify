import React, { useEffect, useState } from 'react';
import MobileWrapper from '../components/MobileWrapper';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToken } from '../contexts/TokenContext.jsx';
import { ArrowDown } from 'lucide-react';
import Loading from './Loading.jsx';

const ConfirmToAndFromForAdd = () => {
  const { state } = useLocation();
  const { token } = useToken();
  const [fromDetails, setFromDetails] = useState(null);
  const [toDetails, setToDetails] = useState(null);
  const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

  const fromCollectionType = state?.fromCollectionType || null;
  const fromCollectionId = state?.fromCollectionId || null;
  const playlistId = state?.playlistId || null;

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const fromResponse = await fetch(
          `https://api.spotify.com/v1/${fromCollectionType}s/${fromCollectionId}`,
          { headers }
        );
        const fromData = await fromResponse.json();

        const toResponse = await fetch(
          `https://api.spotify.com/v1/playlists/${playlistId}`,
          { headers }
        );
        const toData = await toResponse.json();

        setFromDetails(fromData);
        setToDetails(toData);
      } catch (error) {
        console.error('Error fetching Spotify collection data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token && fromCollectionType && fromCollectionId && playlistId) {
      fetchDetails();
    }
  }, [token, fromCollectionType, fromCollectionId, playlistId]);

  const handleConfirm = () => {
    navigate('/swipe-add/' + playlistId , { state: { fromCollectionType: fromCollectionType, fromCollectionId: fromCollectionId, toPlaylistName: toDetails.name} })
  }

  if (loading || !fromDetails || !toDetails) return <Loading />;

  return (
    <MobileWrapper>
      <div className="flex flex-col items-center min-h-screen px-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Confirm Track Locations</h1>

        {/* From Collection (Bottom) */}
        <div className="text-center">
        <p className="font-semibold py-2">From</p>
          <img
            src={fromDetails.images?.[0]?.url}
            alt={fromDetails.name}
            className="w-32 h-32 rounded-lg object-cover mb-2 mx-auto"
          />
          <p className="font-semibold">{fromDetails.name}</p>
          <p className="text-sm text-gray-500 capitalize">{fromCollectionType}</p>
        </div>

        {/* Down Arrow */}
        <div className="my-3 w-14 h-14">
                <img src="downarrow.png" alt="Down arrow" className="mx-auto" />
        </div>

        {/* To Collection (Top) */}
        <div className="text-center mb-4">
            <p className="font-semibold py-2">Into</p>
          <img
            src={toDetails.images?.[0]?.url}
            alt={toDetails.name}
            className="w-32 h-32 rounded-lg object-cover mb-2 mx-auto"
          />
          <p className="font-semibold">{toDetails.name}</p>
          <p className="text-sm text-gray-500">Playlist</p>
        </div>

        <div className="w-full max-w-xs mb-6">
          <button className="btn w-full shadow" onClick={handleConfirm}>Start Swippinig!</button>
        </div>
      </div>
    </MobileWrapper>
  );
};

export default ConfirmToAndFromForAdd;
