import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import LoadingSpinner from '../../utils/LoadingSpinner';
import AuthContext from '../../Context/AuthContext';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { push } = useHistory();
  const { api } = useContext(AuthContext);

  useEffect(() => {
    (async function() {
      try {
        const res = await api.get(`/projects`);
        setIsLoading(false);
        setProjects(res.data);
      } catch (err) {
        setIsLoading(false);
        alert(err);
      }
    })();
  }, [api]);

  if (isLoading) return <LoadingSpinner />;

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
};

export default Projects;
