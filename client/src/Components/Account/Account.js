import React, { useContext } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import AuthContext from '../../Context/AuthContext';
import LoadingSpinner from '../../utils/LoadingSpinner';

const Account = () => {
  const { user } = useContext(AuthContext);

  if (user === null) return <LoadingSpinner />;

  return (
    <Col xs={10}>
      <Row xs={10}>
        <Col>
          <h4 className="display-4 float-left">{user.name}</h4>
        </Col>
        <Col>
          <img
            src={user.photourl}
            className="rounded img-thumbnail float-right"
            width="171"
            height="180"
            style={{ cursor: 'pointer' }}
            onTouchStart={() => console.log('touch start')}
            alt={user.name}
          />
        </Col>
      </Row>
    </Col>
  );
};

export default Account;
