import React from 'react';
import { Container, Row, Col, Card, Button, Image, Form, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="bg-light py-5 text-center" style={{ minHeight: '80vh' }}>
        <Container>
          <div className="bg-white p-5 rounded shadow-sm d-inline-block">
            <i className="fas fa-shopping-cart fa-4x text-muted mb-4"></i>
            <h3 className="fw-bold mb-3">Giỏ hàng của bạn đang trống</h3>
            <p className="text-muted mb-4">Hãy quay lại cửa hàng để chọn cho mình những sản phẩm tuyệt vời nhé!</p>
            <Link to="/products" className="btn btn-primary px-4 py-2 rounded-pill">Tiếp tục mua sắm</Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-light py-5" style={{ minHeight: '80vh' }}>
      <Container>
        <div className="mb-4">
          <h2 className="fw-bold text-dark">Giỏ Hàng</h2>
          <p className="text-muted">Quản lý các sản phẩm bạn đã chọn</p>
        </div>

        <Row>
          {/* Cart Items List */}
          <Col lg={8} className="mb-4">
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
              <Card.Header className="bg-white border-bottom py-3 px-4 fw-bold">
                Chi tiết giỏ hàng ({cartItems.length} sản phẩm)
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive hover className="mb-0 align-middle">
                  <thead className="bg-light text-muted" style={{ fontSize: '0.9rem' }}>
                    <tr>
                      <th className="border-0 px-4 py-3">Sản Phẩm</th>
                      <th className="border-0 py-3 text-center">Đơn Giá</th>
                      <th className="border-0 py-3 text-center" style={{ width: '150px' }}>Số Lượng</th>
                      <th className="border-0 py-3 text-end">Thành Tiền</th>
                      <th className="border-0 px-4 py-3 text-center">Xóa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center">
                            {item.imageUrl ? (
                              <Image 
                                src={item.imageUrl} 
                                alt={item.name} 
                                rounded 
                                className="me-3 border" 
                                style={{ width: '80px', height: '80px', objectFit: 'contain', backgroundColor: '#fff' }} 
                              />
                            ) : (
                              <div className="bg-light rounded me-3 d-flex align-items-center justify-content-center border" style={{ width: '80px', height: '80px' }}>
                                <i className="fas fa-image text-muted fs-4"></i>
                              </div>
                            )}
                            <div>
                              <Link to={`/product/${item.id}`} className="text-dark fw-bold text-decoration-none">
                                {item.name}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-center text-muted fw-medium">
                          {item.price.toLocaleString('vi-VN')}₫
                        </td>
                        <td className="py-3">
                          <div className="d-flex justify-content-center align-items-center">
                            <Button 
                              variant="outline-secondary" 
                              size="sm" 
                              className="px-2 py-0 rounded-circle" 
                              style={{ width: '28px', height: '28px' }}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <Form.Control 
                              type="text" 
                              value={item.quantity} 
                              readOnly 
                              className="text-center mx-2 border-0 bg-transparent fw-bold" 
                              style={{ width: '40px' }} 
                            />
                            <Button 
                              variant="outline-secondary" 
                              size="sm" 
                              className="px-2 py-0 rounded-circle" 
                              style={{ width: '28px', height: '28px' }}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </td>
                        <td className="py-3 text-end text-primary fw-bold">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button variant="link" className="text-danger p-0 shadow-none" onClick={() => removeFromCart(item.id)}>
                            <i className="fas fa-trash-alt fs-5"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Cart Summary */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Header className="bg-white border-bottom py-3 px-4 fw-bold">
                Tóm tắt đơn hàng
              </Card.Header>
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between mb-3 text-muted">
                  <span>Tạm tính:</span>
                  <span className="fw-bold text-dark">{cartTotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="d-flex justify-content-between mb-3 text-muted">
                  <span>Giảm giá:</span>
                  <span className="fw-bold text-success">-0₫</span>
                </div>
                <div className="d-flex justify-content-between mb-4 text-muted">
                  <span>Phí vận chuyển:</span>
                  <span className="fw-bold text-dark">Miễn phí</span>
                </div>
                
                <hr className="bg-light" />
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fs-5 fw-bold text-dark">Tổng cộng:</span>
                  <span className="fs-3 text-primary fw-bold">{cartTotal.toLocaleString('vi-VN')}₫</span>
                </div>
                
                <Button variant="primary" size="lg" className="w-100 rounded-pill mb-3 fw-bold">
                  Tiến Hành Thanh Toán
                </Button>
                <Link to="/products" className="btn btn-outline-primary w-100 rounded-pill">
                  Tiếp Tục Mua Sắm
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CartPage;
