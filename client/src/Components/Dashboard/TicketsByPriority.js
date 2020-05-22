import React from 'react';
import { Bar } from 'react-chartjs-2';
import useGet from '../../hooks/useGet';
import BeatSpinner from '../../utils/BeatSpinner';
import { toTitleCase } from '../../utils/helpers';

const TicketsByPriority = () => {
  const { isLoading, response, error } = useGet('tickets/chart/priority');

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
          backgroundColor: ['#E74292', '#FBD28B', '#EAF0F1'],
          barThickness: 50
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
      },
      title: {
        display: false
      },
      legend: {
        display: false
      }
    };
    return (
      <>
        <h5 className="text-center">
          {'Tickets by Priority (' + data.data.reduce((a, b) => a + b, 0) + ')'}
        </h5>
        <Bar data={chartData} options={options} />{' '}
      </>
    );
  }
};

export default TicketsByPriority;
