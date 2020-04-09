import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import api from '../../utils/api';
import Spinner from 'react-bootstrap/Spinner';

const EditRoleModal = ({ show, handleClose, user, updateRoleInUI }) => {
  const [role, setRole] = useState(user.role === null ? '' : user.role);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleUpdate = async role => {
    try {
      setIsLoading(true);
      const res = await api.put('/auth/updateRole', {
        id: user.id,
        role
      });
      setIsLoading(false);
      if (res.status === 200) {
        alert('User role updated');
        updateRoleInUI(role);
        handleClose();
      }
    } catch (err) {
      setIsLoading(false);
      alert(err);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit User Role</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="exampleForm.SelectCustom">
          <Form.Label>Select the new user role of {user.name}</Form.Label>
          <Form.Control
            as="select"
            custom="true"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="">Not Assigned</option>
            <option value="developer">Developer</option>
            <option value="manager">Project Manager</option>
            <option value="submitter">Submitter</option>
            <option value="admin">Admin</option>
          </Form.Control>
        </Form.Group>
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
