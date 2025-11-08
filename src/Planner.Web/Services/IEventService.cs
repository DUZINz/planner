using Planner.Web.Models;

namespace Planner.Web.Services;

public interface IEventService
{
    // async API
    Task<IEnumerable<Event>> GetAllEventsAsync();
    Task<Event?> GetEventByIdAsync(int id);
    Task<Event> CreateEventAsync(Event eventItem);
    Task<bool> UpdateEventAsync(Event eventItem);
    Task<bool> DeleteEventAsync(int id);

    // sync API (compatibilidade com testes existentes)
    IEnumerable<Event> GetAllEvents();
    Event? GetEventById(int id);
    Event CreateEvent(Event eventItem);
    bool UpdateEvent(Event eventItem);
    bool DeleteEvent(int id);
}