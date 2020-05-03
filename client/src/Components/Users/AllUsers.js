import React from 'react';
import { useHistory } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import LoadingSpinner from '../../utils/LoadingSpinner';
import { toTitleCase } from '../../utils/helpers';
import useGet from '../../hooks/useGet';

const AllUsers = () => {
  const { push } = useHistory();

  const { isLoading, response, error } = useGet('/auth/allUsers');

  if (isLoading) return <LoadingSpinner />;
  else if (error) return <h4 className="display-4">There was some error</h4>;
  else {
    const { data: users } = response;
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
  }
};

export default AllUsers;
