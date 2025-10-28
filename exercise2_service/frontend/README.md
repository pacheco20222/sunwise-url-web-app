# Frontend - React TypeScript URL Shortener# React + TypeScript + Vite



This is the frontend application for the URL Shortener, built with React 19, TypeScript, and Material-UI.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



## Table of ContentsCurrently, two official plugins are available:



- [Technology Stack](#technology-stack)- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- [Project Structure](#project-structure)- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- [Components](#components)

- [Pages](#pages)## React Compiler

- [State Management](#state-management)

- [API Integration](#api-integration)The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- [Routing](#routing)

- [Styling](#styling)## Expanding the ESLint configuration

- [Configuration](#configuration)

- [Development](#development)If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

- [Building for Production](#building-for-production)

```js

## Technology Stackexport default defineConfig([

  globalIgnores(['dist']),

- **React 19.1.1**: UI library  {

- **TypeScript 5.7.3**: Type-safe JavaScript    files: ['**/*.{ts,tsx}'],

- **Vite 7.1.12**: Build tool and dev server    extends: [

- **Material-UI (MUI) 6.3.3**: Component library      // Other configs...

- **React Router 7.1.4**: Client-side routing

- **Axios 1.7.9**: HTTP client      // Remove tseslint.configs.recommended and replace with this

- **date-fns 4.1.0**: Date formatting utilities      tseslint.configs.recommendedTypeChecked,

      // Alternatively, use this for stricter rules

## Project Structure      tseslint.configs.strictTypeChecked,

      // Optionally, add this for stylistic rules

```      tseslint.configs.stylisticTypeChecked,

frontend/

├── src/      // Other configs...

│   ├── api/    ],

│   │   └── index.ts          # API client with axios configuration    languageOptions: {

│   │      parserOptions: {

│   ├── components/        project: ['./tsconfig.node.json', './tsconfig.app.json'],

│   │   ├── Navbar.tsx        # Navigation bar component        tsconfigRootDir: import.meta.dirname,

│   │   └── ProtectedRoute.tsx # Auth-protected route wrapper      },

│   │      // other options...

│   ├── contexts/    },

│   │   └── AuthContext.tsx   # Global authentication state  },

│   │])

│   ├── pages/```

│   │   ├── PublicHome.tsx    # Landing page (all public URLs)

│   │   ├── Login.tsx         # User login pageYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

│   │   ├── Register.tsx      # User registration page

│   │   ├── Dashboard.tsx     # User's URL management```js

│   │   └── BulkUpload.tsx    # Bulk URL upload page// eslint.config.js

│   │import reactX from 'eslint-plugin-react-x'

│   ├── App.tsx               # Root component with routingimport reactDom from 'eslint-plugin-react-dom'

│   ├── main.tsx              # Application entry point

│   └── vite-env.d.ts         # Vite type declarationsexport default defineConfig([

│  globalIgnores(['dist']),

├── public/  {

│   └── vite.svg              # Favicon    files: ['**/*.{ts,tsx}'],

│    extends: [

├── index.html                # HTML template      // Other configs...

├── package.json              # Dependencies and scripts      // Enable lint rules for React

├── tsconfig.json             # TypeScript configuration      reactX.configs['recommended-typescript'],

├── vite.config.ts            # Vite configuration      // Enable lint rules for React DOM

├── nginx.conf                # Production nginx config      reactDom.configs.recommended,

└── Dockerfile                # Docker build configuration    ],

```    languageOptions: {

      parserOptions: {

## Components        project: ['./tsconfig.node.json', './tsconfig.app.json'],

        tsconfigRootDir: import.meta.dirname,

### Navbar.tsx      },

      // other options...

The navigation bar component that adapts based on authentication state.    },

  },

**Features:**])

- Displays app title with link to home```

- Shows different buttons based on authentication:
  - **Not logged in**: "Login / Register for Private URLs"
  - **Logged in**: "Dashboard", "Bulk Upload", "Logout"
- Uses Material-UI AppBar, Toolbar, and Button components
- Integrates with AuthContext for user state

**Props:** None (uses AuthContext)

**Usage:**
```tsx
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      {/* Page content */}
    </>
  );
}
```

### ProtectedRoute.tsx

A wrapper component that protects routes requiring authentication.

**Features:**
- Checks authentication state from AuthContext
- Redirects unauthenticated users to login page
- Preserves the attempted URL for post-login redirect
- Shows nothing while authentication is loading

**Props:**
```tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
}
```

**Usage:**
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

## Pages

### PublicHome.tsx

The landing page showing all public URLs.

**Features:**
- Displays all public URLs in a Material-UI Table
- Public URL shortening form (no login required)
- Shows short code, original URL, owner, views, and creation date
- Direct links to shortened URLs
- Button to access login for creating private URLs
- Real-time URL count display

**State:**
```tsx
const [urls, setUrls] = useState<URL[]>([]);
const [originalUrl, setOriginalUrl] = useState('');
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState({ text: '', type: '' });
```

**Key Functions:**
- `fetchUrls()`: Loads all public URLs from API
- `handleShorten()`: Creates new public URL
- Formats dates using `date-fns`

### Login.tsx

User login page with form validation.

**Features:**
- Username and password input fields
- Form validation (required fields)
- Error message display
- Link to registration page
- Redirects to dashboard on successful login
- Updates AuthContext with user data

**State:**
```tsx
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
```

**API Integration:**
```tsx
const response = await authAPI.login(username, password);
login(response.data.user, response.data.access, response.data.refresh);
```

### Register.tsx

User registration page with validation.

**Features:**
- Username, email, password, and confirm password fields
- Client-side validation:
  - Username: 3-30 characters, alphanumeric only
  - Email: Valid email format
  - Password: 8+ characters, at least one number
  - Confirm password must match
- Real-time error display
- Link to login page
- Automatic login after registration

**State:**
```tsx
const [formData, setFormData] = useState({
  username: '',
  email: '',
  password: '',
  password2: ''
});
const [errors, setErrors] = useState<Record<string, string>>({});
```

**Validation Logic:**
```tsx
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};
  
  if (formData.username.length < 3 || formData.username.length > 30) {
    newErrors.username = 'Username must be 3-30 characters';
  }
  
  if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Invalid email format';
  }
  
  if (formData.password.length < 8) {
    newErrors.password = 'Password must be at least 8 characters';
  }
  
  if (formData.password !== formData.password2) {
    newErrors.password2 = 'Passwords do not match';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### Dashboard.tsx

Main user dashboard for managing URLs.

**Features:**
- Displays user's own URLs (public and private)
- URL shortening form with private URL toggle
- Edit and delete actions for each URL
- Real-time analytics (view counts)
- Responsive data table
- Loading states and error handling
- Live URL count updates

**State:**
```tsx
const [urls, setUrls] = useState<URL[]>([]);
const [originalUrl, setOriginalUrl] = useState('');
const [isPrivate, setIsPrivate] = useState(false);
const [editingId, setEditingId] = useState<number | null>(null);
const [editUrl, setEditUrl] = useState('');
const [message, setMessage] = useState({ text: '', type: '' });
```

**Key Functions:**
- `fetchUrls()`: Loads authenticated user's URLs
- `handleShorten()`: Creates new URL (public or private)
- `handleEdit()`: Updates existing URL
- `handleDelete()`: Deletes URL with confirmation
- `copyToClipboard()`: Copies short URL to clipboard

**Table Columns:**
- Short Code (with copy button)
- Original URL
- Type (Public/Private badge)
- Views
- Created Date
- Actions (Edit/Delete buttons)

### BulkUpload.tsx

Page for uploading multiple URLs at once.

**Features:**
- File upload form (.txt files only)
- Private URL toggle for entire batch
- Upload progress indicator
- Results display:
  - Successful URLs with short codes
  - Failed URLs with error messages
  - Summary statistics
- Download results as JSON
- Link to sample file

**State:**
```tsx
const [file, setFile] = useState<File | null>(null);
const [isPrivate, setIsPrivate] = useState(false);
const [uploading, setUploading] = useState(false);
const [results, setResults] = useState<BulkUploadResult | null>(null);
```

**File Upload:**
```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!file) {
    alert('Please select a file');
    return;
  }
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('is_private', isPrivate.toString());
  
  const response = await urlAPI.bulkUpload(formData);
  setResults(response.data);
};
```

**Results Display:**
- Green success section with copyable short URLs
- Red failure section with error descriptions
- Summary card showing total/successful/failed counts

## State Management

### AuthContext

Global authentication state using React Context API.

**Provider:**
```tsx
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);
  
  const login = (userData: User, accessToken: string, refreshToken: string) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  };
  
  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await authAPI.logout(refreshToken);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**Usage:**
```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, loading, login, logout } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;
  
  return <div>Welcome, {user.username}!</div>;
}
```

**LocalStorage Keys:**
- `user`: JSON string of user object
- `access_token`: JWT access token
- `refresh_token`: JWT refresh token

## API Integration

### API Client Configuration

Located in `src/api/index.ts`

**Axios Instance:**
```tsx
const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Request Interceptor:**
Automatically adds JWT token to requests:

```tsx
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

**Response Interceptor:**
Handles token refresh on 401 errors:

```tsx
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/accounts/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Token refresh failed, logout user
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);
```

### API Methods

**Authentication:**
```tsx
export const authAPI = {
  register: (userData: RegisterData) => api.post('/accounts/register/', userData),
  login: (username: string, password: string) => api.post('/accounts/login/', { username, password }),
  logout: (refresh: string) => api.post('/accounts/logout/', { refresh }),
};
```

**URL Shortening:**
```tsx
export const urlAPI = {
  list: () => api.get('/urlshortener/urls/'),
  create: (data: CreateURLData) => api.post('/urlshortener/shorten/', data),
  update: (id: number, data: Partial<CreateURLData>) => api.put(`/urlshortener/urls/${id}/`, data),
  delete: (id: number) => api.delete(`/urlshortener/urls/${id}/`),
  bulkUpload: (formData: FormData) => api.post('/urlshortener/bulk-upload/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};
```

## Routing

### Route Configuration

Located in `App.tsx` using React Router v7:

```tsx
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<PublicHome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/bulk-upload"
            element={
              <ProtectedRoute>
                <BulkUpload />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
```

**Route List:**
- `/` - Public home page (no auth required)
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - User dashboard (protected)
- `/bulk-upload` - Bulk upload page (protected)

## Styling

### Material-UI Theme

The app uses Material-UI's default theme with custom configurations.

**Global Styles:**
```tsx
<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
  {/* Content */}
</Container>
```

**Common Patterns:**

**Success Message:**
```tsx
{message.type === 'success' && (
  <Alert severity="success" sx={{ mb: 2 }}>
    {message.text}
  </Alert>
)}
```

**Error Message:**
```tsx
{message.type === 'error' && (
  <Alert severity="error" sx={{ mb: 2 }}>
    {message.text}
  </Alert>
)}
```

**Loading Button:**
```tsx
<Button
  type="submit"
  variant="contained"
  disabled={loading}
>
  {loading ? <CircularProgress size={24} /> : 'Submit'}
</Button>
```

**Data Table:**
```tsx
<TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Column</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {data.map((item) => (
        <TableRow key={item.id}>
          <TableCell>{item.value}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
```

### Responsive Design

Uses Material-UI's responsive utilities:

```tsx
<Box sx={{ display: { xs: 'none', md: 'block' } }}>
  {/* Hidden on mobile, visible on desktop */}
</Box>
```

Breakpoints:
- `xs`: 0-600px (mobile)
- `sm`: 600-900px (tablet)
- `md`: 900-1200px (small desktop)
- `lg`: 1200-1536px (desktop)
- `xl`: 1536px+ (large desktop)

## Configuration

### Environment Variables

Create `.env` file in frontend directory:

```env
VITE_API_URL=http://localhost:8000/api
```

**Usage in Code:**
```tsx
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
```

### Vite Configuration

Located in `vite.config.ts`:

```tsx
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
});
```

### TypeScript Configuration

Located in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Development

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   Create `.env` with API URL

3. **Start development server:**
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173`

### Available Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

### Hot Module Replacement

Vite provides instant hot module replacement (HMR):
- Changes to `.tsx` files are reflected immediately
- React component state is preserved when possible
- CSS changes apply without page reload

## Building for Production

### Local Build

1. **Build the app:**
   ```bash
   npm run build
   ```

This creates optimized production files in the `dist/` directory.

2. **Preview production build:**
   ```bash
   npm run preview
   ```

### Docker Build

The Dockerfile uses multi-stage build:

**Stage 1: Build**
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
```

**Stage 2: Production**
```dockerfile
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

Located in `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Serve React app
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

This configuration:
- Serves the React app on port 80
- Handles client-side routing (SPA)
- Proxies `/api` requests to the backend

### Build Optimization

Vite automatically:
- Minifies JavaScript and CSS
- Tree-shakes unused code
- Splits code into chunks for faster loading
- Optimizes images
- Generates source maps for debugging

**Build Output:**
```
dist/
├── assets/
│   ├── index-abc123.js
│   ├── index-abc123.css
│   └── vendor-xyz789.js
├── index.html
└── vite.svg
```

## Troubleshooting

### Common Issues

**API Connection Errors:**
- Check `VITE_API_URL` in `.env`
- Ensure backend is running on correct port
- Check CORS settings in backend

**Authentication Issues:**
- Clear localStorage and try logging in again
- Check token expiration
- Verify backend JWT configuration

**Build Errors:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check TypeScript errors: `npm run build`

**Hot Reload Not Working:**
- Restart Vite dev server
- Check file system watcher limits (Linux)
- Disable browser extensions

## Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vite.dev/)
- [Material-UI Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)

## Support

For questions or issues, please contact the project maintainer or create an issue in the repository.
