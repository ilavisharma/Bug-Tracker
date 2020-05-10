import React from 'react';
import Modal from 'react-bootstrap/Modal';
import useGet from '../../hooks/useGet';
import { Timeline, TimelineEvent } from 'react-event-timeline';

const ProjectTimelineModal = ({ projectId, show, closeModal }) => {
  const { error, response } = useGet(`/projects/${projectId}/timeline`);

  if (error) return alert(error);
  else if (response !== null) {
    const data = response.data.reverse();
    return (
      <Modal size="lg" show={show} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Project Timeline
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Timeline data={response.data.reverse()} /> */}
          <Timeline style={{ fontSize: '1.3em', fontWeight: '500' }}>
            {data.map(e => (
              <TimelineEvent
                key={e.id}
                title={e.event}
                createdAt={new Date(e.date).toDateString()}
              />
            ))}
          </Timeline>
        </Modal.Body>
      </Modal>
    );
  } else return null;
};

export default ProjectTimelineModal;
