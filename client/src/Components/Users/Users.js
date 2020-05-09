import React from 'react';
import { useHistory } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import AllUsers from './AllUsers';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const Users = () => {
  const { push } = useHistory();

  useDocumentTitle('Users & Roles');

  return (
    <Col>
      <Button
        style={{ display: 'flex' }}
        onClick={() => push('/home/users/new')}
        variant="success"
      >
        Create new user
        <i className="ml-1 gg-user-add" />
      </Button>
      <AllUsers />
    </Col>
  );
};

export default Users;
