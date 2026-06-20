using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Inject DbContext
        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Danh sách đơn hàng
        public IActionResult Index(string searchString, int? status, int page = 1)
        {
            int pageSize = 10;
            var query = _context.Orders.AsQueryable();

            if (!string.IsNullOrEmpty(searchString))
            {
                if (int.TryParse(searchString, out int id))
                {
                    query = query.Where(o => o.Id == id);
                }
                else
                {
                    query = query.Where(o => o.Notes.Contains(searchString));
                }
            }

            if (status.HasValue)
            {
                query = query.Where(o => o.Status == status.Value);
            }

            ViewBag.SearchString = searchString;
            ViewBag.Status = status;

            var orders = query
                .OrderByDescending(o => o.Id)
                .ToList();

            return View(orders);
        }

        // Xem chi tiết đơn hàng
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null) return NotFound();

            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(d => d.Product)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (order == null) return NotFound();

            return View(order);
        }

        // In hóa đơn
        public async Task<IActionResult> Invoice(int? id)
        {
            if (id == null) return NotFound();

            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(d => d.Product)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (order == null) return NotFound();

            return View(order);
        }

        // In hóa đơn hàng loạt
        public async Task<IActionResult> BulkInvoice(int[] ids, string searchString, int? status)
        {
            var query = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(d => d.Product)
                .AsQueryable();

            if (ids != null && ids.Length > 0)
            {
                // In theo lựa chọn
                query = query.Where(o => ids.Contains(o.Id));
            }
            else
            {
                // In tất cả (theo bộ lọc hiện tại)
                if (!string.IsNullOrEmpty(searchString))
                {
                    if (int.TryParse(searchString, out int id))
                    {
                        query = query.Where(o => o.Id == id);
                    }
                    else
                    {
                        query = query.Where(o => o.Notes.Contains(searchString));
                    }
                }

                if (status.HasValue)
                {
                    query = query.Where(o => o.Status == status.Value);
                }
            }

            var orders = await query.OrderByDescending(o => o.Id).ToListAsync();

            if (orders == null || !orders.Any())
            {
                TempData["ErrorMessage"] = "Không tìm thấy đơn hàng nào để in.";
                return RedirectToAction(nameof(Index));
            }

            return View(orders);
        }

        // Cập nhật trạng thái đơn hàng
        [HttpPost]
        public async Task<IActionResult> UpdateStatus(int id, int status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order != null)
            {
                order.Status = status;
                await _context.SaveChangesAsync();
                TempData["SuccessMessage"] = "Đã cập nhật trạng thái đơn hàng thành công!";
            }
            return RedirectToAction(nameof(Details), new { id = id });
        }
    }
}