import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Dropdown } from 'react-bootstrap';

function Header() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchInput.trim())}`);
      setShowSearch(false);
      setSearchInput('');
    }
  };
  return (
    <header className="sticky-top shadow-sm" style={{ zIndex: 1040 }}>
      {/* Top Bar */}
      <div className="bg-dark text-light py-2 px-4 d-none d-md-flex justify-content-between align-items-center" style={{ fontSize: '0.8rem' }}>
        <div>
          Welcome - Sign Up Now & Get 25% Off
        </div>
        <div>
          Call The Expert - (123)456-7890
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg bg-white py-3">
        <div className="container-fluid px-lg-5">
          {/* Logo */}
          <Link className="navbar-brand text-dark d-flex align-items-center" to="/">
            <i className="fas fa-stopwatch me-2 text-dark fs-3"></i>
            <div className="d-flex flex-column" style={{ lineHeight: '1.1' }}>
              <span className="fw-bold fs-4" style={{ letterSpacing: '1px' }}>XTRA</span>
              <span className="text-muted" style={{ fontSize: '0.75rem', fontWeight: '500' }}>đồng hồ thông minh</span>
            </div>
          </Link>

          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Nav Links */}
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav fw-medium text-dark" style={{ fontSize: '0.95rem' }}>
              <li className="nav-item mx-3">
                <Link className="nav-link text-dark" to="/">Trang Chủ</Link>
              </li>
              <li className="nav-item mx-3">
                <Link className="nav-link text-dark d-flex align-items-center" to="/products">
                  Sản Phẩm <i className="fas fa-chevron-down ms-1 text-muted" style={{ fontSize: '0.6rem', paddingTop: '2px' }}></i>
                </Link>
              </li>

              <li className="nav-item mx-3">
                <Link className="nav-link text-dark" to="/contact">Liên Hệ</Link>
              </li>
            </ul>
          </div>

          {/* Icons on Right */}
          <div className="d-flex align-items-center ms-auto ms-lg-0 mt-3 mt-lg-0">
            {user ? (
              <Dropdown align="end" className="me-3">
                <Dropdown.Toggle variant="link" id="dropdown-user" className="text-dark p-0 text-decoration-none d-flex align-items-center">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu className="shadow border-0 mt-2 rounded-3">
                  <Dropdown.ItemText className="fw-bold text-dark px-3 py-2 border-bottom">
                    {user.name} <br/>
                    <span className="badge bg-secondary mt-1">{user.role}</span>
                  </Dropdown.ItemText>
                  <Dropdown.Item as={Link} to="/profile" className="py-2"><i className="fas fa-user-circle me-2 text-muted"></i> Tài khoản của tôi</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/orders" className="py-2"><i className="fas fa-box me-2 text-muted"></i> Đơn hàng</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={logout} className="py-2 text-danger"><i className="fas fa-sign-out-alt me-2"></i> Đăng xuất</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Link to="/login" className="btn btn-link text-dark p-0 me-4" style={{ textDecoration: 'none' }} title="Đăng nhập">
                <i className="fas fa-user" style={{ fontSize: '1.2rem' }}></i>
              </Link>
            )}

            {showSearch ? (
              <form onSubmit={handleSearchSubmit} className="d-flex align-items-center me-4 border rounded-pill px-3 py-1 bg-light shadow-sm" style={{ minWidth: '220px', transition: 'all 0.3s' }}>
                <input 
                  type="text" 
                  className="form-control border-0 bg-transparent shadow-none p-0" 
                  placeholder="Tìm kiếm..." 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  autoFocus
                />
                <button type="button" className="btn btn-link text-muted p-0 ms-2" onClick={() => setShowSearch(false)}>
                  <i className="fas fa-times"></i>
                </button>
              </form>
            ) : (
              <button className="btn btn-link text-dark p-0 me-4" style={{ textDecoration: 'none' }} title="Tìm kiếm sản phẩm" onClick={() => setShowSearch(true)}>
                <i className="fas fa-search" style={{ fontSize: '1.2rem' }}></i>
              </button>
            )}
            <Link to="/cart" className="btn btn-link text-dark position-relative p-0" style={{ textDecoration: 'none' }}>
              <i className="fas fa-shopping-bag" style={{ fontSize: '1.2rem' }} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark border border-white" style={{ fontSize: '0.6rem', padding: '0.35em 0.6em', transform: 'translate(-30%, -30%)' }}>
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
