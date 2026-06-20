using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // DANH SÁCH KHÁCH HÀNG
        // =========================
        public IActionResult Index(string searchString, int page = 1)
        {
            int pageSize = 10;
            var query = _context.Customers.AsQueryable();

            if (!string.IsNullOrEmpty(searchString))
            {
                query = query.Where(c => c.FullName.Contains(searchString) || 
                                         c.Email.Contains(searchString) || 
                                         c.Phone.Contains(searchString));
            }

            ViewBag.SearchString = searchString;

            var customers = query
                .OrderByDescending(c => c.Id)
                .ToList();

            return View(customers);
        }

        // =========================
        // CREATE - GET
        // =========================
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // =========================
        // CREATE - POST
        // =========================
        [HttpPost]
        public IActionResult Create(Customer model)
        {
            if (ModelState.IsValid)
            {
                _context.Customers.Add(model);
                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            return View(model);
        }

        // =========================
        // DETAILS
        // =========================
        [HttpGet]
        public IActionResult Details(int id)
        {
            var customer = _context.Customers
                .Include(c => c.Orders)
                .ThenInclude(o => o.OrderDetails)
                .FirstOrDefault(c => c.Id == id);

            if (customer == null)
            {
                return NotFound();
            }

            return View(customer);
        }

        // =========================
        // EDIT - GET
        // =========================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);

            if (customer == null)
            {
                return NotFound();
            }

            return View(customer);
        }

        // =========================
        // EDIT - POST
        // =========================
        [HttpPost]
        public IActionResult Edit(Customer model)
        {
            if (ModelState.IsValid)
            {
                _context.Customers.Update(model);
                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            return View(model);
        }

        // =========================
        // DELETE
        // =========================
        public IActionResult Delete(int id)
        {
            var customer = _context.Customers.Find(id);

            if (customer != null)
            {
                _context.Customers.Remove(customer);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}
