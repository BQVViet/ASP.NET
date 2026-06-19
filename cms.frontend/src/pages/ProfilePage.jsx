import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function ProfilePage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) {
    return (
      <div className="bg-light py-5 text-center" style={{ minHeight: '80vh' }}>
        <Container>
          <div className="bg-white p-5 rounded shadow-sm d-inline-block">
            <h4 className="fw-bold mb-3">Vui lòng đăng nhập</h4>
            <p className="text-muted mb-4">Bạn cần đăng nhập để xem thông tin tài khoản.</p>
            <Link to="/login" className="btn btn-primary px-4 py-2 rounded-pill">Đăng nhập ngay</Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-light py-5" style={{ minHeight: '80vh' }}>
      <Container>
        {/* Breadcrumb / Title */}


        <Row>
          {/* Sidebar */}
          <Col lg={3} className="mb-4">
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="bg-primary text-white p-4 text-center">
                <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto fw-bold shadow-sm mb-3" style={{ width: '80px', height: '80px', fontSize: '2.5rem' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h5 className="fw-bold mb-1">{user.name}</h5>
                <p className="mb-0 text-white-50 small"><i className="fas fa-shield-alt me-1"></i> {user.role}</p>
              </div>
              <ListGroup variant="flush">
                <ListGroup.Item
                  action
                  className={`py-3 px-4 fw-medium ${activeTab === 'profile' ? 'text-primary bg-light border-start border-primary border-4' : 'text-dark border-start border-transparent border-4'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <i className="fas fa-user me-3 text-muted"></i> Hồ Sơ
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  as={Link}
                  to="/orders"
                  className="py-3 px-4 fw-medium text-dark border-start border-transparent border-4"
                >
                  <i className="fas fa-box me-3 text-muted"></i> Đơn Mua
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  className={`py-3 px-4 fw-medium ${activeTab === 'settings' ? 'text-primary bg-light border-start border-primary border-4' : 'text-dark border-start border-transparent border-4'}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <i className="fas fa-cog me-3 text-muted"></i> Cài Đặt
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  className="py-3 px-4 fw-medium text-danger border-start border-transparent border-4"
                  onClick={logout}
                >
                  <i className="fas fa-sign-out-alt me-3"></i> Đăng Xuất
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>

          {/* Main Content */}
          <Col lg={9}>
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-5">
                <h4 className="fw-bold mb-4 border-bottom pb-3">Hồ Sơ Của Tôi</h4>

                <Row>
                  <Col md={8}>
                    <Form>
                      <Form.Group className="mb-4" controlId="formBasicName">
                        <Form.Label className="text-muted small fw-bold text-uppercase">Tên Đăng Nhập</Form.Label>
                        <Form.Control type="text" value={user.name} disabled className="bg-light border-0" />
                        <Form.Text className="text-muted">
                          Tên đăng nhập không thể thay đổi.
                        </Form.Text>
                      </Form.Group>

                      <Form.Group className="mb-4" controlId="formBasicEmail">
                        <Form.Label className="text-muted small fw-bold text-uppercase">Email</Form.Label>
                        <Form.Control type="email" value={user.email || `${user.name}@example.com`} disabled className="bg-light border-0" />
                      </Form.Group>

                      <Form.Group className="mb-4" controlId="formBasicPhone">
                        <Form.Label className="text-muted small fw-bold text-uppercase">Số Điện Thoại</Form.Label>
                        <Form.Control type="text" placeholder="Thêm số điện thoại" className="border-light" />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label className="text-muted small fw-bold text-uppercase d-block">Giới Tính</Form.Label>
                        <Form.Check inline label="Nam" name="gender" type="radio" id="gender-male" defaultChecked />
                        <Form.Check inline label="Nữ" name="gender" type="radio" id="gender-female" />
                        <Form.Check inline label="Khác" name="gender" type="radio" id="gender-other" />
                      </Form.Group>

                      <Button variant="primary" className="px-5 py-2 rounded-pill fw-bold shadow-sm mt-3">
                        Lưu Thay Đổi
                      </Button>
                    </Form>
                  </Col>

                  <Col md={4} className="d-flex flex-column align-items-center justify-content-center border-start mt-4 mt-md-0 pt-4 pt-md-0">
                    <div className="bg-light text-secondary rounded-circle d-flex align-items-center justify-content-center fw-bold mb-3 shadow-sm" style={{ width: '120px', height: '120px', fontSize: '3.5rem' }}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <Button variant="outline-secondary" size="sm" className="rounded-pill px-4 fw-medium mt-2">Chọn Ảnh</Button>
                    <p className="text-muted mt-3 text-center" style={{ fontSize: '0.75rem' }}>
                      Dụng lượng file tối đa 1 MB<br />Định dạng: .JPEG, .PNG
                    </p>
                  </Col>
                </Row>

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ProfilePage;
