import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import useGet from '../../hooks/useGet';
import BeatSpinner from '../../utils/BeatSpinner';

const TicketsByPriority = () => {
  const { isLoading, response, error } = useGet('tickets/chart/priority');

  if (isLoading) return <BeatSpinner />;
  else if (error) {
    console.log(error);
    return <p>There was some error</p>;
  } else {
    const { data } = response;
    return (
      <>
        <h5 className="text-center">Tickets Priority</h5>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="priority" />
            <Tooltip />
            <Bar barSize={40} dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </>
    );
  }
};

export default TicketsByPriority;
