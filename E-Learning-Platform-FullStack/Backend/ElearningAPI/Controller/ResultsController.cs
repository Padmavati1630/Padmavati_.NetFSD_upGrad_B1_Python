using ElearningAPI.Services;
using Microsoft.AspNetCore.Mvc;
using ElearningAPI.Data;
using ElearningAPI.Services.Interfaces;

namespace ElearningAPI.Controllers;

[ApiController]
[Route("api/results")]
public class ResultsController : ControllerBase
{
    private readonly IResultService _service;

    public ResultsController(IResultService service)
    {
        _service = service;
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetResults(int userId)
    {
        var results = await _service.GetResultsByUser(userId);
        return Ok(results);
    }

    [HttpDelete("{userId}")]
    public async Task<IActionResult> ClearResults(int userId)
    {
        var deleted = await _service.ClearResults(userId);

        if (!deleted) return NotFound();

        return NoContent();
    }
}
