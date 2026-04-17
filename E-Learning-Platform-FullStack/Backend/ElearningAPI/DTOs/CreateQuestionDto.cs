using System.ComponentModel.DataAnnotations;

namespace ElearningAPI.DTOs;

public class CreateQuestionDto
{
    [Required]
    public int QuizId { get; set; }

    [Required]
    public string QuestionText { get; set; } = string.Empty;

    [Required]
    public string OptionA { get; set; } = string.Empty;
    [Required]
    public string OptionB { get; set; } = string.Empty;
    [Required]
    public string OptionC { get; set; } = string.Empty;
    [Required]
    public string OptionD { get; set; } = string.Empty;

    [Required]
    public int CorrectAnswer { get; set; } // 0-3
}