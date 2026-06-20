// src/components/PostList.jsx
import React, { useEffect, useState } from 'react';
import { getPosts } from '../services/blogService';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function PostList({ limit }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPosts(limit)
      .then(res => setPosts(res))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [limit]);

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  const displayedPosts = posts;

  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '');
  };

  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {displayedPosts.map(post => (
        <Col key={post.id}>
          <Link to={`/blog/${post.id}`} className="text-decoration-none text-dark d-block h-100">
            <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden product-card">
              <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '220px', overflow: 'hidden' }}>
                {post.imageUrl ? (
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-100 h-100" 
                    style={{ objectFit: 'contain', padding: '1rem', backgroundColor: '#ffffff' }} 
                  />
                ) : (
                  <div className="text-muted"><i className="bi bi-image" style={{ fontSize: '3rem' }}></i></div>
                )}
              </div>
              <Card.Body className="d-flex flex-column p-4">
                <Card.Title className="fw-bold mb-3 text-dark" style={{ fontSize: '1.2rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.8rem' }}>
                  {post.title}
                </Card.Title>
                <Card.Subtitle className="mb-3 text-muted small">
                  <i className="fas fa-calendar-alt me-2"></i>
                  {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                </Card.Subtitle>
                <Card.Text className="text-secondary mb-2" style={{ fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '4.2rem' }}>
                  {stripHtml(post.content)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  );
}

export default PostList;
