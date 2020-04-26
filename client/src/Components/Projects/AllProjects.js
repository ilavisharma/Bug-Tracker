import React from 'react';
import { useHistory } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import LoadingSpinner from '../../utils/LoadingSpinner';
import useGet from '../../hooks/useGet';

const Projects = () => {
  const { push } = useHistory();

  const { response, isLoading, error } = useGet('/projects');

  if (isLoading) return <LoadingSpinner />;
  else if (error) {
    return (
      <Col xs={9}>
        <h4 className="display-4">Unable to fetch projects</h4>
      </Col>
    );
  } else {
    const { data: projects } = response;
    return (
      <Col xs={9}>
        <Table stripped="true" hover>
          <thead>
            <tr>
              <th>Project Id</th>
              <th>Project Name</th>
              <th>Manager</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(({ id, name, manager }) => (
              <tr
                style={{ cursor: 'pointer' }}
                key={id}
                onClick={() => push(`/home/projects/${id}`)}
              >
                <td>{id}</td>
                <td>{name}</td>
                <td>{manager === null ? 'Not Assigned' : manager}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    );
  }
};

export default Projects;
