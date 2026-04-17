using System.ComponentModel.DataAnnotations;
namespace ElearningAPI.DTOs;

public class CreateLessonDto
{
    [Required]
    public int CourseId { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    [Required]
    public int OrderIndex { get; set; }
}