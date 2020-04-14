import React, { useMemo } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';
import 'bootstrap/dist/css/bootstrap.min.css';
import LandingPage from './Landing/LandingPage';
import Homepage from './Homepage/Homepage';
import SignIn from './Auth/SignIn';
import Error404 from '../utils/Error404';
import GlobalState from './GlobalState';
import DemoUserSignIn from './Auth/DemoUserSignIn';

const MemoRouter = () =>
  useMemo(
    () => (
      <BrowserRouter>
        <LastLocationProvider>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/home" component={Homepage} />
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/signin/demo" component={DemoUserSignIn} />
            <Route component={Error404} />
          </Switch>
        </LastLocationProvider>
      </BrowserRouter>
    ),
    []
  );

const App = () => {
  return (
    <GlobalState>
      <MemoRouter />
    </GlobalState>
  );
};

export default App;
