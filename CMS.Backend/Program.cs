using CMS.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Text.Json.Serialization; // Thêm thư viện này để cấu hình ngắt vòng lặp JSON

var builder = WebApplication.CreateBuilder(args);

// 1. CẤU HÌNH SERVICES

// --- 🛠️ [SỬA ĐỔI]: Thêm AddJsonOptions để sửa TRIỆT ĐỂ lỗi vòng lặp (Object Cycle) toàn cục ---
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        // Tự động bỏ qua các vòng lặp liên kết ngược giữa Category và Product
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// --- 🔵 [BỔ SUNG 1]: Đăng ký dịch vụ tạo Swagger Docs ---
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// --------------------------------------------------------

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/AccessDenied";
    });

// ---- CẤU HÌNH CORS (THÊM VÀO TRƯỚC builder.Build()) ----
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Cho phép ReactJS ở port 3000 gọi tới
              .AllowAnyHeader()                     // Cho phép mọi loại Header (Content-Type, Authorization...)
              .AllowAnyMethod()                     // Cho phép mọi phương thức HTTP (GET, POST, PUT, DELETE)
              .AllowCredentials();                  // Hỗ trợ truyền Cookie/Session nếu cần sau này
    });
});

var app = builder.Build();

// 2. CẤU HÌNH MIDDLEWARE (PIPELINE)

// --- 🔵 [BỔ SUNG 2]: Bật giao diện Swagger khi chạy trên máy (Development) ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "CMS API V1");
    });
}
// -------------------------------------------------------------------------

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

// Bật Routing (Đã xóa 1 dòng trùng)
app.UseRouting();

// KÍCH HOẠT CORS (Nằm ngay sau UseRouting và trước Authentication/Authorization)
app.UseCors("AllowReactApp");

// XÁC THỰC DANH TÍNH (Phải nằm TRƯỚC Phân quyền)
app.UseAuthentication();

// PHÂN QUYỀN (Đã dọn dẹp dòng trùng lặp)
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Order}/{action=Index}/{id?}");

app.Run();