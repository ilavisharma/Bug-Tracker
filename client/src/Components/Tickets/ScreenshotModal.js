import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

const ScreenshotModal = ({ url, show, handleClose }) => {
  return (
    <Modal size="lg" show={show} onHide={handleClose} animation={true}>
      <Modal.Header closeButton>
        <Modal.Title>Attached Screenshot</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Image src={url} fluid />
      </Modal.Body>
      <Button onClick={handleClose} variant="dark">
        Close
      </Button>
    </Modal>
  );
};

export default ScreenshotModal;
