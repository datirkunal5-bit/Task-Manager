import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

function KanbanColumn({ id, label, tasks, onEdit, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-100 rounded-xl p-3 min-h-[200px] transition-colors ${
        isOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''
      }`}
    >
      <h3 className="font-semibold text-gray-700 text-sm mb-3 px-1 flex items-center justify-between">
        {label}
        <span className="text-gray-400 font-normal">{tasks.length}</span>
      </h3>

      <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onEdit={onEdit} onDelete={onDelete} />
          ))}
          {tasks.length === 0 && (
            <p className="text-gray-400 text-xs text-center py-4">No tasks</p>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default KanbanColumn;