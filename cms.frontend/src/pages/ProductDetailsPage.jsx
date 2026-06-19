import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Badge } from 'react-bootstrap';
import { getProductById } from '../services/productService';
import { useCart } from '../context/CartContext';

function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then(res => setProduct(res))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-5 my-5"><Spinner animation="border" variant="primary" /></div>;
  if (error || !product) return <div className="text-center py-5 my-5 text-danger">Lỗi: {error || 'Không tìm thấy sản phẩm'}</div>;

  return (
    <div className="bg-light py-5" style={{ minHeight: '80vh' }}>
      <Container>
        {/* Breadcrumb */}
        <div className="mb-4">
          <Link to="/" className="text-muted text-decoration-none">Trang chủ</Link>
          <span className="text-muted mx-2">/</span>
          <Link to="/products" className="text-muted text-decoration-none">Sản Phẩm</Link>
          <span className="text-muted mx-2">/</span>
          <span className="text-dark fw-bold">{product.name}</span>
        </div>

        <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light mb-5">
          <Row className="align-items-center">
            {/* Left Col: Image */}
            <Col lg={6} className="mb-5 mb-lg-0 text-center">
              <div className="p-5 bg-light rounded-circle d-inline-block position-relative">
                {product.id % 2 === 0 && (
                  <Badge bg="danger" className="position-absolute top-0 start-0 translate-middle p-2 rounded-circle border border-white" style={{ fontSize: '1rem' }}>
                    -20%
                  </Badge>
                )}
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="img-fluid" 
                    style={{ maxHeight: '400px', objectFit: 'contain', filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.15))', mixBlendMode: 'multiply' }} 
                  />
                ) : (
                  <img 
                    src="/smartwatch_hero.png" 
                    alt="Default Product" 
                    className="img-fluid" 
                    style={{ maxHeight: '400px', objectFit: 'contain', filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.15))', mixBlendMode: 'multiply', opacity: 0.5 }} 
                  />
                )}
              </div>
            </Col>

            {/* Right Col: Details */}
            <Col lg={6}>
              {product.categoryProduct && (
                <span className="text-primary fw-bold text-uppercase" style={{ letterSpacing: '2px', fontSize: '0.9rem' }}>
                  {product.categoryProduct.name}
                </span>
              )}
              <h1 className="fw-bold display-5 mt-2 mb-3 text-dark">{product.name}</h1>
              
              <div className="d-flex align-items-center mb-4">
                <div className="rating-stars text-warning me-2" style={{ fontSize: '1.2rem' }}>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                </div>
                <span className="text-muted">(128 đánh giá)</span>
              </div>

              <h2 className="text-primary fw-bold display-6 mb-4">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
              </h2>

              <p className="lead text-secondary mb-5" style={{ lineHeight: '1.8' }}>
                Đồng hồ thông minh cao cấp với thiết kế sang trọng, tích hợp nhiều tính năng theo dõi sức khỏe chuyên sâu, đo nhịp tim, SpO2, theo dõi giấc ngủ và đa dạng chế độ tập luyện thể thao.
              </p>

              <div className="d-flex gap-3">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="rounded-pill px-5 fw-bold shadow-sm d-flex align-items-center"
                  onClick={() => addToCart(product)}
                >
                  <i className="fas fa-cart-plus me-2"></i> THÊM VÀO GIỎ HÀNG
                </Button>
                <Button variant="outline-dark" size="lg" className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                  <i className="far fa-heart"></i>
                </Button>
              </div>

              <hr className="my-5" />

              <ul className="list-unstyled text-muted">
                <li className="mb-3"><i className="fas fa-truck text-primary me-3" style={{ width: '20px' }}></i> Giao hàng miễn phí toàn quốc</li>
                <li className="mb-3"><i className="fas fa-shield-alt text-success me-3" style={{ width: '20px' }}></i> Bảo hành chính hãng 12 tháng</li>
                <li><i className="fas fa-undo text-danger me-3" style={{ width: '20px' }}></i> Đổi trả dễ dàng trong 7 ngày</li>
              </ul>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}

export default ProductDetailsPage;
