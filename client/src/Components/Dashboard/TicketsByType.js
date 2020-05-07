import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import useGet from '../../hooks/useGet';
import BeatSpinner from '../../utils/BeatSpinner';
import { toTitleCase } from '../../utils/helpers';

const TicketsByType = () => {
  const { isLoading, response, error } = useGet('tickets/chart/type');

  if (isLoading) return <BeatSpinner />;
  else if (error) {
    console.log(error);
    return <p>There was some error</p>;
  } else {
    const { data } = response;
    const chartData = {
      labels: data.labels.map(d => toTitleCase(d)),
      datasets: [
        {
          data: data.data,
          responsive: true,
          backgroundColor: ['#67E6DC', '#F0DF87', '#758AA2']
        }
      ]
    };
    const options = {
      title: {
        display: true,
        text: 'Ticket type',
        fontSize: 18
      },
      legend: {
        display: false
      }
    };
    return <Doughnut data={chartData} options={options} />;
  }
};

export default TicketsByType;
