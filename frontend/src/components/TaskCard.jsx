function TaskCard({ task, onEdit, onDelete }) {
  const priorityStyles = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-red-100 text-red-700',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div onClick={() => onEdit(task)}>
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-gray-900 text-sm leading-snug pr-2">
            {task.title}
          </h4>
          <span
            className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${priorityStyles[task.priority]}`}
          >
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p className="text-gray-500 text-xs mb-3 line-clamp-2">{task.description}</p>
        )}

        {task.labels?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {task.labels.map((label) => (
              <span
                key={label}
                className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {task.assignedTo && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-600">
              {task.assignedTo.name?.[0]?.toUpperCase()}
            </div>
            {task.assignedTo.name}
          </div>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task._id);
        }}
        className="text-[11px] text-gray-400 hover:text-red-500 mt-3 transition-colors"
      >
        Delete
      </button>
    </div>
  );
}

export default TaskCard;