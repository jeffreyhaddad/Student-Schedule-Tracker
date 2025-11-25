# Student Tracker Frontend

A modern React application for managing student tasks and schedules. Built with TypeScript, Vite, and React Router for a fast and responsive user experience.

## Overview

This is the frontend client for the Student Tracker application. It provides an intuitive interface for students to manage their academic workload, organize tasks, and view their schedules with a clean, Bootstrap-styled UI.

## Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Routing**: React Router DOM 7
- **Styling**: CSS + Bootstrap 5
- **HTTP Client**: Fetch API
- **Development**: ESLint + TypeScript

## Prerequisites

- Node.js 16+ 
- npm 8+
- The backend API running on `http://localhost:3000`

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Backend Connection

By default, the application expects the backend API at `http://localhost:3000`. If your backend is running on a different URL, update the API base URL in `src/services/`:

- `src/services/authService.ts`
- `src/services/tasksService.ts`
- `src/services/scheduleService.ts`

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will start at `http://localhost:5173` with hot module replacement (HMR) enabled.

### Build for Production
```bash
npm run build
```

Generates an optimized production build in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

Preview the production build locally.

## Available Scripts

```bash
# Development
npm run dev          # Start development server with HMR

# Build & Deploy
npm run build        # Compile TypeScript and build with Vite
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint to check code quality
```

## Project Structure

```
src/
├── components/                  # Reusable React components
│   ├── (component files)
│   └── (component styles)
│
├── pages/                       # Page components
│   ├── LoginPage.tsx           # User login page
│   ├── RegisterPage.tsx        # User registration
│   ├── Dashboard.tsx           # Main dashboard view
│   ├── TasksPage.tsx           # Tasks management page
│   ├── SchedulePage.tsx        # Schedule management page
│   ├── LoginPage.css
│   ├── Dashboard.css
│   ├── TasksPage.css
│   ├── SchedulePage.css
│   └── AuthPages.css
│
├── hooks/                       # Custom React hooks
│   ├── useAuth.ts              # Authentication hook
│   ├── useTasks.ts             # Tasks management hook
│   └── useSchedule.ts          # Schedule management hook
│
├── services/                    # API service modules
│   ├── authService.ts          # Auth API calls
│   ├── tasksService.ts         # Tasks API calls
│   └── scheduleService.ts      # Schedule API calls
│
├── App.tsx                      # Root application component
├── App.css                      # Global app styles
├── main.tsx                     # React entry point
├── index.css                    # Global styles
└── vite-env.d.ts               # Vite type definitions
```

## Features

### Authentication
- **Login Page**: Existing users can log in with email and password
- **Registration Page**: New users can create accounts
- **Session Management**: Automatic token storage and validation
- **Protected Routes**: Unauthorized users are redirected to login

### Dashboard
- Overview of all tasks and schedule entries
- Quick statistics
- User profile information
- Logout functionality

### Task Management
- **Create Tasks**: Add new tasks with title, description, priority, and due date
- **View Tasks**: See all tasks in a list or grid format
- **Update Tasks**: Edit task details and status
- **Delete Tasks**: Remove completed or unwanted tasks
- **Filter & Sort**: Organize tasks by priority, status, and due date
- **Task Status**: Track pending, in-progress, and completed tasks

### Schedule Management
- **Create Schedule**: Add time-based schedule entries
- **View Schedule**: See all schedule entries
- **Update Schedule**: Modify schedule details
- **Delete Schedule**: Remove schedule entries
- **Calendar View**: Visual representation of schedules

### User Interface
- Responsive design that works on desktop and mobile
- Bootstrap 5 for consistent styling
- Dark/Light mode support (if enabled)
- Intuitive navigation
- Loading states and error handling

## Key Components & Pages

### LoginPage (`pages/LoginPage.tsx`)
- User email and password input
- Form validation
- Login error messages
- Link to registration page

### RegisterPage (`pages/RegisterPage.tsx`)
- New user registration form
- Password confirmation
- Email validation
- Link to login page

### Dashboard (`pages/Dashboard.tsx`)
- User welcome message
- Summary of tasks and schedules
- Quick action buttons
- Profile management

### TasksPage (`pages/TasksPage.tsx`)
- Complete task management interface
- Create, edit, delete tasks
- Task list with filters
- Priority and status indicators

### SchedulePage (`pages/SchedulePage.tsx`)
- Schedule entry management
- Calendar or timeline view
- Create and edit schedules
- Time slot management

## Custom Hooks

