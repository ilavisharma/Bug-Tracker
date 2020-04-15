import React, { useContext } from 'react';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import AuthContext from '../../Context/AuthContext';
import LoadingSpinner from '../../utils/LoadingSpinner';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  if (user === null) return <LoadingSpinner />;

  if (user.role === 'admin') {
    return (
      <Nav
        variant="pills"
        fill
        className="flex-column"
        style={{ height: '60vh' }}
      >
        <LinkContainer exact to="/home">
          <Nav.Link>Dashboard</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/home/projects">
          <Nav.Link>All Projects</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/home/tickets">
          <Nav.Link>All Tickets</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/home/users">
          <Nav.Link>Users/Roles</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/home/account">
          <Nav.Link>My Account</Nav.Link>
        </LinkContainer>
      </Nav>
    );
  }
  if (user.role === 'manager') {
    return (
      <Nav
        variant="pills"
        fill
        className="flex-column"
        style={{ height: '60vh' }}
      >
        <LinkContainer exact to="/home">
          <Nav.Link>Dashboard</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/home/projects">
          <Nav.Link>My Projects</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/home/tickets">
          <Nav.Link>Tickets</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/home/account">
          <Nav.Link>My Account</Nav.Link>
        </LinkContainer>
      </Nav>
    );
  } else {
    return <LoadingSpinner />;
  }
};

export default Sidebar;
