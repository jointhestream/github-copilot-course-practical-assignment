import { Link } from 'react-router-dom';
import { CourseListDto } from '../types';

export default function CourseCard({ course }: { course: CourseListDto }) {
  return (
    <div className="course-card">
      <h3><Link to={`/courses/${course.id}`}>{course.title}</Link></h3>
      <p>{course.description}</p>
      <div className="course-meta">
        <span className={`level level-${course.level.toLowerCase()}`}>{course.level}</span>
        {!course.isPublished && <span className="badge-draft">Draft</span>}
      </div>
    </div>
  );
}
