import { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import { CourseListDto } from '../types';
import CourseCard from '../components/CourseCard';
import CourseFilters from '../components/CourseFilters';

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseListDto[]>([]);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [publishedOnly, setPublishedOnly] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('publishedOnly', String(publishedOnly));
    if (search) params.set('search', search);
    if (level) params.set('level', level);

    setLoading(true);
    apiClient.get<CourseListDto[]>(`/courses?${params.toString()}`)
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [search, level, publishedOnly]);

  return (
    <div>
      <h1>Courses</h1>
      <CourseFilters
        search={search} level={level} publishedOnly={publishedOnly}
        onSearchChange={setSearch} onLevelChange={setLevel} onPublishedOnlyChange={setPublishedOnly}
      />
      {loading ? <p>Loading...</p> : (
        <div className="courses-grid">
          {courses.length === 0 ? <p>No courses found.</p> :
            courses.map(c => <CourseCard key={c.id} course={c} />)}
        </div>
      )}
    </div>
  );
}
