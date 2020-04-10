import React, { useState } from 'react';
import axios from 'axios';
import AuthContext from '../Context/AuthContext';

const baseURL =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:4000'
    : 'https://api.bugtracker.lavisharma.me';

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
    <AuthContext.Provider
      value={{
        user,
        token,
        signIn,
        signOut,
        api: axios.create({
          baseURL,
          headers: {
            authorization: localStorage.getItem('token')
          }
        })
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default GlobalState;
