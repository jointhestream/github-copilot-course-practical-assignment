import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import { CourseDetailsDto, LessonDto } from '../../types';
import InlineAlert from '../../components/InlineAlert';

export default function AdminLessonsPage() {
  const { id } = useParams<{ id: string }>();
  const [lessons, setLessons] = useState<LessonDto[]>([]);
  const [courseTitle, setCourseTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // New/Edit lesson form
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [order, setOrder] = useState(1);

  const loadCourse = useCallback(() => {
    setLoading(true);
    apiClient.get<CourseDetailsDto>(`/courses/${id}`)
      .then(c => {
        setCourseTitle(c.title);
        setLessons(c.lessons);
      })
      .catch(() => setError('Failed to load course'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => { loadCourse(); }, [loadCourse]);

  const resetForm = () => {
    setEditId(null);
    setTitle('');
    setContent('');
    setOrder(lessons.length + 1);
  };

  const handleEdit = (lesson: LessonDto) => {
    setEditId(lesson.id);
    setTitle(lesson.title);
    setContent(lesson.content);
    setOrder(lesson.order);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await apiClient.put(`/admin/lessons/${editId}`, { title, content, order });
      } else {
        await apiClient.post(`/admin/courses/${id}/lessons`, { title, content, order });
      }
      resetForm();
      loadCourse();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save lesson');
    }
  };

  const handleDelete = async (lessonId: string) => {
    if (!confirm('Delete this lesson?')) return;
    await apiClient.delete(`/admin/lessons/${lessonId}`);
    loadCourse();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Lessons for: {courseTitle}</h1>
      <InlineAlert type="error" message={error} />

      <form onSubmit={handleSubmit} className="form lesson-form">
        <h3>{editId ? 'Edit Lesson' : 'Add Lesson'}</h3>
        <div className="form-field">
          <label>Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="form-field">
          <label>Content</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} required />
        </div>
        <div className="form-field">
          <label>Order</label>
          <input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} min={1} required />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Add'}</button>
          {editId && <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>}
        </div>
      </form>

      <table className="data-table">
        <thead><tr><th>Order</th><th>Title</th><th>Actions</th></tr></thead>
        <tbody>
          {lessons.map(l => (
            <tr key={l.id}>
              <td>{l.order}</td>
              <td>{l.title}</td>
              <td className="actions">
                <button onClick={() => handleEdit(l)} className="btn btn-sm">Edit</button>
                <button onClick={() => handleDelete(l.id)} className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
          {lessons.length === 0 && <tr><td colSpan={3}>No lessons yet</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
