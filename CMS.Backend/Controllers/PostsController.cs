using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =================================================================
        // 1. GET: api/posts (SỬA LỖI: Sử dụng Select để ngắt vòng lặp JSON)
        // =================================================================
        [HttpGet]
        public async Task<IActionResult> GetPosts([FromQuery] bool latest = false)
        {
            try
            {
                // Dùng .Select() để ánh xạ sang một Object ẩn danh (Anonymous Object)
                // Cách này bóc tách dữ liệu ra khỏi thực thể gốc, loại bỏ hoàn toàn lỗi "object cycle"
                var query = _context.Posts.AsNoTracking().Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Content,
                    p.ImageUrl,
                    p.CreatedDate,
                    p.CategoryId,
                    // Chỉ lấy các thông tin cần thiết từ Category, không bê nguyên cả thực thể Category vào
                    Category = new
                    {
                        p.Category.Id,
                        p.Category.Name,
                        p.Category.Description
                    }
                });

                if (latest)
                {
                    var latestPosts = await query
                        .OrderByDescending(p => p.CreatedDate)
                        .Take(3)
                        .ToListAsync();
                    return Ok(latestPosts);
                }

                var allPosts = await query.OrderByDescending(p => p.CreatedDate).ToListAsync();
                return Ok(allPosts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        // =================================================================
        // 2. GET: api/posts/{id} (SỬA LỖI: Dùng Select để ngắt vòng lặp chi tiết)
        // =================================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPostById(int id)
        {
            var post = await _context.Posts
                .AsNoTracking()
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Content,
                    p.ImageUrl,
                    p.CreatedDate,
                    p.CategoryId,
                    Category = new
                    {
                        p.Category.Id,
                        p.Category.Name,
                        p.Category.Description
                    }
                })
                .FirstOrDefaultAsync();

            if (post == null)
            {
                return NotFound(new { message = $"Không tìm thấy bài viết có ID = {id}" });
            }

            return Ok(post);
        }

        // =================================================================
        // 3. POST: api/posts (Giữ nguyên - Nhận thực thể Post để thêm mới)
        // =================================================================
        [HttpPost]
        public async Task<IActionResult> CreatePost([FromBody] Post post)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            post.CreatedDate = DateTime.Now;

            _context.Posts.Add(post);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPostById), new { id = post.Id }, post);
        }

        // =================================================================
        // 4. PUT: api/posts/{id} (Giữ nguyên - Cập nhật thực thể Post)
        // =================================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(int id, [FromBody] Post post)
        {
            if (id != post.Id)
            {
                return BadRequest(new { message = "ID đường dẫn và ID dữ liệu truyền lên không khớp" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(post).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Posts.Any(e => e.Id == id))
                {
                    return NotFound(new { message = "Bài viết không tồn tại trên hệ thống để cập nhật" });
                }
                throw;
            }

            return NoContent();
        }

        // =================================================================
        // 5. DELETE: api/posts/{id} (Giữ nguyên)
        // =================================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                return NotFound(new { message = "Bài viết đã bị xóa trước đó hoặc không tồn tại" });
            }

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa bài viết thành công" });
        }
    }
}