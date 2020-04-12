import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import LoadingSpinner from '../../utils/LoadingSpinner';
import AuthContext from '../../Context/AuthContext';

const TicketDetail = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [ticket, setTicket] = useState(null);

  const { user, api } = useContext(AuthContext);
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

  if (isLoading) return <LoadingSpinner />;

  return (
    <Col xs={11}>
      <h4 className="display-4">{ticket.name}</h4>
      <p className="lead">
        Created on {new Date(ticket.dateadded).toDateString()} by <b>Love</b>
      </p>
      <hr />
      <p className="lead">{ticket.description}</p>
      {(user.id === ticket.user_id || user.role === 'admin') && (
        <>
          <Button variant="danger">Delete</Button>
          <Button variant="info" className="mx-1">
            Edit this ticket
          </Button>
        </>
      )}
    </Col>
  );
};

export default TicketDetail;
