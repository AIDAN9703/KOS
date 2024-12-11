import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  trend: string;
  icon: ReactNode;
  color: string;
}

export default function StatCard({ title, value, trend, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          <p className="text-xs text-green-500 mt-2">{trend} from last week</p>
        </div>
        <div className={`${color} p-2 rounded-full text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
} 