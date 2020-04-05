import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import AuthContext from '../../Context/AuthContext';

const NavigationBar = () => {
  const { user, signOut } = useContext(AuthContext);
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
        Signed in as: <Link to="/account">{user.name}</Link>
      </Navbar.Text>
      <Navbar.Collapse className="justify-content-end">
        <Button
          variant="warning"
          onClick={() => {
            signOut();
            push('/');
          }}
        >
          Sign Out
        </Button>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
