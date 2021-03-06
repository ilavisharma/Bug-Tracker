import React from 'react';
import { useHistory } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import BeatSpinner from '../../utils/BeatSpinner';
import useGet from '../../hooks/useGet';

const ticketBadge = badge => {
  if (badge === 'error' || badge === 'high') return 'danger';
  if (badge === 'issue' || badge === 'medium') return 'warning';
  if (badge === 'bug' || badge === 'low') return 'info';
  if (badge === 'feature') return 'dark';
};

const RecentTickets = () => {
  const { push } = useHistory();

  const { isLoading, response, error } = useGet(`/tickets/recent`);

  if (isLoading) return <BeatSpinner />;
  else if (error) return <h6>{error}</h6>;
  else {
    const { data: tickets } = response;
    return (
      <>
        <h5 className="text-center">Recently created Tickets</h5>
        <ListGroup>
          {tickets.map(({ id, name, type, priority }) => (
            <ListGroup.Item
              action={true}
              onClick={() => push(`/home/tickets/${id}`)}
              key={id}
            >
              {name}
              <Badge
                className="float-right"
                pill={true}
                variant={ticketBadge(type)}
              >
                {type}
              </Badge>
              <Badge
                className="float-right"
                pill={true}
                variant={ticketBadge(priority)}
              >
                {priority}
              </Badge>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </>
    );
  }
};

export default RecentTickets;
