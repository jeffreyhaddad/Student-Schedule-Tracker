# Student Tracker - Frontend

React + Vite frontend.

## 🏗️ Architecture

Service → Hook → Component → Page pattern:

```
src/
├── services/          # API communication layer
│   ├── authService.js
│   ├── scheduleEntryService.js
│   └── taskService.js
├── hooks/            # Custom React hooks for state management
│   ├── useAuth.js
│   ├── useScheduleEntries.js
│   └── useTasks.js
├── pages/            # Page components
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── Dashboard.jsx
│   ├── TasksPage.jsx
│   └── SchedulePage.jsx
├── components/       # Reusable UI components
│   ├── TaskCard.jsx
│   ├── TaskForm.jsx
│   ├── ScheduleCard.jsx
│   └── ScheduleEntryForm.jsx
└── App.jsx          # Main app with routing
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Configure API URL
cp .env.example .env.local
# Edit VITE_API_BASE_URL=http://localhost:4000

# Run development server
npm run dev
```

Visit `http://localhost:5173`

## � Authentication

Session-based authentication with localStorage:

1. User logs in → receives session ID from backend
2. Session ID stored in `localStorage.setItem('sessionId', id)`
3. All API requests include `X-Session-Id` header
4. Protected routes check `localStorage.getItem('sessionId')`

### Auth Flow Example

```javascript
// Login
const user = await authService.login(username, password);
// → stores sessionId in localStorage

// Make authenticated request
const tasks = await taskService.getTasks();
// → automatically includes X-Session-Id header

// Logout
await authService.logout();
// → clears localStorage
```

## 📖 Available Routes

- `/` - Redirects to dashboard or login
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Main dashboard (protected)
- `/tasks` - Tasks page (protected)
- `/schedule` - Schedule page (protected)

## 🎨 Component Structure

See [COMPONENTS.md](./COMPONENTS.md) for detailed component documentation.

### Pattern: Services → Hooks → Components

**Services** handle API calls:
```javascript
// taskService.js
export const getTasks = async () => { ... }
```

**Hooks** manage state and side effects:
```javascript
// useTasks.js
const [tasks, setTasks] = useState([]);
const fetchTasks = useCallback(async () => { ... });
```

**Components** use hooks for data:
```javascript
// TasksPage.jsx
const { tasks, loading, createTask } = useTasks();
```

## 🛠️ Development

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Lint code
```

## 📦 Dependencies

- **React** (19.1.1) - UI library
- **React Router DOM** (7.9.4) - Routing
- **Vite** (7.1.7) - Build tool

## 📚 More Info

- **Main README**: [../README.md](../README.md)
- **Setup Guide**: [../SETUP.md](../SETUP.md)
- **API Reference**: [../API.md](../API.md)
- **Components**: [COMPONENTS.md](./COMPONENTS.md)
