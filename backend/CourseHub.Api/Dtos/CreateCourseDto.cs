namespace CourseHub.Api.Dtos;

public record CreateCourseDto(string Title, string Description, string Level, bool IsPublished);
