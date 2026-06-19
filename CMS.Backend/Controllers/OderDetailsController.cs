using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using CMS.Data;
using CMS.Data.Entities; // Ð?m b?o namespace này ch?a th?c th? OrderDetail th?c t? c?a b?n

namespace CMS.Backend.Controllers
{
    // 1. Ð?nh nghia du?ng d?n g?i API. Th?c t? s? là: https://localhost:xxxx/api/orderdetails
    [Route("api/[controller]")]

    // 2. Kích ho?t tính nang t? d?ng ki?m tra d? li?u d?u vào (Model Validation)
    [ApiController]

    // 3. K? th?a ControllerBase t?i uu cho ki?n trúc Web API tr? v? d? li?u JSON
    public class OrderDetailsController : ControllerBase
    {
        // 4. Khai báo th?c th? k?t n?i Co s? d? li?u (Read-only)
        private readonly ApplicationDbContext _context;

        // 5. Hàm kh?i t?o: Inject DBContext t? h? th?ng vào Controller
        public OrderDetailsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =================================================================
        // 1. GET: api/orderdetails (L?y toàn b? danh sách chi ti?t các don hàng)
        // URL th? nghi?m: GET https://localhost:xxxx/api/orderdetails
        // =================================================================
        [HttpGet]
        public async Task<IActionResult> GetOrderDetails()
        {
            try
            {
                // S? d?ng Include d? kéo theo thông tin S?n ph?m ph?c v? cho giao di?n hi?n th?
                var orderDetails = await _context.OrderDetails
                    .Include(od => od.Product)
                    .AsNoTracking()
                    .ToListAsync();

                return Ok(orderDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"L?i h? th?ng: {ex.Message}");
            }
        }

        // =================================================================
        // 2. GET: api/orderdetails/by-order/{orderId} (L?y danh sách s?n ph?m thu?c m?t Ðon hàng c? th?)
        // URL th? nghi?m: GET https://localhost:xxxx/api/orderdetails/by-order/1
        // =================================================================
        [HttpGet("by-order/{orderId}")]
        public async Task<IActionResult> GetOrderDetailsByOrderId(int orderId)
        {
            var details = await _context.OrderDetails
                .Include(od => od.Product)
                .Where(od => od.OrderId == orderId)
                .AsNoTracking()
                .ToListAsync();

            if (details == null || details.Count == 0)
            {
                return NotFound(new { message = $"Không tìm th?y chi ti?t s?n ph?m nào cho mã don hàng = {orderId}" });
            }

            return Ok(details);
        }

        // =================================================================
        // 3. GET: api/orderdetails/{id} (L?y thông tin m?t dòng chi ti?t theo ID)
        // URL th? nghi?m: GET https://localhost:xxxx/api/orderdetails/5
        // =================================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderDetailById(int id)
        {
            var orderDetail = await _context.OrderDetails
                .Include(od => od.Product)
                .FirstOrDefaultAsync(od => od.Id == id);

            if (orderDetail == null)
            {
                return NotFound(new { message = $"Không tìm th?y chi ti?t don hàng có ID = {id}" });
            }

            return Ok(orderDetail);
        }

        // =================================================================
        // 4. POST: api/orderdetails (Thêm m?t s?n ph?m vào don hàng)
        // URL th? nghi?m: POST https://localhost:xxxx/api/orderdetails (D? li?u trong Body)
        // =================================================================
        [HttpPost]
        public async Task<IActionResult> CreateOrderDetail([FromBody] OrderDetail orderDetail)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.OrderDetails.Add(orderDetail);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderDetailById), new { id = orderDetail.Id }, orderDetail);
        }

        // =================================================================
        // 5. PUT: api/orderdetails/{id} (C?p nh?t s? lu?ng / don giá trong chi ti?t don hàng)
        // URL th? nghi?m: PUT https://localhost:xxxx/api/orderdetails/5
        // =================================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrderDetail(int id, [FromBody] OrderDetail orderDetail)
        {
            if (id != orderDetail.Id)
            {
                return BadRequest(new { message = "ID du?ng d?n và ID d? li?u truy?n lên không kh?p" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(orderDetail).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.OrderDetails.Any(e => e.Id == id))
                {
                    return NotFound(new { message = "B?n ghi chi ti?t don hàng không t?n t?i trên h? th?ng" });
                }
                throw;
            }

            return NoContent();
        }

        // =================================================================
        // 6. DELETE: api/orderdetails/{id} (Xóa m?t s?n ph?m kh?i don hàng)
        // URL th? nghi?m: DELETE https://localhost:xxxx/api/orderdetails/5
        // =================================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderDetail(int id)
        {
            var orderDetail = await _context.OrderDetails.FindAsync(id);
            if (orderDetail == null)
            {
                return NotFound(new { message = "Chi ti?t don hàng không t?n t?i ho?c dã b? xóa tru?c dó" });
            }

            _context.OrderDetails.Remove(orderDetail);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa m?t hàng kh?i hóa don thành công" });
        }
    }
}

