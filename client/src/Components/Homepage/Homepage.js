import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Sidebar from '../Sidebar/Sidebar';
import NavigationBar from '../NavigationBar/NavigationBar';
import Dashboard from '../Dashboard/Dashboard';
import Projects from '../Projects/Projects';
import Tickets from '../Tickets/Tickets';
import Users from '../Users/Users';
import Account from '../Auth/Account';
import NewProjects from '../Projects/NewProjects';
import Error404 from '../../utils/Error404';

const Homepage = ({ match }) => {
  return (
    <>
      <NavigationBar />
      <Container fluid={true} className="mt-3">
        <Row>
          <Col xs={2}>
            <Sidebar />
          </Col>
          <Col xs={10}>
            <Switch>
              <Route exact path={match.url} component={Dashboard} />
              <Route
                exact
                path={`${match.url}/projects/new`}
                component={NewProjects}
              />
              <Route
                exact
                path={`${match.url}/projects`}
                component={Projects}
              />
              <Route path={`${match.url}/tickets`} component={Tickets} />
              <Route path={`${match.url}/users`} component={Users} />
              <Route path={`${match.url}/account`} component={Account} />
              <Route component={Error404} />
            </Switch>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Homepage;
