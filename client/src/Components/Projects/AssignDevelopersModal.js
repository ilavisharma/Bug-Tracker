import React, { useState } from 'react';
import Select from 'react-select';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import usePut from '../../hooks/usePut';
import useGet from '../../hooks/useGet';
import { SuccessAlert, ErrorAlert } from '../../alerts';

const AssignDevelopersModal = ({ show, close, project_id, refetch }) => {
  const [selected, setSelected] = useState([]);

  const { isLoading, response } = useGet('/auth/availableDevelopers');
  const { isLoading: isAssigning, put } = usePut(
    `/projects/${project_id}/assignDeveloper`
  );

  const handleAssign = () => {
    put(selected)
      .then(res => {
        if (res.status === 200) {
          SuccessAlert('Assigned');
          close();
          refetch();
        }
      })
      .catch(err => {
        console.log(err);
        ErrorAlert('Unable to assign!');
      });
  };

  const handleSelect = e => {
    setSelected(
      e.map(({ value }) => ({
        developer_id: value,
        project_id,
      }))
    );
  };

  return (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>Assign this project to</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Select developers</Form.Label>
          {isLoading ? (
            <Select placeholder="Loading..." />
          ) : (
            <Select
              placeholder="Type to search"
              options={response.data.map(({ id, name }) => ({
                value: id,
                label: name,
              }))}
              isMulti
              onChange={handleSelect}
            />
          )}
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={close}>
          Close
        </Button>
        {isAssigning ? (
          <Button variant="info" disabled>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Assign
          </Button>
        ) : (
          <Button
            disabled={selected.length === 0}
            variant="info"
            onClick={handleAssign}
          >
            Assign
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default AssignDevelopersModal;
