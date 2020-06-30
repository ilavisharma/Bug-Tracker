import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import usePost from '../../hooks/usePost';
import { SuccessAlert, ErrorAlert } from '../../alerts';

const NewCommentModal = ({ show, handleClose, refetch, ticketId }) => {
  const [comment, setComment] = useState('');

  const { isLoading, post } = usePost(`/tickets/${ticketId}/comments/new`);

  const handleSubmit = e => {
    e.preventDefault();
    post({
      content: comment,
    })
      .then(res => {
        if (res.status === 200) {
          SuccessAlert('Comment created');
          setComment('');
          refetch();
          handleClose();
        } else {
          ErrorAlert(res.statusText);
        }
      })
      .catch(err => {
        console.log(err);
        ErrorAlert(err);
      });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>New Comment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Control
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Type here"
              type="text"
            />
          </Form.Group>
          {isLoading ? (
            <Button className="float-right" disabled>
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
            <Button
              disabled={comment === ''}
              className="float-right"
              type="submit"
            >
              Create
            </Button>
          )}
          <Button variant="dark" onClick={handleClose} className="float-left">
            Cancel
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default NewCommentModal;
