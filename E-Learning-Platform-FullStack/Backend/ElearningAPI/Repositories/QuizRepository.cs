using ElearningAPI.Data;
using ElearningAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ElearningAPI.Repositories;

public class QuizRepository : IQuizRepository
{
    private readonly AppDbContext _context;

    public QuizRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Quiz>> GetByCourseId(int courseId)
    {
        return await _context.Quizzes
            .AsNoTracking()
            .Where(q => q.CourseId == courseId)
            .ToListAsync();
    }

    public async Task<Quiz?> GetQuizWithQuestions(int quizId)
    {
        return await _context.Quizzes
            .Include(q => q.Questions)
            .FirstOrDefaultAsync(q => q.QuizId == quizId);
    }

    public async Task AddQuizAsync(Quiz quiz)
    {
        await _context.Quizzes.AddAsync(quiz);
    }

    public async Task AddQuestionAsync(Question question)
    {
        await _context.Questions.AddAsync(question);
    }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }
}