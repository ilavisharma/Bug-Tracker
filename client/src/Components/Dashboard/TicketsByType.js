import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import useGet from '../../hooks/useGet';
import LoadingSpinner from '../../utils/LoadingSpinner';

const TicketsByType = () => {
  const { isLoading, response, error } = useGet('tickets/chart/type');

  if (isLoading) return <LoadingSpinner />;
  else if (error) {
    console.log(error);
    return <p>There was some error</p>;
  } else {
    const { data } = response;
    const chartData = {
      labels: data.labels,
      datasets: [
        {
          data: data.data,
          label: 'Tickets by Type',
          responsive: true,
          //   backgroundColor: 'rgba(255,99,132,0.2)',
          //   borderColor: 'rgba(255,99,132,1)',
          //   borderWidth: 1,
          //   hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          //   hoverBorderColor: 'rgba(255,99,132,1)',
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ]
        }
      ]
    };
    const options = {
      scales: {
        xAxes: [
          {
            display: true
          }
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              display: false
            }
          }
        ]
      }
    };
    return <Doughnut data={chartData} />;
  }
};

export default TicketsByType;
