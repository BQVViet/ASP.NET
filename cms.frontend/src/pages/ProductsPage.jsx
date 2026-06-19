import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Spinner } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { getAllProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);

  useEffect(() => {
    const currentSearch = new URLSearchParams(location.search).get('search');
    if (currentSearch !== null) {
      setSearchQuery(currentSearch);
    }
  }, [location.search]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(50000000); // 50 million VND default max
  const [sortBy, setSortBy] = useState('newest');

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

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (loading) {
    return (
      <div className="bg-light py-5 text-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-light py-5 text-center" style={{ minHeight: '80vh' }}>
        <div className="alert alert-danger d-inline-block">Lỗi: {error}</div>
      </div>
    );
  }

  // Filter Logic
  let filteredProducts = products.filter(p => {
    // 1. Search Query
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    // 2. Category
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.categoryProductId)) return false;
    // 3. Price
    if (p.price > maxPrice) return false;
    return true;
  });

  // Sort Logic
  filteredProducts.sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    // 'newest' (assuming id is auto-increment, higher id = newer)
    return b.id - a.id;
  });

  return (
    <div className="bg-light py-4" style={{ minHeight: '80vh' }}>
      <Container>
        {/* Breadcrumb / Title */}


        <Row>
          {/* LEFT SIDEBAR - FILTERS */}
          <Col lg={3} className="mb-4">
            <div className="bg-white p-4 rounded shadow-sm border border-light sticky-lg-top" style={{ top: '120px' }}>
              <h5 className="fw-bold mb-4 border-bottom pb-2">Bộ Lọc Tìm Kiếm</h5>

              {/* Search */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Tên sản phẩm</h6>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-pill"
                />
              </div>

              {/* Categories */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Danh Mục</h6>
                {categories.map(cat => (
                  <Form.Check
                    key={cat.id}
                    type="checkbox"
                    id={`cat-${cat.id}`}
                    label={cat.name}
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => handleCategoryChange(cat.id)}
                    className="mb-2 text-muted"
                  />
                ))}
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Mức Giá</h6>
                <Form.Label className="text-muted small">
                  Từ 0đ đến {new Intl.NumberFormat('vi-VN').format(maxPrice)}đ
                </Form.Label>
                <Form.Range
                  min={0}
                  max={50000000}
                  step={1000000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.75rem' }}>
                  <span>0đ</span>
                  <span>50Tr</span>
                </div>
              </div>

              {/* Reset Button */}
              <button
                className="btn btn-outline-danger w-100 rounded-pill mt-2"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategories([]);
                  setMaxPrice(50000000);
                  setSortBy('newest');
                }}
              >
                Xóa Bộ Lọc
              </button>
            </div>
          </Col>

          {/* RIGHT CONTENT - PRODUCTS */}
          <Col lg={9}>
            {/* Top Bar */}
            <div className="bg-white p-3 rounded shadow-sm border border-light mb-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
              <span className="text-muted mb-2 mb-md-0">
                Đang hiển thị <strong className="text-primary">{filteredProducts.length}</strong> sản phẩm
              </span>
              <div className="d-flex align-items-center">
                <span className="me-2 text-muted text-nowrap">Sắp xếp:</span>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-pill shadow-none"
                  style={{ minWidth: '180px' }}
                >
                  <option value="newest">Mới Nhất</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                </Form.Select>
              </div>
            </div>

            {/* Grid */}
            {filteredProducts.length > 0 ? (
              <Row xs={1} md={2} xl={3} className="g-4">
                {filteredProducts.map(product => (
                  <Col key={product.id}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="bg-white p-5 rounded shadow-sm text-center">
                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                <h4 className="fw-bold">Không tìm thấy sản phẩm nào</h4>
                <p className="text-muted">Vui lòng thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ProductsPage;
