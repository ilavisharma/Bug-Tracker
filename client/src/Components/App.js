import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';
import LandingPage from './Landing/LandingPage';
import Homepage from './Homepage/Homepage';
import SignIn from './Auth/SignIn';
import Error404 from '../utils/Error404';
import AuthContext from '../Context/AuthContext';

const App = () => {
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
    <BrowserRouter>
      <LastLocationProvider>
        <AuthContext.Provider value={{ user, token, signIn, signOut }}>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/home" component={Homepage} />
            <Route exact path="/signin" component={SignIn} />
            <Route component={Error404} />
          </Switch>
        </AuthContext.Provider>
      </LastLocationProvider>
    </BrowserRouter>
  );
};

export default App;
