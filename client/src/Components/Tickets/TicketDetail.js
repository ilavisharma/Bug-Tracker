import React, { useState, useEffect, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import LoadingSpinner from '../../utils/LoadingSpinner';
import api from '../../utils/api';
import AuthContext from '../../Context/AuthContext';

const TicketDetail = ({
  match: {
    params: { id }
  }
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [ticket, setTicket] = useState(null);

  const { user } = useContext(AuthContext);

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
  }, [id]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <Col xs={11}>
      <h4 className="display-4">{ticket.name}</h4>
      <p className="lead">
        Created on {new Date(ticket.dateadded).toDateString()} by <b>Love</b>
      </p>
      <hr />
      <p className="lead">{ticket.description}</p>
      {user.id === ticket.user_id && (
        <>
          <Button
            variant="danger"
            // onClick={() => handleDeleteClick(project.name)}
          >
            Delete
          </Button>
          <Button
            variant="info"
            // onClick={() => {
            //   setshowModal(true);
            // }}
            className="mx-1"
          >
            Edit this ticket
          </Button>
        </>
      )}
    </Col>
  );
};

export default TicketDetail;
