import { createContext, useContext, useState, useEffect } from 'react';
import { refresh } from './Api';
import jwt_decode from 'jwt-decode';
import toast from 'react-hot-toast';

export const UserContext = createContext(null);

export const useUserContext = () => useContext(UserContext);

export const UserWrapper = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshToken = () => {
    // Call the API
    refresh()
      .then(response => {
        if (response.status === 200) {
          toast('Welcome back!', { icon: '👋' });
          const decoded = jwt_decode(response.data['access_token']);
          setUser({
            username: decoded.identity.username,
            role: decoded.identity.role,
            email: decoded.identity.email
          });
        }
        else if (response.status === 401) {
          // Could not authenticate.
        }
        else if (response.status === 500) {
          // Server unavailable.
        }
        else {
          // Errors
        }
      })
      .catch(error => {
        // Errors
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          refreshToken();
        }, (300 * 1000) - 500);
      });
  };

  useEffect(() => {
    refreshToken();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      { loading ? null : children}
    </UserContext.Provider >
  );
};