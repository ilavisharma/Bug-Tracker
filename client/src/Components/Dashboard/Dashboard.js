import React from 'react';
import { Helmet } from 'react-helmet';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TicketsByPriority from './TicketsByPriority';
import TicketsByType from './TicketsByType';
import TicketByMonth from './TicketByMonth';
import RecentTickets from './RecentTickets';

const Dashboard = () => {
  return (
    <Container>
      <Helmet>
        <title>Dashboard</title>
        <meta name="title" content="Dashboard" />
        <meta name="description" content="Bug Tracker App dashboard" />
      </Helmet>
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
        <Col xs={6}>
          <RecentTickets />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
