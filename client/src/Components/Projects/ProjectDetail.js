import React, { useState, useContext } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import LoadingSpinner from '../../utils/LoadingSpinner';
import EditProjectModal from './EditProjectModal';
import AuthContext from '../../Context/AuthContext';
import AssignProjectManagerModal from './AssignProjectManagerModal';
import TooltipComponent from '../../utils/TooltipComponent';
import useGet from '../../hooks/useGet';
import usePut from '../../hooks/usePut';
import useDelete from '../../hooks/useDelete';
import Spinner from 'react-bootstrap/Spinner';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const ProjectDetail = () => {
  const [showModal, setshowModal] = useState(false);
  const [showAssignManagerModal, setShowAssignManagerModal] = useState(false);
  const [copyText, setCopyText] = useState('Click to copy');

  const { user } = useContext(AuthContext);
  const { push } = useHistory();
  const { id } = useParams();

  const { response, isLoading, refetch: refetchProject } = useGet(
    `/projects/${id}`
  );

  useDocumentTitle(
    response && response.data
      ? response.data.name + ' | Bug Tracker'
      : 'Projects'
  );

  const { delete: deleteProject, isLoading: isDeleting } = useDelete(
    `/projects/${id}`
  );

  const handleDeleteClick = async name => {
    const confirm = window.confirm(`Delete the project: ${name} ?`);
    if (confirm) {
      deleteProject().then(res => {
        if (res.status === 200) {
          alert('Project Deleted');
          push('/home/projects');
        } else {
          alert('Unable to delete the project');
        }
      });
    }
  };

  const { put } = usePut(`/projects/${id}`);
  const handleEdit = (name, description) => {
    put({ name, description }).then(res => {
      if (res.status === 200) {
        alert('Project Updated');
        refetchProject();
        setshowModal(false);
      } else {
        alert('Unable to update the project');
      }
    });
  };

  const copyEmail = email => {
    navigator.clipboard.writeText(email);
    setCopyText('Copied!');
    setTimeout(() => {
      setCopyText('Click to copy');
    }, 500);
  };

  if (isLoading) return <LoadingSpinner />;
  if (response.status !== 200)
    return <h4 className="display-4">Project does not exist</h4>;
  else {
    const { data: project } = response;
    // document.title = project.name + ' | Bug Tracker';
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
                    <span
                      className="mx-2"
                      onClick={() => copyEmail(project.manager.email)}
                    >
                      {user.role === 'admin' ? (
                        <Link
                          style={{ textDecoration: 'none' }}
                          to={`/home/users/${project.manager_id}`}
                        >
                          {project.manager.name}
                        </Link>
                      ) : (
                        project.manager.name
                      )}
                    </span>
                  </h5>
                  <h5>
                    <mark>Email:</mark>
                    <TooltipComponent placement="right" tooltipText={copyText}>
                      <span
                        style={{ cursor: 'pointer' }}
                        className="mx-2"
                        onClick={() => copyEmail(project.manager.email)}
                      >
                        {project.manager.email}
                      </span>
                    </TooltipComponent>
                  </h5>
                </>
              )}
            </Col>
            <Col>
              {(project.manager_id === user.id || user.role === 'admin') && (
                <Button
                  variant="outline-dark"
                  onClick={() => setShowAssignManagerModal(true)}
                  className="float-right"
                >
                  Assign this project
                </Button>
              )}
            </Col>
          </Row>
          <AssignProjectManagerModal
            showModal={showAssignManagerModal}
            closeModal={() => setShowAssignManagerModal(false)}
            project={project}
            refetch={refetchProject}
          />
          <hr />
          <div className="my-3">
            {(project.manager_id === user.id || user.role === 'admin') && (
              <>
                {isDeleting ? (
                  <Button variant="danger" disabled>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                    Deleting...
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteClick(project.name)}
                  >
                    Delete Project
                  </Button>
                )}

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
