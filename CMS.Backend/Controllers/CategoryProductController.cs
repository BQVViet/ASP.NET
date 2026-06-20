using Microsoft.AspNetCore.Authorization;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index(string searchString, int page = 1)
        {
            int pageSize = 10;
            var query = _context.CategoriesProducts.AsQueryable();

            if (!string.IsNullOrEmpty(searchString))
            {
                query = query.Where(c => c.Name.Contains(searchString));
            }

            ViewBag.SearchString = searchString;

            var data = query
                .OrderByDescending(c => c.Id)
                .ToList();

            return View(data);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(CategoryProduct model)
        {
            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Add(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(model);
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var data = _context.CategoriesProducts.Find(id);
            if (data == null) return NotFound();
            return View(data);
        }

        [HttpPost]
        public IActionResult Edit(CategoryProduct model)
        {
            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Update(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(model);
        }

        [HttpGet]
        public IActionResult Details(int id)
        {
            var data = _context.CategoriesProducts.Find(id);
            if (data == null) return NotFound();
            return View(data);
        }

        [HttpGet]
        public IActionResult Delete(int id)
        {
            var data = _context.CategoriesProducts.Find(id);
            if (data != null)
            {
                _context.CategoriesProducts.Remove(data);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}
