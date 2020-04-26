import React, { useContext, createRef } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../Context/AuthContext';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Col from 'react-bootstrap/Col';
import { toTitleCase } from '../../utils/helpers';
import usePost from '../../hooks/usePost';

const NewProjects = () => {
  const name = createRef();
  const description = createRef();

  const { push } = useHistory();

  const { isLoading, post } = usePost('/projects/new');

  const onFormSubmit = async e => {
    e.preventDefault();
    post({
      name: toTitleCase(name.current.value),
      description: description.current.value
    }).then(res => {
      if (res) {
        if (res.status === 200) {
          alert('Project Created');
          push(`/home/projects/${res.data.id}`);
        } else {
          alert('Unable to create the project');
        }
      }
    });
  };

  return (
    <Col xs={9}>
      <h3 className="display-3">Create new Project</h3>
      <hr />

      <Form onSubmit={onFormSubmit}>
        <Form.Group>
          <Form.Label>Project Name</Form.Label>
          <Form.Control
            ref={name}
            type="text"
            placeholder="My Awesome Project"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Project Description</Form.Label>
          <Form.Control
            ref={description}
            as="textarea"
            placeholder="This project is about..."
            rows="3"
          />
        </Form.Group>
        {isLoading ? (
          <Button variant="info" disabled>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Creating...
          </Button>
        ) : (
          <Button variant="info" type="submit">
            Create
          </Button>
        )}
      </Form>
    </Col>
  );
};

export default NewProjects;
