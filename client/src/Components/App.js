import React, { useMemo, Suspense, lazy } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import LandingPage from './Landing/LandingPage';
import GlobalState from './GlobalState';
import LoadingSpinner from '../utils/LoadingSpinner';
import '../styles/bootstrap.scss';
import About from './About';

const DemoUserSignIn = lazy(() => import('./Auth/DemoUserSignIn'));
const Homepage = lazy(() => import('./Homepage/Homepage'));
const Error404 = lazy(() => import('../utils/Error404'));
const SignIn = lazy(() => import('./Auth/SignIn'));
const ResetPassword = lazy(() => import('./Auth/ResetPassword'));

const MemoRouter = () =>
  useMemo(
    () => (
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/home" component={Homepage} />
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/about" component={About} />
            <Route exact path="/resetPassword" component={ResetPassword} />
            <Route exact path="/signin/demo" component={DemoUserSignIn} />
            <Route component={Error404} />
          </Switch>
        </Suspense>
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

export default hot(module)(App);
