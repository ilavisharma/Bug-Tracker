import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import useAuthContext from '../../hooks/useAuthContext';
import api from '../../utils/api';

const LandingPage = () => {
  const { user } = useAuthContext();

  useEffect(() => {
    (async function () {
      await api.get('/');
    })();
  }, []);

  return (
    <>
      <Helmet>
        <title>Welcome | Bug Tracker</title>
      </Helmet>
      <Navbar bg="dark" variant="dark" fixed="top">
        <Navbar.Text>Welcome</Navbar.Text>
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
        <div className="text-center">
          <h3 className="display-3 my-4">
            Ship great software with automated bugtracking.
          </h3>
          <h5 className="my-5">
            A simple, fast and scalable bug tracking software that helps you
            manage bugs easily and deliver great products on time.
          </h5>
          <Link
            to="/home"
            className="btn btn-secondary"
            style={{ display: 'inline-flex' }}
          >
            Continue
            <i className="gg-arrow-right-o mx-2" />
          </Link>
        </div>
      </Container>
    </>
  );
};

export default LandingPage;
