using System.ComponentModel.DataAnnotations;

namespace Planner.Web.Models;

public class Event
{
    public int Id { get; set; }

    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [StringLength(1000)]
    public string? Description { get; set; }

    [Required]
    public DateOnly StartDate { get; set; }

    public TimeSpan? StartTime { get; set; }   // torna nullable

    public DateOnly? EndDate { get; set; }     // torna nullable

    public TimeSpan? EndTime { get; set; }     // torna nullable

    public bool IsAllDay { get; set; }

    [StringLength(100)]
    public string? Location { get; set; }
}