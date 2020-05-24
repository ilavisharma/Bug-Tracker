import React, { createRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../Auth/style.scss';

const ForgotPasswordModal = ({ show, handleClose }) => {
  const inputRef = createRef();

  const handleSubmit = e => {
    e.preventDefault();
    console.log({ email: inputRef.current.value });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Forgot Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Enter your e-mail:</Form.Label>
            <Form.Control ref={inputRef} type="email" />
          </Form.Group>
        </Form>
        <Button variant="light" onClick={handleClose}>
          Cancel
        </Button>
        <Button className="float-right" type="submit" variant="secondary">
          Continue
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default ForgotPasswordModal;
