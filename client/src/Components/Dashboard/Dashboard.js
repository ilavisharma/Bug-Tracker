import React, { lazy, Suspense } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoadingSpinner from '../../utils/LoadingSpinner';
import Head from './Head';
import useAuthContext from '../../hooks/useAuthContext';

const TicketsByPriority = lazy(() => import('./TicketsByPriority'));
const TicketsByType = lazy(() => import('./TicketsByType'));
const TicketByMonth = lazy(() => import('./TicketByMonth'));
const TicketByStatus = lazy(() => import('./TicketByStatus'));
const RecentTickets = lazy(() => import('./RecentTickets'));

const Dashboard = () => {
  const { user } = useAuthContext();

  if (user === null) return <LoadingSpinner />;

  if (user.role === 'admin') {
    return (
      <Container>
        <Head />
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
  }
  if (user.role === 'manager') {
    return (
      <Container>
        <Head />
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
              <RecentTickets />
            </Col>
          </Row>
        </Suspense>
      </Container>
    );
  }
  if (user.role === 'developer') {
    return (
      <Container>
        <Head />
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
              <RecentTickets />
            </Col>
          </Row>
        </Suspense>
      </Container>
    );
  }
};

export default Dashboard;
