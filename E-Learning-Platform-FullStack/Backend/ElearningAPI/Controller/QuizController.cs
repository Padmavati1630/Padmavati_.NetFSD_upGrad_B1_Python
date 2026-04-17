using ElearningAPI.DTOs;
using ElearningAPI.Services;
using Microsoft.AspNetCore.Mvc;
using ElearningAPI.Services.Interfaces;

namespace ElearningAPI.Controllers;

[ApiController]
[Route("api/quizzes")]
public class QuizController : ControllerBase
{
    private readonly IQuizService _service;

    public QuizController(IQuizService service)
    {
        _service = service;
    }

    [HttpGet("{courseId}")]
    public async Task<IActionResult> GetByCourse(int courseId)
    {
        var quizzes = await _service.GetQuizzesByCourse(courseId);
        return Ok(quizzes);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateQuizDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        await _service.CreateQuiz(dto);

        return StatusCode(201); 
    }

    [HttpPost("questions")]
    public async Task<IActionResult> AddQuestion(CreateQuestionDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        await _service.AddQuestion(dto);

        return StatusCode(201); 
    }

    [HttpGet("{quizId}/questions")]
    public async Task<IActionResult> GetQuestions(int quizId)
    {
        var quiz = await _service.GetQuizWithQuestions(quizId);

        if (quiz == null) return NotFound();

        var result = quiz.Questions.Select(q => new
        {
            q.QuestionId,
            q.QuestionText,
            Options = new[] { q.OptionA, q.OptionB, q.OptionC, q.OptionD },
            CorrectAnswer = q.CorrectAnswer
        });

        return Ok(result);
    }

    [HttpPost("{quizId}/submit")]
    public async Task<IActionResult> Submit(int quizId, QuizSubmitDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var score = await _service.SubmitQuiz(quizId, dto);
            return Ok(new { Score = score });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }
/*     [HttpGet("course/{courseId}/exists")]
    public async Task<IActionResult> QuizExists(int courseId)
    {
        var exists = await _service.QuizExistsForCourse(courseId);
        return Ok(exists);
    } */
    [HttpPost("mixed/submit")]
public async Task<IActionResult> SubmitMixed(QuizSubmitDto dto)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    try
    {
        var score = await _service.SubmitMixedQuiz(dto);
        return Ok(new { Score = score });
    }
    catch (Exception ex)
    {
        return BadRequest(ex.Message);
    }
}
}