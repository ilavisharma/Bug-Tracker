import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';
import useGet from '../../hooks/useGet';
import BeatSpinner from '../../utils/BeatSpinner';

const TicketsByType = () => {
  const { isLoading, response, error } = useGet('tickets/chart/type');

  if (isLoading) return <BeatSpinner />;
  else if (error) {
    console.log(error);
    return <p>There was some error</p>;
  } else {
    const { data } = response;
    return (
      <>
        <h5 className="text-center">Ticket type</h5>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              dataKey="count"
              data={data}
              innerRadius={40}
              outerRadius={100}
              fill="#82ca9d"
              nameKey="type"
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </>
    );
  }
};

export default TicketsByType;
