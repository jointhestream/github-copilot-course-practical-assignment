import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/apiClient';
import InlineAlert from '../../components/InlineAlert';

export default function AdminCourseCreatePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [isPublished, setIsPublished] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await apiClient.post('/admin/courses', { title, description, level, isPublished });
      navigate('/admin/courses');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create course');
    }
  };

  return (
    <div>
      <h1>Create Course</h1>
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
        <button type="submit" className="btn btn-primary">Create</button>
      </form>
    </div>
  );
}
