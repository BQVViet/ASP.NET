import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount and refresh from API
  useEffect(() => {
    const storedUser = localStorage.getItem('xtra_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser); // Set immediately for fast UI
      
      // Fetch fresh data in background
      if (parsedUser.id) {
        fetch(`https://localhost:7199/api/auth/profile/${parsedUser.id}`)
          .then(res => res.json())
          .then(freshUser => {
            if (freshUser && freshUser.id) {
              setUser(freshUser);
              localStorage.setItem('xtra_user', JSON.stringify(freshUser));
            }
          })
          .catch(err => console.error("Could not fetch fresh user data", err))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('https://localhost:7199/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi đăng nhập");
      }

      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('xtra_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('xtra_user');
  };

  const register = async (name, username, email, password) => {
    try {
      const response = await fetch('https://localhost:7199/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName: name, username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi đăng ký");
      }

      return true;
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (id, formData) => {
    try {
      const response = await fetch(`https://localhost:7199/api/auth/update-profile/${id}`, {
        method: 'POST',
        body: formData, // Không set Content-Type, trình duyệt tự sinh boundary cho multipart/form-data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi cập nhật hồ sơ");
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('xtra_user', JSON.stringify(data.user));
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
