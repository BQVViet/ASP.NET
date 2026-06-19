import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

function ContactPage() {
  return (
    <div className="bg-light py-5" style={{ minHeight: '80vh' }}>
      <Container>


        <Row className="g-5">
          <Col lg={5}>
            <div className="bg-white p-5 rounded-4 shadow-sm border border-light h-100">
              <h3 className="fw-bold mb-4">Thông Tin Liên Hệ</h3>

              <div className="d-flex mb-4">
                <div className="icon-circle bg-light text-primary flex-shrink-0" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="ms-3">
                  <h6 className="fw-bold mb-1">Địa Chỉ</h6>
                  <p className="text-muted mb-0">123 Đường Công Nghệ, Quận 1, TP. Hồ Chí Minh</p>
                </div>
              </div>

              <div className="d-flex mb-4">
                <div className="icon-circle bg-light text-primary flex-shrink-0" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div className="ms-3">
                  <h6 className="fw-bold mb-1">Điện Thoại</h6>
                  <p className="text-muted mb-0">+84 123 456 789 (Hỗ trợ miễn phí)</p>
                </div>
              </div>

              <div className="d-flex mb-4">
                <div className="icon-circle bg-light text-primary flex-shrink-0" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="ms-3">
                  <h6 className="fw-bold mb-1">Email</h6>
                  <p className="text-muted mb-0">support@xtrastore.com</p>
                </div>
              </div>

              <hr className="my-4" />

              <h6 className="fw-bold mb-3">Kết Nối Với Chúng Tôi</h6>
              <div className="d-flex gap-2">
                <a href="#" className="icon-circle bg-light text-primary shadow-sm text-decoration-none" style={{ width: '40px', height: '40px', fontSize: '1rem' }}><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="icon-circle bg-light text-info shadow-sm text-decoration-none" style={{ width: '40px', height: '40px', fontSize: '1rem' }}><i className="fab fa-twitter"></i></a>
                <a href="#" className="icon-circle bg-light text-danger shadow-sm text-decoration-none" style={{ width: '40px', height: '40px', fontSize: '1rem' }}><i className="fab fa-instagram"></i></a>
              </div>
            </div>
          </Col>

          <Col lg={7}>
            <div className="bg-white p-5 rounded-4 shadow-sm border border-light h-100">
              <h3 className="fw-bold mb-4">Gửi Lời Nhắn</h3>
              <Form>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-bold text-muted small">Họ và Tên</Form.Label>
                      <Form.Control type="text" placeholder="Nhập tên của bạn" className="p-3 bg-light border-0" />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label className="fw-bold text-muted small">Email</Form.Label>
                      <Form.Control type="email" placeholder="Nhập email" className="p-3 bg-light border-0" />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-muted small">Chủ Đề</Form.Label>
                  <Form.Control type="text" placeholder="Chủ đề bạn muốn thảo luận" className="p-3 bg-light border-0" />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold text-muted small">Lời Nhắn</Form.Label>
                  <Form.Control as="textarea" rows={5} placeholder="Nhập chi tiết lời nhắn..." className="p-3 bg-light border-0" />
                </Form.Group>
                <Button variant="primary" size="lg" className="rounded-pill px-5 fw-bold shadow-sm">
                  Gửi Tin Nhắn <i className="fas fa-paper-plane ms-2"></i>
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ContactPage;
