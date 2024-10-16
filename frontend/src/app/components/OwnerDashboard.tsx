import { useAuth } from './AuthProvider';

export default function OwnerDashboard() {
  const { user } = useAuth();

  if (user?.role !== 'owner') {
    return <div>Access Denied</div>;
  }

  return (
    <div>
      <h1>Owner Dashboard</h1>
      {/* Add owner-specific controls here */}
    </div>
  );
}