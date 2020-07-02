import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import useAuthContext from '../../hooks/useAuthContext';
import api from '../../utils/api';
import { ErrorAlert } from '../../alerts';
import LoadingSpinner from '../../utils/LoadingSpinner';

const DemoUserSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { user, signIn } = useAuthContext();
  const { push } = useHistory();

  const signInUser = async (email, password) => {
    try {
      const res = await api.post('/auth/signin', { email, password });
      setIsLoading(false);
      if (res.status === 200) {
        const { user, token } = res.data;
        signIn(user, token);
        push('/home');
      }
      if (res.status === 204) ErrorAlert('Unable to sign in');
    } catch (err) {
      if (err.response.status === 401) ErrorAlert('Incorrect Password');
      setIsLoading(false);
    }
  };

  const signInWithRole = async role => {
    setIsLoading(true);
    if (role === 'developer') {
      signInUser('demo_dev@mailinator.com', 'DhLd5&@Kdxoy');
    } else if (role === 'manager') {
      signInUser('demo_pm@mailinator.com', 'Ep3Mg5u#@n<#');
    } else if (role === 'admin') {
      signInUser('bugtracker@mailinator.com', 'bugtracker');
    }
  };

  return (
    <>
      <Helmet>
        <title>Demo Users</title>
      </Helmet>
      <Navbar bg="dark" variant="dark" fixed="top">
        <Navbar.Text>
          <Link to="/">Bug Tracker</Link>
        </Navbar.Text>
        <Navbar.Collapse className="justify-content-end">
          <a
            href="https://github.com/ilavisharma/Bug-Tracker"
            className="btn btn-secondary btn-outline mx-4"
            style={{ display: 'inline-flex' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="gg-git-pull mr-3 ml-1 mt-2" />
            Github
          </a>
          <Link
            className="nav-link btn btn-light"
            to="/about"
            style={{ display: 'inline-flex' }}
          >
            <i className="gg-info mr-2 mt-1" />
            About
          </Link>
          {user !== null ? (
            <Link to="/home" className="btn btn-success mx-3">
              Dashboard
            </Link>
          ) : (
            <Link
              to="/signin"
              className="btn btn-primary mx-3"
              style={{ display: 'inline-flex' }}
            >
              <i className="gg-log-in mx-2 mt-1" />
              Sign In
            </Link>
          )}
        </Navbar.Collapse>
      </Navbar>
      <Container>
        <h4 className="display-4 mt-2 mb-4">Select the user account</h4>
        <div className="text-center my-2">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <Button
                variant="warning"
                className="mx-5 mt-5"
                style={{ display: 'inline-flex' }}
                onClick={() => signInWithRole('admin')}
              >
                <i className="gg-user mr-2" />
                Admin
              </Button>
              <Button
                variant="info"
                className="mx-5 mt-5"
                style={{ display: 'inline-flex' }}
                onClick={() => signInWithRole('manager')}
              >
                <i className="gg-user mr-2" />
                Project Manager
              </Button>
              <Button
                variant="dark"
                className="mx-5 mt-5"
                style={{ display: 'inline-flex' }}
                onClick={() => signInWithRole('developer')}
              >
                <i className="gg-user mr-2" />
                Developer
              </Button>
            </>
          )}
        </div>
      </Container>
    </>
  );
};

export default DemoUserSignIn;
