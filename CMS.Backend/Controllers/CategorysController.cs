using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using CMS.Data;
using CMS.Data.Entities; // Ð?m b?o namespace này ch?a th?c th? Category th?c t? c?a b?n

namespace CMS.Backend.Controllers
{
    // 1. Ð?nh nghia du?ng d?n g?i API. Th?c t? s? là: https://localhost:xxxx/api/categories
    [Route("api/[controller]")]

    // 2. Kích ho?t tính nang ki?m tra d? li?u d?u vào t? d?ng (Model Validation)
    [ApiController]

    // 3. K? th?a ControllerBase d? t?i uu cho ki?n trúc Web API (Không x? lý View giao di?n)
    public class CategoriesController : ControllerBase
    {
        // 4. Khai báo th?c th? k?t n?i Co s? d? li?u (Read-only)
        private readonly ApplicationDbContext _context;

        // 5. Hàm kh?i t?o: Inject DBContext t? h? th?ng vào Controller
        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =================================================================
        // 1. GET: api/categories (L?y danh sách toàn b? danh m?c bài vi?t)
        // URL th? nghi?m: GET https://localhost:xxxx/api/categories
        // =================================================================
        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                // S? d?ng AsNoTracking() giúp tang t?c d? truy v?n d?i v?i tác v? ch? d?c d? li?u
                var categories = await _context.Categories
                    .AsNoTracking()
                    .ToListAsync();

                return Ok(categories);
            }
            catch (Exception ex)
            {
                // Tr? v? mã l?i 500 n?u có s? c? k?t n?i database
                return StatusCode(500, $"L?i h? th?ng: {ex.Message}");
            }
        }

        // =================================================================
        // 2. GET: api/categories/{id} (L?y chi ti?t m?t danh m?c theo ID)
        // URL th? nghi?m: GET https://localhost:xxxx/api/categories/5
        // =================================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            // N?u không tìm th?y ID kh?p, tr? v? l?i 404 chu?n REST
            if (category == null)
            {
                return NotFound(new { message = $"Không tìm th?y danh m?c có ID = {id}" });
            }

            return Ok(category);
        }

        // =================================================================
        // 3. POST: api/categories (T?o m?i m?t danh m?c)
        // URL th? nghi?m: POST https://localhost:xxxx/api/categories (D? li?u trong Body)
        // =================================================================
        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] Category category)
        {
            // N?u d? li?u g?i lên sai c?u trúc Model d?nh nghia
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Tr? v? l?i 400 Bad Request
            }

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            // Tr? v? mã tr?ng thái 201 Created kèm URL d?n t?i v? trí danh m?c v?a t?o
            return CreatedAtAction(nameof(GetCategoryById), new { id = category.Id }, category);
        }

        // =================================================================
        // 4. PUT: api/categories/{id} (C?p nh?t thông tin danh m?c)
        // URL th? nghi?m: PUT https://localhost:xxxx/api/categories/5
        // =================================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] Category category)
        {
            // Ki?m tra tính d?ng nh?t c?a ID trên du?ng d?n và trong Body d? li?u g?i lên
            if (id != category.Id)
            {
                return BadRequest(new { message = "ID du?ng d?n và ID d? li?u truy?n lên không kh?p" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Ðánh d?u th?c th? category này dã b? thay d?i d? EF Core c?p nh?t
            _context.Entry(category).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // X? lý xung d?t d? li?u n?u danh m?c b? xóa b?i lu?ng khác lúc dang c?p nh?t
                if (!_context.Categories.Any(e => e.Id == id))
                {
                    return NotFound(new { message = "Danh m?c không t?n t?i trên h? th?ng d? c?p nh?t" });
                }
                throw;
            }

            // Tr? v? mã ph?n h?i thành công tr?ng d? li?u 204 chu?n REST
            return NoContent();
        }

        // =================================================================
        // 5. DELETE: api/categories/{id} (Xóa danh m?c kh?i co s? d? li?u)
        // URL th? nghi?m: DELETE https://localhost:xxxx/api/categories/5
        // =================================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound(new { message = "Danh m?c dã b? xóa tru?c dó ho?c không t?n t?i" });
            }

            // Luu ý: N?u có ràng bu?c khóa ngo?i v?i b?ng Posts, b?n c?n x? lý 
            // xóa các bài vi?t liên quan ho?c báo l?i tru?c khi xóa danh m?c này.
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa danh m?c thành công" });
        }
    }
}

