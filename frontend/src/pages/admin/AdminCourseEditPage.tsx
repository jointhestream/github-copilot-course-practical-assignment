import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import { CourseDetailsDto } from '../../types';
import InlineAlert from '../../components/InlineAlert';

export default function AdminCourseEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [isPublished, setIsPublished] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<CourseDetailsDto>(`/courses/${id}`)
      .then(c => {
        setTitle(c.title);
        setDescription(c.description);
        setLevel(c.level);
        setIsPublished(c.isPublished);
      })
      .catch(() => setError('Course not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await apiClient.put(`/admin/courses/${id}`, { title, description, level, isPublished });
      navigate('/admin/courses');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update course');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Course</h1>
      <InlineAlert type="error" message={error} />
      <form onSubmit={handleSubmit} className="form">
        <div className="form-field">
          <label>Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="form-field">
          <label>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        <div className="form-field">
          <label>Level</label>
          <select value={level} onChange={e => setLevel(e.target.value)}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
        <div className="form-field">
          <label>
            <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} />
            Published
          </label>
        </div>
        <button type="submit" className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  );
}
