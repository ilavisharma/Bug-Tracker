import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import usePut from '../../hooks/usePut';
import { SuccessAlert, ErrorAlert } from '../../alerts';

const EditProfileModal = ({ show, handleClose, user }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const { put, isLoading } = usePut('/auth/updateProfile');

  const handleSubmit = () => {
    put({ name, email })
      .then(res => {
        if (res.status === 200) {
          SuccessAlert('Profile Updated');
          window.location.reload();
        } else {
          ErrorAlert(res.statusText);
        }
      })
      .catch(err => {
        console.log(err);
        ErrorAlert(err.response.statusText);
      });
  };

  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Update your profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={e => setName(e.target.value)}
              type="text"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={handleCancel}>
          Cancel
        </Button>

        {isLoading ? (
          <Button disabled>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Changing...
          </Button>
        ) : (
          <Button onClick={handleSubmit}>Update</Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileModal;
