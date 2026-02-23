namespace CourseHub.Api.Dtos;

public record AdminStatsDto(
    int TotalUsers,
    int TotalCourses,
    int TotalEnrollments,
    List<TopCourseDto> TopCoursesByEnrollment);

public record TopCourseDto(Guid CourseId, string Title, int Enrollments);
