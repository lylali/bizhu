import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Character from './pages/Character';

function AppContent(): JSX.Element {
  const navigate = useNavigate();

  // 处理全局 401 未授权事件
  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem('auth_token');
      navigate('/login', { replace: true });
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [navigate]);

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/editor/:workId" element={<Editor />} />
      <Route path="/character/:workId" element={<Character />} />
      <Route path="/login" element={<div>登录页面（待实现）</div>} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
