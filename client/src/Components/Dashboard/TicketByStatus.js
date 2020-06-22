import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import useGet from '../../hooks/useGet';
import BeatSpinner from '../../utils/BeatSpinner';

const TicketByStatus = () => {
  const { isLoading, error, response } = useGet('/tickets/chart/status');
  const colors = ['#ff6348', '#5352ed'];

  if (isLoading) return <BeatSpinner />;
  else if (error) {
    console.log(error);
    return <p>There was some error</p>;
  } else {
    const { data } = response;
    console.log(data);
    return (
      <>
        <h5 className="text-center">Ticket Status</h5>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie dataKey="count" data={data} nameKey="status">
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </>
    );
  }
};

export default TicketByStatus;
