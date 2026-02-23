import { useState, useEffect } from 'react';
import { apiClient } from '../../services/apiClient';
import { AdminStatsDto } from '../../types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStatsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<AdminStatsDto>('/admin/stats')
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!stats) return <p>Failed to load stats.</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card"><h3>{stats.totalUsers}</h3><p>Users</p></div>
        <div className="stat-card"><h3>{stats.totalCourses}</h3><p>Courses</p></div>
        <div className="stat-card"><h3>{stats.totalEnrollments}</h3><p>Enrollments</p></div>
      </div>
      <h2>Top Courses by Enrollment</h2>
      <table className="data-table">
        <thead><tr><th>Title</th><th>Enrollments</th></tr></thead>
        <tbody>
          {stats.topCoursesByEnrollment.map(c => (
            <tr key={c.courseId}><td>{c.title}</td><td>{c.enrollments}</td></tr>
          ))}
          {stats.topCoursesByEnrollment.length === 0 && <tr><td colSpan={2}>No enrollments yet</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
