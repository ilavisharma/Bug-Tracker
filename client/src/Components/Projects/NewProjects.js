import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import api from '../../utils/api';

const NewProjects = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const onFormSubmit = e => {
    e.preventDefault();
    api
      .post('/projects/new', { name, description })
      .then(res => console.log(res.data, res.status))
      .catch(err => console.log(err));
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
      <Button variant="info" type="submit">
        Create new project
      </Button>
    </Form>
  );
};

export default NewProjects;
