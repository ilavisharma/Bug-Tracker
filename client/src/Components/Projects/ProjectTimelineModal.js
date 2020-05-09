import React from 'react';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import useGet from '../../hooks/useGet';

const ProjectTimelineModal = ({ projectId, show, closeModal }) => {
  const { error, response } = useGet(`/projects/${projectId}/timeline`);

  if (error) return alert(error);
  else if (response !== null)
    return (
      <Modal size="lg" show={show} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Project Timeline
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {response.data.reverse().map(e => (
              <ListGroup.Item key={e.id} action={true}>
                {e.event}{' '}
                <span className="float-right">
                  {new Date(e.date).toDateString()}
                </span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>
    );
  else return null;
};

export default ProjectTimelineModal;
