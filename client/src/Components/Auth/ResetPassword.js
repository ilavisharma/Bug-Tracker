import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Col from 'react-bootstrap/Col';
import usePost from '../../hooks/usePost';
import { ErrorAlert, SuccessAlert } from '../../alerts';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { search } = useLocation();
  const { push } = useHistory();

  const { isLoading, post } = usePost('/auth/resetPassword');

  const handleSubmit = e => {
    e.preventDefault();
    const queryParams = new URLSearchParams(search);
    post({
      password,
      token: queryParams.get('token').trim()
    })
      .then(res => {
        if (res.data.success) {
          SuccessAlert('Password Changed');
          push('/signin');
        } else {
          ErrorAlert(res.data.message);
        }
      })
      .catch(err => {
        console.log(err);
        ErrorAlert(err);
      });
  };

  return (
    <Container>
      <Col xs={6}>
        <h3>Reset Password</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Enter new password</Form.Label>
            <Form.Control
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              type="password"
            ></Form.Control>
          </Form.Group>
          {isLoading ? (
            <Button disabled>
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
            <Button
              disabled={password === '' || password !== confirmPassword}
              type="submit"
            >
              Change Password
            </Button>
          )}
        </Form>
      </Col>
    </Container>
  );
};

export default ResetPassword;
