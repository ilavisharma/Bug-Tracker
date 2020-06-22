import React, { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoadingSpinner from '../../utils/LoadingSpinner';

const TicketsByPriority = lazy(() => import('./TicketsByPriority'));
const TicketsByType = lazy(() => import('./TicketsByType'));
const TicketByMonth = lazy(() => import('./TicketByMonth'));
const TicketByStatus = lazy(() => import('./TicketByStatus'));
const RecentTickets = lazy(() => import('./RecentTickets'));

const Dashboard = () => {
  return (
    <Container>
      <Helmet>
        <title>Dashboard</title>
        <meta name="title" content="Dashboard" />
        <meta name="description" content="Bug Tracker App dashboard" />
      </Helmet>
      <Suspense fallback={<LoadingSpinner />}>
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
            <TicketByStatus />
          </Col>
          <Col xs={6}>
            <TicketByMonth />
          </Col>
        </Row>
      </Suspense>
    </Container>
  );
};

export default Dashboard;
