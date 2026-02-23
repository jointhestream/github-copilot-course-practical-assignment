interface CourseFiltersProps {
  search: string;
  level: string;
  publishedOnly: boolean;
  onSearchChange: (v: string) => void;
  onLevelChange: (v: string) => void;
  onPublishedOnlyChange: (v: boolean) => void;
}

export default function CourseFilters({
  search, level, publishedOnly,
  onSearchChange, onLevelChange, onPublishedOnlyChange
}: CourseFiltersProps) {
  return (
    <div className="course-filters">
      <input
        type="text"
        placeholder="Search courses..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
      />
      <select value={level} onChange={e => onLevelChange(e.target.value)}>
        <option value="">All Levels</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>
      <label>
        <input
          type="checkbox"
          checked={publishedOnly}
          onChange={e => onPublishedOnlyChange(e.target.checked)}
        />
        Published only
      </label>
    </div>
  );
}
