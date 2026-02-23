namespace CourseHub.Api.Dtos;

public record EnrollmentDto(Guid Id, Guid CourseId, string CourseTitle, DateTime EnrolledAtUtc);
