import React from 'react';
import { useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import AllTickets from './AllTickets';

const Tickets = () => {
  const { push } = useHistory();

  return (
    <Container>
      <h3 className="display-3">These are tickets</h3>
      <Button
        onClick={() => push('/home/tickets/new')}
        variant="success"
        style={{ display: 'flex' }}
      >
        New Ticket
        <i className="ml-2 gg-add-r" />
      </Button>
      <div style={{ marginBottom: '20px' }} />
      <AllTickets />
    </Container>
  );
};

export default Tickets;
