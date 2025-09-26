import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register necessary components from Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const generateRandomData = () => {
  // Generate random data for each month (between 50 and 200)
  return Array.from({ length: 12 }, () => Math.floor(Math.random() * (200 - 50 + 1)) + 50);
};

const RequestsByMonthChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // Months
    datasets: [
      {
        label: 'Requests',
        data: generateRandomData(), // Randomized data
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return 'rgba(75, 192, 192, 0.7)'; // Default color if no chart area is available
          }

          // Create gradient effect
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(75, 192, 192, 0.8)'); // Darker at the bottom
          gradient.addColorStop(1, 'rgba(75, 192, 192, 0.3)'); // Lighter at the top

          return gradient;
        },
        borderRadius: 8, // Rounded edges for bars
        hoverBackgroundColor: 'rgba(75, 192, 192, 1)', // Brighter on hover
        barThickness: 30, // Consistent bar width
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }, // Hide legend
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Requests: ${tooltipItem.raw}`, // Custom tooltip
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Month' },
        grid: { display: false } // Remove vertical grid lines
      },
      y: {
        title: { display: true, text: 'Number of Requests' },
        beginAtZero: true,
        grid: {
          borderDash: [5, 5], // Dashed grid lines for better readability
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  return (
    <div >
      <Bar data={data} options={options} />
    </div>
  );
};

export default RequestsByMonthChart;
