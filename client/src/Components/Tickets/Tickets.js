import React, { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import LoadingSpinner from '../../utils/LoadingSpinner';
import AuthContext from '../../Context/AuthContext';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { push } = useHistory();
  const { api } = useContext(AuthContext);

  useEffect(() => {
    (async function() {
      try {
        const res = await api.get(`/tickets`);
        setIsLoading(false);
        setTickets(res.data);
      } catch (err) {
        setIsLoading(false);
        alert(err);
      }
    })();
    // eslint-disable-next-line
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
                <th>Name</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Project Name</th>
                <th>Created by</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(
                ({
                  id,
                  name,
                  type,
                  priority,
                  projectName,
                  dateadded,
                  user
                }) => (
                  <tr
                    style={{ cursor: 'pointer' }}
                    key={id}
                    onClick={() => push(`/home/tickets/${id}`)}
                  >
                    <td>{name}</td>
                    <td>{type}</td>
                    <td>{priority}</td>
                    <td>{projectName}</td>
                    <td>{user}</td>
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
