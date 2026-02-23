namespace CourseHub.Api.Dtos;

public record CourseDetailsDto(Guid Id, string Title, string Description, string Level, bool IsPublished, List<LessonDto> Lessons);
