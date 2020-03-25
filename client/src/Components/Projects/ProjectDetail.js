import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import LoadingSpinner from '../../utils/LoadingSpinner';
import api from '../../utils/api';

const ProjectDetail = ({
  match: {
    params: { id }
  }
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [isFound, setIsFound] = useState(true);

  const { push } = useHistory();

  useEffect(() => {
    (async function() {
      try {
        const res = await api.get(`/projects/${id}`);
        if (res.status === 200) {
          setProject(res.data);
          setIsLoading(false);
        } else {
          setIsFound(false);
          setIsLoading(false);
          alert(res.statusText);
        }
      } catch (err) {
        alert(err);
        setIsFound(false);
        setIsLoading(false);
      }
    })();
  }, [id]);

  const handleDeleteClick = async () => {
    try {
      const res = await api.delete(`/projects/${id}`);
      if (res.status === 200) {
        alert('Project Deleted');
        push('/home/projects');
      } else {
        alert('Unable to delete the project');
      }
    } catch (err) {
      alert(err);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  else {
    if (!isFound) return <h4 className="display-4">Project does not exist</h4>;

    return (
      <Col xs={11}>
        <h4 className="display-4">{project.name}</h4>
        <hr />
        <p className="lead">{project.description}</p>
        <Button variant="danger" onClick={handleDeleteClick}>
          Delete
        </Button>
        <Link className="btn btn-info mx-3" to={`/home/projects/${id}/edit`}>
          Edit this project
        </Link>
      </Col>
    );
  }
};

export default ProjectDetail;