### useAuth
Manages authentication state and operations:
```typescript
const { user, isAuthenticated, login, logout, register } = useAuth();
```

### useTasks
Manages task operations:
```typescript
const { tasks, createTask, updateTask, deleteTask, loading } = useTasks();
```

### useSchedule
Manages schedule operations:
```typescript
const { schedules, createSchedule, updateSchedule, deleteSchedule, loading } = useSchedule();
```

## API Services

### authService
```typescript
// Login user
await authService.login(email, password);

// Register new user
await authService.register(userData);

// Logout
authService.logout();
```

### tasksService
```typescript
// Get all tasks
await tasksService.getTasks();

// Create task
await tasksService.createTask(taskData);

// Update task
await tasksService.updateTask(taskId, taskData);

// Delete task
await tasksService.deleteTask(taskId);
```

### scheduleService
```typescript
// Get all schedules
await scheduleService.getSchedules();

// Create schedule
await scheduleService.createSchedule(scheduleData);

// Update schedule
await scheduleService.updateSchedule(scheduleId, scheduleData);

// Delete schedule
await scheduleService.deleteSchedule(scheduleId);
```

## Styling

The application uses a combination of:
- **Bootstrap 5**: For responsive grid and components
- **Custom CSS**: Page and component-specific styling
- **CSS Modules**: Scoped styling (if implemented)

### Key CSS Files
- `index.css` - Global styles
- `App.css` - App-level styles
- `pages/*.css` - Page-specific styles

## Authentication Flow

1. User arrives at login page
2. Enters credentials and submits
3. Frontend calls `authService.login()`
4. Backend validates and returns JWT token
5. Token stored in localStorage
6. User redirected to dashboard
7. Protected routes verify token on every navigation
8. Token included in all API requests

## Error Handling

The application handles various error scenarios:
- Invalid credentials during login
- Network errors
- API validation errors
- Session timeouts
- Invalid token expiration

Error messages are displayed to users with appropriate context.

## Environment Variables

If needed, create a `.env.local` file:

```env
# API Configuration
VITE_API_URL=http://localhost:3000

# Application Settings
VITE_APP_NAME=Student Tracker
```

Update your service files to use these variables:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

## Development Tips

### Hot Module Replacement (HMR)
Changes are automatically reflected in the browser without full page reload.

### TypeScript
The project uses TypeScript for type safety. Check types with:
```bash
npm run build  # Type checking happens during build
```

### Console Debugging
Use the browser's developer tools to debug:
- Network tab to inspect API calls
- Console for errors and logging
- React DevTools extension for component inspection

### Common Development Tasks

**Add a new page:**
1. Create new file in `src/pages/`
2. Add route in `App.tsx`
3. Create corresponding styles

**Add a new component:**
1. Create file in `src/components/`
2. Export from `App.tsx` or another component
3. Add styling as needed

## Production Build

The production build optimizes:
- Code minification
- Tree-shaking
- Asset optimization
- Source map generation (optional)

### Deploy to Hosting

1. Run `npm run build`
2. Upload `dist/` folder to your hosting service
3. Configure server to serve `index.html` for SPA routing
4. Ensure backend API URL is correctly configured

## Deployment Platforms

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### GitHub Pages
Configure `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/student-tracker/',
  // ... other config
})
```

## Performance Optimization

- **React Compiler**: Enabled for optimized re-renders
- **Lazy Loading**: Routes can be code-split
- **Image Optimization**: Optimize images in `public/`
- **Bundle Analysis**: Run `npm run build` to see bundle size

## Troubleshooting

### Backend Connection Error
- Ensure backend is running on `http://localhost:3000`
- Check browser console for CORS errors
- Verify API endpoints match backend routes

### Login Issues
- Clear browser cache and localStorage
- Check credentials with backend
- Verify JWT token is being stored

### Page Refresh Loses State
- Implement persistent storage with localStorage
- Use session context for global state

### Styling Issues
- Check Bootstrap is loaded
- Verify CSS file paths
- Use browser DevTools to inspect styles

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile

## Code Quality

### Linting
```bash
npm run lint
```

Fix issues:
```bash
npm run lint -- --fix
```

### Best Practices
- Use TypeScript for type safety
- Follow React hooks guidelines
- Keep components small and focused
- Use meaningful component names
- Document complex logic

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint` to check code quality
4. Test functionality thoroughly
5. Submit a pull request

## License

UNLICENSED

## Support

For issues with the backend API, see the `../api/README.md`

---

**Built with React | Powered by Vite | Styled with Bootstrap** ⚡
