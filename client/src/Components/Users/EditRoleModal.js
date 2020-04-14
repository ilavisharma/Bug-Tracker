import React, { useState, useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import AuthContext from '../../Context/AuthContext';
import ListGroup from 'react-bootstrap/ListGroup';

const EditRoleModal = ({ show, handleClose, user, updateRoleInUI }) => {
  const [role, setRole] = useState(user.role === null ? '' : user.role);
  const [isLoading, setIsLoading] = useState(false);

  const { api } = useContext(AuthContext);

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
        <ListGroup>
          <ListGroup.Item
            active={role === ''}
            action={true}
            onClick={() => setRole('')}
          >
            None
          </ListGroup.Item>
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
            Project Managetr
          </ListGroup.Item>
          <ListGroup.Item
            active={role === 'submitter'}
            action={true}
            onClick={() => setRole('submitter')}
          >
            Submitter
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
