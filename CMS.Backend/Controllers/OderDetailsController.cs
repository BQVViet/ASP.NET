using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using CMS.Data;
using CMS.Data.Entities; // Đảm bảo namespace này chứa thực thể OrderDetail thực tế của bạn

namespace CMS.Backend.Controllers
{
    // 1. Định nghĩa đường dẫn gọi API. Thực tế sẽ là: https://localhost:xxxx/api/orderdetails
    [Route("api/[controller]")]

    // 2. Kích hoạt tính năng tự động kiểm tra dữ liệu đầu vào (Model Validation)
    [ApiController]

    // 3. Kế thừa ControllerBase tối ưu cho kiến trúc Web API trả về dữ liệu JSON
    public class OrderDetailsController : ControllerBase
    {
        // 4. Khai báo thực thể kết nối Cơ sở dữ liệu (Read-only)
        private readonly ApplicationDbContext _context;

        // 5. Hàm khởi tạo: Inject DBContext từ hệ thống vào Controller
        public OrderDetailsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =================================================================
        // 1. GET: api/orderdetails (Lấy toàn bộ danh sách chi tiết các đơn hàng)
        // URL thử nghiệm: GET https://localhost:xxxx/api/orderdetails
        // =================================================================
        [HttpGet]
        public async Task<IActionResult> GetOrderDetails()
        {
            try
            {
                // Sử dụng Include để kéo theo thông tin Sản phẩm phục vụ cho giao diện hiển thị
                var orderDetails = await _context.OrderDetails
                    .Include(od => od.Product)
                    .AsNoTracking()
                    .ToListAsync();

                return Ok(orderDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        // =================================================================
        // 2. GET: api/orderdetails/by-order/{orderId} (Lấy danh sách sản phẩm thuộc một Đơn hàng cụ thể)
        // URL thử nghiệm: GET https://localhost:xxxx/api/orderdetails/by-order/1
        // =================================================================
        [HttpGet("by-order/{orderId}")]
        public async Task<IActionResult> GetOrderDetailsByOrderId(int orderId)
        {
            var details = await _context.OrderDetails
                .Include(od => od.Product)
                .Where(od => od.OrderId == orderId)
                .AsNoTracking()
                .ToListAsync();

            if (details == null || details.Count == 0)
            {
                return NotFound(new { message = $"Không tìm thấy chi tiết sản phẩm nào cho mã đơn hàng = {orderId}" });
            }

            return Ok(details);
        }

        // =================================================================
        // 3. GET: api/orderdetails/{id} (Lấy thông tin một dòng chi tiết theo ID)
        // URL thử nghiệm: GET https://localhost:xxxx/api/orderdetails/5
        // =================================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderDetailById(int id)
        {
            var orderDetail = await _context.OrderDetails
                .Include(od => od.Product)
                .FirstOrDefaultAsync(od => od.Id == id);

            if (orderDetail == null)
            {
                return NotFound(new { message = $"Không tìm thấy chi tiết đơn hàng có ID = {id}" });
            }

            return Ok(orderDetail);
        }

        // =================================================================
        // 4. POST: api/orderdetails (Thêm một sản phẩm vào đơn hàng)
        // URL thử nghiệm: POST https://localhost:xxxx/api/orderdetails (Dữ liệu trong Body)
        // =================================================================
        [HttpPost]
        public async Task<IActionResult> CreateOrderDetail([FromBody] OrderDetail orderDetail)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.OrderDetails.Add(orderDetail);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderDetailById), new { id = orderDetail.Id }, orderDetail);
        }

        // =================================================================
        // 5. PUT: api/orderdetails/{id} (Cập nhật số lượng / đơn giá trong chi tiết đơn hàng)
        // URL thử nghiệm: PUT https://localhost:xxxx/api/orderdetails/5
        // =================================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrderDetail(int id, [FromBody] OrderDetail orderDetail)
        {
            if (id != orderDetail.Id)
            {
                return BadRequest(new { message = "ID đường dẫn và ID dữ liệu truyền lên không khớp" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(orderDetail).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.OrderDetails.Any(e => e.Id == id))
                {
                    return NotFound(new { message = "Bản ghi chi tiết đơn hàng không tồn tại trên hệ thống" });
                }
                throw;
            }

            return NoContent();
        }

        // =================================================================
        // 6. DELETE: api/orderdetails/{id} (Xóa một sản phẩm khỏi đơn hàng)
        // URL thử nghiệm: DELETE https://localhost:xxxx/api/orderdetails/5
        // =================================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderDetail(int id)
        {
            var orderDetail = await _context.OrderDetails.FindAsync(id);
            if (orderDetail == null)
            {
                return NotFound(new { message = "Chi tiết đơn hàng không tồn tại hoặc đã bị xóa trước đó" });
            }

            _context.OrderDetails.Remove(orderDetail);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa mặt hàng khỏi hóa đơn thành công" });
        }
    }
}