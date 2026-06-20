import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      return setError('Mật khẩu nhập lại không khớp!');
    }
    
    setLoading(true);
    try {
      if (register) {
        await register(name, username, email, password);
      }
      // Sau khi đăng ký thành công, chuyển hướng về trang đăng nhập
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate('/login');
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
                <i className="fas fa-user-plus text-primary mb-3" style={{ fontSize: '3rem' }}></i>
                <h2 className="fw-bold text-dark">Đăng Ký</h2>
                <p className="text-muted">Tạo tài khoản mới tại XTRA Store</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3 text-start">
                  <Form.Label className="fw-bold text-muted small">Họ và tên</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Nhập họ và tên" 
                    className="p-3 bg-light border-0 rounded-3" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3 text-start">
                  <Form.Label className="fw-bold text-muted small">Tên đăng nhập</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Nhập tên đăng nhập" 
                    className="p-3 bg-light border-0 rounded-3" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3 text-start">
                  <Form.Label className="fw-bold text-muted small">Email (Không bắt buộc)</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Nhập địa chỉ email" 
                    className="p-3 bg-light border-0 rounded-3" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3 text-start">
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

                <Form.Group className="mb-4 text-start">
                  <Form.Label className="fw-bold text-muted small">Nhập lại mật khẩu</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Nhập lại mật khẩu" 
                    className="p-3 bg-light border-0 rounded-3" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button type="submit" variant="primary" size="lg" className="w-100 rounded-pill fw-bold shadow-sm mb-4" disabled={loading}>
                  {loading ? 'Đang xử lý...' : 'Đăng Ký'} <i className="fas fa-arrow-right ms-2"></i>
                </Button>

                <p className="text-muted small mb-0">
                  Đã có tài khoản? <Link to="/login" className="text-primary text-decoration-none fw-bold">Đăng nhập</Link>
                </p>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default RegisterPage;
