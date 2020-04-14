import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import AuthContext from '../../Context/AuthContext';
import LoadingSpinner from '../../utils/LoadingSpinner';
import Spinner from 'react-bootstrap/Spinner';

const AssignProjectManagerModal = ({
  showModal,
  closeModal,
  setProject,
  project
}) => {
  const [managers, setManagers] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { api } = useContext(AuthContext);
  useEffect(() => {
    (async function() {
      try {
        const res = await api.get('/auth/allManagers');
        setManagers(res.data);
      } catch (err) {
        console.log(err);
        alert('error');
      }
    })();
  }, [api]);

  const managerName = id => {
    let name = '';
    managers.forEach(m => {
      if (m.id === id) name = m.name;
    });
    return name;
  };

  const handleAssign = async () => {
    setIsLoading(true);
    try {
      const res = await api.put('/projects/assignManager', {
        project_id: project.id,
        manager_id: selected
      });
      if (res.status === 200) {
        alert('Project assigned');
      } else {
        alert('Request failed');
      }
      setIsLoading(false);
      setProject({
        ...project,
        manager: managerName(selected),
        manager_id: selected
      });
      closeModal();
    } catch (err) {
      setIsLoading(false);
      console.log(err);
      alert('error');
    }
  };

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
        {managers === null ? (
          <LoadingSpinner />
        ) : (
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
        )}
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
};

export default AssignProjectManagerModal;
