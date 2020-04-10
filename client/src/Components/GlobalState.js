import React, { useState } from 'react';
import AuthContext from '../Context/AuthContext';

const GlobalState = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const signIn = (user, token) => {
    setUser(user);
    localStorage.setItem('token', token);
    setToken(token);
  };
  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };
  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default GlobalState;
