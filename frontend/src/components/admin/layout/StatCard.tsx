interface StatCardProps {
  title: string;
  value: number;
}

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-[#21336a]">{value}</p>
    </div>
  );
} 