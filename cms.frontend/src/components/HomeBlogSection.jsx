import React, { useState } from 'react';
import { Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PostList from './PostList';

function HomeBlogSection() {
  const [activeBlogCategory, setActiveBlogCategory] = useState('Tất cả');
  const blogCategories = ['Tất cả', 'Mẹo vặt', 'Đánh giá', 'Khuyến mãi'];

  return (
    <Container id="news" className="mb-5 pb-5 pt-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 border-bottom pb-3">
        <h2 className="fw-bold mb-3 mb-md-0 text-dark">
          <i className="fas fa-newspaper text-info me-2"></i>Tin Tức & Mẹo Vặt
        </h2>
        
        {/* Blog Categories Tabs */}
        <Nav variant="pills" className="d-flex gap-2">
          {blogCategories.map((cat, idx) => (
            <Nav.Item key={idx}>
              <Nav.Link 
                className={`rounded-pill px-4 fw-medium ${activeBlogCategory === cat ? 'bg-primary text-white shadow-sm' : 'bg-light text-dark transition-hover'}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveBlogCategory(cat)}
              >
                {cat}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </div>
      
      {/* Replace with actual filtered PostList when backend supports it */}
      <PostList />
      
      {/* Xem them button removed since this is the main blog page */}
    </Container>
  );
}

export default HomeBlogSection;
