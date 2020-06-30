import React from 'react';
import { useHistory } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Col from 'react-bootstrap/Col';
import useGet from '../../hooks/useGet';
import LoadingSpinner from '../../utils/LoadingSpinner';

const MyProjects = ({ id }) => {
  const { isLoading, error, response } = useGet(`/auth/users/${id}`);

  const { push } = useHistory();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <h5>Unable to fetch projects</h5>;
  else {
    const {
      data: { projects },
    } = response;
    return (
      <Col xs={7}>
        <ListGroup>
          {projects.map(({ id, name }) => (
            <ListGroup.Item
              key={id}
              action={true}
              onClick={() => push(`/home/projects/${id}`)}
            >
              {name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Col>
    );
  }
};

export default MyProjects;
