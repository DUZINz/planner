using Microsoft.AspNetCore.Mvc.RazorPages;
using Planner.Web.Models;
using Planner.Web.Services;

namespace Planner.Web.Pages;

public class IndexModel : PageModel
{
    private readonly IEventService _eventService;
    private readonly ILogger<IndexModel> _logger;

    public IndexModel(IEventService eventService, ILogger<IndexModel> logger)
    {
        _eventService = eventService;
        _logger = logger;
    }

    public IEnumerable<Event> Events { get; set; } = new List<Event>();

    public async Task OnGetAsync()
    {
        Events = await _eventService.GetAllEventsAsync();
    }
}

