import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import api from '../../utils/api';
import LoadingSpinner from '../../utils/LoadingSpinner';
import { toTitleCase } from '../../utils/helpers';

const AllUsers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState(null);

  const { push } = useHistory();

  useEffect(() => {
    (async function() {
      try {
        const res = await api.get(`/auth/allUsers`, {
          headers: {
            authorization: localStorage.getItem('token')
          }
        });
        setUsers(res.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        alert(err);
      }
    })();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <Col xs={9} className="mt-4">
      <Table stripped="true" hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>User Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, name, email, role }) => (
            <tr
              key={id}
              style={{ cursor: 'pointer' }}
              onClick={() => push(`/home/users/${id}`)}
            >
              <td>{name}</td>
              <td>{email}</td>
              <td>
                {role === null ? <>Not Assigned</> : <>{toTitleCase(role)}</>}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Col>
  );
};

export default AllUsers;
