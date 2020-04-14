import React from 'react';
import AllProjects from './AllProjects';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';

const Projects = () => {
  return (
    <Container>
      <h4 className="display-4">All Projects</h4>
      <Link to="/home/projects/new" className="btn btn-success">
        New Project
      </Link>

      <div style={{ marginBottom: '20px' }} />

      <AllProjects />
    </Container>
  );
};

export default Projects;
