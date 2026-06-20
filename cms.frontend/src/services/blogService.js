// src/services/blogService.js
import axiosClient from '../api/axiosClient';

/**
 * Fetch all blog posts.
 * @returns {Promise<Array>} Promise that resolves to an array of blog posts.
 */
export const getPosts = async (limit = null) => {
  const url = limit ? `/posts?latest=true` : '/posts';
  const response = await axiosClient.get(url);
  return response.data;
};

export const getPostById = async (id) => {
  const response = await axiosClient.get(`/posts/${id}`);
  return response.data;
};

/**
 * Fetch blog categories.
 * @returns {Promise<Array>} Promise that resolves to an array of categories.
 */
export const getBlogCategories = async () => {
  const response = await axiosClient.get('/categories');
  return response.data;
};
