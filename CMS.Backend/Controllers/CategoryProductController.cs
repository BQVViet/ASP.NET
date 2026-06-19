using Microsoft.AspNetCore.Authorization;
using CMS.Data;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Inject DbContext
        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hi?n th? danh sách
        public IActionResult Index()
        {
            var data = _context.CategoriesProducts.ToList();

            return View(data);
        }
    }
}
