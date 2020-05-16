import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
import LoadingSpinner from '../../utils/LoadingSpinner';
import useAuthContext from '../../hooks/useAuthContext';

const Sidebar = () => {
  const { user } = useAuthContext();

  if (user === null) return <LoadingSpinner />;

  if (user.role === 'admin') {
    return (
      <Nav
        variant="pills"
        fill
        className="flex-column"
        style={{ height: '60vh' }}
        // activeKey=""
      >
        <LinkContainer activeClassName="sidebar-active" exact to="/home">
          <Nav.Link>Dashboard</Nav.Link>
        </LinkContainer>
        <LinkContainer activeClassName="sidebar-active" to="/home/projects">
          <Nav.Link>All Projects</Nav.Link>
        </LinkContainer>
        <LinkContainer activeClassName="sidebar-active" to="/home/tickets">
          <Nav.Link>All Tickets</Nav.Link>
        </LinkContainer>
        <LinkContainer activeClassName="sidebar-active" to="/home/users">
          <Nav.Link>Users/Roles</Nav.Link>
        </LinkContainer>
        <LinkContainer activeClassName="sidebar-active" to="/home/account">
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
          <Nav.Link>All Projects</Nav.Link>
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
