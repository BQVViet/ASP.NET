import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductList from '../components/ProductList';
import HeroCarousel from '../components/HeroCarousel';
import PostList from '../components/PostList';

function HomePage() {
  return (
    <div>
      {/* Dynamic Hero Carousel displaying Blog Posts */}
      <HeroCarousel />

      {/* Trust Badges */}
      <Container className="my-5 pb-2">
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

      {/* Latest Blog Posts Area */}
      <Container id="latest-posts" className="mb-5">
        <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-3">
          <h3 className="fw-bold mb-0 text-dark">
            <i className="fas fa-newspaper text-primary me-2"></i>Bài Viết Mới Nhất
          </h3>
          <Link to="/blog" className="text-decoration-none text-primary fw-bold" style={{ fontSize: '0.9rem' }}>
            Xem tất cả <i className="fas fa-arrow-right ms-1"></i>
          </Link>
        </div>
        <PostList limit={3} />
      </Container>

    </div>
  );
}

export default HomePage;
