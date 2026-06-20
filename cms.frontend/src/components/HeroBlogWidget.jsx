import React, { useEffect, useState } from 'react';
import { getPosts } from '../services/blogService';
import { Link } from 'react-router-dom';

function HeroBlogWidget() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts()
      .then(res => {
        // Lấy 3 bài mới nhất
        setPosts(res.slice(0, 3));
      })
      .catch(err => console.error("Lỗi tải tin tức", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <div 
      className="bg-white rounded-4 shadow p-4 animate-fade-in" 
      style={{ 
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)', 
        border: '1px solid rgba(255, 255, 255, 1)',
        transform: 'translateY(-10px)'
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0 text-dark">
          <i className="fas fa-bolt text-warning me-2"></i>Tin Nổi Bật
        </h6>
        <Link to="/blog" className="text-primary text-decoration-none small fw-bold">Xem tất cả</Link>
      </div>
      
      <div className="d-flex flex-column gap-3 mt-3">
        {posts.length > 0 ? posts.map(post => (
          <Link to="/blog" key={post.id} className="d-flex gap-3 align-items-center text-decoration-none transition-hover p-2 rounded bg-light border border-white shadow-sm">
            {post.imageUrl ? (
              <img src={post.imageUrl} alt={post.title} className="rounded-3 shadow-sm" style={{ width: '55px', height: '55px', objectFit: 'cover' }} />
            ) : (
              <div className="rounded-3 bg-secondary text-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: '55px', height: '55px' }}>
                <i className="fas fa-newspaper"></i>
              </div>
            )}
            <div className="overflow-hidden">
              <div className="mb-1 fw-bold text-dark text-truncate" style={{ fontSize: '0.85rem' }}>{post.title}</div>
              <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                {new Date(post.createdDate).toLocaleDateString('vi-VN')}
              </small>
            </div>
          </Link>
        )) : (
          <p className="text-muted small mb-0 text-center py-3">Chưa có tin tức nào.</p>
        )}
      </div>
    </div>
  );
}

export default HeroBlogWidget;
