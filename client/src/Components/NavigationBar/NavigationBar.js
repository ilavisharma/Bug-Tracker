import React, { useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import AuthContext from '../../Context/AuthContext';
import api from '../../utils/api';

const NavigationBar = () => {
  const { token, user, signOut, signIn } = useContext(AuthContext);
  const { push } = useHistory();

  useEffect(() => {
    // check token
    if (!token) {
      const localToken = localStorage.getItem('token');
      if (localToken) {
        // SIGN IN AUTOMATICALLY
        // fetch the user & refresh the token
        api
          .post('/auth/currentUser', { token: localToken })
          .then(res => {
            const { user, token } = res.data;
            localStorage.setItem('token', token);
            signIn(user, token);
          })
          .catch(err => console.log(err));
      } else {
        alert('You need to sign in');
        push('/signin');
      }
    }
  }, [push, signIn, token]);

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
