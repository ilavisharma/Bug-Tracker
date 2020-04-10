import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';
import 'bootstrap/dist/css/bootstrap.min.css';
import LandingPage from './Landing/LandingPage';
import Homepage from './Homepage/Homepage';
import SignIn from './Auth/SignIn';
import Error404 from '../utils/Error404';
import GlobalState from './GlobalState';

const App = () => {
  return (
    <GlobalState>
      <BrowserRouter>
        <LastLocationProvider>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/home" component={Homepage} />
            <Route exact path="/signin" component={SignIn} />
            <Route component={Error404} />
          </Switch>
        </LastLocationProvider>
      </BrowserRouter>
    </GlobalState>
  );
};

export default App;
