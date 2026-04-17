using ElearningAPI.DTOs;
using ElearningAPI.Services;
using Microsoft.AspNetCore.Mvc;
using ElearningAPI.Services.Interfaces;

namespace ElearningAPI.Controllers;

[ApiController]
[Route("api")]
public class LessonsController : ControllerBase
{
    private readonly ILessonService _service;

    public LessonsController(ILessonService service)
    {
        _service = service;
    }

    // GET lessons by course → 200 OK
    [HttpGet("courses/{courseId}/lessons")]
    public async Task<IActionResult> GetLessons(int courseId)
    {
        var lessons = await _service.GetLessonsByCourse(courseId);
        return Ok(lessons);
    }

    // CREATE lesson → 201 Created
    [HttpPost("lessons")]
    public async Task<IActionResult> Create(CreateLessonDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var lesson = await _service.CreateLesson(dto);

        return CreatedAtAction(nameof(GetLessons), new { courseId = dto.CourseId }, lesson);
    }

    // UPDATE lesson → 204 NoContent / 404 NotFound
    [HttpPut("lessons/{id}")]
    public async Task<IActionResult> Update(int id, CreateLessonDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updated = await _service.UpdateLesson(id, dto);
        if (!updated) return NotFound();

        return NoContent();
    }

    // DELETE lesson → 204 NoContent / 404 NotFound
    [HttpDelete("lessons/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteLesson(id);
        if (!deleted) return NotFound();

        return NoContent();
    }
}