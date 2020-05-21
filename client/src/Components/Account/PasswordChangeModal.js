import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import usePut from '../../hooks/usePut';
import { SuccessAlert, ErrorAlert } from '../../alerts';

const PasswordChangeModal = ({ show, handleClose }) => {
  const [prevPassword, setPrevPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { isLoading, put } = usePut(`/auth/updatePassword`);

  const close = () => {
    setConfirmPassword('');
    setNewPassword('');
    setPrevPassword('');
    handleClose();
  };

  const handleSubmit = () => {
    put({ prevPassword, newPassword })
      .then(({ data }) => {
        if (data.success) {
          close();
          SuccessAlert(data.message);
        } else {
          ErrorAlert(data.message);
        }
      })
      .catch(e => {
        console.log(e);
        ErrorAlert(e);
      });
  };

  return (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Old Password</Form.Label>
            <Form.Control
              value={prevPassword}
              onChange={e => setPrevPassword(e.target.value)}
              type="password"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Enter the new Password</Form.Label>
            <Form.Control
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              type="password"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              type="password"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={close} variant="dark">
          Cancel
        </Button>

        {isLoading ? (
          <Button variant="secondary" disabled>
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
          <Button
            variant="secondary"
            disabled={newPassword !== confirmPassword || newPassword === ''}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default PasswordChangeModal;
