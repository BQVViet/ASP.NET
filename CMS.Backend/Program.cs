using CMS.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// 1. CẤU HÌNH SERVICES
builder.Services.AddControllersWithViews();

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

var app = builder.Build();

// 2. CẤU HÌNH MIDDLEWARE (PIPELINE)

// --- 🔵 [BỔ SUNG 2]: Bật giao diện Swagger khi chạy trên máy (Development) ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        // Cấu hình này giúp trang Swagger hiển thị mượt mà trên cả dự án Web MVC
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
app.UseRouting();

// PHẢI CÓ
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();