import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import LoadingSpinner from '../../utils/LoadingSpinner';
import AuthContext from '../../Context/AuthContext';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { api } = useContext(AuthContext);
  const { push } = useHistory();

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
  }, [api]);

  return (
    <>
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
    </>
  );
};

export default Tickets;
