import React, { useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import LoadingSpinner from '../../utils/LoadingSpinner';
import AuthContext from '../../Context/AuthContext';
import ScreenshotModal from './ScreenshotModal';
import useGet from '../../hooks/useGet';
import useDelete from '../../hooks/useDelete';

const TicketDetail = () => {
  const [showScreenshot, setShowScreenshot] = useState(false);

  const { user } = useContext(AuthContext);
  const { push } = useHistory();
  const { id } = useParams();

  const { isLoading, response, error } = useGet(`/tickets/${id}`);
  const { delete: deleteTicket, isLoading: isDeleting } = useDelete(
    `/tickets/${id}`
  );

  const onDeleteClick = async name => {
    const confirm = window.confirm(`Delete the ticket: ${name} ?`);
    if (confirm) {
      deleteTicket().then(res => {
        if (res.status === 200) {
          alert('Ticket Deleted');
          push('/home/tickets');
        } else {
          alert('Unable to delete the ticket');
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
        <ScreenshotModal
          show={showScreenshot}
          url={ticket.imageurl}
          handleClose={() => setShowScreenshot(false)}
        />
      </Col>
    );
  }
};

export default TicketDetail;
