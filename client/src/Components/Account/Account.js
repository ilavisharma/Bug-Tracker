import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import LoadingSpinner from '../../utils/LoadingSpinner';
import { toTitleCase } from '../../utils/helpers';
import TooltipComponent from '../../utils/TooltipComponent';
import useAuthContext from '../../hooks/useAuthContext';
import PasswordChangeModal from './PasswordChangeModal';
import EditProfileModal from './EditProfileModal';
import MyProjects from './MyProjects';

const Account = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const { user } = useAuthContext();

  if (user === null) return <LoadingSpinner />;

  return (
    <>
      <Helmet>
        <title>{user.name || 'Account'}</title>
        <meta name="description" content="Account details" />
      </Helmet>
      <Col xs={10}>
        <Row xs={10}>
          <Col>
            <h4 className="display-4">{user.name}</h4>
            <h5>
              <mark>Role:</mark>{' '}
              {user.role === null ? 'Not Assigned' : toTitleCase(user.role)}
            </h5>
            <h5>
              <mark>Email:</mark> {user.email}
            </h5>
          </Col>
          <Col>
            <TooltipComponent
              placement="bottom"
              tooltipText="Click to change picture"
            >
              <img
                src={user.photourl}
                className="rounded img-thumbnail float-right"
                width="171"
                height="180"
                style={{ cursor: 'pointer' }}
                onTouchStart={() => console.log('touch start')}
                alt={user.name}
              />
            </TooltipComponent>
          </Col>
        </Row>
        <Button onClick={() => setShowEditProfileModal(true)} variant="success">
          Edit Profile
        </Button>
        <EditProfileModal
          handleClose={() => setShowEditProfileModal(false)}
          show={showEditProfileModal}
          user={user}
        />
        <Button className="mx-3" onClick={() => setShowPasswordModal(true)}>
          Change Password
        </Button>
        <PasswordChangeModal
          show={showPasswordModal}
          handleClose={() => setShowPasswordModal(false)}
        />
      </Col>
      <hr />
      {user.role !== 'admin' && (
        <Col xs={10}>
          <h4>Projects</h4>
          <MyProjects id={user.id} />
        </Col>
      )}
    </>
  );
};

export default Account;
