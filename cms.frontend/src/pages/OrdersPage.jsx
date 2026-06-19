import React from 'react';
import { Container } from 'react-bootstrap';

function OrdersPage() {
  return (
    <div className="bg-light py-5" style={{ minHeight: '80vh' }}>
      <Container>
        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="fw-bold mb-4">Đơn Hàng Của Tôi</h3>
          <div className="alert alert-info">
            Bạn chưa có đơn hàng nào hoặc tính năng quản lý đơn hàng đang được phát triển.
          </div>
        </div>
      </Container>
    </div>
  );
}

export default OrdersPage;
