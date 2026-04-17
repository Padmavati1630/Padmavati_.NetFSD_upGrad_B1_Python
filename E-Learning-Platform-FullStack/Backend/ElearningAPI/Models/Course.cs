namespace ElearningAPI.Models;

public class Course
{
    public int CourseId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public int CreatedBy { get; set; }

    public User? User { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();

    public ICollection<Quiz> Quizzes { get; set; } = new List<Quiz>();
}
