import { Routes, Route, useLocation } from 'react-router-dom'
import Dashboard from "./components/Dashboard/Dashboard"
import TaskPage from "./pages/TaskPage"
import Navbar from "./components/Layout/Navbar"
import TaskForm from './components/Tasks/TaskForm'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import PrivateRoute from './components/Layout/PrivateRoute'
import { AuthProvider } from './context/authContext'
import { ToastProvider } from './context/ToastContext'
import { ToastContainer } from 'react-toastify'

const AppContent = () => {
  const location = useLocation()
  
  // Routes that should have full screen (no padding)
  const fullScreenRoutes = ['/tasks/new', '/login', '/signup']
  const isFullScreen = fullScreenRoutes.includes(location.pathname)
  
  // Routes that should show navbar (only authenticated routes)
  const authRoutes = ['/', '/dashboard', '/tasks', '/tasks/new']
  const showNavbar = authRoutes.includes(location.pathname)

  return (
    <div className={`dark bg-background min-h-[100vh] ${!isFullScreen ? 'px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 py-4 sm:py-6 md:py-8' : ''} ${showNavbar ? 'pb-20 sm:pb-24' : ''}`}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/tasks" element={
          <PrivateRoute>
            <TaskPage />
          </PrivateRoute>
        } />
        <Route path="/tasks/new" element={
          <PrivateRoute>
            <TaskForm 
              onCancel={() => window.history.back()} 
              onSuccess={() => window.location.href = '/tasks'} 
            />
          </PrivateRoute>
        } />
        <Route path="/tasks/edit/:id" element={
          <PrivateRoute>
            <TaskForm 
              onCancel={() => window.history.back()} 
              onSuccess={() => window.location.href = '/tasks'} 
            />
          </PrivateRoute>
        } />
      </Routes>
      {showNavbar && <Navbar />}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  )
}

export default App