using Microsoft.EntityFrameworkCore;
using Planner.Web.Models;

namespace Planner.Web.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Event> Events { get; set; }
    }
}