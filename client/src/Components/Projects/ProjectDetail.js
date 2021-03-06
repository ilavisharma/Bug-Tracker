import React, { useState, useRef } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import LoadingSpinner from '../../utils/LoadingSpinner';
import EditProjectModal from './EditProjectModal';
import AssignProjectManagerModal from './AssignProjectManagerModal';
import TooltipComponent from '../../utils/TooltipComponent';
import useGet from '../../hooks/useGet';
import usePut from '../../hooks/usePut';
import useDelete from '../../hooks/useDelete';
import Spinner from 'react-bootstrap/Spinner';
import ProjectTimelineModal from './ProjectTimelineModal';
import useAuthContext from '../../hooks/useAuthContext';
import { ConfirmAlert, SuccessAlert, ErrorAlert } from '../../alerts';
import ListGroup from 'react-bootstrap/ListGroup';

const ProjectDetail = () => {
  const [showModal, setshowModal] = useState(false);
  const [showAssignManagerModal, setShowAssignManagerModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [copyText, setCopyText] = useState('Click to copy');

  const timelineModalRef = useRef();

  const { user } = useAuthContext();
  const { push } = useHistory();
  const { id } = useParams();

  const { response, isLoading, refetch: refetchProject } = useGet(
    `/projects/${id}`
  );

  const { response: ticketResponse } = useGet(`/projects/${id}/tickets`);

  const { delete: deleteProject, isLoading: isDeleting } = useDelete(
    `/projects/${id}`
  );

  const handleDeleteClick = async name => {
    const result = await ConfirmAlert(
      `Delete the project ${name} ?`,
      'Yes, delete it!'
    );

    if (result.value) {
      deleteProject().then(res => {
        if (res.status === 200) {
          SuccessAlert('The project was deleted');
          push('/home/projects');
        } else {
          ErrorAlert();
        }
      });
    }
  };

  const { put } = usePut(`/projects/${id}`);
  const handleEdit = (name, description) => {
    put({ name, description }).then(res => {
      if (res.status === 200) {
        SuccessAlert('Project was updated');
        refetchProject();
        setshowModal(false);
        timelineModalRef.current.refetch();
      } else {
        ErrorAlert('Unable to update the project');
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
    return (
      <>
        <Helmet>
          <title>{project.name}</title>
        </Helmet>
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
                  style={{ display: 'inline-flex' }}
                >
                  <i
                    style={{ margin: '6px 10px 0 0' }}
                    className="gg-pentagon-up"
                  />
                  Assign this project
                </Button>
              )}
              <Button
                variant="success"
                onClick={() => setShowTimelineModal(true)}
                style={{ display: 'inline-flex' }}
              >
                <i style={{ margin: '2px 10px 0 0' }} className="gg-time" />
                View Project Timeline
              </Button>
            </Col>
          </Row>
          <AssignProjectManagerModal
            showModal={showAssignManagerModal}
            closeModal={() => setShowAssignManagerModal(false)}
            project={project}
            refetch={refetchProject}
            manager={project.manager_id}
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
                    style={{ display: 'inline-flex' }}
                  >
                    <i
                      style={{ margin: '7px 10px 0 0' }}
                      className="gg-trash-empty"
                    />
                    Delete Project
                  </Button>
                )}
                <Button
                  variant="info"
                  onClick={() => {
                    setshowModal(true);
                  }}
                  className="mx-3"
                  style={{ display: 'inline-flex' }}
                >
                  <i className="gg-pen" style={{ margin: '8px 7px 0 0' }} />
                  Edit
                </Button>
                <Link
                  className="btn btn-secondary"
                  to={`/home/projects/${id}/developers`}
                >
                  Developers
                </Link>
              </>
            )}
          </div>
          <EditProjectModal
            show={showModal}
            handleClose={() => setshowModal(false)}
            handleEdit={handleEdit}
            project={project}
          />
          <ProjectTimelineModal
            show={showTimelineModal}
            closeModal={() => setShowTimelineModal(false)}
            projectId={id}
            ref={timelineModalRef}
          />
          <hr />
        </Col>
        <Col xs={8}>
          <h3>Tickets</h3>
          {ticketResponse.data.length !== 0 ? (
            ticketResponse.data.map(({ name, id, dateadded }) => (
              <ListGroup.Item
                action={true}
                onClick={() => push(`/home/tickets/${id}`)}
                key={id}
              >
                {name}
                <span className="float-right">
                  {new Date(dateadded).toDateString()}
                </span>
              </ListGroup.Item>
            ))
          ) : (
            <h6>No tickets have been created for this project</h6>
          )}
        </Col>
      </>
    );
  }
};

export default ProjectDetail;
