using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
  
        // Khách hàng
        public class Customer
        {
            [Key]
            public int Id { get; set; }

            [Required]
            public string FullName { get; set; }

            public string? Username { get; set; }

            [EmailAddress]
            public string? Email { get; set; }

            public string? Phone { get; set; }

            public string? Address { get; set; }

            [Required]
            public string Password { get; set; } // Lưu mật khẩu thô theo yêu cầu tối giản

            public string? Avatar { get; set; }
            public string? Gender { get; set; }

            public virtual ICollection<Order>? Orders { get; set; }
        }


}


