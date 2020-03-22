import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand>Bug Tracker</Navbar.Brand>
      <Navbar.Text>
        Signed in as: <Link to="/account">Felicity Smoak</Link>
      </Navbar.Text>
      <Navbar.Collapse className="justify-content-end">
        <Button variant="warning">Sign Out</Button>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
