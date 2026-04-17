using AutoMapper;
using Microsoft.EntityFrameworkCore;
using ElearningAPI.DTOs;
using ElearningAPI.Models;
using ElearningAPI.Repositories;
using ElearningAPI.Data;
using ElearningAPI.Services.Interfaces;

namespace ElearningAPI.Services;

public class QuizService : IQuizService
{
    private readonly IQuizRepository _repo;
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public QuizService(IQuizRepository repo, AppDbContext context, IMapper mapper)
    {
        _repo = repo;
        _context = context;
        _mapper = mapper;
    }

    public async Task<Quiz?> GetQuizWithQuestions(int quizId)
    {
        return await _repo.GetQuizWithQuestions(quizId);
    }

    public async Task<IEnumerable<QuizDto>> GetQuizzesByCourse(int courseId)
    {
        var quizzes = await _repo.GetByCourseId(courseId);
        return _mapper.Map<IEnumerable<QuizDto>>(quizzes);
    }

    public async Task CreateQuiz(CreateQuizDto dto)
    {
        var quiz = _mapper.Map<Quiz>(dto);
        await _repo.AddQuizAsync(quiz);
        await _repo.SaveAsync();
    }

    public async Task AddQuestion(CreateQuestionDto dto)
    {
        var question = _mapper.Map<Question>(dto);
        await _repo.AddQuestionAsync(question);
        await _repo.SaveAsync();
    }

    // CORE LOGIC
    public async Task<int> SubmitMixedQuiz(QuizSubmitDto dto)
    {
        var questionIds = dto.Answers.Keys.ToList();

        var questions = await _context.Questions
            .Where(q => questionIds.Contains(q.QuestionId))
            .ToListAsync();

        int score = 0;

        foreach (var q in questions)
        {
            if (dto.Answers.ContainsKey(q.QuestionId) &&
                dto.Answers[q.QuestionId] == q.CorrectAnswer)
            {
                score++;
            }
        }

        var result = new Result
        {
            UserId = dto.UserId,
            QuizId = questions.First().QuizId, // USE VALID QUIZ ID
            Score = score,
            AttemptDate = DateTime.UtcNow
        };

        _context.Results.Add(result);
        await _context.SaveChangesAsync();

        return score;
    }

    public async Task<int> SubmitQuiz(int quizId, QuizSubmitDto dto)
    {
        var quiz = await _repo.GetQuizWithQuestions(quizId);

        if (quiz == null)
            throw new KeyNotFoundException("Quiz not found");

        int score = 0;

        foreach (var q in quiz.Questions)
        {
            if (dto.Answers.ContainsKey(q.QuestionId) &&
                dto.Answers[q.QuestionId] == q.CorrectAnswer)
            {
                score++;
            }
        }

        var result = new Result
        {
            UserId = dto.UserId,
            QuizId = quizId,
            Score = score,
            AttemptDate = DateTime.UtcNow
        };

        _context.Results.Add(result);
        await _context.SaveChangesAsync();

        return score;
    }
    public async Task<bool> QuizExistsForCourse(int courseId)
    {
        var quizzes = await _repo.GetByCourseId(courseId);
        return quizzes.Any();
    }

}