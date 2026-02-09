import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Layout } from '@/components/layout/layout';
import UserDashboard from '@/components/dashboard/UserDashboard';

export default function Dashboard() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout hideFooter>
      <UserDashboard />
    </Layout>
  );
}
