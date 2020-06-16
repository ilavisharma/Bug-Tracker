import React from 'react';
import Container from 'react-bootstrap/Container';
import AllTickets from './AllTickets';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const Tickets = () => {
  useDocumentTitle('Tickets');

  return (
    <Container>
      <h3 className="display-3">These are tickets</h3>
      <AllTickets />
    </Container>
  );
};

export default Tickets;
