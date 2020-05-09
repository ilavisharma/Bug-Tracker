import React from 'react';
import { useHistory } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import LoadingSpinner from '../../utils/LoadingSpinner';
import useGet from '../../hooks/useGet';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const Tickets = () => {
  const { push } = useHistory();
  const { isLoading, response, error } = useGet(`/tickets`);

  useDocumentTitle('Tickets');

  if (isLoading) return <LoadingSpinner />;
  else if (error) return <h4 className="display-4">There was some error</h4>;
  else {
    const { data: tickets } = response;
    return (
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
              ({ id, name, type, priority, projectName, dateadded, user }) => (
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
    );
  }
};

export default Tickets;
