import { Navigate, useLocation } from 'react-router-dom';
import { getAuthToken, getAuthUser } from '../../config/authStorage';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const authUser = getAuthUser();
  const isAuthenticated = Boolean(getAuthToken() && authUser?.isAdmin);

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export default ProtectedRoute;
