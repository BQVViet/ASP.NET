using Microsoft.AspNetCore.Authorization;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Inject DbContext
        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // DANH SÁCH SẢN PHẨM
        // =========================
        public IActionResult Index(string searchString, int? categoryId, int page = 1)
        {
            int pageSize = 10;
            var productsQuery = _context.Products
                .Include(p => p.CategoryProduct)
                .AsQueryable();

            if (!string.IsNullOrEmpty(searchString))
            {
                productsQuery = productsQuery.Where(p => p.Name.Contains(searchString));
            }

            if (categoryId.HasValue)
            {
                productsQuery = productsQuery.Where(p => p.CategoryProductId == categoryId.Value);
            }

            ViewBag.SearchString = searchString;
            ViewBag.CategoryId = categoryId;
            ViewBag.CategoryList = new SelectList(_context.CategoriesProducts, "Id", "Name", categoryId);

            var products = productsQuery
                .OrderByDescending(p => p.Id)
                .ToList();
                
            return View(products);
        }

        // =========================
        // DETAILS
        // =========================
        public IActionResult Details(int id)
        {
            var product = _context.Products
                .Include(p => p.CategoryProduct)
                .FirstOrDefault(p => p.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            return View(product);
        }

        // =========================
        // CREATE - GET
        // =========================
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.CategoryList = new SelectList(
                _context.CategoriesProducts,
                "Id",
                "Name"
            );

            return View();
        }

        // =========================
        // CREATE - POST
        // =========================
        [HttpPost]
        public IActionResult Create(Product model, IFormFile uploadImage)
        {
            if (uploadImage != null && uploadImage.Length > 0)
            {
                // tạo thư mục uploads
                string folder = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    "uploads"
                );

                if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }

                // tạo tên file ngẫu nhiên
                string fileName =
                    Guid.NewGuid().ToString()
                    + Path.GetExtension(uploadImage.FileName);

                string filePath = Path.Combine(folder, fileName);

                // copy file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                // lưu đường dẫn
                model.ImageUrl = "/uploads/" + fileName;
            }

            _context.Products.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // =========================
        // EDIT - GET
        // =========================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var product = _context.Products.Find(id);

            if (product == null)
            {
                return NotFound();
            }

            ViewBag.CategoryList = new SelectList(
                _context.CategoriesProducts,
                "Id",
                "Name",
                product.CategoryProductId
            );

            return View(product);
        }

        // =========================
        // EDIT - POST
        // =========================
        [HttpPost]
        public IActionResult Edit(Product model, IFormFile uploadImage)
        {
            var oldProduct = _context.Products
                .AsNoTracking()
                .FirstOrDefault(p => p.Id == model.Id);

            if (oldProduct == null)
            {
                return NotFound();
            }

            // upload ảnh mới
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
                // giữ ảnh cũ NẾU người dùng không dán link ảnh mới vào ô ImageUrl
                if (string.IsNullOrEmpty(model.ImageUrl))
                {
                    model.ImageUrl = oldProduct.ImageUrl;
                }
            }

            _context.Products.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // =========================
        // DELETE
        // =========================
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);

            if (product != null)
            {
                _context.Products.Remove(product);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}
