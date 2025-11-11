using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Planner.Web.Data;
using Planner.Web.Models;

namespace Planner.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ScheduleController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    public ScheduleController(ApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var events = await _db.Events
            .OrderBy(e => e.StartDate)
            .ThenBy(e => e.StartTime ?? TimeSpan.Zero)
            .ToListAsync();
        return Ok(events);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Event model)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        _db.Events.Add(model);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = model.Id }, model);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ev = await _db.Events.FindAsync(id);
        if (ev == null) return NotFound();
        
        _db.Events.Remove(ev);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}