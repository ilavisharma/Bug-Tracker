import React from 'react';
import { Link } from 'react-router-dom';

const Projects = () => {
  return (
    <div>
      <h4 className="display-4">All Projects</h4>
      <Link to="/home/projects/new" className="btn btn-success">
        New Project
      </Link>
    </div>
  );
};

export default Projects;
