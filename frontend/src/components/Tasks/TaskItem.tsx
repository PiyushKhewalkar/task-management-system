import { useState } from 'react';
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
  
  interface TaskItemProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
    onStatusUpdate: () => void;
  }
  
  const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onStatusUpdate }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showStatusDialog, setShowStatusDialog] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const { showSuccess, showError } = useToast();
    // Format date with better readability
    const formatDate = (dateString: string) => {
        if (!dateString) return 'No due date';
        
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Check if it's today
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        }
        
        // Check if it's tomorrow
        if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        }
        
        // Check if it's overdue
        if (date < today) {
            return `Overdue (${date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            })})`;
        }
        
        // Regular date formatting
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleEdit = () => {
        setShowMenu(false);
        onEdit(task);
    };

    const handleDeleteClick = () => {
        setShowMenu(false);
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = () => {
        onDelete(task._id);
        setShowDeleteConfirm(false);
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
        setShowMenu(false); // Also close the menu
    };

    const handleTaskClick = () => {
        setShowStatusDialog(true);
    };

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            setIsUpdatingStatus(true);
            const response = await tasksAPI.updateTask(task._id, { status: newStatus });
            
            if (response.success) {
                showSuccess('Task status updated successfully!');
                onStatusUpdate(); // Refresh the tasks list
                setShowStatusDialog(false);
            } else {
                showError('Failed to update task status');
            }
        } catch (error: any) {
            console.error('Error updating task status:', error);
            showError('Failed to update task status');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleStatusDialogClose = () => {
        setShowStatusDialog(false);
    };

    return (
        <div 
            className="p-4 sm:p-5 bg-card border border-border rounded-lg space-y-3 hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={handleTaskClick}
        >
            <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs font-medium rounded-md">
                    {task.priority}
                </span>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-md">
                    {task.status}
                </span>
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-card-foreground">{task.title}</h2>
            <p className="text-muted-foreground text-sm line-clamp-2">{task.description}</p>
            <div className="flex justify-between items-center gap-2">
                <div className="flex space-x-2 items-center">
                    <div className="rounded-full h-3 w-3 bg-primary"></div> 
                    <span className="text-sm text-muted-foreground">
                        {formatDate(task.dueDate)}
                    </span>
                </div>
                <div className="relative">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                    
                    {showMenu && (
                        <div className="absolute right-0 top-8 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[120px]">
                            <button
                                onClick={handleEdit}
                                className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-accent transition-colors flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Edit</span>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick();
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Delete</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div 
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={handleDeleteCancel}
                >
                    <div 
                        className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-card-foreground mb-2">Delete Task</h3>
                        <p className="text-muted-foreground mb-6">
                            Are you sure you want to delete "{task.title}"? This action cannot be undone.
                        </p>
                        <div className="flex space-x-3 justify-end">
                            <button
                                onClick={handleDeleteCancel}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Status Update Dialog */}
            {showStatusDialog && (
                <div 
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={handleStatusDialogClose}
                >
                    <div 
                        className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-card-foreground">Update Status</h3>
                            <button
                                onClick={handleStatusDialogClose}
                                className="text-foreground hover:text-foreground transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="mb-6">
                            <h4 className="text-sm font-medium text-foreground mb-2">Task: {task.title}</h4>
                            <p className="text-sm text-foreground">Current status: <span className="font-medium">{task.status}</span></p>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Select New Status
                            </label>
                            <div className="space-y-2">
                                {[
                                    { value: 'todo', label: 'Todo' },
                                    { value: 'in-progress', label: 'In Progress' },
                                    { value: 'completed', label: 'Completed' }
                                ].map((status) => (
                                    <button
                                        key={status.value}
                                        onClick={() => handleStatusUpdate(status.value)}
                                        disabled={isUpdatingStatus || task.status === status.value}
                                        className={`w-full p-3 rounded-lg text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                            task.status === status.value
                                                ? 'bg-primary text-primary-foreground border border-primary'
                                                : 'bg-input hover:bg-accent border border-border text-foreground'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{status.label}</span>
                                            {task.status === status.value && (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {isUpdatingStatus && (
                            <div className="mt-4 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                                <span className="text-sm text-foreground">Updating...</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default TaskItem