using System.ComponentModel.DataAnnotations;
namespace ElearningAPI.DTOs;

public class CreateQuizDto
{
    [Required]
    public int CourseId { get; set; }

    [Required]
    public string Title { get; set; } = string.Empty;
}