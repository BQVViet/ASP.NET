import axiosClient from '../api/axiosClient';

const categoryProductService = {
    /**
     * Hàm lấy toàn bộ danh mục SẢN PHẨM từ Backend
     */
    getAllCategoryProducts: () => {
        // Đường dẫn khớp chính xác với [Route("api/[controller]")] của CategoriesProductsController
        const url = '/categoriesproducts';
        return axiosClient.get(url);
    }
};

export default categoryProductService;
