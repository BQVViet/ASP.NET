using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Inject DbContext
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // READ - Danh sách
        // =========================
        public IActionResult Index()
        {
            var users = _context.Users.ToList();

            return View(users);
        }

        // =========================
        // CREATE - GET
        // =========================
        public IActionResult Create()
        {
            return View();
        }

        // CREATE - POST
        // =========================
        [HttpPost]
        public IActionResult Create(User user)
        {
            _context.Users.Add(user);

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // =========================
        // EDIT - GET
        // =========================
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);

            if (user == null)
                return NotFound();

            return View(user);
        }

        // =========================
        // EDIT - POST
        // =========================
        [HttpPost]
        public IActionResult Edit(User updatedUser)
        {
            var user = _context.Users.Find(updatedUser.Id);

            if (user == null)
                return NotFound();

            user.UserName = updatedUser.UserName;
            user.FullName = updatedUser.FullName;
            user.Role = updatedUser.Role;
            user.PasswordHash = updatedUser.PasswordHash;

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // =========================
        // DELETE
        // =========================
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);

            if (user != null)
            {
                _context.Users.Remove(user);

                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}