using ElearningAPI.Models;

namespace ElearningAPI.Repositories;

public interface IQuizRepository
{
    Task<IEnumerable<Quiz>> GetByCourseId(int courseId);
    Task<Quiz?> GetQuizWithQuestions(int quizId);
    Task AddQuizAsync(Quiz quiz);
    Task AddQuestionAsync(Question question);
    Task SaveAsync();
}