using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.IO;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password) || string.IsNullOrEmpty(request.FullName))
            {
                return BadRequest(new { message = "Vui lòng nhập đầy đủ thông tin" });
            }

            if (_context.Customers.Any(c => c.Username == request.Username))
            {
                return BadRequest(new { message = "Tên đăng nhập này đã được sử dụng." });
            }

            var customer = new Customer
            {
                FullName = request.FullName,
                Username = request.Username,
                Email = request.Email,
                Password = request.Password // Lưu mật khẩu thô theo yêu cầu hiện tại của Database
            };

            _context.Customers.Add(customer);
            _context.SaveChanges();

            return Ok(new { message = "Đăng ký thành công" });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { message = "Vui lòng nhập đầy đủ thông tin" });
            }

            // 1. Kiểm tra Admin (bảng Users)
            var admin = _context.Users.FirstOrDefault(u => u.UserName == request.Username && u.PasswordHash == request.Password);
            if (admin != null)
            {
                return Ok(new
                {
                    id = admin.Id,
                    name = admin.FullName,
                    username = admin.UserName,
                    email = "", // Fixed: Do not use UserName as Email
                    role = admin.Role,
                    password = admin.PasswordHash
                });
            }

            // 2. Kiểm tra Khách hàng (bảng Customers)
            var customer = _context.Customers.FirstOrDefault(c => c.Username == request.Username && c.Password == request.Password);
            if (customer != null)
            {
                return Ok(new
                {
                    id = customer.Id,
                    name = customer.FullName,
                    username = customer.Username,
                    email = customer.Email,
                    phone = customer.Phone,
                    address = customer.Address,
                    password = customer.Password,
                    avatar = customer.Avatar,
                    gender = customer.Gender,
                    role = "User"
                });
            }

            return Unauthorized(new { message = "Sai tài khoản hoặc mật khẩu!" });
        }

        [HttpGet("profile/{id}")]
        public IActionResult GetProfile(int id)
        {
            var customer = _context.Customers.FirstOrDefault(c => c.Id == id);
            if (customer != null)
            {
                return Ok(new
                {
                    id = customer.Id,
                    name = customer.FullName,
                    username = customer.Username,
                    email = customer.Email,
                    phone = customer.Phone,
                    address = customer.Address,
                    password = customer.Password,
                    avatar = customer.Avatar,
                    gender = customer.Gender,
                    role = "User"
                });
            }

            var admin = _context.Users.FirstOrDefault(u => u.Id == id);
            if (admin != null)
            {
                return Ok(new
                {
                    id = admin.Id,
                    name = admin.FullName,
                    username = admin.UserName,
                    email = "", // Fixed: Do not use UserName as Email
                    role = admin.Role,
                    password = admin.PasswordHash
                });
            }

            return NotFound(new { message = "Không tìm thấy người dùng" });
        }

        [HttpPost("update-profile/{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromForm] UpdateProfileRequest request)
        {
            var customer = _context.Customers.FirstOrDefault(c => c.Id == id);
            if (customer == null) return NotFound(new { message = "Không tìm thấy khách hàng." });

            customer.FullName = request.FullName ?? customer.FullName;
            customer.Email = request.Email ?? customer.Email;
            customer.Phone = request.Phone ?? customer.Phone;
            customer.Address = request.Address ?? customer.Address;
            customer.Gender = request.Gender ?? customer.Gender;
            if (!string.IsNullOrEmpty(request.Password)) {
                customer.Password = request.Password;
            }

            if (request.AvatarFile != null)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "avatars");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + request.AvatarFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await request.AvatarFile.CopyToAsync(fileStream);
                }

                customer.Avatar = "/uploads/avatars/" + uniqueFileName;
            }

            _context.SaveChanges();

            return Ok(new
            {
                message = "Cập nhật thành công",
                user = new
                {
                    id = customer.Id,
                    name = customer.FullName,
                    email = customer.Email,
                    phone = customer.Phone,
                    address = customer.Address,
                    gender = customer.Gender,
                    avatar = customer.Avatar,
                    password = customer.Password,
                    role = "User"
                }
            });
        }
    }

    public class UpdateProfileRequest
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Gender { get; set; }
        public string? Password { get; set; }
        public IFormFile? AvatarFile { get; set; }
    }

    public class RegisterRequest
    {
        public string FullName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
