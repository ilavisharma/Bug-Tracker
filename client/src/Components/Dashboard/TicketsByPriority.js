import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import useGet from '../../hooks/useGet';
import BeatSpinner from '../../utils/BeatSpinner';

const TicketsByPriority = () => {
  const { isLoading, response, error } = useGet('tickets/chart/priority');

  const colors = ['#384259', '#f73859', '#7ac7c4'];

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
            <Bar barSize={40} dataKey="count">
              {data.map((_, i) => (
                <Cell fill={colors[i % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </>
    );
  }
};

export default TicketsByPriority;
