// src/services/blogService.js
import axiosClient from '../api/axiosClient';

/**
 * Fetch all blog posts.
 * @returns {Promise<Array>} Promise that resolves to an array of blog posts.
 */
export const getPosts = async () => {
  const response = await axiosClient.get('/posts');
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
