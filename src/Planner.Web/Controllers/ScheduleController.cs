using Microsoft.AspNetCore.Mvc;
using Planner.Web.Models;
using Planner.Web.Services;

namespace Planner.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ScheduleController : ControllerBase
{
    private readonly IEventService _eventService;
    private readonly ILogger<ScheduleController> _logger;

    public ScheduleController(IEventService eventService, ILogger<ScheduleController> logger)
    {
        _eventService = eventService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Event>>> GetEvents()
    {
        var events = await _eventService.GetAllEventsAsync();
        return Ok(events);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Event>> GetEvent(int id)
    {
        var eventItem = await _eventService.GetEventByIdAsync(id);
        if (eventItem == null)
        {
            return NotFound();
        }
        return Ok(eventItem);
    }

    [HttpPost]
    public async Task<ActionResult<Event>> CreateEvent(Event eventItem)
    {
        var created = await _eventService.CreateEventAsync(eventItem);
        return CreatedAtAction(nameof(GetEvent), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEvent(int id, Event eventItem)
    {
        if (id != eventItem.Id)
        {
            return BadRequest();
        }

        var result = await _eventService.UpdateEventAsync(eventItem);
        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEvent(int id)
    {
        var result = await _eventService.DeleteEventAsync(id);
        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }
}