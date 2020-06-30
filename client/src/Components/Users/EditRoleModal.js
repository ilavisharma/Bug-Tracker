import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import { SuccessAlert, ErrorAlert } from '../../alerts';
import api from '../../utils/api';

const EditRoleModal = ({ show, handleClose, user, updateRoleInUI }) => {
  const [role, setRole] = useState(user.role === null ? '' : user.role);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleUpdate = async role => {
    try {
      setIsLoading(true);
      const res = await api.put('/auth/updateRole', {
        id: user.id,
        role,
      });
      setIsLoading(false);
      if (res.status === 200) {
        SuccessAlert('User role updated');
        updateRoleInUI(role);
        handleClose();
      } else {
        ErrorAlert('Failed to update user role');
        console.log(res);
      }
    } catch (err) {
      setIsLoading(false);
      ErrorAlert(err);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit User Role</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          <ListGroup.Item
            active={role === 'developer'}
            action={true}
            onClick={() => setRole('developer')}
          >
            Developer
          </ListGroup.Item>
          <ListGroup.Item
            active={role === 'manager'}
            action={true}
            onClick={() => setRole('manager')}
          >
            Project Manager
          </ListGroup.Item>
          <ListGroup.Item
            active={role === 'admin'}
            action={true}
            onClick={() => setRole('admin')}
          >
            Admin
          </ListGroup.Item>
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        {isLoading ? (
          <Button variant="success" disabled>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Updating...
          </Button>
        ) : (
          <Button
            variant="success"
            type="submit"
            onClick={() => handleRoleUpdate(role)}
          >
            Update
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default EditRoleModal;
