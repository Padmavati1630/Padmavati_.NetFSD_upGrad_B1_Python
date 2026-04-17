using ElearningAPI.Data;
using ElearningAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace ElearningAPI.Repositories;

public class LessonRepository : ILessonRepository
{
    private readonly AppDbContext _context;

    public LessonRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Lesson>> GetByCourseId(int courseId)
    {
        return await _context.Lessons
            .AsNoTracking()
            .Where(l => l.CourseId == courseId)
            .OrderBy(l => l.OrderIndex)
            .ToListAsync();
    }

    public async Task<Lesson?> GetById(int id)
    {
        return await _context.Lessons.FindAsync(id);
    }

    public async Task AddAsync(Lesson lesson)
    {
        await _context.Lessons.AddAsync(lesson);
    }

    public void Update(Lesson lesson)
    {
        _context.Lessons.Update(lesson);
    }

    public void Delete(Lesson lesson)
    {
        _context.Lessons.Remove(lesson);
    }

    public async Task SaveAsync()
    {
        await _context.SaveChangesAsync();
    }
}