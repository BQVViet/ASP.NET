using Microsoft.AspNetCore.Authorization;
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
        // 1. GET: api/posts (S?A L?I: S? d?ng Select d? ng?t vòng l?p JSON)
        // =================================================================
        [HttpGet]
        public async Task<IActionResult> GetPosts([FromQuery] bool latest = false)
        {
            try
            {
                // Dùng .Select() d? ánh x? sang m?t Object ?n danh (Anonymous Object)
                // Cách này bóc tách d? li?u ra kh?i th?c th? g?c, lo?i b? hoàn toàn l?i "object cycle"
                var query = _context.Posts.AsNoTracking().Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Content,
                    p.ImageUrl,
                    p.CreatedDate,
                    p.CategoryId,
                    // Ch? l?y các thông tin c?n thi?t t? Category, không bê nguyên c? th?c th? Category vào
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
                return StatusCode(500, $"L?i h? th?ng: {ex.Message}");
            }
        }

        // =================================================================
        // 2. GET: api/posts/{id} (S?A L?I: Dùng Select d? ng?t vòng l?p chi ti?t)
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
                return NotFound(new { message = $"Không tìm th?y bài vi?t có ID = {id}" });
            }

            return Ok(post);
        }

        // =================================================================
        // 3. POST: api/posts (Gi? nguyên - Nh?n th?c th? Post d? thêm m?i)
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
        // 4. PUT: api/posts/{id} (Gi? nguyên - C?p nh?t th?c th? Post)
        // =================================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(int id, [FromBody] Post post)
        {
            if (id != post.Id)
            {
                return BadRequest(new { message = "ID du?ng d?n và ID d? li?u truy?n lên không kh?p" });
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
                    return NotFound(new { message = "Bài vi?t không t?n t?i trên h? th?ng d? c?p nh?t" });
                }
                throw;
            }

            return NoContent();
        }

        // =================================================================
        // 5. DELETE: api/posts/{id} (Gi? nguyên)
        // =================================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var post = await _context.Posts.FindAsync(id);
            if (post == null)
            {
                return NotFound(new { message = "Bài vi?t dã b? xóa tru?c dó ho?c không t?n t?i" });
            }

            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa bài vi?t thành công" });
        }
    }
}

