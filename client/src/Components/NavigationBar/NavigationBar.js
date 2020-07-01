import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import useAuthContext from '../../hooks/useAuthContext';

const NavigationBar = () => {
  const { user, signOut } = useAuthContext();
  const { push } = useHistory();

  if (user === null)
    return (
      <Navbar bg="dark" variant="dark" fixed="top">
        <LinkContainer to="/">
          <Navbar.Brand>Bug Tracker</Navbar.Brand>
        </LinkContainer>
      </Navbar>
    );

  return (
    <Navbar bg="dark" variant="dark" fixed="top">
      <LinkContainer to="/">
        <Navbar.Brand>Bug Tracker</Navbar.Brand>
      </LinkContainer>
      <Navbar.Text>
        Signed in as: <Link to="/home/account">{user.name}</Link>
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
          className="nav-link btn btn-light mx-3"
          to="/about"
          style={{ display: 'inline-flex' }}
        >
          <i className="gg-info" style={{ margin: '4px 5px 0 0' }} />
          About
        </Link>
        <Button
          variant="secondary"
          onClick={() => {
            signOut();
            push('/');
          }}
          style={{ display: 'inline-flex' }}
        >
          <i className="gg-log-out" style={{ margin: '5px 15px 0 0' }} />
          Sign Out
        </Button>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
