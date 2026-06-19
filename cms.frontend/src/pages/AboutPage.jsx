import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function AboutPage() {
  return (
    <div className="bg-light pb-5" style={{ minHeight: '80vh' }}>
      {/* Hero Banner */}
      <section className="bg-dark text-white text-center py-5 mb-5 position-relative" style={{ overflow: 'hidden' }}>
        <div className="position-absolute w-100 h-100" style={{ top: 0, left: 0, opacity: 0.1, background: 'url(/smartwatch_hero.png) center/cover no-repeat', mixBlendMode: 'screen' }}></div>
        <Container className="position-relative py-5 z-index-1">
          <span className="badge bg-primary rounded-pill px-3 py-2 mb-3 shadow-sm">VỀ CHÚNG TÔI</span>
          <h1 className="display-4 fw-bold mb-3">Tầm Nhìn XTRA</h1>
          <p className="lead mx-auto text-light" style={{ maxWidth: '700px' }}>
            Chúng tôi không chỉ bán đồng hồ thông minh, chúng tôi mang đến phong cách sống hiện đại và trải nghiệm công nghệ hoàn hảo cho mọi người.
          </p>
        </Container>
      </section>

      <Container>
        <Row className="align-items-center mb-5 g-5">
          <Col lg={6}>
            <div className="bg-white p-5 rounded-4 shadow-sm h-100">
              <h2 className="fw-bold mb-4 text-dark">Câu Chuyện Của Chúng Tôi</h2>
              <p className="text-secondary" style={{ lineHeight: '1.8' }}>
                Được thành lập từ năm 2026, XTRA Store ra đời với sứ mệnh cung cấp những thiết bị đeo thông minh tốt nhất trên thị trường. Từ những ngày đầu tiên, chúng tôi luôn đặt chất lượng sản phẩm và sự hài lòng của khách hàng lên hàng đầu.
              </p>
              <p className="text-secondary" style={{ lineHeight: '1.8' }}>
                Chúng tôi tự hào là đối tác phân phối chính thức của các thương hiệu hàng đầu mang đến cho bạn những trải nghiệm mua sắm tuyệt vời và an tâm nhất.
              </p>
            </div>
          </Col>
          <Col lg={6}>
            <Row className="g-4">
              <Col sm={6}>
                <div className="bg-white p-4 text-center rounded-4 shadow-sm border-bottom border-4 border-primary transition-hover h-100">
                  <div className="icon-circle bg-primary text-white mx-auto mb-3 shadow-sm">
                    <i className="fas fa-gem"></i>
                  </div>
                  <h5 className="fw-bold">Chất Lượng</h5>
                  <p className="text-muted small mb-0">Cam kết 100% hàng chính hãng</p>
                </div>
              </Col>
              <Col sm={6}>
                <div className="bg-white p-4 text-center rounded-4 shadow-sm border-bottom border-4 border-success transition-hover h-100">
                  <div className="icon-circle bg-success text-white mx-auto mb-3 shadow-sm">
                    <i className="fas fa-users"></i>
                  </div>
                  <h5 className="fw-bold">Tận Tâm</h5>
                  <p className="text-muted small mb-0">Hỗ trợ khách hàng mọi lúc</p>
                </div>
              </Col>
              <Col sm={6}>
                <div className="bg-white p-4 text-center rounded-4 shadow-sm border-bottom border-4 border-info transition-hover h-100">
                  <div className="icon-circle bg-info text-white mx-auto mb-3 shadow-sm">
                    <i className="fas fa-bolt"></i>
                  </div>
                  <h5 className="fw-bold">Nhanh Chóng</h5>
                  <p className="text-muted small mb-0">Giao hàng hỏa tốc 2h</p>
                </div>
              </Col>
              <Col sm={6}>
                <div className="bg-white p-4 text-center rounded-4 shadow-sm border-bottom border-4 border-warning transition-hover h-100">
                  <div className="icon-circle bg-warning text-white mx-auto mb-3 shadow-sm">
                    <i className="fas fa-sync"></i>
                  </div>
                  <h5 className="fw-bold">Uy Tín</h5>
                  <p className="text-muted small mb-0">Đổi trả dễ dàng 7 ngày</p>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

        <div className="bg-primary text-white rounded-4 p-5 text-center shadow mt-5">
          <h3 className="fw-bold mb-3">Sẵn Sàng Trải Nghiệm?</h3>
          <p className="lead mb-4">Hãy khám phá bộ sưu tập smartwatch mới nhất của chúng tôi ngay hôm nay.</p>
          <Link to="/products" className="btn btn-light btn-lg rounded-pill px-5 fw-bold text-primary shadow-sm">
            Tới Cửa Hàng
          </Link>
        </div>
      </Container>
    </div>
  );
}

export default AboutPage;
