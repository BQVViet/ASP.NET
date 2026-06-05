using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using CMS.Data;
using CMS.Data.Entities; // Đảm bảo namespace này chứa thực thể CategoryProduct thực tế của bạn

namespace CMS.Backend.Controllers
{
    // 1. Định nghĩa đường dẫn gọi API. Thực tế sẽ là: https://localhost:xxxx/api/categoriesproducts
    [Route("api/[controller]")]

    // 2. Kích hoạt tính năng tự động kiểm tra dữ liệu đầu vào (Model Validation)
    [ApiController]

    // 3. Kế thừa ControllerBase tối ưu cho kiến trúc Web API trả về dữ liệu JSON
    public class CategoriesProductsController : ControllerBase
    {
        // 4. Khai báo thực thể kết nối Cơ sở dữ liệu (Read-only)
        private readonly ApplicationDbContext _context;

        // 5. Hàm khởi tạo: Inject DBContext từ hệ thống vào Controller
        public CategoriesProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =================================================================
        // 1. GET: api/categoriesproducts (Lấy danh sách toàn bộ danh mục sản phẩm)
        // URL thử nghiệm: GET https://localhost:xxxx/api/categoriesproducts
        // =================================================================
        [HttpGet]
        public async Task<IActionResult> GetCategoriesProducts()
        {
            try
            {
                // Sử dụng AsNoTracking() để tăng tốc độ truy vấn đối với tác vụ chỉ đọc dữ liệu
                var categoriesProducts = await _context.CategoriesProducts
                    .AsNoTracking()
                    .ToListAsync();

                return Ok(categoriesProducts);
            }
            catch (Exception ex)
            {
                // Trả về mã lỗi 500 nếu có sự cố kết nối database
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        // =================================================================
        // 2. GET: api/categoriesproducts/{id} (Lấy chi tiết một danh mục sản phẩm theo ID)
        // URL thử nghiệm: GET https://localhost:xxxx/api/categoriesproducts/5
        // =================================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryProductById(int id)
        {
            var categoryProduct = await _context.CategoriesProducts.FindAsync(id);

            // Nếu không tìm thấy ID khớp, trả về lỗi 404 chuẩn REST
            if (categoryProduct == null)
            {
                return NotFound(new { message = $"Không tìm thấy danh mục sản phẩm có ID = {id}" });
            }

            return Ok(categoryProduct);
        }

        // =================================================================
        // 3. POST: api/categoriesproducts (Tạo mới một danh mục sản phẩm)
        // URL thử nghiệm: POST https://localhost:xxxx/api/categoriesproducts (Dữ liệu trong Body)
        // =================================================================
        [HttpPost]
        public async Task<IActionResult> CreateCategoryProduct([FromBody] CategoryProduct categoryProduct)
        {
            // Nếu dữ liệu gửi lên sai cấu trúc Model định nghĩa
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Trả về lỗi 400 Bad Request
            }

            _context.CategoriesProducts.Add(categoryProduct);
            await _context.SaveChangesAsync();

            // Trả về mã trạng thái 201 Created kèm URL dẫn tới vị trí danh mục vừa tạo
            return CreatedAtAction(nameof(GetCategoryProductById), new { id = categoryProduct.Id }, categoryProduct);
        }

        // =================================================================
        // 4. PUT: api/categoriesproducts/{id} (Cập nhật thông tin danh mục sản phẩm)
        // URL thử nghiệm: PUT https://localhost:xxxx/api/categoriesproducts/5
        // =================================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategoryProduct(int id, [FromBody] CategoryProduct categoryProduct)
        {
            // Kiểm tra tính đồng nhất của ID trên đường dẫn và trong Body dữ liệu gửi lên
            if (id != categoryProduct.Id)
            {
                return BadRequest(new { message = "ID đường dẫn và ID dữ liệu truyền lên không khớp" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Đánh dấu thực thể này đã bị thay đổi để EF Core cập nhật vào DB
            _context.Entry(categoryProduct).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // Xử lý xung đột dữ liệu nếu danh mục bị xóa bởi luồng khác lúc đang cập nhật
                if (!_context.CategoriesProducts.Any(e => e.Id == id))
                {
                    return NotFound(new { message = "Danh mục sản phẩm không tồn tại trên hệ thống để cập nhật" });
                }
                throw;
            }

            // Trả về mã phản hồi thành công trống dữ liệu 204 chuẩn REST
            return NoContent();
        }

        // =================================================================
        // 5. DELETE: api/categoriesproducts/{id} (Xóa danh mục sản phẩm)
        // URL thử nghiệm: DELETE https://localhost:xxxx/api/categoriesproducts/5
        // =================================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoryProduct(int id)
        {
            var categoryProduct = await _context.CategoriesProducts.FindAsync(id);
            if (categoryProduct == null)
            {
                return NotFound(new { message = "Danh mục sản phẩm đã bị xóa trước đó hoặc không tồn tại" });
            }

            // Lưu ý nghiệp vụ: Nếu danh mục này đang chứa các sản phẩm (bảng Products phụ thuộc khóa ngoại),
            // việc xóa thẳng tay sẽ bị chặn bởi Database (Foreign Key Constraint).
            // Bạn nên chuyển sản phẩm sang danh mục khác hoặc báo lỗi nếu danh mục vẫn còn chứa sản phẩm.
            _context.CategoriesProducts.Remove(categoryProduct);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa danh mục sản phẩm thành công" });
        }
    }
}