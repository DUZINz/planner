using Microsoft.EntityFrameworkCore;
using Planner.Web.Data;
using Planner.Web.Models;

namespace Planner.Web.Services;

public class EventService : IEventService
{
    private readonly ApplicationDbContext _context;

    public EventService(ApplicationDbContext context)
    {
        _context = context;
    }

    // Async implementations
    public async Task<IEnumerable<Event>> GetAllEventsAsync()
    {
        return await _context.Events.ToListAsync();
    }

    public async Task<Event?> GetEventByIdAsync(int id)
    {
        return await _context.Events.FindAsync(id);
    }

    public async Task<Event> CreateEventAsync(Event eventItem)
    {
        _context.Events.Add(eventItem);
        await _context.SaveChangesAsync();
        return eventItem;
    }

    public async Task<bool> UpdateEventAsync(Event eventItem)
    {
        _context.Entry(eventItem).State = EntityState.Modified;
        try
        {
            await _context.SaveChangesAsync();
            return true;
        }
        catch (DbUpdateConcurrencyException)
        {
            return false;
        }
    }

    public async Task<bool> DeleteEventAsync(int id)
    {
        var eventItem = await _context.Events.FindAsync(id);
        if (eventItem == null) return false;
        _context.Events.Remove(eventItem);
        await _context.SaveChangesAsync();
        return true;
    }

    // Sync wrappers for compatibility with tests
    public IEnumerable<Event> GetAllEvents()
    {
        return GetAllEventsAsync().GetAwaiter().GetResult();
    }

    public Event? GetEventById(int id)
    {
        return GetEventByIdAsync(id).GetAwaiter().GetResult();
    }

    public Event CreateEvent(Event eventItem)
    {
        return CreateEventAsync(eventItem).GetAwaiter().GetResult();
    }

    public bool UpdateEvent(Event eventItem)
    {
        return UpdateEventAsync(eventItem).GetAwaiter().GetResult();
    }

    public bool DeleteEvent(int id)
    {
        return DeleteEventAsync(id).GetAwaiter().GetResult();
    }
}