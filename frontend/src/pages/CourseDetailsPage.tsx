import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { CourseDetailsDto } from '../types';
import { useAuth } from '../contexts/AuthContext';
import InlineAlert from '../components/InlineAlert';

export default function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [course, setCourse] = useState<CourseDetailsDto | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<CourseDetailsDto>(`/courses/${id}`)
      .then(setCourse)
      .catch(() => setError('Course not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    setMessage('');
    setError('');
    try {
      await apiClient.post('/enrollments', { courseId: id });
      setMessage('Successfully enrolled!');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Enrollment failed');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!course) return <p>{error || 'Course not found'}</p>;

  return (
    <div className="course-details">
      <h1>{course.title}</h1>
      <p className="course-description">{course.description}</p>
      <div className="course-meta">
        <span className={`level level-${course.level.toLowerCase()}`}>{course.level}</span>
        {!course.isPublished && <span className="badge-draft">Draft</span>}
      </div>

      {user && (
        <button onClick={handleEnroll} className="btn btn-primary">Enroll</button>
      )}
      <InlineAlert type="success" message={message} />
      <InlineAlert type="error" message={error} />

      <h2>Lessons</h2>
      {course.lessons.length === 0 ? <p>No lessons yet.</p> : (
        <ol className="lessons-list">
          {course.lessons.map(l => (
            <li key={l.id}>
              <strong>{l.title}</strong>
              <p>{l.content}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
