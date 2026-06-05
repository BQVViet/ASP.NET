using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using CMS.Data;
using CMS.Data.Entities; // Đảm bảo namespace này chứa thực thể Customer thực tế của bạn

namespace CMS.Backend.Controllers
{
    // 1. Định nghĩa đường dẫn gọi API. Thực tế sẽ là: https://localhost:xxxx/api/customers
    [Route("api/[controller]")]

    // 2. Kích hoạt tính năng tự động kiểm tra dữ liệu đầu vào (Model Validation)
    [ApiController]

    // 3. Kế thừa ControllerBase tối ưu cho kiến trúc Web API phục vụ dữ liệu dạng JSON
    public class CustomersController : ControllerBase
    {
        // 4. Khai báo thực thể kết nối Cơ sở dữ liệu (Read-only)
        private readonly ApplicationDbContext _context;

        // 5. Hàm khởi tạo: Inject DBContext từ hệ thống vào Controller
        public CustomersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =================================================================
        // 1. GET: api/customers (Lấy danh sách toàn bộ khách hàng)
        // URL thử nghiệm: GET https://localhost:xxxx/api/customers
        // =================================================================
        [HttpGet]
        public async Task<IActionResult> GetCustomers()
        {
            try
            {
                // Sử dụng AsNoTracking() để tăng tốc độ truy vấn đối với tác vụ chỉ đọc dữ liệu
                var customers = await _context.Customers
                    .AsNoTracking()
                    .ToListAsync();

                return Ok(customers);
            }
            catch (Exception ex)
            {
                // Trả về mã lỗi 500 nếu có sự cố kết nối database
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        // =================================================================
        // 2. GET: api/customers/{id} (Lấy chi tiết một khách hàng theo ID)
        // URL thử nghiệm: GET https://localhost:xxxx/api/customers/5
        // =================================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomerById(int id)
        {
            var customer = await _context.Customers.FindAsync(id);

            // Nếu không tìm thấy ID khớp, trả về lỗi 404 chuẩn REST
            if (customer == null)
            {
                return NotFound(new { message = $"Không tìm thấy khách hàng có ID = {id}" });
            }

            return Ok(customer);
        }

        // =================================================================
        // 3. POST: api/customers (Tạo mới một khách hàng / Đăng ký tài khoản)
        // URL thử nghiệm: POST https://localhost:xxxx/api/customers (Dữ liệu gửi trong Body)
        // =================================================================
        [HttpPost]
        public async Task<IActionResult> CreateCustomer([FromBody] Customer customer)
        {
            // Nếu dữ liệu gửi lên sai cấu trúc Model định nghĩa
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Trả về lỗi 400 Bad Request
            }

            // Lưu ý: Trong thực tế, bạn nên mã hóa mật khẩu (bằng BCrypt hoặc Identity PasswordHasher) 
            // trước khi lưu vào database: customer.Password = PasswordHasher.Hash(customer.Password);

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            // Trả về mã trạng thái 201 Created kèm URL dẫn tới vị trí khách hàng vừa tạo
            return CreatedAtAction(nameof(GetCustomerById), new { id = customer.Id }, customer);
        }

        // =================================================================
        // 4. PUT: api/customers/{id} (Cập nhật thông tin khách hàng)
        // URL thử nghiệm: PUT https://localhost:xxxx/api/customers/5
        // =================================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] Customer customer)
        {
            // Kiểm tra tính đồng nhất của ID trên đường dẫn và trong Body dữ liệu gửi lên
            if (id != customer.Id)
            {
                return BadRequest(new { message = "ID đường dẫn và ID dữ liệu truyền lên không khớp" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Đánh dấu thực thể customer này đã bị thay đổi để EF Core cập nhật
            _context.Entry(customer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Xử lý xung đột dữ liệu nếu khách hàng bị xóa bởi luồng khác lúc đang cập nhật
                if (!_context.Customers.Any(e => e.Id == id))
                {
                    return NotFound(new { message = "Khách hàng không tồn tại trên hệ thống để cập nhật" });
                }
                throw;
            }

            // Trả về mã phản hồi thành công trống dữ liệu 204 chuẩn REST
            return NoContent();
        }

        // =================================================================
        // 5. DELETE: api/customers/{id} (Xóa tài khoản khách hàng)
        // URL thử nghiệm: DELETE https://localhost:xxxx/api/customers/5
        // =================================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound(new { message = "Khách hàng đã bị xóa trước đó hoặc không tồn tại" });
            }

            // Lưu ý: Nếu khách hàng này đã có đơn hàng bên bảng Orders, 
            // DB sẽ báo lỗi khóa ngoại (Foreign Key Constraint). 
            // Bạn có thể xử lý xóa cascade hoặc báo lỗi cho Client tùy theo nghiệp vụ.
            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa thông tin khách hàng thành công" });
        }
    }
}