import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext<null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { accessToken, setAccessToken, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/users/refresh-token', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Token refresh failed');
        }

        const data = await response.json();
        if (data.accessToken) {
          setAccessToken(data.accessToken);
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        logout();
        navigate('/login');
      }
    };

    // Refresh token when component mounts
    refreshAccessToken();

    // Set up periodic token refresh (every 14 minutes)
    const intervalId = setInterval(refreshAccessToken, 14 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [accessToken, setAccessToken, logout, navigate]);

  return (
    <AuthContext.Provider value={null}>
      {children}
    </AuthContext.Provider>
  );
}