import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';


const PlaylistPlayer = ({ token }) => {
  const { playlistId } = useParams(); 
  const [is_paused, setPaused] = useState(false);
  const [is_active, setActive] = useState(false);
  const playerRef = useRef(null); 
  const previousTrackIdRef = useRef(null);
    const hasSeekedRef = useRef(false); 
    const device_id = useRef("");

  const [current_track, setTrack] = useState({
    name: "",
    album: { images: [{ url: "" }] },
    artists: [{ name: "" }]
  });
  const [trackURIs, setTrackURIs] = useState([]);

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
            device_id.current = receivedDeviceId; // ✅ Correct usage
            setActive(true);
          });
    
        newPlayer.addListener('not_ready', ({ device_id: receivedDeviceId }) => {
            console.log('Device ID has gone offline', receivedDeviceId);
            setActive(false);
        });

        newPlayer.addListener('player_state_changed', (state) => {
            if (!state) return;
          
            const current = state.track_window.current_track;
          
            setPaused(state.paused);
            setActive(true);
            setTrack(current); // still update state for display

            console.log("Device ID:", device_id.current); // Add this to verify it's populated

            if (
              current.id &&
              current.id !== previousTrackIdRef.current &&
              device_id.current // ✅ Make sure we have it
            ) {
              console.log("Track changed, seeking to 30s");
          
              previousTrackIdRef.current = current.id; // update immediately
              hasSeekedRef.current = true;
          
              fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=30000&device_id=${device_id.current}`, {
                method: 'PUT',
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }).catch(err => console.error("Seek failed", err));
            } else if (!hasSeekedRef.current && current.id === previousTrackIdRef.current) {
              // Prevent repeat seeks for the same track
              hasSeekedRef.current = true;
            }
        });
  
      newPlayer.connect();
    };
  
    loadSpotifySDK();
  }, [token]);
  
  

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
      <div className="container">
        <div className="main-wrapper">
          <b>Instance not active. Transfer your playback using your Spotify app</b>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="main-wrapper">
        <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />
        <div className="now-playing__side">
          <div className="now-playing__name">{current_track.name}</div>
          <div className="now-playing__artist">{current_track.artists[0].name}</div>

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
      </div>
    </div>
  );
};

export default PlaylistPlayer;
