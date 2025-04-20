import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import { useToken } from '../contexts/TokenContext.jsx';
import MobileWrapper from '../components/MobileWrapper';
import TrackCard from "../components/TrackCard.jsx";
import Loading from "./Loading.jsx";

const emptyTrack = {
  name: "",
  album: { images: [{ url: "" }] },
  artists: [{ name: "" }],
  uri: "",
};

const SwipeTracksAdd = () => {
  const { token } = useToken();
  const { playlistId } = useParams(); 
  const [currentTrack, setCurrentTrack] = useState(emptyTrack);

  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const playerRef = useRef(null); 
  const previousTrackIdRef = useRef(null);
  const hasSeekedRef = useRef(false); 
  const device_id = useRef("");
  
  const [trackURIs, setTrackURIs] = useState([]);
  const currentTrackURIRef = useRef("");

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
        const uris = data.tracks.items
          .map(item => item.track?.uri)
          .filter(uri => uri); // Filter out nulls

        setTrackURIs(uris);
        console.log("Fetched track URIs:", uris);
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

          if (current.uri !== currentTrackURIRef.current) {
            console.log("Current track changed:", current);
            setCurrentTrack(current);
            currentTrackURIRef.current = current.uri;
          }
        
          // Handle seeking
          if (
            current.id &&
            current.id !== previousTrackIdRef.current &&
            device_id.current
          ) {
            previousTrackIdRef.current = current.id;
            hasSeekedRef.current = true;
        
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
      if (trackURIs.length === 0 || !device_id.current) return;
  
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
  
        // Start playing the playlist context
        await fetch('https://api.spotify.com/v1/me/player/play', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uris: trackURIs // If you want to start with a custom playlist, keep this
          })
        });
  
  
        setActive(true);

        
      } catch (err) {
        console.error("Error starting playback:", err);
      }
    };
  
    startPlayback();
  }, [trackURIs, device_id.current, token]);

  if (!is_active) {
    return (
      <Loading/>
    );
  }


  return (
    <MobileWrapper>
      <div className="relative h-[400px] grid place-items-center">
        {trackURIs.slice(0, 4).map((uri, index) => (
          <TrackCard
            key={uri}
            index={index}
            total={4}
            trackURI={uri}
            trackURIs={trackURIs}
            setTrackURIs={setTrackURIs}
            playerRef={playerRef}
          />
        ))}
      </div>
            <div className="flex justify-center items-center mt-4">
        <button className="btn-spotify" onClick={() => playerRef.current?.previousTrack()}>
            &lt;&lt;
        </button>
        <button className="btn-spotify" onClick={() => playerRef.current?.togglePlay()}>
            {is_paused ? "PLAY" : "PAUSE"}
        </button>
        <button className="btn-spotify" onClick={() => playerRef.current?.nextTrack()}>
            &gt;&gt;
        </button>
      </div>
    </MobileWrapper>
  )
}

export default SwipeTracksAdd