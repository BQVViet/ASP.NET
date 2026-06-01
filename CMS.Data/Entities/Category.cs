/*
 * HỌ TÊN: BÙI QUỐC VIỆT
 * MÃ SINH VIÊN: 2123110189
 * LỚP:
 * NGÀY TẠO:
 * MÔ TẢ: QUẢN LÝ DANH MỤC
 */

using CMS.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public virtual ICollection<Post> Posts { get; set; }


    }
}
