import React from 'react';
import { Helmet } from 'react-helmet';
import AllProjects from './AllProjects';
import Container from 'react-bootstrap/Container';

const Projects = () => {
  return (
    <Container>
      <Helmet>
        <title>Projects</title>
      </Helmet>
      <AllProjects />
    </Container>
  );
};

export default Projects;
