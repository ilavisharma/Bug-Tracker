import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import LoadingSpinner from '../../utils/LoadingSpinner';
import { toTitleCase } from '../../utils/helpers';
import TooltipComponent from '../../utils/TooltipComponent';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useAuthContext from '../../hooks/useAuthContext';

const Account = () => {
  const { user } = useAuthContext();
  useDocumentTitle(user.name || 'Account');

  if (user === null) return <LoadingSpinner />;

  return (
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
    </Col>
  );
};

export default Account;
