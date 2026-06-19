using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using CMS.Data;
using CMS.Data.Entities; // Ð?m b?o namespace này ch?a th?c th? Order th?c t? c?a b?n

namespace CMS.Backend.Controllers
{
    // 1. Ð?nh nghia du?ng d?n g?i API. Th?c t? s? là: https://localhost:xxxx/api/orders
    [Route("api/[controller]")]

    // 2. Kích ho?t tính nang t? d?ng ki?m tra d? li?u d?u vào (Model Validation)
    [ApiController]

    // 3. K? th?a ControllerBase d? t?i uu cho c?u trúc Web API
    public class OrdersController : ControllerBase
    {
        // 4. Khai báo th?c th? k?t n?i Co s? d? li?u (Read-only)
        private readonly ApplicationDbContext _context;

        // 5. Hàm kh?i t?o: Inject DBContext t? h? th?ng vào Controller
        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =================================================================
        // 1. GET: api/orders (L?y danh sách don hàng kèm thông tin khách hàng)
        // URL th? nghi?m: GET https://localhost:xxxx/api/orders
        // =================================================================
        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            try
            {
                // S? d?ng Include d? l?y kèm thông tin Khách hàng (Customer) d?t don dó
                var orders = await _context.Orders
                    .Include(o => o.Customer)
                    .AsNoTracking()
                    .ToListAsync();

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"L?i h? th?ng: {ex.Message}");
            }
        }

        // =================================================================
        // 2. GET: api/orders/{id} (L?y chi ti?t m?t don hàng theo ID)
        // URL th? nghi?m: GET https://localhost:xxxx/api/orders/5
        // =================================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound(new { message = $"Không tìm th?y don hàng có ID = {id}" });
            }

            return Ok(order);
        }

        // =================================================================
        // 3. POST: api/orders (T?o m?i m?t don hàng)
        // URL th? nghi?m: POST https://localhost:xxxx/api/orders (D? li?u trong Body)
        // =================================================================
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // T? d?ng ghi nh?n th?i gian d?t hàng n?u phía Client không truy?n lên
            if (order.OrderDate == default)
            {
                order.OrderDate = DateTime.Now;
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, order);
        }

        // =================================================================
        // 4. PUT: api/orders/{id} (C?p nh?t tr?ng thái / thông tin don hàng)
        // URL th? nghi?m: PUT https://localhost:xxxx/api/orders/5
        // =================================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] Order order)
        {
            if (id != order.Id)
            {
                return BadRequest(new { message = "ID du?ng d?n và ID d? li?u truy?n lên không kh?p" });
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
                    return NotFound(new { message = "Ðon hàng không t?n t?i trên h? th?ng d? c?p nh?t" });
                }
                throw;
            }

            return NoContent();
        }

        // =================================================================
        // 5. DELETE: api/orders/{id} (Xóa don hàng)
        // URL th? nghi?m: DELETE https://localhost:xxxx/api/orders/5
        // =================================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound(new { message = "Ðon hàng dã b? xóa tru?c dó ho?c không t?n t?i" });
            }

            // Luu ý: Ðon hàng này thu?ng có ràng bu?c khóa ngo?i ch?t ch? v?i b?ng OrderDetails.
            // N?u b?n mu?n xóa don hàng, b?n c?n c?u hình xóa Cascade trong DB 
            // ho?c ch? d?ng xóa các b?n ghi liên quan trong b?ng OrderDetails tru?c.
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa don hàng thành công" });
        }
    }
}

