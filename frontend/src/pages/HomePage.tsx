import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="home-page">
      <h1>Welcome to CourseHub</h1>
      <p>Your one-stop platform for online learning. Browse our courses and start learning today!</p>
      <Link to="/courses" className="btn btn-primary">Browse Courses</Link>
    </div>
  );
}
