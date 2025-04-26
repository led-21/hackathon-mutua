using hackaton_microsoft_agro.Models;
using Microsoft.EntityFrameworkCore;

namespace hackaton_microsoft_agro.Data
{
    public class CropProtectionContext : DbContext
    {
        public DbSet<CropProtection> Products { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=Data/cropprotection.db");
        }
    }
}
