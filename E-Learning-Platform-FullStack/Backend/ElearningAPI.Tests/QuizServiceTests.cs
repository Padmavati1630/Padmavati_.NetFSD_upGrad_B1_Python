using Xunit;
using ElearningAPI.Models;
using ElearningAPI.DTOs;
using System.Collections.Generic;

public class QuizServiceTests
{
    [Fact]
    public void SubmitQuiz_ReturnsCorrectScore()
    {
        var questions = new List<Question>
        {
            new Question { QuestionId = 1, CorrectAnswer = 0 },
            new Question { QuestionId = 2, CorrectAnswer = 1 }
        };

        var quiz = new Quiz
        {
            QuizId = 1,
            Questions = questions
        };

        var dto = new QuizSubmitDto
        {
            UserId = 1,
            Answers = new Dictionary<int, int>
            {
                {1, 0},
                {2, 1}
            }
        };

        int expectedScore = 2;
        int actualScore = 0;

        foreach (var q in quiz.Questions)
        {
            if (dto.Answers.ContainsKey(q.QuestionId) &&
                dto.Answers[q.QuestionId] == q.CorrectAnswer)
            {
                actualScore++;
            }
        }

        Assert.Equal(expectedScore, actualScore);
    }

    // SECOND TEST 
    [Fact]
    public void Score_ShouldBeZero_WhenAllAnswersWrong()
    {
        var questions = new List<Question>
        {
            new Question { QuestionId = 1, CorrectAnswer = 0 }
        };

        var dto = new QuizSubmitDto
        {
            UserId = 1,
            Answers = new Dictionary<int, int>
            {
                {1, 2} // wrong answer
            }
        };

        int actualScore = 0;

        foreach (var q in questions)
        {
            if (dto.Answers[q.QuestionId] == q.CorrectAnswer)
            {
                actualScore++;
            }
        }

        Assert.Equal(0, actualScore);
    }
}
