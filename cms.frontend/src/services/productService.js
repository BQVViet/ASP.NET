import axiosClient from '../api/axiosClient';

export const getAllProducts = async () => {
  const response = await axiosClient.get('/products');
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axiosClient.get(`/products/${id}`);
  return response.data;
};
