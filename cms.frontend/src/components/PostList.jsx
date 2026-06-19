// src/components/PostList.jsx
import React, { useEffect, useState } from 'react';
import { getPosts } from '../services/blogService';
import { Row, Col, Card, Spinner } from 'react-bootstrap';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPosts()
      .then(res => setPosts(res))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error)   return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {posts.map(post => (
        <Col key={post.id}>
          <Card className="h-100 shadow-sm">
            {post.imageUrl && <Card.Img variant="top" src={post.imageUrl} alt={post.title} />}
            <Card.Body>
              <Card.Title>{post.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {new Date(post.createdDate).toLocaleDateString()}
              </Card.Subtitle>
              <Card.Text className="text-truncate" style={{ maxHeight: '4rem' }}>
                {post.content}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default PostList;
