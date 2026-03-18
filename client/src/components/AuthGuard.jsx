import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RequireAuth({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]" style={{paddingTop:'52px'}}>
        <div className="text-center">
          <img src="/fox-logo.png" alt="Learning Fox" className="w-16 h-16 mx-auto object-contain mb-3 animate-pulse-soft" />
          <p className="text-[var(--text-secondary)] text-sm">Loading Learning Fox...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.status === 'pending') return <Navigate to="/pending" replace />;
  if (user.status === 'rejected') return <Navigate to="/rejected" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const map = { admin: '/admin', teacher: '/teacher', student: '/student' };
    return <Navigate to={map[user.role] || '/login'} replace />;
  }

  return <Outlet />;
}

export function RedirectIfLoggedIn() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Outlet />;
  if (user.status === 'pending') return <Navigate to="/pending" replace />;
  if (user.status === 'rejected') return <Navigate to="/rejected" replace />;
  const map = { admin: '/admin', teacher: '/teacher', student: '/student' };
  return <Navigate to={map[user.role] || '/login'} replace />;
}
