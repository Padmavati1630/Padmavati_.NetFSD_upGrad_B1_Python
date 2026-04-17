using AutoMapper;
using ElearningAPI.DTOs;
using ElearningAPI.Models;
using ElearningAPI.Repositories;
using ElearningAPI.Services.Interfaces;


namespace ElearningAPI.Services;

public class CourseService : ICourseService
{
    private readonly ICourseRepository _repo;
    private readonly IMapper _mapper;

    public CourseService(ICourseRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<IEnumerable<CourseDto>> GetAllCourses()
    {
        var courses = await _repo.GetAllAsync();
        return _mapper.Map<IEnumerable<CourseDto>>(courses);
    }

    public async Task<CourseDto?> GetCourseById(int id)
    {
        var course = await _repo.GetByIdAsync(id);
        return course == null ? null : _mapper.Map<CourseDto>(course);
    }

    public async Task<CourseDto> CreateCourse(CreateCourseDto dto)
    {
        var course = _mapper.Map<Course>(dto);
        await _repo.AddAsync(course);
        await _repo.SaveAsync();

        return _mapper.Map<CourseDto>(course);
    }

    public async Task<bool> UpdateCourse(int id, CreateCourseDto dto)
    {
        var existing = await _repo.GetByIdAsync(id);
        if (existing == null) return false;

        existing.Name = dto.Name;
        existing.Description = dto.Description;
        existing.CreatedBy = dto.CreatedBy;

        _repo.Update(existing);
        await _repo.SaveAsync();

        return true;
    }

    public async Task<bool> DeleteCourse(int id)
    {
        var course = await _repo.GetByIdAsync(id);
        if (course == null) return false;

        _repo.Delete(course);
        await _repo.SaveAsync();

        return true;
    }
}
