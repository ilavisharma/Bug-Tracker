import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
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

  return (
    <Container>
      <h4 className="display-4">All Projects</h4>
      <Link to="/home/projects/new" className="btn btn-success">
        New Project
      </Link>

      <div style={{ marginBottom: '20px' }} />

      {isLoading ? (
        <LoadingSpinner />
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
