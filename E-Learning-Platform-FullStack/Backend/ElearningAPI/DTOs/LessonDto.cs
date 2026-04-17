namespace ElearningAPI.DTOs;

public class LessonDto
{
    public int LessonId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public int OrderIndex { get; set; }
}