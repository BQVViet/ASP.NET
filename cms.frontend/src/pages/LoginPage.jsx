import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/'); // redirect to home on success
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light py-5" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <div className="bg-white p-5 rounded-4 shadow-sm border border-light text-center">
              <div className="mb-4">
                <i className="fas fa-stopwatch text-primary mb-3" style={{ fontSize: '3rem' }}></i>
                <h2 className="fw-bold text-dark">Đăng Nhập</h2>
                <p className="text-muted">Chào mừng trở lại XTRA Store</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3 text-start">
                  <Form.Label className="fw-bold text-muted small">Tài khoản</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Nhập tên tài khoản" 
                    className="p-3 bg-light border-0 rounded-3" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4 text-start">
                  <Form.Label className="fw-bold text-muted small">Mật khẩu</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Nhập mật khẩu" 
                    className="p-3 bg-light border-0 rounded-3" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Form.Check type="checkbox" label="Ghi nhớ đăng nhập" className="text-muted small" />
                  <a href="#" className="text-primary small text-decoration-none fw-bold">Quên mật khẩu?</a>
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-100 rounded-pill fw-bold shadow-sm mb-3" disabled={loading}>
                  {loading ? 'Đang xử lý...' : 'Đăng Nhập'} <i className="fas fa-sign-in-alt ms-2"></i>
                </Button>

                <Button variant="outline-dark" size="lg" className="w-100 rounded-pill fw-bold mb-4 d-flex align-items-center justify-content-center gap-2">
                  <i className="fab fa-google text-danger"></i> Đăng nhập với Google
                </Button>

                <p className="text-muted small mb-0">
                  Chưa có tài khoản? <a href="#" className="text-primary text-decoration-none fw-bold">Đăng ký ngay</a>
                </p>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LoginPage;
