import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TicketsByPriority from './TicketsByPriority';
import TicketsByType from './TicketsByType';
import TicketByMonth from './TicketByMonth';

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
      <Row>
        <Col xs={6}>
          <TicketByMonth />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
