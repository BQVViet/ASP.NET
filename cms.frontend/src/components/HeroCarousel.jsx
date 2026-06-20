import React, { useEffect, useState } from 'react';
import { Carousel, Spinner, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getPosts } from '../services/blogService';

function HeroCarousel() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts(3)
      .then(res => setPosts(res)) // Lấy 3 bài mới nhất làm slider thông qua API
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh', backgroundColor: '#f4f6f9' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // Fallback nếu chưa có bài viết nào trong DB
  const slides = posts.length > 0 ? posts : [
    { id: 'default', title: 'XTRA Series 9 - Đỉnh Cao Công Nghệ', content: 'Khám phá thế hệ đồng hồ thông minh mới nhất với viền màn hình siêu mỏng, cảm biến nhịp tim chính xác và thời lượng pin lên đến 7 ngày.', imageUrl: '/smartwatch_hero.png' }
  ];

  // Hàm để lột bỏ các thẻ HTML (như <p>, <b>...) trước khi hiển thị
  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '');
  };

  return (
    <Carousel fade interval={5000} className="shadow-sm">
      {slides.map((post, idx) => {
        const plainText = stripHtml(post.content);
        return (
        <Carousel.Item key={post.id || idx} style={{ backgroundColor: idx % 2 === 0 ? '#f4f6f9' : '#eef2f5', minHeight: '70vh' }}>
          <div className="d-flex align-items-center w-100" style={{ minHeight: '70vh' }}>
            <Container className="py-5">
              <Row className="align-items-center">
                <Col lg={6} className="mb-5 mb-lg-0 text-center text-lg-start animate-fade-in">
                  <span className="badge bg-primary text-white rounded-pill px-3 py-2 mb-3 shadow-sm" style={{ letterSpacing: '1px' }}>
                    <i className="fas fa-star text-warning me-1"></i> {idx === 0 ? 'MỚI NHẤT' : 'TIN NỔI BẬT'}
                  </span>
                  <h1 className="display-4 fw-bold mb-3 text-dark">
                    {post.title}
                  </h1>
                  <p className="lead text-secondary mb-4 pe-lg-4" style={{ lineHeight: '1.6', fontSize: '1rem' }}>
                    {plainText ? (plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText) : 'Cập nhật tin tức và khuyến mãi hấp dẫn nhất từ XTRA.'}
                  </p>
                  <div className="d-flex justify-content-center justify-content-lg-start gap-3">
                    <Link to={post.id && post.id !== 'default' ? `/blog/${post.id}` : "/blog"} className="btn btn-primary btn-lg rounded-pill px-4 fw-bold shadow">
                      Đọc Bài Viết
                    </Link>
                    <Link to="/products" className="btn btn-outline-dark btn-lg rounded-pill px-4 fw-bold">
                      Mua Đồng Hồ
                    </Link>
                  </div>
                </Col>
                <Col lg={6} className="text-center animate-fade-in mt-5 mt-lg-0" style={{ animationDelay: '0.3s' }}>
                  <div className="position-relative d-inline-flex justify-content-center align-items-center">
                    {/* Vòng tròn nền trang trí mờ ảo (Glow effect) */}
                    <div className="position-absolute top-50 start-50 translate-middle rounded-circle" 
                         style={{ width: '380px', height: '380px', background: 'linear-gradient(135deg, #c7d2fe 0%, #e0e7ff 100%)', zIndex: 0, filter: 'blur(40px)', opacity: 0.7 }}>
                    </div>
                    
                    {/* Khung ảnh chính (Premium Card) */}
                    <div className="position-relative bg-white p-3 rounded-4 shadow-lg" 
                         style={{ zIndex: 1, border: '1px solid rgba(255,255,255,0.8)', transform: 'translateY(-10px)' }}>
                      <img
                        src={post.imageUrl || "/smartwatch_hero.png"}
                        alt={post.title}
                        className="img-fluid rounded-3"
                        style={{ width: '420px', height: '300px', objectFit: 'contain' }}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </Carousel.Item>
        );
      })}
    </Carousel>
  );
}

export default HeroCarousel;
