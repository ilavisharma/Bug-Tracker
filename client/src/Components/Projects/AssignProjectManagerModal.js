import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import usePut from '../../hooks/usePut';
import useGet from '../../hooks/useGet';

const AssignProjectManagerModal = ({
  showModal,
  closeModal,
  refetch,
  project: { id }
}) => {
  const [selected, setSelected] = useState(null);

  const { response: managersResponse, isLoading: loadingManagers } = useGet(
    '/auth/allManagers'
  );

  const { error, isLoading, put } = usePut('/projects/assignManager');
  const handleAssign = () => {
    put({
      project_id: id,
      manager_id: selected
    }).then(res => {
      if (res) {
        if (res.status === 200) {
          alert('Project assigned');
        } else {
          alert('Request failed');
        }
        refetch();
        closeModal();
        if (error) {
          console.log(error);
          alert('error');
        }
      }
    });
  };

  if (loadingManagers) return null;
  else {
    const { data: managers } = managersResponse;
    return (
      <Modal
        size="lg"
        show={showModal}
        onHide={closeModal}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Asign this project to
          </Modal.Title>
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
              disabled={selected === null}
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
