import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const TokenContext = createContext();

// Provider component
export const TokenProvider = ({ children }) => {
  // Get the saved token from localStorage or set an empty string as default
  const savedToken = localStorage.getItem('token') || '';

  const [token, setToken] = useState(savedToken);

  useEffect(() => {
    // Save the token to localStorage whenever it changes
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');  // Optionally clear the token from localStorage if it's empty
    }
  }, [token]);

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};

// Custom hook to use the context
export const useToken = () => useContext(TokenContext);
