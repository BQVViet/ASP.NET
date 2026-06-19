// src/components/ProductList.jsx
import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../services/productService';
import { Row, Col, Spinner } from 'react-bootstrap';
import ProductCard from './ProductCard';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllProducts()
      .then(res => {
        setProducts(res);
        const uniqueCategories = [];
        const map = new Map();
        res.forEach(item => {
          if (item.categoryProduct && !map.has(item.categoryProduct.id)) {
            map.set(item.categoryProduct.id, true);
            uniqueCategories.push(item.categoryProduct);
          }
        });
        setCategories(uniqueCategories);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }
  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  const filteredProducts = selectedCategory 
    ? products.filter(p => p.categoryProductId === selectedCategory)
    : products;

  return (
    <div>
      {/* Category Tabs */}
      {categories.length > 0 && (
        <ul className="nav nav-pills mb-4 justify-content-center">
          <li className="nav-item me-2">
            <button 
              className={`nav-link btn-outline-primary px-4 py-2 ${selectedCategory === null ? 'active' : ''}`}
              onClick={() => setSelectedCategory(null)}
              style={{ borderRadius: '0' }}
            >
              TẤT CẢ
            </button>
          </li>
          {categories.map(cat => (
            <li className="nav-item me-2 mb-2" key={cat.id}>
              <button 
                className={`nav-link btn-outline-primary px-4 py-2 ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
                style={{ borderRadius: '0' }}
              >
                {cat.name.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Products Grid */}
      <Row xs={1} md={2} lg={4} className="g-4">
        {filteredProducts.map(product => (
          <Col key={product.id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
      
      {filteredProducts.length === 0 && (
        <div className="text-center mt-5 text-muted">
          <p>Không có sản phẩm nào trong danh mục này.</p>
        </div>
      )}
    </div>
  );
}

export default ProductList;
