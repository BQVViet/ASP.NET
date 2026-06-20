import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Spinner, Badge, Form, InputGroup, Button } from 'react-bootstrap';
import { getPostById, getPosts } from '../services/blogService';

function BlogDetailsPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    // Fetch current post and recent posts for sidebar
    Promise.all([
      getPostById(id),
      getPosts(3) // Fetch 3 recent posts
    ])
    .then(([postData, recentData]) => {
      setPost(postData);
      setRecentPosts(recentData.filter(p => p.id.toString() !== id).slice(0, 3));
    })
    .catch(err => setError(err.message))
    .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="d-flex justify-content-center align-items-center" style={{minHeight: '70vh'}}><Spinner animation="grow" variant="primary" /></div>;
  if (error || !post) return <Container className="py-5 text-center text-danger"><h3 className="mt-5">Lỗi: {error || 'Không tìm thấy bài viết!'}</h3></Container>;

  return (
    <div className="bg-light py-4" style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      <Container>
        {/* Breadcrumb */}
        <div className="mb-4 small fw-medium">
          <Link to="/" className="text-decoration-none text-muted transition-hover">Trang chủ</Link>
          <span className="text-muted mx-2"><i className="fas fa-chevron-right" style={{fontSize: '0.7rem'}}></i></span>
          <Link to="/blog" className="text-decoration-none text-muted transition-hover">Tin Tức</Link>
          <span className="text-muted mx-2"><i className="fas fa-chevron-right" style={{fontSize: '0.7rem'}}></i></span>
          <span className="text-dark">{post.title}</span>
        </div>

        <Row className="g-4 g-lg-5">
          {/* Left Column: Main Content */}
          <Col lg={8}>
            <div className="bg-white rounded-4 shadow-sm overflow-hidden border border-light">
              
              {/* Header Bài viết */}
              <div className="p-4 p-md-5 pb-0 bg-white">
                <Badge bg="primary" className="mb-3 px-3 py-2 rounded-pill shadow-sm text-uppercase" style={{ letterSpacing: '1px' }}>Tin Công Nghệ</Badge>
                <h1 className="fw-bold mb-4 text-dark" style={{ fontSize: '2.5rem', lineHeight: '1.4' }}>{post.title}</h1>
                
                {/* Author Info & Meta */}
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4 pb-4 border-bottom">
                  <div className="d-flex align-items-center">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Author" className="rounded-circle me-3 border" style={{width: '50px', height: '50px'}} />
                    <div>
                      <h6 className="fw-bold mb-1 text-dark">Quản trị viên</h6>
                      <div className="text-muted small">Chuyên gia công nghệ</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center text-secondary fw-medium small">
                    <i className="fas fa-calendar-alt me-2 text-primary"></i> 
                    <span>{new Date(post.createdDate).toLocaleDateString('vi-VN')}</span>
                    <span className="mx-3 text-muted">•</span>
                    <i className="fas fa-eye me-2 text-primary"></i>
                    <span>1.2k lượt đọc</span>
                  </div>
                </div>
              </div>

              {/* Ảnh bìa */}
              {post.imageUrl && (
                <div className="px-4 px-md-5 mb-4 text-center">
                  <div className="bg-light rounded-4 overflow-hidden border border-light p-3" style={{ aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="img-fluid" 
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', mixBlendMode: 'darken' }} 
                    />
                  </div>
                  <div className="text-center text-muted small mt-2 fst-italic">Hình ảnh minh họa: {post.title}</div>
                </div>
              )}

              {/* Nội dung bài viết */}
              <div className="p-4 p-md-5 pt-0">
                <div 
                  className="blog-content" 
                  style={{ lineHeight: '1.9', color: '#334155', fontSize: '1.1rem' }} 
                  dangerouslySetInnerHTML={{ __html: post.content }} 
                />
                
                {/* Tag & Chia sẻ */}
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mt-5 pt-4 border-top">
                  <div className="d-flex gap-2 mb-3 mb-sm-0">
                    <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill fw-normal transition-hover cursor-pointer">#SmartWatch</Badge>
                    <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill fw-normal transition-hover cursor-pointer">#CongNghe</Badge>
                    <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill fw-normal transition-hover cursor-pointer">#Apple</Badge>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-bold text-muted small me-2">CHIA SẺ:</span>
                    <Button variant="outline-primary" className="rounded-circle d-flex align-items-center justify-content-center" style={{width: '36px', height: '36px'}}><i className="fab fa-facebook-f"></i></Button>
                    <Button variant="outline-info" className="rounded-circle d-flex align-items-center justify-content-center" style={{width: '36px', height: '36px'}}><i className="fab fa-twitter"></i></Button>
                    <Button variant="outline-dark" className="rounded-circle d-flex align-items-center justify-content-center" style={{width: '36px', height: '36px'}}><i className="fas fa-link"></i></Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-4 shadow-sm border border-light mt-4 p-4 p-md-5">
              <h4 className="fw-bold mb-4">Bình luận (0)</h4>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control as="textarea" rows={3} placeholder="Tham gia thảo luận. Nhập bình luận của bạn tại đây..." className="bg-light border-0 p-3 rounded-3" />
                </Form.Group>
                <div className="text-end">
                  <Button variant="primary" className="rounded-pill px-4 fw-bold shadow-sm">Gửi bình luận</Button>
                </div>
              </Form>
            </div>
          </Col>

          {/* Right Column: Sidebar */}
          <Col lg={4}>
            {/* Search Box */}
            <div className="bg-white rounded-4 shadow-sm border border-light p-4 mb-4">
              <h5 className="fw-bold mb-3">Tìm kiếm</h5>
              <InputGroup>
                <Form.Control placeholder="Nhập từ khóa..." className="bg-light border-0" />
                <Button variant="primary"><i className="fas fa-search"></i></Button>
              </InputGroup>
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-4 shadow-sm border border-light p-4 mb-4">
              <h5 className="fw-bold mb-4 border-bottom pb-2">Bài Viết Mới Nhất</h5>
              <div className="d-flex flex-column gap-3">
                {recentPosts.length > 0 ? recentPosts.map((rp) => (
                  <Link to={`/blog/${rp.id}`} key={rp.id} className="text-decoration-none d-flex gap-3 align-items-center transition-hover group">
                    <img src={rp.imageUrl || "https://via.placeholder.com/80"} alt={rp.title} className="rounded-3" style={{width: '80px', height: '80px', objectFit: 'cover'}} />
                    <div>
                      <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{rp.title}</h6>
                      <div className="text-muted small"><i className="fas fa-calendar-alt me-1"></i> {new Date(rp.createdDate).toLocaleDateString('vi-VN')}</div>
                    </div>
                  </Link>
                )) : (
                  <div className="text-muted small">Không có bài viết khác.</div>
                )}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-4 shadow-sm border border-light p-4">
              <h5 className="fw-bold mb-4 border-bottom pb-2">Chủ Đề Phổ Biến</h5>
              <div className="d-flex flex-wrap gap-2">
                <Badge bg="light" text="dark" className="border px-3 py-2 rounded-1 fw-normal transition-hover cursor-pointer">Đồng hồ thông minh</Badge>
                <Badge bg="light" text="dark" className="border px-3 py-2 rounded-1 fw-normal transition-hover cursor-pointer">Apple Watch</Badge>
                <Badge bg="light" text="dark" className="border px-3 py-2 rounded-1 fw-normal transition-hover cursor-pointer">Sức khỏe</Badge>
                <Badge bg="light" text="dark" className="border px-3 py-2 rounded-1 fw-normal transition-hover cursor-pointer">Công nghệ mới</Badge>
                <Badge bg="light" text="dark" className="border px-3 py-2 rounded-1 fw-normal transition-hover cursor-pointer">Khuyến mãi</Badge>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default BlogDetailsPage;
