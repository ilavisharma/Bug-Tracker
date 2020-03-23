import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import api from '../../utils/api';

const NewProjects = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { push } = useHistory();

  const onFormSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/projects/new', { name, description });
      setIsLoading(false);
      alert('Project Created');
      push(`/home/projects/${res.data.id}`);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={onFormSubmit}>
      <Form.Group>
        <Form.Label>Project Name</Form.Label>
        <Form.Control
          value={name}
          onChange={e => setName(e.target.value)}
          type="text"
          placeholder="My Awesome Project"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Project Description</Form.Label>
        <Form.Control
          value={description}
          onChange={e => setDescription(e.target.value)}
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
          <span className="sr-only">Creating...</span>
        </Button>
      ) : (
        <Button variant="info" type="submit">
          Create new project
        </Button>
      )}
    </Form>
  );
};

export default NewProjects;
