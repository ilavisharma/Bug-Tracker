import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import useGet from '../../hooks/useGet';
import BeatSpinner from '../../utils/BeatSpinner';

const TicketsByType = () => {
  const { isLoading, response, error } = useGet('tickets/chart/type');

  const colors = ['#9df3c4', '#07689f', '#a2d5f2', '#fdffab'];

  if (isLoading) return <BeatSpinner />;
  else if (error) {
    console.log(error);
    return <p>There was some error</p>;
  } else {
    const { data } = response;
    return (
      <>
        <h5 className="text-center">Ticket types</h5>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              dataKey="count"
              data={data}
              innerRadius={50}
              outerRadius={100}
              nameKey="type"
            >
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

export default TicketsByType;
