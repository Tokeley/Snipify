import React, { useState } from 'react';
import MobileWrapper from '../components/MobileWrapper';
import { useSettings } from '../contexts/SettingsContext.jsx';
import { useToken } from '../contexts/TokenContext'; // Assuming you are using this context for token management

const Settings = () => {
  // State for skip forward time and volume
  const { startTime, setStartTime, skip, setSkip, volume, setVolume } = useSettings();
  const { token, setToken } = useToken(); // Retrieve token and setToken function

  // Handler to change the start time
  const handleStartChange = (e) => {
    setStartTime(parseInt(e.target.value));
  };

  // Handler to change the skip time
  const handleSkipChange = (e) => {
    setSkip(parseInt(e.target.value));
  };

  // Handler to change the volume
  const handleVolumeChange = (e) => {
    setVolume(e.target.value / 100);
  };

 // Log out handler
const handleLogout = async () => {
    // Clear token on client side no matter what
    setToken('');
    window.location.href = '/login'; // Redirect to login page
};


  return (
    <MobileWrapper>
      <div className="flex flex-col items-center">
        <h1 className="text-3xl mb-6 text-center font-semibold">Settings</h1>

        {/* Skip Forward Time Range Slider */}
        <div className="w-full max-w-xs mb-6">
          <label htmlFor="skip-forward" className="text-xl font-semibold">Start Time</label>
          <input
            id="skip-forward"
            type="range"
            min="0"
            max="30"
            value={startTime}
            onChange={handleStartChange}
            className="range range-accent w-full"
            step="5" // Step increment of 5 seconds
          />
          <div className="flex justify-between px-2.5 mt-2 text-xs">
            <span>0s</span>
            <span>5s</span>
            <span>10s</span>
            <span>15s</span>
            <span>20s</span>
            <span>25s</span>
            <span>30s</span>
          </div>
        </div>

        {/* Skip Forward Time Range Slider */}
        <div className="w-full max-w-xs mb-6">
          <label htmlFor="skip-forward" className="text-xl font-semibold">Skip Time</label>
          <input
            id="skip-forward"
            type="range"
            min="5"
            max="25"
            value={skip}
            onChange={handleSkipChange}
            className="range range-accent w-full"
            step="5" // Step increment of 5 seconds
          />
          <div className="flex justify-between px-2.5 mt-2 text-xs">
            <span>5s</span>
            <span>10s</span>
            <span>15s</span>
            <span>20s</span>
            <span>25s</span>
          </div>
        </div>

        {/* Volume Slider */}
        <div className="w-full max-w-xs mb-6">
          <label htmlFor="volume" className="text-xl font-semibold">Volume</label>
          <input
            id="volume"
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={handleVolumeChange}
            className="range range-accent w-full"
          />
          <div className="flex justify-between text-xs mt-2">
            <span>0</span>
            <span>100</span>
          </div>
        </div>

        <div className="w-full max-w-xs mb-6">
          <button className="btn w-full shadow" onClick={handleLogout}>Log Out</button>
        </div>
      </div>
    </MobileWrapper>
  );
};

export default Settings;


