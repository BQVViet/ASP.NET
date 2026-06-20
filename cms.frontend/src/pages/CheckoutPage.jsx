import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user ? user.name : '',
    phone: user ? user.phone || '' : '',
    email: user ? user.email || '' : '',
    address: user ? user.address || '' : '',
    note: '',
    paymentMethod: 'cod'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }
    
    if (!user || !user.id) {
      alert("Vui lòng đăng nhập để tiến hành đặt hàng!");
      navigate('/login');
      return;
    }

    try {
      const orderPayload = {
        customerId: user.id,
        status: 0, // 0: Chờ duyệt
        notes: `Giao đến: ${formData.address}\nPhương thức: ${formData.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}\nGhi chú: ${formData.note || 'Không có'}`,
        orderDetails: cartItems.map(item => ({
          productId: item.originalId || parseInt(item.id),
          quantity: item.quantity,
          unitPrice: item.price
        }))
      };

      const response = await fetch('https://localhost:7199/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        throw new Error("Lỗi khi tạo đơn hàng trên Server.");
      }

      const result = await response.json();
      
      alert(`🎉 Đặt hàng thành công! Mã đơn hàng của bạn là: #${result.id}`);
      clearCart();
      navigate('/orders'); // Hoặc navigate('/profile') nếu bạn muốn
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container className="py-5 text-center" style={{ minHeight: '80vh' }}>
        <h3 className="mt-5">Giỏ hàng của bạn đang trống!</h3>
        <Link to="/products" className="btn btn-primary mt-3 rounded-pill px-4">Quay lại cửa hàng</Link>
      </Container>
    );
  }

  return (
    <div className="bg-light py-5" style={{ minHeight: '100vh' }}>
      <Container>
        <div className="mb-4">
          <h2 className="fw-bold text-dark">Thanh Toán</h2>
          <p className="text-muted">Vui lòng điền thông tin giao hàng của bạn</p>
        </div>

        <Row>
          {/* Checkout Form */}
          <Col lg={7} className="mb-4">
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Header className="bg-white border-bottom py-3 px-4 fw-bold">
                Thông tin nhận hàng
              </Card.Header>
              <Card.Body className="p-4">
                <Form id="checkoutForm" onSubmit={handleCheckout}>
                  {user ? (
                    <div className="bg-light p-3 rounded-3 mb-4 border">
                      <div className="fw-bold mb-2 text-dark"><i className="fas fa-user-circle me-2 text-primary"></i>Thông tin người đặt hàng</div>
                      <div className="d-flex flex-column gap-1 text-muted" style={{ fontSize: '0.95rem' }}>
                        <div><strong>Họ tên:</strong> {user.name}</div>
                        {user.phone && <div><strong>SĐT:</strong> {user.phone}</div>}
                        {user.email && <div><strong>Email:</strong> {user.email}</div>}
                      </div>
                    </div>
                  ) : (
                    <>
                      <Row className="mb-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Họ và tên <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Nhập họ tên" />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Số điện thoại <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Nhập số điện thoại" />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Nhập địa chỉ email (không bắt buộc)" />
                      </Form.Group>
                    </>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Địa chỉ giao hàng <span className="text-danger">*</span></Form.Label>
                    <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required placeholder="Nhập địa chỉ cụ thể (số nhà, đường, phường/xã, quận/huyện)" />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Ghi chú đơn hàng</Form.Label>
                    <Form.Control as="textarea" rows={3} name="note" value={formData.note} onChange={handleChange} placeholder="Ghi chú thêm về đơn hàng, thời gian giao hàng..." />
                  </Form.Group>

                  <h5 className="fw-bold mb-3 pt-3 border-top">Phương thức thanh toán</h5>
                  <div className="mb-4">
                    <div className={`border rounded-3 p-3 mb-2 cursor-pointer transition-hover ${formData.paymentMethod === 'cod' ? 'border-primary bg-primary bg-opacity-10' : 'bg-white'}`} onClick={() => setFormData({...formData, paymentMethod: 'cod'})}>
                      <Form.Check 
                        type="radio" 
                        id="payment-cod" 
                        name="paymentMethod" 
                        value="cod" 
                        checked={formData.paymentMethod === 'cod'} 
                        onChange={handleChange}
                        label={<span className="fw-bold"><i className="fas fa-money-bill-wave text-success me-2"></i>Thanh toán khi nhận hàng (COD)</span>}
                        className="m-0"
                      />
                    </div>
                    <div className={`border rounded-3 p-3 cursor-pointer transition-hover ${formData.paymentMethod === 'banking' ? 'border-primary bg-primary bg-opacity-10' : 'bg-white'}`} onClick={() => setFormData({...formData, paymentMethod: 'banking'})}>
                      <Form.Check 
                        type="radio" 
                        id="payment-banking" 
                        name="paymentMethod" 
                        value="banking" 
                        checked={formData.paymentMethod === 'banking'} 
                        onChange={handleChange}
                        label={<span className="fw-bold"><i className="fas fa-university text-primary me-2"></i>Chuyển khoản ngân hàng</span>}
                        className="m-0"
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <Link to="/cart" className="text-decoration-none text-muted"><i className="fas fa-arrow-left me-2"></i> Quay lại giỏ hàng</Link>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Order Summary */}
          <Col lg={5}>
            <Card className="border-0 shadow-sm rounded-4 mb-4">
              <Card.Header className="bg-white border-bottom py-3 px-4 fw-bold">
                Đơn hàng của bạn ({cartItems.length} sản phẩm)
              </Card.Header>
              <Card.Body className="p-4">
                <div className="mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {cartItems.map(item => (
                    <div key={item.cartItemId || item.id} className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
                      <div className="d-flex align-items-center">
                        <img src={item.imageUrl || "/smartwatch_hero.png"} alt={item.name} className="rounded border me-3" style={{width: '50px', height: '50px', objectFit: 'contain'}} />
                        <div>
                          <div className="fw-bold" style={{fontSize: '0.9rem'}}>{item.name}</div>
                          <div className="text-muted small">
                            {item.selectedColor && `Màu: ${item.selectedColor}`}
                            {item.selectedVersion && ` - Bản: ${item.selectedVersion}`}
                          </div>
                          <div className="text-muted small">SL: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="fw-bold text-primary">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-between mb-2 text-muted">
                  <span>Tạm tính:</span>
                  <span>{cartTotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="d-flex justify-content-between mb-4 text-muted border-bottom pb-3">
                  <span>Phí vận chuyển:</span>
                  <span>Miễn phí</span>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fs-5 fw-bold text-dark">Tổng cộng:</span>
                  <span className="fs-3 text-danger fw-bold">{cartTotal.toLocaleString('vi-VN')}₫</span>
                </div>

                <Button type="submit" form="checkoutForm" variant="primary" size="lg" className="w-100 rounded-pill fw-bold shadow-sm">
                  HOÀN TẤT ĐẶT HÀNG
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CheckoutPage;
