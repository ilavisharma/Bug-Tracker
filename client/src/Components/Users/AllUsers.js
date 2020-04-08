import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import api from '../../utils/api';
import LoadingSpinner from '../../utils/LoadingSpinner';

const AllUsers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    (async function() {
      try {
        const res = await api.get(`/auth/allUsers`, {
          headers: {
            authorization: localStorage.getItem('token')
          }
        });
        //   setIsLoading(false);
        setUsers(res.data);
        setIsLoading(false);
        console.log(res.data);
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
            <tr key={id} style={{ cursor: 'pointer' }}>
              <td>{name}</td>
              <td>{email}</td>
              <td>{role === null ? <>Not Assigned</> : <>{role}</>}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Col>
  );
};

export default AllUsers;
