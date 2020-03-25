import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const EditProjectModal = ({ show, handleClose, project, handleEdit }) => {
  const [projectName, setProjectName] = useState(project.name);
  const [projectDescription, setProjectDescription] = useState(
    project.description
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = () => {
    setIsLoading(true);
    handleClose();
  };

  return (
    <Modal
      centered
      size="lg"
      show={show}
      onHide={handleUpdate}
      animation={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Project Name</Form.Label>
          <Form.Control
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            type="text"
            placeholder="My Awesome Project"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Project Description</Form.Label>
          <Form.Control
            value={projectDescription}
            onChange={e => setProjectDescription(e.target.value)}
            as="textarea"
            placeholder="This project is about..."
            rows="3"
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        {isLoading ? (
          <Button variant="info" disabled>
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
            onClick={() => handleEdit(projectName, projectDescription)}
          >
            Save Changes
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default EditProjectModal;
