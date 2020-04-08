import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';

const Sidebar = () => {
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
        <Nav.Link>Projects</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/home/tickets">
        <Nav.Link>Tickets</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/home/users">
        <Nav.Link>Users/Roles</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/home/account">
        <Nav.Link>My Account</Nav.Link>
      </LinkContainer>
    </Nav>
  );
};

export default Sidebar;
