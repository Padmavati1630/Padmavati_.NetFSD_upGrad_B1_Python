using ElearningAPI.Data;
using ElearningAPI.DTOs;
using Microsoft.EntityFrameworkCore;
using ElearningAPI.Services.Interfaces;

namespace ElearningAPI.Services;

public class ResultService : IResultService
{
    private readonly AppDbContext _context;

    public ResultService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ResultDto>> GetResultsByUser(int userId)
    {
        return await _context.Results
            .Where(r => r.UserId == userId)
            .Select(r => new ResultDto
            {
                QuizId = r.QuizId ?? 0,
                Score = r.Score,
                AttemptDate = r.AttemptDate
            })
            .AsNoTracking()
            .ToListAsync();
    }
    public async Task<bool> ClearResults(int userId)
    {
        var results = _context.Results.Where(r => r.UserId == userId);

        if (!results.Any())
            return false;

        _context.Results.RemoveRange(results);
        await _context.SaveChangesAsync();

        return true;
    }
}