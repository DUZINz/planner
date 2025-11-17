using System.ComponentModel.DataAnnotations;

namespace Planner.Web.Models;

public class Event
{
    public int Id { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public DateOnly StartDate { get; set; }

    public TimeSpan? StartTime { get; set; }

    public DateOnly? EndDate { get; set; }

    public TimeSpan? EndTime { get; set; }

    public bool IsAllDay { get; set; }

    public string? Location { get; set; }
}