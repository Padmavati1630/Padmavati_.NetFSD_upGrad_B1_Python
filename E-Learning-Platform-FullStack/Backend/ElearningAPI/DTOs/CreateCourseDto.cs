using System.ComponentModel.DataAnnotations;

namespace ElearningAPI.DTOs;

public class CreateCourseDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    public int CreatedBy { get; set; }
}