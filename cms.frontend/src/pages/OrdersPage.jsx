import React, { useState, useEffect } from 'react';
import { Container, Card, Badge, Spinner, Table, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch('https://localhost:7199/api/orders');
        if (!response.ok) {
          throw new Error('Lỗi khi tải danh sách đơn hàng');
        }
        const data = await response.json();
        // Lọc đơn hàng của khách hàng hiện tại
        const myOrders = data.filter(o => o.customerId === user.id);
        // Sắp xếp đơn hàng mới nhất lên đầu
        myOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        
        setOrders(myOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 0: return <Badge bg="warning" text="dark">Chờ duyệt</Badge>;
      case 1: return <Badge bg="primary">Đang giao</Badge>;
      case 2: return <Badge bg="success">Đã xong</Badge>;
      case -1: return <Badge bg="danger">Đã hủy</Badge>;
      default: return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="bg-light py-5 text-center" style={{ minHeight: '80vh' }}>
        <Container>
          <div className="bg-white p-5 rounded shadow-sm d-inline-block">
            <h4 className="fw-bold mb-3">Vui lòng đăng nhập</h4>
            <p className="text-muted mb-4">Bạn cần đăng nhập để xem đơn hàng của mình.</p>
            <Link to="/login" className="btn btn-primary px-4 py-2 rounded-pill">Đăng nhập ngay</Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-light py-5" style={{ minHeight: '80vh' }}>
      <Container>
        <Card className="border-0 shadow-sm rounded-4">
          <Card.Header className="bg-white border-bottom py-4 px-4 d-flex justify-content-between align-items-center">
            <h3 className="fw-bold mb-0">Đơn Hàng Của Tôi</h3>
            <Link to="/profile" className="btn btn-outline-secondary btn-sm rounded-pill"><i className="fas fa-arrow-left me-2"></i>Quay lại Hồ sơ</Link>
          </Card.Header>
          <Card.Body className="p-4">
            
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Đang tải danh sách đơn hàng...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-box-open fs-1 text-muted opacity-50 mb-3"></i>
                <h5 className="text-muted">Bạn chưa có đơn hàng nào</h5>
                <Link to="/products" className="btn btn-primary mt-3 rounded-pill px-4">Mua sắm ngay</Link>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle border text-center">
                  <thead className="table-light">
                    <tr>
                      <th className="py-3">Mã Đơn Hàng</th>
                      <th className="py-3 text-start">Ngày Đặt</th>
                      <th className="py-3 text-start">Thông Tin Nhận Hàng</th>
                      <th className="py-3">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td className="fw-bold text-primary">#{order.id}</td>
                        <td className="text-start">{formatDate(order.orderDate)}</td>
                        <td className="text-start" style={{ maxWidth: '300px' }}>
                          <small className="text-muted d-block text-truncate" title={order.notes}>{order.notes || 'Không có ghi chú'}</small>
                        </td>
                        <td>{getStatusBadge(order.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default OrdersPage;
