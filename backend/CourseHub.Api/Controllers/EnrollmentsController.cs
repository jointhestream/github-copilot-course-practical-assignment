using System.IdentityModel.Tokens.Jwt;
using CourseHub.Api.Data;
using CourseHub.Api.Dtos;
using CourseHub.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CourseHub.Api.Controllers;

[ApiController]
[Route("api/enrollments")]
[Authorize]
public class EnrollmentsController : ControllerBase
{
    private readonly AppDbContext _db;

    public EnrollmentsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    public async Task<IActionResult> Enroll([FromBody] EnrollRequestDto dto)
    {
        var userId = Guid.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Sub)!);

        var course = await _db.Courses.FindAsync(dto.CourseId);
        if (course == null) return NotFound(new { message = "Course not found." });

        if (!course.IsPublished)
        {
            var role = User.FindFirstValue(ClaimTypes.Role);
            if (role != "Admin")
                return BadRequest(new { message = "Cannot enroll in unpublished course." });
        }

        var exists = await _db.Enrollments.AnyAsync(e => e.UserId == userId && e.CourseId == dto.CourseId);
        if (exists) return Conflict(new { message = "Already enrolled." });

        var enrollment = new Enrollment
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            CourseId = dto.CourseId,
            EnrolledAtUtc = DateTime.UtcNow
        };

        _db.Enrollments.Add(enrollment);
        await _db.SaveChangesAsync();

        return Ok(new EnrollmentDto(enrollment.Id, enrollment.CourseId, course.Title, enrollment.EnrolledAtUtc));
    }

    [HttpGet("mine")]
    public async Task<IActionResult> Mine()
    {
        var userId = Guid.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Sub)!);

        var enrollments = await _db.Enrollments
            .Where(e => e.UserId == userId)
            .Include(e => e.Course)
            .OrderByDescending(e => e.EnrolledAtUtc)
            .Select(e => new EnrollmentDto(e.Id, e.CourseId, e.Course.Title, e.EnrolledAtUtc))
            .ToListAsync();

        return Ok(enrollments);
    }
}
