using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using CMS.Data;
using CMS.Data.Entities; // Đảm bảo namespace này chứa thực thể Order thực tế của bạn

namespace CMS.Backend.Controllers
{
    // 1. Định nghĩa đường dẫn gọi API. Thực tế sẽ là: https://localhost:xxxx/api/orders
    [Route("api/[controller]")]

    // 2. Kích hoạt tính năng tự động kiểm tra dữ liệu đầu vào (Model Validation)
    [ApiController]

    // 3. Kế thừa ControllerBase để tối ưu cho cấu trúc Web API
    public class OrdersController : ControllerBase
    {
        // 4. Khai báo thực thể kết nối Cơ sở dữ liệu (Read-only)
        private readonly ApplicationDbContext _context;

        // 5. Hàm khởi tạo: Inject DBContext từ hệ thống vào Controller
        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =================================================================
        // 1. GET: api/orders (Lấy danh sách đơn hàng kèm thông tin khách hàng)
        // URL thử nghiệm: GET https://localhost:xxxx/api/orders
        // =================================================================
        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            try
            {
                // Sử dụng Include để lấy kèm thông tin Khách hàng (Customer) đặt đơn đó
                var orders = await _context.Orders
                    .Include(o => o.Customer)
                    .AsNoTracking()
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        // =================================================================
        // 2. GET: api/orders/{id} (Lấy chi tiết một đơn hàng theo ID)
        // URL thử nghiệm: GET https://localhost:xxxx/api/orders/5
        // =================================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound(new { message = $"Không tìm thấy đơn hàng có ID = {id}" });
            }

            return Ok(order);
        }

        // =================================================================
        // 3. POST: api/orders (Tạo mới một đơn hàng)
        // URL thử nghiệm: POST https://localhost:xxxx/api/orders (Dữ liệu trong Body)
        // =================================================================
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Tự động ghi nhận thời gian đặt hàng nếu phía Client không truyền lên
            if (order.OrderDate == default)
            {
                order.OrderDate = DateTime.Now;
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
        }

        // =================================================================
        // 4. PUT: api/orders/{id} (Cập nhật trạng thái / thông tin đơn hàng)
        // URL thử nghiệm: PUT https://localhost:xxxx/api/orders/5
        // =================================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] Order order)
        {
            if (id != order.Id)
            {
                return BadRequest(new { message = "ID đường dẫn và ID dữ liệu truyền lên không khớp" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Orders.Any(e => e.Id == id))
                {
                    return NotFound(new { message = "Đơn hàng không tồn tại trên hệ thống để cập nhật" });
                }
                throw;
            }

            return NoContent();
        }

        // =================================================================
        // 5. DELETE: api/orders/{id} (Xóa đơn hàng)
        // URL thử nghiệm: DELETE https://localhost:xxxx/api/orders/5
        // =================================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound(new { message = "Đơn hàng đã bị xóa trước đó hoặc không tồn tại" });
            }

            // Lưu ý: Đơn hàng này thường có ràng buộc khóa ngoại chặt chẽ với bảng OrderDetails.
            // Nếu bạn muốn xóa đơn hàng, bạn cần cấu hình xóa Cascade trong DB 
            // hoặc chủ động xóa các bản ghi liên quan trong bảng OrderDetails trước.
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa đơn hàng thành công" });
        }
    }
}