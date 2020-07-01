import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import useAuthContext from '../hooks/useAuthContext';

const About = () => {
  const { user } = useAuthContext();

  return (
    <>
      <Helmet>
        <title>About</title>
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
        <Row className="list-unstyled about-images">
          <Col xs={6}>
            <h4 className="text-center text-uppercase mb-2">
              <u>Frontend</u>
            </h4>
            <li>
              <img
                className="img-fluid"
                src="https://res.cloudinary.com/bt-cloud/image/upload/v1593525975/about/react-logo.svg"
                alt="react logo"
              />
              <a
                href="https://reactjs.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                React
              </a>
            </li>
            <li>
              <img
                className="img-fluid"
                src="https://res.cloudinary.com/bt-cloud/image/upload/v1593525934/about/r-b_pywrbd.svg"
                alt="react logo"
              />
              <a
                href="https://react-bootstrap.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                React Bootstrap
              </a>
            </li>
          </Col>
          <Col xs={6}>
            <h4 className="text-center text-uppercase mb-2">
              <u>Backend</u>
            </h4>
            <li>
              <img
                className="img-fluid"
                src="https://res.cloudinary.com/bt-cloud/image/upload/v1593526086/about/express_t67obx.jpg"
                alt="react logo"
              />
              <a
                href="https://expressjs.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                ExpressJS
              </a>
            </li>
            <li>
              <img
                className="img-fluid"
                src="https://res.cloudinary.com/bt-cloud/image/upload/v1593526119/about/sg_eavjut.png"
                alt="react logo"
              />
              <a
                href="https://sendgrid.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                SendGrid
              </a>
            </li>
            <li>
              <img
                className="img-fluid"
                src="https://res.cloudinary.com/bt-cloud/image/upload/v1593526147/about/pg_intqg2.png"
                alt="react logo"
              />
              <a
                href="https://postgresql.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                PostgreSQL
              </a>
            </li>
            <li>
              <img
                className="img-fluid"
                src="https://res.cloudinary.com/bt-cloud/image/upload/v1593526181/about/cloudinary_yyhhqp.png"
                alt="react logo"
              />
              <a
                href="https://cloudinary.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cloudinary
              </a>
            </li>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default About;
