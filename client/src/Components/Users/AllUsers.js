import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import LoadingSpinner from '../../utils/LoadingSpinner';
import { toTitleCase } from '../../utils/helpers';
import { ErrorAlert } from '../../alerts';
import api from '../../utils/api';

const AllUsers = () => {
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState([]);
  const [error, setError] = useState(null);

  const { push } = useHistory();

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/allUsers');
      setUsers(res.data);
      setSearch(res.data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      ErrorAlert('Unable to fetch users');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = ({ target: { value } }) => {
    if (value === '') return setSearch(users);
    setSearch(
      users.filter(
        ({ name, email, role }) =>
          name.toLowerCase().includes(value) ||
          email.toLowerCase().includes(value) ||
          (role !== null && role.includes(value))
      )
    );
  };

  if (isLoading) return <LoadingSpinner />;
  else if (error) return <h4 className="display-4">There was some error</h4>;
  else {
    return (
      <Col xs={9} className="mt-4">
        <Form.Group>
          <Form.Control
            onChange={handleSearch}
            type="text"
            placeholder="Seach Users"
          />
        </Form.Group>
        <Table stripped="true" hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>User Role</th>
            </tr>
          </thead>
          <tbody>
            {search.map(({ id, name, email, role }) => (
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
