import React from 'react';
import { Link } from 'react-router-dom';

const Tickets = () => {
  return (
    <div>
      <h3 className="display-3">These are tickets</h3>
      <Link to="/home/tickets/new" className="btn btn-success">
        New Ticket
      </Link>
    </div>
  );
};

export default Tickets;
