import React, { createRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import '../Auth/style.scss';
import usePost from '../../hooks/usePost';
import { ErrorAlert, SuccessAlert } from '../../alerts';

const ForgotPasswordModal = ({ show, handleClose }) => {
  const inputRef = createRef();

  const { isLoading, post } = usePost('/auth/forgotPassword');

  const handleSubmit = () => {
    post({ email: inputRef.current.value })
      .then(({ data }) => {
        if (data.status) {
          SuccessAlert('The reset instructions have been sent to your email');
          handleClose();
        } else {
          ErrorAlert('Email not found');
        }
      })
      .catch(err => {
        ErrorAlert(err);
        console.log(err);
      });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Forgot Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Enter your e-mail:</Form.Label>
            <Form.Control ref={inputRef} type="email" />
          </Form.Group>
        </Form>

        <Button variant="light" onClick={handleClose}>
          Cancel
        </Button>
        {isLoading ? (
          <Button variant="secondary" className="float-right" disabled>
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
            onClick={handleSubmit}
            className="float-right"
            type="submit"
            variant="secondary"
          >
            Continue
          </Button>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ForgotPasswordModal;
