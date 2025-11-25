# Frontend Components Documentation

Comprehensive guide to all React components in the Student Tracker frontend application.

## Table of Contents

1. [Component Architecture](#component-architecture)
2. [Page Components](#page-components)
3. [Custom Hooks](#custom-hooks)
4. [API Services](#api-services)
5. [Component Patterns](#component-patterns)
6. [State Management](#state-management)

## Component Architecture

The frontend is organized into a modular, feature-based structure:

```
src/
├── components/          # Reusable presentational components
├── pages/              # Page-level container components
├── hooks/              # Custom React hooks for logic
├── services/           # API communication layer
├── App.tsx             # Root component with routing
└── main.tsx            # React DOM entry point
```

### Design Principles

- **Single Responsibility**: Each component has one primary purpose
- **Props Over State**: Prefer passing data through props
- **Custom Hooks**: Extract reusable logic into hooks
- **Service Layer**: Separate API calls from components
- **Protected Routes**: Authentication-based route protection

---

## Page Components

### 1. LoginPage

**Location**: `src/pages/LoginPage.tsx`

**Purpose**: Handles user authentication with email and password.

**Features**:
- Email input validation
- Password input field
- Login error handling
- Link to registration page
- Loading state during submission

**Props**: None (standalone page)

**State**:
```typescript
- email: string
- password: string
- error: string | null
- loading: boolean
```

**Example Usage**:
```tsx
<Route path="/login" element={<LoginPage />} />
```

**Key Functions**:
- `handleLogin()`: Submits credentials to auth service
- `handleInputChange()`: Updates form state
- `handleKeyPress()`: Allows Enter key submission

**Styling**: `LoginPage.css`

---

### 2. RegisterPage

**Location**: `src/pages/RegisterPage.tsx`

**Purpose**: Allows new users to create accounts.

**Features**:
- First name input
- Last name input
- Username field
- Email input with validation
- Password field
- Password confirmation
- Form validation
- Success/error messaging
- Link to login page

**Props**: None (standalone page)

**State**:
```typescript
- firstName: string
- lastName: string
- username: string
- email: string
- password: string
- confirmPassword: string
- error: string | null
- success: boolean
- loading: boolean
```

**Validation Rules**:
- Email must be valid format
- Password must be at least 8 characters
- Passwords must match
- All fields required

**Example Usage**:
```tsx
<Route path="/register" element={<RegisterPage />} />
```

**Key Functions**:
- `handleRegister()`: Creates new user account
- `validateForm()`: Client-side validation
- `handleInputChange()`: Updates form state

**Styling**: `AuthPages.css`

---

### 3. Dashboard

**Location**: `src/pages/Dashboard.tsx`

**Purpose**: Main landing page showing overview of tasks and schedules.

**Features**:
- User profile display
- Task summary widget
- Schedule overview
- Quick action buttons
- Welcome message
- User statistics
- Navigation menu
- Logout button

**Props**: None (uses Auth context)

**State**:
```typescript
- tasks: Task[]
- schedules: ScheduleEntry[]
- loading: boolean
- stats: {
    totalTasks: number
    completedTasks: number
    upcomingTasks: number
  }
```

**Example Usage**:
```tsx
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

**Displays**:
- Total tasks count
- Completed vs pending tasks
- Upcoming due dates
- Today's schedule
- Quick links to create tasks/schedules

**Styling**: `Dashboard.css`

---

### 4. TasksPage

**Location**: `src/pages/TasksPage.tsx`

**Purpose**: Full task management interface.

**Features**:
- List/grid view toggle
- Create new task form
- Edit existing tasks
- Delete tasks
- Filter by status (pending, in-progress, completed)
- Filter by priority (low, normal, high)
- Sort by due date
- Task cards with details
- Status indicator badges

**Props**: None (uses custom hooks)

**State** (via `useTasks` hook):
```typescript
- tasks: Task[]
- loading: boolean
- selectedTask: Task | null
- filters: {
    status: string | null
    priority: string | null
  }
- sortBy: 'dueDate' | 'priority' | 'created'
```

**Key Components**:
- **TaskForm**: Modal/inline form for creating/editing
- **TaskCard**: Displays individual task info
- **TaskFilters**: Filter controls
- **TaskList**: Task list container

**Task Object Structure**:
```typescript
interface Task {
  id: number
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'normal' | 'high'
  category: string
  due_at: string (ISO date)
  created_at: string (ISO date)
  updated_at: string (ISO date)
}
```

**Example Usage**:
```tsx
<ProtectedRoute>
  <TasksPage />
</ProtectedRoute>
```

**Key Functions**:
- `handleCreateTask(taskData)`: Creates new task
- `handleUpdateTask(id, taskData)`: Updates existing task
- `handleDeleteTask(id)`: Removes task
- `applyFilters()`: Filters task list
- `sortTasks()`: Sorts by selected field

**Styling**: `TasksPage.css`

---

### 5. SchedulePage

**Location**: `src/pages/SchedulePage.tsx`

**Purpose**: Schedule entry management and calendar view.

**Features**:
- Calendar view
- Timeline view option
- Create schedule entries
- Edit schedule entries
- Delete schedule entries
- View schedule details
- Time slot display
- Date navigation

**Props**: None (uses custom hooks)

**State** (via `useSchedule` hook):
```typescript
- schedules: ScheduleEntry[]
- loading: boolean
- selectedSchedule: ScheduleEntry | null
- view: 'calendar' | 'timeline'
- selectedDate: Date
```

**Schedule Object Structure**:
```typescript
interface ScheduleEntry {
  id: number
  title: string
  description: string
  start_time: string (ISO datetime)
  end_time: string (ISO datetime)
  created_at: string (ISO date)
  updated_at: string (ISO date)
}
```

**Key Components**:
- **CalendarView**: Visual calendar display
- **TimelineView**: Linear time representation
- **ScheduleForm**: Create/edit schedule entries
- **ScheduleCard**: Individual schedule display

**Example Usage**:
```tsx
<ProtectedRoute>
  <SchedulePage />
</ProtectedRoute>
```

**Key Functions**:
- `handleCreateSchedule(data)`: Creates schedule entry
- `handleUpdateSchedule(id, data)`: Updates entry
- `handleDeleteSchedule(id)`: Removes entry
- `handleDateChange(date)`: Updates selected date
- `handleViewChange()`: Toggles calendar/timeline

**Styling**: `SchedulePage.css`

---

## Custom Hooks

### 1. useAuth

**Location**: `src/hooks/useAuth.ts`

**Purpose**: Manages authentication state and operations.

**Returns**:
```typescript
{
  user: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
  } | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: RegistrationData) => Promise<void>
  token: string | null
}
```

**Example Usage**:
```tsx
function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={() => login(email, password)}>Login</button>
      )}
    </div>
  );
}
```

**Implementation Details**:
- Stores token in localStorage
- Validates token on mount
- Provides global auth context
- Handles token refresh logic
- Manages user session

---

### 2. useTasks

**Location**: `src/hooks/useTasks.ts`

**Purpose**: Manages task data and operations.

**Returns**:
```typescript
{
  tasks: Task[]
  loading: boolean
  error: string | null
  createTask: (taskData: CreateTaskDTO) => Promise<Task>
  updateTask: (id: number, taskData: UpdateTaskDTO) => Promise<Task>
  deleteTask: (id: number) => Promise<void>
  fetchTasks: () => Promise<void>
  getTaskById: (id: number) => Task | undefined
  getTasksByStatus: (status: string) => Task[]
  getTasksByPriority: (priority: string) => Task[]
}
```

**Example Usage**:
```tsx
function TaskManager() {
  const { tasks, createTask, updateTask, deleteTask, loading } = useTasks();

  return (
    <div>
      {loading && <p>Loading...</p>}
      {tasks.map(task => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <button onClick={() => updateTask(task.id, { status: 'completed' })}>
            Mark Done
          </button>
          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

**Implementation Details**:
- Fetches tasks on component mount
- Caches task data in state
- Handles loading and error states
- Provides CRUD operations
- Real-time list updates

---

### 3. useSchedule

**Location**: `src/hooks/useSchedule.ts`

**Purpose**: Manages schedule entries and calendar operations.

**Returns**:
```typescript
{
  schedules: ScheduleEntry[]
  loading: boolean
  error: string | null
  createSchedule: (data: CreateScheduleDTO) => Promise<ScheduleEntry>
  updateSchedule: (id: number, data: UpdateScheduleDTO) => Promise<ScheduleEntry>
  deleteSchedule: (id: number) => Promise<void>
  fetchSchedules: () => Promise<void>
  getSchedulesByDate: (date: Date) => ScheduleEntry[]
  getUpcomingSchedules: (days?: number) => ScheduleEntry[]
}
```

**Example Usage**:
```tsx
function CalendarComponent() {
  const { schedules, createSchedule, getSchedulesByDate } = useSchedule();

  const todaySchedules = getSchedulesByDate(new Date());

  return (
    <div>
      {todaySchedules.map(schedule => (
        <div key={schedule.id}>
          <h4>{schedule.title}</h4>
          <p>{schedule.start_time} - {schedule.end_time}</p>
        </div>
      ))}
    </div>
  );
}
```

**Implementation Details**:
- Manages schedule state globally
- Provides date-based filtering
- Handles calendar operations
- Supports timeline views
- Manages time calculations

---

## API Services

### 1. authService

**Location**: `src/services/authService.ts`

**Base URL**: `http://localhost:3000`

**Methods**:

#### `login(email: string, password: string)`
```typescript
// Request
POST /auth/login
{ email, password }

// Response
{
  access_token: string
  user: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
  }
}
```

**Error Handling**:
- Invalid credentials → 401 Unauthorized
- Missing fields → 400 Bad Request
- Server error → 500 Internal Server Error

---

#### `register(userData: RegistrationData)`
```typescript
// Request
POST /auth/register
{
  first_name: string
  last_name: string
  username: string
  email: string
  password: string
}

// Response
{
  access_token: string
  user: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
  }
}
```

**Validation**:
- Email format validation
- Password strength requirements
- Unique username and email

---

#### `logout()`
- Clears localStorage
- Resets auth state
- No API call needed

---

### 2. tasksService

**Location**: `src/services/tasksService.ts`

**Base URL**: `http://localhost:3000`

**Methods**:

#### `getTasks()`
```typescript
// Request
GET /task
Authorization: Bearer {token}

// Response
Task[]
```

---

#### `getTaskById(id: number)`
```typescript
// Request
GET /task/:id
Authorization: Bearer {token}

// Response
Task
```

---

#### `createTask(taskData: CreateTaskDTO)`
```typescript
// Request
POST /task
Authorization: Bearer {token}
{
  title: string
  description?: string
  due_at?: string (ISO date)
  priority: 'low' | 'normal' | 'high'
  category?: string
}

// Response
Task
```

---

#### `updateTask(id: number, taskData: UpdateTaskDTO)`
```typescript
// Request
PUT /task/:id
Authorization: Bearer {token}
{
  title?: string
  description?: string
  status?: 'pending' | 'in-progress' | 'completed'
  priority?: 'low' | 'normal' | 'high'
  due_at?: string
}

// Response
Task
```

---

#### `deleteTask(id: number)`
```typescript
// Request
DELETE /task/:id
Authorization: Bearer {token}

// Response
204 No Content
```

---

### 3. scheduleService

**Location**: `src/services/scheduleService.ts`

**Base URL**: `http://localhost:3000`

**Methods**:

#### `getSchedules()`
```typescript
// Request
GET /schedule
Authorization: Bearer {token}

// Response
ScheduleEntry[]
```

---

#### `createSchedule(data: CreateScheduleDTO)`
```typescript
// Request
POST /schedule
Authorization: Bearer {token}
{
  title: string
  description?: string
  start_time: string (ISO datetime)
  end_time: string (ISO datetime)
}

// Response
ScheduleEntry
```

---

#### `updateSchedule(id: number, data: UpdateScheduleDTO)`
```typescript
// Request
PUT /schedule/:id
Authorization: Bearer {token}
{
  title?: string
  description?: string
  start_time?: string
  end_time?: string
}

// Response
ScheduleEntry
```

---

#### `deleteSchedule(id: number)`
```typescript
// Request
DELETE /schedule/:id
Authorization: Bearer {token}

// Response
204 No Content
```

---

## Component Patterns

### Protected Routes

**Pattern**: Wrapper component that checks authentication status.

```tsx
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Usage
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

---

### Layout Wrapper

**Pattern**: Shared layout for authenticated pages.

```tsx
function Layout({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <header className="navbar">
        <nav>{/* Navigation links */}</nav>
        <div className="user-menu">
          <span>{user?.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main className="content">
        {children}
      </main>
    </div>
  );
}
```

---

### Form Handling

**Pattern**: Controlled components with validation.

```tsx
function TaskForm({ onSubmit, initialValues = {} }) {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (formData.due_at && new Date(formData.due_at) < new Date()) {
      newErrors.due_at = 'Due date cannot be in the past';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      {errors.title && <span className="error">{errors.title}</span>}
    </form>
  );
}
```

---

### Error Boundaries

**Pattern**: Graceful error handling with fallback UI.

```tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <TasksPage />
</ErrorBoundary>
```

---

## State Management

### Authentication State

Managed via `useAuth` hook with context:

```typescript
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Validate token on mount
    if (token) {
      validateToken();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, token, ... }}>
      {children}
    </AuthContext.Provider>
  );
}
```

---

### Task State

Managed via `useTasks` hook:

```typescript
const [tasks, setTasks] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const createTask = async (taskData) => {
  setLoading(true);
  try {
    const newTask = await tasksService.createTask(taskData);
    setTasks([...tasks, newTask]);
    return newTask;
  } catch (err) {
    setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};
```

---

### Schedule State

Managed via `useSchedule` hook:

```typescript
const [schedules, setSchedules] = useState([]);
const [loading, setLoading] = useState(false);
const [selectedDate, setSelectedDate] = useState(new Date());

const getSchedulesByDate = (date) => {
  return schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.start_time);
    return scheduleDate.toDateString() === date.toDateString();
  });
};
```

---

## Best Practices

1. **Component Composition**: Build complex UIs from simple, reusable components
2. **Separation of Concerns**: Keep components focused on single responsibility
3. **Props Drilling**: Avoid deep prop drilling; use context for global state
4. **Error Handling**: Always handle API errors gracefully
5. **Loading States**: Provide visual feedback during async operations
6. **Type Safety**: Use TypeScript for prop and state types
7. **Accessibility**: Include ARIA labels and semantic HTML
8. **Performance**: Memoize expensive computations with `useMemo`
9. **Testing**: Write unit tests for components and hooks
10. **Documentation**: Keep component prop documentation up-to-date

---

## Common Patterns

### Fetching Data on Mount

```tsx
useEffect(() => {
  fetchData();
}, []);
```

### Conditional Rendering

```tsx
{loading ? <Spinner /> : tasks.length > 0 ? <TaskList /> : <EmptyState />}
```

### Form Validation

```tsx
const errors = validateForm(formData);
if (Object.keys(errors).length > 0) {
  setErrors(errors);
  return;
}
```

### API Error Handling

```tsx
try {
  await apiCall();
} catch (error) {
  if (error.status === 401) {
    // Handle unauthorized
  } else if (error.status === 400) {
    // Handle bad request
  }
}
```

---

**For more information about the API, see [API.md](./API.md)**

**For general setup instructions, see [README.md](./README.md)**
