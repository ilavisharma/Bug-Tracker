import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import LoadingSpinner from '../../utils/LoadingSpinner';
import EditProjectModal from './EditProjectModal';
import AuthContext from '../../Context/AuthContext';
import AssignProjectManagerModal from './AssignProjectManagerModal';

const ProjectDetail = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [isFound, setIsFound] = useState(true);
  const [showModal, setshowModal] = useState(false);
  const [showAssignManagerModal, setShowAssignManagerModal] = useState(false);

  const { user, api } = useContext(AuthContext);
  const { push } = useHistory();
  const { id } = useParams();

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
  }, [id, api]);

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
        setProject({ ...project, name, description });
        setshowModal(false);
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

          <Row>
            <Col>
              {project.manager === null ? (
                'This project is not assigned'
              ) : (
                <>
                  <h5>
                    <mark>Manager:</mark>
                    <Link
                      style={{ textDecoration: 'none' }}
                      to={`/home/users/${project.manager_id}`}
                    >
                      {project.manager.name}
                    </Link>
                  </h5>
                  <h5>
                    <mark>Email:</mark>

                    {project.manager.email}
                  </h5>
                </>
              )}
            </Col>
            <Col>
              <Button
                variant="outline-dark"
                onClick={() => setShowAssignManagerModal(true)}
                className="float-right"
              >
                Assign this project
              </Button>
            </Col>
          </Row>
          <AssignProjectManagerModal
            showModal={showAssignManagerModal}
            closeModal={() => setShowAssignManagerModal(false)}
            project={project}
            setProject={setProject}
          />
          <hr />
          <div className="my-3">
            {(project.user_id === user.id || user.role === 'admin') && (
              <>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteClick(project.name)}
                >
                  Delete Project
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
                <Button variant="secondary" className="mx-1">
                  Add developers
                </Button>
                <Button variant="light" disabled={true} className="mx-1">
                  Remove developers
                </Button>
              </>
            )}
          </div>
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
