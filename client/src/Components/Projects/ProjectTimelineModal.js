import React, { forwardRef, useImperativeHandle } from 'react';
import Modal from 'react-bootstrap/Modal';
import useGet from '../../hooks/useGet';
import { Timeline, TimelineEvent } from 'react-event-timeline';

const ProjectTimelineModal = forwardRef(
  ({ projectId, show, closeModal }, ref) => {
    const { error, response, refetch } = useGet(
      `/projects/${projectId}/timeline`
    );

    useImperativeHandle(ref, () => ({
      refetch
    }));

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
  }
);

export default ProjectTimelineModal;
