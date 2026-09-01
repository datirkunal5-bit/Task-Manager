import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function TaskCard({ task, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityStyles = {
    low: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
    medium: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400',
    high: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900 dark:text-white text-sm leading-snug pr-2">
          {task.title}
        </h4>
        <span
          className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${priorityStyles[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-gray-500 dark:text-gray-400 text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {task.labels?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.labels.map((label) => (
            <span
              key={label}
              className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {task.assignedTo && (
        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mt-2">
          <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-medium text-gray-600 dark:text-gray-300">
            {task.assignedTo.name?.[0]?.toUpperCase()}
          </div>
          {task.assignedTo.name}
        </div>
      )}

      <div className="flex gap-3 mt-3 pt-2 border-t border-gray-50 dark:border-gray-800">
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onEdit(task)}
          className="text-[11px] text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
        >
          Edit
        </button>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDelete(task._id)}
          className="text-[11px] text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;