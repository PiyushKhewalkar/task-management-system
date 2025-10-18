# Task Management App

A full-stack task management application built with React (TypeScript) frontend and Node.js/Express backend with MongoDB database.

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Task Management**: Create, read, update, and delete tasks
- **Task Organization**: Priority levels (low, medium, high) and status tracking (todo, in-progress, completed)
- **Dashboard**: Overview of task statistics and progress
- **Responsive Design**: Mobile-first design with modern UI
- **Real-time Validation**: Client-side and server-side validation
- **Toast Notifications**: User feedback for all actions

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- React Router for navigation
- Tailwind CSS for styling
- React Toastify for notifications
- Context API for state management

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation
- CORS enabled for cross-origin requests

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/PiyushKhewalkar/task-management-system
cd task-management-app
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_URI=mongodb://localhost:27017/task-management-app
# For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/task-management-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Frontend API URL (optional - defaults to http://localhost:3001)
VITE_API_BASE_URL=http://localhost:3001
```

### Environment Variables Explained

- **PORT**: The port number for the backend server (default: 3001)
- **NODE_ENV**: Environment mode (development/production)
- **DB_URI**: MongoDB connection string
  - Local: `mongodb://localhost:27017/task-management-app`
  - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/task-management-app`
- **JWT_SECRET**: Secret key for JWT token signing (use a long, random string)
- **VITE_API_BASE_URL**: Frontend API base URL (optional)

## Running the Application

### 1. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For local MongoDB
mongod

# Or if using MongoDB as a service
sudo systemctl start mongod
```

### 2. Start the Backend Server
```bash
cd backend
npm start
```
The backend will be available at `http://localhost:3001`

### 3. Start the Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:5173`

### 4. Access the Application
Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks for authenticated user
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats` - Get task statistics

## Database Schema

### User Model
```javascript
{
  name: String (required, 2-50 characters),
  email: String (required, unique, valid email),
  password: String (required, hashed with bcrypt)
}
```

### Task Model
```javascript
{
  title: String (required, 1-100 characters),
  description: String (optional, max 500 characters),
  priority: String (low/medium/high),
  status: String (todo/in-progress/completed),
  dueDate: Date (optional),
  userId: ObjectId (reference to User)
}
```

## Assumptions Made

1. **Database**: MongoDB is available and accessible
2. **Authentication**: JWT tokens are used for session management
3. **Password Requirements**: 
   - Minimum 6 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
4. **Task Priorities**: Three levels (low, medium, high)
5. **Task Statuses**: Three states (todo, in-progress, completed)
6. **User Experience**: New users should see empty states, not error messages
7. **Responsive Design**: Mobile-first approach with desktop enhancements
8. **Error Handling**: Graceful error handling with user-friendly messages

## Bonus Features Implemented

### 1. Enhanced User Experience
- **Real-time Password Validation**: Live feedback as users type passwords
- **Click-outside-to-close Dialogs**: Better UX for modal interactions
- **Empty State Handling**: Proper handling of new users with no tasks
- **Toast Notifications**: Comprehensive feedback system

### 2. Advanced Validation
- **Client-side Validation**: Immediate feedback before API calls
- **Server-side Validation**: Comprehensive input validation with detailed error messages
- **Password Strength Indicator**: Visual feedback for password requirements

### 3. UI/UX Improvements
- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Responsive Layout**: Works seamlessly on mobile and desktop
- **Loading States**: Proper loading indicators throughout the app
- **Error Boundaries**: Graceful error handling and recovery

### 4. Security Features
- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Sanitization**: Protection against common vulnerabilities
- **CORS Configuration**: Proper cross-origin request handling

### 5. Developer Experience
- **TypeScript**: Full type safety in frontend
- **ESLint Configuration**: Code quality and consistency
- **Modular Architecture**: Well-organized component structure
- **API Documentation**: Clear endpoint documentation

## Project Structure

```
task-management-app/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validation.js
│   ├── models/
│   │   ├── task.js
│   │   └── user.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── Layout/
│   │   │   └── Tasks/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the DB_URI in your .env file
   - Verify network connectivity for Atlas

2. **JWT Secret Error**
   - Make sure JWT_SECRET is set in .env
   - Use a long, random string (at least 32 characters)

3. **Port Already in Use**
   - Change the PORT in .env file
   - Kill existing processes using the port

4. **CORS Issues**
   - Ensure frontend and backend are running on correct ports
   - Check VITE_API_BASE_URL configuration

### Development Tips

- Use `npm run dev` for frontend development with hot reload
- Backend automatically restarts on file changes with `npm start`
- Check browser console and terminal for error messages
- Use MongoDB Compass for database inspection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
