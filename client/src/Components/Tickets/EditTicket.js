import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Helmet } from 'react-helmet';
import CKEditor from 'ckeditor4-react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';
import Image from 'react-bootstrap/Image';
import usePut from '../../hooks/usePut';
import LoadingSpinner from '../../utils/LoadingSpinner';
import { SuccessAlert, ErrorAlert } from '../../alerts';
import api from '../../utils/api';

const EditTicket = () => {
  const [name, setName] = useState(null);
  const [type, setType] = useState(null);
  const [priority, setPriority] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [description, setDescription] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [showProgress, setShowProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { id } = useParams();
  const { push } = useHistory();

  const fetchTicket = useCallback(async () => {
    try {
      const res = await api.get(`/tickets/${id}`);
      if (res.data) {
        const ticket = res.data;
        setName(ticket.name);
        setType(ticket.type);
        setPriority(ticket.priority);
        setImageUrl(ticket.imageurl);
        setDescription(ticket.description);
      }
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setError(err);
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  const onDrop = useCallback(async files => {
    const data = new FormData();
    data.append('file', files[0]);
    const res = await api.post('/tickets/uploadImage', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
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
      },
    });
    setImageUrl(res.data.url);
  }, []);

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: 'image/*',
    onDrop,
  });

  const { isLoading: isUpdating, put } = usePut(`/tickets/${id}`);

  const onFormSubmit = e => {
    e.preventDefault();
    put({
      name,
      type,
      priority,
      description,
      imageurl: imageUrl,
    }).then(res => {
      if (res.status === 200) {
        SuccessAlert('Ticket Updated');
        push(`/home/tickets/${id}`);
      } else {
        ErrorAlert('Unable to update the ticket');
      }
    });
  };

  if (isLoading) return <LoadingSpinner />;
  else if (error)
    return (
      <h4 className="display-4">
        <Helmet>
          <title>Error</title>
        </Helmet>
        There was some error
      </h4>
    );
  else {
    return (
      <Col xs={9}>
        <Helmet>
          <title>Edit Ticket</title>
        </Helmet>
        <h2>Edit Ticket</h2>
        <Form onSubmit={onFormSubmit}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={name}
              onChange={e => setName(e.target.value)}
              type="text"
            />
          </Form.Group>
          <Form.Group>
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
                    <option value="feature">Feature</option>
                    <option value="issue">Issue</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group>
                  <Form.Label>Priority</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={e => setPriority(e.target.value)}
                    value={priority}
                  >
                    <option value="low">Low</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <div
                {...getRootProps()}
                style={{
                  border: '2px dashed gray',
                  cursor: 'pointer',
                  margin: 'auto',
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
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <CKEditor
                data={description}
                value={description}
                onChange={evt => setDescription(evt.editor.getData())}
              />
            </Form.Group>
          </Form.Group>
          {isUpdating ? (
            <Button variant="primary" disabled>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Updating...
            </Button>
          ) : (
            <Button variant="primary" type="submit">
              Update
            </Button>
          )}
        </Form>
      </Col>
    );
  }
};

export default EditTicket;
