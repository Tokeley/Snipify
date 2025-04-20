import React, { createContext, useState, useContext } from 'react';

// Create the context
const TokenContext = createContext();

// Provider component
export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState('');

  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};

// Custom hook to use the context
export const useToken = () => useContext(TokenContext);
