import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import api from '../../utils/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async function() {
      setIsLoading(true);
      try {
        const res = await api.get(`/projects`);
        setIsLoading(false);
        setProjects(res.data);
      } catch (err) {
        setIsLoading(false);
        console.log(err);
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
        <div>Loading</div>
      ) : (
        <Col xs={7}>
          <Table stripped="true" hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(({ id, name }) => (
                <tr style={{ cursor: 'pointer' }} key={id}>
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
