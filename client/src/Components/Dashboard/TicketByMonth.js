import React from 'react';
import { Line } from 'react-chartjs-2';
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
    const chartData = {
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      datasets: [
        {
          data: data,
          responsive: true,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          fill: false
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
        display: true,
        text: 'Projects Timeline',
        fontSize: 18,
        fontFamily: 'sofia-pro'
      },
      legend: {
        display: false
      }
    };
    return <Line data={chartData} options={options} />;
  }
};

export default TicketByMonth;
