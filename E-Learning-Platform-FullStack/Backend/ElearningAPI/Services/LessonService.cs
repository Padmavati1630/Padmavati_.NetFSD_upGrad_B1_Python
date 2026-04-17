using AutoMapper;
using ElearningAPI.DTOs;
using ElearningAPI.Models;
using ElearningAPI.Repositories;
using ElearningAPI.Services.Interfaces;

namespace ElearningAPI.Services;

public class LessonService : ILessonService
{
    private readonly ILessonRepository _repo;
    private readonly IMapper _mapper;

    public LessonService(ILessonRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IEnumerable<LessonDto>> GetLessonsByCourse(int courseId)
    {
        var lessons = await _repo.GetByCourseId(courseId);
        return _mapper.Map<IEnumerable<LessonDto>>(lessons);
    }

    public async Task<LessonDto> CreateLesson(CreateLessonDto dto)
    {
        var lesson = _mapper.Map<Lesson>(dto);
        await _repo.AddAsync(lesson);
        await _repo.SaveAsync();

        return _mapper.Map<LessonDto>(lesson);
    }

    public async Task<bool> UpdateLesson(int id, CreateLessonDto dto)
    {
        var lesson = await _repo.GetById(id);
        if (lesson == null) return false;

        lesson.Title = dto.Title;
        lesson.Content = dto.Content;
        lesson.OrderIndex = dto.OrderIndex;

        _repo.Update(lesson);
        await _repo.SaveAsync();

        return true;
    }

    public async Task<bool> DeleteLesson(int id)
    {
        var lesson = await _repo.GetById(id);
        if (lesson == null) return false;

        _repo.Delete(lesson);
        await _repo.SaveAsync();

        return true;
    }
}