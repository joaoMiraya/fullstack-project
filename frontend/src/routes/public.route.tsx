import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

interface PublicRouteProps {
  children: ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuth } = useAuth();

  if (isAuth) {
    return <Navigate to="/home" />;
  }

  return <>{children}</>;
};
