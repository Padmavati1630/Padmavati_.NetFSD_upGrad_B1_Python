using ElearningAPI.Models;

namespace ElearningAPI.Repositories;

public interface ILessonRepository
{
    Task<IEnumerable<Lesson>> GetByCourseId(int courseId);
    Task<Lesson?> GetById(int id);
    Task AddAsync(Lesson lesson);
    void Update(Lesson lesson);
    void Delete(Lesson lesson);
    Task SaveAsync();
}