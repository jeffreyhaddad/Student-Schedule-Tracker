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

### Quick Setup (from project root)

From the project root directory, run:

```bash
chmod +x setup.sh
./setup.sh
```

This handles dependencies and environment configuration automatically.

### Manual Setup

**1. Install Dependencies**

```bash
npm install
```

**2. Configure Backend Connection**

```bash
cp example.env .env.local
```

By default, the app connects to `http://localhost:3000`. Edit `VITE_API_URL` in `.env.local` if needed.

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
- **View Tasks**: See all tasks in a list with status, priority, and due date indicators
- **Inline Editing**: Click on task title or description to edit directly without opening a form
- **Quick Status Change**: Click the status badge to cycle through pending → in-progress → completed
- **Quick Priority Change**: Click the priority badge to cycle through low → normal → high
- **Update Tasks**: Edit any task field with real-time error handling
- **Delete Tasks**: Remove completed or unwanted tasks with confirmation
- **Filter & Sort**: Organize tasks by priority, status, and due date
- **Task Status Tracking**: Visual indicators for pending, in-progress, and completed tasks
- **Error Display**: Validation errors show inline in red alert boxes

### Schedule Management
- **Create Schedule**: Add time-based schedule entries with subject, location, start time, and end time
- **View Schedule**: See all schedule entries organized by day of the week
- **Inline Editing**: Click on subject, location, notes, or times to edit directly
- **Time Editing**: Click start/end times to modify with automatic HH:MM format validation
- **Update Schedule**: Edit any schedule field with real-time validation
- **Delete Schedule**: Remove schedule entries with confirmation
- **Quick Duplication**: Click duplicate button to open day selector and copy a class to any day of the week
- **Time Conflict Prevention**: Backend validates to prevent overlapping classes
- **Weekly View**: Visual representation of all classes throughout the week

