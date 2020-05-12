import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import LoadingSpinner from '../../utils/LoadingSpinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import EditRoleModal from './EditRoleModal';
import { toTitleCase } from '../../utils/helpers';
import TooltipComponent from '../../utils/TooltipComponent';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import useAuthContext from '../../hooks/useAuthContext';

const UserDetail = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { id } = useParams();
  const { api, user: currentUser } = useAuthContext();
  const { goBack, push } = useHistory();

  const useFetchUser = () => {
    const callback = useCallback(async () => {
      try {
        const res = await api.get(`/auth/users/${id}`);
        setUser(res.data);
        setIsLoading(false);
        document.title = res.data.name || 'Users';
      } catch (err) {
        setIsLoading(false);
        alert(err);
      }
    }, []);
    return { callback };
  };
  const { callback } = useFetchUser();

  useEffect(() => {
    if (currentUser.role !== 'admin') {
      alert('This action is not allowed!');
      goBack();
    } else {
      callback();
    }
  }, [callback, goBack, currentUser.role]);

  const onEditClick = () => {
    if (!user.projects || user.projects.length > 0) {
      alert(
        `${user.name} has projects assigned. Please remove the assigned projects first.`
      );
    } else setShowEditRoleModal(true);
  };

  const updateRoleInUI = () => {
    setIsLoading(true);
    callback();
  };

  const onDeleteClick = async () => {
    if (!user.projects || user.projects.length > 0) {
      alert(
        `${user.name} has been assigned to ${user.projects.length} projects. Please remove the assigned projects first.`
      );
    } else {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete ${user.name} ?`
      );
      if (confirmDelete) {
        setIsDeleting(true);
        const res = await api.delete(`/auth/${user.id}`);
        if (res.status === 200) {
          setIsDeleting(false);
          alert(`Succesfully Deleted user: ${user.name}`);
          push('/home/users');
        } else {
          setIsDeleting(false);
          alert('There was some error');
          console.log(res);
        }
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Col xs={10}>
      <Row xs={10}>
        <Col>
          <h4 className="display-4">{user.name}</h4>
          <hr />
          <h5>
            <mark>Role:</mark>{' '}
            {user.role === null ? 'Not Assigned' : toTitleCase(user.role)}
            <Button
              className="ml-4"
              variant="outline-dark"
              onClick={onEditClick}
            >
              Edit
            </Button>
          </h5>
          <h5>
            <mark>Email:</mark>
            {' ' + user.email}
          </h5>
        </Col>
        <Col>
          <TooltipComponent
            placement="bottom"
            tooltipText="Click to change picture"
          >
            <img
              src={user.photourl}
              className="img-thumbnail float-right"
              width="171"
              height="180"
              style={{ cursor: 'pointer' }}
              alt={`${user.name}`}
            />
          </TooltipComponent>
        </Col>
      </Row>
      <EditRoleModal
        show={showEditRoleModal}
        handleClose={() => setShowEditRoleModal(false)}
        user={user}
        updateRoleInUI={updateRoleInUI}
      />
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
          className="mt-4"
          onClick={onDeleteClick}
          style={{ display: 'flex' }}
        >
          Delete
          <i className="ml-2 gg-user-remove" />
        </Button>
      )}
      <hr />
      {user.projects && (
        <>
          <h4>Projects Assigned</h4>
          <Col xs={8}>
            <ListGroup className="my-4">
              {user.projects.map(({ id, name }) => (
                <ListGroup.Item
                  key={id}
                  action={true}
                  onClick={() => push(`/home/projects/${id}`)}
                >
                  {name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </>
      )}
    </Col>
  );
};

export default UserDetail;
