import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import api from '../../utils/api';

const NewTicket = () => {
  const [projectList, setProjectList] = useState([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [name, setName] = useState('');
  const [project, setProject] = useState(1);
  const [type, setType] = useState('bug');
  const [priority, setPriority] = useState('low');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async files => {
    const data = new FormData();
    data.append('file', files[0]);
    // TODO: something here
    const res = await api.post('/tickets/uploadImage', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: progress => {
        setShowProgress(true);
        setUploadProgress(
          parseInt(Math.round((progress.loaded * 100) / progress.total))
        );
        // Clear percentage
        setTimeout(() => {
          setUploadProgress(0);
          setShowProgress(false);
        }, 10000);
      }
    });
    console.log(res.data);
  }, []);
  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: 'image/*',
    onDrop
  });

  useEffect(() => {
    (async function() {
      try {
        const res = await api.get('/projects');
        setProjectList(res.data);
        setProjectsLoaded(true);
      } catch (err) {
        console.log(err);
        alert(err);
        setProjectsLoaded(false);
      }
    })();
  }, []);

  const onFormSubmit = e => {
    e.preventDefault();
    alert(JSON.stringify({ name, project, type, priority, description }));
  };

  return (
    <Col xs={9}>
      <h3 className="display-3">New Ticket</h3>
      <hr />

      <Form onSubmit={onFormSubmit}>
        <Form.Group>
          <Form.Label>Project Name</Form.Label>
          <Form.Control
            value={name}
            onChange={e => setName(e.target.value)}
            type="text"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Select the project</Form.Label>
          {!projectsLoaded ? (
            <Form.Control as="select" disabled>
              <option>Loading Projects</option>
            </Form.Control>
          ) : (
            <Form.Control
              as="select"
              value={project}
              onChange={e => setProject(e.target.value)}
            >
              {projectList.map(({ id, name }) => (
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
              <Form.Control
                as="select"
                value={type}
                onChange={e => setType(e.target.value)}
              >
                <option value="bug">Bug</option>
                <option value="error">Error</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col xs={6}>
            <Form.Group>
              <Form.Label>Priority</Form.Label>
              <Form.Control
                as="select"
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
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
            cursor: 'pointer'
          }}
          className="my-3"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
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
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            value={description}
            onChange={e => setDescription(e.target.value)}
            as="textarea"
            rows="2"
          />
        </Form.Group>
        <Button type="submit" varient="info">
          Create new ticket
        </Button>
      </Form>
    </Col>
  );
};

export default NewTicket;
