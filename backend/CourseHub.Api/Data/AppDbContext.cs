using CourseHub.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace CourseHub.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.Id);
            e.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<Course>(e =>
        {
            e.HasKey(c => c.Id);
            e.HasIndex(c => c.IsPublished);
        });

        modelBuilder.Entity<Lesson>(e =>
        {
            e.HasKey(l => l.Id);
            e.HasIndex(l => new { l.CourseId, l.Order });
            e.HasOne(l => l.Course).WithMany(c => c.Lessons).HasForeignKey(l => l.CourseId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Enrollment>(e =>
        {
            e.HasKey(en => en.Id);
            e.HasIndex(en => new { en.UserId, en.CourseId }).IsUnique();
            e.HasOne(en => en.User).WithMany(u => u.Enrollments).HasForeignKey(en => en.UserId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(en => en.Course).WithMany(c => c.Enrollments).HasForeignKey(en => en.CourseId).OnDelete(DeleteBehavior.Cascade);
        });
    }
}
