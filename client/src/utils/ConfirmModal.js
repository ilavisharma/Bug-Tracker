import React from 'react';

const ConfirmModal = ({ show, handleClose, message, handleSubmit }) => {
  return (
    <Modal centered show={show} onHide={handleClose} animation={true}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Yes
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Nope
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
