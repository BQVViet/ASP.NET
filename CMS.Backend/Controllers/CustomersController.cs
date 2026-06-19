using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using CMS.Data;
using CMS.Data.Entities; // Ð?m b?o namespace này ch?a th?c th? Customer th?c t? c?a b?n

namespace CMS.Backend.Controllers
{
    // 1. Ð?nh nghia du?ng d?n g?i API. Th?c t? s? là: https://localhost:xxxx/api/customers
    [Route("api/[controller]")]

    // 2. Kích ho?t tính nang t? d?ng ki?m tra d? li?u d?u vào (Model Validation)
    [ApiController]

    // 3. K? th?a ControllerBase t?i uu cho ki?n trúc Web API ph?c v? d? li?u d?ng JSON
    public class CustomersController : ControllerBase
    {
        // 4. Khai báo th?c th? k?t n?i Co s? d? li?u (Read-only)
        private readonly ApplicationDbContext _context;

        // 5. Hàm kh?i t?o: Inject DBContext t? h? th?ng vào Controller
        public CustomersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =================================================================
        // 1. GET: api/customers (L?y danh sách toàn b? khách hàng)
        // URL th? nghi?m: GET https://localhost:xxxx/api/customers
        // =================================================================
        [HttpGet]
        public async Task<IActionResult> GetCustomers()
        {
            try
            {
                // S? d?ng AsNoTracking() d? tang t?c d? truy v?n d?i v?i tác v? ch? d?c d? li?u
                var customers = await _context.Customers
                    .AsNoTracking()
                    .ToListAsync();

                return Ok(customers);
            }
            catch (Exception ex)
            {
                // Tr? v? mã l?i 500 n?u có s? c? k?t n?i database
                return StatusCode(500, $"L?i h? th?ng: {ex.Message}");
            }
        }

        // =================================================================
        // 2. GET: api/customers/{id} (L?y chi ti?t m?t khách hàng theo ID)
        // URL th? nghi?m: GET https://localhost:xxxx/api/customers/5
        // =================================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomerById(int id)
        {
            var customer = await _context.Customers.FindAsync(id);

            // N?u không tìm th?y ID kh?p, tr? v? l?i 404 chu?n REST
            if (customer == null)
            {
                return NotFound(new { message = $"Không tìm th?y khách hàng có ID = {id}" });
            }

            return Ok(customer);
        }

        // =================================================================
        // 3. POST: api/customers (T?o m?i m?t khách hàng / Ðang ký tài kho?n)
        // URL th? nghi?m: POST https://localhost:xxxx/api/customers (D? li?u g?i trong Body)
        // =================================================================
        [HttpPost]
        public async Task<IActionResult> CreateCustomer([FromBody] Customer customer)
        {
            // N?u d? li?u g?i lên sai c?u trúc Model d?nh nghia
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Tr? v? l?i 400 Bad Request
            }

            // Luu ý: Trong th?c t?, b?n nên mã hóa m?t kh?u (b?ng BCrypt ho?c Identity PasswordHasher) 
            // tru?c khi luu vào database: customer.Password = PasswordHasher.Hash(customer.Password);

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            // Tr? v? mã tr?ng thái 201 Created kèm URL d?n t?i v? trí khách hàng v?a t?o
            return CreatedAtAction(nameof(GetCustomerById), new { id = customer.Id }, customer);
        }

        // =================================================================
        // 4. PUT: api/customers/{id} (C?p nh?t thông tin khách hàng)
        // URL th? nghi?m: PUT https://localhost:xxxx/api/customers/5
        // =================================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] Customer customer)
        {
            // Ki?m tra tính d?ng nh?t c?a ID trên du?ng d?n và trong Body d? li?u g?i lên
            if (id != customer.Id)
            {
                return BadRequest(new { message = "ID du?ng d?n và ID d? li?u truy?n lên không kh?p" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Ðánh d?u th?c th? customer này dã b? thay d?i d? EF Core c?p nh?t
            _context.Entry(customer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                // X? lý xung d?t d? li?u n?u khách hàng b? xóa b?i lu?ng khác lúc dang c?p nh?t
                if (!_context.Customers.Any(e => e.Id == id))
                {
                    return NotFound(new { message = "Khách hàng không t?n t?i trên h? th?ng d? c?p nh?t" });
                }
                throw;
            }

            // Tr? v? mã ph?n h?i thành công tr?ng d? li?u 204 chu?n REST
            return NoContent();
        }

        // =================================================================
        // 5. DELETE: api/customers/{id} (Xóa tài kho?n khách hàng)
        // URL th? nghi?m: DELETE https://localhost:xxxx/api/customers/5
        // =================================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                return NotFound(new { message = "Khách hàng dã b? xóa tru?c dó ho?c không t?n t?i" });
            }

            // Luu ý: N?u khách hàng này dã có don hàng bên b?ng Orders, 
            // DB s? báo l?i khóa ngo?i (Foreign Key Constraint). 
            // B?n có th? x? lý xóa cascade ho?c báo l?i cho Client tùy theo nghi?p v?.
            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa thông tin khách hàng thành công" });
        }
    }
}

