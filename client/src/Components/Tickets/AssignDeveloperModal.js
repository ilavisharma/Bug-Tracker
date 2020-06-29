import React, { useState } from 'react';
import Select from 'react-select';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import useGet from '../../hooks/useGet';
import LoadingSpinner from '../../utils/LoadingSpinner';
import usePost from '../../hooks/usePost';
import { SuccessAlert, ConfirmAlert, ErrorAlert } from '../../alerts';

const AssignDeveloperModal = ({
  show,
  handleClose,
  refetch,
  projectId,
  ticketId,
}) => {
  const [selected, setSelected] = useState(null);
  const [sendEmail, setSendEmail] = useState(false);

  const { isLoading, response } = useGet(`/projects/${projectId}/developers`);
  const { isLoading: isAssigning, post } = usePost(
    `/tickets/:id/assignDeveloper`
  );
  const handleSubmit = async () => {
    const result = await ConfirmAlert(
      `Assign this ticket to ${selected.name}`,
      'Yes'
    );
    if (!result.value) return;
    post({
      developer_id: selected.id,
      ticket_id: ticketId,
      developerName: selected.name,
      sendEmail,
    })
      .then(res => {
        if (res.status === 200)
          SuccessAlert(`${selected.name} was assigned to this ticket`);
        else ErrorAlert('Unable to assign');
        refetch();
        handleClose();
      })
      .catch(err => {
        console.log(err);
        ErrorAlert('Unable to assign');
      });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Assign developer to this ticket</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Developers assign to this project</Form.Label>
            <Select
              placeholder="Select"
              options={response.data.map(({ user_id, name }) => ({
                value: user_id,
                label: name,
              }))}
              onChange={e => setSelected({ id: e.value, name: e.label })}
            />
          </Form.Group>
          <Form.Group>
            <Form.Check
              label="Send an e-mail to this developer"
              type="checkbox"
              onClick={() => setSendEmail(!sendEmail)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose} variant="dark">
          Close
        </Button>
        {isAssigning ? (
          <Button variant="success" disabled>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Assigning...
          </Button>
        ) : (
          <Button onClick={handleSubmit} variant="success">
            Assign
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default AssignDeveloperModal;
