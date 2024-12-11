'use client';

import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardChartProps {
  title: string;
  type?: 'line' | 'bar';
}

export default function DashboardChart({ title, type = 'line' }: DashboardChartProps) {
  const data = {
    labels: ['2011', '2012', '2013', '2014', '2015', '2016'],
    datasets: [
      {
        label: title,
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: type === 'line' ? 'rgb(75, 192, 192)' : undefined,
        backgroundColor: type === 'bar' ? 'rgba(54, 162, 235, 0.5)' : undefined,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {type === 'line' ? (
        <Line options={options} data={data} />
      ) : (
        <Bar options={options} data={data} />
      )}
    </div>
  );
} 