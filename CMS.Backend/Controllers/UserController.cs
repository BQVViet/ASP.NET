using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities;

public class UserController : Controller
{
    // Dữ liệu giả
    private static List<User> users = new List<User>()
    {
        new User
        {
            Id = 1,
            UserName = "admin",
            FullName = "Nguyễn Văn A",
            Role = "Administrator"
        },

        new User
        {
            Id = 2,
            UserName = "member01",
            FullName = "Trần Văn B",
            Role = "Member"
        }
    };

    // =========================
    // READ - Danh sách
    // =========================
    public IActionResult Index()
    {
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
    [HttpPost]
    public IActionResult Create(User user)
    {
        user.Id = users.Max(x => x.Id) + 1;

        users.Add(user);

        return RedirectToAction("Index");
    }

    // =========================
    // EDIT - GET
    // =========================
    public IActionResult Edit(int id)
    {
        var user = users.FirstOrDefault(x => x.Id == id);

        if (user == null)
            return NotFound();

        return View(user);
    }

    // EDIT - POST
    [HttpPost]
    public IActionResult Edit(User updatedUser)
    {
        var user = users.FirstOrDefault(x => x.Id == updatedUser.Id);

        if (user == null)
            return NotFound();

        user.UserName = updatedUser.UserName;
        user.FullName = updatedUser.FullName;
        user.Role = updatedUser.Role;

        return RedirectToAction("Index");
    }

    // =========================
    // DELETE
    // =========================
    public IActionResult Delete(int id)
    {
        var user = users.FirstOrDefault(x => x.Id == id);

        if (user != null)
        {
            users.Remove(user);
        }

        return RedirectToAction("Index");
    }
}