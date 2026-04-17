namespace ElearningAPI.Models;

public class Quiz
{
    public int QuizId { get; set; }

    public int CourseId { get; set; }

    public Course? Course { get; set; }

    public string Title { get; set; } = string.Empty;

    public ICollection<Question> Questions { get; set; } = new List<Question>();
}