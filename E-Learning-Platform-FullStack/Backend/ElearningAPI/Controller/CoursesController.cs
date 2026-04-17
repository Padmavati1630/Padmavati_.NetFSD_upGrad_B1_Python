using ElearningAPI.DTOs;
using ElearningAPI.Services;
using Microsoft.AspNetCore.Mvc;
using ElearningAPI.Services.Interfaces;

namespace ElearningAPI.Controllers;

[ApiController]
[Route("api/courses")]
public class CoursesController : ControllerBase
{
    private readonly ICourseService _service;

    public CoursesController(ICourseService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var courses = await _service.GetAllCourses();
        return Ok(courses);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var course = await _service.GetCourseById(id);
        if (course == null) return NotFound();

        return Ok(course);
    }

   [HttpPost]
    public async Task<IActionResult> Create(CreateCourseDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var created = await _service.CreateCourse(dto);

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateCourseDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var updated = await _service.UpdateCourse(id, dto);
        if (!updated) return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _service.DeleteCourse(id);
        if (!deleted) return NotFound();

        return NoContent();
    }
}
