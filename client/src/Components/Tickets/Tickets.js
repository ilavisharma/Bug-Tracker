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
      <AllTickets />
    </Container>
  );
};

export default Tickets;
