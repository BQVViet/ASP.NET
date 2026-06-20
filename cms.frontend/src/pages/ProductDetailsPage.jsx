import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Badge, Form, InputGroup, Tabs, Tab } from 'react-bootstrap';
import { getProductById, getAllProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Đen');
  const [selectedVersion, setSelectedVersion] = useState('Tiêu chuẩn');
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getProductById(id),
      getAllProducts()
    ])
      .then(([productData, allProductsData]) => {
        setProduct(productData);
        
        // 1. Get the first word of the product name as a keyword (e.g., "Apple", "Samsung", "Xiaomi")
        const firstWord = productData.name.split(' ')[0].toLowerCase();
        
        // Filter products that contain this keyword in their name
        let related = allProductsData.filter(p => 
          p.id.toString() !== id && 
          p.name.toLowerCase().includes(firstWord)
        );

        // 2. If NO related products found by keyword, fallback to same category
        if (related.length === 0) {
          related = allProductsData.filter(p => 
            p.id.toString() !== id && 
            p.categoryProductId === productData.categoryProductId
          );
        }

        // 3. If STILL empty, fallback to anything
        if (related.length === 0) {
          related = allProductsData.filter(p => p.id.toString() !== id);
        }

        setRelatedProducts(related.slice(0, 4));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{minHeight: '70vh'}}><Spinner animation="grow" variant="primary" /></div>;
  if (error || !product) return <Container className="py-5 text-center text-danger"><h3 className="mt-5">Lỗi: {error || 'Không tìm thấy sản phẩm'}</h3></Container>;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedVersion);
    alert(`Đã thêm ${quantity} sản phẩm (${selectedColor} - ${selectedVersion}) vào giỏ hàng!`);
  };

  const oldPrice = product.price * 1.25; // Giả lập giá cũ cao hơn 25%
  
  // Fake stock for UI testing if API returns 0
  const actualStock = product.stockQuantity > 0 ? product.stockQuantity : 100;

  return (
    <div className="bg-light py-4" style={{ minHeight: '100vh' }}>
      <Container>
        {/* Breadcrumb */}
        <div className="mb-4 small fw-medium">
          <Link to="/" className="text-decoration-none text-muted transition-hover">Trang chủ</Link>
          <span className="text-muted mx-2"><i className="fas fa-chevron-right" style={{fontSize: '0.7rem'}}></i></span>
          <Link to="/products" className="text-decoration-none text-muted transition-hover">Thiết Bị Thông Minh</Link>
          {product.categoryProduct && (
            <>
              <span className="text-muted mx-2"><i className="fas fa-chevron-right" style={{fontSize: '0.7rem'}}></i></span>
              <span className="text-muted">{product.categoryProduct.name}</span>
            </>
          )}
          <span className="text-muted mx-2"><i className="fas fa-chevron-right" style={{fontSize: '0.7rem'}}></i></span>
          <span className="text-dark">{product.name}</span>
        </div>

        {/* Main Product Info */}
        <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light mb-4">
          <Row>
            {/* Left Col: Image Gallery */}
            <Col lg={5} className="mb-5 mb-lg-0">
              <div className="position-relative border rounded-3 p-4 mb-3 bg-white d-flex align-items-center justify-content-center" style={{ aspectRatio: '1/1' }}>
                {product.id % 2 === 0 && (
                  <Badge bg="danger" className="position-absolute top-0 start-0 m-3 px-2 py-1 shadow-sm" style={{ zIndex: 10 }}>
                    GIẢM 20%
                  </Badge>
                )}
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="img-fluid" 
                    style={{ maxHeight: '100%', objectFit: 'contain', mixBlendMode: 'darken' }} 
                  />
                ) : (
                  <img 
                    src="/smartwatch_hero.png" 
                    alt="Default Product" 
                    className="img-fluid opacity-50" 
                    style={{ maxHeight: '100%', objectFit: 'contain', mixBlendMode: 'darken' }} 
                  />
                )}
              </div>
              
              {/* Fake Thumbnails for realism */}
              <Row className="g-2">
                {[1, 2, 3, 4].map((item) => (
                  <Col xs={3} key={item}>
                    <div className={`border rounded p-2 text-center cursor-pointer ${item === 1 ? 'border-primary' : ''}`} style={{aspectRatio: '1/1'}}>
                       <img 
                        src={product.imageUrl || "/smartwatch_hero.png"} 
                        alt="thumb" 
                        className="img-fluid opacity-75" 
                        style={{ maxHeight: '100%', objectFit: 'contain', mixBlendMode: 'darken' }} 
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>

            {/* Right Col: Details & Actions */}
            <Col lg={7} className="ps-lg-5">
              <div className="d-flex align-items-center mb-2 gap-2">
                <Badge bg="danger" className="rounded-1 fw-bold">Yêu Thích</Badge>
                {product.categoryProduct && <span className="text-primary fw-bold text-uppercase small">{product.categoryProduct.name}</span>}
              </div>
              
              <h1 className="fw-bold mb-3 text-dark" style={{ fontSize: '1.8rem', lineHeight: '1.4' }}>{product.name}</h1>
              
              <div className="d-flex align-items-center mb-4 pb-3 border-bottom flex-wrap gap-3">
                <div className="d-flex align-items-center">
                  <span className="text-danger fw-bold me-2 border-bottom border-danger">4.9</span>
                  <div className="rating-stars text-danger m-0" style={{ fontSize: '0.9rem' }}>
                    <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                  </div>
                </div>
                <div className="border-start ps-3"><span className="fw-bold">128</span> <span className="text-muted">Đánh giá</span></div>
                <div className="border-start ps-3"><span className="fw-bold">8.4k</span> <span className="text-muted">Đã bán</span></div>
              </div>

              {/* Price Box */}
              <div className="p-4 rounded-3 mb-4 d-flex align-items-center flex-wrap gap-3" style={{ backgroundColor: '#fafafa' }}>
                {product.id % 2 === 0 && (
                   <span className="text-muted text-decoration-line-through fs-5">
                     {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(oldPrice)}
                   </span>
                )}
                <h2 className="text-danger fw-bold mb-0 display-6">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </h2>
                {product.id % 2 === 0 && <Badge bg="danger" className="ms-2">-20%</Badge>}
              </div>

              {/* Variations */}
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <span className="text-muted" style={{ width: '100px' }}>Phiên bản</span>
                  <div className="d-flex gap-2 flex-wrap">
                    {['Tiêu chuẩn', 'Pro', 'LTE'].map(v => (
                      <Button 
                        key={v}
                        variant={selectedVersion === v ? 'outline-primary' : 'outline-secondary'} 
                        className={`rounded-1 px-3 py-1 ${selectedVersion === v ? 'border-2' : ''}`}
                        onClick={() => setSelectedVersion(v)}
                      >
                        {v}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <span className="text-muted" style={{ width: '100px' }}>Màu sắc</span>
                  <div className="d-flex gap-2 flex-wrap">
                    {['Đen', 'Bạc', 'Hồng'].map(c => (
                      <Button 
                        key={c}
                        variant={selectedColor === c ? 'outline-primary' : 'outline-secondary'} 
                        className={`rounded-1 px-3 py-1 ${selectedColor === c ? 'border-2' : ''}`}
                        onClick={() => setSelectedColor(c)}
                      >
                        {c}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="d-flex align-items-center mb-4 pb-4 border-bottom">
                <span className="text-muted" style={{ width: '100px' }}>Số lượng</span>
                <InputGroup style={{ width: '130px' }} className="me-3">
                  <Button variant="outline-secondary" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                  <Form.Control className="text-center" value={quantity} readOnly />
                  <Button variant="outline-secondary" onClick={() => setQuantity(quantity + 1)}>+</Button>
                </InputGroup>
                <span className="text-muted small">{actualStock > 0 ? `${actualStock} sản phẩm có sẵn` : 'Hết hàng'}</span>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-3 mb-4">
                <Button 
                  variant="outline-primary" 
                  size="lg" 
                  className="px-4 fw-medium d-flex align-items-center justify-content-center bg-primary bg-opacity-10"
                  onClick={handleAddToCart}
                  disabled={actualStock <= 0}
                >
                  <i className="fas fa-cart-plus me-2 fs-5"></i> Thêm Vào Giỏ Hàng
                </Button>
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="px-5 fw-bold shadow-sm"
                  disabled={actualStock <= 0}
                >
                  Mua Ngay
                </Button>
              </div>

              {/* Policies */}
              <div className="d-flex flex-wrap gap-4 pt-3 border-top small text-muted">
                <div><i className="fas fa-shield-alt text-primary me-2"></i>Bảo hành 12 tháng</div>
                <div><i className="fas fa-sync text-primary me-2"></i>Đổi trả 7 ngày</div>
                <div><i className="fas fa-truck text-primary me-2"></i>Miễn phí vận chuyển</div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Product Details & Reviews Tabs */}
        <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border border-light">
          <Tabs defaultActiveKey="description" className="mb-4">
            <Tab eventKey="description" title="MÔ TẢ SẢN PHẨM">
              <div className="pt-3" style={{ lineHeight: '1.8', color: '#444' }}>
                {product.description ? (
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                ) : (
                  <>
                    <h5 className="fw-bold mb-3">Thông tin chi tiết</h5>
                    <p>Sản phẩm cao cấp được chế tác tỉ mỉ với thiết kế thời thượng, mang lại trải nghiệm tuyệt vời cho người sử dụng. Được trang bị những công nghệ tiên tiến nhất, đảm bảo hiệu năng vượt trội và độ bền cao.</p>
                    <ul>
                      <li>Thiết kế hiện đại, mỏng nhẹ và cực kỳ sang trọng.</li>
                      <li>Vật liệu cao cấp chống trầy xước, chống nước tiêu chuẩn IP68.</li>
                      <li>Theo dõi sức khỏe toàn diện: Nhịp tim, SpO2, giấc ngủ, đếm bước chân.</li>
                      <li>Thời lượng pin bền bỉ lên đến 14 ngày sử dụng liên tục.</li>
                    </ul>
                    <p>Dù bạn là người yêu thể thao hay chỉ cần một phụ kiện thời trang thông minh, đây chắc chắn là sự lựa chọn hoàn hảo không thể bỏ qua.</p>
                  </>
                )}
              </div>
            </Tab>
            <Tab eventKey="reviews" title="ĐÁNH GIÁ (128)">
              <div className="pt-3 text-center py-5">
                <i className="fas fa-comments fs-1 text-muted opacity-50 mb-3"></i>
                <h5 className="text-muted">Chưa có bình luận nào cho sản phẩm này</h5>
                <p className="small text-muted">Hãy là người đầu tiên đánh giá trải nghiệm của bạn!</p>
              </div>
            </Tab>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-5 pt-4 border-top">
            <h3 className="fw-bold mb-4 text-dark"><i className="fas fa-box-open text-primary me-2"></i>Sản Phẩm Tương Tự</h3>
            <Row className="g-4">
              {relatedProducts.map(rp => (
                <Col key={rp.id} lg={3} md={4} sm={6}>
                  <ProductCard product={rp} />
                </Col>
              ))}
            </Row>
          </div>
        )}

      </Container>
    </div>
  );
}

export default ProductDetailsPage;
