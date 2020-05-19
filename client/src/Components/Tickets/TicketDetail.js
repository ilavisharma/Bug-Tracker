import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import LoadingSpinner from '../../utils/LoadingSpinner';
import ScreenshotModal from './ScreenshotModal';
import useGet from '../../hooks/useGet';
import useDelete from '../../hooks/useDelete';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import TicketTimelineModal from './TicketTimelineModal';
import useAuthContext from '../../hooks/useAuthContext';
import { ConfirmAlert, SuccessAlert, ErrorAlert } from '../../alerts';

const TicketDetail = () => {
  const [showScreenshot, setShowScreenshot] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);

  const { user } = useAuthContext();
  const { push } = useHistory();
  const { id } = useParams();

  const { isLoading, response, error } = useGet(`/tickets/${id}`);
  const { delete: deleteTicket, isLoading: isDeleting } = useDelete(
    `/tickets/${id}`
  );

  useDocumentTitle(
    response && response.data.name
      ? response.data.name + ' | Bug Tracker'
      : 'Ticket'
  );

  const onDeleteClick = async name => {
    const result = await ConfirmAlert(`Delete the ticket: ${name} ?`, 'Yupp!');
    if (result.value) {
      deleteTicket().then(res => {
        if (res.status === 200) {
          SuccessAlert('Ticket Deleted');
          push('/home/tickets');
        } else {
          ErrorAlert('Unable to delete the ticket');
        }
      });
    }
  };

  if (isLoading) return <LoadingSpinner />;
  else if (error) return <h4 className="display-4">There was some error</h4>;
  else {
    const { data: ticket } = response;
    return (
      <Col xs={11}>
        <h4 className="display-4">{ticket.name}</h4>
        <p className="lead">
          Created on {new Date(ticket.dateadded).toDateString()} by{' '}
          <b>{ticket.creator}</b>
        </p>
        <hr />
        <p className="lead">{ticket.description}</p>
        <Row>
          <Col xs={6}>
            {ticket.imageurl !== null && (
              <Button
                className="mr-1"
                variant="secondary"
                onClick={() => setShowScreenshot(true)}
              >
                View Screenshot
              </Button>
            )}

            {(user.id === ticket.user_id || user.role === 'admin') && (
              <>
                {isDeleting ? (
                  <Button variant="danger" disabled>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Deleting...
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    onClick={() => onDeleteClick(ticket.name)}
                  >
                    Delete
                  </Button>
                )}

                <Button variant="info" className="mx-1">
                  Edit this ticket
                </Button>
              </>
            )}
          </Col>
          <Col xs={6}>
            <Button
              variant="success"
              onClick={() => setShowTimelineModal(true)}
            >
              View Ticket Timeline
            </Button>
          </Col>
        </Row>
        <ScreenshotModal
          show={showScreenshot}
          url={ticket.imageurl}
          handleClose={() => setShowScreenshot(false)}
        />
        <TicketTimelineModal
          ticketId={id}
          show={showTimelineModal}
          closeModal={() => setShowTimelineModal(false)}
        />
      </Col>
    );
  }
};

export default TicketDetail;
