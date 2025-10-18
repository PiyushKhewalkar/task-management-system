import TaskList from "../components/Tasks/TaskList"
import TaskFilters from "../components/Tasks/TaskFilters"
import { Link } from 'react-router-dom'

import { useState, useEffect } from "react"
import { tasksAPI } from "../services/api"

const TaskPage = () => {
    
    const [allTasks, setAllTasks] = useState<any[]>([])
    const [filteredTasks, setFilteredTasks] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const getAllTasks = async () => {
      try {
        setIsLoading(true);
        const response = await tasksAPI.getAllTasks();
        const tasks = response.tasks || [];
        setAllTasks(tasks);
        setFilteredTasks(tasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setAllTasks([]);
        setFilteredTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    const handleFilterChange = (filters: {
        search: string;
        priority: string;
        status: string;
    }) => {
        let filtered = [...allTasks];

        // Search filter
        if (filters.search) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                task.description.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        // Priority filter
        if (filters.priority) {
            filtered = filtered.filter(task => task.priority === filters.priority);
        }

        // Status filter
        if (filters.status) {
            filtered = filtered.filter(task => task.status === filters.status);
        }

        setFilteredTasks(filtered);
    };

    useEffect(() => {
        getAllTasks()
    }, [])


    if (isLoading) {
        return (
            <div className="space-y-4 sm:space-y-5">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground">Your Tasks</h1>
                        <p className="text-sm sm:text-base text-muted-foreground">View and manage your tasks</p>
                    </div>
                    <Link to="/tasks/new">
                        <button className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                            + New Task
                        </button>
                    </Link>
                </div>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading your tasks...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground">Your Tasks</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">View and manage your tasks</p>
                </div>
                <Link to="/tasks/new">
                    <button className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                        + New Task
                    </button>
                </Link>
            </div>
            <TaskFilters tasks={allTasks} onFilterChange={handleFilterChange} />
            <TaskList tasks={filteredTasks} onTasksChange={getAllTasks}/>
        </div>
    )
}

export default TaskPage