import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

const LandingPage = () => {
  return (
    <>
      <Navbar bg="dark" variant="dark" fixed="top">
        <Navbar.Text>Welcome</Navbar.Text>
      </Navbar>
      <Container>
        <h1>This will be the landing page</h1>
        <Link to="/home" className="btn btn-success">
          Proceed to Dashboard
        </Link>
        <Link to="/signin" className="btn btn-primary mx-3">
          Sign In
        </Link>
      </Container>
    </>
  );
};

export default LandingPage;
