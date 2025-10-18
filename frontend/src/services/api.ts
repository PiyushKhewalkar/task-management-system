// API Configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

// Types
interface ApiResponse<T = any> {
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  token?: string;
  data?: T;
  success?: boolean;
  tasks?: T[];
  task?: T;
  stats?: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
  };
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to make API requests
const apiRequest = async <T = any>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Add authorization header if token exists
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    ...options,
  };
  
  try {
    const response = await fetch(url, config);
    
    // Parse response
    let data: any;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // Handle non-2xx responses
    if (!response.ok) {
      // Handle validation errors with detailed field information
      if (data.errors && Array.isArray(data.errors)) {
        const errorMessages = data.errors.map((error: any) => error.message).join(', ');
        throw new Error(errorMessages || data.message || `HTTP error! status: ${response.status}`);
      }
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  // Register a new user
  register: async (userData: { name: string; email: string; password: string }): Promise<ApiResponse> => {
    const { name, email, password } = userData;
    return apiRequest<ApiResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  // Login user
  login: async (credentials: { email: string; password: string }): Promise<ApiResponse> => {
    const { email, password } = credentials;
    return apiRequest<ApiResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Verify token (optional - for checking if token is still valid)
  verifyToken: async (): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>('/api/auth/verify');
  },
};

// Tasks API functions
export const tasksAPI = {
  // Get all tasks for the authenticated user
  getAllTasks: async (): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>('/api/tasks');
  },

  // Get a specific task by ID
  getTask: async (taskId: string): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`/api/tasks/${taskId}`);
  },

  // Create a new task
  createTask: async (taskData: any): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  // Update an existing task
  updateTask: async (taskId: string, taskData: any): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  // Delete a task
  deleteTask: async (taskId: string): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },

  // Update task status
  updateTaskStatus: async (taskId: string, status: string): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`/api/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Update task priority
  updateTaskPriority: async (taskId: string, priority: string): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`/api/tasks/${taskId}/priority`, {
      method: 'PATCH',
      body: JSON.stringify({ priority }),
    });
  },
};

// User API functions
export const userAPI = {
  // Get current user profile
  getProfile: async (): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>('/api/user/profile');
  },

  // Update user profile
  updateProfile: async (userData: any): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Change password
  changePassword: async (passwordData: any): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>('/api/user/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },
};

// Dashboard API functions
export const dashboardAPI = {
  // Get dashboard statistics
  getStats: async (): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>('/api/tasks/stats');
  },

  // Get recent tasks
  getRecentTasks: async (limit: number = 5): Promise<ApiResponse> => {
    return apiRequest<ApiResponse>(`/api/dashboard/recent-tasks?limit=${limit}`);
  },
};

// Export default API object with all functions
export default {
  auth: authAPI,
  tasks: tasksAPI,
  user: userAPI,
  dashboard: dashboardAPI,
};
