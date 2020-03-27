import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import api from '../../utils/api';
import AuthContext from '../../Context/AuthContext';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { push } = useHistory();
  const { signIn } = useContext(AuthContext);

  const onFormSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/signin', { email, password });
      setIsLoading(false);
      if (res.status === 200) {
        // correct
        const { user, token } = res.data;
        signIn(user, token);
        push('/home');
      }
      // TODO: check other status codes
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Container>
        <Col xs={6}>
          <h3 className="display-3">Sign In</h3>
          <Form onSubmit={onFormSubmit}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
              />
            </Form.Group>

            {isLoading ? (
              <>
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
                <hr />
                <Link
                  className="btn btn-outline-success disabled"
                  to="/signin/demo"
                >
                  Login as Demo user
                </Link>
              </>
            ) : (
              <>
                <Button variant="primary" type="submit">
                  Continue
                </Button>
                <hr />
                <Link className="btn btn-outline-success" to="/signin/demo">
                  Login as Demo user
                </Link>
              </>
            )}
          </Form>
        </Col>
      </Container>
    </>
  );
};

export default SignIn;
