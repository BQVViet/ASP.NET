import React, { useState, useEffect } from 'react';
import { Badge, Spinner, Button, Modal } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function OrdersTab() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all'); // all, pending, shipping, completed, cancelled

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://localhost:7199/api/orders');
      if (!response.ok) throw new Error('Lỗi khi tải danh sách đơn hàng');
      const data = await response.json();
      
      const myOrders = data.filter(o => o.customerId === user.id);
      myOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      
      setOrders(myOrders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleCancelOrder = async (order) => {
    if (!window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng #${order.id} không?`)) return;

    try {
      const updatedOrder = { ...order, status: -1 };
      
      // Không gửi kèm tham chiếu Customer/OrderDetails để tránh lỗi JSON loop / EF tracking
      const payload = {
        id: order.id,
        orderDate: order.orderDate,
        customerId: order.customerId,
        status: -1,
        notes: order.notes
      };

      const response = await fetch(`https://localhost:7199/api/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Không thể hủy đơn hàng lúc này");
      
      alert("Đã hủy đơn hàng thành công");
      fetchOrders(); // Refresh
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return o.status === 0;
    if (activeFilter === 'shipping') return o.status === 1;
    if (activeFilter === 'completed') return o.status === 2;
    if (activeFilter === 'cancelled') return o.status === -1;
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 0: return <span className="text-warning fw-medium"><i className="fas fa-clock me-1"></i>Chờ xác nhận</span>;
      case 1: return <span className="text-info fw-medium"><i className="fas fa-truck me-1"></i>Đang giao hàng</span>;
      case 2: return <span className="text-success fw-medium"><i className="fas fa-check-circle me-1"></i>Thành công</span>;
      case -1: return <span className="text-secondary fw-medium"><i className="fas fa-times-circle me-1"></i>Đã hủy</span>;
      default: return <span className="text-muted fw-medium">Không xác định</span>;
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const calculateTotal = (orderDetails) => {
    if (!orderDetails) return 0;
    return orderDetails.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  };

  // Progress Tracker Component
  const OrderProgress = ({ status }) => {
    const steps = [
      { id: 0, label: 'Chờ duyệt', icon: 'fa-clipboard-list' },
      { id: 1, label: 'Đang giao', icon: 'fa-shipping-fast' },
      { id: 2, label: 'Hoàn thành', icon: 'fa-box-open' }
    ];

    if (status === -1) {
      return (
        <div className="alert alert-secondary m-3 py-2 text-center text-danger fw-medium">
          <i className="fas fa-ban me-2"></i> Đơn hàng này đã bị hủy
        </div>
      );
    }

    return (
      <div className="d-flex justify-content-between align-items-center position-relative m-3 p-3 bg-light rounded-3">
        {/* Progress Line */}
        <div className="position-absolute" style={{ top: '50%', left: '15%', right: '15%', height: '3px', backgroundColor: '#dee2e6', zIndex: 1, transform: 'translateY(-50%)' }}>
           <div style={{ 
             height: '100%', 
             backgroundColor: '#0d6efd', 
             width: status === 0 ? '0%' : status === 1 ? '50%' : '100%',
             transition: 'width 0.3s ease'
           }}></div>
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isActive = status >= step.id;
          return (
            <div key={step.id} className="text-center position-relative" style={{ zIndex: 2, width: '33.33%' }}>
              <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-2 shadow-sm ${isActive ? 'bg-primary text-white' : 'bg-white text-muted border'}`} style={{ width: '40px', height: '40px', transition: 'all 0.3s' }}>
                <i className={`fas ${step.icon}`}></i>
              </div>
              <div className={`small fw-medium ${isActive ? 'text-primary' : 'text-muted'}`}>{step.label}</div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /><p className="mt-3 text-muted">Đang tải đơn hàng...</p></div>;
  if (error) return <div className="alert alert-danger m-4">{error}</div>;

  return (
    <div>
      <h4 className="fw-medium mb-4 pb-3 border-bottom text-dark">Quản lý Đơn hàng</h4>
      
      {/* Tabs Filter */}
      <div className="d-flex mb-4 border-bottom text-center bg-white sticky-top" style={{ zIndex: 10 }}>
        <div onClick={() => setActiveFilter('all')} className={`flex-fill py-3 cursor-pointer transition-hover ${activeFilter === 'all' ? 'border-bottom border-primary border-3 text-primary fw-medium' : 'text-muted'}`}>Tất cả</div>
        <div onClick={() => setActiveFilter('pending')} className={`flex-fill py-3 cursor-pointer transition-hover ${activeFilter === 'pending' ? 'border-bottom border-primary border-3 text-primary fw-medium' : 'text-muted'}`}>Chờ duyệt</div>
        <div onClick={() => setActiveFilter('shipping')} className={`flex-fill py-3 cursor-pointer transition-hover ${activeFilter === 'shipping' ? 'border-bottom border-primary border-3 text-primary fw-medium' : 'text-muted'}`}>Đang giao</div>
        <div onClick={() => setActiveFilter('completed')} className={`flex-fill py-3 cursor-pointer transition-hover ${activeFilter === 'completed' ? 'border-bottom border-primary border-3 text-primary fw-medium' : 'text-muted'}`}>Hoàn thành</div>
        <div onClick={() => setActiveFilter('cancelled')} className={`flex-fill py-3 cursor-pointer transition-hover ${activeFilter === 'cancelled' ? 'border-bottom border-primary border-3 text-primary fw-medium' : 'text-muted'}`}>Đã hủy</div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '300px' }}>
          <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/5fafbb923393b712b96488590b8f781f.png" alt="Empty orders" style={{ width: '120px', opacity: 0.5 }} className="mb-3" />
          <h5 className="text-muted fw-normal mb-4">Chưa có đơn hàng nào</h5>
          {activeFilter === 'all' && <Link to="/products" className="btn btn-primary px-5 py-2 rounded-1 text-uppercase fw-medium">Mua sắm ngay</Link>}
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="border rounded-2 bg-white shadow-sm overflow-hidden transition-hover">
              {/* Order Header */}
              <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-light bg-opacity-50">
                <div>
                  <span className="fw-bold me-3">Mã ĐH: #{order.id}</span>
                  <span className="text-muted small"><i className="far fa-clock me-1"></i>{formatDate(order.orderDate)}</span>
                </div>
                <div>
                  {getStatusBadge(order.status)}
                </div>
              </div>
              
              {/* Progress Tracker */}
              <OrderProgress status={order.status} />

              {/* Order Products */}
              <div className="border-bottom">
                {order.orderDetails && order.orderDetails.map((detail, idx) => (
                  <div key={idx} className="p-3 d-flex align-items-center border-top">
                    <div className="bg-white border rounded p-1 me-3 flex-shrink-0" style={{ width: '80px', height: '80px' }}>
                      <img src={`https://localhost:7199${detail.product?.imageUrl}`} alt={detail.product?.name} className="img-fluid w-100 h-100" style={{ objectFit: 'contain' }} 
                           onError={(e) => { e.target.onerror = null; e.target.src="/smartwatch_hero.png"; }}/>
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <h6 className="mb-1 text-dark text-truncate">{detail.product?.name || `Sản phẩm #${detail.productId}`}</h6>
                      <div className="text-muted small mb-2 d-flex gap-2">
                        {detail.product?.version && <Badge bg="light" text="dark">Bản: {detail.product.version}</Badge>}
                        {detail.product?.color && <Badge bg="light" text="dark">Màu: {detail.product.color}</Badge>}
                      </div>
                      <div className="text-muted small">Số lượng: x{detail.quantity}</div>
                    </div>
                    <div className="text-end ms-3">
                      <span className="text-danger fw-medium d-block">{(detail.unitPrice).toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Footer */}
              <div className="p-3 bg-light bg-opacity-50 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                  <div className="text-muted small mb-1" style={{ whiteSpace: 'pre-wrap' }}>
                    <i className="fas fa-map-marker-alt me-2 text-danger"></i>
                    {order.notes || 'Không có ghi chú'}
                  </div>
                </div>
                <div className="text-end d-flex flex-column align-items-md-end">
                  <div className="mb-2">
                    <span className="text-dark me-2">Thành tiền:</span>
                    <span className="text-danger fs-5 fw-bold">{(calculateTotal(order.orderDetails)).toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="d-flex gap-2 justify-content-end">
                    <Button variant="outline-secondary" size="sm" className="px-3 rounded-1">Liên hệ người bán</Button>
                    {order.status === 2 ? (
                      <Button variant="primary" size="sm" className="px-3 rounded-1">Mua lại</Button>
                    ) : order.status === 0 ? (
                      <Button variant="outline-danger" size="sm" className="px-3 rounded-1" onClick={() => handleCancelOrder(order)}>Hủy đơn hàng</Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersTab;
