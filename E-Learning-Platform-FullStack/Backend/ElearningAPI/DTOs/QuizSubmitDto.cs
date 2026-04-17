namespace ElearningAPI.DTOs;

public class QuizSubmitDto
{
    public int UserId { get; set; }

    public Dictionary<int, int> Answers { get; set; } = new();
}