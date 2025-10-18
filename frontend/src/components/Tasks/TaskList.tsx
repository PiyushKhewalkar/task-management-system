import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskItem from "./TaskItem";
import { tasksAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface Task {
  _id: string;
  title: string;
  status: string;
  description: string;
  priority: string;
  dueDate: string;
}

interface TaskListProps {
  tasks: Task[];
  onTasksChange: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTasksChange }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleEdit = (task: Task) => {
    navigate(`/tasks/edit/${task._id}`);
  };

  const handleDelete = async (taskId: string) => {
    try {
      setIsDeleting(true);
      const response = await tasksAPI.deleteTask(taskId);
      
      if (response.success) {
        showSuccess('Task deleted successfully!');
        onTasksChange(); // Refresh the tasks list
      } else {
        const errorMsg = 'Failed to delete task. Please try again.';
        console.error(errorMsg);
        showError(errorMsg);
      }
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to delete task. Please try again.';
      console.error('Error deleting task:', error);
      showError(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Removed inline form logic - now using navigation

  if (!tasks || tasks.length === 0) {
    return <p className="text-muted-foreground">No tasks found</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {tasks.map((task) => (
        <TaskItem 
          key={task._id} 
          task={task} 
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusUpdate={onTasksChange}
        />
      ))}
    </div>
  );
};

export default TaskList;
