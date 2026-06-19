import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-light pt-5 pb-4 mt-5" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
      <div className="container">
        <div className="row">
          {/* Cột 1: Thương hiệu */}
          <div className="col-lg-4 col-md-6 mb-4">
            <Link className="navbar-brand text-dark d-flex align-items-center mb-3" to="/">
              <i className="fas fa-stopwatch me-2 text-primary" style={{ fontSize: '1.5rem' }}></i>
              <span className="fw-bold fs-4">XTRA</span> <span className="fw-normal ms-1 fs-4">Đồng Hồ</span>
            </Link>
            <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              Chúng tôi cung cấp các dòng đồng hồ thông minh dẫn đầu xu hướng công nghệ, mang lại sự tiện ích và phong cách cho cuộc sống hiện đại của bạn.
            </p>
            <div className="d-flex mt-3">
              <a href="#" className="btn btn-outline-secondary rounded-circle me-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="btn btn-outline-secondary rounded-circle me-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}><i className="fab fa-twitter"></i></a>
              <a href="#" className="btn btn-outline-secondary rounded-circle me-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}><i className="fab fa-instagram"></i></a>
              <a href="#" className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}><i className="fab fa-youtube"></i></a>
            </div>
          </div>

          {/* Cột 2: Đường dẫn */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="fw-bold mb-3">Khám Phá</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="text-muted text-decoration-none hover-primary">Trang Chủ</Link></li>
              <li className="mb-2"><Link to="/products" className="text-muted text-decoration-none hover-primary">Bộ Sưu Tập</Link></li>
              <li className="mb-2"><Link to="/blog" className="text-muted text-decoration-none hover-primary">Tin Tức</Link></li>
              <li className="mb-2"><Link to="/about" className="text-muted text-decoration-none hover-primary">Về Chúng Tôi</Link></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="fw-bold mb-3">Hỗ Trợ</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/contact" className="text-muted text-decoration-none hover-primary">Liên Hệ</Link></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none hover-primary">Chính Sách Bảo Hành</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none hover-primary">Vận Chuyển</a></li>
              <li className="mb-2"><a href="#" className="text-muted text-decoration-none hover-primary">Câu Hỏi Thường Gặp</a></li>
            </ul>
          </div>

          {/* Cột 4: Đăng ký */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="fw-bold mb-3">Đăng Ký Nhận Tin</h5>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Đừng bỏ lỡ các chương trình ưu đãi và tin tức sản phẩm mới nhất từ chúng tôi.</p>
            <div className="input-group mb-3">
              <input type="text" className="form-control rounded-start-pill border-end-0 px-3" placeholder="Email của bạn..." />
              <button className="btn btn-primary rounded-end-pill px-4" type="button">Gửi</button>
            </div>
          </div>
        </div>

        <hr className="mt-2 mb-4" style={{ borderColor: 'rgba(0,0,0,0.1)' }} />
        
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              &copy; {new Date().getFullYear()} XTRA Đồng Hồ. Bản quyền thuộc về bạn.
            </span>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <i className="fab fa-cc-visa fs-4 text-muted me-2"></i>
            <i className="fab fa-cc-mastercard fs-4 text-muted me-2"></i>
            <i className="fab fa-cc-paypal fs-4 text-muted"></i>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
