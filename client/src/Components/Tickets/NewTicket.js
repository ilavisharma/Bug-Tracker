import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';
import Image from 'react-bootstrap/Image';
import { toTitleCase } from '../../utils/helpers';
import useGet from '../../hooks/useGet';
import usePost from '../../hooks/usePost';
import { createRef } from 'react';
import useAuthContext from '../../hooks/useAuthContext';

const NewTicket = () => {
  const name = createRef();
  const project = createRef();
  const type = createRef();
  const priority = createRef();
  const description = createRef();
  const [imageUrl, setImageUrl] = useState(null);
  const [showProgress, setShowProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { push } = useHistory();
  const { api } = useAuthContext();

  const onDrop = useCallback(
    async files => {
      const data = new FormData();
      data.append('file', files[0]);
      const res = await api.post('/tickets/uploadImage', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progress => {
          setShowProgress(true);
          setUploadProgress(
            parseInt(Math.round((progress.loaded * 100) / progress.total))
          );
          setTimeout(() => {
            setUploadProgress(0);
            setShowProgress(false);
          }, 500);
        }
      });
      setImageUrl(res.data.url);
    },
    [api]
  );

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: 'image/*',
    onDrop
  });

  const { response } = useGet('/projects');
  const { post, isLoading } = usePost('/tickets/new');

  const onFormSubmit = async e => {
    e.preventDefault();
    post({
      name: toTitleCase(name.current.value),
      project_id: project.current.value,
      type: type.current.value,
      priority: priority.current.value,
      description: description.current.value,
      imageurl: imageUrl
    }).then(res => {
      if (res.status === 200) {
        alert('Ticket Created');
        push(`/home/tickets/${res.data.id}`);
      } else {
        alert('Unable to create the ticket');
      }
    });
  };

  return (
    <Col xs={9}>
      <h3 className="display-3">New Ticket</h3>
      <hr />

      <Form onSubmit={onFormSubmit}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control ref={name} type="text" />
        </Form.Group>
        <Form.Group>
          <Form.Label>Select the project</Form.Label>
          {response === null ? (
            <Form.Control as="select" disabled>
              <option>Loading Projects</option>
            </Form.Control>
          ) : (
            <Form.Control as="select" ref={project}>
              <option value="0">Select project</option>
              {response.data.map(({ id, name }) => (
                <option value={id} key={id}>
                  {name}
                </option>
              ))}
            </Form.Control>
          )}
        </Form.Group>
        <Row>
          <Col xs={6}>
            <Form.Group>
              <Form.Label>Type</Form.Label>
              <Form.Control as="select" ref={type}>
                <option value="bug">Bug</option>
                <option value="error">Error</option>
                <option value="feature">Feature</option>
                <option value="issue">Issue</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col xs={6}>
            <Form.Group>
              <Form.Label>Priority</Form.Label>
              <Form.Control as="select" ref={priority}>
                <option value="low">Low</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <div
          {...getRootProps()}
          style={{
            border: '2px dashed gray',
            cursor: 'pointer',
            margin: 'auto'
          }}
          className="my-3"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="lead">Drop the files here ...</p>
          ) : (
            <center>
              <p className="lead">
                Drag 'n' drop some images here, or click to select images
              </p>
            </center>
          )}
        </div>
        {showProgress && (
          <ProgressBar
            animated
            now={uploadProgress}
            label={`${uploadProgress}%`}
          />
        )}
        {imageUrl !== null && <Image src={imageUrl} fluid />}
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control ref={description} as="textarea" rows="2" />
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
          <Button variant="primary" type="submit">
            Create New Ticket
          </Button>
        )}
      </Form>
    </Col>
  );
};

export default NewTicket;
