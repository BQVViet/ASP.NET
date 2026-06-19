using Microsoft.AspNetCore.Authorization;
using CMS.Data;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Inject DbContext
        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Danh sách chi ti?t don hàng
        public IActionResult Index()
        {
            var orderDetails = _context.OrderDetails.ToList();

            return View(orderDetails);
        }
    }
}
