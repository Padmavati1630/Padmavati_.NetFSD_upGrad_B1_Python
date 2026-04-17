using ElearningAPI.Models;
using ElearningAPI.Data;
using Microsoft.AspNetCore.Mvc;
using BCrypt.Net;

namespace ElearningAPI.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(User user)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return StatusCode(201, new
        {
            user.UserId,
            user.FullName,
            user.Email
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return NotFound();

        return Ok(new
        {
            user.UserId,
            user.FullName,
            user.Email,
            user.CreatedAt
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await Task.FromResult(
            _context.Users.Select(u => new
            {
                u.UserId,
                u.FullName,
                u.Email,
                u.CreatedAt
            }).ToList()
        );

        return Ok(users);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, User updatedUser)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return NotFound();

        user.FullName = updatedUser.FullName;
        user.Email = updatedUser.Email;

        if (!string.IsNullOrEmpty(updatedUser.PasswordHash))
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updatedUser.PasswordHash);
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("login")]
    public IActionResult Login(User loginUser)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = _context.Users
            .FirstOrDefault(u => u.Email == loginUser.Email);

        if (user == null)
            return Unauthorized("Invalid email");

        bool isValid = BCrypt.Net.BCrypt.Verify(loginUser.PasswordHash, user.PasswordHash);

        if (!isValid)
            return Unauthorized("Invalid password");

        return Ok(new
        {
            user.UserId,
            user.FullName,
            user.Email
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent(); 
    }
}