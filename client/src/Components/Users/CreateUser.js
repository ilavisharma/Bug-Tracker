import React, { useState, useCallback, createRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { useHistory } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';
import { toTitleCase } from '../../utils/helpers';
import usePost from '../../hooks/usePost';
import UserSchema from '../../schema/user';
import useAuthContext from '../../hooks/useAuthContext';

const CreateUser = () => {
  const name = createRef();
  const email = createRef();
  const password = createRef();
  const [photourl, setPhotourl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  const { push } = useHistory();
  const { api } = useAuthContext();

  const onDrop = useCallback(
    async files => {
      const data = new FormData();
      data.append('file', files[0]);
      const res = await api.post('/auth/uploadImage', data, {
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
          }, 250);
        }
      });
      setPhotourl(res.data.url);
    },
    [api]
  );

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: 'image/*',
    onDrop
  });

  const { isLoading, post } = usePost('/auth/signup');

  const onFormSubmit = e => {
    e.preventDefault();
    const { value, error } = UserSchema.validate({
      name: toTitleCase(name.current.value),
      email: email.current.value,
      password: password.current.value
    });

    if (error) {
      alert(toTitleCase(error.details[0].message));
    } else {
      post({
        ...value,
        photourl
      })
        .then(res => {
          if (res.data.message === 'user created') {
            alert(toTitleCase(res.data.message));
            push(`/home/users/${res.data.user.id}`);
          } else if (res.data.message === 'user already exists') {
            alert(toTitleCase(res.data.message));
          }
        })
        .catch(err => {
          console.log({ err });
          alert(err);
        });
    }
  };

  return (
    <Col xs={8}>
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
            margin: 'auto'
          }}
          className="my-3"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="lead">Drop the file here ...</p>
          ) : (
            <center>
              <p className="lead">
                Drag 'n' drop the profile image here, or click to select images
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
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control ref={password} type="password" required />
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
