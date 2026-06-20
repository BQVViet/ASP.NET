import React, { useState, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import OrdersTab from '../components/OrdersTab';

function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState(user?.password || '123456');
  const [emailValue, setEmailValue] = useState(user?.email || '');
  const [phoneValue, setPhoneValue] = useState(user?.phone || '');
  const [addressValue, setAddressValue] = useState(user?.address || '');
  const [genderValue, setGenderValue] = useState(user?.gender || 'Nam');
  const [avatar, setAvatar] = useState(user?.avatar ? `https://localhost:7199${user.avatar}` : null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("File quá lớn. Vui lòng chọn file dưới 1MB.");
        return;
      }
      setAvatarFile(file);
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      if (user && user.id) {
        const formData = new FormData();
        formData.append('FullName', user.name); // Using user.name as FullName for now, or add name state if editable
        formData.append('Email', emailValue);
        formData.append('Phone', phoneValue);
        formData.append('Address', addressValue);
        formData.append('Gender', genderValue);
        formData.append('Password', passwordValue);
        if (avatarFile) {
          formData.append('AvatarFile', avatarFile);
        }

        await updateProfile(user.id, formData);
        setSaveSuccess(true);
        setIsEditingPassword(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert("Không tìm thấy ID người dùng.");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-light py-5 text-center" style={{ minHeight: '80vh' }}>
        <Container>
          <div className="bg-white p-5 rounded shadow-sm d-inline-block">
            <h4 className="fw-bold mb-3">Vui lòng đăng nhập</h4>
            <p className="text-muted mb-4">Bạn cần đăng nhập để xem thông tin tài khoản.</p>
            <Link to="/login" className="btn btn-primary px-4 py-2 rounded-pill">Đăng nhập ngay</Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-light py-5" style={{ minHeight: '80vh' }}>
      <Container>
        {/* Breadcrumb / Title */}


        <Row>
          {/* Sidebar */}
          <Col lg={3} className="mb-4">
            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="bg-primary text-white p-4 text-center">
                <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center mx-auto fw-bold shadow-sm mb-3 overflow-hidden" style={{ width: '80px', height: '80px', fontSize: '2.5rem' }}>
                  {avatar ? (
                    <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <h5 className="fw-bold mb-1">{user.name}</h5>
                <p className="mb-0 text-white-50 small"><i className="fas fa-shield-alt me-1"></i> {user.role}</p>
              </div>
              <ListGroup variant="flush">
                <ListGroup.Item
                  action
                  className={`py-3 px-4 fw-medium ${activeTab === 'profile' ? 'text-primary bg-light border-start border-primary border-4' : 'text-dark border-start border-transparent border-4'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <i className="fas fa-user me-3 text-muted"></i> Hồ Sơ
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  className={`py-3 px-4 fw-medium cursor-pointer ${activeTab === 'orders' ? 'text-primary bg-light border-start border-primary border-4' : 'text-dark border-start border-transparent border-4'}`}
                  onClick={() => setActiveTab('orders')}
                >
                  <i className="fas fa-box me-3 text-muted"></i> Đơn hàng
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  className={`py-3 px-4 fw-medium ${activeTab === 'settings' ? 'text-primary bg-light border-start border-primary border-4' : 'text-dark border-start border-transparent border-4'}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <i className="fas fa-cog me-3 text-muted"></i> Cài Đặt
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  className="py-3 px-4 fw-medium text-danger border-start border-transparent border-4"
                  onClick={logout}
                >
                  <i className="fas fa-sign-out-alt me-3"></i> Đăng Xuất
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>

          {/* Main Content */}
          <Col lg={9}>
            <Card className="border-0 shadow-sm rounded-4 h-100">
              <Card.Body className="p-4 p-md-5">

                {activeTab === 'profile' && (
                  <>
                    <h4 className="fw-medium mb-4 border-bottom pb-3 text-dark">Hồ Sơ Của Tôi</h4>
                    <p className="text-muted small mb-4">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

                    <Row>
                      <Col md={8}>
                        <Form>
                          <Form.Group className="mb-4" controlId="formBasicName">
                            <Form.Label className="text-muted small fw-bold text-uppercase">Tên Đăng Nhập</Form.Label>
                            <Form.Control type="text" value={user.username || user.name} disabled className="bg-light border-0" />
                            <Form.Text className="text-muted">
                              Tên đăng nhập không thể thay đổi.
                            </Form.Text>
                          </Form.Group>

                          <Form.Group className="mb-4" controlId="formBasicEmail">
                            <Form.Label className="text-muted small fw-bold text-uppercase">Email</Form.Label>
                            <Form.Control
                              type="email"
                              value={emailValue}
                              onChange={(e) => setEmailValue(e.target.value)}
                              className="border-light"
                            />
                          </Form.Group>

                          <Form.Group className="mb-4" controlId="formBasicPassword">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <Form.Label className="text-muted small fw-bold text-uppercase mb-0">Mật Khẩu</Form.Label>
                              <span
                                className="text-primary small fw-medium"
                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                onClick={() => setIsEditingPassword(!isEditingPassword)}
                              >
                                {isEditingPassword ? 'Hủy' : 'Thay đổi mật khẩu'}
                              </span>
                            </div>
                            <div className="position-relative">
                              <Form.Control
                                type={showPassword ? "text" : "password"}
                                value={passwordValue}
                                onChange={(e) => setPasswordValue(e.target.value)}
                                disabled={!isEditingPassword}
                                className={`border-${isEditingPassword ? 'primary' : '0'} ${!isEditingPassword ? 'bg-light' : ''}`}
                              />
                              <i
                                className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} position-absolute top-50 end-0 translate-middle-y me-3 text-muted`}
                                style={{ cursor: 'pointer', zIndex: 10 }}
                                onClick={() => setShowPassword(!showPassword)}
                              ></i>
                            </div>
                          </Form.Group>

                          <Form.Group className="mb-4" controlId="formBasicPhone">
                            <Form.Label className="text-muted small fw-bold text-uppercase">Số Điện Thoại</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Thêm số điện thoại"
                              value={phoneValue}
                              onChange={(e) => setPhoneValue(e.target.value)}
                              className="border-light"
                            />
                          </Form.Group>

                          <Form.Group className="mb-4" controlId="formBasicAddress">
                            <Form.Label className="text-muted small fw-bold text-uppercase">Địa Chỉ</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Thêm địa chỉ giao hàng mặc định"
                              value={addressValue}
                              onChange={(e) => setAddressValue(e.target.value)}
                              className="border-light"
                            />
                          </Form.Group>

                          <Form.Group className="mb-4">
                            <Form.Label className="text-muted small fw-bold text-uppercase d-block">Giới Tính</Form.Label>
                            <Form.Check inline label="Nam" name="gender" type="radio" id="gender-male" checked={genderValue === 'Nam'} onChange={() => setGenderValue('Nam')} />
                            <Form.Check inline label="Nữ" name="gender" type="radio" id="gender-female" checked={genderValue === 'Nữ'} onChange={() => setGenderValue('Nữ')} />
                            <Form.Check inline label="Khác" name="gender" type="radio" id="gender-other" checked={genderValue === 'Khác'} onChange={() => setGenderValue('Khác')} />
                          </Form.Group>

                          <Button
                            variant={saveSuccess ? "success" : "primary"}
                            className="px-5 py-2 rounded-pill fw-bold shadow-sm mt-3"
                            onClick={handleSaveChanges}
                            disabled={isSaving}
                          >
                            {isSaving ? (
                              <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" /> Đang lưu...</>
                            ) : saveSuccess ? (
                              <><i className="fas fa-check me-2"></i> Lưu Thành Công</>
                            ) : (
                              "Lưu Thay Đổi"
                            )}
                          </Button>
                        </Form>
                      </Col>

                      <Col md={4} className="d-flex flex-column align-items-center justify-content-center border-start mt-4 mt-md-0 pt-4 pt-md-0">
                        <div className="bg-light text-secondary rounded-circle d-flex align-items-center justify-content-center fw-bold mb-3 shadow-sm overflow-hidden" style={{ width: '120px', height: '120px', fontSize: '3.5rem' }}>
                          {avatar ? (
                            <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            user.name.charAt(0).toUpperCase()
                          )}
                        </div>

                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          className="d-none"
                        />
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="rounded-pill px-4 fw-medium mt-2"
                          onClick={() => fileInputRef.current.click()}
                        >
                          Chọn Ảnh
                        </Button>

                        <p className="text-muted mt-3 text-center" style={{ fontSize: '0.75rem' }}>
                          Dụng lượng file tối đa 1 MB<br />Định dạng: .JPEG, .PNG
                        </p>
                      </Col>
                    </Row>
                  </>
                )}

                {activeTab === 'orders' && (
                  <OrdersTab />
                )}

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ProfilePage;
