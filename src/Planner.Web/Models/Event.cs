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
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    // Backwards-compatible aliases (usados nos testes)
    public DateTime StartTime
    {
        get => StartDate;
        set => StartDate = value;
    }

    public DateTime EndTime
    {
        get => EndDate;
        set => EndDate = value;
    }

    public bool IsAllDay { get; set; }

    [StringLength(100)]
    public string? Location { get; set; }
}