using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;

public class PostController : Controller
{
    // =========================
    // Trang danh sách bài viết
    // =========================
    public IActionResult Index()
    {
        // Mock Data
        var posts = new List<Post>
        {
            new Post
            {
                Id = 1,
                Title = "Lộ trình học ASP.NET Core cho người mới",
                Content = "Nội dung bài viết về lộ trình học .NET dành cho lập trình viên mới bắt đầu.",
                ImageUrl = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600",
                CreatedDate = DateTime.Now
            },

            new Post
            {
                Id = 2,
                Title = "ReactJS và WebAPI: Xu hướng Fullstack 2026",
                Content = "Nội dung bài viết về sự kết hợp ReactJS và ASP.NET Core WebAPI.",
                ImageUrl = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600",
                CreatedDate = DateTime.Now.AddDays(-1)
            },

            new Post
            {
                Id = 3,
                Title = "Hướng dẫn cài đặt môi trường Visual Studio",
                Content = "Các bước cài đặt công cụ cần thiết cho lập trình viên .NET.",
                ImageUrl = "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600",
                CreatedDate = DateTime.Now.AddDays(-2)
            }
        };

        // Gửi dữ liệu sang View
        return View(posts);
    }

    // =========================
    // Trang chi tiết bài viết
    // =========================
    public IActionResult Details(int id)
    {
        // Mock dữ liệu chi tiết
        var post = new Post
        {
            Id = id,
            Title = "Nội dung chi tiết bài viết số " + id,

            Content = "Đây là nội dung đầy đủ của bài viết mà bạn vừa click vào. " +
                      "Ở đây có thể viết dài hơn để hiển thị đầy đủ thông tin chi tiết bài viết.",

            ImageUrl = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000",

            CreatedDate = DateTime.Now
        };

        // Kiểm tra null
        if (post == null)
        {
            return NotFound();
        }

        return View(post);
    }
}