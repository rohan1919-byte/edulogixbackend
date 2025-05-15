# Student Activity Tracker

A full-stack MERN application for tracking student activities with authentication and admin features.

## Features

- Student authentication (login/signup)
- Activity management (create, read, update, delete)
- Admin dashboard to view all student activities
- JWT-based authentication
- Responsive design with Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Project Structure

```
student-activity-tracker/
├── backend/              # Backend server
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── server.js        # Entry point
└── frontend/            # React frontend
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/      # Page components
    │   ├── context/    # React context
    │   └── App.tsx     # Main component
    └── index.html      # HTML template
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/student-activity-tracker
   JWT_SECRET=your_jwt_secret_key_here
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin123
   ```

4. Start the servers:
   ```bash
   # Backend (from backend directory)
   npm start

   # Frontend (from frontend directory)
   npm run dev
   ```

5. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new student
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Activities
- GET /api/activity - Get all activities for logged-in student
- POST /api/activity - Create a new activity
- PUT /api/activity/:id - Update an activity
- DELETE /api/activity/:id - Delete an activity

### Admin
- GET /api/admin/activities - Get all student activities
- GET /api/admin/students - Get all students

## Technologies Used

- Backend:
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT for authentication
  - bcryptjs for password hashing

- Frontend:
  - React with TypeScript
  - React Router for routing
  - Axios for API calls
  - Tailwind CSS for styling

## License

MIT 