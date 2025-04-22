import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import { useToken } from '../contexts/TokenContext.jsx';
import MobileWrapper from '../components/MobileWrapper';
import TrackCard from "../components/TrackCard.jsx";
import Loading from "./Loading.jsx";

import { PlayIcon, PauseIcon, Forward15, Back15 } from "../components/Icons.jsx";

const emptyTrack = {
  name: "",
  album: { images: [{ url: "" }] },
  artists: [{ name: "" }],
  uri: "",
};

const SwipeTracksRemove = () => {
  const { token } = useToken();
  const { playlistId } = useParams(); 
  const [currentTrack, setCurrentTrack] = useState(emptyTrack);
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const playerRef = useRef(null); 
  const previousTrackIdRef = useRef(null);
  const device_id = useRef("");
  const [playlistName, setPlaylistName] = useState("");
  const [tracksRemoved, setTracksRemoved] = useState([]);
  
  const allTracks = useRef([]);
  const [trackURIsDisplay, setTrackURIsDisplay] = useState([]);

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

        setPlaylistName(data.name);
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
            name: 'Web Playback SDK',
            getOAuthToken: cb => cb(token),
            volume: 0.5
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


            console.log("Current track changed:", current);
            console.log("Current track ID:", current.external_ids?.isrc);
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
      
            try {
              await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=30000&device_id=${device_id.current}`, {
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
    playerRef.current?.nextTrack();
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
        playerRef.current.seek(Math.max(0, currentPos - 15 * 1000));
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
        playerRef.current.seek(currentPos + 15 * 1000);
        console.log("Seeked forward 15 seconds");
      }
    });
  };

  if (!is_active) {
    return (
      <Loading/>
    );
  }


  return (
    <MobileWrapper>
      <h2 className="text-xl font-semibold text-center mb-2">{playlistName}</h2>
      <p className="text-center text-gray-500 mb-6">Tracks removed: {tracksRemoved.length}</p>
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
      <div className="flex justify-center items-center mt-6 space-x-6">
        <div
          onClick={() => seekBackward15()} // Seek back 15 seconds
          className="hover:cursor-pointer transition-transform duration-150 active:scale-90"
        >
            <Back15 className="w-10 h-10" />
        </div>
        <div
          onClick={() => playerRef.current?.togglePlay()}
          className="hover:cursor-pointer transition-transform duration-150 active:scale-90"
        >
          {is_paused ? (
            <PlayIcon className="w-10 h-10 " />
          ) : (
            <PauseIcon className="w-10 h-10 " />
          )}
        </div>
        <div
          onClick={() => seekForward15()} // Seek forward 15 seconds
          className="hover:cursor-pointer transition-transform duration-150 active:scale-90"
        >
            <Forward15 className="w-10 h-10" />
        </div>

      </div>
    </MobileWrapper>
  )
}

export default SwipeTracksRemove