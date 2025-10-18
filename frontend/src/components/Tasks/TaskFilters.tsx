import { useState } from 'react';

interface Task {
    _id: string;
    title: string;
    status: string;
    priority: string;
    description: string;
    dueDate: string;
}

interface TaskFiltersProps {
    tasks: Task[];
    onFilterChange: (filters: {
        search: string;
        priority: string;
        status: string;
    }) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ tasks, onFilterChange }) => {
    const [search, setSearch] = useState('');
    const [showFilterModal, setShowFilterModal] = useState(false);
    
    // Filter state for the modal
    const [tempFilters, setTempFilters] = useState({
        priority: '',
        status: ''
    });
    
    // Current applied filters
    const [appliedFilters, setAppliedFilters] = useState({
        priority: '',
        status: ''
    });

    const priorities = [
        { value: '', label: 'All Priorities' },
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' }
    ];

    const statuses = [
        { value: '', label: 'All Statuses' },
        { value: 'todo', label: 'Todo' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' }
    ];

    const handleSearchChange = (value: string) => {
        setSearch(value);
        onFilterChange({ 
            search: value, 
            priority: appliedFilters.priority, 
            status: appliedFilters.status 
        });
    };

    const openFilterModal = () => {
        setTempFilters({ ...appliedFilters });
        setShowFilterModal(true);
    };

    const closeFilterModal = () => {
        setShowFilterModal(false);
    };

    const applyFilters = () => {
        setAppliedFilters({ ...tempFilters });
        onFilterChange({ 
            search, 
            priority: tempFilters.priority, 
            status: tempFilters.status 
        });
        setShowFilterModal(false);
    };

    const clearFilters = () => {
        setAppliedFilters({ priority: '', status: '' });
        setTempFilters({ priority: '', status: '' });
        onFilterChange({ search, priority: '', status: '' });
        setShowFilterModal(false);
    };

    const hasActiveFilters = appliedFilters.priority || appliedFilters.status;

    return (
        <div className="space-y-4">
            {/* Search Bar with Filter Icon */}
            <div className="flex items-center gap-3">
                <div className="flex-1 p-3 bg-card border border-border rounded-lg">
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full bg-transparent text-foreground placeholder-muted-foreground focus:outline-none" 
                        placeholder="Search tasks..." 
                    />
                </div>
                
                {/* Filter Button */}
                <button
                    onClick={openFilterModal}
                    className={`p-3 border rounded-lg transition-colors ${
                        hasActiveFilters 
                            ? 'bg-primary/20 border-primary text-primary' 
                            : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                </button>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {appliedFilters.priority && (
                        <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-md">
                            Priority: {priorities.find(p => p.value === appliedFilters.priority)?.label}
                        </span>
                    )}
                    {appliedFilters.status && (
                        <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-md">
                            Status: {statuses.find(s => s.value === appliedFilters.status)?.label}
                        </span>
                    )}
                </div>
            )}

            {/* Filter Modal */}
            {showFilterModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-card-foreground">Filter Tasks</h3>
                            <button
                                onClick={closeFilterModal}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Priority Filter */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Priority
                                </label>
                                <select
                                    value={tempFilters.priority}
                                    onChange={(e) => setTempFilters({ ...tempFilters, priority: e.target.value })}
                                    className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                                >
                                    {priorities.map((p) => (
                                        <option key={p.value} value={p.value}>
                                            {p.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Status
                                </label>
                                <select
                                    value={tempFilters.status}
                                    onChange={(e) => setTempFilters({ ...tempFilters, status: e.target.value })}
                                    className="w-full bg-input border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:border-primary"
                                >
                                    {statuses.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Clear All
                            </button>
                            <div className="flex gap-3">
                                <button
                                    onClick={closeFilterModal}
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={applyFilters}
                                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TaskFilters