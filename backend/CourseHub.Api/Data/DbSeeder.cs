using CourseHub.Api.Entities;
using Microsoft.AspNetCore.Identity;

namespace CourseHub.Api.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.Users.Any()) return;

        var hasher = new PasswordHasher<User>();

        var admin = new User
        {
            Id = Guid.NewGuid(),
            Email = "admin@local",
            Role = "Admin",
            CreatedAtUtc = DateTime.UtcNow
        };
        admin.PasswordHash = hasher.HashPassword(admin, "Admin123!");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "user@local",
            Role = "User",
            CreatedAtUtc = DateTime.UtcNow
        };
        user.PasswordHash = hasher.HashPassword(user, "User123!");

        db.Users.AddRange(admin, user);

        var course1 = new Course
        {
            Id = Guid.NewGuid(),
            Title = "Introduction to C#",
            Description = "Learn the basics of C# programming language.",
            Level = "Beginner",
            IsPublished = true,
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };
        var course2 = new Course
        {
            Id = Guid.NewGuid(),
            Title = "Advanced ASP.NET Core",
            Description = "Deep dive into ASP.NET Core web development.",
            Level = "Advanced",
            IsPublished = true,
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };
        var course3 = new Course
        {
            Id = Guid.NewGuid(),
            Title = "React Fundamentals",
            Description = "Build modern UIs with React and TypeScript.",
            Level = "Intermediate",
            IsPublished = false,
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow
        };

        db.Courses.AddRange(course1, course2, course3);

        db.Lessons.AddRange(
            new Lesson { Id = Guid.NewGuid(), CourseId = course1.Id, Title = "Hello World", Content = "Your first C# program. Learn to write and run a simple console application.", Order = 1 },
            new Lesson { Id = Guid.NewGuid(), CourseId = course1.Id, Title = "Variables and Types", Content = "Explore data types, variables, and type conversions in C#.", Order = 2 },
            new Lesson { Id = Guid.NewGuid(), CourseId = course1.Id, Title = "Control Flow", Content = "Learn about if/else, switch, loops, and other control flow statements.", Order = 3 },
            new Lesson { Id = Guid.NewGuid(), CourseId = course2.Id, Title = "Middleware Pipeline", Content = "Understand the ASP.NET Core middleware pipeline and how to create custom middleware.", Order = 1 },
            new Lesson { Id = Guid.NewGuid(), CourseId = course2.Id, Title = "Dependency Injection", Content = "Master the built-in dependency injection container in ASP.NET Core.", Order = 2 },
            new Lesson { Id = Guid.NewGuid(), CourseId = course3.Id, Title = "JSX Basics", Content = "Learn about JSX syntax and how React renders components.", Order = 1 },
            new Lesson { Id = Guid.NewGuid(), CourseId = course3.Id, Title = "State and Props", Content = "Understand component state management and prop passing.", Order = 2 }
        );

        db.SaveChanges();
    }
}
