import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getCookie } from '../services/cookiesManager';

interface PrivateRouteProps {
  children: ReactNode; 
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = getCookie('token');
  if (!token) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};
