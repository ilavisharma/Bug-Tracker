import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import api from '../../utils/api';
import LoadingSpinner from '../../utils/LoadingSpinner';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { push } = useHistory();

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
  }, []);

  return (
    <Container>
      <h4 className="display-4">All Projects</h4>
      <Link to="/home/projects/new" className="btn btn-success">
        New Project
      </Link>

      <div style={{ marginBottom: '20px' }} />

      {isLoading ? (
        <Row className="justify-content-md-center">
          <LoadingSpinner />
        </Row>
      ) : (
        <Col xs={9}>
          <Table stripped="true" hover>
            <thead>
              <tr>
                <th>Project Id</th>
                <th>Project Name</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(({ id, name }) => (
                <tr
                  style={{ cursor: 'pointer' }}
                  key={id}
                  onClick={() => push(`/home/projects/${id}`)}
                >
                  <td>{id}</td>
                  <td>{name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      )}
    </Container>
  );
};

export default Projects;
