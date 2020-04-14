import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../../utils/LoadingSpinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import EditRoleModal from './EditRoleModal';
import { toTitleCase } from '../../utils/helpers';
import AuthContext from '../../Context/AuthContext';

const UserDetail = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);

  const { id } = useParams();
  const { api } = useContext(AuthContext);

  useEffect(() => {
    (async function() {
      try {
        const res = await api.get(`/auth/users/${id}`);
        setUser(res.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        alert(err);
      }
    })();
  }, [id, api]);

  const updateRoleInUI = role => {
    setUser({ ...user, role });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Col xs={10}>
      <Row xs={10}>
        <Col>
          <h4 className="display-4 ">{user.name}</h4>
          <hr />
          <h5>
            <mark>Role:</mark>{' '}
            {user.role === null ? 'Not Assigned' : toTitleCase(user.role)}
            <Button
              className="ml-4"
              variant="outline-dark"
              onClick={() => setShowEditRoleModal(true)}
            >
              Edit
            </Button>
          </h5>
          <h5>
            <mark>Email:</mark>
            {' ' + user.email}
          </h5>
        </Col>
        <Col>
          <img
            src={user.photourl}
            className="img-thumbnail float-right"
            width="171"
            height="180"
            style={{ cursor: 'pointer' }}
            onTouchStart={() => console.log('touch start')}
            alt={user.name}
          />
        </Col>
      </Row>
      <EditRoleModal
        show={showEditRoleModal}
        handleClose={() => setShowEditRoleModal(false)}
        user={user}
        updateRoleInUI={updateRoleInUI}
      />
      <hr />
      <h4>Projects Assigned</h4>
      {user.projects.map(({ id, name }) => (
        <li key={id}>{name}</li>
      ))}
    </Col>
  );
};

export default UserDetail;
