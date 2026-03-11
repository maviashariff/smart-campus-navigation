import { useState } from 'react';
import AdminLogin from '../components/Admin/AdminLogin';
import AdminPanel from '../components/Admin/AdminPanel';

function AdminDashboard() {
  const [admin, setAdmin] = useState(null);

  // Check if already logged in (token exists)
  const token = localStorage.getItem('adminToken');

  const handleLogin = (adminData) => {
    setAdmin(adminData);
  };

  const handleLogout = () => {
    setAdmin(null);
  };

  // Show login if no token and no admin state
  if (!token && !admin) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Show panel — use admin data or fallback
  return (
    <AdminPanel
      admin={admin || { username: 'admin' }}
      onLogout={handleLogout}
    />
  );
}

export default AdminDashboard;
