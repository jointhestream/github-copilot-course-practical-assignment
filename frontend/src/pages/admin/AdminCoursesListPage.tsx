import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import { CourseListDto } from '../../types';

export default function AdminCoursesListPage() {
  const [courses, setCourses] = useState<CourseListDto[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCourses = () => {
    setLoading(true);
    apiClient.get<CourseListDto[]>('/admin/courses')
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCourses(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course?')) return;
    await apiClient.delete(`/admin/courses/${id}`);
    loadCourses();
  };

  const handleTogglePublish = async (course: CourseListDto) => {
    await apiClient.put(`/admin/courses/${course.id}`, {
      title: course.title,
      description: course.description,
      level: course.level,
      isPublished: !course.isPublished,
    });
    loadCourses();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Courses</h1>
        <Link to="/admin/courses/new" className="btn btn-primary">New Course</Link>
      </div>
      <table className="data-table">
        <thead>
          <tr><th>Title</th><th>Level</th><th>Published</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {courses.map(c => (
            <tr key={c.id}>
              <td>{c.title}</td>
              <td>{c.level}</td>
              <td>{c.isPublished ? 'Yes' : 'No'}</td>
              <td className="actions">
                <Link to={`/admin/courses/${c.id}/edit`} className="btn btn-sm">Edit</Link>
                <Link to={`/admin/courses/${c.id}/lessons`} className="btn btn-sm">Lessons</Link>
                <button onClick={() => handleTogglePublish(c)} className="btn btn-sm">
                  {c.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => handleDelete(c.id)} className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
