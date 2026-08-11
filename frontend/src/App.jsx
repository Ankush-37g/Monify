
import {Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './Layout/DashboardLayout'
import Login from './pages/Login.jsx';
import {Suspense, lazy ,useContext} from 'react';
import UserContextProvider from './context/UserContext.jsx';
import LandingPage from './pages/LandingPage.jsx';
import { ToastContainer } from "react-toastify";
import LoadingSpinner from './components/LoadingSpinner.jsx';

import { UserContext } from './context/UserContext.jsx';

const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Income = lazy(() => import('./pages/Income.jsx'));
const Expense = lazy(() => import('./pages/Expense.jsx'));
const Budget = lazy(() => import('./pages/Budget.jsx'));
const Report = lazy(() => import('./pages/Report.jsx'));
const AiAssistant = lazy(() => import('./pages/AiAssistant.jsx'));

const AppContent = () => {

  const { isLoading,user } = useContext(UserContext);

  const localUser = localStorage.getItem("user");
  const currentUser = user || (localUser ? JSON.parse(localUser) : null);
  
  return (
    <div className='h-screen'>
      {isLoading && <LoadingSpinner />}

      <Suspense fallback={<LoadingSpinner />}>

          <Routes>
            
              <Route
                path="/" element={<LandingPage />}
              />
              <Route
                path="/login"
                element={
                  currentUser ? <Navigate to="/dashboard" replace /> : <Login />
                }
              />

              <Route
                element={
                  currentUser ? <DashboardLayout /> : <Navigate to="/" replace />
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/income" element={<Income />} />
                <Route path="/expense" element={<Expense />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/ai-assistant" element={<AiAssistant />} />
                
              </Route>

          </Routes>

      </Suspense>

      <ToastContainer position="top-right" autoClose={3000} />

    </div>
  );
};

const App = () => {
  return (
    <UserContextProvider>
      <AppContent />
    </UserContextProvider>
  );
};
export default App