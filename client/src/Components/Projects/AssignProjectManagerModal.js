import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import usePut from '../../hooks/usePut';
import useGet from '../../hooks/useGet';
import { SuccessAlert, ErrorAlert } from '../../alerts';

const AssignProjectManagerModal = ({
  showModal,
  closeModal,
  refetch,
  manager,
  project: { id, name }
}) => {
  const [selected, setSelected] = useState(manager || null);

  const { response: managersResponse, isLoading: loadingManagers } = useGet(
    '/auth/allManagers'
  );

  const { error, isLoading, put } = usePut('/projects/assignManager');
  const handleAssign = () => {
    put({
      project_id: id,
      manager_id: selected,
      project_name: name
    }).then(res => {
      if (res.status === 200) {
        SuccessAlert('Project assigned');
      } else {
        ErrorAlert();
      }
      refetch();
      closeModal();
      if (error) {
        console.log(error);
        ErrorAlert();
      }
    });
  };

  if (loadingManagers) return null;
  else {
    const { data: managers } = managersResponse;
    return (
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Assign this project to</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {managers.map(({ id, name }) => (
              <ListGroup.Item
                key={id}
                action={true}
                onClick={() => setSelected(id)}
                active={id === selected}
              >
                {name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={closeModal}>
            Close
          </Button>
          {isLoading ? (
            <Button variant="warning" disabled>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Assigning...
            </Button>
          ) : (
            <Button
              disabled={selected === manager || selected === null}
              onClick={handleAssign}
              variant="warning"
            >
              Save Changes
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
};

export default AssignProjectManagerModal;
