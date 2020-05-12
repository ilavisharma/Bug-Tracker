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
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>Bug Tracker</Navbar.Brand>
      </Navbar>
    );

  return (
    <Navbar bg="dark" variant="dark">
      <LinkContainer to="/">
        <Navbar.Brand>Bug Tracker</Navbar.Brand>
      </LinkContainer>
      <Navbar.Text>
        Signed in as: <Link to="/home/account">{user.name}</Link>
      </Navbar.Text>
      <Navbar.Collapse className="justify-content-end">
        <Button
          variant="warning"
          onClick={() => {
            signOut();
            push('/');
          }}
          style={{ display: 'flex' }}
        >
          Sign Out <i className="ml-2 mt-1 mr-1 gg-log-out"></i>
        </Button>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
