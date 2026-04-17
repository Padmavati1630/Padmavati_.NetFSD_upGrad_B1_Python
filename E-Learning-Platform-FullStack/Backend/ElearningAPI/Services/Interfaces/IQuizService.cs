using ElearningAPI.DTOs;
using ElearningAPI.Models;

namespace ElearningAPI.Services.Interfaces;

public interface IQuizService
{
    Task<Quiz?> GetQuizWithQuestions(int quizId);
    Task<IEnumerable<QuizDto>> GetQuizzesByCourse(int courseId);
    Task CreateQuiz(CreateQuizDto dto);
    Task AddQuestion(CreateQuestionDto dto);
    Task<int> SubmitQuiz(int quizId, QuizSubmitDto dto);
    Task<int> SubmitMixedQuiz(QuizSubmitDto dto);
}