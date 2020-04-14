import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import AuthContext from '../../Context/AuthContext';
import LoadingSpinner from '../../utils/LoadingSpinner';

const AssignProjectManagerModal = ({ showModal, closeModal }) => {
  const [managers, setManagers] = useState(null);

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
  }, []);

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
              <ListGroup.Item key={id} action={true}>
                {name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={closeModal}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignProjectManagerModal;
