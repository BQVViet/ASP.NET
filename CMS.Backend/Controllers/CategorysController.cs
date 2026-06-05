using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using CMS.Data;
using CMS.Data.Entities; // Đảm bảo namespace này chứa thực thể Category thực tế của bạn

namespace CMS.Backend.Controllers
{
    // 1. Định nghĩa đường dẫn gọi API. Thực tế sẽ là: https://localhost:xxxx/api/categories
    [Route("api/[controller]")]

    // 2. Kích hoạt tính năng kiểm tra dữ liệu đầu vào tự động (Model Validation)
    [ApiController]

    // 3. Kế thừa ControllerBase để tối ưu cho kiến trúc Web API (Không xử lý View giao diện)
    public class CategoriesController : ControllerBase
    {
        // 4. Khai báo thực thể kết nối Cơ sở dữ liệu (Read-only)
        private readonly ApplicationDbContext _context;

        // 5. Hàm khởi tạo: Inject DBContext từ hệ thống vào Controller
        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =================================================================
        // 1. GET: api/categories (Lấy danh sách toàn bộ danh mục bài viết)
        // URL thử nghiệm: GET https://localhost:xxxx/api/categories
        // =================================================================
        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                // Sử dụng AsNoTracking() giúp tăng tốc độ truy vấn đối với tác vụ chỉ đọc dữ liệu
                var categories = await _context.Categories
                    .AsNoTracking()
                    .ToListAsync();

                return Ok(categories);
            }
            catch (Exception ex)
            {
                // Trả về mã lỗi 500 nếu có sự cố kết nối database
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        // =================================================================
        // 2. GET: api/categories/{id} (Lấy chi tiết một danh mục theo ID)
        // URL thử nghiệm: GET https://localhost:xxxx/api/categories/5
        // =================================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            // Nếu không tìm thấy ID khớp, trả về lỗi 404 chuẩn REST
            if (category == null)
            {
                return NotFound(new { message = $"Không tìm thấy danh mục có ID = {id}" });
            }

            return Ok(category);
        }

        // =================================================================
        // 3. POST: api/categories (Tạo mới một danh mục)
        // URL thử nghiệm: POST https://localhost:xxxx/api/categories (Dữ liệu trong Body)
        // =================================================================
        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] Category category)
        {
            // Nếu dữ liệu gửi lên sai cấu trúc Model định nghĩa
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Trả về lỗi 400 Bad Request
            }

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            // Trả về mã trạng thái 201 Created kèm URL dẫn tới vị trí danh mục vừa tạo
            return CreatedAtAction(nameof(GetCategoryById), new { id = category.Id }, category);
        }

        // =================================================================
        // 4. PUT: api/categories/{id} (Cập nhật thông tin danh mục)
        // URL thử nghiệm: PUT https://localhost:xxxx/api/categories/5
        // =================================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] Category category)
        {
            // Kiểm tra tính đồng nhất của ID trên đường dẫn và trong Body dữ liệu gửi lên
            if (id != category.Id)
            {
                return BadRequest(new { message = "ID đường dẫn và ID dữ liệu truyền lên không khớp" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Đánh dấu thực thể category này đã bị thay đổi để EF Core cập nhật
            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Xử lý xung đột dữ liệu nếu danh mục bị xóa bởi luồng khác lúc đang cập nhật
                if (!_context.Categories.Any(e => e.Id == id))
                {
                    return NotFound(new { message = "Danh mục không tồn tại trên hệ thống để cập nhật" });
                }
                throw;
            }

            // Trả về mã phản hồi thành công trống dữ liệu 204 chuẩn REST
            return NoContent();
        }

        // =================================================================
        // 5. DELETE: api/categories/{id} (Xóa danh mục khỏi cơ sở dữ liệu)
        // URL thử nghiệm: DELETE https://localhost:xxxx/api/categories/5
        // =================================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound(new { message = "Danh mục đã bị xóa trước đó hoặc không tồn tại" });
            }

            // Lưu ý: Nếu có ràng buộc khóa ngoại với bảng Posts, bạn cần xử lý 
            // xóa các bài viết liên quan hoặc báo lỗi trước khi xóa danh mục này.
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa danh mục thành công" });
        }
    }
}