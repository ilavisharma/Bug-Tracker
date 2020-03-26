import React, { useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import AuthContext from '../../Context/AuthContext';

const NavigationBar = () => {
  const { token, user, signOut } = useContext(AuthContext);
  const { push } = useHistory();

  useEffect(() => {
    if (!token) {
      const localToken = localStorage.getItem(token);
      if (localToken) {
        // SIGN IN AUTOMATICALLY
      } else {
        alert('You need to sign in');
        push('/signin');
      }
    }
  }, [token, push]);

  if (user === null)
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>Bug Tracker</Navbar.Brand>
      </Navbar>
    );

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand>Bug Tracker</Navbar.Brand>
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
