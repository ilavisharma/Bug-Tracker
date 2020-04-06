import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import LoadingSpinner from '../../utils/LoadingSpinner';
import api from '../../utils/api';
import EditProjectModal from './EditProjectModal';
import AuthContext from '../../Context/AuthContext';

const ProjectDetail = ({
  match: {
    params: { id }
  }
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [isFound, setIsFound] = useState(true);
  const [showModal, setshowModal] = useState(false);

  const { push, replace } = useHistory();
  const { user } = useContext(AuthContext);

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

  const handleDeleteClick = async name => {
    const confirm = window.confirm(`Delete the project: ${name} ?`);
    if (confirm) {
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
    }
  };

  const handleEdit = async (name, description) => {
    try {
      const res = await api.put(`/projects/${id}`, { name, description });
      if (res.status === 200) {
        alert('Project Updated');
        replace(`/home/projects`);
      } else {
        alert('Unable to update the project');
      }
    } catch (err) {
      alert(err);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  else {
    if (!isFound) return <h4 className="display-4">Project does not exist</h4>;

    return (
      <>
        <Col xs={11}>
          <h4 className="display-4">{project.name}</h4>
          <hr />
          <p className="lead">{project.description}</p>
          {project.user_id === user.id && (
            <>
              <Button
                variant="danger"
                onClick={() => handleDeleteClick(project.name)}
              >
                Delete
              </Button>
              <Button
                variant="info"
                onClick={() => {
                  setshowModal(true);
                }}
                className="mx-1"
              >
                Edit this project
              </Button>
            </>
          )}
        </Col>
        <EditProjectModal
          show={showModal}
          handleClose={() => setshowModal(false)}
          handleEdit={handleEdit}
          project={project}
        />
      </>
    );
  }
};

export default ProjectDetail;
