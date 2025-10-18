import { dashboardAPI, tasksAPI } from "../../services/api"
import { useState, useEffect } from "react"
import { useToast } from "../../context/ToastContext"

const Dashboard = () => {
    const { showError } = useToast();
    const [stats, setStats] = useState<{
        totalTasks: number;
        completedTasks: number;
        pendingTasks: number;
    }>({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0
    })
    const [isLoading, setIsLoading] = useState(true);
    const [priorityBreakdown, setPriorityBreakdown] = useState<{
        low: number;
        medium: number;
        high: number;
    }>({
        low: 0,
        medium: 0,
        high: 0
    });

    const getStats = async() => {
        try {
            setIsLoading(true);
            const response = await dashboardAPI.getStats()
            console.log(response)
            setStats(response.stats || { totalTasks: 0, completedTasks: 0, pendingTasks: 0 })
            
            // Fetch tasks for priority breakdown
            const tasksResponse = await tasksAPI.getAllTasks();
            const tasks = tasksResponse.tasks || [];
            
            // Calculate priority breakdown
            const breakdown = {
                low: tasks.filter(task => task.priority === 'low').length,
                medium: tasks.filter(task => task.priority === 'medium').length,
                high: tasks.filter(task => task.priority === 'high').length
            };
            setPriorityBreakdown(breakdown);
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
            showError('Failed to load dashboard statistics');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getStats()
    }, [])

    return (
        <div className="min-h-screen bg-background">
            {/* Header Section */}
            <div className="border-b border-border bg-card/50 backdrop-blur-sm">
                <div className="px-4 sm:px-6 py-6 sm:py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">Dashboard</h1>
                            <p className="text-sm text-muted-foreground mt-1">Monitor your task performance and progress</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-4 sm:py-6 md:py-8">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary/20 border-t-primary mx-auto mb-4"></div>
                            <p className="text-sm text-muted-foreground font-medium">Loading dashboard metrics...</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 sm:space-y-8">
                        {/* Main Metrics Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {/* Total Tasks */}
                            <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-border transition-all duration-200 group">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                                        <p className="text-3xl font-bold text-foreground">{stats.totalTasks}</p>
                                        <p className="text-xs text-muted-foreground">All time</p>
                                    </div>
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Completed Tasks */}
                            <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-border transition-all duration-200 group">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Completed</p>
                                        <p className="text-3xl font-bold text-green-400">{stats.completedTasks}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}% completion rate
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Pending Tasks */}
                            <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-border transition-all duration-200 group">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Pending</p>
                                        <p className="text-3xl font-bold text-orange-400">{stats.pendingTasks}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {stats.totalTasks > 0 ? Math.round((stats.pendingTasks / stats.totalTasks) * 100) : 0}% remaining
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                                        <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Priority Distribution - Very Subtle Section */}
                        <div className="bg-card border border-border/50 rounded-xl p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-base font-medium text-foreground">Priority Distribution</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">Task breakdown by priority level</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-3 sm:gap-6">
                                {/* Low Priority */}
                                <div className="text-center">
                                    <div className="text-2xl font-semibold text-foreground mb-1">{priorityBreakdown.low}</div>
                                    <div className="text-xs text-muted-foreground">Low Priority</div>
                                </div>
                                
                                {/* Medium Priority */}
                                <div className="text-center">
                                    <div className="text-2xl font-semibold text-foreground mb-1">{priorityBreakdown.medium}</div>
                                    <div className="text-xs text-muted-foreground">Medium Priority</div>
                                </div>
                                
                                {/* High Priority */}
                                <div className="text-center">
                                    <div className="text-2xl font-semibold text-foreground mb-1">{priorityBreakdown.high}</div>
                                    <div className="text-xs text-muted-foreground">High Priority</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard