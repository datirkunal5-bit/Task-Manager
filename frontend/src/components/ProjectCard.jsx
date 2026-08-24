import { useNavigate } from 'react-router-dom';

function ProjectCard({ project, onEdit, onDelete }) {
  const navigate = useNavigate();

  const statusStyles = {
    active: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    completed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    'on-hold': 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  };

  const statusDot = {
    active: 'bg-blue-500',
    completed: 'bg-emerald-500',
    'on-hold': 'bg-amber-500',
  };

  const formattedDate = project.dueDate
    ? new Date(project.dueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <div
        onClick={() => navigate(`/projects/${project._id}`)}
        className="cursor-pointer"
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-gray-900 leading-snug pr-2">
            {project.title}
          </h3>
          <span
            className={`shrink-0 flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusStyles[project.status]}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot[project.status]}`} />
            {project.status}
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {project.description || 'No description provided'}
        </p>
        {formattedDate && (
          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Due {formattedDate}
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-5 pt-4 border-t border-gray-100">
        <button
          onClick={() => onEdit(project)}
          className="flex-1 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 py-2 rounded-lg transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(project._id)}
          className="flex-1 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-red-50 hover:text-red-600 py-2 rounded-lg transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;