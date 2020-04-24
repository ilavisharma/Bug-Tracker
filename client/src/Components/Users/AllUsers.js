import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import LoadingSpinner from '../../utils/LoadingSpinner';
import { toTitleCase } from '../../utils/helpers';
import AuthContext from '../../Context/AuthContext';

const AllUsers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchUsers, setSearchUsers] = useState([]);

  const { push } = useHistory();
  const { api } = useContext(AuthContext);

  useEffect(() => {
    (async function() {
      try {
        const res = await api.get(`/auth/allUsers`, {
          headers: {
            authorization: localStorage.getItem('token')
          }
        });
        setUsers(res.data);
        setSearchUsers(res.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        alert(err);
      }
    })();
  }, [api]);

  const handleSearch = term => {
    if (term === '') {
      setSearchUsers(users);
    } else {
      setSearchUsers(
        users.filter(
          user =>
            user.name.includes(term) ||
            user.email.includes(term) ||
            user.role.includes(term)
        )
      );
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Col xs={9} className="mt-4">
      <Form.Group>
        <Form.Control
          onChange={e => handleSearch(e.target.value)}
          type="text"
          placeholder="Search"
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
          {searchUsers.map(({ id, name, email, role }) => (
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
