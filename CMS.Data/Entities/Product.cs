using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "tên danh mục không được để trống")]
        public string Name { get; set; }
        public string? Description { get; set; }
        [Range(0, double.MaxValue)]
        [Column(TypeName ="Decimal(18,2)")]
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string? ImageUrl { get; set; }

        // Khóa ngoại nối tới CategoryProduct
        public int CategoryProductId { get; set; }

        [ForeignKey("CategoryProductId")]
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual CategoryProduct? CategoryProduct { get; set; }


    }
}
