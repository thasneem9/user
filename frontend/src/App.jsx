import { RecoilRoot, useRecoilValue } from 'recoil';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { userAtom } from './atoms/userAtom.js';
import AuthPage from './pages/AuthPage';
import Home from './components/Home.jsx';

function AppRoutes() {
  const user = useRecoilValue(userAtom);
  return (
     <Routes>
      <Route path="/" element={user ? <Home /> : <Navigate to="/auth" replace />}/>
      <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" replace />}/>
      <Route path="*" element={<Navigate to={user ? '/' : '/auth'} replace />}/>
    </Routes>
  );
}

export default function App() {
  return (
    <RecoilRoot>
      <Router>
        <AppRoutes />
      </Router>
    </RecoilRoot>
  );
}
