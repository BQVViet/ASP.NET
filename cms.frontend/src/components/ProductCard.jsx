// src/components/ProductCard.jsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <Card className="h-100 border-0 text-center p-3">
      <div className="img-wrapper position-relative">
        <Link to={`/product/${product.id}`}>
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="img-fluid transition-hover" 
              style={{ maxHeight: '140px', objectFit: 'contain', mixBlendMode: 'darken' }} 
            />
          ) : (
            <img 
              src="/smartwatch_hero.png" 
              alt="Default Product" 
              className="img-fluid transition-hover" 
              style={{ maxHeight: '140px', objectFit: 'contain', mixBlendMode: 'darken', opacity: 0.5 }} 
            />
          )}
        </Link>
        {/* Mock discount badge for some products */}
        {product.id % 2 === 0 && (
          <span className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-primary" style={{ fontSize: '0.7rem' }}>
            -20%
          </span>
        )}
      </div>
      <Card.Body className="d-flex flex-column p-0">
        <Link to={`/product/${product.id}`} className="text-decoration-none">
          <Card.Title className="mb-2 text-dark transition-hover">{product.name}</Card.Title>
        </Link>
        <div className="rating-stars">
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star"></i>
          <i className="fas fa-star-half-alt"></i>
        </div>
        <div className="mt-auto pt-2">
          <h5 className="fw-bold mb-3">{product.price.toLocaleString('vi-VN')}₫</h5>
          <Button variant="primary" className="w-100 d-flex align-items-center justify-content-center" onClick={() => addToCart(product)}>
            <i className="fas fa-shopping-cart me-2"></i> Thêm vào giỏ
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
