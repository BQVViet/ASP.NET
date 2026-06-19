// src/components/CategoryProductList.tsx
import React, { useEffect, useState } from 'react';
import { getCategoriesProducts } from '../services/categoryProductService';
import { Card, Row, Col, Spinner } from 'react-bootstrap';

function CategoryProductList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCategoriesProducts()
      .then(res => setData(res))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }
  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {data.map(cat => (
        <Col key={cat.id}>
          <Card className="h-100">
            {cat.imageUrl && <Card.Img variant="top" src={cat.imageUrl} />}
            <Card.Body>
              <Card.Title>{cat.name}</Card.Title>
              <Row xs={2} className="g-2">
                {cat.products.slice(0, 4).map(prod => (
                  <Col key={prod.id} className="mb-4">
                    <Card className="h-100 border-0 text-center p-3 shadow-sm" style={{ borderRadius: '20px' }}>
                      <div className="img-wrapper mx-auto mt-2 position-relative">
                        {prod.imageUrl ? (
                          <img src={prod.imageUrl} alt={prod.name} className="img-fluid" style={{ maxHeight: '140px', objectFit: 'contain', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))' }} />
                        ) : (
                          <div className="text-muted text-center w-100 h-100 d-flex align-items-center justify-content-center">No Image</div>
                        )}
                        {/* Mock discount badge for some products */}
                        {prod.id % 2 === 0 && (
                          <span className="position-absolute top-0 start-0 translate-middle badge rounded-pill" style={{ backgroundColor: '#0dcaf0', fontSize: '0.7rem' }}>
                            -20%
                          </span>
                        )}
                      </div>
                      <Card.Body className="p-0 mt-3 d-flex flex-column">
                        <Card.Title className="mb-1" style={{ fontSize: '1rem' }}>{prod.name}</Card.Title>
                        <div className="rating-stars mb-2">
                          <i className="fas fa-star text-warning" style={{ fontSize: '0.7rem' }}></i>
                          <i className="fas fa-star text-warning" style={{ fontSize: '0.7rem' }}></i>
                          <i className="fas fa-star text-warning" style={{ fontSize: '0.7rem' }}></i>
                          <i className="fas fa-star text-warning" style={{ fontSize: '0.7rem' }}></i>
                          <i className="fas fa-star-half-alt text-warning" style={{ fontSize: '0.7rem' }}></i>
                        </div>
                        <div className="mt-auto">
                          <p className="fw-bold mb-3">{prod.price.toLocaleString('vi-VN')}₫</p>
                          <button className="btn btn-primary w-100 rounded-pill py-2" style={{ fontSize: '0.9rem', fontWeight: '600' }} onClick={(e) => { e.preventDefault(); /* addToCart logic here */ }}>
                            <i className="fas fa-shopping-cart me-2"></i> Add to cart
                          </button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default CategoryProductList;
