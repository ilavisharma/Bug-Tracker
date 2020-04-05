import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import api from '../../utils/api';
import LoadingSpinner from '../../utils/LoadingSpinner';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { push } = useHistory();

  useEffect(() => {
    (async function() {
      try {
        const res = await api.get(`/tickets`, {
          headers: {
            authorization: localStorage.getItem('token')
          }
        });
        setIsLoading(false);
        setTickets(res.data);
      } catch (err) {
        setIsLoading(false);
        alert(err);
      }
    })();
  }, []);

  return (
    <Container>
      <h3 className="display-3">These are tickets</h3>
      <Link to="/home/tickets/new" className="btn btn-success">
        New Ticket
      </Link>
      <div style={{ marginBottom: '20px' }} />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Col xs={11}>
          <Table stripped="true" hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Project Name</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(
                ({ id, name, type, priority, projectName, dateadded }) => (
                  <tr
                    style={{ cursor: 'pointer' }}
                    key={id}
                    onClick={() => push(`/home/tickets/${id}`)}
                  >
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{type}</td>
                    <td>{priority}</td>
                    <td>{projectName}</td>
                    <td>{new Date(dateadded).toDateString()}</td>
                  </tr>
                )
              )}
            </tbody>
          </Table>
        </Col>
      )}
    </Container>
  );
};

export default Tickets;
