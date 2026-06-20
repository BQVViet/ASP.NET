import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from 'react-bootstrap';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!user) {
    // Chuyển hướng người dùng về trang đăng nhập, và lưu lại trang họ muốn vào
    return <Navigate to="/login" state={{ from: location, message: "Vui lòng đăng nhập để tiếp tục truy cập!" }} replace />;
  }

  return children;
}

export default PrivateRoute;
