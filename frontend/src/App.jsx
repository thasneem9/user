import { RecoilRoot, useRecoilValue } from 'recoil';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { userAtom } from './atoms/userAtom.js';
import AuthPage from './pages/AuthPage';
import Home from './components/Home.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function AppRoutes() {
  const user = useRecoilValue(userAtom);
  return (
     <Routes>
      <Route path="/" element={user ? <Home /> : <Navigate to="/auth" replace />}/>
    <Route path="/auth" element={ <AuthPage /> }/>
    <Route path="*" element={<Navigate to={user ? '/' : '/auth'} replace />}/>
    </Routes>
  );
}

export default function App() {
  return (
    <RecoilRoot>
      <Router>
        <AppRoutes />
          <ToastContainer position="top-center" autoClose={1000} />
      </Router>
    </RecoilRoot>
  );
}
