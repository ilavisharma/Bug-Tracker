import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import LoadingSpinner from '../../utils/LoadingSpinner';
import AuthContext from '../../Context/AuthContext';
import ScreenshotModal from './ScreenshotModal';

const TicketDetail = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [ticket, setTicket] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showScreenshot, setShowScreenshot] = useState(false);

  const { user, api } = useContext(AuthContext);
  const { push } = useHistory();
  const { id } = useParams();

  useEffect(() => {
    (async function() {
      try {
        const res = await api.get(`/tickets/${id}`);
        setTicket(res.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        alert(err);
      }
    })();
  }, [id, api]);

  const onDeleteClick = async () => {
    const confirm = window.confirm(`Delete the ticket: ${ticket.name} ?`);
    if (confirm) {
      try {
        setIsDeleting(true);
        const res = await api.delete(`/tickets/${id}`);
        setIsDeleting(false);
        if (res.status === 200) {
          alert('Ticket Deleted');
          push('/home/tickets');
        } else {
          alert('Unable to delete the ticket');
        }
      } catch (err) {
        alert(err);
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Col xs={11}>
      <h4 className="display-4">{ticket.name}</h4>
      <p className="lead">
        Created on {new Date(ticket.dateadded).toDateString()} by{' '}
        <b>{ticket.creator}</b>
      </p>
      <hr />
      <p className="lead">{ticket.description}</p>
      <Button
        className="mr-1"
        variant="secondary"
        onClick={() => setShowScreenshot(true)}
      >
        View Screenshot
      </Button>
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
            <Button variant="danger" onClick={onDeleteClick}>
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
};

export default TicketDetail;
