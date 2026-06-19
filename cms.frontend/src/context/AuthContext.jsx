import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('xtra_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username, password) => {
    // Mock login logic
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username && password) {
          const mockUser = {
            id: 1,
            name: username, // Use username as name for now
            username: username,
            role: username === 'hoan' ? 'Admin' : 'User'
          };
          setUser(mockUser);
          localStorage.setItem('xtra_user', JSON.stringify(mockUser));
          resolve(mockUser);
        } else {
          reject(new Error("Vui lòng nhập đầy đủ tài khoản và mật khẩu"));
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('xtra_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
