namespace ElearningAPI.DTOs;

public class QuestionDto
{
    public int QuestionId { get; set; }

    public string QuestionText { get; set; } = string.Empty;

    public List<string> Options { get; set; } = new();
}