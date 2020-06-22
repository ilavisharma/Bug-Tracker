import React, { useEffect, useState, lazy, Suspense } from 'react';
import {
  Switch,
  Route,
  useHistory,
  useLocation,
  useRouteMatch,
} from 'react-router-dom';
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
import CreateUser from '../Users/CreateUser';
import UserDetail from '../Users/UserDetail';
import LoadingSpinner from '../../utils/LoadingSpinner';
import api from '../../utils/api';
import useAuthContext from '../../hooks/useAuthContext';
import { ErrorAlert } from '../../alerts';

const ProjectDevelopers = lazy(() => import('../Projects/ProjectDevelopers'));

const Homepage = () => {
  const { url } = useRouteMatch();
  const { pathname } = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { push } = useHistory();
  const { signIn } = useAuthContext();

  useEffect(() => {
    const localToken = localStorage.getItem('token');
    if (localToken) {
      api
        .get('/auth/currentUser')
        .then(res => {
          if (res.status === 200) {
            signIn(res.data.user, res.data.token);
            setIsLoading(false);
          } else {
            ErrorAlert('You need to sign in');
            setIsLoading(false);
            push(`/signin?redirect=${pathname}`);
          }
        })
        .catch(err => {
          ErrorAlert(err);
          console.log(err);
          setError(err);
          setIsLoading(false);
        });
    } else {
      ErrorAlert('You need to sign in');
      setIsLoading(false);
      push(`/signin?redirect=${pathname}`);
    }
    // eslint-disable-next-line
  }, []);

  if (isLoading)
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );

  if (error)
    return (
      <h4 className="display-4">
        Unable to connect to the server. Try refreshing the page
      </h4>
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
            <Suspense fallback={<LoadingSpinner />}>
              <Switch>
                <Route exact path={url} component={Dashboard} />
                <Route
                  exact
                  path={`${url}/projects/new`}
                  component={NewProjects}
                />
                <Route exact path={`${url}/projects`} component={Projects} />
                <Route
                  exact
                  path={`${url}/projects/:id`}
                  component={ProjectDetail}
                />
                <Route
                  exact
                  path={`${url}/projects/:id/developers`}
                  component={ProjectDevelopers}
                />
                <Route
                  exact
                  path={`${url}/tickets/new`}
                  component={NewTicket}
                />
                <Route exact path={`${url}/tickets`} component={Tickets} />
                <Route
                  exact
                  path={`${url}/tickets/:id`}
                  component={TicketDetail}
                />
                <Route exact path={`${url}/users/new`} component={CreateUser} />
                <Route exact path={`${url}/users`} component={Users} />
                <Route exact path={`${url}/users/:id`} component={UserDetail} />
                <Route path={`${url}/account`} component={Account} />
                <Route component={Error404} />
              </Switch>
            </Suspense>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Homepage;
