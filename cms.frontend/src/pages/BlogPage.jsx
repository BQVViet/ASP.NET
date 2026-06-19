import React from 'react';
import PostList from '../components/PostList';

function BlogPage() {
  return (
    <div className="container py-5">
      <h1 className="mb-4 text-primary">Blog</h1>
      <PostList />
    </div>
  );
}

export default BlogPage;
