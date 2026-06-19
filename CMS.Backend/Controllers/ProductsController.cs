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
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =================================================================
        // 1. GET: api/products (Lấy danh sách sản phẩm - KHÔNG BỊ LẶP)
        // =================================================================
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            try
            {
                // Sử dụng .Select() để bóc tách các trường cần thiết, ngắt hoàn toàn liên kết ngược
                var products = await _context.Products
                    .AsNoTracking()
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Price,
                        p.StockQuantity,
                        p.Description,
                        p.ImageUrl,
                        p.CategoryProductId,
                        // Chỉ bốc tách thông tin danh mục cơ bản, bỏ qua list sản phẩm liên kết ngược
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
        // 2. GET: api/products/{id} (Lấy chi tiết 1 sản phẩm - KHÔNG BỊ LẶP)
        // =================================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            try
            {
                var product = await _context.Products
                    .AsNoTracking()
                    .Where(p => p.Id == id)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Price,
                        p.StockQuantity,
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
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        // =================================================================
        // 3. POST: api/products (Thêm mới sản phẩm)
        // =================================================================
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] Product product)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Khi tạo mới, Frontend chỉ truyền dữ liệu thô (ví dụ: CategoryProductId), 
                // hãy chắc chắn thuộc tính object liên kết được set về null để tránh EF hiểu lầm
                product.CategoryProduct = null;

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                // Trả về Route xem chi tiết của sản phẩm vừa tạo
                return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi thêm sản phẩm: {ex.Message}");
            }
        }

        // =================================================================
        // 4. PUT: api/products/{id} (Cập nhật sản phẩm)
        // =================================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] Product product)
        {
            if (id != product.Id)
                return BadRequest(new { message = "ID sản phẩm không trùng khớp với đường dẫn URL" });

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Ngắt object liên kết để tránh lỗi tracking hoặc đè dữ liệu danh mục khi chỉ sửa sản phẩm
            product.CategoryProduct = null;
            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Products.Any(e => e.Id == id))
                {
                    return NotFound(new { message = $"Không tìm thấy sản phẩm có ID = {id} để cập nhật" });
                }
                throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi cập nhật sản phẩm: {ex.Message}");
            }

            return NoContent(); // Trả về 204 tượng trưng cho cập nhật thành công và không cần trả nội dung
        }

        // =================================================================
        // 5. DELETE: api/products/{id} (Xóa sản phẩm)
        // =================================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return NotFound(new { message = $"Không tìm thấy sản phẩm có ID = {id} để xóa" });
                }

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();

                return Ok(new { message = $"Đã xóa thành công sản phẩm có ID = {id}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi khi xóa sản phẩm: {ex.Message}");
            }
        }
    }
}

