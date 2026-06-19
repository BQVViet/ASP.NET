import axios from 'axiosClient';

// Khởi tạo một thực thể axios với cấu hình base chung
const axiosClient = axios.create({
    baseURL: 'https://localhost:7001/api', // ĐỔI LẠI ĐÚNG PORT BACKEND THỰC TẾ CỦA MÁY CÁC EM
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Thời gian tối đa chờ phản hồi từ server (10 giây)
});

// Interceptor: Xử lý dữ liệu tập trung trước khi trả về cho các Component
axiosClient.interceptors.response.use(
    (response) => {
        // Nếu phản hồi thành công, bóc tách lấy thẳng cục dữ liệu (data) bên trong JSON
        return response.data;
    },
    (error) => {
        // Xử lý các lỗi hệ thống tập trung tại đây (Ví dụ: Server sập, lỗi 404, lỗi 500)
        console.error('Lỗi kết nối API:', error.message);
        return Promise.reject(error);
    }
);

export default axiosClient;