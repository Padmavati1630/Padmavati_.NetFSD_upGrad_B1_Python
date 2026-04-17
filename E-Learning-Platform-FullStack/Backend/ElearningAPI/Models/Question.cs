namespace ElearningAPI.Models;

public class Question
{
    public int QuestionId { get; set; }

    public int QuizId { get; set; }

    public Quiz? Quiz { get; set; }

    public string QuestionText { get; set; } = string.Empty;

    public string OptionA { get; set; } = string.Empty;

    public string OptionB { get; set; } = string.Empty;

    public string OptionC { get; set; } = string.Empty;

    public string OptionD { get; set; } = string.Empty;

    public int CorrectAnswer { get; set; } // 0,1,2,3
}