namespace CourseHub.Api.Dtos;

public record CourseListDto(Guid Id, string Title, string Description, string Level, bool IsPublished);
