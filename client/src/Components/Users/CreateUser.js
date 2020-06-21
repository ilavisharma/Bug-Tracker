import React, { useState, useCallback, createRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';
import { toTitleCase } from '../../utils/helpers';
import usePost from '../../hooks/usePost';
import UserSchema from '../../schema/user';
import { ErrorAlert, SuccessAlert } from '../../alerts';
import api from '../../utils/api';

const CreateUser = () => {
  const name = createRef();
  const email = createRef();
  const [photourl, setPhotourl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  const { push } = useHistory();

  const onDrop = useCallback(async files => {
    const data = new FormData();
    data.append('file', files[0]);
    const res = await api.post('/auth/uploadImage', data, {
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
        }, 250);
      },
    });
    setPhotourl(res.data.url);
  }, []);

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: 'image/*',
    onDrop,
  });

  const { isLoading, post } = usePost('/auth/signup');

  const onFormSubmit = e => {
    e.preventDefault();
    const { value, error } = UserSchema.validate({
      name: toTitleCase(name.current.value),
      email: email.current.value,
    });

    if (error) {
      ErrorAlert(toTitleCase(error.details[0].message));
    } else {
      post({
        ...value,
        photourl,
      })
        .then(res => {
          if (res.data.message === 'user created') {
            SuccessAlert(toTitleCase(res.data.message));
            push(`/home/users/${res.data.user.id}`);
          } else if (res.data.message === 'user already exists') {
            ErrorAlert(toTitleCase(res.data.message));
          }
        })
        .catch(err => {
          console.log({ err });
          ErrorAlert('There was some error!');
        });
    }
  };

  return (
    <Col xs={8}>
      <Helmet>
        <title>New User</title>
      </Helmet>
      <h3 className="display-3">Create new user</h3>
      <hr />
      <Form onSubmit={onFormSubmit}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control ref={name} type="text" required />
        </Form.Group>
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
            <center>
              <p className="lead">Drop the file here ...</p>
            </center>
          ) : (
            <center>
              <p className="lead">
                Drop the profile image here, or click to select images
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
        {photourl !== null && <Image src={photourl} fluid />}
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control ref={email} type="email" required />
        </Form.Group>
        {isLoading ? (
          <Button variant="warning" disabled>
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
          <Button variant="warning" type="submit">
            Create
          </Button>
        )}
      </Form>
    </Col>
  );
};

export default CreateUser;
