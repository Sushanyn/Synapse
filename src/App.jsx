import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import { Auth, Canvas, ErrorPage, Home, Kanban } from './pages';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>; 
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path='/' element={<Navigate to={user ? "/home" : "/auth"} replace />} />
        <Route path='/home' element={user ? <Home /> : <Navigate to="/auth" replace />} />
        <Route path='/canvas' element={user ? <Canvas /> : <Navigate to="/auth" replace />} />
        <Route path='/kanban' element={user ? <Kanban /> : <Navigate to="/auth" replace />} />
        <Route path='/auth' element={!user ? <Auth /> : <Navigate to="/home" replace />} /> 
        <Route path='*' element={<ErrorPage />} />
      </Route>
    </Routes>
  );
}