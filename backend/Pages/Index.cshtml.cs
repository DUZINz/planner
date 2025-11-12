using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Planner.Web.Data;
using Planner.Web.Models;

namespace Planner.Web.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ApplicationDbContext _db;

        public IndexModel(ApplicationDbContext db)
        {
            _db = db;
        }

        public List<Event> Events { get; set; } = new();

        [BindProperty]
        public Event Input { get; set; } = new();

        public async Task OnGetAsync()
        {
            var eventsFromDb = await _db.Events
                .OrderBy(e => e.StartDate)
                .ToListAsync(); // Traz antes do ThenBy

            Events = eventsFromDb
                .OrderBy(e => e.StartDate)
                .ThenBy(e => e.StartTime ?? TimeSpan.Zero)
                .ToList();
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                await OnGetAsync();
                return Page();
            }

            // Normaliza datas/hora caso necessário
            if (Input.IsAllDay)
            {
                Input.StartTime = null;
                Input.EndTime = null;
            }

            _db.Events.Add(Input);
            await _db.SaveChangesAsync();

            return RedirectToPage();
        }
    }
}

