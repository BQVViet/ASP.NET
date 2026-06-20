using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize] // B?t bu?c dang nh?p
    [Authorize]
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // DANH SÁCH BÀI VI?T
        // =========================
        public IActionResult Index(string searchString, int? categoryId) { var query = _context.Posts.Include(p => p.Category).AsQueryable(); if (!string.IsNullOrEmpty(searchString)) { query = query.Where(p => p.Title.Contains(searchString)); } if (categoryId.HasValue) { query = query.Where(p => p.CategoryId == categoryId.Value); } ViewBag.SearchString = searchString; ViewBag.CategoryId = categoryId; ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name", categoryId); var posts = query.OrderByDescending(p => p.Id).ToList(); return View(posts); }

        // =========================
        // CHI TI?T
        // =========================
        public IActionResult Details(int id)
        {
            var post = _context.Posts
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);

            if (post == null)
            {
                return NotFound();
            }

            return View(post);
        }

        // =========================
        // CREATE GET
        // =========================
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.CategoryList =
                new SelectList(_context.Categories, "Id", "Name");

            return View();
        }

        // =========================
        // CREATE POST
        // =========================
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult Create(Post model, IFormFile uploadImage)
        {
            // Upload ?nh
            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    "uploads"
                );

                if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }

                string fileName =
                    Guid.NewGuid().ToString()
                    + Path.GetExtension(uploadImage.FileName);

                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                model.ImageUrl = "/uploads/" + fileName;
            }

            _context.Posts.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // =========================
        // DELETE
        // =========================
        [Authorize(Roles = "Admin")]
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);

            if (post != null)
            {
                _context.Posts.Remove(post);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }

        // =========================
        // EDIT GET
        // =========================
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);

            if (post == null)
            {
                return NotFound();
            }

            ViewBag.CategoryList =
                new SelectList(
                    _context.Categories,
                    "Id",
                    "Name",
                    post.CategoryId
                );

            return View(post);
        }

        // =========================
        // EDIT POST
        // =========================
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult Edit(Post model, IFormFile uploadImage)
        {
            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    "uploads"
                );

                if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }

                string fileName =
                    Guid.NewGuid().ToString()
                    + Path.GetExtension(uploadImage.FileName);

                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                model.ImageUrl = "/uploads/" + fileName;
            }
            else
            {
                // giữ ảnh cũ NẾU người dùng không dán link ảnh mới
                var oldPost = _context.Posts
                    .AsNoTracking()
                    .FirstOrDefault(p => p.Id == model.Id);

                if (oldPost != null && string.IsNullOrEmpty(model.ImageUrl))
                {
                    model.ImageUrl = oldPost.ImageUrl;
                }
            }

            _context.Posts.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }
    }
}


