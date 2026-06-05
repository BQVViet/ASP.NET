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
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =================================================================
        // 1. GET: api/products (SỬA LỖI: Dùng Select bóc tách cấu trúc vòng lặp)
        // =================================================================
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            try
            {
                // Sử dụng .Select() để tạo một cấu trúc JSON phẳng, sạch sẽ
                // Ngắt hoàn toàn liên kết vòng lặp từ CategoryProduct quay lại Products
                var products = await _context.Products
                    .AsNoTracking()
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Price,
                        p.Quantity,
                        p.Description,
                        p.ImageUrl,
                        p.CategoryProductId,
                        // Chỉ bốc tách các trường cần dùng của danh mục, không lấy danh sách liên kết ngược
                        CategoryProduct = p.CategoryProduct != null ? new
                        {
                            p.CategoryProduct.Id,
                            p.CategoryProduct.Name,
                            p.CategoryProduct.Description
                        } : null
                    })
                    .ToListAsync();

                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        // =================================================================
        // 2. GET: api/products/{id} (SỬA LỖI: Áp dụng tương tự cho chi tiết)
        // =================================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _context.Products
                .AsNoTracking()
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.Quantity,
                    p.Description,
                    p.ImageUrl,
                    p.CategoryProductId,
                    CategoryProduct = p.CategoryProduct != null ? new
                    {
                        p.CategoryProduct.Id,
                        p.CategoryProduct.Name,
                        p.CategoryProduct.Description
                    } : null
                })
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound(new { message = $"Không tìm thấy sản phẩm có ID = {id}" });
            }

            return Ok(product);
        }

        // =================================================================
        // Các hàm POST, PUT, DELETE giữ nguyên như cũ...
        // =================================================================
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] Product product)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product product)
        {
            if (id != product.Id) return BadRequest(new { message = "ID không khớp" });
            if (!ModelState.IsValid) return BadRequest(ModelState);
            _context.Entry(product).State = EntityState.Modified;
            try { await _context.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Products.Any(e => e.Id == id)) return NotFound();
                throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Xóa thành công" });
        }
    }
}