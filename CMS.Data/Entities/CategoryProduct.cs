using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    public class CategoryProduct
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage ="tên danh mục không được để trống")]
        [StringLength(100)]
        public string Name { get; set; }
        public string? Description { get; set; }
        // quan hệ: Một danh mục có nhiều sản phẩm
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual ICollection<Product> Products { get; set; }
    }
}
