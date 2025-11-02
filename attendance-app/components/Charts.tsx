'use client';

import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartsProps {
  genderData: { putra: number; putri: number };
  statusData: { hadir: number; izin: number; sakit: number; alpha: number };
}

export default function Charts({ genderData, statusData }: ChartsProps) {
  const genderChartData = {
    labels: ['Putra', 'Putri'],
    datasets: [
      {
        data: [genderData.putra, genderData.putri],
        backgroundColor: ['#3B82F6', '#EC4899'],
        borderColor: ['#2563EB', '#DB2777'],
        borderWidth: 2,
      },
    ],
  };

  const statusChartData = {
    labels: ['Hadir', 'Izin', 'Sakit', 'Alpha'],
    datasets: [
      {
        label: 'Jumlah Siswa',
        data: [statusData.hadir, statusData.izin, statusData.sakit, statusData.alpha],
        backgroundColor: ['#10B981', '#F59E0B', '#8B5CF6', '#EF4444'],
        borderColor: ['#059669', '#D97706', '#7C3AED', '#DC2626'],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Distribusi Jenis Kelamin
        </h3>
        <div className="h-64">
          <Pie data={genderChartData} options={chartOptions} />
        </div>
        <div className="mt-4 flex justify-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{genderData.putra}</div>
            <div className="text-sm text-gray-600">Putra</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-pink-600">{genderData.putri}</div>
            <div className="text-sm text-gray-600">Putri</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Status Kehadiran
        </h3>
        <div className="h-64">
          <Bar
            data={statusChartData}
            options={{
              ...chartOptions,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}
          />
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2">
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">{statusData.hadir}</div>
            <div className="text-xs text-gray-600">Hadir</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-amber-600">{statusData.izin}</div>
            <div className="text-xs text-gray-600">Izin</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">{statusData.sakit}</div>
            <div className="text-xs text-gray-600">Sakit</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-red-600">{statusData.alpha}</div>
            <div className="text-xs text-gray-600">Alpha</div>
          </div>
        </div>
      </div>
    </div>
  );
}
