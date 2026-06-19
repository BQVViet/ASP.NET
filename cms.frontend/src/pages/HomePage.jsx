import React from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductList from '../components/ProductList';
function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section" style={{ backgroundColor: '#f4f6f9', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0 text-center text-lg-start animate-fade-in">
              <span className="badge bg-primary text-white rounded-pill px-3 py-2 mb-3 shadow-sm" style={{ letterSpacing: '1px' }}>
                <i className="fas fa-star text-warning me-1"></i> BÁN CHẠY NHẤT 2026
              </span>
              <h1 className="display-3 fw-bold mb-3 text-dark">
                XTRA <span className="text-primary">Series 9</span>
              </h1>
              <p className="lead text-secondary mb-4 pe-lg-5" style={{ lineHeight: '1.8' }}>
                Khám phá thế hệ đồng hồ thông minh mới nhất với viền màn hình siêu mỏng, cảm biến nhịp tim chính xác và thời lượng pin lên đến 7 ngày sử dụng liên tục.
              </p>
              <div className="d-flex justify-content-center justify-content-lg-start gap-3">
                <Link to="/products" className="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow">
                  Mua Ngay
                </Link>
                <Link to="/about" className="btn btn-outline-dark btn-lg rounded-pill px-4 fw-bold">
                  Khám Phá Thêm
                </Link>
              </div>
            </Col>
            <Col lg={6} className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="position-relative d-inline-block">
                {/* Decorative circle behind image */}
                <div className="position-absolute top-50 start-50 translate-middle rounded-circle bg-white shadow-sm" style={{ width: '380px', height: '380px', zIndex: 0 }}></div>
                <img 
                  src="/smartwatch_hero.png" 
                  alt="XTRA Series 9" 
                  className="img-fluid position-relative"
                  style={{ maxHeight: '500px', objectFit: 'contain', zIndex: 1, mixBlendMode: 'multiply' }} 
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Trust Badges */}
      <Container className="mb-5 pb-2">
        <Row className="text-center g-3">
          <Col md={3} xs={6}>
            <div className="p-4 border border-light rounded bg-white shadow-sm h-100 d-flex flex-column align-items-center justify-content-center transition-hover">
              <i className="fas fa-truck fs-1 text-primary mb-3"></i>
              <h6 className="fw-bold mb-1">Miễn Phí Vận Chuyển</h6>
              <small className="text-muted">Đơn hàng từ 500k</small>
            </div>
          </Col>
          <Col md={3} xs={6}>
            <div className="p-4 border border-light rounded bg-white shadow-sm h-100 d-flex flex-column align-items-center justify-content-center transition-hover">
              <i className="fas fa-shield-alt fs-1 text-success mb-3"></i>
              <h6 className="fw-bold mb-1">Bảo Hành 12 Tháng</h6>
              <small className="text-muted">Chính hãng 100%</small>
            </div>
          </Col>
          <Col md={3} xs={6}>
            <div className="p-4 border border-light rounded bg-white shadow-sm h-100 d-flex flex-column align-items-center justify-content-center transition-hover">
              <i className="fas fa-undo fs-1 text-danger mb-3"></i>
              <h6 className="fw-bold mb-1">Đổi Trả Dễ Dàng</h6>
              <small className="text-muted">Trong vòng 7 ngày</small>
            </div>
          </Col>
          <Col md={3} xs={6}>
            <div className="p-4 border border-light rounded bg-white shadow-sm h-100 d-flex flex-column align-items-center justify-content-center transition-hover">
              <i className="fas fa-headset fs-1 text-info mb-3"></i>
              <h6 className="fw-bold mb-1">Hỗ Trợ 24/7</h6>
              <small className="text-muted">Luôn bên bạn</small>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Main Products Area */}
      <Container id="collections" className="mb-5">
        <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-3">
          <h3 className="fw-bold mb-0 text-dark">
            <i className="fas fa-fire text-danger me-2"></i>Sản Phẩm Nổi Bật
          </h3>
          <a href="#" className="text-decoration-none text-primary fw-bold" style={{ fontSize: '0.9rem' }}>
            Xem tất cả <i className="fas fa-arrow-right ms-1"></i>
          </a>
        </div>
        <ProductList />
      </Container>

    </div>
  );
}

export default HomePage;
