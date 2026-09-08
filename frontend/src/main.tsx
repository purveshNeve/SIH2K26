import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './context/authContext';
import NotFound from './pages/NotFound';
import './index.css';

const LoginPage = React.lazy(() => import('./app/login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Projects = React.lazy(() => import('./pages/Projects'));
const ProjectDetails = React.lazy(() => import('./pages/ProjectDetails'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const ModelIntelligence = React.lazy(() => import('./pages/ModelIntelligence'));

function RouteLoading() {
  return <div className="route-loading" role="status" aria-live="polite"><div className="loading-orbit" /><span>Loading workspace...</span></div>;
}

export function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>Checking secure session...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

export function PublicLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>Checking secure session...</div>;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

const router = createBrowserRouter([
  { element: <PublicLayout />, children: [{ path: '/login', element: <LoginPage /> }] },
  {
    element: <ProtectedLayout />,
    children: [{
      element: <App />,
      children: [
        { index: true, element: <Navigate to="/dashboard" replace /> },
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'projects', element: <Projects /> },
        { path: 'projects/:projectId', element: <ProjectDetails /> },
        { path: 'analytics', element: <Analytics /> },
        { path: 'model-intelligence', element: <ModelIntelligence /> },
        { path: 'predictions', element: <Navigate to="/model-intelligence" replace /> },
        { path: 'risk', element: <Navigate to="/analytics" replace /> },
        { path: 'alerts', element: <Navigate to="/projects?view=alerts" replace /> },
        { path: 'benchmarking', element: <Navigate to="/analytics" replace /> },
        { path: 'cuf', element: <Navigate to="/model-intelligence#drivers" replace /> },
        { path: 'explorer', element: <Navigate to="/projects" replace /> },
      ],
    }],
  },
  { path: '*', element: <NotFound /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <Suspense fallback={<RouteLoading />}>
        <RouterProvider router={router} />
      </Suspense>
    </AuthProvider>
  </React.StrictMode>,
);
