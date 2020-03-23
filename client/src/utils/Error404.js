import React from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';

const Error404 = () => {
  return (
    <Jumbotron fluid>
      <Container>
        <h1>404 - Not Found</h1>
        <h2 className="display-2">This page does not exist</h2>
        <p>
          <Link to="/" className="btn btn-success">
            Home
          </Link>
          <Link to="/home" className="btn btn-info">
            Dashboard
          </Link>
        </p>
      </Container>
    </Jumbotron>
  );
};

export default Error404;
