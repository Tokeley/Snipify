import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const SettingsContext = createContext();

// Provider component
export const SettingsProvider = ({ children }) => {
  // Get saved settings from localStorage or set default values
  const savedStartTime = localStorage.getItem('start') !== null ? parseInt(localStorage.getItem('start')) : 30;
  const savedSkip = localStorage.getItem('skip') !== null ? parseInt(localStorage.getItem('skip')) : 15;
  const savedVolume = localStorage.getItem('volume') !== null ? parseFloat(localStorage.getItem('volume')) : 0.5;

  const [startTime, setStartTime] = useState(savedStartTime);
  const [skip, setSkip] = useState(savedSkip);
  const [volume, setVolume] = useState(savedVolume);

  useEffect(() => {
    // Save the settings to localStorage whenever they change, including 0 values
    if (startTime !== null) {
      localStorage.setItem('start', startTime);
    }
    if (skip !== null) {
      localStorage.setItem('skip', skip);
    }
    if (volume !== null) {
      localStorage.setItem('volume', volume);
    }
  }, [startTime, skip, volume]);

  return (
    <SettingsContext.Provider value={{ startTime, setStartTime, skip, setSkip, volume, setVolume }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use the context
export const useSettings = () => useContext(SettingsContext);
