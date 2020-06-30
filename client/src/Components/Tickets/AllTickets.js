import React, { useState, useEffect } from 'react';
import { useHistory, Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import LoadingSpinner from '../../utils/LoadingSpinner';
import api from '../../utils/api';
import usePost from '../../hooks/usePost';
import { SuccessAlert, ErrorAlert, ConfirmAlert } from '../../alerts';

const Tickets = () => {
  const { push } = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [tickets, setTickets] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState([]);
  const [selected, setSelected] = useState([]);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets');
      setTickets(res.data);
      setSearch(res.data);
      setIsLoading(false);
    } catch (e) {
      setError(e.response.statusText);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const toggleSelected = id => {
    if (!selected.includes(id)) setSelected([...selected, id]);
    else setSelected(selected.filter(i => i !== id));
  };

  const handleSearch = ({ target: { value } }) => {
    if (value === '') return setSearch(tickets);
    setSearch(
      tickets.filter(
        ({ name, projectName, priority, type, user }) =>
          name.toLowerCase().includes(value) ||
          projectName.toLowerCase().includes(value) ||
          priority.toLowerCase().includes(value) ||
          type.toLowerCase().includes(value) ||
          user.toLowerCase().includes(value)
      )
    );
  };

  const { isLoading: isDeleting, post } = usePost('tickets/deleteMultiple');

  const handleMultipleDelete = async () => {
    const result = await ConfirmAlert(
      `Delete ${selected.length} ticket${selected.length !== 1 ? 's' : ''} ?`,
      'Yes'
    );
    if (!result.value) return;
    post({
      ids: selected,
    })
      .then(res => {
        if (res.status === 200) {
          setSelected([]);
          SuccessAlert('Tickets were deleted');
        } else ErrorAlert(res.statusText);
        fetchTickets();
      })
      .catch(err => {
        console.log(err);
        ErrorAlert(err.response.statusText || 'Unable to delete the projects');
      });
  };

  if (isLoading) return <LoadingSpinner />;
  else if (error) return <h4 className="display-4">There was some error</h4>;
  else {
    return (
      <Col xs={11}>
        <div className="mb-3">
          <Link to="/home/tickets/new" className="btn btn-success">
            + New Ticket
          </Link>
          {selected.length !== 0 && (
            <>
              {isDeleting ? (
                <Button disabled variant="danger" className="mx-5">
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Deleting
                </Button>
              ) : (
                <Button
                  onClick={handleMultipleDelete}
                  variant="danger"
                  className="mx-5"
                  style={{ display: 'inline-flex' }}
                >
                  <i
                    className="gg-trash-empty"
                    style={{ marginRight: '6px' }}
                  />
                  Delete
                </Button>
              )}
            </>
          )}
        </div>
        <Form.Group>
          <Form.Control
            onChange={handleSearch}
            type="text"
            placeholder="Search Ticket"
          />
        </Form.Group>
        <Table stripped="true" hover>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Type</th>
              <th>Priority</th>
              <th>Project Name</th>
              <th>Created by</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {search.map(
              ({ id, name, type, priority, projectName, dateadded, user }) => (
                <tr style={{ cursor: 'pointer' }} key={id}>
                  <td>
                    <Form.Check
                      onClick={() => toggleSelected(id)}
                      type="checkbox"
                    />
                  </td>
                  <td onClick={() => push(`/home/tickets/${id}`)}>{name}</td>
                  <td onClick={() => push(`/home/tickets/${id}`)}>{type}</td>
                  <td onClick={() => push(`/home/tickets/${id}`)}>
                    {priority}
                  </td>
                  <td onClick={() => push(`/home/tickets/${id}`)}>
                    {projectName}
                  </td>
                  <td onClick={() => push(`/home/tickets/${id}`)}>{user}</td>
                  <td onClick={() => push(`/home/tickets/${id}`)}>
                    {new Date(dateadded).toDateString()}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </Col>
    );
  }
};

export default Tickets;