### User Interface
- **Responsive design** that works seamlessly on desktop, tablet, and mobile
- **Modern gradient styling** with purple to blue gradients (#667eea to #764ba2)
- **Smooth animations** with 0.3s ease transitions
- **Interactive elements**: Hover effects on cards, buttons, and badges
- **Bootstrap 5** for consistent, professional styling
- **Inline error display**: Validation errors shown in red alert boxes
- **Intuitive navigation** with clear visual hierarchy
- **Loading states** for async operations
- **Click-to-edit paradigm**: Edit any field by simply clicking on it
- **Badge cycling**: Click badges to quickly cycle through values

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
- Statistics overview with task counts (pending, in-progress, completed)
- Search and filter tasks by title and category
- Quick links to tasks and schedule pages
- User profile information with logout
- Modern design with gradient backgrounds

### TasksPage (`pages/TasksPage.tsx`)
- Complete task management interface
- **Inline editing**: Click task title or description to edit
- **Status badges**: Click to cycle through pending → in-progress → completed
- **Priority badges**: Click to cycle through low → normal → high
- Create new tasks with form
- Delete tasks with confirmation
- Real-time error display in red alert boxes
- Task list showing all details at a glance

### SchedulePage (`pages/SchedulePage.tsx`)
- Schedule entry management organized by day
- **Inline editing**: Click subject, location, or notes to edit
- **Time editing**: Click start/end times to modify (HH:MM format)
- **Day selector popup**: Quick duplication with day selection
- Create new schedule entries with form
- Delete schedule entries with confirmation
- Time conflict validation with error display
- Visual weekly calendar view

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

The application uses a modern design system:
- **Bootstrap 5**: For responsive grid and components
- **Custom CSS**: Page and component-specific styling with consistent patterns
- **Gradient Design**: Purple to blue gradients (#667eea → #764ba2)
- **Animations**: Smooth 0.3s ease transitions for all interactive elements
- **Hover Effects**: Interactive feedback on cards, buttons, and badges

### Key CSS Files
- `index.css` - Global styles and theme variables
- `App.css` - App-level styles
- `pages/TasksPage.css` - Task management styling with inline edit and badge styles
- `pages/SchedulePage.css` - Schedule styling with day selector popup and time inputs
- `pages/Dashboard.css` - Dashboard statistics and search styles
- `pages/AuthPages.css` - Login and registration form styling

### Design Patterns
- **Editable fields**: Hover shows background color change, click to edit
- **Status/Priority badges**: Cursor changes to pointer, scale and shadow on hover
- **Input fields**: White background with blue border on focus
- **Day selector**: Grid layout with disabled current day and gradient highlight
- **Error display**: Red background alert boxes with clear messaging

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

The application implements comprehensive error handling:
- **Inline error display**: Validation errors shown in red alert boxes instead of popups
- **API validation errors**: Backend validation messages displayed directly to users
- **Form validation**: Required fields and format validation with clear error messages
- **Time format validation**: Automatic HH:MM format enforcement for schedule times
- **Time conflict detection**: Backend validation prevents overlapping schedules
- **Invalid credentials**: Clear error messages during login
- **Network errors**: Graceful handling of connection issues
- **Session timeouts**: User redirected to login if token expires
- **Invalid token**: Automatic logout and redirect to login page

All errors provide helpful context to guide user actions.

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
Changes are automatically reflected in the browser without full page reload during `npm run dev`.

### TypeScript
The project uses TypeScript for type safety. Check types with:
```bash
npm run build  # Type checking happens during build
```

### Inline Editing Pattern
When implementing inline editing:
1. Use state variables: `editingId`, `editingField`, `editValues`
2. Implement handlers: `startInlineEdit()`, `saveInlineEdit()`, `cancelInlineEdit()`
3. Style with `.editable-field` class for hover effects
4. Use conditional rendering to show input or span based on editing state

### Badge Cycling Pattern
For interactive badges (status, priority):
1. Define value cycles (e.g., low → normal → high)
2. Create handler function that cycles to next value
3. Use `event.stopPropagation()` to prevent parent clicks
4. Style with `.status-badge` or `.priority-badge` class
5. Add cursor: pointer and hover effects

### Popup Selector Pattern
For complex selections (like day selector):
1. Use state to track which entry has popup open
2. Render popup only when appropriate entry is selected
3. Include Cancel button or click-outside handler
4. Use grid layout for button options
5. Disable current selection or invalid options

### Console Debugging
Use the browser's developer tools to debug:
- Network tab to inspect API calls and responses
- Console for errors and logging
- React DevTools extension for component inspection
- Check request/response formats match API expectations

### Common Development Tasks

**Add a new page:**
1. Create new file in `src/pages/`
2. Add route in `App.tsx`
3. Create corresponding `.css` file
4. Import and use hooks as needed

**Add a new component:**
1. Create file in `src/components/`
2. Export from `App.tsx` or page component
3. Add styling as needed
4. Follow inline editing pattern if editing is needed

**Add inline editing to an existing field:**
1. Add to `editingId` tracking
2. Add to `editValues` state object
3. Implement save/cancel handlers
4. Replace field span with conditional input/span rendering
5. Add `.editable-field` styling

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
- Verify API endpoints match backend routes (should be `/task`, `/schedule`, etc.)
- Check network tab in DevTools to see actual requests

### Login Issues
- Clear browser cache and localStorage: `localStorage.clear()`
- Check credentials with backend
- Verify JWT token is being stored in localStorage under `token` key
- Check browser console for auth errors

### Edit/Save Not Working
- Ensure `editingId` state is properly tracking which field is being edited
- Check that API response status is 200/201 before clearing editing state
- Verify error is displayed if API returns non-2xx status
- Check backend logs for validation errors

### Time Format Errors
- Ensure times are in HH:MM format (e.g., 09:30, 14:00)
- Backend only accepts HH:MM, not ISO or other formats
- Check backend error message for exact format requirements

### Day Selector Not Opening
- Verify `copyingEntryId` state is being set on duplicate click
- Check that event.stopPropagation() prevents form opening
- Ensure day selector popup CSS is loaded

### Page Refresh Loses State
- State is intentionally cleared on refresh - this is expected behavior
- Use browser back button to return to previous state
- Avoid refreshing during edit operations

### Styling Issues
- Check Bootstrap is loaded in `index.html`
- Verify CSS file paths are correct
- Use browser DevTools to inspect styles
- Check for CSS specificity conflicts
- Verify gradient colors are applied: #667eea to #764ba2

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
