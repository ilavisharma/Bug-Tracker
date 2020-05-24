import React from 'react';
import {
  Line,
  XAxis,
  LineChart,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip
} from 'recharts';
import useGet from '../../hooks/useGet';
import BeatSpinner from '../../utils/BeatSpinner';

const TicketByMonth = () => {
  const { isLoading, response, error } = useGet('projects/chart/');

  if (isLoading) return <BeatSpinner />;
  else if (error) {
    console.log(error);
    return <p>There was some error</p>;
  } else {
    const { data } = response;
    return (
      <>
        <h5 className="text-center">Projects Timeline</h5>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <XAxis dataKey="month" interval={0} angle={30} dx={20} />
            <CartesianGrid strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="count"
              strokeWidth={3}
              stroke="#1fab89"
            />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </>
    );
  }
};

export default TicketByMonth;
