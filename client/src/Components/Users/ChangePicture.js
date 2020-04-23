import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDropzone } from 'react-dropzone';

const ChangePicture = ({ show, handleClose }) => {
  const onDrop = useCallback(
    async files => {
      const data = new FormData();
      data.append('file', files[0]);
      const res = await api.post('/auth/changeImage', data, {
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

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Change Profile Picture</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangePicture;
