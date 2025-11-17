using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Planner.Web.Models
{
    public class Event
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        public string StartDate { get; set; } = string.Empty; // ⬅️ STRING

        public string? StartTime { get; set; }

        public string? EndDate { get; set; }

        public string? EndTime { get; set; }

        public bool IsAllDay { get; set; }

        [MaxLength(200)]
        public string? Location { get; set; }
    }
}