export interface UserDto {
  id: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: UserDto;
}

export interface CourseListDto {
  id: string;
  title: string;
  description: string;
  level: string;
  isPublished: boolean;
}

export interface LessonDto {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface CourseDetailsDto {
  id: string;
  title: string;
  description: string;
  level: string;
  isPublished: boolean;
  lessons: LessonDto[];
}

export interface EnrollmentDto {
  id: string;
  courseId: string;
  courseTitle: string;
  enrolledAtUtc: string;
}

export interface AdminStatsDto {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  topCoursesByEnrollment: { courseId: string; title: string; enrollments: number }[];
}
