import { Navigate, useLocation } from 'react-router-dom';
import { ADMIN_AUTH_KEY } from '../../config/adminAuth';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const isAuthenticated = sessionStorage.getItem(ADMIN_AUTH_KEY) === '1';

  if (!isAuthenticated) {
    return <Navigate to="/admin-access" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
