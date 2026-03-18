import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/notifications');
      setNotifications(data.notifications || []);
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('tutorapp_token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/auth/me')
        .then(({ data }) => {
          setUser(data.user);
          loadNotifications();
        })
        .catch(() => {
          localStorage.removeItem('tutorapp_token');
          delete api.defaults.headers.common['Authorization'];
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [loadNotifications]);

  // Poll notifications every 30s when logged in
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [user, loadNotifications]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('tutorapp_token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
    await loadNotifications();
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('tutorapp_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setNotifications([]);
  };

  const markNotificationsRead = async () => {
    try {
      await api.put('/auth/notifications/read');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch {}
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <AuthContext.Provider value={{
      user, loading, login, logout,
      notifications, unreadCount,
      markNotificationsRead, loadNotifications
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
