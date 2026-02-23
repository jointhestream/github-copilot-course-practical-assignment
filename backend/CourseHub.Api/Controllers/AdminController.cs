using CourseHub.Api.Data;
using CourseHub.Api.Dtos;
using CourseHub.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CourseHub.Api.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> Stats()
    {
        var totalUsers = await _db.Users.CountAsync();
        var totalCourses = await _db.Courses.CountAsync();
        var totalEnrollments = await _db.Enrollments.CountAsync();

        var topCourses = await _db.Courses
            .OrderByDescending(c => c.Enrollments.Count)
            .Take(5)
            .Select(c => new TopCourseDto(c.Id, c.Title, c.Enrollments.Count))
            .ToListAsync();

        return Ok(new AdminStatsDto(totalUsers, totalCourses, totalEnrollments, topCourses));
    }

    [HttpGet("courses")]
    public async Task<IActionResult> GetCourses()
    {
        var courses = await _db.Courses
            .OrderByDescending(c => c.CreatedAtUtc)
            .Select(c => new CourseListDto(c.Id, c.Title, c.Description, c.Level, c.IsPublished))
            .ToListAsync();

        return Ok(courses);
    }

    [HttpPost("courses")]
    public async Task<IActionResult> CreateCourse([FromBody] CreateCourseDto dto)
    {
        var course = new Course
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            Level = dto.Level,
            IsPublished = dto.IsPublished,
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };

        _db.Courses.Add(course);
        await _db.SaveChangesAsync();

        return Ok(new CourseListDto(course.Id, course.Title, course.Description, course.Level, course.IsPublished));
    }

    [HttpPut("courses/{id:guid}")]
    public async Task<IActionResult> UpdateCourse(Guid id, [FromBody] UpdateCourseDto dto)
    {
        var course = await _db.Courses.FindAsync(id);
        if (course == null) return NotFound();

        course.Title = dto.Title;
        course.Description = dto.Description;
        course.Level = dto.Level;
        course.IsPublished = dto.IsPublished;
        course.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(new CourseListDto(course.Id, course.Title, course.Description, course.Level, course.IsPublished));
    }

    [HttpDelete("courses/{id:guid}")]
    public async Task<IActionResult> DeleteCourse(Guid id)
    {
        var course = await _db.Courses.FindAsync(id);
        if (course == null) return NotFound();

        _db.Courses.Remove(course);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    // Lesson management
    [HttpPost("courses/{courseId:guid}/lessons")]
    public async Task<IActionResult> CreateLesson(Guid courseId, [FromBody] CreateLessonDto dto)
    {
        var course = await _db.Courses.FindAsync(courseId);
        if (course == null) return NotFound();

        var lesson = new Lesson
        {
            Id = Guid.NewGuid(),
            CourseId = courseId,
            Title = dto.Title,
            Content = dto.Content,
            Order = dto.Order
        };

        _db.Lessons.Add(lesson);
        await _db.SaveChangesAsync();

        return Ok(new LessonDto(lesson.Id, lesson.Title, lesson.Content, lesson.Order));
    }

    [HttpPut("lessons/{lessonId:guid}")]
    public async Task<IActionResult> UpdateLesson(Guid lessonId, [FromBody] UpdateLessonDto dto)
    {
        var lesson = await _db.Lessons.FindAsync(lessonId);
        if (lesson == null) return NotFound();

        lesson.Title = dto.Title;
        lesson.Content = dto.Content;
        lesson.Order = dto.Order;

        await _db.SaveChangesAsync();

        return Ok(new LessonDto(lesson.Id, lesson.Title, lesson.Content, lesson.Order));
    }

    [HttpDelete("lessons/{lessonId:guid}")]
    public async Task<IActionResult> DeleteLesson(Guid lessonId)
    {
        var lesson = await _db.Lessons.FindAsync(lessonId);
        if (lesson == null) return NotFound();

        _db.Lessons.Remove(lesson);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
