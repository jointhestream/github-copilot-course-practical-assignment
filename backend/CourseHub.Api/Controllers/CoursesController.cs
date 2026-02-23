using System.Security.Claims;
using CourseHub.Api.Data;
using CourseHub.Api.Dtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CourseHub.Api.Controllers;

[ApiController]
[Route("api/courses")]
public class CoursesController : ControllerBase
{
    private readonly AppDbContext _db;

    public CoursesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] bool publishedOnly = true,
        [FromQuery] string? search = null,
        [FromQuery] string? level = null)
    {
        var query = _db.Courses.AsQueryable();

        if (publishedOnly)
            query = query.Where(c => c.IsPublished);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(c => c.Title.Contains(search) || c.Description.Contains(search));

        if (!string.IsNullOrWhiteSpace(level))
            query = query.Where(c => c.Level == level);

        var courses = await query
            .OrderByDescending(c => c.CreatedAtUtc)
            .Select(c => new CourseListDto(c.Id, c.Title, c.Description, c.Level, c.IsPublished))
            .ToListAsync();

        return Ok(courses);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var course = await _db.Courses
            .Include(c => c.Lessons.OrderBy(l => l.Order))
            .FirstOrDefaultAsync(c => c.Id == id);

        if (course == null) return NotFound();

        // If unpublished, only admin can view
        if (!course.IsPublished)
        {
            var role = User.FindFirstValue(ClaimTypes.Role);
            if (role != "Admin")
                return NotFound();
        }

        var dto = new CourseDetailsDto(
            course.Id, course.Title, course.Description, course.Level, course.IsPublished,
            course.Lessons.Select(l => new LessonDto(l.Id, l.Title, l.Content, l.Order)).ToList());

        return Ok(dto);
    }
}
