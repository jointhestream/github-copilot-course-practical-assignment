import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { EnrollmentDto } from '../types';

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<EnrollmentDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get<EnrollmentDto[]>('/enrollments/mine')
      .then(setEnrollments)
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>My Courses</h1>
      {enrollments.length === 0 ? (
        <p>You haven't enrolled in any courses yet. <Link to="/courses">Browse courses</Link></p>
      ) : (
        <div className="enrollments-list">
          {enrollments.map(e => (
            <div key={e.id} className="enrollment-card">
              <h3><Link to={`/courses/${e.courseId}`}>{e.courseTitle}</Link></h3>
              <p>Enrolled: {new Date(e.enrolledAtUtc).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
