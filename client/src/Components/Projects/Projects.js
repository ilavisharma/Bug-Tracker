import React from 'react';
import AllProjects from './AllProjects';
import Container from 'react-bootstrap/Container';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const Projects = () => {
  useDocumentTitle('Projects');
  return (
    <Container>
      <h4 className="display-4">All Projects</h4>
      <AllProjects />
    </Container>
  );
};

export default Projects;
