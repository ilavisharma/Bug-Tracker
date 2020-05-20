import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const PasswordChangeModal = ({ show, handleClose }) => {
  const [prevPassword, setPrevPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const close = () => {
    setConfirmPassword('');
    setNewPassword('');
    setPrevPassword('');
    handleClose();
  };

  return (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Enter Password</Form.Label>
            <Form.Control
              value={prevPassword}
              onChange={e => setPrevPassword(e.target.value)}
              type="text"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Enter the new Password</Form.Label>
            <Form.Control
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              type="text"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              type="text"
            />
          </Form.Group>
          <Button onClick={close} variant="dark">
            Cancel
          </Button>
          <Button
            variant="secondary"
            className="float-right"
            disabled={newPassword !== confirmPassword || newPassword === ''}
          >
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PasswordChangeModal;
