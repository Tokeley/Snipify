import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import { useToken } from '../contexts/TokenContext.jsx';
import { useSettings } from '../contexts/SettingsContext.jsx';
import MobileWrapper from '../components/MobileWrapper';
import TrackCard from "../components/TrackCard.jsx";
import Loading from "./Loading.jsx";
import { useNavigate } from 'react-router-dom'

import { PlayIcon, PauseIcon, Forward15, Back15 } from "../components/Icons.jsx";

const emptyTrack = {
  name: "",
  album: { images: [{ url: "" }] },
  artists: [{ name: "" }],
  uri: "",
};

const SwipeTracksRemove = () => {
  const { token } = useToken();
  const { startTime, skip, volume } = useSettings();
  const navigate = useNavigate();
  const { playlistId } = useParams(); 
  const [currentTrack, setCurrentTrack] = useState(emptyTrack);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const playerRef = useRef(null); 
  const previousTrackIdRef = useRef(null);
  const device_id = useRef("");
  const [playlist, setPlaylist] = useState("");
  const [tracksRemoved, setTracksRemoved] = useState([]);
  const allTracks = useRef([]);
  const [trackURIsDisplay, setTrackURIsDisplay] = useState([]);
  const [endReached, setEndReached] = useState(false);

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
        playerRef.current = "";
      }
    };
  }, []);

  // Fetch playlist data and extract track URIs
  useEffect(() => {
    const fetchPlaylistTracks = async () => {
      try {
        const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch playlist data');

        const data = await response.json();

        console.log("Playlist data:", data);

        const tracks = data.tracks.items.map(item => ({
          uri: item.track?.uri,
          name: item.track?.name,
        }));
  
        allTracks.current = tracks;

        console.log("All tracks:", allTracks.current);

        setPlaylist(data);
      } catch (error) {
        console.error("Error fetching playlist data:", error);
      }
    };

    fetchPlaylistTracks();
  }, [playlistId, token]);


  // Load Spotify SDK and create player
  useEffect(() => {
    const loadSpotifySDK = () => {
      if (!window.Spotify) {
        window.onSpotifyWebPlaybackSDKReady = createPlayer;
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);
      } else {
        createPlayer();
      }
    };
  
    const createPlayer = () => {
        if (playerRef.current) return; // prevent multiple inits!
    
        const newPlayer = new window.Spotify.Player({
            name: 'Snipify',
            getOAuthToken: cb => cb(token),
            volume: volume
        });
    
        playerRef.current = newPlayer;
    
        newPlayer.addListener('ready', ({ device_id: receivedDeviceId }) => {
            console.log('Ready with Device ID', receivedDeviceId);
            device_id.current = receivedDeviceId;
            setActive(true);
          });
    
        newPlayer.addListener('not_ready', ({ device_id: receivedDeviceId }) => {
            console.log('Device ID has gone offline', receivedDeviceId);
            setActive(false);
        });

        newPlayer.addListener('player_state_changed', async (state) => {
          if (!state) return;
        
          const current = state.track_window.current_track;
        
          setPaused(state.paused);
          setActive(true);
            setCurrentTrack(current);
             // Find the index of the current track by track ID in allTracks (assuming allTracks contains track IDs)
             const indexOfCurrentTrack = allTracks.current.findIndex(
              (track) => (track.name === current.name)
            );

            console.log("Index of current track:", indexOfCurrentTrack);

            // Get the upcoming tracks (next 4 tracks after the current one)
            const upcomingTracks = allTracks.current.slice(indexOfCurrentTrack + 1, indexOfCurrentTrack + 5).map(track => track.uri);
            console.log("Upcoming tracks:", upcomingTracks);
            setTrackURIsDisplay(upcomingTracks);

            console.log("Index of current track:", indexOfCurrentTrack);

          // Handle seeking
          if (
            current.id &&
            current.id !== previousTrackIdRef.current &&
            device_id.current
          ) {
            previousTrackIdRef.current = current.id;

            const startTimeInMs = startTime * 1000; // Convert to milliseconds
            try {
              await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${startTimeInMs}&device_id=${device_id.current}`, {
                method: 'PUT',
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
            } catch (err) {
              console.error("Seek failed", err);
            }
          }
        });
        
  
      newPlayer.connect();
    };
  
    loadSpotifySDK();
  }, [token]);
  
  
  // Start playback when trackURIs are set and device_id is available
  useEffect(() => {
    const startPlayback = async () => {
      if (!device_id.current) return;
  
      try {
        // Transfer playback
        await fetch('https://api.spotify.com/v1/me/player', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            device_ids: [device_id.current],
            play: true
          })
        });

        const uris = allTracks.current.map(track => track.uri);
        await fetch('https://api.spotify.com/v1/me/player/play', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uris: uris
          })
        });
  
  
        setActive(true);

        
      } catch (err) {
        console.error("Error starting playback:", err);
      }
    };
  
    startPlayback();
  }, [allTracks.current, device_id.current, token, playlistId]);

  const handleNextTrack = () => {
    if (currentTrack.uri == allTracks.current[allTracks.current.length - 1].uri){
      setEndReached(true);
      console.log("End of playlist reached");
      playerRef.current?.togglePlay();
    }
    else {
      playerRef.current?.nextTrack();
    }
  }

  const handleRemoveTrack = (trackURI) => {
    setTracksRemoved((prev) => [...prev, trackURI]);
  }

  const seekBackward15 = async () => {
    playerRef.current.getCurrentState().then(state => {
      if (!state) {
        console.error('User is not playing music through the Web Playback SDK');
        return;
      }
    
      var currentPos = state.position;

      if (currentPos != null) {
        playerRef.current.seek(Math.max(0, currentPos - skip * 1000));
        console.log("Seeked back 15 seconds");
      }
    });
  };
  
  const seekForward15 = async () => {
    playerRef.current.getCurrentState().then(state => {
      if (!state) {
        console.error('User is not playing music through the Web Playback SDK');
        return;
      }
    
      var currentPos = state.position;

      if (currentPos != null) {
        playerRef.current.seek(currentPos + skip * 1000);
        console.log("Seeked forward 15 seconds");
      }
    });
  };


  if (!is_active) {
    return (
      <Loading/>
    );
  }



  if (endReached) {
    return (
      <MobileWrapper>
        <div
          className="card w-72"
        >
          <div className="card-body p-4 text-center">
            <h2 className="text-xl font-semibold text-center mb-2">{playlist.name}</h2>
            <img
              src={playlist.images[0]?.url}
              alt={playlist.name}
              className="w-full h-full object-cover rounded-lg pointer-events-none select-none shadow-2xl"
            />
            <p className="text-center text-gray-500 my-3 text-lg">Tracks to be removed: {tracksRemoved.length}</p>
            { tracksRemoved.length == 0
              ?  
                <button
                className="btn shadow-2xl flex items-center justify-center"
                onClick={() => { navigate(`/`) }}
              >
                Return Home
              </button>
              :
              <button
                className="btn btn-wide shadow-2xl"
                onClick={() =>
                  navigate('/confirm-remove', { state: { toRemoveUris: tracksRemoved, playlistId: playlistId, playlistName: playlist.name} })
                }
              >
                Confirm tracks to remove
              </button>
            }
          </div>
        </div>

      </MobileWrapper>
    );

  }


  return (
    <MobileWrapper>
      <h2 className="text-xl font-semibold text-center mb-2">{playlist.name}</h2>
      <p className="text-center text-gray-500 mb-6">Tracks to remove: {tracksRemoved.length}</p>
      <div className="relative h-[400px] grid place-items-center">
        {[currentTrack.uri, ...trackURIsDisplay].map((uri, index) => (
          <TrackCard
            key={uri}
            index={index}
            total={4}
            trackURI={uri}
            handleNextTrack={handleNextTrack}
            handleRemoveTrack={handleRemoveTrack}
          />
        ))}
      </div>
      <div className="flex justify-center items-center my-6 space-x-6">
      <div
        onClick={() => seekBackward15()}
        className="relative hover:cursor-pointer transition-transform duration-150 active:scale-90"
      >
        <Back15 className="w-10 h-10" />
        <span className="mt-1 absolute inset-0 flex items-center justify-center text-sm font-bold  pointer-events-none">
          {skip}
        </span>
      </div>

      <div
        onClick={() => playerRef.current?.togglePlay()}
        className="hover:cursor-pointer transition-transform duration-150 active:scale-90"
      >
        {is_paused ? (
          <PlayIcon className="w-10 h-10" />
        ) : (
          <PauseIcon className="w-10 h-10" />
        )}
      </div>

      <div
        onClick={() => seekForward15()}
        className="relative hover:cursor-pointer transition-transform duration-150 active:scale-90"
      >
        <Forward15 className="w-10 h-10" />
        <span className="mt-1 absolute inset-0 flex items-center justify-center text-sm font-bold  pointer-events-none">
          {skip}
        </span>
      </div>
      </div>
      <button
          className="btn btn-wide shadow-2xl"
          onClick={() =>
            navigate('/confirm-remove', { state: { toRemoveUris: tracksRemoved, playlistId: playlistId, playlistName: playlist.name} })
          }
        >
          Confirm tracks to remove
        </button>
    </MobileWrapper>
  )
}

export default SwipeTracksRemove