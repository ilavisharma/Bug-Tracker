import React, { useEffect, useContext } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Sidebar from '../Sidebar/Sidebar';
import NavigationBar from '../NavigationBar/NavigationBar';
import Dashboard from '../Dashboard/Dashboard';
import Projects from '../Projects/Projects';
import Tickets from '../Tickets/Tickets';
import Users from '../Users/Users';
import Account from '../Account/Account';
import NewProjects from '../Projects/NewProjects';
import Error404 from '../../utils/Error404';
import ProjectDetail from '../Projects/ProjectDetail';
import NewTicket from '../Tickets/NewTicket';
import TicketDetail from '../Tickets/TicketDetail';
import AuthContext from '../../Context/AuthContext';
import CreateUser from '../Users/CreateUser';
import UserDetail from '../Users/UserDetail';
import LoadingSpinner from '../../utils/LoadingSpinner';

const Homepage = ({ match }) => {
  const { push } = useHistory();
  const { signIn, api, user } = useContext(AuthContext);

  useEffect(() => {
    const localToken = localStorage.getItem('token');
    if (localToken) {
      api
        .get('/auth/currentUser', {
          headers: {
            authorization: localStorage.getItem('token')
          }
        })
        .then(res => {
          if (res.status === 200) {
            signIn(res.data, localStorage.getItem('token'));
          } else {
            push('/signin');
            alert('You need to sign in');
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      alert('You need to sign in');
      push('/signin');
    }
    // eslint-disable-next-line
  }, []);

  if (user === null)
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );

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
              <Route
                exact
                path={`${match.url}/projects/:id`}
                component={ProjectDetail}
              />
              <Route
                exact
                path={`${match.url}/tickets/new`}
                component={NewTicket}
              />
              <Route exact path={`${match.url}/tickets`} component={Tickets} />
              <Route
                exact
                path={`${match.url}/tickets/:id`}
                component={TicketDetail}
              />
              <Route
                exact
                path={`${match.url}/users/new`}
                component={CreateUser}
              />
              <Route exact path={`${match.url}/users`} component={Users} />
              <Route
                exact
                path={`${match.url}/users/:id`}
                component={UserDetail}
              />
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
