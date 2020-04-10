import React, { useState, useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { useHistory } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';
import { toTitleCase } from '../../utils/helpers';
import AuthContext from '../../Context/AuthContext';

const CreateUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photourl, setPhotourl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { goBack } = useHistory();
  const { api } = useContext(AuthContext);

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
          // Clear percentage
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

  const onFormSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post(
        '/auth/signup',
        { name, email, password, photourl },
        {
          headers: {
            authorization: localStorage.getItem('token')
          }
        }
      );
      setIsLoading(false);
      alert('User Created');
      goBack();
    } catch (err) {
      console.log(err);
      setIsLoading(false);
      alert(err);
    }
  };

  return (
    <Col xs={8}>
      <h3 className="display-3">Create new user</h3>
      <hr />
      <Form onSubmit={onFormSubmit}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={e => setName(toTitleCase(e.target.value))}
            type="text"
          />
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
          <Form.Control
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
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
