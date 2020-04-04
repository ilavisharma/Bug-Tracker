import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import LoadingSpinner from '../../utils/LoadingSpinner';
import api from '../../utils/api';

const TicketDetail = ({
  match: {
    params: { id }
  }
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    (async function() {
      try {
        const res = await api.get(`/tickets/${id}`);
        console.log(res.data);
        setTicket(res.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        alert(err);
      }
    })();
  }, [id]);

  if (isLoading) return <LoadingSpinner />;

  return <Col xs={11}>loaded</Col>;
};

export default TicketDetail;
