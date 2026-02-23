import { Link, useLocation } from 'react-router-dom';

export default function AdminSidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  return (
    <aside className="admin-sidebar">
      <h3>Admin Panel</h3>
      <nav>
        <Link to="/admin" className={isActive('/admin')}>Dashboard</Link>
        <Link to="/admin/courses" className={isActive('/admin/courses')}>Courses</Link>
        <Link to="/" className="back-link">← Back to Site</Link>
      </nav>
    </aside>
  );
}
