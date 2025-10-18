import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { tasksAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface Task {
    _id: string;
    title: string;
    description: string;
    priority: string;
    status: string;
    dueDate: string;
}

interface TaskFormProps {
    task?: Task;
    onCancel: () => void;
    onSuccess: () => void;
}

const TaskForm = ({ onCancel, onSuccess }: Omit<TaskFormProps, 'task'>) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { showSuccess, showError } = useToast();
    
    const [task, setTask] = useState<Task | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'low',
        status: 'todo'
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingTask, setIsLoadingTask] = useState(false);
    const [error, setError] = useState('');

    // Fetch task data if editing
    useEffect(() => {
        if (id) {
            fetchTaskData();
        }
    }, [id]);

    const fetchTaskData = async () => {
        if (!id) return;
        
        try {
            setIsLoadingTask(true);
            const response = await tasksAPI.getTask(id);
            
            if (response.success && response.task) {
                const taskData = response.task;
                setTask(taskData);
                setFormData({
                    title: taskData.title || '',
                    description: taskData.description || '',
                    dueDate: taskData.dueDate ? taskData.dueDate.split('T')[0] : '',
                    priority: taskData.priority || 'low',
                    status: taskData.status || 'todo'
                });
            } else {
                showError('Failed to load task data');
                navigate('/tasks');
            }
        } catch (error: any) {
            console.error('Error fetching task:', error);
            showError('Failed to load task data');
            navigate('/tasks');
        } finally {
            setIsLoadingTask(false);
        }
    };

    const priorities = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' }
    ];
    const statuses = [
        { value: 'todo', label: 'Todo' },
        { value: 'in-progress', label: 'In-progress' },
        { value: 'completed', label: 'Completed' }
    ];

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async () => {
        // Enhanced validation
        const errors: string[] = [];
        
        // Title validation
        if (!formData.title.trim()) {
            errors.push('Title is required');
        } else if (formData.title.trim().length < 3) {
            errors.push('Title must be at least 3 characters long');
        } else if (formData.title.trim().length > 100) {
            errors.push('Title must be less than 100 characters');
        }
        
        // Description validation
        if (formData.description.trim().length > 500) {
            errors.push('Description must be less than 500 characters');
        }
        
        // Due date validation
        if (formData.dueDate) {
            const selectedDate = new Date(formData.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time to start of day
            
            if (selectedDate < today) {
                errors.push('Due date cannot be in the past');
            }
        }
        
        // Show validation errors
        if (errors.length > 0) {
            const errorMessage = errors.join('. ');
            setError(errorMessage);
            showError(errorMessage);
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const taskData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                priority: formData.priority,
                status: formData.status,
                dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined
            };

            console.log('Sending task data:', taskData);

            let response;
            if (task) {
                // Update existing task
                response = await tasksAPI.updateTask(task._id, taskData);
            } else {
                // Create new task
                response = await tasksAPI.createTask(taskData);
            }
            
            if (response.success) {
                showSuccess(`Task ${task ? 'updated' : 'created'} successfully!`);
                onSuccess();
            } else {
                const errorMsg = `Failed to ${task ? 'update' : 'create'} task. Please try again.`;
                setError(errorMsg);
                showError(errorMsg);
            }
        } catch (err: any) {
            console.error(`Error ${task ? 'updating' : 'creating'} task:`, err);
            const errorMsg = err.message || `Failed to ${task ? 'update' : 'create'} task. Please try again.`;
            setError(errorMsg);
            showError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading state while fetching task data
    if (isLoadingTask) {
        return (
            <div className="bg-background min-h-screen text-foreground flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading task...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen text-foreground">
            {/* Header */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-border">
                <button 
                    onClick={onCancel}
                    className="text-primary text-sm sm:text-base font-medium"
                >
                    Cancel
                </button>
                <h1 className="text-foreground text-base sm:text-lg font-semibold">
                    {task ? 'Edit Task' : 'New Task'}
                </h1>
                <button 
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="text-primary text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (task ? 'Updating...' : 'Creating...') : 'Done'}
                </button>
            </div>

            {/* Form */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Error Message */}
                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                        <p className="text-destructive text-sm">{error}</p>
                    </div>
                )}

                {/* Title */}
                <div>
                    <label className="block text-foreground text-sm font-medium mb-2">
                        Title *
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                        placeholder="Enter task title"
                        disabled={isLoading}
                        maxLength={100}
                    />
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">
                            {formData.title.length < 3 ? 'Minimum 3 characters required' : ''}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {formData.title.length}/100
                        </span>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-foreground text-sm font-medium mb-2">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary resize-none"
                        placeholder="Enter task description"
                        disabled={isLoading}
                        maxLength={500}
                    />
                    <div className="flex justify-end mt-1">
                        <span className="text-xs text-muted-foreground">
                            {formData.description.length}/500
                        </span>
                    </div>
                </div>

                {/* Due Date */}
                <div>
                    <label className="block text-foreground text-sm font-medium mb-2">
                        Due date
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => handleInputChange('dueDate', e.target.value)}
                            className="w-full bg-input border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                            min={new Date().toISOString().slice(0, 10)} // Prevent selecting past dates
                        />
                        {formData.dueDate && (
                            <button
                                type="button"
                                onClick={() => handleInputChange('dueDate', '')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                disabled={isLoading}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                    {formData.dueDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                            Selected: {new Date(formData.dueDate).toLocaleDateString()}
                        </p>
                    )}
                </div>

                {/* Priority */}
                <div>
                    <label className="block text-foreground text-sm font-medium mb-3">
                        Priority
                    </label>
                    <div className="flex space-x-3">
                        {priorities.map((p) => (
                            <button
                                key={p.value}
                                onClick={() => handleInputChange('priority', p.value)}
                                disabled={isLoading}
                                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                    formData.priority === p.value
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-input text-foreground hover:bg-accent'
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Status */}
                <div>
                    <label className="block text-foreground text-sm font-medium mb-3">
                        Status
                    </label>
                    <div className="flex space-x-3">
                        {statuses.map((s) => (
                            <button
                                key={s.value}
                                onClick={() => handleInputChange('status', s.value)}
                                disabled={isLoading}
                                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                    formData.status === s.value
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-input text-foreground hover:bg-accent'
                                }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskForm;