using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Planner.Web.Data;
using Planner.Web.Models;
using Microsoft.Extensions.Logging;

namespace Planner.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScheduleController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ScheduleController> _logger;

        public ScheduleController(ApplicationDbContext context, ILogger<ScheduleController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Event>>> GetEvents()
        {
            try
            {
                var events = await _context.Events
                    .OrderBy(e => e.StartDate)
                    .ToListAsync();
                return Ok(events);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao buscar eventos");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<Event>> CreateEvent([FromBody] Event newEvent)
        {
            try
            {
                _logger.LogInformation("Criando evento: {Title}", newEvent.Title);
                
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                _context.Events.Add(newEvent);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Evento criado com ID: {Id}", newEvent.Id);
                return CreatedAtAction(nameof(GetEvent), new { id = newEvent.Id }, newEvent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao criar evento");
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Event>> GetEvent(int id)
        {
            var evt = await _context.Events.FindAsync(id);
            
            if (evt == null)
            {
                return NotFound();
            }

            return Ok(evt);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            var evt = await _context.Events.FindAsync(id);
            
            if (evt == null)
            {
                return NotFound();
            }

            _context.Events.Remove(evt);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}