// src/services/categoryProductService.ts
import axiosClient from '../api/axiosClient';

export const getCategories = async () => {
  const response = await axiosClient.get('/categories');
  return response.data;
};

export const getCategoriesProducts = async () => {
  const response = await axiosClient.get('/categoriesproducts');
  return response.data;
};
