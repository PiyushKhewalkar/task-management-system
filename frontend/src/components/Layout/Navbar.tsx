import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import { useToast } from '../../context/ToastContext';

const Navbar = () => {
    const location = useLocation();
    const [activeScreen, setActiveScreen] = useState('dashboard');
    const { logout } = useAuth();
    const { showSuccess } = useToast();

    useEffect(() => {
        const path = location.pathname;
        if (path === '/dashboard' || path === '/') {
            setActiveScreen('dashboard');
        } else if (path === '/tasks') {
            setActiveScreen('tasks');
        } else if (path === '/tasks/new') {
            setActiveScreen('new-task');
        }
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        showSuccess('You have been successfully logged out.');
    };

    return (
        <div className="fixed -bottom-1 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-sm md:flex md:justify-center">
            <div className="flex justify-between items-center py-3 px-4 sm:py-4 sm:px-6">
                <div className="flex justify-between space-x-3 sm:space-x-4 md:space-x-10 w-full max-w-sm sm:max-w-md">
                    
                    <Link to="/dashboard" className="no-underline">
                        <div 
                            className={`flex flex-col items-center space-y-2 cursor-pointer transition-all duration-200 ${
                                activeScreen === "dashboard" 
                                    ? "opacity-100" 
                                    : "opacity-60 hover:opacity-80"
                            }`}
                            onClick={() => setActiveScreen("dashboard")}
                        >
                            <div className={`rounded-full h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center transition-all duration-200 ${
                                activeScreen === "dashboard" 
                                    ? "bg-primary border-2 border-primary-foreground/20" 
                                    : "bg-muted hover:bg-accent"
                            }`}>
                                <svg className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors duration-200 ${
                                    activeScreen === "dashboard" 
                                        ? "text-primary-foreground" 
                                        : "text-muted-foreground"
                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <p className={`text-xs font-medium text-center transition-colors duration-200 ${
                                activeScreen === "dashboard" 
                                    ? "text-accent-foreground font-semibold" 
                                    : "text-muted-foreground"
                            }`}>Dashboard</p>
                        </div>
                    </Link>

                    <Link to="/tasks/new" className="no-underline">
                        <div className="flex flex-col items-center space-y-1 sm:space-y-2 cursor-pointer hover:scale-110 transition-all duration-200">
                            <div className="rounded-full bg-primary h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center shadow-lg hover:shadow-xl">
                                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <p className="text-xs text-foreground font-semibold text-center">New Task</p>
                        </div>
                    </Link>

                    <Link to="/tasks" className="no-underline">
                        <div 
                            className={`flex flex-col items-center space-y-2 cursor-pointer transition-all duration-200 ${
                                activeScreen === "tasks" 
                                    ? "opacity-100" 
                                    : "opacity-60 hover:opacity-80"
                            }`}
                            onClick={() => setActiveScreen("tasks")}
                        >
                            <div className={`rounded-full h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center transition-all duration-200 ${
                                activeScreen === "tasks" 
                                    ? "bg-primary border-2 border-primary-foreground/20" 
                                    : "bg-muted hover:bg-accent"
                            }`}>
                                <svg className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors duration-200 ${
                                    activeScreen === "tasks" 
                                        ? "text-primary-foreground" 
                                        : "text-muted-foreground"
                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <p className={`text-xs font-medium text-center transition-colors duration-200 ${
                                activeScreen === "tasks" 
                                    ? "text-accent-foreground font-semibold" 
                                    : "text-muted-foreground"
                            }`}>My Tasks</p>
                        </div>
                    </Link>

                    <button onClick={handleLogout} className="no-underline">
                        <div className="flex flex-col items-center space-y-1 sm:space-y-2 cursor-pointer transition-all duration-200 opacity-60 hover:opacity-80">
                            <div className="rounded-full h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center transition-all duration-200 bg-muted hover:bg-accent">
                                <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors duration-200 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </div>
                            <p className="text-xs font-medium text-center transition-colors duration-200 text-muted-foreground">Logout</p>
                        </div>
                    </button>

                </div>
            </div>
        </div>
    );
};

export default Navbar