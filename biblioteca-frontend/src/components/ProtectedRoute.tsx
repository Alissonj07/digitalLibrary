'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CircularProgress, Box } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { Permissao } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: Permissao;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission 
}) => {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!token || !user) {
        router.push('/login');
        return;
      }

      if (requiredPermission && user.permissao !== requiredPermission) {
        router.push('/dashboard');
        return;
      }
    }
  }, [user, token, isLoading, requiredPermission, router]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!token || !user) {
    return null;
  }

  if (requiredPermission && user.permissao !== requiredPermission) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
