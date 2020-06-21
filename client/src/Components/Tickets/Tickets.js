import React from 'react';
import { Helmet } from 'react-helmet';
import Container from 'react-bootstrap/Container';
import AllTickets from './AllTickets';

const Tickets = () => {
  return (
    <Container>
      <Helmet>
        <title>Tickets</title>
      </Helmet>
      <h3 className="display-3">These are tickets</h3>
      <AllTickets />
    </Container>
  );
};

export default Tickets;
