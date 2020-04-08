import React from 'react';
import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import AllUsers from './AllUsers';

const Users = () => {
  return (
    <Col>
      <Link to="/home/users/new" className="btn btn-success">
        Create new user
      </Link>
      <AllUsers />
    </Col>
  );
};

export default Users;
