import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import LoadingSpinner from '../../utils/LoadingSpinner';
import api from '../../utils/api';
import usePost from '../../hooks/usePost';
import { SuccessAlert, ErrorAlert, ConfirmAlert } from '../../alerts';

const AllProjects = () => {
  const { push } = useHistory();
  const [search, setSearch] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selected, setSelected] = useState([]);

  const fetchProjects = async () => {
    api
      .get('/projects')
      .then(res => {
        setProjects(res.data);
        setSearch(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSearch = ({ target: { value } }) => {
    if (value === '') return setSearch(projects);
    setSearch(
      projects.filter(
        ({ name, manager }) =>
          name.toLowerCase().includes(value) ||
          (manager !== null && manager.toLowerCase().includes(value))
      )
    );
  };

  const toggleSelected = id => {
    if (!selected.includes(id)) setSelected([...selected, id]);
    else setSelected(selected.filter(i => i !== id));
  };

  const { isLoading: isDeleting, post } = usePost('projects/deleteMultiple');

  const handleMultipleDelete = async () => {
    const result = await ConfirmAlert(
      `Delete ${selected.length} project${selected.length !== 1 ? 's' : ''} ?`,
      'Yes'
    );
    if (!result.value) return;
    post({
      ids: selected,
    })
      .then(res => {
        if (res.status === 200) {
          setSelected([]);
          SuccessAlert('Projects were deleted');
        } else ErrorAlert(res.statusText);
        fetchProjects();
      })
      .catch(err => {
        console.log(err);
        ErrorAlert(err.message || 'Unable to delete the projects');
      });
  };

  if (isLoading) return <LoadingSpinner />;
  else if (error) {
    return (
      <Col xs={9}>
        <h4 className="display-4">Unable to fetch projects</h4>
      </Col>
    );
  }
  return (
    <Col xs={9}>
      <div className="mb-3">
        <Link to="/home/projects/new" className="btn btn-success">
          New Project
        </Link>
        {selected.length !== 0 && (
          <>
            {isDeleting ? (
              <Button disabled variant="danger" className="mx-5">
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Deleting
              </Button>
            ) : (
              <Button
                onClick={handleMultipleDelete}
                variant="danger"
                className="mx-5"
              >
                Delete
              </Button>
            )}
          </>
        )}
      </div>
      <Form.Group>
        <Form.Control
          onChange={handleSearch}
          type="text"
          placeholder="Search Project"
        />
      </Form.Group>
      <Table stripped="true" hover>
        <thead>
          <tr>
            <th></th>
            <th>Project Name</th>
            <th>Manager</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {search.map(({ id, name, manager, dateadded }) => (
            <tr style={{ cursor: 'pointer' }} key={id}>
              <td>
                <Form.Check
                  onClick={() => toggleSelected(id)}
                  type="checkbox"
                />
              </td>
              <td onClick={() => push(`/home/projects/${id}`)}>{name}</td>
              <td onClick={() => push(`/home/projects/${id}`)}>
                {manager === null ? (
                  <b>
                    <i>Not Assigned</i>
                  </b>
                ) : (
                  manager
                )}
              </td>
              <td onClick={() => push(`/home/projects/${id}`)}>
                {new Date(dateadded).toDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Col>
  );
};

export default AllProjects;
