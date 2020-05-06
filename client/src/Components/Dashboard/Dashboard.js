import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TicketsByPriority from './TicketsByPriority';
import TicketsByType from './TicketsByType';

const Dashboard = () => {
  return (
    <Container>
      <Row>
        <Col xs={6}>
          <TicketsByPriority />
        </Col>
        <Col xs={6}>
          <TicketsByType />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
