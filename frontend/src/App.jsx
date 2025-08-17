
import {Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './Layout/DashboardLayout'
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Income from './pages/Income.jsx';
import Expense from './pages/Expense.jsx';
import Budget from './pages/Budget.jsx';
import Report from './pages/Report.jsx'
import UserContextProvider from './context/UserContext.jsx';

const App = () => {

  return (

   <UserContextProvider>

    <div className='h-screen'>
        
           <Routes>

              <Route path="/" element = {<Root />}/>
              <Route path="/login" element = {<Login />}/>

              <Route element={<DashboardLayout/>}>
                 <Route path="/Dashboard" element={<Dashboard />} />
                 <Route path="/Income" element={<Income />} />
                 <Route path="/Expense" element={<Expense />} />
                 <Route path="/budget" element={<Budget />} />
                 <Route path="/report" element={<Report />} />
              </Route>
          

           </Routes>
        
    </div>
    </UserContextProvider>
  )
}

const Root = () => {

   const storedToken = localStorage.getItem('token')

   return storedToken ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;

}

export default App