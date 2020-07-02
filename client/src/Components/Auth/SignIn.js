import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import api from '../../utils/api';
import useAuthContext from '../../hooks/useAuthContext';
import './style.scss';
import ForgotPasswordModal from './ForgotPasswordModal';
import Schema from '../../schema/signIn';
import { ErrorAlert } from '../../alerts';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const { push } = useHistory();
  const { signIn, user } = useAuthContext();
  const { search } = useLocation();

  const queryParams = new URLSearchParams(search);

  useEffect(() => {
    if (user !== null) push('/home');
  }, [push, user]);

  const onFormSubmit = async e => {
    e.preventDefault();
    const { value, error } = Schema.validate({ email, password });
    if (error) {
      return ErrorAlert(error.details[0].message);
    }
    setIsLoading(true);
    try {
      const res = await api.post('/auth/signin', value);
      setIsLoading(false);
      if (res.status === 200) {
        // correct
        const { user, token } = res.data;
        signIn(user, token);
        // redirect
        const redirect = queryParams.get('redirect');
        if (redirect) push(redirect);
        else push('/home');
      }
      // TODO: check other status codes
      if (res.status === 204) ErrorAlert('User not found');
    } catch (err) {
      if (err.response.status === 401) ErrorAlert('Incorrect Password');
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Helmet>
        <title>Sign In to your account</title>
      </Helmet>
      <Col className="form-signup" xs={6}>
        <h3 className="display-3">Sign In</h3>
        <Form onSubmit={onFormSubmit}>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              required
            />
          </Form.Group>
          {isLoading ? (
            <Button variant="primary" disabled>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="mx-1"
              />
              Hang On!
            </Button>
          ) : (
            <Button disabled={showForgotModal} variant="primary" type="submit">
              Continue
            </Button>
          )}
          <hr />
          <Link className="btn btn-outline-success" to="/signin/demo">
            Login as Demo user
          </Link>
          <Button
            onClick={() => setShowForgotModal(true)}
            className="float-right"
            variant="warning"
          >
            Forgot Password
          </Button>
          <ForgotPasswordModal
            show={showForgotModal}
            handleClose={() => setShowForgotModal(false)}
          />
        </Form>
      </Col>
      <Col className="mt-4" xs={9}>
        <details>
          <summary style={{ fontSize: '1.5em' }}>FAQs (might help you)</summary>
          <div className="mx-5 mt-3">
            <details open="true">
              <summary>Why is there no SignUp/Register ?</summary>
              <div className="my-2">
                It is becuase usually in these kind of apps users are
                added/invited explicity by the organization/admins that is why
                there is no signup here
              </div>
            </details>
          </div>
          <div className="mx-5 mt-3">
            <details open="true">
              <summary>Then how do i login?</summary>
              <div className="my-2">
                You can use these admin credentials to sign in as an admin
                <div className="row">
                  <div className="col-6">
                    <mark>email:</mark> bugtracker@mailinator.com <br />
                    <mark>password:</mark> bugtracker
                  </div>
                  <div className="col-6">
                    <Button
                      onClick={() => {
                        setEmail('bugtracker@mailinator.com');
                        setPassword('bugtracker');
                      }}
                      size="sm"
                    >
                      Fill these above
                    </Button>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </details>
      </Col>
    </Container>
  );
};

export default SignIn;
